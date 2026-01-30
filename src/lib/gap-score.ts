import type { GapScoreInput, GapScoreBreakdown } from '@/types';

export function calculateGapScore(input: GapScoreInput): number {
  // Demand Score = log10(TVL + Transaction Volume x 100 + 1)
  const demandScore = Math.log10(
    input.totalTVL + input.transactionVolume * 100 + 1
  );

  // Active Supply (avoid division by zero)
  const activeSupply = Math.max(input.activeProjects, 0.5);

  // Base Gap Score
  let gapScore = (demandScore / activeSupply) * 10;

  // Strategic Multiplier (2x for strategic categories)
  if (input.isStrategic) {
    gapScore *= input.strategicMultiplier;
  }

  // Supply Modifiers
  if (input.activeProjects <= 2) {
    gapScore *= 1.5; // Very low supply: +50% bonus
  } else if (input.activeProjects <= 5) {
    gapScore *= 1.2; // Low supply: +20% bonus
  } else if (input.activeProjects > 20) {
    gapScore *= 0.7; // Oversaturated: -30% penalty
  }

  // Normalize to 0-100
  return Math.min(Math.round(gapScore), 100);
}

export function calculateGapScoreBreakdown(input: GapScoreInput): GapScoreBreakdown {
  const demandScore = Math.log10(
    input.totalTVL + input.transactionVolume * 100 + 1
  );
  const activeSupply = Math.max(input.activeProjects, 0.5);
  const baseScore = (demandScore / activeSupply) * 10;
  const strategicMultiplier = input.isStrategic ? input.strategicMultiplier : 1;

  let supplyModifier = 1;
  let supplyModifierLabel = 'Normal';
  if (input.activeProjects <= 2) {
    supplyModifier = 1.5;
    supplyModifierLabel = 'Very Low Supply (+50%)';
  } else if (input.activeProjects <= 5) {
    supplyModifier = 1.2;
    supplyModifierLabel = 'Low Supply (+20%)';
  } else if (input.activeProjects > 20) {
    supplyModifier = 0.7;
    supplyModifierLabel = 'Oversaturated (-30%)';
  }

  const finalScore = Math.min(Math.round(baseScore * strategicMultiplier * supplyModifier), 100);

  return {
    demandScore: Math.round(demandScore * 100) / 100,
    activeSupply,
    baseScore: Math.round(baseScore * 100) / 100,
    strategicMultiplier,
    supplyModifier,
    supplyModifierLabel,
    finalScore,
  };
}

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
