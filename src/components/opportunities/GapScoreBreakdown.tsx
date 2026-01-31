'use client';

import { Card } from '@/components/ui';
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
          Void Analysis
        </h3>

        <div className="space-y-3">
          {breakdown.signals.map((signal, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">{signal.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted font-mono">
                    {Math.round(signal.weight * 100)}%
                  </span>
                  <span className="font-mono text-text-primary">{signal.value}</span>
                </div>
              </div>
              <Progress value={signal.value} size="sm" />
              <p className="text-[10px] text-text-muted">{signal.description}</p>
            </div>
          ))}

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-text-primary">Void Score</span>
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
