import type { TierName, TierConfig } from '@/types';
import type { SanctumTier } from '@/lib/sanctum-tiers';

/**
 * Identity mapping — TierName and SanctumTier now use the same keys.
 * Kept for backwards compatibility with any code referencing TIER_TO_SANCTUM.
 */
export const TIER_TO_SANCTUM: Record<TierName, SanctumTier> = {
  shade: 'shade',
  specter: 'specter',
  legion: 'legion',
  leviathan: 'leviathan',
};

export const TIERS: Record<TierName, TierConfig> = {
  shade: {
    name: 'Shade',
    tagline: 'Try Sanctum risk-free',
    price: 0,
    briefsPerMonth: 3,
    previewsPerDay: 3,
    maxSaved: 5,
    color: '#666666',
    features: ['dashboard', 'browse', 'preview', 'briefs'],
  },
  specter: {
    name: 'Specter',
    tagline: 'For solo builders getting started',
    price: 25,
    briefsPerMonth: 10,
    previewsPerDay: 999,
    maxSaved: 50,
    color: '#00EC97',
    features: ['dashboard', 'browse', 'preview', 'briefs', 'export', 'history'],
  },
  legion: {
    name: 'Legion',
    tagline: 'Best value for serious builders',
    price: 60,
    briefsPerMonth: 50,
    previewsPerDay: 999,
    maxSaved: 999,
    color: '#00D4FF',
    features: ['dashboard', 'browse', 'preview', 'briefs', 'export', 'history', 'audit', 'priority'],
  },
  leviathan: {
    name: 'Leviathan',
    tagline: 'For teams and production workloads',
    price: 200,
    briefsPerMonth: 999,
    previewsPerDay: 999,
    maxSaved: 999,
    color: '#9D4EDD',
    features: ['all'],
  },
} as const;

export function canGenerateBrief(tier: TierName, usageCount: number): boolean {
  return usageCount < TIERS[tier].briefsPerMonth;
}

export function canPreview(tier: TierName, previewsToday: number): boolean {
  return previewsToday < TIERS[tier].previewsPerDay;
}

export function canSaveOpportunity(tier: TierName, savedCount: number): boolean {
  return savedCount < TIERS[tier].maxSaved;
}

export function getTierColor(tier: TierName): string {
  return TIERS[tier].color;
}
