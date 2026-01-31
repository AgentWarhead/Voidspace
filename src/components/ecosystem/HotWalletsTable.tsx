'use client';

import { Wallet } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';
import { formatNumber } from '@/lib/utils';

interface HotWallet {
  account_id: string;
  amount: number;
}

interface HotWalletsTableProps {
  wallets: HotWallet[];
}

export function HotWalletsTable({ wallets }: HotWalletsTableProps) {
  if (!wallets || wallets.length === 0) return null;

  const maxAmount = wallets[0]?.amount || 1;

  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden">
      <ScanLine />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-4 h-4 text-near-green" />
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Hot Wallets (Top 20)
          </h3>
        </div>

        <div className="space-y-1.5 overflow-x-auto">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 text-[10px] text-text-muted uppercase tracking-wide font-mono px-2">
            <span>Account</span>
            <span className="text-right">Balance (NEAR)</span>
            <span />
          </div>

          {/* Rows */}
          {wallets.slice(0, 20).map((wallet, i) => {
            const pct = (wallet.amount / maxAmount) * 100;
            return (
              <div
                key={wallet.account_id}
                className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center px-2 py-1.5 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-text-muted font-mono w-5 shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-xs font-mono text-text-primary truncate">
                    {wallet.account_id}
                  </span>
                </div>
                <span className="text-xs font-mono text-text-primary text-right whitespace-nowrap">
                  {formatNumber(wallet.amount)}
                </span>
                <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
                  <div
                    className="h-full rounded-full bg-near-green/40"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
