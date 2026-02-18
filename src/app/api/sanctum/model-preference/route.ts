import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { createAdminClient } from '@/lib/supabase/admin';
import { SANCTUM_TIERS, isModelAvailable, type SanctumTier } from '@/lib/sanctum-tiers';

/**
 * GET /api/sanctum/model-preference
 * Returns the user's current preferred model
 */
export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data } = await supabase
    .from('credit_balances')
    .select('preferred_model')
    .eq('user_id', user.userId)
    .single();

  // Get user tier for available models
  const { data: userSub } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', user.userId)
    .single();
  const userTier: SanctumTier = (userSub?.tier as SanctumTier) || 'shade';
  const tierConfig = SANCTUM_TIERS[userTier];

  return NextResponse.json({
    preferredModel: data?.preferred_model || null,
    defaultModel: tierConfig.aiModel,
    availableModels: tierConfig.availableModels,
    tier: userTier,
  });
}

/**
 * POST /api/sanctum/model-preference
 * Save the user's preferred model. Validates against tier's available models.
 */
export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { modelId } = await request.json();

  if (!modelId || typeof modelId !== 'string') {
    return NextResponse.json({ error: 'modelId is required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get user tier
  const { data: userSub } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', user.userId)
    .single();
  const userTier: SanctumTier = (userSub?.tier as SanctumTier) || 'shade';

  // Validate model is available for this tier
  if (!isModelAvailable(userTier, modelId)) {
    return NextResponse.json(
      { error: 'Model not available for your tier', availableModels: SANCTUM_TIERS[userTier].availableModels },
      { status: 403 }
    );
  }

  // Upsert the preference into credit_balances (which always exists for active users)
  const { error } = await supabase
    .from('credit_balances')
    .update({ preferred_model: modelId })
    .eq('user_id', user.userId);

  if (error) {
    // If no row exists yet, try upsert
    const { error: upsertError } = await supabase
      .from('credit_balances')
      .upsert({
        user_id: user.userId,
        subscription_credits: 0,
        topup_credits: 0,
        preferred_model: modelId,
      }, { onConflict: 'user_id' });

    if (upsertError) {
      return NextResponse.json({ error: 'Failed to save preference' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, modelId });
}
