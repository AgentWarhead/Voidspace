'use client';

import { Users, TrendingUp, Zap, Target, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScanLine } from '@/components/effects/ScanLine';
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

const SIGNAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Builder Gap': Users,
  'Market Control': TrendingUp,
  'Dev Momentum': Zap,
  'NEAR Focus': Target,
  'Untapped Demand': BarChart3,
};

function getSignalColor(value: number): { border: string; text: string; bar: string } {
  if (value >= 80) return { border: 'border-near-green/40', text: 'text-near-green', bar: '#00EC97' };
  if (value >= 60) return { border: 'border-amber-400/40', text: 'text-amber-400', bar: '#FBBF24' };
  return { border: 'border-white/10', text: 'text-text-muted', bar: '#6B7280' };
}

export function GapScoreBreakdown({ breakdown }: GapScoreBreakdownProps) {
  const narrative = generateNarrative(breakdown);

  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden">
      <ScanLine />
      <div className="relative z-10 space-y-4">
        <h3 className="text-xs sm:text-sm font-semibold text-text-primary uppercase tracking-wide">
          Void Analysis
        </h3>

        <p className="text-xs text-text-secondary leading-relaxed italic">
          {narrative}
        </p>

        {/* Signal cards — 2-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {breakdown.signals.map((signal, i) => {
            const colors = getSignalColor(signal.value);
            const Icon = SIGNAL_ICONS[signal.label] ?? BarChart3;
            return (
              <div
                key={i}
                className={`rounded-xl border-l-4 border border-white/[0.06] bg-white/[0.03] p-3 flex flex-col gap-2 ${colors.border}`}
              >
                {/* Top row: icon + label + score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${colors.text}`} />
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted leading-tight">
                      {signal.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0">
                    <span className={`text-xl font-bold font-mono leading-none ${colors.text}`}>
                      {signal.value}
                    </span>
                    <span className="text-[9px] font-mono text-text-muted">/100</span>
                  </div>
                </div>

                {/* Thin colored bar */}
                <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${signal.value}%`, backgroundColor: colors.bar }}
                  />
                </div>

                {/* Weight + description */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] text-text-muted leading-snug flex-1">{signal.description}</p>
                  <span className="text-[9px] font-mono text-text-muted/60 shrink-0 mt-0.5">
                    {Math.round(signal.weight * 100)}% wt
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final score summary */}
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
    </Card>
  );
}
