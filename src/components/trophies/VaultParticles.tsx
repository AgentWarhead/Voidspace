/* ─── VaultParticles — Ambient Void Space Particles ──────────
 * Floating ambient particles for the Trophy Vault background.
 * Uses CSS animations only — no heavy JS loops.
 * ─────────────────────────────────────────────────────────── */

'use client';

import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  opacity: number;
}

const COLORS = [
  'rgba(0,212,255,0.6)',   // cyan
  'rgba(139,92,246,0.5)',  // purple
  'rgba(0,236,151,0.4)',   // near-green
  'rgba(245,158,11,0.3)',  // amber (occasional gold)
  'rgba(255,255,255,0.2)', // white dust
];

export function VaultParticles({ count = 50 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    // Deterministic seed-based positions so SSR matches client
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 2654435761) >>> 0;
      const rand = (n: number) => ((seed * (n + 1) * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      return {
        id: i,
        x: rand(1) * 100,
        y: rand(2) * 100,
        size: 1 + rand(3) * 3,
        color: COLORS[Math.floor(rand(4) * COLORS.length)],
        duration: 8 + rand(5) * 16,
        delay: rand(6) * -20,
        opacity: 0.3 + rand(7) * 0.7,
      };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: p.opacity,
            animation: `vault-float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes vault-float {
          0%   { transform: translate(0, 0) scale(1); opacity: var(--op, 0.5); }
          33%  { transform: translate(${12}px, ${-18}px) scale(1.2); }
          66%  { transform: translate(${-8}px, ${8}px) scale(0.85); }
          100% { transform: translate(${15}px, ${12}px) scale(1); opacity: calc(var(--op, 0.5) * 0.4); }
        }
      `}</style>
    </div>
  );
}
