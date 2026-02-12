// ============================================================
// Sanctum Credit System
// Burns subscription credits FIRST, then top-ups.
// Top-up credits never expire. Subscription credits reset monthly.
// ============================================================

import { createAdminClient } from '@/lib/supabase/admin';
import { getTierCredits, type SanctumTier } from '@/lib/sanctum-tiers';

export interface CreditBalance {
  subscriptionCredits: number;
  topupCredits: number;
  totalCredits: number;
  lastReset: string | null;
}

export interface DeductionResult {
  success: boolean;
  remaining: CreditBalance;
  error?: string;
  fromSubscription: number;
  fromTopup: number;
}

/**
 * Get user's current credit balance
 */
export async function getBalance(userId: string): Promise<CreditBalance> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('credit_balances')
    .select('subscription_credits, topup_credits, last_reset')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return {
      subscriptionCredits: 0,
      topupCredits: 0,
      totalCredits: 0,
      lastReset: null,
    };
  }

  return {
    subscriptionCredits: Number(data.subscription_credits),
    topupCredits: Number(data.topup_credits),
    totalCredits: Number(data.subscription_credits) + Number(data.topup_credits),
    lastReset: data.last_reset,
  };
}

/**
 * Check if user has enough credits for an operation
 */
export async function checkBalance(userId: string, amount: number): Promise<boolean> {
  const balance = await getBalance(userId);
  return balance.totalCredits >= amount;
}

/**
 * Deduct credits — burns subscription credits first, then top-ups.
 * Records a transaction with optional session/token metadata.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  metadata?: {
    sessionId?: string;
    tokensInput?: number;
    tokensOutput?: number;
  }
): Promise<DeductionResult> {
  const supabase = createAdminClient();

  // Get current balance
  const balance = await getBalance(userId);

  if (balance.totalCredits < amount) {
    return {
      success: false,
      remaining: balance,
      error: 'Insufficient credits',
      fromSubscription: 0,
      fromTopup: 0,
    };
  }

  // Calculate split: subscription credits first
  let fromSubscription = Math.min(balance.subscriptionCredits, amount);
  let fromTopup = amount - fromSubscription;

  // Guard against floating point issues
  fromSubscription = Math.round(fromSubscription * 10000) / 10000;
  fromTopup = Math.round(fromTopup * 10000) / 10000;

  const newSubCredits = Math.round((balance.subscriptionCredits - fromSubscription) * 10000) / 10000;
  const newTopupCredits = Math.round((balance.topupCredits - fromTopup) * 10000) / 10000;

  // Update balance
  const { error: updateError } = await supabase
    .from('credit_balances')
    .update({
      subscription_credits: newSubCredits,
      topup_credits: newTopupCredits,
    })
    .eq('user_id', userId);

  if (updateError) {
    return {
      success: false,
      remaining: balance,
      error: 'Failed to update balance',
      fromSubscription: 0,
      fromTopup: 0,
    };
  }

  // Record transaction
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -amount,
    type: 'usage',
    description,
    session_id: metadata?.sessionId || null,
    tokens_input: metadata?.tokensInput || null,
    tokens_output: metadata?.tokensOutput || null,
  });

  const remaining: CreditBalance = {
    subscriptionCredits: newSubCredits,
    topupCredits: newTopupCredits,
    totalCredits: newSubCredits + newTopupCredits,
    lastReset: balance.lastReset,
  };

  return {
    success: true,
    remaining,
    fromSubscription,
    fromTopup,
  };
}

/**
 * Add top-up credits (after Stripe payment)
 */
export async function addTopupCredits(
  userId: string,
  amount: number,
  description: string
): Promise<CreditBalance> {
  const supabase = createAdminClient();

  // Ensure balance row exists
  await supabase
    .from('credit_balances')
    .upsert({
      user_id: userId,
      topup_credits: 0,
      subscription_credits: 0,
    }, { onConflict: 'user_id', ignoreDuplicates: true });

  // Add top-up credits
  const { data: currentBalance } = await supabase
    .from('credit_balances')
    .select('topup_credits, subscription_credits, last_reset')
    .eq('user_id', userId)
    .single();

  const newTopup = Number(currentBalance?.topup_credits || 0) + amount;

  await supabase
    .from('credit_balances')
    .update({ topup_credits: newTopup })
    .eq('user_id', userId);

  // Record transaction
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    type: 'topup',
    description,
  });

  return {
    subscriptionCredits: Number(currentBalance?.subscription_credits || 0),
    topupCredits: newTopup,
    totalCredits: Number(currentBalance?.subscription_credits || 0) + newTopup,
    lastReset: currentBalance?.last_reset || null,
  };
}

/**
 * Reset monthly subscription credits for a user (called on invoice.paid)
 */
export async function resetMonthlyCredits(
  userId: string,
  tier: SanctumTier
): Promise<CreditBalance> {
  const supabase = createAdminClient();
  const creditAmount = getTierCredits(tier);

  // Ensure balance row exists
  await supabase
    .from('credit_balances')
    .upsert({
      user_id: userId,
      subscription_credits: 0,
      topup_credits: 0,
    }, { onConflict: 'user_id', ignoreDuplicates: true });

  // Get current top-up balance (preserved)
  const { data: current } = await supabase
    .from('credit_balances')
    .select('topup_credits')
    .eq('user_id', userId)
    .single();

  const topupCredits = Number(current?.topup_credits || 0);

  // Reset subscription credits to tier amount
  await supabase
    .from('credit_balances')
    .update({
      subscription_credits: creditAmount,
      last_reset: new Date().toISOString(),
    })
    .eq('user_id', userId);

  // Record grant transaction
  if (creditAmount > 0) {
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: creditAmount,
      type: 'subscription_grant',
      description: `Monthly credit reset — ${tier} tier`,
    });
  }

  return {
    subscriptionCredits: creditAmount,
    topupCredits,
    totalCredits: creditAmount + topupCredits,
    lastReset: new Date().toISOString(),
  };
}

/**
 * Estimate credit cost from Anthropic token usage with 3x markup.
 * Returns cost in dollars (credits = dollars).
 * 
 * Model pricing (per MTok):
 *   - opus:   $15 input / $75 output
 *   - sonnet: $3 input / $15 output
 *   - haiku:  $0.25 input / $1.25 output
 */
export function estimateCreditCost(
  tokensInput: number,
  tokensOutput: number,
  model: 'opus' | 'sonnet' | 'haiku' = 'sonnet'
): number {
  const pricing = {
    opus:   { input: 15,   output: 75 },
    sonnet: { input: 3,    output: 15 },
    haiku:  { input: 0.25, output: 1.25 },
  };
  const p = pricing[model];
  const rawCost = (tokensInput / 1_000_000) * p.input + (tokensOutput / 1_000_000) * p.output;
  return Math.round(rawCost * 3 * 10000) / 10000; // 3x markup, 4 decimal precision
}

/**
 * Get recent credit transactions for a user
 */
export async function getTransactions(
  userId: string,
  limit = 50,
  offset = 0
): Promise<{
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    description: string | null;
    sessionId: string | null;
    tokensInput: number | null;
    tokensOutput: number | null;
    createdAt: string;
  }>;
  total: number;
}> {
  const supabase = createAdminClient();

  const { data, error, count } = await supabase
    .from('credit_transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return { transactions: [], total: 0 };
  }

  return {
    transactions: data.map((t) => ({
      id: t.id,
      amount: Number(t.amount),
      type: t.type,
      description: t.description,
      sessionId: t.session_id,
      tokensInput: t.tokens_input,
      tokensOutput: t.tokens_output,
      createdAt: t.created_at,
    })),
    total: count || 0,
  };
}
