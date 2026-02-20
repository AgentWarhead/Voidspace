import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/auth/rate-limit';
import { isValidUUID } from '@/lib/auth/validate';
import type { VoidEnrichment } from '@/types';

export const maxDuration = 60;

// 7 day cache TTL — enrichments are regenerated when stale
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const ENRICHMENT_PROMPT = (opportunity: {
  title: string;
  description: string | null;
  reasoning: string | null;
  difficulty: string;
  competition_level: string;
  gap_score: number;
  suggested_features: string[] | null;
  category_name?: string;
}) => `You are a startup advisor and ecosystem analyst for NEAR Protocol. A builder is looking at this ecosystem gap (a "Void") and needs compelling, practical insight to understand if they should build it.

VOID DATA:
Title: ${opportunity.title}
Category: ${opportunity.category_name || 'Unknown'}
Description: ${opportunity.description || 'No description available'}
Reasoning: ${opportunity.reasoning || 'No reasoning available'}
Difficulty: ${opportunity.difficulty}
Competition: ${opportunity.competition_level}
Void Score: ${opportunity.gap_score}/100
Suggested Features: ${(opportunity.suggested_features || []).join(', ')}

Generate a rich, persona-driven insight package for this void. Write like a sharp startup advisor — direct, specific, exciting but honest. No corporate speak. Speak to BUILDERS.

Return ONLY valid JSON (no markdown, no explanation):
{
  "hook": "One punchy line that captures what this could become. Not a description — a VISION. Like 'The missing gas oracle NEAR desperately needs' or 'The Upwork of NEAR smart contract audits'. Make it vivid.",
  "vision": "2-3 sentences. Paint the picture of what this looks like 18 months after launch. Real numbers, real user behaviors, ecosystem impact. Make the builder feel the potential.",
  "personas": [
    {
      "emoji": "🛠️",
      "type": "Weekend Builder",
      "fit": "1-2 sentences why THIS specific void is perfect for this person. Be specific to the void.",
      "skillsNeeded": "Comma-separated skills needed e.g. 'React, NEAR JS SDK, REST APIs'",
      "timeToMVP": "e.g. '1-2 weekends'"
    }
  ],
  "buildAngles": [
    {
      "title": "Short catchy angle title",
      "description": "2-3 sentences. HOW to approach this build specifically. What's the MVP? What do you build first? What's the clever wedge?",
      "timeToMVP": "e.g. '4-5 days'",
      "inspiration": "e.g. 'Like Etherscan Gas Tracker but NEAR-native and predictive'"
    }
  ],
  "revenue": {
    "model": "The specific revenue model name e.g. 'Freemium SaaS' or 'Protocol Fee' or 'B2B API Access'",
    "potential": "Realistic monthly range once established e.g. '$2K–$15K/month' — be honest, not hype",
    "howTo": "2-3 sentences. The specific monetization path. What does the free tier do? What does paid unlock? Who are the paying customers?"
  },
  "quickStart": [
    "Day 1: [specific first action]",
    "Day 2-3: [second phase]",
    "Week 1: [first deliverable]",
    "Week 2: [second milestone]",
    "Month 1: [first launch target]"
  ],
  "moat": "1-2 sentences. What makes this defensible once you've built it? Network effects, data moat, switching cost, first-mover brand?"
}

PERSONA TYPES to choose from (pick 2-3 that genuinely fit this void):
- Weekend Builder: Solo dev, wants quick wins, ships fast, loves side projects
- DeFi Developer: Knows NEAR DeFi ecosystem, looking to build adjacent tools
- NEAR Ecosystem Dev: Already building on NEAR, expanding their stack
- Indie Hacker: Wants monetizable products, low competition, recurring revenue
- Protocol Researcher: Interested in pushing NEAR tech boundaries
- Web2 Developer: Coming from traditional dev, learning Web3 through building
- NFT / Creative Builder: Wants to build tools for the creator economy on NEAR

Make 2-3 build angles that show DIFFERENT ways to approach the same void (different MVPs, different target users, different monetization).`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate
  if (!id || !isValidUUID(id)) {
    return NextResponse.json({ error: 'Invalid void ID' }, { status: 400 });
  }

  // Rate limit — 20 req/min per IP (almost always served from cache)
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(`void-enrich:${ip}`, 20, 60_000).allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const supabase = createAdminClient();

  // Check cache first
  const { data: cached } = await supabase
    .from('void_enrichments')
    .select('data, updated_at')
    .eq('opportunity_id', id)
    .single();

  if (cached) {
    const age = Date.now() - new Date(cached.updated_at).getTime();
    if (age < CACHE_TTL_MS) {
      return NextResponse.json({ enrichment: cached.data as VoidEnrichment, cached: true });
    }
  }

  // Fetch the opportunity data
  const { data: opportunity } = await supabase
    .from('opportunities')
    .select('title, description, reasoning, difficulty, competition_level, gap_score, suggested_features, categories(name)')
    .eq('id', id)
    .single();

  if (!opportunity) {
    return NextResponse.json({ error: 'Void not found' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryName = (opportunity as any).categories?.name as string | undefined;

  // Call Claude for enrichment
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 500 });
  }

  const prompt = ENRICHMENT_PROMPT({
    title: opportunity.title,
    description: opportunity.description,
    reasoning: opportunity.reasoning,
    difficulty: opportunity.difficulty,
    competition_level: opportunity.competition_level,
    gap_score: opportunity.gap_score,
    suggested_features: opportunity.suggested_features,
    category_name: categoryName,
  });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }

  const result = await response.json();
  let jsonStr = result?.content?.[0]?.text?.trim() || '';
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }

  let enrichment: VoidEnrichment;
  try {
    enrichment = JSON.parse(jsonStr) as VoidEnrichment;
    enrichment.generatedAt = new Date().toISOString();
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
  }

  // Cache it
  await supabase.from('void_enrichments').upsert(
    { opportunity_id: id, data: enrichment, updated_at: new Date().toISOString() },
    { onConflict: 'opportunity_id' }
  );

  return NextResponse.json({ enrichment, cached: false });
}
