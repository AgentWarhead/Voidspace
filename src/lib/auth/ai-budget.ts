import { createAdminClient } from '@/lib/supabase/admin';
import type { SanctumTier } from '@/lib/sanctum-tiers';

// Daily request limits per tier — generous enough to not punish real usage
const TIER_LIMITS: Record<SanctumTier, number> = {
  shade: 25,        // Free tier: 25 requests/day (enough to explore)
  specter: 200,     // $25/mo: 200/day — solid daily usage
  legion: 500,      // $60/mo: 500/day — power user
  leviathan: 2000,  // $200/mo: 2000/day — practically unlimited
};

export async function checkAiBudget(
  userId: string,
  tier: SanctumTier = 'shade'
): Promise<{ allowed: boolean; remaining: number }> {
  const limit = TIER_LIMITS[tier] || TIER_LIMITS.shade;
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
    allowed: used < limit,
    remaining: Math.max(0, limit - used)
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