'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TRACK_QUADRANTS, MAP_WIDTH, MAP_HEIGHT, type TrackId } from './constellation-data';

/* ─── Parallax Star Field ──────────────────────────────────── */

interface StarFieldProps {
  panX: number;
  panY: number;
}

const STAR_LAYERS = [
  { count: 60, sizeRange: [1, 1.5], opacity: 0.3, parallax: 0.02 },
  { count: 40, sizeRange: [1.5, 2.5], opacity: 0.5, parallax: 0.05 },
  { count: 20, sizeRange: [2.5, 3.5], opacity: 0.7, parallax: 0.1 },
];

function generateStars(count: number, seed: number) {
  return Array.from({ length: count }, (_, i) => ({
    x: ((i * 17 + seed * 31 + 7) % 100),
    y: ((i * 23 + seed * 13 + 11) % 100),
    size: 1 + ((i * 7 + seed) % 10) / 10,
    delay: (i % 8) * 0.6,
    duration: 3 + (i % 4),
  }));
}

export function ConstellationStarField({ panX, panY }: StarFieldProps) {
  const layers = useMemo(() =>
    STAR_LAYERS.map((layer, li) => ({
      ...layer,
      stars: generateStars(layer.count, li * 100),
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {layers.map((layer, li) => (
        <div
          key={li}
          className="absolute inset-0"
          style={{
            transform: `translate(${panX * layer.parallax}px, ${panY * layer.parallax}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {layer.stars.map((star, si) => (
            <motion.div
              key={si}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size * (layer.sizeRange[1] / 2),
                height: star.size * (layer.sizeRange[1] / 2),
                backgroundColor: si % 5 === 0 ? 'rgba(0,236,151,0.5)' : si % 3 === 0 ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.6)',
              }}
              animate={{ opacity: [0.05, layer.opacity, 0.05] }}
              transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Nebula Gas Clouds ────────────────────────────────────── */

interface NebulaProps {
  trackCompletions: Record<TrackId, boolean>;
}

const NEBULA_COLORS: Record<TrackId, string> = {
  explorer: 'rgba(0, 212, 255,',
  builder: 'rgba(0, 236, 151,',
  hacker: 'rgba(192, 132, 252,',
  founder: 'rgba(251, 146, 60,',
};

export function ConstellationNebula({ trackCompletions }: NebulaProps) {
  const nebulae = useMemo(() => {
    const trackIds: TrackId[] = ['explorer', 'builder', 'hacker', 'founder'];
    return trackIds.map(id => {
      const q = TRACK_QUADRANTS[id];
      const color = NEBULA_COLORS[id];
      // Convert pixel positions to percentages
      const cx = (q.cx / MAP_WIDTH) * 100;
      const cy = (q.cy / MAP_HEIGHT) * 100;
      return { id, cx, cy, color };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {nebulae.map(n => {
        const isComplete = trackCompletions[n.id];
        const baseOpacity = isComplete ? 0.12 : 0.05;
        const outerOpacity = isComplete ? 0.06 : 0.025;
        return (
          <div key={n.id} className="absolute inset-0">
            {/* Inner core */}
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                background: `radial-gradient(ellipse 35% 30% at ${n.cx}% ${n.cy}%, ${n.color}${baseOpacity}), transparent 70%)`,
              }}
            />
            {/* Outer halo */}
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                background: `radial-gradient(ellipse 50% 45% at ${n.cx}% ${n.cy}%, ${n.color}${outerOpacity}), transparent 80%)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
