'use client';

import { cn } from '@/lib/utils';
import { CATEGORY_CONFIG, type AchievementCategory } from '@/lib/achievements';

interface CategoryTabsProps {
  activeCategory: AchievementCategory | 'all';
  onSelect: (cat: AchievementCategory | 'all') => void;
  categoryProgress: Array<{ cat: AchievementCategory; total: number; done: number; pct: number }>;
}

export function AchievementCategoryTabs({
  activeCategory,
  onSelect,
  categoryProgress,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'flex-shrink-0 text-xs px-3 py-2.5 sm:py-1.5 rounded-lg border transition-all whitespace-nowrap min-h-[44px] sm:min-h-0 active:scale-[0.97]',
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
              'flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2.5 sm:py-1.5 rounded-lg border transition-all whitespace-nowrap min-h-[44px] sm:min-h-0 active:scale-[0.97]',
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
