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
    tagline: 'Glimpse the void',
    price: 0,
    briefsPerMonth: 3, // 3 per month for free tier
    previewsPerDay: 3,
    maxSaved: 5,
    color: '#666666',
    features: ['dashboard', 'browse', 'preview', 'briefs'],
  },
  specter: {
    name: 'Specter',
    tagline: 'See what others miss',
    price: 14.99,
    briefsPerMonth: 10,
    previewsPerDay: 999,
    maxSaved: 999,
    color: '#00EC97',
    features: ['dashboard', 'browse', 'preview', 'briefs', 'export', 'history'],
  },
  legion: {
    name: 'Legion',
    tagline: 'Hunt as one',
    price: 49.99,
    briefsPerMonth: 50,
    previewsPerDay: 999,
    maxSaved: 999,
    color: '#00D4FF',
    features: ['dashboard', 'browse', 'preview', 'briefs', 'export', 'history', 'team', 'api'],
  },
  leviathan: {
    name: 'Leviathan',
    tagline: 'Command the abyss',
    price: null,
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
