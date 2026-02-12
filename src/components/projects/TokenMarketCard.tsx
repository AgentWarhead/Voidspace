'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, BarChart3, Droplets } from 'lucide-react';
import type { TokenData } from '@/lib/dexscreener';

interface TokenMarketCardProps {
  /** Token symbol to look up (e.g. "REF", "NEAR") */
  symbol?: string | null;
  /** Contract address to look up (takes priority over symbol) */
  address?: string | null;
}

function formatUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.0001) return `$${value.toFixed(6)}`;
  return `$${value.toExponential(2)}`;
}

function PriceChange({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 font-mono text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{value?.toFixed(2) ?? '0.00'}%
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-text-muted uppercase tracking-wide font-mono">{label}</p>
      <p className="text-sm font-bold text-text-primary font-mono">{value}</p>
    </div>
  );
}

export function TokenMarketCard({ symbol, address }: TokenMarketCardProps) {
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!symbol && !address) {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (address) {
      params.set('address', address);
    } else if (symbol) {
      params.set('symbol', symbol);
    }

    let cancelled = false;

    fetch(`/api/dex-token?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setToken(data?.token || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [symbol, address]);

  // Don't render anything if no identifier given or token not found
  if (!symbol && !address) return null;
  if (!loading && !token && !error) return null;
  if (error) return null; // Silently hide — many projects won't have tokens

  if (loading) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-surface/50 p-6 animate-pulse">
        <div className="h-5 w-40 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 bg-white/10 rounded" />
              <div className="h-5 w-24 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!token) return null;

  const buys24h = token.txns24h?.buys ?? 0;
  const sells24h = token.txns24h?.sells ?? 0;
  const totalTxns = buys24h + sells24h;
  const buyRatio = totalTxns > 0 ? ((buys24h / totalTxns) * 100).toFixed(0) : '-';

  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface/50 backdrop-blur-sm relative overflow-hidden">
      {/* Subtle scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-near-green/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {token.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={token.imageUrl}
                alt={`${token.symbol} logo`}
                className="w-8 h-8 rounded-full bg-surface-hover"
                width={32}
                height={32}
              />
            )}
            <div>
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-near-green" />
                Token Market Data
              </h3>
              <p className="text-xs text-text-muted font-mono">
                {token.symbol} · {token.dexId || 'DEX'} · Live
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-text-primary font-mono">
              {formatUsd(token.price)}
            </p>
            <PriceChange value={token.priceChange24h} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <MiniStat label="1h Change" value={<PriceChange value={token.priceChange1h} />} />
          <MiniStat label="6h Change" value={<PriceChange value={token.priceChange6h} />} />
          <MiniStat label="24h Volume" value={formatUsd(token.volume24h)} />
          <MiniStat
            label="Liquidity"
            value={
              <span className="inline-flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                {formatUsd(token.liquidity)}
              </span>
            }
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <MiniStat label="Market Cap" value={token.marketCap > 0 ? formatUsd(token.marketCap) : '-'} />
          <MiniStat label="FDV" value={token.fdv ? formatUsd(token.fdv) : '-'} />
          <MiniStat
            label="Buy/Sell (24h)"
            value={totalTxns > 0 ? `${buys24h}/${sells24h} (${buyRatio}% buy)` : '-'}
          />
          <MiniStat
            label="Pair Created"
            value={
              token.pairCreatedAt
                ? new Date(token.pairCreatedAt).toLocaleDateString()
                : '-'
            }
          />
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 flex-wrap">
          {token.dexScreenerUrl && (
            <a
              href={token.dexScreenerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-near-green transition-colors px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-near-green/30"
            >
              <ExternalLink className="w-3 h-3" />
              DexScreener
            </a>
          )}
          {token.refFinanceUrl && (
            <a
              href={token.refFinanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-near-green transition-colors px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-near-green/30"
            >
              <ExternalLink className="w-3 h-3" />
              Ref Finance
            </a>
          )}
          {token.websites?.map((w) => (
            <a
              key={w.url}
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-near-green transition-colors px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-near-green/30"
            >
              <ExternalLink className="w-3 h-3" />
              {w.label || 'Website'}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
