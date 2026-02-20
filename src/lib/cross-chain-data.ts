// ============================================================
// Cross-Chain Competition Data
// ============================================================
// NOTE: Static competitor data was removed (was hardcoded demo content for Nearcon).
// All functions return empty results so consumers render nothing rather than stale data.

export interface CrossChainCompetitor {
  name: string;
  chain: 'Ethereum' | 'Solana' | 'Polygon' | 'Arbitrum' | 'Base' | 'Avalanche';
  category: string;
  tvl?: string;
  description: string;
}

// Chain colors for UI
export const CHAIN_COLORS = {
  Ethereum: '#627EEA',
  Solana: '#9945FF',
  Polygon: '#8247E5',
  Arbitrum: '#28A0F0',
  Base: '#0052FF',
  Avalanche: '#E84142'
} as const;

// Chain emojis for visual distinction
export const CHAIN_EMOJIS = {
  Ethereum: '⟠',
  Solana: '◎',
  Polygon: '⬢',
  Arbitrum: '🅰',
  Base: '🔵',
  Avalanche: '🔺'
} as const;

/**
 * Get competitors for a specific category.
 * Returns empty — no live data source available for cross-chain TVL.
 */
export function getCompetitorsForCategory(_categorySlug: string): CrossChainCompetitor[] {
  return [];
}

/**
 * Get summary stats for a category's cross-chain competition.
 * Returns zeroed summary — no live data source available.
 */
export function getCategoryCompetitionSummary(_categorySlug: string) {
  return {
    totalCompetitors: 0,
    chainStats: {} as Record<string, number>,
    totalTVL: 0,
    topChains: [] as { chain: string; count: number }[],
  };
}

/**
 * Get all available categories with competitor data.
 * Returns empty — no live data source available.
 */
export function getAvailableCategories(): string[] {
  return [];
}

/**
 * Get a cross-chain insight string.
 * Returns empty — no live data source available.
 */
export function getRandomCrossChainInsight(): string {
  return '';
}
