'use client';

import Image from 'next/image';
import { Card } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  imageUrl?: string;
  dexScreenerUrl?: string;
}

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return vol.toFixed(0);
}

function MoverRow({ token, maxVolume }: { token: TokenData; maxVolume: number }) {
  const isPositive = token.priceChange24h >= 0;
  const barWidth = maxVolume > 0 ? Math.max(4, (token.volume24h / maxVolume) * 100) : 4;
  const href = token.dexScreenerUrl || '/void-bubbles';

  return (
    <a
      href={href}
      target={token.dexScreenerUrl ? '_blank' : undefined}
      rel={token.dexScreenerUrl ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/5 transition-colors group"
    >
      {/* Token logo */}
      <div className="w-7 h-7 rounded-full bg-surface border border-border overflow-hidden flex-shrink-0">
        {token.imageUrl ? (
          <Image
            src={token.imageUrl}
            alt={token.symbol}
            width={28}
            height={28}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-text-muted">
            {token.symbol?.slice(0, 2)}
          </div>
        )}
      </div>

      {/* Symbol + price */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono font-medium text-text-primary truncate">
          {token.symbol}
        </p>
        <p className="text-[10px] text-text-muted font-mono">
          {formatPrice(token.price)}
        </p>
      </div>

      {/* Mini volume bar */}
      <div className="w-16 hidden sm:block">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${isPositive ? 'bg-near-green/50' : 'bg-error/50'}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <p className="text-[9px] text-text-muted font-mono mt-0.5 text-right">
          {formatVolume(token.volume24h)}
        </p>
      </div>

      {/* % change */}
      <span
        className={`text-xs font-mono font-semibold tabular-nums w-16 text-right ${
          isPositive ? 'text-near-green' : 'text-error'
        }`}
      >
        {isPositive ? '+' : ''}
        {token.priceChange24h?.toFixed(1)}%
      </span>
    </a>
  );
}

export function TopMovers({ tokens }: { tokens: TokenData[] }) {
  if (!tokens?.length) {
    return (
      <Card variant="glass" padding="lg" className="relative overflow-hidden">
        <ScanLine />
        <p className="text-sm text-text-muted text-center relative z-10">
          Loading DeFi market data…
        </p>
      </Card>
    );
  }

  const sorted = [...tokens].sort((a, b) => b.priceChange24h - a.priceChange24h);
  const gainers = sorted.slice(0, 5);
  const losers = sorted.filter(t => t.priceChange24h < 0).slice(-5).reverse();

  const allShown = [...gainers, ...losers];
  const maxVolume = Math.max(...allShown.map(t => t.volume24h || 0), 1);

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* Gainers */}
      <Card variant="glass" padding="md" className="relative overflow-hidden">
        <ScanLine />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-near-green text-sm">▲</span>
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-mono">
              Top Gainers (24h)
            </p>
          </div>
          <div className="space-y-0.5">
            {gainers.map((t) => (
              <MoverRow key={t.symbol} token={t} maxVolume={maxVolume} />
            ))}
          </div>
        </div>
      </Card>

      {/* Losers */}
      <Card variant="glass" padding="md" className="relative overflow-hidden">
        <ScanLine />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-error text-sm">▼</span>
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-mono">
              Top Losers (24h)
            </p>
          </div>
          <div className="space-y-0.5">
            {losers.length > 0 ? (
              losers.map((t) => (
                <MoverRow key={t.symbol} token={t} maxVolume={maxVolume} />
              ))
            ) : (
              <p className="text-xs text-text-muted py-4 text-center">All tokens are up 📈</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
