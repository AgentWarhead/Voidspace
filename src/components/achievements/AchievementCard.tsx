/* ─── AchievementCard — Individual achievement display ──────── */

'use client';

import { useState } from 'react';
import { Lock, Star, StarOff, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RARITY_CONFIG, type AchievementDef } from '@/lib/achievements';

interface AchievementCardProps {
  achievement: AchievementDef;
  isUnlocked: boolean;
  isFeatured: boolean;
  unlockedAt?: number;
  onToggleFeatured?: (id: string) => void;
  featuredCount?: number;
}

export function AchievementCard({
  achievement,
  isUnlocked,
  isFeatured,
  unlockedAt,
  onToggleFeatured,
  featuredCount = 0,
}: AchievementCardProps) {
  const [expanded, setExpanded] = useState(false);
  const rarity = RARITY_CONFIG[achievement.rarity];
  const isSecret = achievement.secret && !isUnlocked;

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn(
        'relative w-full text-left rounded-xl border p-3 transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98]',
        isUnlocked
          ? cn('bg-surface/80', rarity.border, 'hover:shadow-lg')
          : 'bg-surface/30 border-border/50 opacity-60 hover:opacity-80',
        isFeatured && 'ring-2 ring-amber-400/50',
        achievement.rarity === 'legendary' && isUnlocked && 'animate-pulse-subtle',
      )}
    >
      {/* Rarity glow for unlocked */}
      {isUnlocked && (
        <div
          className={cn(
            'absolute inset-0 rounded-xl opacity-10',
            achievement.rarity === 'legendary' && 'bg-gradient-to-br from-amber-500 to-orange-600',
            achievement.rarity === 'epic' && 'bg-gradient-to-br from-purple-500 to-indigo-600',
            achievement.rarity === 'rare' && 'bg-gradient-to-br from-blue-500 to-cyan-600',
          )}
        />
      )}

      <div className="relative flex items-start gap-3">
        {/* Emoji / Lock */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl',
            isUnlocked
              ? 'bg-white/10'
              : 'bg-white/5',
          )}
        >
          {isSecret ? (
            <HelpCircle className="w-5 h-5 text-text-muted" />
          ) : isUnlocked ? (
            achievement.emoji
          ) : (
            <Lock className="w-4 h-4 text-text-muted" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-semibold truncate',
                isUnlocked ? 'text-text-primary' : 'text-text-muted',
              )}
            >
              {isSecret ? '???' : achievement.name}
            </span>
            <span
              className={cn(
                'text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium',
                rarity.color,
                isUnlocked ? 'bg-white/10' : 'bg-white/5',
              )}
            >
              {rarity.label}
            </span>
          </div>

          <p className={cn(
            'text-xs mt-0.5 line-clamp-2',
            isUnlocked ? 'text-text-secondary' : 'text-text-muted',
          )}>
            {isSecret ? (achievement.hint || 'A mystery awaits...') : achievement.description}
          </p>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-2 pt-2 border-t border-border/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-near-green font-mono">+{achievement.xp} XP</span>
                {unlockedAt && (
                  <span className="text-[10px] text-text-muted">
                    {formatTimeAgo(unlockedAt)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Featured star */}
        {isUnlocked && onToggleFeatured && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFeatured(achievement.id);
            }}
            disabled={!isFeatured && featuredCount >= 3}
            className={cn(
              'flex-shrink-0 p-1 rounded transition-colors',
              isFeatured
                ? 'text-amber-400 hover:text-amber-300'
                : featuredCount >= 3
                  ? 'text-text-muted/30 cursor-not-allowed'
                  : 'text-text-muted hover:text-amber-400',
            )}
            title={isFeatured ? 'Unpin from profile' : featuredCount >= 3 ? 'Max 3 featured' : 'Pin to profile'}
          >
            {isFeatured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
          </button>
        )}
      </div>
    </button>
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
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
