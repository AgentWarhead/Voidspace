'use client';

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import {
  ACHIEVEMENT_MAP,
  RARITY_CONFIG,
} from '@/lib/achievements';
import type { AchievementTimelineEntry } from '@/hooks/useAchievements';

interface AchievementTimelineProps {
  timeline: AchievementTimelineEntry[];
  limit?: number;
}

export function AchievementTimeline({ timeline, limit = 10 }: AchievementTimelineProps) {
  // Sort by most recent first, take top N
  const entries = [...timeline]
    .sort((a, b) => b.unlockedAt - a.unlockedAt)
    .slice(0, limit);

  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-text-muted text-sm">
        No achievements unlocked yet. Start exploring!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-3">
        <Clock className="w-3 h-3" />
        Recently Unlocked
      </h4>
      <div className="space-y-1.5">
        {entries.map((entry) => {
          const def = ACHIEVEMENT_MAP[entry.id];
          if (!def) return null;
          const rarity = RARITY_CONFIG[def.rarity];

          return (
            <div
              key={`${entry.id}-${entry.unlockedAt}`}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-base flex-shrink-0">{def.emoji}</span>
              <span className="text-sm text-text-primary truncate flex-1">{def.name}</span>
              <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/5', rarity.color)}>
                {rarity.label}
              </span>
              <span className="text-[11px] text-text-muted whitespace-nowrap">
                {formatTimeAgo(entry.unlockedAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
