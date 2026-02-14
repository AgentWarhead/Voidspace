'use client';

import { cn } from '@/lib/utils';
import {
  ACHIEVEMENTS,
  CATEGORY_CONFIG,
  totalAchievementXP,
  type AchievementCategory,
} from '@/lib/achievements';
import { Trophy } from 'lucide-react';

interface AchievementProgressProps {
  unlocked: Set<string>;
}

/* ─── Progress Ring (SVG) ──────────────────────────────────── */

function ProgressRing({
  percent,
  emoji,
  label,
  detail,
  size = 48,
}: {
  percent: number;
  emoji: string;
  label: string;
  detail: string;
  size?: number;
}) {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="group relative flex flex-col items-center gap-1" title={`${label}: ${detail}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-border"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            'transition-all duration-500',
            percent === 100 ? 'text-near-green' : percent > 0 ? 'text-cyan-400' : 'text-border',
          )}
        />
      </svg>
      {/* Emoji center (overlaid) */}
      <span className="absolute top-0 flex items-center justify-center text-sm" style={{ width: size, height: size }}>
        {emoji}
      </span>
      {/* Tooltip on hover */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap">
        <div className="bg-zinc-900 border border-border rounded-md px-2 py-1 text-[10px] text-text-secondary shadow-lg">
          {label}: {detail}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function AchievementProgress({ unlocked }: AchievementProgressProps) {
  const totalUnlocked = ACHIEVEMENTS.filter(a => unlocked.has(a.id)).length;
  const totalCount = ACHIEVEMENTS.length;
  const xp = totalAchievementXP(unlocked);

  // Per-category progress
  const categories = (Object.keys(CATEGORY_CONFIG) as AchievementCategory[]).map(cat => {
    const config = CATEGORY_CONFIG[cat];
    const all = ACHIEVEMENTS.filter(a => a.category === cat);
    const done = all.filter(a => unlocked.has(a.id)).length;
    const percent = all.length > 0 ? Math.round((done / all.length) * 100) : 0;
    return { cat, config, done, total: all.length, percent };
  });

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-text-primary">
            {totalUnlocked} / {totalCount}
          </span>
          <span className="text-xs text-text-muted">achievements</span>
        </div>
        <span className="text-sm font-mono text-near-green">
          {xp.toLocaleString()} XP
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-near-green transition-all duration-500"
          style={{ width: `${totalCount > 0 ? (totalUnlocked / totalCount) * 100 : 0}%` }}
        />
      </div>

      {/* Category rings */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-2">
        {categories.map(({ cat, config, done, total, percent }) => (
          <ProgressRing
            key={cat}
            percent={percent}
            emoji={config.emoji}
            label={config.label}
            detail={`${done}/${total}`}
          />
        ))}
      </div>
    </div>
  );
}
