// ============================================================
// Stripe Webhook Handler
// Handles subscription lifecycle + top-up payments
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { addTopupCredits, resetMonthlyCredits } from '@/lib/credits';
import { getTierFromPriceId, getTopUpFromPriceId, type SanctumTier } from '@/lib/sanctum-tiers';

// Disable body parsing — Stripe needs raw body for signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      // ── Subscription created or updated ──────────────────
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) {
          console.warn('[Stripe Webhook] No userId in subscription metadata');
          break;
        }

        const firstItem = subscription.items.data[0];
        const priceId = firstItem?.price?.id;
        const tierConfig = priceId ? getTierFromPriceId(priceId) : null;
        const tier: SanctumTier = tierConfig?.tier || 'shade';

        const status = mapStripeStatus(subscription.status);

        // Period dates are on subscription items in newer Stripe API versions
        const periodStart = firstItem?.current_period_start
          ? new Date(firstItem.current_period_start * 1000).toISOString()
          : null;
        const periodEnd = firstItem?.current_period_end
          ? new Date(firstItem.current_period_end * 1000).toISOString()
          : null;

        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            tier,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            cancel_at_period_end: subscription.cancel_at_period_end,
          }, { onConflict: 'user_id' });

        console.log(`[Stripe Webhook] Subscription ${event.type} — user=${userId} tier=${tier} status=${status}`);
        break;
      }

      // ── Invoice paid (subscription renewal) ──────────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        // In newer Stripe API, subscription is nested under parent.subscription_details
        const subscriptionId = (
          invoice.parent?.subscription_details?.subscription
            ? (typeof invoice.parent.subscription_details.subscription === 'string'
                ? invoice.parent.subscription_details.subscription
                : invoice.parent.subscription_details.subscription.id)
            : null
        );

        if (!subscriptionId) break;

        // Find user by subscription ID
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id, tier')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        if (!sub) {
          console.warn(`[Stripe Webhook] No subscription found for ${subscriptionId}`);
          break;
        }

        // Reset monthly credits
        await resetMonthlyCredits(sub.user_id, sub.tier as SanctumTier);
        console.log(`[Stripe Webhook] Credits reset — user=${sub.user_id} tier=${sub.tier}`);
        break;
      }

      // ── Checkout session completed (top-ups) ─────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const type = session.metadata?.type;

        if (!userId) break;

        if (type === 'topup') {
          const credits = Number(session.metadata?.credits || 0);
          const packSlug = session.metadata?.packSlug || 'unknown';

          if (credits > 0) {
            await addTopupCredits(
              userId,
              credits,
              `Top-up: ${packSlug} pack ($${session.amount_total ? session.amount_total / 100 : 0})`
            );
            console.log(`[Stripe Webhook] Top-up added — user=${userId} credits=${credits} pack=${packSlug}`);
          }
        }

        // For subscriptions, the credit grant happens on invoice.paid
        break;
      }

      // ── Invoice payment failed ──────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (
          invoice.parent?.subscription_details?.subscription
            ? (typeof invoice.parent.subscription_details.subscription === 'string'
                ? invoice.parent.subscription_details.subscription
                : invoice.parent.subscription_details.subscription.id)
            : null
        );

        if (!subscriptionId) break;

        // Find user by subscription ID
        const { data: failedSub } = await supabase
          .from('subscriptions')
          .select('user_id, tier')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        if (!failedSub) {
          console.warn(`[Stripe Webhook] No subscription found for failed invoice ${subscriptionId}`);
          break;
        }

        // Mark subscription as past_due
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('user_id', failedSub.user_id);

        console.warn(`[Stripe Webhook] Payment failed — user=${failedSub.user_id} tier=${failedSub.tier} — marked past_due`);
        break;
      }

      // ── Subscription canceled ────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await supabase
          .from('subscriptions')
          .update({
            tier: 'shade',
            status: 'canceled',
            stripe_subscription_id: null,
            cancel_at_period_end: false,
          })
          .eq('user_id', userId);

        // Zero out subscription credits (top-ups preserved)
        await supabase
          .from('credit_balances')
          .update({ subscription_credits: 0 })
          .eq('user_id', userId);

        console.log(`[Stripe Webhook] Subscription canceled — user=${userId}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

function mapStripeStatus(status: Stripe.Subscription.Status): string {
  switch (status) {
    case 'active': return 'active';
    case 'past_due': return 'past_due';
    case 'canceled': return 'canceled';
    case 'trialing': return 'trialing';
    case 'incomplete': return 'incomplete';
    default: return 'active';
  }
}
