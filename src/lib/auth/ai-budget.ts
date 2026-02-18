import { createAdminClient } from '@/lib/supabase/admin';
import type { SanctumTier } from '@/lib/sanctum-tiers';

// Daily request limit ONLY for free tier (Shade) — a gentle nudge to upgrade.
// Paid tiers have NO daily limit. Their credits ARE the limit.
const FREE_TIER_DAILY_LIMIT = 25;

export async function checkAiBudget(
  userId: string,
  tier: SanctumTier = 'shade'
): Promise<{ allowed: boolean; remaining: number }> {
  // Paid tiers: no daily cap — credits are the only gate
  if (tier !== 'shade') {
    return { allowed: true, remaining: Infinity };
  }

  // Free tier: soft daily limit to prevent abuse without credit commitment
  const supabase = createAdminClient();
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  
  const { count } = await supabase
    .from('usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('action', ['sanctum_chat', 'sanctum_roast', 'sanctum_visual', 'void_lens_ai'])
    .gte('created_at', dayStart.toISOString());
  
  const used = count || 0;
  return {
    allowed: used < FREE_TIER_DAILY_LIMIT,
    remaining: Math.max(0, FREE_TIER_DAILY_LIMIT - used)
  };
}

export async function logAiUsage(userId: string, action: string, tokensUsed?: number): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('usage').insert({
      user_id: userId,
      action,
      metadata: tokensUsed ? { tokens: tokensUsed } : undefined,
    });
    
    if (error) {
      console.error('Failed to log AI usage:', error);
    }
  } catch (err) {
    console.error('Failed to log AI usage:', err);
  }
}