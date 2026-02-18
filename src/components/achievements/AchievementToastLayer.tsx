/* ─── AchievementToastLayer — Voidspace Brand Achievement Reveals ──
 * Rarity-specific reveal animations:
 *   Common    → Subtle teal glow slide-in (corner toast)
 *   Uncommon  → Teal-to-purple gradient pulse (corner toast)
 *   Rare      → Void particle burst + corner toast
 *   Epic      → Cosmic particle ring + centered screen reveal
 *   Legendary → Full void takeover — deep space flood, golden particle storm
 * ───────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { RARITY_CONFIG, type AchievementDef, type AchievementRarity } from '@/lib/achievements';
import { useAchievementSound } from '@/hooks/useAchievementSound';
import { cn } from '@/lib/utils';

// ─── Void Particle ─────────────────────────────────────────────

interface ParticleProps {
  index: number;
  total: number;
  rarity: AchievementRarity;
  mode: 'burst' | 'ring' | 'rise';
  delay?: number;
}

function VoidParticle({ index, total, rarity, mode, delay = 0 }: ParticleProps) {
  const angle = (index / total) * Math.PI * 2;
  const distance = mode === 'ring' ? 90 + Math.random() * 40 : 50 + Math.random() * 60;
  const size = mode === 'ring' ? 3 + Math.random() * 4 : 2 + Math.random() * 5;
  const duration = 0.9 + Math.random() * 0.8;

  // Color palette — teal, purple, gold (for legendary)
  const palette: Record<AchievementRarity, string[]> = {
    common:    ['#00EC97', '#0ff', '#00d4aa'],
    uncommon:  ['#00EC97', '#7B61FF', '#a855f7'],
    rare:      ['#3b82f6', '#00EC97', '#0ff', '#60a5fa'],
    epic:      ['#a855f7', '#7B61FF', '#00EC97', '#e879f9'],
    legendary: ['#f59e0b', '#fcd34d', '#00EC97', '#fbbf24', '#fff'],
  };
  const colors = palette[rarity];
  const color = colors[index % colors.length];

  if (mode === 'rise') {
    const drift = (Math.random() - 0.5) * 80;
    return (
      <div
        className="absolute bottom-0 left-1/2 rounded-full pointer-events-none animate-void-particle-rise"
        style={{
          width: size,
          height: size,
          background: color,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          marginLeft: -size / 2,
          '--drift': `${drift}px`,
          '--pd': `${duration + 0.5}s`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties}
      />
    );
  }

  const px = Math.cos(angle) * distance;
  const py = Math.sin(angle) * distance;

  return (
    <div
      className="absolute rounded-full pointer-events-none animate-void-particle"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        top: '50%',
        left: '50%',
        marginTop: -size / 2,
        marginLeft: -size / 2,
        '--px': `${px}px`,
        '--py': `${py}px`,
        '--pd': `${duration}s`,
        animationDelay: `${delay}s`,
      } as React.CSSProperties}
    />
  );
}

// ─── Screen-Edge Shimmer (Epic) ────────────────────────────────

function EdgeShimmer() {
  return (
    <>
      {/* Left edge */}
      <div className="fixed left-0 top-0 bottom-0 w-[2px] pointer-events-none z-[55] overflow-hidden">
        <div
          className="w-full h-full animate-edge-shimmer"
          style={{ background: 'linear-gradient(180deg, transparent, #a855f7, #00EC97, #a855f7, transparent)' }}
        />
      </div>
      {/* Right edge */}
      <div className="fixed right-0 top-0 bottom-0 w-[2px] pointer-events-none z-[55] overflow-hidden">
        <div
          className="w-full h-full animate-edge-shimmer"
          style={{ background: 'linear-gradient(180deg, transparent, #7B61FF, #00EC97, #7B61FF, transparent)', animationDelay: '0.15s' }}
        />
      </div>
    </>
  );
}

// ─── Legendary Void Flood ──────────────────────────────────────

function VoidFlood({ duration }: { duration: number }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[55]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(10,5,30,0.97) 0%, rgba(4,0,15,0.99) 100%)',
      }}
    />
  );
}

// ─── Glow class per rarity ─────────────────────────────────────

function getGlowClass(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common':    return 'animate-teal-glow-pulse';
    case 'uncommon':  return 'animate-teal-glow-pulse';
    case 'rare':      return 'animate-rare-glow-pulse';
    case 'epic':      return 'animate-epic-glow-pulse';
    case 'legendary': return 'animate-legendary-glow-pulse';
  }
}

// ─── Toast Card ────────────────────────────────────────────────

interface ToastCardProps {
  achievement: AchievementDef;
  onDismiss: () => void;
}

function ToastCard({ achievement, onDismiss }: ToastCardProps) {
  const rarity = achievement.rarity;
  const cfg = RARITY_CONFIG[rarity];
  const isCenter = rarity === 'epic' || rarity === 'legendary';

  const cardVariants = {
    hidden: isCenter
      ? { opacity: 0, scale: 0.75, y: 20, filter: 'blur(8px)' }
      : { opacity: 0, x: 80 },
    visible: isCenter
      ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
      : { opacity: 1, x: 0 },
    exit: isCenter
      ? { opacity: 0, scale: 0.85, y: -12 }
      : { opacity: 0, x: 80 },
  };

  const cardTransition = {
    duration: rarity === 'legendary' ? 0.9 : rarity === 'epic' ? 0.6 : 0.35,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={cardTransition}
      className={cn(
        'relative p-5 rounded-2xl border backdrop-blur-2xl shadow-2xl overflow-hidden',
        cfg.border,
        `bg-gradient-to-br ${cfg.bg}`,
        getGlowClass(rarity),
        isCenter ? 'w-[360px] max-w-[90vw]' : 'w-[320px] max-w-[calc(100vw-2rem)]',
      )}
    >
      {/* Close */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5 text-white/50" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className={cn(
          'w-14 h-14 rounded-xl bg-white/10 border flex items-center justify-center flex-shrink-0 text-3xl',
          cfg.border,
          rarity === 'legendary' && 'animate-pulse',
        )}>
          {achievement.emoji}
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-[10px] uppercase tracking-widest text-white/50 font-medium mb-0.5">
            Achievement Unlocked
          </p>
          <h3 className={cn('text-lg font-bold leading-tight', cfg.textColor)}>
            {achievement.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-white/70 leading-relaxed">
        {achievement.description}
      </p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className={cn('text-[11px] uppercase tracking-wider font-semibold', cfg.color)}>
          {cfg.label}
        </span>
        <span className="flex items-center gap-1 text-sm font-bold text-[#00EC97]">
          <Sparkles className="w-3.5 h-3.5" />
          +{achievement.xp} XP
        </span>
      </div>

      {/* Legendary inner shimmer */}
      {rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-amber-300/15 to-transparent" />
        </div>
      )}

      {/* Uncommon: gradient bar at bottom */}
      {rarity === 'uncommon' && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
          style={{ background: 'linear-gradient(90deg, #00EC97, #7B61FF, #00EC97)', backgroundSize: '200% 100%', animation: 'gradient-border 2s ease infinite' }}
        />
      )}
    </motion.div>
  );
}

// ─── Main Layer ────────────────────────────────────────────────

export function AchievementToastLayer() {
  const { pendingPopups, dismissPopup } = useAchievementContext();
  const { playAchievementSound } = useAchievementSound();
  const current = pendingPopups[0] ?? null;
  const [key, setKey] = useState(0); // force re-render to restart particle animations
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!current) return;

    // Force particle re-render on each new achievement
    setKey(k => k + 1);

    // Play rarity-appropriate sound
    playAchievementSound(current);

    // Auto-dismiss timing by rarity
    const DISMISS_MS: Record<AchievementRarity, number> = {
      common:    4000,
      uncommon:  4500,
      rare:      5500,
      epic:      7000,
      legendary: 9000,
    };
    timerRef.current = setTimeout(dismissPopup, DISMISS_MS[current.rarity]);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current?.id, dismissPopup, playAchievementSound]); // eslint-disable-line react-hooks/exhaustive-deps

  const rarity = current?.rarity ?? 'common';
  const isCenter = rarity === 'epic' || rarity === 'legendary';
  const showParticles = rarity !== 'common';
  const particleCount = { common: 0, uncommon: 4, rare: 10, epic: 16, legendary: 24 }[rarity];

  return (
    <AnimatePresence>
      {current && (
        <>
          {/* Legendary: full void flood */}
          {rarity === 'legendary' && (
            <VoidFlood key={`flood-${key}`} duration={9} />
          )}

          {/* Epic: screen edge shimmers */}
          {rarity === 'epic' && <EdgeShimmer key={`edge-${key}`} />}

          {/* Particle overlay */}
          {showParticles && (
            <div
              key={`particles-${key}`}
              className={cn(
                'fixed pointer-events-none z-[58]',
                isCenter ? 'inset-0 flex items-center justify-center' : 'top-20 right-4 w-[320px] h-[160px]',
              )}
            >
              {Array.from({ length: particleCount }, (_, i) => (
                <VoidParticle
                  key={i}
                  index={i}
                  total={particleCount}
                  rarity={rarity}
                  mode={rarity === 'legendary' ? 'rise' : rarity === 'epic' ? 'ring' : 'burst'}
                  delay={rarity === 'legendary' ? Math.random() * 2 : i * 0.04}
                />
              ))}
            </div>
          )}

          {/* Toast card */}
          <div
            className={cn(
              'z-[60]',
              isCenter
                ? 'fixed inset-0 flex items-center justify-center pointer-events-none'
                : 'fixed top-20 right-4',
            )}
          >
            <div className="pointer-events-auto">
              <ToastCard
                key={`card-${key}`}
                achievement={current}
                onDismiss={dismissPopup}
              />
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
