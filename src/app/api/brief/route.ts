import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { canGenerateBrief } from '@/lib/tiers';
import type { TierName } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { opportunityId, userId } = await request.json();

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'opportunityId is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // If userId provided, enforce tier limits
    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('tier')
        .eq('id', userId)
        .single();

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Count briefs this month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { count: briefsThisMonth } = await supabase
        .from('usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('action', 'brief_generated')
        .gte('created_at', monthStart.toISOString());

      if (!canGenerateBrief(user.tier as TierName, briefsThisMonth || 0)) {
        return NextResponse.json(
          { error: 'Brief generation limit reached for your tier' },
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
