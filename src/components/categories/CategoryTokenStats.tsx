'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Coins, Droplets, BarChart3, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  category: string;
  imageUrl?: string;
  dexScreenerUrl?: string;
}

interface CategoryTokenStatsProps {
  /** The category name as stored in Supabase (e.g. "DeFi & Exchanges") */
  categoryName: string;
  /** The category slug (e.g. "defi-exchanges") */
  categorySlug: string;
}

/**
 * Maps Supabase category slugs/names to DexScreener token categories.
 * The void-bubbles API uses: DeFi, Stablecoin, Infrastructure, Move-to-Earn, NFT, Meme, Gaming, AI, Other
 */
const CATEGORY_TO_TOKEN_CATEGORIES: Record<string, string[]> = {
  // slug -> token categories
  'defi-exchanges': ['DeFi'],
  'defi': ['DeFi'],
  'stablecoins': ['Stablecoin'],
  'stablecoin': ['Stablecoin'],
  'infrastructure': ['Infrastructure'],
  'gaming': ['Gaming'],
  'nft': ['NFT'],
  'nfts': ['NFT'],
  'meme': ['Meme'],
  'memes': ['Meme'],
  'ai': ['AI'],
  'move-to-earn': ['Move-to-Earn'],
  'social': ['Other'],
  'dao': ['Other'],
  'wallets': ['Infrastructure'],
  'bridges': ['Infrastructure'],
  'oracles': ['Infrastructure'],
  'privacy': ['Infrastructure'],
  'analytics': ['Other'],
  'developer-tools': ['Infrastructure'],
};

function formatUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function CategoryTokenStats({ categoryName, categorySlug }: CategoryTokenStatsProps) {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTokens() {
      try {
        const res = await fetch('/api/void-bubbles');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (cancelled) return;

        const allTokens: TokenData[] = data?.tokens || [];

        // Determine which token categories to match
        const matchCategories = CATEGORY_TO_TOKEN_CATEGORIES[categorySlug]
          || CATEGORY_TO_TOKEN_CATEGORIES[categorySlug.toLowerCase()]
          || null;

        let filtered: TokenData[];
        if (matchCategories) {
          filtered = allTokens.filter((t) => matchCategories.includes(t?.category));
        } else {
          // Fallback: try matching category name loosely
          const nameLower = categoryName.toLowerCase();
          filtered = allTokens.filter((t) => {
            const cat = t?.category?.toLowerCase() || '';
            return nameLower.includes(cat) || cat.includes(nameLower.split(' ')[0]);
          });
        }

        setTokens(filtered);
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTokens();
    return () => { cancelled = true; };
  }, [categorySlug, categoryName]);

  // Don't render if loading, error, or no tokens
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-surface border border-border" />
        ))}
      </div>
    );
  }

  if (error || tokens.length === 0) {
    return null;
  }

  // Compute aggregate stats
  const totalLiquidity = tokens.reduce((sum, t) => sum + (t?.liquidity || 0), 0);
  const totalVolume = tokens.reduce((sum, t) => sum + (t?.volume24h || 0), 0);
  const tradeableCount = tokens.filter((t) => (t?.volume24h || 0) > 0).length;

  // Top token by market cap
  const topToken = tokens.reduce<TokenData | null>((best, t) => {
    if (!best || (t?.marketCap || 0) > (best?.marketCap || 0)) return t;
    return best;
  }, null);

  const stats = [
    {
      label: 'Category Liquidity',
      value: formatUsd(totalLiquidity),
      icon: Droplets,
      color: 'text-blue-400',
    },
    {
      label: '24h Volume',
      value: formatUsd(totalVolume),
      icon: BarChart3,
      color: 'text-purple-400',
    },
    {
      label: 'Tradeable Tokens',
      value: tradeableCount.toString(),
      icon: Coins,
      color: 'text-near-green',
    },
    {
      label: 'Top Token',
      value: topToken?.symbol || '—',
      subValue: topToken ? formatUsd(topToken.marketCap || 0) : undefined,
      icon: Crown,
      color: 'text-amber-400',
      link: topToken?.dexScreenerUrl,
      change: topToken?.priceChange24h,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider flex items-center gap-2 flex-wrap">
        <Coins className="w-4 h-4 text-near-green" />
        Token Market Data
        <span className="text-xs text-text-tertiary font-normal normal-case">
          · Live from DexScreener
        </span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                'relative rounded-xl border border-border bg-surface/50 p-3 sm:p-4',
                'backdrop-blur-sm transition-colors hover:bg-surface/80',
                stat.link && 'cursor-pointer active:scale-[0.98]'
              )}
              onClick={() => {
                if (stat.link) window.open(stat.link, '_blank', 'noopener');
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('w-4 h-4', stat.color)} />
                <span className="text-xs sm:text-sm text-text-secondary">{stat.label}</span>
              </div>
              <div className="text-base sm:text-lg font-semibold text-text-primary font-mono break-words">
                {stat.value}
              </div>
              {stat.subValue && (
                <div className="text-xs text-text-tertiary mt-0.5">
                  MCap: {stat.subValue}
                </div>
              )}
              {stat.change !== undefined && stat.change !== null && (
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium mt-1',
                  stat.change >= 0 ? 'text-near-green' : 'text-error'
                )}>
                  {stat.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}% 24h
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
