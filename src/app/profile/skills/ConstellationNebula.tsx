'use client';

import { useMemo, useState, useEffect } from 'react';
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

  // Shooting stars — appear every 10-15s
  const [shootingStar, setShootingStar] = useState<{ x: number; y: number; angle: number; id: number } | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function scheduleNext() {
      const delay = 10000 + Math.random() * 5000;
      timeout = setTimeout(() => {
        setShootingStar({
          x: 10 + Math.random() * 60,
          y: 5 + Math.random() * 40,
          angle: 20 + Math.random() * 30,
          id: Date.now(),
        });
        // Clear after animation
        setTimeout(() => setShootingStar(null), 1200);
        scheduleNext();
      }, delay);
    }
    scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

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

      {/* Shooting star */}
      {shootingStar && (
        <div
          key={shootingStar.id}
          className="absolute animate-[shootingStar_1s_linear_forwards]"
          style={{
            left: `${shootingStar.x}%`,
            top: `${shootingStar.y}%`,
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            transform: `rotate(${shootingStar.angle}deg)`,
            opacity: 0,
          }}
        />
      )}

      {/* CSS for shooting star animation */}
      <style jsx>{`
        @keyframes shootingStar {
          0% { opacity: 0; transform: translateX(0) rotate(var(--angle, 25deg)); }
          10% { opacity: 1; }
          80% { opacity: 0.6; }
          100% { opacity: 0; transform: translateX(200px) rotate(var(--angle, 25deg)); }
        }
      `}</style>
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
      const cx = (q.cx / MAP_WIDTH) * 100;
      const cy = (q.cy / MAP_HEIGHT) * 100;
      return { id, cx, cy, color };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {nebulae.map(n => {
        const isComplete = trackCompletions[n.id];
        const baseOpacity = isComplete ? 0.18 : 0.06;
        const midOpacity = isComplete ? 0.1 : 0.035;
        const outerOpacity = isComplete ? 0.06 : 0.02;
        return (
          <div key={n.id} className="absolute inset-0">
            {/* Inner core — brighter with more color stops */}
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                background: `radial-gradient(ellipse 30% 25% at ${n.cx}% ${n.cy}%, ${n.color}${baseOpacity}), ${n.color}${midOpacity}) 50%, transparent 80%)`,
              }}
            />
            {/* Mid halo */}
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                background: `radial-gradient(ellipse 45% 40% at ${n.cx}% ${n.cy}%, ${n.color}${midOpacity}), transparent 75%)`,
              }}
            />
            {/* Outer glow */}
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                background: `radial-gradient(ellipse 60% 55% at ${n.cx}% ${n.cy}%, ${n.color}${outerOpacity}), transparent 85%)`,
              }}
            />
            {/* Drifting wisp (CSS animation, not framer-motion for perf) */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 20% 12% at ${n.cx + 5}% ${n.cy - 3}%, ${n.color}${isComplete ? 0.08 : 0.025}), transparent 90%)`,
                animation: `nebulaWisp${n.id} 20s ease-in-out infinite`,
              }}
            />
          </div>
        );
      })}

      {/* CSS animations for nebula wisps */}
      <style jsx>{`
        @keyframes nebulaWispexplorer {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -10px) scale(1.1); }
        }
        @keyframes nebulaWispbuilder {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-12px, 8px) scale(1.05); }
        }
        @keyframes nebulaWisphacker {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, 12px) scale(1.08); }
        }
        @keyframes nebulaWispfounder {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8px, -15px) scale(1.06); }
        }
      `}</style>
    </div>
  );
}
