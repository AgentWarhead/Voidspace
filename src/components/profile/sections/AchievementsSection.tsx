/* ─── AchievementsSection — Organized & Navigable ────────────
 * Replaces the flat 107-achievement grid with:
 * - Category tabs with progress rings
 * - Collapsible category groups
 * - Featured pins at top
 * - Filter pills (All / Unlocked / Locked)
 * - Timeline toggle
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronDown, ChevronRight } from 'lucide-react';
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

  // Category progress data
  const categoryProgress = useMemo(() => {
    const cats = Object.keys(CATEGORY_CONFIG) as AchievementCategory[];
    return cats.map((cat) => {
      const total = ACHIEVEMENTS.filter((a) => a.category === cat).length;
      const done = ACHIEVEMENTS.filter((a) => a.category === cat && unlocked.has(a.id)).length;
      return { cat, total, done, pct: total > 0 ? (done / total) * 100 : 0 };
    });
  }, [unlocked]);

  // Filtered achievements
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

  // Group by category when viewing "all"
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
      <div className="rounded-xl border border-border bg-surface/50 p-8 text-center">
        <Trophy className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Connect Wallet to Track Achievements
        </h3>
        <p className="text-sm text-text-muted">
          Sign in with your NEAR wallet to start earning achievements and XP.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header + Progress */}
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

      {/* Featured */}
      {featured.length > 0 && (
        <FeaturedShowcase
          featured={featured}
          timelineMap={timelineMap}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {showTimeline ? (
        <AchievementTimeline timeline={timeline} limit={15} />
      ) : (
        <>
          {/* Category Tabs with Progress Rings */}
          <CategoryTabs
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            categoryProgress={categoryProgress}
          />

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(['all', 'unlocked', 'locked'] as FilterMode[]).map((f) => (
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

          {/* Achievement Grid — grouped or flat */}
          {groupedByCategory ? (
            <GroupedAchievementGrid
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
            <div className="text-center py-8 text-text-muted text-sm">
              No achievements match this filter. Keep exploring! 🚀
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function FeaturedShowcase({
  featured,
  timelineMap,
  onToggleFeatured,
}: {
  featured: string[];
  timelineMap: Map<string, number>;
  onToggleFeatured: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs uppercase tracking-wider text-text-muted font-medium">
        ⭐ Featured ({featured.length}/3)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {featured.map((id) => {
          const achievement = ACHIEVEMENTS.find((a) => a.id === id);
          if (!achievement) return null;
          return (
            <AchievementCard
              key={id}
              achievement={achievement}
              isUnlocked={true}
              isFeatured={true}
              unlockedAt={timelineMap.get(id)}
              onToggleFeatured={onToggleFeatured}
              featuredCount={featured.length}
            />
          );
        })}
      </div>
    </div>
  );
}

function CategoryTabs({
  activeCategory,
  onSelect,
  categoryProgress,
}: {
  activeCategory: AchievementCategory | 'all';
  onSelect: (cat: AchievementCategory | 'all') => void;
  categoryProgress: Array<{ cat: AchievementCategory; total: number; done: number; pct: number }>;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap',
          activeCategory === 'all'
            ? 'border-near-green/50 bg-near-green/10 text-near-green'
            : 'border-border/50 text-text-muted hover:text-text-secondary hover:border-border',
        )}
      >
        All
      </button>
      {categoryProgress.map(({ cat, done, total, pct }) => {
        const config = CATEGORY_CONFIG[cat];
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              'flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap',
              isActive
                ? 'border-near-green/50 bg-near-green/10 text-near-green'
                : 'border-border/50 text-text-muted hover:text-text-secondary hover:border-border',
            )}
          >
            {/* Mini progress ring */}
            <svg className="w-4 h-4 -rotate-90 flex-shrink-0" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="4" className="text-border/30" />
              <circle
                cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${pct * 0.942} 94.2`}
                className={cn(isActive ? 'text-near-green' : config.color)}
              />
            </svg>
            <span>{config.emoji}</span>
            <span className="hidden sm:inline">{config.label}</span>
            <span className="text-[10px] font-mono opacity-70">{done}/{total}</span>
          </button>
        );
      })}
    </div>
  );
}

function GroupedAchievementGrid({
  groups,
  collapsedCats,
  toggleCollapsed,
  unlocked,
  featured,
  timelineMap,
  onToggleFeatured,
  isUnlocked,
}: {
  groups: Map<AchievementCategory, ReturnType<typeof getDisplayable>>;
  collapsedCats: Set<AchievementCategory>;
  toggleCollapsed: (cat: AchievementCategory) => void;
  unlocked: Set<string>;
  featured: string[];
  timelineMap: Map<string, number>;
  onToggleFeatured: (id: string) => void;
  isUnlocked: (id: string) => boolean;
}) {
  const categories = Object.keys(CATEGORY_CONFIG) as AchievementCategory[];

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const items = groups.get(cat);
        if (!items || items.length === 0) return null;
        const config = CATEGORY_CONFIG[cat];
        const isCollapsed = collapsedCats.has(cat);
        const total = ACHIEVEMENTS.filter((a) => a.category === cat).length;
        const done = ACHIEVEMENTS.filter((a) => a.category === cat && unlocked.has(a.id)).length;

        return (
          <div key={cat} className="border border-border/30 rounded-xl overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCollapsed(cat)}
              className="w-full flex items-center justify-between px-4 py-3 bg-surface/50 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{config.emoji}</span>
                <span className={cn('text-sm font-semibold', config.color)}>
                  {config.label}
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {done}/{total}
                </span>
              </div>
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-text-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-muted" />
              )}
            </button>

            {/* Achievements */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3">
                    {items.map((a) => (
                      <AchievementCard
                        key={a.id}
                        achievement={a}
                        isUnlocked={isUnlocked(a.id)}
                        isFeatured={featured.includes(a.id)}
                        unlockedAt={timelineMap.get(a.id)}
                        onToggleFeatured={onToggleFeatured}
                        featuredCount={featured.length}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
