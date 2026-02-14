'use client';

import { useState } from 'react';
import { Star, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  RARITY_CONFIG,
  type AchievementDef,
} from '@/lib/achievements';

interface AchievementCardProps {
  achievement: AchievementDef;
  isUnlocked: boolean;
  isFeatured: boolean;
  onToggleFeatured?: (id: string) => void;
  unlockedAt?: number;
  canFeature?: boolean;
  featured?: boolean; // alias for larger card mode
}

export function AchievementCard({
  achievement,
  isUnlocked,
  isFeatured,
  onToggleFeatured,
  unlockedAt,
  canFeature = true,
}: AchievementCardProps) {
  const [expanded, setExpanded] = useState(false);
  const rarity = RARITY_CONFIG[achievement.rarity];
  const isSecret = achievement.secret && !isUnlocked;

  const displayName = isSecret ? '???' : achievement.name;
  const displayDesc = isSecret
    ? (achievement.hint ?? 'A secret achievement...')
    : achievement.description;
  const displayEmoji = isSecret ? '🔒' : achievement.emoji;

  return (
    <div
      className={cn(
        'relative rounded-xl border p-3 transition-all cursor-pointer select-none group',
        isUnlocked
          ? cn('bg-surface/80', rarity.border, `shadow-lg ${rarity.glow}`)
          : 'bg-surface/40 border-border opacity-60 grayscale',
        isSecret && 'border-dashed border-amber-500/30',
        expanded && 'ring-1 ring-near-green/40',
      )}
      onClick={() => setExpanded(prev => !prev)}
    >
      {/* Top row */}
      <div className="flex items-start gap-2.5">
        {/* Emoji / Lock */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl',
            isUnlocked
              ? `bg-gradient-to-br ${rarity.bg}`
              : 'bg-zinc-800',
          )}
        >
          {isUnlocked ? (
            <span>{displayEmoji}</span>
          ) : (
            <Lock className="w-4 h-4 text-text-muted" />
          )}
        </div>

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'text-sm font-semibold truncate',
                isUnlocked ? 'text-text-primary' : 'text-text-muted',
                isSecret && 'italic text-amber-400/70',
              )}
            >
              {displayName}
            </span>
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', rarity.color, 'bg-white/5')}>
              {rarity.label}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{displayDesc}</p>
        </div>

        {/* XP badge */}
        <span className="text-[11px] font-mono text-near-green/70 whitespace-nowrap">
          +{achievement.xp} XP
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2 text-xs">
          <p className="text-text-secondary">{displayDesc}</p>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">
              {isUnlocked && unlockedAt
                ? `Unlocked ${formatTimeAgo(unlockedAt)}`
                : isSecret
                  ? '🥚 Secret achievement'
                  : 'Not yet unlocked'}
            </span>
            {isUnlocked && onToggleFeatured && (canFeature || isFeatured) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFeatured(achievement.id);
                }}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md transition-colors',
                  isFeatured
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-white/5 text-text-muted hover:text-amber-400',
                )}
                title={isFeatured ? 'Unpin from featured' : 'Pin to featured (max 3)'}
              >
                <Star className={cn('w-3 h-3', isFeatured && 'fill-amber-400')} />
                {isFeatured ? 'Featured' : 'Feature'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Expand indicator */}
      <div className="absolute top-3 right-2 text-text-muted/40">
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
      </div>
    </div>
  );
}

/* ─── Featured Card (larger variant for showcase) ──────────── */

export function FeaturedAchievementCard({
  achievement,
  unlockedAt,
}: {
  achievement: AchievementDef;
  unlockedAt?: number;
}) {
  const rarity = RARITY_CONFIG[achievement.rarity];

  return (
    <div
      className={cn(
        'relative rounded-xl border p-4 bg-surface/80',
        rarity.border,
        `shadow-lg ${rarity.glow}`,
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br', rarity.bg)}>
          {achievement.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-text-primary">{achievement.name}</span>
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', rarity.color, 'bg-white/5')}>
              {rarity.label}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">{achievement.description}</p>
          {unlockedAt && (
            <p className="text-[10px] text-text-muted mt-1">{formatTimeAgo(unlockedAt)}</p>
          )}
        </div>
        <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
      </div>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────── */

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
