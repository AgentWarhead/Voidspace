/* ─── LevelUpCelebration — Void-themed level-up overlay ────────
 * Triggered by XPEventContext when level increases.
 * Cosmic particle ring + level title reveal. Auto-dismisses 3s.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useXPEvents } from '@/contexts/XPEventContext';

// ─── Ring Particle ────────────────────────────────────────────

function RingParticle({ index, total }: { index: number; total: number }) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 100 + Math.random() * 50;
  const px = Math.cos(angle) * radius;
  const py = Math.sin(angle) * radius;
  const size = 2 + Math.random() * 5;
  const duration = 0.8 + Math.random() * 0.7;

  const palette = ['#00EC97', '#7B61FF', '#a855f7', '#0ff', '#00d4aa'];
  const color = palette[index % palette.length];

  return (
    <div
      className="absolute rounded-full animate-void-particle"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
        top: '50%',
        left: '50%',
        marginTop: -size / 2,
        marginLeft: -size / 2,
        '--px': `${px}px`,
        '--py': `${py}px`,
        '--pd': `${duration}s`,
        animationDelay: `${index * 0.025}s`,
      } as React.CSSProperties}
    />
  );
}

// ─── Rise Particles ───────────────────────────────────────────

function RiseParticle({ index }: { index: number }) {
  const drift = (Math.random() - 0.5) * 120;
  const size = 2 + Math.random() * 4;
  const duration = 1.5 + Math.random() * 1;
  const palette = ['#00EC97', '#7B61FF', '#a855f7'];
  const color = palette[index % palette.length];

  return (
    <div
      className="absolute bottom-0 left-1/2 rounded-full animate-void-particle-rise"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        marginLeft: -size / 2,
        '--drift': `${drift}px`,
        '--pd': `${duration}s`,
        animationDelay: `${Math.random() * 0.8}s`,
      } as React.CSSProperties}
    />
  );
}

// ─── Main ─────────────────────────────────────────────────────

const RING_COUNT = 18;
const RISE_COUNT = 14;
const AUTO_DISMISS_MS = 3200;

export function LevelUpCelebration() {
  const { levelUpEvent, dismissLevelUp } = useXPEvents();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!levelUpEvent) return;

    timerRef.current = setTimeout(dismissLevelUp, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [levelUpEvent, dismissLevelUp]);

  return (
    <AnimatePresence>
      {levelUpEvent && (
        <>
          {/* Dark void backdrop */}
          <motion.div
            key="lvlup-backdrop"
            className="fixed inset-0 z-[65] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(8,4,24,0.94) 0%, rgba(2,0,10,0.97) 100%)',
            }}
          />

          {/* Clickable dismiss layer */}
          <motion.div
            key="lvlup-dismiss"
            className="fixed inset-0 z-[66] cursor-pointer"
            onClick={dismissLevelUp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Particle ring */}
          <div
            key="lvlup-particles"
            className="fixed inset-0 z-[67] flex items-center justify-center pointer-events-none"
          >
            <div className="relative">
              {Array.from({ length: RING_COUNT }, (_, i) => (
                <RingParticle key={i} index={i} total={RING_COUNT} />
              ))}
            </div>
          </div>

          {/* Rise particles */}
          <div
            key="lvlup-rise"
            className="fixed inset-0 z-[67] overflow-hidden pointer-events-none"
          >
            {Array.from({ length: RISE_COUNT }, (_, i) => (
              <RiseParticle key={i} index={i} />
            ))}
          </div>

          {/* Card */}
          <div className="fixed inset-0 z-[68] flex items-center justify-center pointer-events-none">
            <motion.div
              key="lvlup-card"
              initial={{ opacity: 0, scale: 0.7, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.85, y: -20, filter: 'blur(6px)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center px-10 py-8 rounded-2xl border backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0,236,151,0.08) 0%, rgba(123,97,255,0.12) 100%)',
                borderColor: 'rgba(0,236,151,0.3)',
                boxShadow:
                  '0 0 60px rgba(0,236,151,0.2), 0 0 120px rgba(123,97,255,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Shimmer */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-0 animate-shimmer"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(0,236,151,0.08) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-[10px] uppercase tracking-[0.25em] font-medium mb-2"
                style={{ color: 'rgba(0,236,151,0.6)' }}
              >
                Level Up
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="text-7xl font-black mb-3"
                style={{
                  background: 'linear-gradient(135deg, #00EC97 0%, #7B61FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0,236,151,0.5))',
                }}
              >
                {levelUpEvent.toLevel}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="text-2xl font-bold text-white mb-1"
                style={{ textShadow: '0 0 30px rgba(0,236,151,0.4)' }}
              >
                {levelUpEvent.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-sm text-white/40"
              >
                Rank achieved
              </motion.p>

              {/* Teal accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
                style={{
                  background: 'linear-gradient(90deg, transparent, #00EC97, #7B61FF, transparent)',
                }}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
