import { createAdminClient } from '@/lib/supabase/admin';

// Token limit reserved for future per-token tracking
// const DAILY_TOKEN_LIMIT = 50000;
const DAILY_REQUEST_LIMIT = 50;  // 50 AI requests per user per day

export async function checkAiBudget(userId: string): Promise<{ allowed: boolean; remaining: number }> {
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
    allowed: used < DAILY_REQUEST_LIMIT,
    remaining: Math.max(0, DAILY_REQUEST_LIMIT - used)
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