/* ─── VaultParticles — Ambient Void Space Particles ──────────
 * Floating ambient particles for the Trophy Vault background.
 * Uses framer-motion for smooth ambient animation.
 * ─────────────────────────────────────────────────────────── */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

const COLORS = [
  'rgba(0,212,255,0.7)',   // cyan
  'rgba(139,92,246,0.6)',  // purple
  'rgba(0,236,151,0.5)',   // near-green
  'rgba(245,158,11,0.35)', // amber (occasional gold)
  'rgba(255,255,255,0.25)', // white dust
];

// Deterministic "random" from seed — avoids hydration mismatch
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function VaultParticles({ count = 45 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRand(i * 7 + 1) * 100,
      y: seededRand(i * 7 + 2) * 100,
      size: 1.5 + seededRand(i * 7 + 3) * 2.5,
      color: COLORS[Math.floor(seededRand(i * 7 + 4) * COLORS.length)],
      duration: 10 + seededRand(i * 7 + 5) * 14,
      delay: -seededRand(i * 7 + 6) * 20,
      driftX: (seededRand(i * 7 + 7) - 0.5) * 40,
      driftY: (seededRand(i * 7 + 8) - 0.5) * 40,
    }));
  }, [count]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            x: [0, p.driftX, -p.driftX / 2, 0],
            y: [0, p.driftY / 2, -p.driftY, 0],
            opacity: [0.6, 1, 0.3, 0.6],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
