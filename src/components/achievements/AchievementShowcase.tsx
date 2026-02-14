'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_MAP,
  RARITY_CONFIG,
  CATEGORY_CONFIG,
  countByRarity,
  getByCategory,
  type AchievementCategory,
  type AchievementRarity,
} from '@/lib/achievements';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { AchievementCard, FeaturedAchievementCard } from './AchievementCard';
import { AchievementProgress } from './AchievementProgress';
import { AchievementTimeline } from './AchievementTimeline';

type FilterMode = 'all' | 'unlocked' | 'locked';

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as AchievementCategory[];

export function AchievementShowcase() {
  const { unlocked, featured, setFeatured, timeline } = useAchievementContext();
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [filter, setFilter] = useState<FilterMode>('all');

  // Rarity breakdown
  const rarityBreakdown = useMemo(() => countByRarity(unlocked), [unlocked]);

  // Featured achievements
  const featuredDefs = useMemo(
    () => featured
      .map(id => ACHIEVEMENT_MAP[id])
      .filter((d): d is NonNullable<typeof d> => !!d),
    [featured],
  );

  // Toggle featured
  const handleToggleFeatured = useCallback((id: string) => {
    if (featured.includes(id)) {
      setFeatured(featured.filter(f => f !== id));
    } else if (featured.length < 3) {
      setFeatured([...featured, id]);
    }
  }, [featured, setFeatured]);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    let list = activeCategory === 'all'
      ? ACHIEVEMENTS
      : getByCategory(activeCategory);

    // For secret achievements: show if unlocked, hide if locked (unless filter=all and category=secret)
    list = list.filter(a => {
      if (a.secret && !unlocked.has(a.id) && activeCategory !== 'secret') return false;
      return true;
    });

    if (filter === 'unlocked') list = list.filter(a => unlocked.has(a.id));
    if (filter === 'locked') list = list.filter(a => !unlocked.has(a.id));

    return list;
  }, [activeCategory, filter, unlocked]);

  // Timeline entries with timestamps
  const timelineMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of timeline) {
      map.set(entry.id, entry.unlockedAt);
    }
    return map;
  }, [timeline]);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <AchievementProgress unlocked={unlocked} />

      {/* Rarity breakdown bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
        {(Object.keys(RARITY_CONFIG) as AchievementRarity[]).map(r => {
          const cfg = RARITY_CONFIG[r];
          const data = rarityBreakdown[r];
          return (
            <span key={r} className={cn('flex items-center gap-1', cfg.color)}>
              {data?.unlocked ?? 0}/{data?.total ?? 0} {cfg.label}
            </span>
          );
        })}
      </div>

      {/* Featured Section */}
      {featuredDefs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">⭐ Featured</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {featuredDefs.map(def => (
              <FeaturedAchievementCard
                key={def.id}
                achievement={def}
                unlockedAt={timelineMap.get(def.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Unlocked */}
      {timeline.length > 0 && (
        <AchievementTimeline timeline={timeline} limit={5} />
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        {(['all', 'unlocked', 'locked'] as FilterMode[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1 text-xs rounded-full border transition-colors capitalize',
              filter === f
                ? 'bg-near-green/15 border-near-green/40 text-near-green'
                : 'bg-surface border-border text-text-muted hover:border-text-muted/40',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        <CategoryTab
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          emoji="🏆"
          label="All"
          unlocked={unlocked.size}
          total={ACHIEVEMENTS.length}
        />
        {CATEGORIES.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          const catAchievements = getByCategory(cat);
          const catUnlocked = catAchievements.filter(a => unlocked.has(a.id)).length;
          return (
            <CategoryTab
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              emoji={cfg.emoji}
              label={cfg.label}
              unlocked={catUnlocked}
              total={catAchievements.length}
            />
          );
        })}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filteredAchievements.map(a => (
          <AchievementCard
            key={a.id}
            achievement={a}
            isUnlocked={unlocked.has(a.id)}
            isFeatured={featured.includes(a.id)}
            onToggleFeatured={handleToggleFeatured}
            unlockedAt={timelineMap.get(a.id)}
            canFeature={featured.length < 3}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-text-muted text-sm">
          {filter === 'unlocked'
            ? 'No achievements unlocked in this category yet.'
            : filter === 'locked'
              ? 'All done here! 🎉'
              : 'No achievements to show.'}
        </div>
      )}
    </div>
  );
}

/* ─── Category Tab ─────────────────────────────────────────── */

function CategoryTab({
  active,
  onClick,
  emoji,
  label,
  unlocked,
  total,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  unlocked: number;
  total: number;
}) {
  const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all',
        active
          ? 'bg-near-green/10 border-near-green/40 text-near-green'
          : 'bg-surface border-border text-text-muted hover:border-text-muted/40',
      )}
      title={`${label}: ${unlocked}/${total} (${percent}%)`}
    >
      <span>{emoji}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="text-[10px] opacity-70">{unlocked}/{total}</span>
    </button>
  );
}
