'use client';

import Image from 'next/image';
import { Card } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';
import { formatCurrency, timeAgo } from '@/lib/utils';

interface TokenData {
  symbol: string;
  name: string;
  liquidity: number;
  imageUrl?: string;
  pairCreatedAt?: string;
  dexScreenerUrl?: string;
}

export function NewPairs({ tokens }: { tokens: TokenData[] }) {
  // Filter tokens that have a pairCreatedAt, sort newest first
  const withDates = (tokens || [])
    .filter((t) => t.pairCreatedAt)
    .sort((a, b) => {
      const dateA = new Date(a.pairCreatedAt!).getTime();
      const dateB = new Date(b.pairCreatedAt!).getTime();
      return dateB - dateA;
    })
    .slice(0, 8);

  if (withDates.length === 0) {
    return (
      <Card variant="glass" padding="lg" className="relative overflow-hidden">
        <ScanLine />
        <p className="text-sm text-text-muted text-center relative z-10">
          No recent pair data available.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="md" className="relative overflow-hidden">
      <ScanLine />
      <div className="relative z-10">
        <div className="grid gap-1">
          {withDates.map((token) => {
            const href = token.dexScreenerUrl || '/void-bubbles';
            return (
              <a
                key={`${token.symbol}-${token.pairCreatedAt}`}
                href={href}
                target={token.dexScreenerUrl ? '_blank' : undefined}
                rel={token.dexScreenerUrl ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/5 transition-colors"
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

                {/* Name + symbol */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-medium text-text-primary truncate">
                    {token.name}
                  </p>
                  <p className="text-[10px] text-text-muted font-mono">{token.symbol}</p>
                </div>

                {/* Age */}
                <span className="text-[10px] font-mono text-near-green/70 bg-near-green/10 px-2 py-0.5 rounded-full border border-near-green/20 whitespace-nowrap">
                  {timeAgo(token.pairCreatedAt!)}
                </span>

                {/* Liquidity */}
                <span className="text-xs font-mono text-text-secondary w-20 text-right hidden sm:block">
                  {formatCurrency(token.liquidity)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
