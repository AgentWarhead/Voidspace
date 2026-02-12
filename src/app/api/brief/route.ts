import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidUUID } from '@/lib/auth/validate';
import { canGenerateBrief } from '@/lib/tiers';
import { checkBalance, deductCredits, estimateCreditCost } from '@/lib/credits';
import type { TierName } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`brief:${ip}`, 5, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = getAuthenticatedUser(request);
    const userId = auth?.userId || null;

    const { opportunityId, customIdea } = await request.json();

    // Validate: require EITHER opportunityId OR customIdea, not both, not neither
    const hasOpportunity = opportunityId && isValidUUID(opportunityId);
    const hasCustomIdea = typeof customIdea === 'string' && customIdea.trim().length > 0;

    if (!hasOpportunity && !hasCustomIdea) {
      return NextResponse.json(
        { error: 'Either a valid opportunityId or a customIdea is required' },
        { status: 400 }
      );
    }

    if (hasOpportunity && hasCustomIdea) {
      return NextResponse.json(
        { error: 'Provide either opportunityId or customIdea, not both' },
        { status: 400 }
      );
    }

    if (hasCustomIdea && customIdea.trim().length > 2000) {
      return NextResponse.json(
        { error: 'customIdea must be 2000 characters or less' },
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

      // Primary gate: credit balance check
      // Estimate ~1500 input + ~2500 output tokens for a brief generation
      const estimatedCost = estimateCreditCost(1500, 2500);
      const hasCredits = await checkBalance(userId, estimatedCost);
      if (!hasCredits) {
        return NextResponse.json(
          { error: 'Insufficient credits. Top up your Sanctum balance to generate briefs.' },
          { status: 402 }
        );
      }
    }

    // Call the Supabase Edge Function (which has the ANTHROPIC_API_KEY secret)
    const { data, error } = await supabase.functions.invoke('generate-brief', {
      body: {
        opportunityId: hasOpportunity ? opportunityId : null,
        userId,
        customIdea: hasCustomIdea ? customIdea.trim() : null,
      },
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

    // Log usage and deduct credits
    if (userId) {
      const usageRecord: Record<string, unknown> = {
        user_id: userId,
        action: 'brief_generated',
      };
      if (hasOpportunity) {
        usageRecord.opportunity_id = opportunityId;
      }
      const { error: usageError } = await supabase.from('usage').insert(usageRecord);
      if (usageError) {
        console.error('Failed to log usage:', usageError.message, usageError.details);
      }

      // Deduct credits based on actual usage if available, otherwise estimate
      const inputTokens = data?.usage?.input_tokens || 1500;
      const outputTokens = data?.usage?.output_tokens || 2500;
      const creditCost = estimateCreditCost(inputTokens, outputTokens);
      
      const deduction = await deductCredits(userId, creditCost, 'Brief generation', {
        tokensInput: inputTokens,
        tokensOutput: outputTokens,
      });
      if (!deduction.success) {
        console.error('Failed to deduct credits for brief:', deduction.error);
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
