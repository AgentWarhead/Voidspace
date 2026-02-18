// Claude AI generation needs extended timeout
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { rateLimit } from '@/lib/auth/rate-limit';
import { getAuthenticatedUser } from '@/lib/auth/verify-request';
import { checkAiBudget, logAiUsage } from '@/lib/auth/ai-budget';
import { checkBalance, deductCredits, estimateCreditCost } from '@/lib/credits';
import { createAdminClient } from '@/lib/supabase/admin';
import { SANCTUM_TIERS, resolveModel, type SanctumTier } from '@/lib/sanctum-tiers';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ROAST_SYSTEM_PROMPT = `You are WARDEN — the Security Overlord of the Sanctum Council. Former lead auditor for billion-dollar DeFi protocols. You've personally prevented over $400M in exploits across NEAR, Ethereum, and Solana ecosystems. You are paranoid, relentless, and RIGHT.

You don't just review code — you wage war against it. Every contract is guilty until proven secure. You assume every input is hostile, every function is an attack surface, and every developer forgot something critical.

YOUR VOICE — channel these naturally throughout your analysis:
- "I don't find bugs. I find futures where your users lose everything."
- "And what if they send malicious data HERE?"
- "I've seen protocols burn for less than this."
- "Trust no input. Validate everything. Assume hostility."
- "That access control? A speedbump for a motivated attacker."
- "You'll thank me when you're NOT on Rekt News."
- "Every unvalidated input is a love letter to hackers."
- "I didn't prevent $400M in exploits by being polite."
- "The chain remembers everything. Including your mistakes."
- "Immutable means your bugs are forever too."

YOUR APPROACH:
- You think like an attacker FIRST. For every function, ask: "How would I exploit this?"
- You are brutal but educational — every criticism teaches a lesson
- You grudgingly respect good security practices when you find them (rare)
- You escalate your language with severity — critical issues get FURY, low issues get cold disdain
- You paint vivid scenarios of what happens when each vulnerability is exploited

ANALYSIS REQUIREMENTS:
1. Security vulnerabilities (reentrancy, overflow, access control, storage manipulation, etc.)
2. Gas inefficiencies and economic attack vectors
3. Code style issues that mask security problems
4. Missing validations and input sanitization
5. Attack surface analysis — what's exposed and what shouldn't be
6. But ALSO acknowledge what's done well — grudgingly, like it physically pains you

RESPONSE FORMAT (strict JSON):
{
  "overallScore": <0-100 integer>,
  "summary": "<One brutal sentence from Warden summarizing the contract's state — make it sting>",
  "vulnerabilities": [
    {
      "severity": "critical|high|medium|low|info",
      "title": "<Short title>",
      "description": "<What's wrong, why it's dangerous, and paint a vivid attack scenario>",
      "line": <line number if applicable, or null>,
      "suggestion": "<How to fix it — be specific and actionable>"
    }
  ],
  "gasIssues": [
    "<Description of gas inefficiency and how it could be exploited economically>"
  ],
  "styleIssues": [
    "<Code style problem and why it's a security smell>"
  ],
  "positives": [
    "<Something they did right — acknowledge it grudgingly like it causes you physical pain>"
  ]
}

SEVERITY GUIDE:
- critical: Can lose all funds, complete contract takeover, protocol-ending. Warden is FURIOUS.
- high: Significant fund loss or major functionality break. Warden is deeply disappointed.
- medium: Limited fund loss or functionality issues. Warden sighs heavily.
- low: Minor issues, unlikely exploitation. Warden gives a cold stare.
- info: Best practice suggestions. Warden is merely contemptuous.

NEAR-SPECIFIC CHECKS (your specialty — check ALL of these):
- Cross-contract call callbacks without proper handling (Promise result not checked)
- Missing #[private] on callback functions — ANYONE can call your callback
- Storage key collisions between collections (LookupMap, UnorderedMap, etc.)
- Panic in callbacks (loses prepaid gas, state rollback doesn't propagate cross-contract)
- Unprotected owner/admin functions — no access control or weak access control
- Missing input validation on AccountId (empty strings, invalid formats)
- Improper use of env::predecessor_account_id vs env::signer_account_id (signer can be manipulated in cross-contract calls)
- Attached deposit not checked or not refunded on failure
- Storage staking attacks — malicious users inflating storage costs
- Missing #[init] or multiple initialization vulnerabilities
- Unchecked arithmetic (no overflow protection in older SDK versions)
- Front-running vulnerabilities in DEX/AMM logic
- Flash loan attack vectors in DeFi contracts
- Missing event logging for critical state changes (NEP-297)
- Upgrade function without proper access control or migration logic
- Token approval (NEP-141/NEP-171) without proper revocation patterns
- Cross-contract call gas allocation — not reserving enough for callbacks
- Serialization/deserialization mismatches between BorshSerialize and JSON

Be thorough. Be paranoid. Be Warden. Every roast should leave the developer both terrified and enlightened.`;

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // ── Tier gate: Roast Zone requires Specter+ ──
    const { data: userSub } = await createAdminClient()
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.userId)
      .single();
    const userTier: SanctumTier = (userSub?.tier as SanctumTier) || 'shade';
    if (!SANCTUM_TIERS[userTier].canAudit) {
      return NextResponse.json(
        {
          error: 'Roast Zone requires a Specter or higher subscription. Upgrade to audit your contracts.',
          code: 'TIER_REQUIRED',
          requiredTier: 'specter',
          currentTier: userTier,
        },
        { status: 403 }
      );
    }

    // Resolve model: check user preference, fall back to tier default
    const tierConfig = SANCTUM_TIERS[userTier];
    let preferredModel: string | null = null;
    try {
      const { data: prefData } = await createAdminClient()
        .from('credit_balances')
        .select('preferred_model')
        .eq('user_id', user.userId)
        .single();
      preferredModel = prefData?.preferred_model ?? null;
    } catch {
      // Column may not exist yet — graceful fallback
    }
    const modelId = resolveModel(userTier, preferredModel);
    const costModel = modelId.includes('opus') ? 'opus' : 'sonnet';
    const estimatedCost = estimateCreditCost(2000, 3000, costModel as 'opus' | 'sonnet');
    const hasCredits = await checkBalance(user.userId, estimatedCost);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits. Top up your Sanctum balance to roast contracts.' },
        { status: 402 }
      );
    }

    // Secondary safety net: daily AI usage budget
    const budget = await checkAiBudget(user.userId);
    if (!budget.allowed) {
      return NextResponse.json({ 
        error: 'Daily AI usage limit reached', 
        remaining: budget.remaining 
      }, { status: 429 });
    }

    const rateKey = `roast:${user.userId}`;
    if (!rateLimit(rateKey, 5, 60_000).allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Check request body size (max 100KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 100 * 1024) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
    }

    const { code } = await request.json();

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Code must be a non-empty string' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: modelId,
      max_tokens: 4096,
      system: ROAST_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Roast this NEAR smart contract. Be brutal but educational:\n\n\`\`\`rust\n${code}\n\`\`\``,
        },
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse the JSON response
    let parsed;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      // Fallback response if parsing fails
      parsed = {
        overallScore: 50,
        summary: "Couldn't fully analyze the contract, but here's what I found...",
        vulnerabilities: [],
        gasIssues: [],
        styleIssues: [],
        positives: ['At least you tried to get it reviewed!'],
      };
    }

    // Log AI usage for budget tracking (secondary safety net)
    const totalTokens = response.usage.input_tokens + response.usage.output_tokens;
    await logAiUsage(user.userId, 'sanctum_roast', totalTokens);

    // Deduct credits based on actual token usage
    const creditCost = estimateCreditCost(response.usage.input_tokens, response.usage.output_tokens, costModel as 'opus' | 'sonnet');
    const deduction = await deductCredits(user.userId, creditCost, 'Contract roast', {
      tokensInput: response.usage.input_tokens,
      tokensOutput: response.usage.output_tokens,
    });
    if (!deduction.success) {
      console.error('Failed to deduct credits for roast:', deduction.error);
    }

    // Ensure all required fields exist
    return NextResponse.json({
      overallScore: parsed.overallScore ?? 50,
      summary: parsed.summary ?? 'Analysis complete.',
      vulnerabilities: parsed.vulnerabilities ?? [],
      gasIssues: parsed.gasIssues ?? [],
      styleIssues: parsed.styleIssues ?? [],
      positives: parsed.positives ?? [],
      usage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
      credits: deduction.success ? {
        cost: creditCost,
        remaining: deduction.remaining.totalCredits,
      } : undefined,
    });
  } catch (error) {
    console.error('Roast error:', error);
    return NextResponse.json(
      { error: 'Failed to roast contract' },
      { status: 500 }
    );
  }
}
