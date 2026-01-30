'use client';

import { Globe, Users, Box, Network, Zap } from 'lucide-react';
import { Card, InfoTooltip } from '@/components/ui';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { ScanLine } from '@/components/effects/ScanLine';
import { formatNumber } from '@/lib/utils';
import { HELP_CONTENT } from '@/lib/help-content';
import type { ChainStatsRecord } from '@/types';

interface ChainHealthProps {
  chainStats: ChainStatsRecord | null;
}

const statItems = [
  { key: 'total_transactions', label: 'Total Txns', icon: Globe, helpKey: 'totalTransactions' as const },
  { key: 'total_accounts', label: 'Total Accounts', icon: Users, helpKey: 'totalAccounts' as const },
  { key: 'block_height', label: 'Block Height', icon: Box, helpKey: 'blockHeight' as const },
  { key: 'nodes_online', label: 'Nodes Online', icon: Network, helpKey: 'nodesOnline' as const },
  { key: 'avg_block_time', label: 'Avg Block Time', icon: Zap, helpKey: 'avgBlockTime' as const },
] as const;

function formatBlockTime(seconds: number): string {
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
  return `${seconds.toFixed(1)}s`;
}

export function ChainHealth({ chainStats }: ChainHealthProps) {
  if (!chainStats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const rawValue = Number(chainStats[item.key]) || 0;
        const isBlockTime = item.key === 'avg_block_time';

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
                  <InfoTooltip term={HELP_CONTENT[item.helpKey].term}>
                    <p>{HELP_CONTENT[item.helpKey].description}</p>
                  </InfoTooltip>
                </p>
                <p className="text-xl font-bold text-text-primary">
                  {isBlockTime ? (
                    formatBlockTime(rawValue)
                  ) : (
                    <AnimatedCounter value={rawValue} formatter={formatNumber} />
                  )}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
