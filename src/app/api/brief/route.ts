import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidUUID } from '@/lib/auth/validate';
import { canGenerateBrief } from '@/lib/tiers';
import type { TierName } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`brief:${ip}`, 5, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = getAuthenticatedUser(request);
    const userId = auth?.userId || null;

    const { opportunityId } = await request.json();

    if (!opportunityId || !isValidUUID(opportunityId)) {
      return NextResponse.json(
        { error: 'Valid opportunityId is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Anti-abuse: IP-based monthly cap for free tier (5 generations/IP/month)
    const FREE_TIER_IP_MONTHLY_CAP = 5;
    const monthlyIpKey = `brief-monthly:${ip}:${new Date().getFullYear()}-${new Date().getMonth()}`;
    const ipCheck = rateLimit(monthlyIpKey, FREE_TIER_IP_MONTHLY_CAP, 31 * 24 * 60 * 60 * 1000);

    // If authenticated, enforce tier limits
    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('tier')
        .eq('id', userId)
        .single();

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const tier = user.tier as TierName;

      // All tiers now use monthly limits
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('action', 'brief_generated')
        .gte('created_at', monthStart.toISOString());
      const briefCount = count || 0;

      // For free tier, also enforce IP-based cap (prevents multi-wallet abuse)
      if (tier === 'shade' && !ipCheck.allowed) {
        return NextResponse.json(
          { error: 'Monthly generation limit reached. Try again next month or upgrade for more briefs.' },
          { status: 429 }
        );
      }

      if (!canGenerateBrief(tier, briefCount)) {
        const message = tier === 'shade'
          ? 'You\u2019ve used your 3 free mission briefs this month. Upgrade for more briefs or come back next month.'
          : 'Mission brief generation limit reached for your tier this month.';
        return NextResponse.json(
          { error: message },
          { status: 403 }
        );
      }
    }

    // Call the Supabase Edge Function (which has the ANTHROPIC_API_KEY secret)
    const { data, error } = await supabase.functions.invoke('generate-brief', {
      body: { opportunityId, userId },
    });

    if (error) {
      // error.context is a Response object — read the body for the actual error
      let errorMessage = 'Failed to generate brief';
      try {
        if (error.context && typeof error.context.json === 'function') {
          const errBody = await error.context.json();
          console.error('Edge Function error body:', errBody);
          errorMessage = errBody?.error || errorMessage;
        }
      } catch {
        console.error('Edge Function error (could not parse body):', error.message);
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    // Edge Function may return an error in the data body
    if (data?.error) {
      return NextResponse.json(
        { error: data.error },
        { status: 500 }
      );
    }

    // Log usage
    if (userId) {
      const { error: usageError } = await supabase.from('usage').insert({
        user_id: userId,
        action: 'brief_generated',
        opportunity_id: opportunityId,
      });
      if (usageError) {
        console.error('Failed to log usage:', usageError.message, usageError.details);
      }
    }

    return NextResponse.json({ brief: data });
  } catch (err) {
    console.error('Brief generation error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
