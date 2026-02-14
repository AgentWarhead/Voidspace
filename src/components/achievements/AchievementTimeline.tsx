/* ─── AchievementTimeline — Recently Unlocked feed ──────────── */

'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ACHIEVEMENT_MAP, RARITY_CONFIG } from '@/lib/achievements';
import type { AchievementTimelineEntry } from '@/hooks/useAchievements';

interface AchievementTimelineProps {
  timeline: AchievementTimelineEntry[];
  limit?: number;
}

export function AchievementTimeline({ timeline, limit = 10 }: AchievementTimelineProps) {
  const recent = useMemo(
    () => [...timeline].sort((a, b) => b.unlockedAt - a.unlockedAt).slice(0, limit),
    [timeline, limit]
  );

  if (recent.length === 0) {
    return (
      <div className="text-center py-6 text-text-muted text-sm">
        No achievements unlocked yet. Start exploring! 🌌
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {recent.map((entry) => {
        const def = ACHIEVEMENT_MAP[entry.id];
        if (!def) return null;
        const rarity = RARITY_CONFIG[def.rarity];

        return (
          <div
            key={`${entry.id}-${entry.unlockedAt}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface/50 border border-border/30 hover:border-border/60 transition-colors"
          >
            <span className="text-lg flex-shrink-0">{def.emoji}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-text-primary truncate block">
                {def.name}
              </span>
            </div>
            <span className={cn('text-[10px] uppercase tracking-wider font-medium', rarity.color)}>
              {rarity.label}
            </span>
            <span className="text-[10px] text-text-muted whitespace-nowrap">
              {formatTimeAgo(entry.unlockedAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
