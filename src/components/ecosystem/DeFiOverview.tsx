'use client';

import { Card } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DeFiStats {
  totalLiquidity: number;
  totalVolume24h: number;
  totalTokens: number;
  avgHealthScore: number;
  gainersCount: number;
  losersCount: number;
}

export function DeFiOverview({ stats }: { stats: DeFiStats | null }) {
  const items = [
    {
      label: 'DEX Liquidity',
      value: stats ? formatCurrency(stats.totalLiquidity) : '—',
      sub: 'Across all NEAR pairs',
    },
    {
      label: '24h Volume',
      value: stats ? formatCurrency(stats.totalVolume24h) : '—',
      sub: 'Trading activity',
    },
    {
      label: 'Active Pairs',
      value: stats ? formatNumber(stats.totalTokens) : '—',
      sub: `${stats?.gainersCount ?? 0} up · ${stats?.losersCount ?? 0} down`,
    },
    {
      label: 'Health Score',
      value: stats ? `${stats.avgHealthScore}/100` : '—',
      sub: getHealthLabel(stats?.avgHealthScore),
      color: getHealthColor(stats?.avgHealthScore),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <Card key={item.label} variant="glass" padding="md" className="relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-mono mb-1">
              {item.label}
            </p>
            <p className={`text-xl font-bold font-mono ${item.color ?? 'text-near-green'}`}>
              {item.value}
            </p>
            <p className="text-[10px] text-text-muted mt-1">{item.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function getHealthColor(score?: number): string {
  if (score == null) return 'text-text-muted';
  if (score >= 75) return 'text-near-green';
  if (score >= 50) return 'text-warning';
  return 'text-error';
}

function getHealthLabel(score?: number): string {
  if (score == null) return '—';
  if (score >= 75) return 'Ecosystem looks healthy';
  if (score >= 50) return 'Moderate risk levels';
  return 'Elevated risk detected';
}
