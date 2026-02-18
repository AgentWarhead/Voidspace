/* ─── TrophyItem — Individual Trophy with Holographic Glow ───
 * Rarity effects:
 *   Common    → Subtle silver sheen
 *   Uncommon  → Soft green glow
 *   Rare      → Cyan holographic shimmer
 *   Epic      → Purple pulse ring
 *   Legendary → Golden radiance + pedestal elevation
 * Locked      → Dark silhouette, "???", teasing
 * ─────────────────────────────────────────────────────────── */

'use client';

import { motion } from 'framer-motion';
import { Lock, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RARITY_CONFIG, type AchievementDef } from '@/lib/achievements';

interface TrophyItemProps {
  achievement: AchievementDef;
  isUnlocked: boolean;
  unlockedAt?: number;
  onClick: () => void;
  index?: number;
}

// Holographic/glow effects per rarity
const RARITY_EFFECTS = {
  common: {
    glow: 'rgba(100,116,139,0.25)',
    shimmerColor: 'rgba(148,163,184,0.15)',
    outerGlow: '0 0 12px rgba(100,116,139,0.3)',
    animation: '',
  },
  uncommon: {
    glow: 'rgba(34,197,94,0.35)',
    shimmerColor: 'rgba(74,222,128,0.2)',
    outerGlow: '0 0 16px rgba(34,197,94,0.4)',
    animation: '',
  },
  rare: {
    glow: 'rgba(0,212,255,0.45)',
    shimmerColor: 'rgba(0,212,255,0.25)',
    outerGlow: '0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.15)',
    animation: 'trophy-rare-shimmer',
  },
  epic: {
    glow: 'rgba(139,92,246,0.5)',
    shimmerColor: 'rgba(139,92,246,0.3)',
    outerGlow: '0 0 24px rgba(139,92,246,0.55), 0 0 48px rgba(139,92,246,0.2)',
    animation: 'trophy-epic-pulse',
  },
  legendary: {
    glow: 'rgba(245,158,11,0.6)',
    shimmerColor: 'rgba(245,158,11,0.35)',
    outerGlow: '0 0 30px rgba(245,158,11,0.65), 0 0 60px rgba(245,158,11,0.25), 0 0 90px rgba(245,158,11,0.1)',
    animation: 'trophy-legendary-radiance',
  },
} as const;

export function TrophyItem({ achievement, isUnlocked, unlockedAt: _unlockedAt, onClick, index = 0 }: TrophyItemProps) {
  const isLegendary = achievement.rarity === 'legendary';
  const isSecret = achievement.secret && !isUnlocked;
  const effects = RARITY_EFFECTS[achievement.rarity];
  const rarity = RARITY_CONFIG[achievement.rarity];

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: isLegendary ? 1.06 : 1.04, y: isLegendary ? -4 : -2 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'relative group flex flex-col items-center gap-2 p-3 rounded-xl text-center',
        'cursor-pointer transition-colors duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-near-green/50',
        // Legendary is elevated with pedestal
        isLegendary && isUnlocked && 'pt-4',
        // Locked styling
        !isUnlocked && 'opacity-50 hover:opacity-70',
      )}
      aria-label={isSecret ? '???' : achievement.name}
    >
      {/* Legendary pedestal */}
      {isLegendary && isUnlocked && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5">
          {/* Pedestal base */}
          <div
            className="h-2 w-full rounded-b-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(245,158,11,0.4) 0%, rgba(180,83,9,0.6) 100%)',
              boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
            }}
          />
          {/* Pedestal glow underneath */}
          <div
            className="h-1 w-3/4 mx-auto rounded-full blur-md"
            style={{ background: 'rgba(245,158,11,0.5)' }}
          />
        </div>
      )}

      {/* Trophy display container */}
      <div
        className={cn(
          'relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
          'border transition-all duration-300',
          isUnlocked ? rarity.border : 'border-white/10',
          isUnlocked ? 'bg-white/10' : 'bg-white/5',
        )}
        style={isUnlocked ? {
          boxShadow: effects.outerGlow,
        } : undefined}
      >
        {/* Holographic shimmer layer (unlocked only) */}
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          >
            {/* Base glow fill */}
            <div
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at 30% 30%, ${effects.shimmerColor}, transparent 70%)` }}
            />
            {/* Shimmer sweep */}
            {(achievement.rarity === 'rare' || achievement.rarity === 'epic' || achievement.rarity === 'legendary') && (
              <div
                className="absolute inset-0 animate-shimmer"
                style={{
                  background: `linear-gradient(105deg, transparent 40%, ${effects.shimmerColor} 50%, transparent 60%)`,
                  backgroundSize: '200% 100%',
                  animationDuration: achievement.rarity === 'legendary' ? '1.8s' : '2.5s',
                }}
              />
            )}
          </div>
        )}

        {/* Epic pulse ring */}
        {achievement.rarity === 'epic' && isUnlocked && (
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              boxShadow: `inset 0 0 0 1px ${effects.glow}`,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}

        {/* Legendary outer radiance ring */}
        {isLegendary && isUnlocked && (
          <div
            className="absolute -inset-1 rounded-2xl opacity-60"
            style={{
              background: 'transparent',
              boxShadow: `0 0 12px 2px rgba(245,158,11,0.4)`,
              animation: 'pulse 2.5s ease-in-out infinite',
            }}
          />
        )}

        {/* Icon / emoji */}
        {isSecret ? (
          <HelpCircle className="w-6 h-6 text-text-muted" />
        ) : isUnlocked ? (
          <span className="relative z-10 select-none">{achievement.emoji}</span>
        ) : (
          <Lock className="w-5 h-5 text-text-muted" />
        )}
      </div>

      {/* Trophy name */}
      <div className="w-full space-y-0.5">
        <p className={cn(
          'text-[11px] font-semibold leading-tight line-clamp-2',
          isUnlocked ? rarity.textColor : 'text-text-muted',
          isLegendary && isUnlocked && 'text-amber-300',
        )}>
          {isSecret ? '???' : achievement.name}
        </p>

        {/* Rarity dot */}
        <div className="flex justify-center">
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{
              background: isUnlocked ? effects.glow : 'rgba(255,255,255,0.2)',
              boxShadow: isUnlocked ? `0 0 4px ${effects.glow}` : 'none',
            }}
          />
        </div>
      </div>

      {/* Hover tooltip */}
      <div
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1',
          'bg-black/90 text-white text-[10px] rounded-lg whitespace-nowrap',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
          'border border-white/10 z-10',
        )}
      >
        {isSecret ? 'Mystery achievement' : achievement.name}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
          style={{ borderTopColor: 'rgba(0,0,0,0.9)' }}
        />
      </div>
    </motion.button>
  );
}
