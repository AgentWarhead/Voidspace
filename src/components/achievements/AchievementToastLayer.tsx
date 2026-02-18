/* ─── AchievementToastLayer — Voidspace Brand Achievement Reveals ──
 * Rarity-specific reveal animations:
 *   Common    → Subtle teal glow slide-in (corner toast)
 *   Uncommon  → Teal-to-purple gradient pulse (corner toast)
 *   Rare      → Void particle burst + corner toast
 *   Epic      → Screen shake + expanding rings + edge shimmers + cosmic particles + centered reveal
 *   Legendary → FULL SCREEN TAKEOVER — deep space void, starfield, nebula, cosmic rays,
 *               golden title reveal, dramatic card materialize, rising particle storm
 *
 *   Special:  konami_coder → retro "↑↑↓↓←→←→BA" banner before legendary reveal
 * ───────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { RARITY_CONFIG, type AchievementDef, type AchievementRarity } from '@/lib/achievements';
import { useAchievementSound } from '@/hooks/useAchievementSound';
import { cn } from '@/lib/utils';

// ─── Deterministic star positions ─────────────────────────────
// Pre-computed to avoid Math.random() hydration issues.
const STAR_DATA = Array.from({ length: 65 }, (_, i) => ({
  x:           ((i * 1619 + 31) % 1000) / 10,      // 0–100 %
  y:           ((i * 1013 + 97) % 1000) / 10,      // 0–100 %
  size:        (i % 4) + 1,                         // 1–4 px
  baseOpacity: 0.2 + (i % 8) * 0.1,                // 0.2–0.9
  delay:       (i * 0.13) % 3,                      // 0–3 s
  duration:    1.5 + (i % 6) * 0.3,                // 1.5–3.3 s
  color:       i % 5 === 0 ? '#00EC97'
             : i % 5 === 1 ? '#7B61FF'
             : i % 5 === 2 ? '#a855f7'
             : '#ffffff',
}));

// ─── Deterministic legendary particle positions ───────────────
const LEGENDARY_PARTICLES = Array.from({ length: 38 }, (_, i) => ({
  x:        ((i * 1619 + 77) % 1000) / 10,       // 0–100 % of screen width
  size:     (i % 5) + 2,                          // 2–6 px
  delay:    (i * 0.19) % 5,                       // 0–5 s
  duration: 3.5 + (i % 6) * 0.4,                 // 3.5–5.9 s
  drift:    ((i * 37) % 120) - 60,               // –60 to +60 px horizontal drift
  color:    ['#f59e0b','#fcd34d','#00EC97','#fbbf24','#7B61FF','#ffffff'][i % 6],
}));

// ─── Cosmic ray angles (legendary) ───────────────────────────
const RAY_ANGLES = [12, 52, 90, 132, 172, 212, 252, 295, 335];

// ─── Particle counts per rarity ───────────────────────────────
const PARTICLE_COUNT: Record<AchievementRarity, number> = {
  common: 0, uncommon: 5, rare: 12, epic: 18, legendary: 0, // legendary uses LegendaryScreenParticles
};

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ─── Void Particle (burst / ring) ─────────────────────────────
interface ParticleProps {
  index: number;
  total: number;
  rarity: AchievementRarity;
  mode: 'burst' | 'ring';
  delay?: number;
}

function VoidParticle({ index, total, rarity, mode, delay = 0 }: ParticleProps) {
  const angle = (index / total) * Math.PI * 2;
  const distance = mode === 'ring' ? 100 + (index % 3) * 20 : 50 + (index % 5) * 15;
  const size = mode === 'ring' ? 3 + (index % 4) : 2 + (index % 5);
  const duration = 0.9 + (index % 5) * 0.16;

  const palette: Record<AchievementRarity, string[]> = {
    common:    ['#00EC97', '#0ff', '#00d4aa'],
    uncommon:  ['#00EC97', '#7B61FF', '#a855f7'],
    rare:      ['#3b82f6', '#00EC97', '#0ff', '#60a5fa'],
    epic:      ['#a855f7', '#7B61FF', '#00EC97', '#e879f9'],
    legendary: ['#f59e0b', '#fcd34d', '#00EC97'],
  };
  const colors = palette[rarity];
  const color = colors[index % colors.length];
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

// ─── Legendary: full-screen rising particles ──────────────────
function LegendaryScreenParticle({ data }: { data: typeof LEGENDARY_PARTICLES[0] }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none animate-legendary-particle-rise"
      style={{
        bottom: '-8px',
        left: `${data.x}%`,
        width: data.size,
        height: data.size,
        background: data.color,
        boxShadow: `0 0 ${data.size * 2}px ${data.color}`,
        '--drift': `${data.drift}px`,
        '--pd': `${data.duration}s`,
        animationDelay: `${data.delay}s`,
        animationIterationCount: 'infinite',
      } as React.CSSProperties}
    />
  );
}

// ─── Legendary: StarField ─────────────────────────────────────
function StarField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {STAR_DATA.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top:  `${star.y}%`,
            width:  star.size,
            height: star.size,
            background:  star.color,
            '--base-opacity': star.baseOpacity,
            boxShadow: star.size >= 3 ? `0 0 ${star.size * 3}px ${star.color}80` : 'none',
            animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Legendary: Cosmic rays ───────────────────────────────────
function CosmicRays() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {RAY_ANGLES.map((angle, i) => {
        const colorOptions = [
          'linear-gradient(180deg, rgba(245,158,11,0.25) 0%, transparent 100%)',
          'linear-gradient(180deg, rgba(0,236,151,0.18) 0%, transparent 100%)',
          'linear-gradient(180deg, rgba(123,97,255,0.20) 0%, transparent 100%)',
        ];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              width: 1.5,
              height: '65vh',
              transformOrigin: '50% 0%',
              left: '50%',
              top: '50%',
              marginLeft: -0.75,
              transform: `rotate(${angle}deg)`,
              background: colorOptions[i % 3],
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 1, 0.8], opacity: [0, 0.9, 0.7, 0] }}
            transition={{
              duration: 5,
              times: [0, 0.15, 0.8, 1],
              delay: 0.2 + i * 0.07,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Legendary: "LEGENDARY" title reveal ──────────────────────
function LegendaryTitle() {
  return (
    <motion.div
      className="relative z-10 text-center mb-8 pointer-events-none select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.5 }}
    >
      <p
        className="font-black uppercase text-2xl animate-legendary-title"
        style={{
          color: '#fbbf24',
          textShadow: '0 0 20px rgba(245,158,11,1), 0 0 50px rgba(245,158,11,0.6), 0 0 90px rgba(245,158,11,0.3)',
        }}
      >
        ✦ LEGENDARY ✦
      </p>
      <motion.p
        className="text-amber-200/60 text-[11px] uppercase tracking-[0.45em] mt-1.5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6, ease: 'easeOut' }}
      >
        Achievement Unlocked
      </motion.p>
    </motion.div>
  );
}

// ─── Konami: retro banner ────────────────────────────────────
function KonamiBanner() {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.9, duration: 0.35 }}
    >
      {/* Scanline retro background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,236,151,0.03) 3px, rgba(0,236,151,0.03) 4px)',
        }}
      />
      <div className="relative z-10 text-center space-y-3 animate-konami-banner">
        <p
          className="font-mono font-black text-5xl text-[#00EC97]"
          style={{ textShadow: '0 0 20px #00EC97, 0 0 40px #00EC9780', letterSpacing: '0.1em' }}
        >
          ↑↑↓↓←→←→BA
        </p>
        <p
          className="font-mono font-bold text-2xl text-amber-300 tracking-[0.3em]"
          style={{ textShadow: '0 0 15px rgba(251,191,36,0.9)' }}
        >
          +30 LIVES
        </p>
        <p className="font-mono text-xs text-[#00EC97]/60 tracking-widest uppercase">
          konami code accepted
        </p>
      </div>
    </motion.div>
  );
}

// ─── Epic: Expanding rings ────────────────────────────────────
function ExpandingRings() {
  const rings = [
    { delay: 0,    color: 'rgba(168,85,247,0.85)',  rd: '1.3s' },
    { delay: 0.22, color: 'rgba(0,236,151,0.65)',   rd: '1.4s' },
    { delay: 0.44, color: 'rgba(123,97,255,0.55)',  rd: '1.5s' },
  ];
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[56]">
      {rings.map((ring, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 animate-ring-expand"
          style={{
            width: 80,
            height: 80,
            borderColor: ring.color,
            '--rd': ring.rd,
            animationDelay: `${ring.delay}s`,
            boxShadow: `0 0 12px ${ring.color}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Screen-Edge Shimmer (Epic) ────────────────────────────────
function EdgeShimmer() {
  return (
    <>
      <div className="fixed left-0 top-0 bottom-0 w-[2px] pointer-events-none z-[55] overflow-hidden">
        <div
          className="w-full h-full animate-edge-shimmer"
          style={{ background: 'linear-gradient(180deg, transparent, #a855f7, #00EC97, #a855f7, transparent)' }}
        />
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-[2px] pointer-events-none z-[55] overflow-hidden">
        <div
          className="w-full h-full animate-edge-shimmer"
          style={{ background: 'linear-gradient(180deg, transparent, #7B61FF, #00EC97, #7B61FF, transparent)', animationDelay: '0.12s' }}
        />
      </div>
      <div className="fixed top-0 left-0 right-0 h-[2px] pointer-events-none z-[55] overflow-hidden">
        <div
          className="h-full animate-edge-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent, #a855f7, #00EC97, #a855f7, transparent)',
            animationDelay: '0.06s',
            animation: 'edge-shimmer-h 1.8s ease-in-out forwards',
          }}
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-[2px] pointer-events-none z-[55] overflow-hidden">
        <div
          className="h-full animate-edge-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent, #7B61FF, #00EC97, #7B61FF, transparent)',
            animationDelay: '0.18s',
          }}
        />
      </div>
    </>
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
  forceCenter?: boolean;
}

function ToastCard({ achievement, onDismiss, forceCenter }: ToastCardProps) {
  const rarity = achievement.rarity;
  const cfg = RARITY_CONFIG[rarity];
  const isCenter = forceCenter || rarity === 'epic' || rarity === 'legendary';

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
    duration: rarity === 'legendary' ? 1.0 : rarity === 'epic' ? 0.6 : 0.35,
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
        isCenter ? 'w-[380px] max-w-[90vw]' : 'w-[320px] max-w-[calc(100vw-2rem)]',
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

// ─── LEGENDARY FULL SCREEN TAKEOVER ──────────────────────────
interface LegendaryTakeoverProps {
  achievement: AchievementDef;
  onDismiss: () => void;
  isKonami: boolean;
  animKey: number;
}

function LegendaryTakeover({ achievement, onDismiss, isKonami, animKey }: LegendaryTakeoverProps) {
  return (
    <motion.div
      key={`legendary-takeover-${animKey}`}
      className="fixed inset-0 z-[55] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {/* 1. Deep space backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(15,5,45,0.99) 0%, rgba(2,0,10,1) 100%)',
        }}
      />

      {/* 2. Nebula glow — pulsing purple + cyan gradients */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.8, 0.5, 0.7] }}
        transition={{ duration: 6, times: [0, 0.1, 0.3, 0.6, 1], ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        style={{
          background: [
            'radial-gradient(ellipse at 38% 62%, rgba(123,97,255,0.22) 0%, transparent 55%)',
            'radial-gradient(ellipse at 62% 38%, rgba(0,236,151,0.14) 0%, transparent 48%)',
            'radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

      {/* 3. Starfield */}
      <StarField />

      {/* 4. Cosmic rays emanating from center */}
      <CosmicRays />

      {/* 5. Konami easter egg banner (auto-fades after ~1.9s) */}
      {isKonami && <KonamiBanner />}

      {/* 6. "LEGENDARY" title reveal */}
      <LegendaryTitle />

      {/* 7. Achievement card — materializes dramatically */}
      <motion.div
        className="relative z-10 pointer-events-auto"
        initial={{ opacity: 0, scale: 0.55, y: 50, filter: 'blur(22px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.8, y: -20, filter: 'blur(8px)' }}
        transition={{ delay: 0.65, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <ToastCard achievement={achievement} onDismiss={onDismiss} forceCenter />
      </motion.div>

      {/* 8. Full-screen rising particle storm */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {LEGENDARY_PARTICLES.map((data, i) => (
          <LegendaryScreenParticle key={`${animKey}-lp-${i}`} data={data} />
        ))}
      </div>

      {/* 9. Subtle scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
        }}
      />

      {/* 10. Screen flash on entry */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-white"
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

// ─── Main Layer ────────────────────────────────────────────────
export function AchievementToastLayer() {
  const { pendingPopups, dismissPopup } = useAchievementContext();
  const { playAchievementSound } = useAchievementSound();
  const current = pendingPopups[0] ?? null;
  const [key, setKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!current) return;

    setKey(k => k + 1);
    playAchievementSound(current);

    const DISMISS_MS: Record<AchievementRarity, number> = {
      common:    4000,
      uncommon:  4500,
      rare:      5500,
      epic:      7000,
      legendary: 9500,
    };
    timerRef.current = setTimeout(dismissPopup, DISMISS_MS[current.rarity]);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current?.id, dismissPopup, playAchievementSound]); // eslint-disable-line react-hooks/exhaustive-deps

  const rarity = current?.rarity ?? 'common';
  const isKonami = current?.id === 'konami_coder';
  const isCenter = rarity === 'epic' || rarity === 'legendary';
  const particleCount = PARTICLE_COUNT[rarity];

  return (
    <AnimatePresence>
      {current && (
        <>
          {/* ── LEGENDARY: Full screen takeover (handles everything internally) ── */}
          {rarity === 'legendary' ? (
            <LegendaryTakeover
              achievement={current}
              onDismiss={dismissPopup}
              isKonami={isKonami}
              animKey={key}
            />
          ) : (
            <>
              {/* ── EPIC: screen shake + edge shimmers + expanding rings ── */}
              {rarity === 'epic' && (
                <>
                  <EdgeShimmer key={`edge-${key}`} />
                  <ExpandingRings key={`rings-${key}`} />
                  {/* Screen shake: brief transform on an invisible overlay — the card wrapper below handles it */}
                </>
              )}

              {/* ── Particle overlay (uncommon / rare / epic) ── */}
              {particleCount > 0 && (
                <div
                  key={`particles-${key}`}
                  className={cn(
                    'fixed pointer-events-none z-[58]',
                    isCenter
                      ? 'inset-0 flex items-center justify-center'
                      : 'top-20 right-4 w-[320px] h-[160px]',
                  )}
                >
                  {Array.from({ length: particleCount }, (_, i) => (
                    <VoidParticle
                      key={i}
                      index={i}
                      total={particleCount}
                      rarity={rarity}
                      mode={rarity === 'epic' ? 'ring' : 'burst'}
                      delay={i * 0.04}
                    />
                  ))}
                </div>
              )}

              {/* ── Toast card (with optional Epic screen shake) ── */}
              <motion.div
                key={`card-wrapper-${key}`}
                className={cn(
                  'z-[60]',
                  isCenter
                    ? 'fixed inset-0 flex items-center justify-center pointer-events-none'
                    : 'fixed top-20 right-4',
                )}
                /* Epic screen shake via Framer Motion keyframes */
                animate={rarity === 'epic' ? {
                  x: [-5, 5, -4, 4, -3, 3, -2, 2, -1, 0],
                  y: [-2, 3, -2, 1, -1, 0, 0, 0, 0, 0],
                } : {}}
                transition={rarity === 'epic' ? {
                  duration: 0.55,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 1],
                  ease: 'easeOut',
                } : {}}
              >
                <div className="pointer-events-auto">
                  <ToastCard
                    key={`card-${key}`}
                    achievement={current}
                    onDismiss={dismissPopup}
                  />
                </div>
              </motion.div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
