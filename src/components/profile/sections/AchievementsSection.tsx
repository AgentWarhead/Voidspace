/* ─── AchievementsSection — Organized & Navigable ────────────
 * Category tabs with progress rings, collapsible groups,
 * featured pins, filter pills, and timeline toggle.
 * Sub-components extracted for maintainability.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useMemo, useState, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAchievementContext } from '@/contexts/AchievementContext';
import {
  ACHIEVEMENTS,
  CATEGORY_CONFIG,
  getDisplayable,
  type AchievementCategory,
} from '@/lib/achievements';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { AchievementProgress } from '@/components/achievements/AchievementProgress';
import { AchievementTimeline } from '@/components/achievements/AchievementTimeline';
import { AchievementCategoryTabs } from './AchievementCategoryTabs';
import { AchievementFeaturedShowcase } from './AchievementFeaturedShowcase';
import { AchievementGroupedGrid } from './AchievementGroupedGrid';

type FilterMode = 'all' | 'unlocked' | 'locked';

export function AchievementsSection() {
  const { unlocked, featured, timeline, isConnected, setFeatured, isUnlocked } =
    useAchievementContext();

  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [showTimeline, setShowTimeline] = useState(false);
  const [collapsedCats, setCollapsedCats] = useState<Set<AchievementCategory>>(new Set());

  const timelineMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of timeline) m.set(e.id, e.unlockedAt);
    return m;
  }, [timeline]);

  const displayable = useMemo(() => getDisplayable(unlocked), [unlocked]);

  const categoryProgress = useMemo(() => {
    const cats = Object.keys(CATEGORY_CONFIG) as AchievementCategory[];
    return cats.map((cat) => {
      const total = ACHIEVEMENTS.filter((a) => a.category === cat).length;
      const done = ACHIEVEMENTS.filter((a) => a.category === cat && unlocked.has(a.id)).length;
      return { cat, total, done, pct: total > 0 ? (done / total) * 100 : 0 };
    });
  }, [unlocked]);

  const filtered = useMemo(() => {
    let list = displayable;
    if (activeCategory !== 'all') {
      list = list.filter((a) => a.category === activeCategory);
    }
    if (filter === 'unlocked') {
      list = list.filter((a) => unlocked.has(a.id));
    } else if (filter === 'locked') {
      list = list.filter((a) => !unlocked.has(a.id));
    }
    return list;
  }, [displayable, activeCategory, filter, unlocked]);

  const groupedByCategory = useMemo(() => {
    if (activeCategory !== 'all') return null;
    const groups = new Map<AchievementCategory, typeof filtered>();
    for (const a of filtered) {
      const existing = groups.get(a.category) || [];
      existing.push(a);
      groups.set(a.category, existing);
    }
    return groups;
  }, [filtered, activeCategory]);

  const handleToggleFeatured = useCallback(
    (id: string) => {
      const current = [...featured];
      const idx = current.indexOf(id);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else if (current.length < 3) {
        current.push(id);
      }
      setFeatured(current);
    },
    [featured, setFeatured],
  );

  const toggleCollapsed = (cat: AchievementCategory) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  if (!isConnected) {
    return (
      <div className="rounded-xl border border-border bg-surface/50 p-4 sm:p-8 text-center">
        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-text-muted mx-auto mb-3" />
        <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1">
          Connect Wallet to Track Achievements
        </h3>
        <p className="text-xs sm:text-sm text-text-muted">
          Sign in with your NEAR wallet to start earning achievements and XP.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header + Progress */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            Achievements
          </h2>
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="text-xs text-near-green/70 hover:text-near-green transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.97]"
          >
            {showTimeline ? 'Show Grid' : 'Recent Activity'}
          </button>
        </div>
        <AchievementProgress unlocked={unlocked} />
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <AchievementFeaturedShowcase
          featured={featured}
          timelineMap={timelineMap}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {showTimeline ? (
        <AchievementTimeline timeline={timeline} limit={15} />
      ) : (
        <>
          {/* Category Tabs */}
          <AchievementCategoryTabs
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            categoryProgress={categoryProgress}
          />

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {(['all', 'unlocked', 'locked'] as FilterMode[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'text-xs px-3 py-2 sm:py-1 rounded-full border transition-colors capitalize min-h-[36px] active:scale-[0.97]',
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

          {/* Achievement Grid — grouped or flat */}
          {groupedByCategory ? (
            <AchievementGroupedGrid
              groups={groupedByCategory}
              collapsedCats={collapsedCats}
              toggleCollapsed={toggleCollapsed}
              unlocked={unlocked}
              featured={featured}
              timelineMap={timelineMap}
              onToggleFeatured={handleToggleFeatured}
              isUnlocked={isUnlocked}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map((a) => (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  isUnlocked={isUnlocked(a.id)}
                  isFeatured={featured.includes(a.id)}
                  unlockedAt={timelineMap.get(a.id)}
                  onToggleFeatured={handleToggleFeatured}
                  featuredCount={featured.length}
                />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-text-muted text-xs sm:text-sm">
              No achievements match this filter. Keep exploring! 🚀
            </div>
          )}
        </>
      )}
    </div>
  );
}
