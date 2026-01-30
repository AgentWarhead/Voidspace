import type { GapScoreInput } from '@/types';

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

export function getCompetitionLevel(activeProjects: number): 'low' | 'medium' | 'high' {
  if (activeProjects <= 2) return 'low';
  if (activeProjects <= 10) return 'medium';
  return 'high';
}

export function getDifficulty(category: string): 'beginner' | 'intermediate' | 'advanced' {
  const advanced = ['privacy', 'intents'];
  const intermediate = ['ai-agents', 'defi', 'rwa'];

  if (advanced.includes(category)) return 'advanced';
  if (intermediate.includes(category)) return 'intermediate';
  return 'beginner';
}
