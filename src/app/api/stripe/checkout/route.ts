// ============================================================
// Stripe Checkout Session API
// Creates checkout sessions for subscriptions and top-up packs
// Server-side session authentication — never trusts client userId
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { SANCTUM_TIERS, TOPUP_PACKS, type SanctumTier } from '@/lib/sanctum-tiers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { createRateLimiter } from '@/lib/auth/rate-limit';

// Persistent rate limiter: 5 checkout attempts per minute per user
const checkoutLimiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

/**
 * Verify that the request Origin matches our site domain (CSRF protection).
 */
function verifyCsrf(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://voidspace.io';
  const siteDomain = new URL(siteUrl).origin;

  // Allow both www and non-www variants + localhost in dev
  const siteHost = new URL(siteUrl).hostname;
  const allowedOrigins = [
    siteDomain,
    `https://www.${siteHost}`,  // handle www variant
    `https://${siteHost.replace(/^www\./, '')}`,  // handle non-www variant
  ];
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
  }

  // Check origin first, fall back to referer
  if (origin) {
    return allowedOrigins.some((allowed) => origin === allowed);
  }
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      return allowedOrigins.some((allowed) => refererOrigin === allowed);
    } catch {
      return false;
    }
  }

  // No origin or referer — block
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // --- CSRF protection ---
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    // --- Authenticate via session cookie (never trust body) ---
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const session = verifySessionToken(sessionCookie);
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const userId = session.userId;

    // --- Rate limiting (per userId) ---
    const rl = checkoutLimiter.rateLimit(`checkout:${userId}`);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many checkout requests. Please wait.' }, { status: 429 });
    }

    // --- Parse body (userId is intentionally ignored from body) ---
    const body = await request.json();
    const { type, tier, packSlug, billingPeriod = 'monthly' } = body as {
      type: 'subscription' | 'topup';
      tier?: SanctumTier;
      packSlug?: string;
      billingPeriod?: 'monthly' | 'annual';
    };

    const stripe = getStripe();
    const supabase = createAdminClient();

    // Get user info
    const { data: user } = await supabase
      .from('users')
      .select('id, near_account_id, email, tier')
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
          tier: 'shade',
          status: 'active',
        }, { onConflict: 'user_id' });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://voidspace.io';

    if (type === 'subscription' && tier) {
      const tierConfig = SANCTUM_TIERS[tier];
      if (!tierConfig || tier === 'shade') {
        return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
      }

      // Prevent subscribing to the same tier the user is already on
      if (user.tier === tier) {
        return NextResponse.json(
          { error: `You are already subscribed to the ${tierConfig.name} tier` },
          { status: 400 }
        );
      }

      const priceId = billingPeriod === 'annual'
        ? tierConfig.stripePriceIdAnnual
        : tierConfig.stripePriceIdMonthly;

      if (!priceId) {
        return NextResponse.json({ error: 'Stripe price not configured for this tier' }, { status: 400 });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
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

      return NextResponse.json({ url: checkoutSession.url });
    }

    if (type === 'topup' && packSlug) {
      const pack = TOPUP_PACKS.find(p => p.slug === packSlug);
      if (!pack) {
        return NextResponse.json({ error: 'Invalid top-up pack' }, { status: 400 });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
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

      return NextResponse.json({ url: checkoutSession.url });
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
