'use client';

import { Card } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';
import { Progress } from '@/components/ui';
import type { GapScoreBreakdown as GapScoreBreakdownType } from '@/types';

interface GapScoreBreakdownProps {
  breakdown: GapScoreBreakdownType;
}

function generateNarrative(breakdown: GapScoreBreakdownType): string {
  const reasons: string[] = [];
  const signals = breakdown.signals;
  const strong = signals.filter((s) => s.value >= 60).sort((a, b) => b.value * b.weight - a.value * a.weight);
  for (const s of strong.slice(0, 3)) {
    if (s.label === 'Builder Gap') reasons.push('very few teams are building here');
    else if (s.label === 'Market Control') reasons.push('the market is dominated by a few players');
    else if (s.label === 'Dev Momentum') reasons.push('development activity has slowed');
    else if (s.label === 'NEAR Focus') reasons.push('NEAR Foundation considers this a strategic priority');
    else if (s.label === 'Untapped Demand') reasons.push('user demand isn\u2019t being met');
  }
  if (reasons.length === 0) return `This void scores ${breakdown.finalScore}/100.`;
  const joined = reasons.length === 1 ? reasons[0] : reasons.slice(0, -1).join(', ') + ', and ' + reasons[reasons.length - 1];
  return `This void scores ${breakdown.finalScore}/100 because ${joined}.`;
}

export function GapScoreBreakdown({ breakdown }: GapScoreBreakdownProps) {
  const narrative = generateNarrative(breakdown);

  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden">
      <ScanLine />
      <div className="relative z-10 space-y-3 sm:space-y-4">
        <h3 className="text-xs sm:text-sm font-semibold text-text-primary uppercase tracking-wide">
          Void Analysis
        </h3>

        <p className="text-xs text-text-secondary leading-relaxed italic">
          {narrative}
        </p>

        <div className="space-y-2.5 sm:space-y-3">
          {breakdown.signals.map((signal, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-text-muted truncate mr-2">{signal.label}</span>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="text-[10px] text-text-muted font-mono">
                    {Math.round(signal.weight * 100)}%
                  </span>
                  <span className="font-mono text-text-primary">{signal.value}</span>
                </div>
              </div>
              <Progress value={signal.value} size="sm" />
              <p className="text-[10px] text-text-muted leading-snug">{signal.description}</p>
            </div>
          ))}

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-text-primary">Void Score</span>
            <span
              className="text-xl sm:text-2xl font-bold font-mono"
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
