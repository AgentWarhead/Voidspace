import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';

/**
 * GET /api/sanctum/model-preference
 * Returns the user's tier info and available models.
 * Model preference is now stored client-side (localStorage).
 */
export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabase = createAdminClient();

    const { data: userSub } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.userId)
      .single();
    const userTier: SanctumTier = (userSub?.tier as SanctumTier) || 'shade';
    const tierConfig = SANCTUM_TIERS[userTier];

    return NextResponse.json({
      preferredModel: null, // Now client-managed via localStorage
      defaultModel: tierConfig.aiModel,
      availableModels: tierConfig.availableModels,
      tier: userTier,
    });
  } catch {
    // Graceful fallback if DB is unreachable
    return NextResponse.json({
      preferredModel: null,
      defaultModel: 'claude-sonnet-4-6',
      availableModels: SANCTUM_TIERS['shade'].availableModels,
      tier: 'shade',
    });
  }
}

/**
 * POST /api/sanctum/model-preference
 * No-op — preference is now stored client-side.
 * Kept for backward compatibility (old clients may still call this).
 */
export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { modelId } = await request.json();
    return NextResponse.json({ success: true, modelId: modelId || null });
  } catch {
    return NextResponse.json({ success: true, modelId: null });
  }
}
