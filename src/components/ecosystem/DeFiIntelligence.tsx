'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { DeFiOverview } from './DeFiOverview';
import { TopMovers } from './TopMovers';
import { NewPairs } from './NewPairs';

interface BubbleStats {
  totalTokens: number;
  totalMarketCap: number;
  totalVolume24h: number;
  totalLiquidity: number;
  gainersCount: number;
  losersCount: number;
  avgHealthScore: number;
  categoryBreakdown: Record<string, number>;
}

interface BubbleToken {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  imageUrl?: string;
  dexScreenerUrl?: string;
  pairCreatedAt?: string;
}

export function DeFiIntelligence() {
  const [stats, setStats] = useState<BubbleStats | null>(null);
  const [tokens, setTokens] = useState<BubbleToken[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch('/api/void-bubbles');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (cancelled) return;
        setStats(data?.stats ?? null);
        setTokens(data?.tokens ?? []);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (error) return null; // Fail silently — rest of the page still works

  return (
    <>
      {/* DeFi Overview Banner */}
      <ScrollReveal delay={0.05}>
        <section>
          <SectionHeader title="DeFi Market Intelligence" badge="DEXSCREENER" />
          <p className="text-xs text-text-muted mb-4 -mt-2">
            Live liquidity, volume, and health metrics across NEAR DEX trading pairs — powered by DexScreener.
          </p>
          <DeFiOverview stats={stats} />
        </section>
      </ScrollReveal>

      {/* Top Movers */}
      <ScrollReveal delay={0.08}>
        <section>
          <SectionHeader title="Top Movers" badge="24H" />
          <p className="text-xs text-text-muted mb-4 -mt-2">
            Biggest gainers and losers by 24-hour price change across NEAR DeFi.
          </p>
          <TopMovers tokens={tokens} />
        </section>
      </ScrollReveal>

      {/* New Pairs */}
      <ScrollReveal delay={0.11}>
        <section>
          <SectionHeader title="Newest Pairs" badge="GROWTH" />
          <p className="text-xs text-text-muted mb-4 -mt-2">
            Recently created trading pairs signal ecosystem growth — new projects launching on NEAR.
          </p>
          <NewPairs tokens={tokens} />
        </section>
      </ScrollReveal>
    </>
  );
}
