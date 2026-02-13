'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Level } from './constellation-data';

/* ─── Celebration Overlay ──────────────────────────────────── */

interface CelebrationProps {
  /** Node just completed (brief sparkle burst) */
  completedNodeId: string | null;
  /** If completion triggered a level-up, show dramatic overlay */
  levelUp: { level: Level; xpGained: number } | null;
  onDismiss: () => void;
}

export function ConstellationCelebration({ completedNodeId, levelUp, onDismiss }: CelebrationProps) {
  // Auto-dismiss level-up after 3s
  useEffect(() => {
    if (!levelUp) return;
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [levelUp, onDismiss]);

  // Auto-dismiss sparkle burst after 1.5s
  useEffect(() => {
    if (!completedNodeId || levelUp) return;
    const t = setTimeout(onDismiss, 1500);
    return () => clearTimeout(t);
  }, [completedNodeId, levelUp, onDismiss]);

  // Generate sparkle positions once per trigger
  const sparkles = useMemo(() => {
    if (!completedNodeId) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i / 20) * 360 + Math.random() * 18,
      dist: 40 + Math.random() * 80,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.3,
      color: i % 3 === 0 ? '#00EC97' : i % 3 === 1 ? '#00D4FF' : '#C084FC',
    }));
  }, [completedNodeId]);

  return (
    <AnimatePresence>
      {/* Brief sparkle burst on node completion */}
      {completedNodeId && !levelUp && (
        <motion.div
          key="sparkle-burst"
          className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              className="absolute rounded-full"
              style={{
                width: s.size,
                height: s.size,
                backgroundColor: s.color,
                boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
                y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, delay: s.delay, ease: 'easeOut' }}
            />
          ))}
          {/* Central flash */}
          <motion.div
            className="absolute w-12 h-12 rounded-full bg-near-green/30"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      )}

      {/* Dramatic level-up overlay */}
      {levelUp && (
        <motion.div
          key="level-up"
          className="fixed inset-0 z-[70] flex items-center justify-center cursor-pointer"
          onClick={onDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background dim */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Radial glow burst */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,236,151,0.3) 0%, rgba(0,212,255,0.1) 40%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.2], opacity: [0, 1, 0.6] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 text-center space-y-4"
            initial={{ scale: 0.5, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            {/* Level icon */}
            <motion.div
              className="text-7xl"
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {levelUp.level.icon}
            </motion.div>

            {/* LEVEL UP text */}
            <motion.h2
              className="text-4xl font-black tracking-wider bg-gradient-to-r from-near-green via-accent-cyan to-purple-400 bg-clip-text text-transparent"
              initial={{ letterSpacing: '0.3em', opacity: 0 }}
              animate={{ letterSpacing: '0.15em', opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              LEVEL UP!
            </motion.h2>

            {/* Level name */}
            <motion.p
              className="text-xl font-bold text-text-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {levelUp.level.name}
            </motion.p>

            {/* XP gained */}
            <motion.p
              className="text-sm font-mono text-near-green"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              +{levelUp.xpGained} XP
            </motion.p>

            {/* Dismiss hint */}
            <motion.p
              className="text-xs text-text-muted mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.2 }}
            >
              Click anywhere to continue
            </motion.p>
          </motion.div>

          {/* Floating sparkle particles around the overlay */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3 + (i % 3) * 2,
                height: 3 + (i % 3) * 2,
                backgroundColor: i % 3 === 0 ? '#00EC97' : i % 3 === 1 ? '#00D4FF' : '#C084FC',
                boxShadow: `0 0 8px ${i % 3 === 0 ? '#00EC97' : i % 3 === 1 ? '#00D4FF' : '#C084FC'}`,
              }}
              initial={{
                x: 0, y: 0, opacity: 0,
              }}
              animate={{
                x: Math.cos((i / 12) * Math.PI * 2) * (120 + Math.random() * 60),
                y: Math.sin((i / 12) * Math.PI * 2) * (120 + Math.random() * 60),
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2, delay: 0.3 + i * 0.08, repeat: Infinity, repeatDelay: 0.5 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
