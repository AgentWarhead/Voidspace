/* ─── AchievementProgress — Visual summary with category rings ─ */

'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  ACHIEVEMENTS,
  CATEGORY_CONFIG,
  RARITY_CONFIG,
  countByRarity,
  totalAchievementXP,
  type AchievementCategory,
} from '@/lib/achievements';

interface AchievementProgressProps {
  unlocked: Set<string>;
}

export function AchievementProgress({ unlocked }: AchievementProgressProps) {
  const rarityBreakdown = useMemo(() => countByRarity(unlocked), [unlocked]);
  const achievementXP = useMemo(() => totalAchievementXP(unlocked), [unlocked]);

  const categoryProgress = useMemo(() => {
    const cats = Object.keys(CATEGORY_CONFIG) as AchievementCategory[];
    return cats.map(cat => {
      const total = ACHIEVEMENTS.filter(a => a.category === cat).length;
      const done = ACHIEVEMENTS.filter(a => a.category === cat && unlocked.has(a.id)).length;
      return { cat, total, done, pct: total > 0 ? (done / total) * 100 : 0 };
    });
  }, [unlocked]);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <span className="font-bold text-text-primary">{unlocked.size}</span>
          <span>/</span>
          <span>{ACHIEVEMENTS.length}</span>
          <span className="text-text-muted">unlocked</span>
          <span className="mx-1 text-text-muted">·</span>
          <span className="font-mono text-near-green">{achievementXP.toLocaleString()} XP</span>
        </div>

        {/* Rarity breakdown */}
        <div className="flex items-center gap-2 text-[11px]">
          {(Object.keys(RARITY_CONFIG) as Array<keyof typeof RARITY_CONFIG>).map(r => (
            <span key={r} className={cn('font-medium', RARITY_CONFIG[r].color)}>
              {rarityBreakdown[r].unlocked}/{rarityBreakdown[r].total} {RARITY_CONFIG[r].label}
            </span>
          ))}
        </div>
      </div>

      {/* Category rings */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {categoryProgress.map(({ cat, total, done, pct }) => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <div
              key={cat}
              className="group relative flex flex-col items-center gap-1"
              title={`${config.label}: ${done}/${total}`}
            >
              {/* SVG ring */}
              <div className="relative w-11 h-11">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                  {/* Background ring */}
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-border/30"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${pct * 0.942} 94.2`}
                    className={cn(
                      config.color,
                      pct === 100 && 'drop-shadow-[0_0_4px_currentColor]',
                    )}
                  />
                </svg>
                {/* Center emoji */}
                <span className="absolute inset-0 flex items-center justify-center text-sm">
                  {config.emoji}
                </span>
              </div>

              {/* Tooltip on hover */}
              <div className={cn(
                'absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap',
                'px-2 py-0.5 rounded bg-surface border border-border text-[10px]',
                'opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10',
                config.color,
              )}>
                {done}/{total}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
