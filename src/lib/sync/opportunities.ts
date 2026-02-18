import { SupabaseClient } from '@supabase/supabase-js';
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
}

// --- Helpers ---

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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
 * Call Claude API to detect voids in the NEAR ecosystem.
 */
async function detectVoidsWithClaude(
  categorySnapshots: CategorySnapshot[],
  chainStats: Record<string, unknown>,
): Promise<ClaudeVoid[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const systemPrompt = `You are an ecosystem analyst for NEAR Protocol. Your job is to identify REAL, VERIFIED gaps (voids) in the ecosystem based on actual project data. Every void you identify must be supported by evidence from the data provided. Never invent or hallucinate opportunities — only report what the data shows is missing.

Your audience is builders of ALL skill levels — from weekend hackers to protocol architects. The best ecosystem intelligence surfaces opportunities everyone can act on, not just PhD-level cryptography projects. Think: "What could someone build THIS WEEKEND that would genuinely help the NEAR ecosystem?" alongside bigger plays.`;

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
    "evidenceProjects": ["Project Name 1", "Project Name 2"]
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

  // Step 5: Call Claude to detect voids
  let claudeVoids: ClaudeVoid[];
  try {
    const rawVoids = await detectVoidsWithClaude(categorySnapshots, {
      ...chainStats,
      dexScreener: dexStats,
    });

    // Validate each void
    claudeVoids = rawVoids.filter(isValidVoid);

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

  // Step 7: Delete all existing opportunities (clean slate)
  const { error: deleteError } = await supabase
    .from('opportunities')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows

  if (deleteError) {
    console.error('Failed to delete existing opportunities:', deleteError.message);
  }

  // Step 8: Insert new voids
  let created = 0;

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

    const demandScore = Math.round(Math.log10(catData.totalTVL + 1) * 10) / 10;

    const { error: insertError } = await supabase.from('opportunities').insert({
      category_id: categoryId,
      title: v.title,
      description: v.description,
      gap_score: Math.min(gapScore, 100),
      demand_score: demandScore,
      competition_level: v.competitionLevel,
      reasoning: v.reasoning,
      suggested_features: v.suggestedFeatures,
      difficulty: v.difficulty,
    });

    if (insertError) {
      console.error(`Failed to insert void "${v.title}":`, insertError.message);
    } else {
      created++;
    }
  }

  return { created, updated: 0 };
}
