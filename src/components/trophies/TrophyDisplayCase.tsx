/* ─── TrophyDisplayCase — Glass Museum Case per Category ─────
 * Renders a glassmorphism "display case" for one achievement
 * category. Shows progress, category label, and a grid of
 * TrophyItem components inside.
 * ─────────────────────────────────────────────────────────── */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CATEGORY_CONFIG,
  RARITY_CONFIG,
  type AchievementDef,
  type AchievementCategory,
} from '@/lib/achievements';
import { TrophyItem } from './TrophyItem';

interface TrophyDisplayCaseProps {
  category: AchievementCategory;
  achievements: AchievementDef[];
  unlocked: Set<string>;
  timelineMap: Map<string, number>;
  onInspect: (achievement: AchievementDef) => void;
  defaultOpen?: boolean;
  index?: number;
}

// Category-specific glass accent colors
const CATEGORY_GLASS: Record<AchievementCategory, { border: string; glow: string; accent: string }> = {
  exploration:   { border: 'rgba(0,212,255,0.2)',   glow: 'rgba(0,212,255,0.08)',    accent: 'rgba(0,212,255,0.4)' },
  intelligence:  { border: 'rgba(52,211,153,0.2)',  glow: 'rgba(52,211,153,0.08)',   accent: 'rgba(52,211,153,0.4)' },
  bubbles:       { border: 'rgba(96,165,250,0.2)',  glow: 'rgba(96,165,250,0.08)',   accent: 'rgba(96,165,250,0.4)' },
  constellation: { border: 'rgba(129,140,248,0.2)', glow: 'rgba(129,140,248,0.08)',  accent: 'rgba(129,140,248,0.4)' },
  sanctum:       { border: 'rgba(251,146,60,0.2)',  glow: 'rgba(251,146,60,0.08)',   accent: 'rgba(251,146,60,0.4)' },
  learning:      { border: 'rgba(250,204,21,0.2)',  glow: 'rgba(250,204,21,0.08)',   accent: 'rgba(250,204,21,0.4)' },
  economy:       { border: 'rgba(74,222,128,0.2)',  glow: 'rgba(74,222,128,0.08)',   accent: 'rgba(74,222,128,0.4)' },
  social:        { border: 'rgba(244,114,182,0.2)', glow: 'rgba(244,114,182,0.08)',  accent: 'rgba(244,114,182,0.4)' },
  streaks:       { border: 'rgba(248,113,113,0.2)', glow: 'rgba(248,113,113,0.08)',  accent: 'rgba(248,113,113,0.4)' },
  secret:        { border: 'rgba(251,191,36,0.2)',  glow: 'rgba(251,191,36,0.08)',   accent: 'rgba(251,191,36,0.4)' },
};

export function TrophyDisplayCase({
  category,
  achievements,
  unlocked,
  timelineMap,
  onInspect,
  defaultOpen = true,
  index = 0,
}: TrophyDisplayCaseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const catConfig = CATEGORY_CONFIG[category];
  const glass = CATEGORY_GLASS[category];

  const unlockedCount = achievements.filter((a) => unlocked.has(a.id)).length;
  const totalCount = achievements.length;
  const progressPct = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
  const isComplete = unlockedCount === totalCount && totalCount > 0;

  // Sort: legendary first (pedestals at front), then by rarity, then locked last
  const rarityOrder: Record<string, number> = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
  const sorted = [...achievements].sort((a, b) => {
    const aUnlocked = unlocked.has(a.id) ? 1 : 0;
    const bUnlocked = unlocked.has(b.id) ? 1 : 0;
    if (aUnlocked !== bUnlocked) return bUnlocked - aUnlocked; // unlocked first
    return rarityOrder[b.rarity] - rarityOrder[a.rarity]; // rarity desc
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(15,15,20,0.9) 0%, rgba(10,10,15,0.95) 100%)`,
        border: `1px solid ${glass.border}`,
        boxShadow: `0 4px 24px ${glass.glow}, inset 0 0 40px ${glass.glow}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Glass top reflection */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${glass.accent}, transparent)` }}
      />

      {/* Category header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left"
        aria-expanded={isOpen}
      >
        {/* Category emoji */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{
            background: glass.glow,
            border: `1px solid ${glass.border}`,
          }}
        >
          {catConfig.emoji}
        </div>

        {/* Label + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('font-bold text-sm', catConfig.color)}>
              {catConfig.label}
            </span>
            {isComplete && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-near-green/20 text-near-green border border-near-green/30 font-semibold">
                COMPLETE
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${glass.border}, ${glass.accent})`,
                  boxShadow: progressPct > 0 ? `0 0 6px ${glass.accent}` : 'none',
                }}
              />
            </div>
            <span className="text-xs text-text-muted whitespace-nowrap">
              {unlockedCount}/{totalCount}
            </span>
          </div>
        </div>

        {/* Rarity breakdown dots */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
          {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as const).map((r) => {
            const count = achievements.filter((a) => a.rarity === r && unlocked.has(a.id)).length;
            if (count === 0) return null;
            return (
              <div
                key={r}
                className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                style={{
                  background: `rgba(${r === 'legendary' ? '245,158,11' : r === 'epic' ? '139,92,246' : r === 'rare' ? '0,212,255' : r === 'uncommon' ? '52,211,153' : '100,116,139'},0.15)`,
                  color: RARITY_CONFIG[r].color.replace('text-', ''),
                }}
                title={`${count} ${r}`}
              >
                {count}
              </div>
            );
          })}
        </div>

        {/* Chevron */}
        <div className="flex-shrink-0 text-text-muted">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Divider */}
      {isOpen && (
        <div
          className="h-px mx-4"
          style={{ background: `linear-gradient(90deg, transparent, ${glass.border}, transparent)` }}
        />
      )}

      {/* Trophy grid */}
      {isOpen && (
        <div className="p-4">
          {/* Legendary row (elevated, separate) */}
          {(() => {
            const legendaries = sorted.filter((a) => a.rarity === 'legendary');
            const rest = sorted.filter((a) => a.rarity !== 'legendary');
            return (
              <>
                {legendaries.length > 0 && (
                  <div className="mb-4">
                    {/* Legendary pedestal section */}
                    <div
                      className="relative rounded-xl p-4 mb-2"
                      style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(180,83,9,0.04))',
                        border: '1px solid rgba(245,158,11,0.15)',
                      }}
                    >
                      <p className="text-[10px] uppercase tracking-widest text-amber-500/70 font-bold mb-3 text-center">
                        ✦ Legendary ✦
                      </p>
                      <div
                        className="grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(auto-fill, minmax(72px, 1fr))`,
                        }}
                      >
                        {legendaries.map((achievement, i) => (
                          <TrophyItem
                            key={achievement.id}
                            achievement={achievement}
                            isUnlocked={unlocked.has(achievement.id)}
                            unlockedAt={timelineMap.get(achievement.id)}
                            onClick={() => onInspect(achievement)}
                            index={i}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular grid */}
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(72px, 1fr))`,
                  }}
                >
                  {rest.map((achievement, i) => (
                    <TrophyItem
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={unlocked.has(achievement.id)}
                      unlockedAt={timelineMap.get(achievement.id)}
                      onClick={() => onInspect(achievement)}
                      index={legendaries.length + i}
                    />
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Glass bottom highlight */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${glass.border}, transparent)` }}
      />
    </motion.div>
  );
}
