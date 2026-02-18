/* ─── TrophyVault — The Museum of Your Accomplishments ───────
 * A dedicated trophy display page. Achievements grouped into
 * glass display cases by category. Filter/sort, inspect modal,
 * holographic glow, legendary pedestals, locked silhouettes.
 * ─────────────────────────────────────────────────────────── */

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles, Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAchievementContext } from '@/contexts/AchievementContext';
import {
  ACHIEVEMENTS,
  CATEGORY_CONFIG,
  RARITY_CONFIG,
  getDisplayable,
  countByRarity,
  totalAchievementXP,
  type AchievementCategory,
  type AchievementRarity,
  type AchievementDef,
} from '@/lib/achievements';
import { TrophyDisplayCase } from './TrophyDisplayCase';
import { TrophyInspectModal } from './TrophyInspectModal';
import { TrophyItem } from './TrophyItem';
import { VaultParticles } from './VaultParticles';
import { useWallet } from '@/hooks/useWallet';

// ─── Types ────────────────────────────────────────────────────

type FilterMode = 'all' | 'unlocked' | 'locked';
type SortMode = 'category' | 'rarity' | 'recent';

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as AchievementCategory[];

const RARITY_ORDER: Record<AchievementRarity, number> = {
  legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1,
};

// ─── Stats Bar ────────────────────────────────────────────────

function VaultStatsBar({
  unlocked,
  total,
  xp,
  rarityStats,
}: {
  unlocked: number;
  total: number;
  xp: number;
  rarityStats: ReturnType<typeof countByRarity>;
}) {
  const pct = total > 0 ? (unlocked / total) * 100 : 0;

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(15,15,25,0.9), rgba(10,10,18,0.95))',
        border: '1px solid rgba(0,212,255,0.15)',
        boxShadow: '0 4px 24px rgba(0,212,255,0.05)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-widest mb-0.5">Achievements</p>
          <p className="text-2xl font-bold text-text-primary">
            {unlocked}
            <span className="text-text-muted font-normal text-base">/{total}</span>
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted uppercase tracking-widest mb-0.5">XP Earned</p>
          <p className="text-2xl font-bold text-near-green">
            {xp.toLocaleString()}
            <span className="text-sm ml-1">XP</span>
          </p>
        </div>

        <div className="flex-1" />

        {/* Completion badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: pct === 100
              ? 'rgba(0,236,151,0.15)'
              : pct >= 50
                ? 'rgba(0,212,255,0.1)'
                : 'rgba(255,255,255,0.05)',
            border: pct === 100
              ? '1px solid rgba(0,236,151,0.4)'
              : '1px solid rgba(255,255,255,0.1)',
            color: pct === 100 ? '#00EC97' : '#ffffff',
          }}
        >
          <Trophy className="w-3.5 h-3.5" />
          {pct === 100 ? 'VAULT COMPLETE' : `${Math.round(pct)}% Complete`}
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'linear-gradient(90deg, #00D4FF, #00EC97)',
            boxShadow: '0 0 8px rgba(0,212,255,0.5)',
          }}
        />
      </div>

      {/* Rarity breakdown */}
      <div className="flex flex-wrap gap-2">
        {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as AchievementRarity[]).map((r) => {
          const { total: t, unlocked: u } = rarityStats[r];
          if (t === 0) return null;
          const cfg = RARITY_CONFIG[r];
          return (
            <div
              key={r}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: r === 'legendary' ? '#f59e0b'
                    : r === 'epic' ? '#8b5cf6'
                    : r === 'rare' ? '#00D4FF'
                    : r === 'uncommon' ? '#34d399'
                    : '#64748b',
                  boxShadow: `0 0 4px ${r === 'legendary' ? 'rgba(245,158,11,0.6)' : r === 'epic' ? 'rgba(139,92,246,0.6)' : r === 'rare' ? 'rgba(0,212,255,0.6)' : 'none'}`,
                }}
              />
              <span className={cn('font-medium', cfg.color)}>
                {u}/{t}
              </span>
              <span className="text-text-muted capitalize">{r}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Filter/Sort Bar ──────────────────────────────────────────

function VaultFilterBar({
  filter,
  sort,
  search,
  activeCategory,
  onFilter,
  onSort,
  onSearch,
  onCategory,
}: {
  filter: FilterMode;
  sort: SortMode;
  search: string;
  activeCategory: AchievementCategory | 'all';
  onFilter: (f: FilterMode) => void;
  onSort: (s: SortMode) => void;
  onSearch: (s: string) => void;
  onCategory: (c: AchievementCategory | 'all') => void;
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3 mb-6">
      {/* Search + filter toggle row */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search trophies..."
            className={cn(
              'w-full pl-9 pr-8 py-2.5 rounded-xl text-sm',
              'bg-white/[0.04] border border-white/10',
              'text-text-primary placeholder:text-text-muted',
              'focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06]',
              'transition-colors',
            )}
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm border transition-colors',
            showFilters
              ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
              : 'border-white/10 bg-white/[0.04] text-text-muted hover:text-text-primary',
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 p-4 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Filter by status */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'unlocked', 'locked'] as FilterMode[]).map((f) => (
                <button
                  key={f}
                  onClick={() => onFilter(f)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border capitalize transition-colors',
                    filter === f
                      ? 'border-near-green/50 bg-near-green/10 text-near-green'
                      : 'border-white/10 text-text-muted hover:text-text-secondary',
                  )}
                >
                  {f === 'unlocked' && <span className="mr-1">✓</span>}
                  {f === 'locked' && <Lock className="w-3 h-3 inline mr-1" />}
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Sort by</p>
            <div className="flex flex-wrap gap-1.5">
              {(['category', 'rarity', 'recent'] as SortMode[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onSort(s)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border capitalize transition-colors',
                    sort === s
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                      : 'border-white/10 text-text-muted hover:text-text-secondary',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Category</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onCategory('all')}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border capitalize transition-colors',
                  activeCategory === 'all'
                    ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                    : 'border-white/10 text-text-muted hover:text-text-secondary',
                )}
              >
                All
              </button>
              {CATEGORIES.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => onCategory(cat)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full border transition-colors',
                      activeCategory === cat
                        ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                        : 'border-white/10 text-text-muted hover:text-text-secondary',
                    )}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Connect Wall ─────────────────────────────────────────────

function VaultConnectWall({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))',
            border: '1px solid rgba(0,212,255,0.3)',
            boxShadow: '0 0 40px rgba(0,212,255,0.2)',
          }}
        >
          <Trophy className="w-12 h-12 text-cyan-400" />
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-3">
          The Trophy Vault Awaits
        </h2>
        <p className="text-text-secondary max-w-sm mb-6">
          Connect your NEAR wallet to unlock access to your personal trophy collection.
          Every achievement tells a story of your journey through the Void.
        </p>

        <button
          onClick={onConnect}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
          style={{
            background: 'linear-gradient(135deg, #00D4FF, #00EC97)',
            color: '#000',
            boxShadow: '0 4px 20px rgba(0,212,255,0.4)',
          }}
        >
          <Sparkles className="w-4 h-4" />
          Connect Wallet to Enter
        </button>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export function TrophyVault({ embedded = false }: { embedded?: boolean } = {}) {
  const { unlocked, timeline, isConnected, isLoaded } = useAchievementContext();
  const { openModal } = useWallet();

  const [filter, setFilter] = useState<FilterMode>('all');
  const [sort, setSort] = useState<SortMode>('category');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [inspecting, setInspecting] = useState<AchievementDef | null>(null);

  // Timeline map for date lookups
  const timelineMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of timeline) m.set(e.id, e.unlockedAt);
    return m;
  }, [timeline]);

  // Displayable achievements (non-secret + unlocked secrets)
  const displayable = useMemo(() => getDisplayable(unlocked), [unlocked]);

  // Rarity stats
  const rarityStats = useMemo(() => countByRarity(unlocked), [unlocked]);

  // Total XP from achievements
  const achievementXP = useMemo(() => totalAchievementXP(unlocked), [unlocked]);

  // Apply filters + search
  const filteredAchievements = useMemo(() => {
    let list = displayable;

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((a) => a.category === activeCategory);
    }

    // Status filter
    if (filter === 'unlocked') list = list.filter((a) => unlocked.has(a.id));
    if (filter === 'locked') list = list.filter((a) => !unlocked.has(a.id));

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.rarity.toLowerCase().includes(q),
      );
    }

    return list;
  }, [displayable, activeCategory, filter, search, unlocked]);

  // Group by category for display
  const groupedByCategory = useMemo(() => {
    if (sort === 'rarity') return null; // flat view sorted by rarity
    if (sort === 'recent') return null; // flat view sorted by recency

    const groups = new Map<AchievementCategory, AchievementDef[]>();
    const catOrder = CATEGORIES;

    for (const cat of catOrder) {
      const catItems = filteredAchievements.filter((a) => a.category === cat);
      if (catItems.length > 0) {
        groups.set(cat, catItems);
      }
    }
    return groups;
  }, [filteredAchievements, sort]);

  // Flat list for non-category sort
  const flatSorted = useMemo(() => {
    if (groupedByCategory !== null) return null;

    let list = [...filteredAchievements];
    if (sort === 'rarity') {
      list.sort((a, b) => {
        // Unlocked first, then by rarity desc
        const aU = unlocked.has(a.id) ? 1 : 0;
        const bU = unlocked.has(b.id) ? 1 : 0;
        if (aU !== bU) return bU - aU;
        return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
      });
    } else if (sort === 'recent') {
      list.sort((a, b) => {
        const aT = timelineMap.get(a.id) ?? 0;
        const bT = timelineMap.get(b.id) ?? 0;
        if (aT !== bT) return bT - aT; // most recent first
        return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
      });
    }
    return list;
  }, [groupedByCategory, filteredAchievements, sort, unlocked, timelineMap]);

  if (!isConnected && !embedded) {
    return (
      <div className="relative min-h-screen">
        <VaultParticles count={30} />
        <VaultConnectWall onConnect={openModal} />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin mx-auto mb-4"
          />
          <p className="text-text-muted text-sm">Loading your Trophy Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!embedded && <VaultParticles count={40} />}

      <div className="relative z-10 space-y-6">
        {/* Stats bar */}
        <VaultStatsBar
          unlocked={unlocked.size}
          total={ACHIEVEMENTS.length}
          xp={achievementXP}
          rarityStats={rarityStats}
        />

        {/* Filters */}
        <VaultFilterBar
          filter={filter}
          sort={sort}
          search={search}
          activeCategory={activeCategory}
          onFilter={setFilter}
          onSort={setSort}
          onSearch={setSearch}
          onCategory={setActiveCategory}
        />

        {/* No results */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-40" />
            <p className="text-text-muted">No trophies match your filters.</p>
            <button
              onClick={() => { setFilter('all'); setSearch(''); setActiveCategory('all'); }}
              className="mt-3 text-sm text-near-green/70 hover:text-near-green transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Category view — glass display cases */}
        {groupedByCategory && groupedByCategory.size > 0 && (
          <div className="space-y-4">
            {Array.from(groupedByCategory.entries()).map(([cat, items], index) => (
              <TrophyDisplayCase
                key={cat}
                category={cat}
                achievements={items}
                unlocked={unlocked}
                timelineMap={timelineMap}
                onInspect={setInspecting}
                defaultOpen={index < 3}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Flat rarity/recent view */}
        {flatSorted && flatSorted.length > 0 && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(15,15,20,0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}
            >
              {flatSorted.map((achievement, i) => (
                <TrophyItem
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={unlocked.has(achievement.id)}
                  unlockedAt={timelineMap.get(achievement.id)}
                  onClick={() => setInspecting(achievement)}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inspect modal */}
      <TrophyInspectModal
        achievement={inspecting}
        isUnlocked={inspecting ? unlocked.has(inspecting.id) : false}
        unlockedAt={inspecting ? timelineMap.get(inspecting.id) : undefined}
        onClose={() => setInspecting(null)}
      />
    </div>
  );
}
