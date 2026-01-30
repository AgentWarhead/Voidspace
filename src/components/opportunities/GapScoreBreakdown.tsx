'use client';

import { Card, Badge } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';
import { Progress } from '@/components/ui';
import type { GapScoreBreakdown as GapScoreBreakdownType } from '@/types';

interface GapScoreBreakdownProps {
  breakdown: GapScoreBreakdownType;
}

export function GapScoreBreakdown({ breakdown }: GapScoreBreakdownProps) {
  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden">
      <ScanLine />
      <div className="relative z-10 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
          Score Breakdown
        </h3>

        <div className="space-y-3">
          <BreakdownRow
            label="Demand Score"
            description="log10(TVL + Volume x 100 + 1)"
            value={breakdown.demandScore}
            maxValue={12}
          />

          <BreakdownRow
            label="Active Supply"
            description={`${breakdown.activeSupply} active projects competing`}
            value={breakdown.activeSupply}
            maxValue={20}
            invert
          />

          <BreakdownRow
            label="Base Score"
            description="(Demand / Supply) x 10"
            value={breakdown.baseScore}
            maxValue={100}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Strategic Multiplier</span>
            <Badge variant="default" className={breakdown.strategicMultiplier > 1 ? 'bg-near-green/10 text-near-green' : ''}>
              {breakdown.strategicMultiplier}x
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Supply Modifier</span>
            <Badge variant="default" className={breakdown.supplyModifier > 1 ? 'bg-near-green/10 text-near-green' : breakdown.supplyModifier < 1 ? 'bg-red-500/10 text-red-400' : ''}>
              {breakdown.supplyModifierLabel}
            </Badge>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-text-primary">Final Score</span>
            <span
              className="text-2xl font-bold font-mono"
              style={{
                color: breakdown.finalScore >= 67 ? '#00EC97' : breakdown.finalScore >= 34 ? '#FFA502' : '#FF4757',
              }}
            >
              {breakdown.finalScore}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function BreakdownRow({
  label,
  description,
  value,
  maxValue,
  invert = false,
}: {
  label: string;
  description: string;
  value: number;
  maxValue: number;
  invert?: boolean;
}) {
  const pct = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">{label}</span>
        <span className="font-mono text-text-primary">{value.toFixed(1)}</span>
      </div>
      <Progress value={invert ? 100 - pct : pct} size="sm" />
      <p className="text-[10px] text-text-muted">{description}</p>
    </div>
  );
}
