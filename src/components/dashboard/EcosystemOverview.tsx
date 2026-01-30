'use client';

import { Layers, Activity, DollarSign, Grid3X3, Target } from 'lucide-react';
import { Card, InfoTooltip } from '@/components/ui';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { ScanLine } from '@/components/effects/ScanLine';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { HELP_CONTENT } from '@/lib/help-content';
import type { EcosystemStats } from '@/types';

interface EcosystemOverviewProps {
  stats: EcosystemStats;
  avgGapScore?: number;
}

const statItems = [
  { key: 'totalProjects', label: 'Total Projects', icon: Layers, format: formatNumber },
  { key: 'activeProjects', label: 'Active Projects', icon: Activity, format: formatNumber },
  { key: 'totalTVL', label: 'Total TVL', icon: DollarSign, format: formatCurrency },
  { key: 'categoryCount', label: 'Categories', icon: Grid3X3, format: formatNumber },
] as const;

export function EcosystemOverview({ stats, avgGapScore }: EcosystemOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];
        return (
          <Card key={item.key} variant="glass" padding="md" className="relative overflow-hidden">
            <ScanLine />
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-near-green/10">
                <Icon className="w-5 h-5 text-near-green" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide font-mono flex items-center">
                  {item.label}
                  {item.key === 'totalTVL' && (
                    <InfoTooltip term={HELP_CONTENT.tvl.term}>
                      <p>{HELP_CONTENT.tvl.description}</p>
                    </InfoTooltip>
                  )}
                </p>
                <p className="text-xl font-bold text-text-primary">
                  <AnimatedCounter value={value} formatter={item.format} />
                </p>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Avg Gap Score — Ecosystem Pulse */}
      {avgGapScore !== undefined && (
        <Card variant="glass" padding="md" className="relative overflow-hidden">
          <ScanLine />
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-near-green/10">
              <Target className="w-5 h-5 text-near-green" />
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wide font-mono flex items-center">
                Avg Gap Score
                <InfoTooltip term={HELP_CONTENT.gapScore.term}>
                  <p>{HELP_CONTENT.gapScore.description}</p>
                </InfoTooltip>
              </p>
              <p className="text-xl font-bold text-text-primary">
                <AnimatedCounter value={avgGapScore} formatter={formatNumber} />
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
