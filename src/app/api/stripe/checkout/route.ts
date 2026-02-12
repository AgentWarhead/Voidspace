// ============================================================
// Stripe Checkout Session API
// Creates checkout sessions for subscriptions and top-up packs
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { SANCTUM_TIERS, TOPUP_PACKS, type SanctumTier } from '@/lib/sanctum-tiers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, tier, packSlug, billingPeriod = 'monthly' } = body as {
      userId: string;
      type: 'subscription' | 'topup';
      tier?: SanctumTier;
      packSlug?: string;
      billingPeriod?: 'monthly' | 'annual';
    };

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const stripe = getStripe();
    const supabase = createAdminClient();

    // Get user info
    const { data: user } = await supabase
      .from('users')
      .select('id, near_account_id, email')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string = '';
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscription?.stripe_customer_id) {
      stripeCustomerId = subscription.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          userId: user.id,
          nearAccountId: user.near_account_id,
        },
      });
      stripeCustomerId = customer.id;

      // Save customer ID
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          tier: 'free',
          status: 'active',
        }, { onConflict: 'user_id' });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://voidspace.io';

    if (type === 'subscription' && tier) {
      const tierConfig = SANCTUM_TIERS[tier];
      if (!tierConfig || tier === 'free') {
        return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
      }

      const priceId = billingPeriod === 'annual'
        ? tierConfig.stripePriceIdAnnual
        : tierConfig.stripePriceIdMonthly;

      if (!priceId) {
        return NextResponse.json({ error: 'Stripe price not configured for this tier' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/sanctum?checkout=success`,
        cancel_url: `${baseUrl}/pricing?checkout=canceled`,
        allow_promotion_codes: true,
        tax_id_collection: { enabled: true },
        metadata: {
          userId,
          type: 'subscription',
          tier,
          billingPeriod,
        },
        subscription_data: {
          metadata: {
            userId,
            tier,
          },
        },
      });

      return NextResponse.json({ url: session.url });
    }

    if (type === 'topup' && packSlug) {
      const pack = TOPUP_PACKS.find(p => p.slug === packSlug);
      if (!pack) {
        return NextResponse.json({ error: 'Invalid top-up pack' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: pack.stripePriceId, quantity: 1 }],
        success_url: `${baseUrl}/sanctum?topup=success`,
        cancel_url: `${baseUrl}/pricing?topup=canceled`,
        metadata: {
          userId,
          type: 'topup',
          packSlug: pack.slug,
          credits: String(pack.credits),
        },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('[Stripe Checkout] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
