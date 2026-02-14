/* ─── AchievementShowcase — Full achievement section for profile ─
 * Category tabs, achievement grid, featured pins, progress rings.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useMemo, useState, useCallback } from 'react';
import { Trophy, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAchievementContext } from '@/contexts/AchievementContext';
import {
  ACHIEVEMENTS,
  CATEGORY_CONFIG,
  getDisplayable,
  type AchievementCategory,
} from '@/lib/achievements';
import { AchievementCard } from './AchievementCard';
import { AchievementProgress } from './AchievementProgress';
import { AchievementTimeline } from './AchievementTimeline';

type FilterMode = 'all' | 'unlocked' | 'locked';

export function AchievementShowcase() {
  const {
    unlocked, featured, timeline, isConnected,
    setFeatured, isUnlocked,
  } = useAchievementContext();

  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [showTimeline, setShowTimeline] = useState(false);

  // Build timeline map for unlock dates
  const timelineMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of timeline) m.set(e.id, e.unlockedAt);
    return m;
  }, [timeline]);

  // Filter achievements
  const displayable = useMemo(() => getDisplayable(unlocked), [unlocked]);

  const filtered = useMemo(() => {
    let list = displayable;

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter(a => a.category === activeCategory);
    }

    // Unlock filter
    if (filter === 'unlocked') {
      list = list.filter(a => unlocked.has(a.id));
    } else if (filter === 'locked') {
      list = list.filter(a => !unlocked.has(a.id));
    }

    return list;
  }, [displayable, activeCategory, filter, unlocked]);

  // Toggle featured
  const handleToggleFeatured = useCallback((id: string) => {
    const current = [...featured];
    const idx = current.indexOf(id);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else if (current.length < 3) {
      current.push(id);
    }
    setFeatured(current);
  }, [featured, setFeatured]);

  // Not connected
  if (!isConnected) {
    return (
      <div className="rounded-xl border border-border bg-surface/50 p-8 text-center">
        <Wallet className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">Connect Wallet to Track Achievements</h3>
        <p className="text-sm text-text-muted">
          Sign in with your NEAR wallet to start earning achievements and XP.
        </p>
      </div>
    );
  }

  const categories = Object.entries(CATEGORY_CONFIG) as [AchievementCategory, typeof CATEGORY_CONFIG[AchievementCategory]][];

  return (
    <div className="space-y-6">
      {/* Header + progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Achievements
          </h2>
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="text-xs text-near-green/70 hover:text-near-green transition-colors"
          >
            {showTimeline ? 'Show Grid' : 'Recent Activity'}
          </button>
        </div>

        <AchievementProgress unlocked={unlocked} />
      </div>

      {/* Featured showcase */}
      {featured.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider text-text-muted font-medium">
            ⭐ Featured ({featured.length}/3)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {featured.map(id => {
              const achievement = ACHIEVEMENTS.find(a => a.id === id);
              if (!achievement) return null;
              return (
                <AchievementCard
                  key={id}
                  achievement={achievement}
                  isUnlocked={true}
                  isFeatured={true}
                  unlockedAt={timelineMap.get(id)}
                  onToggleFeatured={handleToggleFeatured}
                  featuredCount={featured.length}
                />
              );
            })}
          </div>
        </div>
      )}

      {showTimeline ? (
        /* Timeline view */
        <AchievementTimeline timeline={timeline} limit={15} />
      ) : (
        <>
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <TabButton
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            >
              All
            </TabButton>
            {categories.map(([cat, config]) => (
              <TabButton
                key={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >
                {config.emoji} {config.label}
              </TabButton>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2">
            {(['all', 'unlocked', 'locked'] as FilterMode[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'text-xs px-3 py-1 rounded-full border transition-colors capitalize',
                  filter === f
                    ? 'border-near-green/50 bg-near-green/10 text-near-green'
                    : 'border-border text-text-muted hover:text-text-secondary',
                )}
              >
                {f}
                {f === 'unlocked' && ` (${unlocked.size})`}
                {f === 'all' && ` (${displayable.length})`}
              </button>
            ))}
          </div>

          {/* Achievement grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isUnlocked(achievement.id)}
                isFeatured={featured.includes(achievement.id)}
                unlockedAt={timelineMap.get(achievement.id)}
                onToggleFeatured={handleToggleFeatured}
                featuredCount={featured.length}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-text-muted text-sm">
              No achievements match this filter. Keep exploring! 🚀
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TabButton({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap',
        active
          ? 'border-near-green/50 bg-near-green/10 text-near-green'
          : 'border-border/50 text-text-muted hover:text-text-secondary hover:border-border',
      )}
    >
      {children}
    </button>
  );
}
