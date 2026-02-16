'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ACHIEVEMENTS,
  CATEGORY_CONFIG,
  getDisplayable,
  type AchievementCategory,
} from '@/lib/achievements';
import { AchievementCard } from '@/components/achievements/AchievementCard';

interface GroupedAchievementGridProps {
  groups: Map<AchievementCategory, ReturnType<typeof getDisplayable>>;
  collapsedCats: Set<AchievementCategory>;
  toggleCollapsed: (cat: AchievementCategory) => void;
  unlocked: Set<string>;
  featured: string[];
  timelineMap: Map<string, number>;
  onToggleFeatured: (id: string) => void;
  isUnlocked: (id: string) => boolean;
}

export function AchievementGroupedGrid({
  groups,
  collapsedCats,
  toggleCollapsed,
  unlocked,
  featured,
  timelineMap,
  onToggleFeatured,
  isUnlocked,
}: GroupedAchievementGridProps) {
  const categories = Object.keys(CATEGORY_CONFIG) as AchievementCategory[];

  return (
    <div className="space-y-3 sm:space-y-4">
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
              className="w-full flex items-center justify-between px-3 sm:px-4 py-3 bg-surface/50 hover:bg-surface-hover transition-colors min-h-[44px] active:scale-[0.98]"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 sm:p-3">
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
