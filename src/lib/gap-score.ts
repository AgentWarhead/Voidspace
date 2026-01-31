import type { GapScoreInput, GapScoreBreakdown } from '@/types';

/* ── Weights ── */
const WEIGHTS = {
  supplyScarcity: 0.28,
  tvlConcentration: 0.20,
  devActivityGap: 0.21,
  strategicPriority: 0.16,
  marketDemand: 0.15,
};

/* ── Signal 1: Supply Scarcity (0-100) ── */
function computeSupplyScarcity(input: GapScoreInput): number {
  const { activeProjects, allCategoryActiveProjects } = input;

  if (allCategoryActiveProjects && allCategoryActiveProjects.length > 1) {
    const sorted = [...allCategoryActiveProjects].sort((a, b) => a - b);
    const rank = sorted.findIndex((v) => v >= activeProjects);
    const invertedRank = sorted.length - 1 - rank;
    return Math.round((invertedRank / (sorted.length - 1)) * 100);
  }

  // Fallback: simple inverse curve
  if (activeProjects === 0) return 100;
  return Math.round(Math.max(5, 100 - activeProjects * 5));
}

/* ── Signal 2: TVL Concentration (0-100) ── */
function computeTVLConcentration(input: GapScoreInput): number {
  const { projectTVLs } = input;

  if (!projectTVLs.length || projectTVLs.every((v) => v === 0)) {
    return 85;
  }

  const totalTVL = projectTVLs.reduce((s, v) => s + v, 0);
  if (totalTVL === 0) return 85;

  const hhi = projectTVLs.reduce((sum, tvl) => {
    const share = tvl / totalTVL;
    return sum + share * share;
  }, 0);

  return Math.round(Math.min(100, hhi * 120));
}

/* ── Signal 3: Dev Activity Gap (0-100) ── */
function computeDevActivityGap(input: GapScoreInput): number {
  const { projectGithubStats } = input;

  if (!projectGithubStats.length) return 70;

  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

  let recentCount = 0;
  let staleCount = 0;
  let totalStars = 0;

  for (const proj of projectGithubStats) {
    totalStars += proj.stars;
    if (proj.lastCommit) {
      const age = now - new Date(proj.lastCommit).getTime();
      if (age <= THIRTY_DAYS) recentCount++;
      else if (age > NINETY_DAYS) staleCount++;
    } else {
      staleCount++;
    }
  }

  const total = projectGithubStats.length;
  const recentRatio = recentCount / total;
  const staleRatio = staleCount / total;

  const activityScore = Math.round(staleRatio * 55 + (1 - recentRatio) * 35 + 10);

  const starsPerProject = totalStars / total;
  const starBonus = starsPerProject < 10 ? 10 : starsPerProject < 50 ? 5 : 0;

  return Math.min(100, activityScore + starBonus);
}

/* ── Signal 4: Strategic Priority (0-100) ── */
function computeStrategicPriority(input: GapScoreInput): number {
  if (!input.isStrategic) return 25;
  return Math.min(100, Math.round(60 + (input.strategicMultiplier - 1) * 25));
}

/* ── Signal 5: Market Demand Proxy (0-100) ── */
function computeMarketDemand(input: GapScoreInput): number {
  const { totalTVL, ecosystemAverageTVL } = input;

  if (!ecosystemAverageTVL || ecosystemAverageTVL === 0) {
    if (totalTVL === 0) return 75;
    if (totalTVL < 100_000) return 65;
    if (totalTVL < 1_000_000) return 50;
    if (totalTVL < 10_000_000) return 35;
    return 20;
  }

  const ratio = totalTVL / ecosystemAverageTVL;
  return Math.round(Math.max(5, Math.min(95, 80 - ratio * 40)));
}

/* ── Composite Score ── */
export function calculateGapScore(input: GapScoreInput): number {
  const ss = computeSupplyScarcity(input);
  const tc = computeTVLConcentration(input);
  const da = computeDevActivityGap(input);
  const sp = computeStrategicPriority(input);
  const md = computeMarketDemand(input);

  const composite =
    ss * WEIGHTS.supplyScarcity +
    tc * WEIGHTS.tvlConcentration +
    da * WEIGHTS.devActivityGap +
    sp * WEIGHTS.strategicPriority +
    md * WEIGHTS.marketDemand;

  return Math.min(100, Math.max(0, Math.round(composite)));
}

/* ── Breakdown with signal details ── */
export function calculateGapScoreBreakdown(input: GapScoreInput): GapScoreBreakdown {
  const ss = computeSupplyScarcity(input);
  const tc = computeTVLConcentration(input);
  const da = computeDevActivityGap(input);
  const sp = computeStrategicPriority(input);
  const md = computeMarketDemand(input);

  const finalScore = Math.min(100, Math.max(0, Math.round(
    ss * WEIGHTS.supplyScarcity +
    tc * WEIGHTS.tvlConcentration +
    da * WEIGHTS.devActivityGap +
    sp * WEIGHTS.strategicPriority +
    md * WEIGHTS.marketDemand
  )));

  return {
    supplyScarcity: ss,
    tvlConcentration: tc,
    devActivityGap: da,
    strategicPriority: sp,
    marketDemand: md,
    finalScore,
    signals: [
      {
        label: 'Supply Scarcity',
        value: ss,
        weight: WEIGHTS.supplyScarcity,
        description: `${input.activeProjects} active project${input.activeProjects !== 1 ? 's' : ''} in this category`,
      },
      {
        label: 'TVL Concentration',
        value: tc,
        weight: WEIGHTS.tvlConcentration,
        description: tc >= 60
          ? 'Market dominated by few players'
          : 'TVL spread across multiple projects',
      },
      {
        label: 'Dev Activity Gap',
        value: da,
        weight: WEIGHTS.devActivityGap,
        description: da >= 60
          ? 'Low recent development activity'
          : 'Active development ongoing',
      },
      {
        label: 'Strategic Priority',
        value: sp,
        weight: WEIGHTS.strategicPriority,
        description: input.isStrategic
          ? `NEAR Priority area (${input.strategicMultiplier}x)`
          : 'Standard ecosystem category',
      },
      {
        label: 'Market Demand',
        value: md,
        weight: WEIGHTS.marketDemand,
        description: md >= 60
          ? 'Below-average TVL \u2014 growth potential'
          : 'Above-average TVL captured',
      },
    ],
  };
}

/* ── Helpers ── */
export function getCompetitionLevel(activeProjects: number): 'low' | 'medium' | 'high' {
  if (activeProjects <= 2) return 'low';
  if (activeProjects <= 10) return 'medium';
  return 'high';
}

export function getDifficulty(category: string): 'beginner' | 'intermediate' | 'advanced' {
  const advanced = ['privacy', 'intents', 'data-analytics', 'dex-trading'];
  const intermediate = ['ai-agents', 'defi', 'rwa', 'gaming', 'nfts', 'daos', 'social', 'dev-tools', 'wallets', 'infrastructure'];

  if (advanced.includes(category)) return 'advanced';
  if (intermediate.includes(category)) return 'intermediate';
  return 'beginner';
}
