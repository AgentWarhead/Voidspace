import { SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { calculateGapScore, getCompetitionLevel, getDifficulty } from '@/lib/gap-score';
import { fetchNearTokens, getAggregateStats } from '@/lib/dexscreener';
import type { TokenData } from '@/lib/dexscreener';

// --- Interfaces ---

interface CategorySnapshot {
  name: string;
  slug: string;
  isStrategic: boolean;
  strategicMultiplier: number;
  projects: {
    name: string;
    description: string | null;
    tvlUsd: number;
    githubStars: number;
    githubForks: number;
    lastCommit: string | null;
    isActive: boolean;
    has24hVolume: boolean;
    volume24h: number;
    liquidityUsd: number;
  }[];
  aggregates: {
    totalProjects: number;
    activeProjects: number;
    totalTVL: number;
    avgGithubStars: number;
    projectsWithRecentCommits: number;
    projectsWithVolume: number;
  };
}

interface ClaudeVoid {
  categorySlug: string;
  title: string;
  description: string;
  reasoning: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  competitionLevel: 'low' | 'medium' | 'high';
  suggestedFeatures: string[];
  evidenceProjects: string[];
  voidConfidence: number;
}

// --- Helpers ---

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Generate a stable 16-char hex ID from category slug + normalized void title.
 * Used for upsert-based syncing so void IDs survive re-runs.
 */
function generateStableId(categorySlug: string, title: string): string {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 50);
  return createHash('md5')
    .update(`${categorySlug}:${normalized}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Match project names/tokens to DexScreener token data.
 * Uses fuzzy name matching (lowercase substring).
 */
function matchProjectToToken(
  projectName: string,
  tokens: TokenData[],
): TokenData | null {
  const lower = projectName.toLowerCase().trim();
  return (
    tokens.find(
      (t) =>
        t.name.toLowerCase() === lower ||
        t.symbol.toLowerCase() === lower ||
        t.name.toLowerCase().includes(lower) ||
        lower.includes(t.name.toLowerCase()),
    ) ?? null
  );
}

/**
 * New demand score: 0-100 based on cross-chain evidence.
 * High score = this market clearly exists elsewhere on crypto.
 */
function computeDemandScore(
  categorySlug: string,
  catData: { totalTVL: number; totalProjects: number; activeProjects: number },
  allCategoryActiveProjects: number[],
  dexTokens: TokenData[],
): number {
  let score = 0;

  // Component 1: Category fill rate vs ecosystem (0-30 pts)
  // How filled is this category relative to the average?
  const avgActiveProjects =
    allCategoryActiveProjects.length > 0
      ? allCategoryActiveProjects.reduce((a, b) => a + b, 0) /
        allCategoryActiveProjects.length
      : 1;
  const fillRatio = catData.activeProjects / Math.max(avgActiveProjects, 1);
  // Low fill = high demand signal (the market is underserved)
  score += Math.max(0, 30 - Math.round(fillRatio * 30));

  // Component 2: TVL signal (0-40 pts)
  // If there IS TVL, it means there's user demand
  if (catData.totalTVL > 10_000_000) score += 40;
  else if (catData.totalTVL > 1_000_000) score += 30;
  else if (catData.totalTVL > 100_000) score += 20;
  else if (catData.totalTVL > 10_000) score += 10;
  else score += 5; // Empty category still gets some demand signal

  // Component 3: Cross-chain analogue (0-30 pts)
  // Do DexScreener tokens with similar names show real volume?
  const categoryKeywords = categorySlug.split('-');
  const analogueTokens = dexTokens.filter((t) =>
    categoryKeywords.some(
      (kw) =>
        t.name.toLowerCase().includes(kw) ||
        t.symbol.toLowerCase().includes(kw),
    ),
  );
  const analogueTVL = analogueTokens.reduce(
    (sum, t) => sum + (t.liquidity || 0),
    0,
  );
  if (analogueTVL > 50_000_000) score += 30;
  else if (analogueTVL > 10_000_000) score += 20;
  else if (analogueTVL > 1_000_000) score += 10;

  return Math.min(score, 100);
}

// --- Tier 3: Cross-chain DexScreener evidence ---

async function fetchCrossChainAnalogues(categorySlug: string): Promise<
  {
    chain: string;
    totalTVL: number;
    topProjects: string[];
  }[]
> {
  // Map NEAR category slugs to DexScreener search terms
  const categoryTerms: Record<string, string[]> = {
    defi: ['uniswap', 'aave', 'compound'],
    dex: ['uniswap', 'raydium', 'orca'],
    lending: ['aave', 'compound', 'solend'],
    nft: ['opensea', 'tensor', 'magic-eden'],
    gaming: ['axie', 'gala', 'immutable'],
    dao: ['maker', 'compound', 'uniswap'],
    staking: ['lido', 'rocket-pool', 'jito'],
    bridge: ['stargate', 'wormhole', 'layerzero'],
    oracle: ['chainlink', 'pyth', 'switchboard'],
  };

  // Find the best matching terms for this category
  const terms =
    Object.entries(categoryTerms).find(([key]) =>
      categorySlug.includes(key),
    )?.[1] ?? [];

  if (terms.length === 0) return [];

  const results = [];
  for (const term of terms.slice(0, 2)) {
    try {
      const resp = await fetch(
        `https://api.dexscreener.com/latest/dex/search?q=${term}`,
      );
      if (!resp.ok) continue;
      const data = await resp.json();
      const pairs = (data.pairs ?? []).filter((p: { chainId: string }) =>
        ['ethereum', 'solana', 'base', 'bsc'].includes(p.chainId),
      );
      const totalTVL = pairs.reduce(
        (sum: number, p: { liquidity?: { usd?: number } }) =>
          sum + (p.liquidity?.usd ?? 0),
        0,
      );
      if (totalTVL > 0) {
        results.push({
          chain: 'multi',
          totalTVL,
          topProjects: pairs
            .slice(0, 3)
            .map(
              (p: { baseToken?: { name?: string } }) =>
                p.baseToken?.name ?? term,
            ),
        });
      }
    } catch {
      /* non-fatal */
    }
  }
  return results;
}

// --- Tier 3: NEAR Horizon funded projects ---

async function fetchHorizonProjects(): Promise<string[]> {
  // Try primary endpoint first, then fallback
  const endpoints = [
    'https://api.nearhorizon.app/projects',
    'https://nearbuilders.net/api/projects',
  ];

  for (const url of endpoints) {
    try {
      const resp = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) continue;
      const data = await resp.json();
      if (Array.isArray(data)) {
        const names = data
          .map((p: { name?: string; id?: string }) => p.name ?? p.id ?? '')
          .filter(Boolean);
        if (names.length > 0) return names;
      }
      if (data.projects && Array.isArray(data.projects)) {
        const names = data.projects
          .map((p: { name?: string; id?: string }) => p.name ?? p.id ?? '')
          .filter(Boolean);
        if (names.length > 0) return names;
      }
    } catch {
      /* non-fatal — try next endpoint */
    }
  }
  return []; // Non-fatal — proceed without Horizon data
}

// --- Tier 2: Skeptic verification pass ---

async function verifyVoidsWithSkeptic(
  voids: ClaudeVoid[],
  categorySnapshots: CategorySnapshot[],
): Promise<Map<string, number>> {
  // Returns: map of void title → skepticScore (1-10)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return new Map();

  const skepticPrompt = `You are a skeptical NEAR ecosystem researcher. Your job is to challenge void claims.

For each void below, determine:
1. Does any active NEAR project ALREADY partially fill this? (check carefully)
2. Is this gap actually real, or is it wishful thinking?
3. Skeptic score 1-10: How confident are you this is a REAL, UNFILLED gap?
   - 8-10: Definitely real, verifiable gap
   - 5-7: Real but with caveats
   - 1-4: Questionable — something already fills this or the gap isn't real

NEAR ecosystem data provided for reference:
${JSON.stringify(
  categorySnapshots.map((s) => ({
    slug: s.slug,
    projectNames: s.projects.map((p) => p.name),
  })),
  null,
  2,
)}

Voids to review:
${JSON.stringify(
  voids.map((v) => ({
    title: v.title,
    categorySlug: v.categorySlug,
    reasoning: v.reasoning,
    evidenceProjects: v.evidenceProjects,
  })),
  null,
  2,
)}

Return JSON: {"results": [{"title": "void title", "skepticScore": 8, "note": "reason"}]}
Only JSON. No markdown.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5', // Cheaper model for verification pass
        max_tokens: 8000,
        messages: [{ role: 'user', content: skepticPrompt }],
      }),
    });

    if (!response.ok) return new Map();

    const result = await response.json();
    const content = result?.content?.[0]?.text?.trim();
    if (!content) return new Map();

    let jsonStr = content;
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr
        .replace(/^```(?:json)?\s*/, '')
        .replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(jsonStr);
    const scoreMap = new Map<string, number>();
    for (const item of parsed.results ?? []) {
      if (item.title && typeof item.skepticScore === 'number') {
        scoreMap.set(item.title, item.skepticScore);
      }
    }
    return scoreMap;
  } catch {
    return new Map(); // Skeptic pass failure is non-fatal
  }
}

/**
 * Call Claude API to detect voids in the NEAR ecosystem.
 */
async function detectVoidsWithClaude(
  categorySnapshots: CategorySnapshot[],
  chainStats: Record<string, unknown>,
  horizonProjects: string[],
  crossChainData: Record<string, { chain: string; totalTVL: number; topProjects: string[] }[]>,
): Promise<ClaudeVoid[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const systemPrompt = `You are an ecosystem analyst for NEAR Protocol. Your job is to identify REAL, VERIFIED gaps (voids) in the ecosystem based on actual project data. Every void you identify must be supported by evidence from the data provided. Never invent or hallucinate opportunities — only report what the data shows is missing.

Your audience is builders of ALL skill levels — from weekend hackers to protocol architects. The best ecosystem intelligence surfaces opportunities everyone can act on, not just PhD-level cryptography projects. Think: "What could someone build THIS WEEKEND that would genuinely help the NEAR ecosystem?" alongside bigger plays.`;

  const horizonSection =
    horizonProjects.length > 0
      ? `\n[NEAR HORIZON FUNDED PROJECTS]
These projects are actively funded by the NEAR Foundation. DO NOT create voids for categories these projects serve well:
${horizonProjects.slice(0, 50).join(', ')}\n`
      : '';

  const crossChainSection =
    Object.keys(crossChainData).length > 0
      ? `\n[CROSS-CHAIN MARKET DATA]
This data shows what exists on Ethereum/Solana/Base — proof that demand exists for these categories even where NEAR has gaps:
${JSON.stringify(crossChainData, null, 2)}

Use this to strengthen your reasoning. If a category has $500M TVL on Solana but nothing on NEAR, that's a strong void signal.\n`
      : '';

  const userPrompt = `Analyze the following NEAR Protocol ecosystem data and identify legitimate voids (gaps where builders could create value).

RULES:
1. Every void MUST reference specific real projects in its reasoning (e.g., "Ref Finance and Jumbo Exchange are both AMM-based. No order book DEX exists on NEAR.")
2. Identify what EXISTS vs what's MISSING — the gap between them is the void
3. Check for: empty categories, abandoned projects (no commits >90 days), missing subcategories, feature gaps within populated categories, tooling gaps
4. Difficulty levels:
   - BEGINNER: Build on existing tools/APIs. Dashboards, bots, browser extensions, notification services, analytics UIs, aggregator frontends, developer utilities, monitoring tools. Could be built in a weekend to 4 weeks by a solo dev.
   - INTERMEDIATE: New protocol or tool using known patterns. Requires smart contract development or complex backend. 4-12 weeks, small team.
   - ADVANCED: Novel cryptography, consensus mechanisms, or infrastructure. Research-grade. 12+ weeks, experienced team.
5. Competition level per-void: low (0-1 similar projects), medium (2-3 similar), high (4+)
6. CRITICAL DISTRIBUTION — aim for 70-90 total voids: ~40% beginner, ~40% intermediate, ~20% advanced. This is mandatory.
7. BEGINNER VOIDS ARE THE PRIORITY. These are what bring new builders into the ecosystem. Think:
   - Telegram/Discord bots (price alerts, whale watchers, DAO vote notifiers)
   - Browser extensions (portfolio viewer, gas tracker, tx decoder)
   - Dashboards and visualizations (validator stats, token flow maps, DeFi comparison tools)
   - Developer utilities (contract templates, deployment scripts, testing tools)
   - API wrappers and SDKs (simplify existing infrastructure for new devs)
   - Notification and monitoring services (wallet activity alerts, protocol health monitors)
   - Data aggregation tools (combine existing APIs into useful views)
   - Educational/interactive tools (learn-by-doing tutorials, sandbox environments)
   Each beginner void should make someone think: "I could actually build that. Let me start."
8. Every void must be something a builder could ACTUALLY start building on NEAR today
9. Do NOT suggest voids that are already well-served by existing active projects with significant TVL/usage
10. For categories with 0 projects: identify 3-4 foundational voids (mix of beginner and intermediate)
11. For categories with active projects: identify specific FEATURE gaps and COMPLEMENTARY tools
12. NEAR-SPECIFIC: Focus on gaps unique to NEAR's architecture (named accounts, access keys, sharding, chain signatures, intents). Generic blockchain ideas that apply to any chain are less valuable.
13. AVOID GENERIC: Don't suggest "Decentralized Social Media" or "Algorithmic Stablecoin" — these exist on every chain. What does NEAR specifically lack given its unique tech?
14. ACTIONABLE DESCRIPTIONS: Each description should hint at HOW to build it. Mention specific APIs, protocols, or tools the builder would use.
15. voidConfidence (1-10): Your honest confidence this gap is real and not already filled.
    - 9-10: Obvious, verified gap with strong cross-chain analogue
    - 7-8: Clear gap, well-supported by data
    - 5-6: Plausible gap, some uncertainty
    - 1-4: Speculative — do not return voids below 5
    Be conservative. A score of 7 is good. Reserve 9-10 for truly obvious voids.
${horizonSection}${crossChainSection}
[ECOSYSTEM DATA]
${JSON.stringify(categorySnapshots, null, 2)}

[CHAIN STATS]
${JSON.stringify(chainStats)}

Return a JSON array of voids:
[
  {
    "categorySlug": "defi",
    "title": "Specific, Descriptive Title",
    "description": "2-3 sentences. What is this? Why does NEAR need it? Be specific about the gap.",
    "reasoning": "Evidence-based. Reference real projects by name. Explain what exists and what's missing.",
    "difficulty": "beginner|intermediate|advanced",
    "competitionLevel": "low|medium|high",
    "suggestedFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "evidenceProjects": ["Project Name 1", "Project Name 2"],
    "voidConfidence": 8
  }
]

Return ONLY valid JSON. No markdown, no explanation.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 32000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const content = result?.content?.[0]?.text;

  if (!content) {
    throw new Error('Claude API returned empty content');
  }

  // Parse JSON — handle potential markdown fencing
  let jsonStr = content.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(jsonStr);

  if (!Array.isArray(parsed)) {
    throw new Error('Claude response is not a JSON array');
  }

  return parsed;
}

/**
 * Validate a single void from Claude's response.
 */
function isValidVoid(v: unknown): v is ClaudeVoid {
  if (!v || typeof v !== 'object') return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj.categorySlug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.reasoning === 'string' &&
    ['beginner', 'intermediate', 'advanced'].includes(obj.difficulty as string) &&
    ['low', 'medium', 'high'].includes(obj.competitionLevel as string) &&
    Array.isArray(obj.suggestedFeatures) &&
    Array.isArray(obj.evidenceProjects)
  );
}

// --- Main Export ---

export async function generateOpportunities(
  supabase: SupabaseClient,
): Promise<{ created: number; updated: number; error?: string }> {
  // Step 1: Fetch DexScreener data (once, cached)
  let dexTokens: TokenData[] = [];
  let dexStats: { totalVolume24h: number; totalLiquidity: number } | null = null;
  try {
    dexTokens = await fetchNearTokens();
    const stats = await getAggregateStats();
    dexStats = {
      totalVolume24h: stats.totalVolume24h,
      totalLiquidity: stats.totalLiquidity,
    };
  } catch (err) {
    console.warn('DexScreener fetch failed, continuing without market data:', err);
  }

  // Step 2: Fetch all categories
  const { data: categories } = await supabase.from('categories').select('*');
  if (!categories || categories.length === 0) {
    return { created: 0, updated: 0, error: 'No categories found' };
  }

  // Build category slug → id map
  const categorySlugToId = new Map<string, string>();
  for (const cat of categories) {
    categorySlugToId.set(cat.slug, cat.id);
  }

  // Step 3: Build category snapshots
  const categorySnapshots: CategorySnapshot[] = [];
  const allCategoryActiveProjects: number[] = [];
  const allCategoryTVLs: number[] = [];
  const now = Date.now();

  for (const cat of categories) {
    const { data: projects } = await supabase
      .from('projects')
      .select(
        'name, description, tvl_usd, github_stars, github_forks, github_open_issues, last_github_commit, is_active, website_url',
      )
      .eq('category_id', cat.id);

    const catProjects = projects || [];
    const activeProjects = catProjects.filter((p) => p.is_active);
    const totalTVL = catProjects.reduce(
      (sum, p) => sum + (Number(p.tvl_usd) || 0),
      0,
    );

    allCategoryActiveProjects.push(activeProjects.length);
    allCategoryTVLs.push(totalTVL);

    // Match projects to DexScreener tokens
    const projectSnapshots = catProjects.map((p) => {
      const token = matchProjectToToken(p.name, dexTokens);
      return {
        name: p.name,
        description: p.description,
        tvlUsd: Number(p.tvl_usd) || 0,
        githubStars: p.github_stars || 0,
        githubForks: p.github_forks || 0,
        lastCommit: p.last_github_commit || null,
        isActive: p.is_active,
        has24hVolume: token ? token.volume24h > 0 : false,
        volume24h: token?.volume24h || 0,
        liquidityUsd: token?.liquidity || 0,
      };
    });

    const totalStars = catProjects.reduce(
      (sum, p) => sum + (p.github_stars || 0),
      0,
    );
    const projectsWithRecentCommits = catProjects.filter((p) => {
      if (!p.last_github_commit) return false;
      return now - new Date(p.last_github_commit).getTime() <= THIRTY_DAYS_MS;
    }).length;
    const projectsWithVolume = projectSnapshots.filter(
      (p) => p.has24hVolume,
    ).length;

    categorySnapshots.push({
      name: cat.name,
      slug: cat.slug,
      isStrategic: cat.is_strategic,
      strategicMultiplier: Number(cat.strategic_multiplier),
      projects: projectSnapshots,
      aggregates: {
        totalProjects: catProjects.length,
        activeProjects: activeProjects.length,
        totalTVL,
        avgGithubStars:
          catProjects.length > 0
            ? Math.round(totalStars / catProjects.length)
            : 0,
        projectsWithRecentCommits,
        projectsWithVolume,
      },
    });
  }

  // Step 4: Fetch chain stats for context
  const { data: chainStatsRows } = await supabase
    .from('chain_stats')
    .select('*')
    .order('fetched_at', { ascending: false })
    .limit(1);

  const chainStats = chainStatsRows?.[0] || {};

  // Step 4b: Tier 3 — fetch Horizon projects + cross-chain analogues
  const horizonProjects = await fetchHorizonProjects();
  if (horizonProjects.length > 0) {
    console.log(`Horizon projects loaded: ${horizonProjects.length}`);
  } else {
    console.log('Horizon projects: none loaded (non-fatal)');
  }

  // Gather cross-chain analogues — parallel with 8s total budget
  const crossChainData: Record<
    string,
    { chain: string; totalTVL: number; topProjects: string[] }[]
  > = {};
  try {
    const crossChainResults = await Promise.allSettled(
      categorySnapshots.map(async (snapshot) => ({
        slug: snapshot.slug,
        analogues: await Promise.race([
          fetchCrossChainAnalogues(snapshot.slug),
          new Promise<[]>((resolve) => setTimeout(() => resolve([]), 8000)),
        ]),
      })),
    );
    for (const result of crossChainResults) {
      if (result.status === 'fulfilled' && result.value.analogues.length > 0) {
        crossChainData[result.value.slug] = result.value.analogues;
      }
    }
  } catch { /* non-fatal */ }

  // Step 5: Call Claude to detect voids
  let claudeVoids: ClaudeVoid[];
  try {
    const rawVoids = await detectVoidsWithClaude(
      categorySnapshots,
      { ...chainStats, dexScreener: dexStats },
      horizonProjects,
      crossChainData,
    );

    // Validate each void
    claudeVoids = rawVoids.filter(isValidVoid);

    // Filter out low-confidence voids from Claude directly
    claudeVoids = claudeVoids.filter(
      (v) => (v.voidConfidence ?? 5) >= 5,
    );

    // Filter out voids referencing non-existent categories
    claudeVoids = claudeVoids.filter((v) => categorySlugToId.has(v.categorySlug));

    // Cap at 100 voids (safety limit)
    if (claudeVoids.length > 100) {
      claudeVoids = claudeVoids.slice(0, 100);
    }

    console.log(
      `Claude detected ${rawVoids.length} voids, ${claudeVoids.length} valid after filtering`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Claude void detection failed:', message);
    return { created: 0, updated: 0, error: message };
  }

  if (claudeVoids.length === 0) {
    return { created: 0, updated: 0, error: 'Claude returned 0 valid voids' };
  }

  // Step 5b: Tier 2 — Skeptic verification pass (30s budget)
  let skepticScores = new Map<string, number>();
  try {
    skepticScores = await Promise.race([
      verifyVoidsWithSkeptic(claudeVoids, categorySnapshots),
      new Promise<Map<string, number>>((resolve) =>
        setTimeout(() => resolve(new Map()), 30000),
      ),
    ]);
    const beforeCount = claudeVoids.length;
    // Filter out voids the skeptic scores below 6
    claudeVoids = claudeVoids.filter((v) => {
      const score = skepticScores.get(v.title) ?? 7; // default pass if not reviewed
      return score >= 6;
    });
    console.log(
      `Skeptic pass: ${beforeCount - claudeVoids.length} voids filtered out, ${claudeVoids.length} remain`,
    );
  } catch (err) {
    console.warn('Skeptic pass failed (non-fatal):', err);
  }

  // Step 6: Compute gap scores for each void
  const ecosystemAverageTVL =
    allCategoryTVLs.length > 0
      ? allCategoryTVLs.reduce((s, v) => s + v, 0) / allCategoryTVLs.length
      : 0;

  // Build per-category data lookup for gap scoring
  const categoryDataMap = new Map<
    string,
    {
      totalProjects: number;
      activeProjects: number;
      totalTVL: number;
      isStrategic: boolean;
      strategicMultiplier: number;
      projectTVLs: number[];
      projectGithubStats: {
        stars: number;
        forks: number;
        openIssues: number;
        lastCommit: string | null;
        isActive: boolean;
      }[];
    }
  >();

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const snapshot = categorySnapshots[i];
    const { data: projectStats } = await supabase
      .from('projects')
      .select(
        'tvl_usd, github_stars, github_forks, github_open_issues, last_github_commit, is_active',
      )
      .eq('category_id', cat.id);

    const catProjects = projectStats || [];
    categoryDataMap.set(cat.slug, {
      totalProjects: snapshot.aggregates.totalProjects,
      activeProjects: snapshot.aggregates.activeProjects,
      totalTVL: snapshot.aggregates.totalTVL,
      isStrategic: cat.is_strategic,
      strategicMultiplier: Number(cat.strategic_multiplier),
      projectTVLs: catProjects.map((p) => Number(p.tvl_usd) || 0),
      projectGithubStats: catProjects.map((p) => ({
        stars: p.github_stars || 0,
        forks: p.github_forks || 0,
        openIssues: p.github_open_issues || 0,
        lastCommit: p.last_github_commit,
        isActive: p.is_active,
      })),
    });
  }

  // Step 7 (Tier 3): Upsert voids (no more delete-all)
  let created = 0;
  let updated = 0;

  for (const v of claudeVoids) {
    const categoryId = categorySlugToId.get(v.categorySlug);
    if (!categoryId) continue;

    const catData = categoryDataMap.get(v.categorySlug);
    if (!catData) continue;

    const gapScore = calculateGapScore({
      categorySlug: v.categorySlug,
      totalProjects: catData.totalProjects,
      activeProjects: catData.activeProjects,
      totalTVL: catData.totalTVL,
      isStrategic: catData.isStrategic,
      strategicMultiplier: catData.strategicMultiplier,
      projectTVLs: catData.projectTVLs,
      projectGithubStats: catData.projectGithubStats,
      allCategoryActiveProjects,
      ecosystemAverageTVL,
    });

    // Tier 1d: New demand score calculation
    const demandScore = computeDemandScore(
      v.categorySlug,
      {
        totalTVL: catData.totalTVL,
        totalProjects: catData.totalProjects,
        activeProjects: catData.activeProjects,
      },
      allCategoryActiveProjects,
      dexTokens,
    );

    // Tier 1e: Apply voidConfidence multiplier to gap_score
    const confidenceMultiplier = Math.max(
      0.5,
      Math.min(1.0, (v.voidConfidence ?? 5) / 10),
    );
    const adjustedGapScore = Math.round(
      Math.min(gapScore, 100) * confidenceMultiplier,
    );

    // Tier 2: Boost void_confidence if skeptic agrees
    const skepticScore = skepticScores.get(v.title);
    const finalConfidence = skepticScore
      ? Math.round(((v.voidConfidence ?? 5) + skepticScore) / 2)
      : (v.voidConfidence ?? 5);

    // Tier 3c: Generate stable_id for upsert
    const stableId = generateStableId(v.categorySlug, v.title);

    // Check if this void already exists
    const { data: existing } = await supabase
      .from('opportunities')
      .select('id, void_status')
      .eq('stable_id', stableId)
      .single();

    if (existing) {
      // Update existing void (preserve ID, update scores)
      const { error: updateError } = await supabase
        .from('opportunities')
        .update({
          gap_score: adjustedGapScore,
          demand_score: demandScore,
          competition_level: v.competitionLevel,
          reasoning: v.reasoning,
          suggested_features: v.suggestedFeatures,
          evidence_projects: v.evidenceProjects ?? [],
          void_confidence: finalConfidence,
          void_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('stable_id', stableId);

      if (updateError) {
        console.error(`Failed to update void "${v.title}":`, updateError.message);
      } else {
        updated++;
      }
    } else {
      // Insert new void
      const { error: insertError } = await supabase
        .from('opportunities')
        .insert({
          category_id: categoryId,
          title: v.title,
          description: v.description,
          gap_score: adjustedGapScore,
          demand_score: demandScore,
          competition_level: v.competitionLevel,
          reasoning: v.reasoning,
          suggested_features: v.suggestedFeatures,
          difficulty: v.difficulty,
          evidence_projects: v.evidenceProjects ?? [],
          void_confidence: finalConfidence,
          stable_id: stableId,
          void_status: 'active',
        });

      if (insertError) {
        console.error(`Failed to insert void "${v.title}":`, insertError.message);
      } else {
        created++;
      }
    }
  }

  // Mark voids not seen in this sync as potentially filling
  const seenStableIds = claudeVoids.map((v) =>
    generateStableId(v.categorySlug, v.title),
  );
  if (seenStableIds.length > 0) {
    await supabase
      .from('opportunities')
      .update({ void_status: 'filling' })
      .eq('void_status', 'active')
      .not(
        'stable_id',
        'in',
        `(${seenStableIds.map((id) => `'${id}'`).join(',')})`,
      );
  }

  return { created, updated };
}
