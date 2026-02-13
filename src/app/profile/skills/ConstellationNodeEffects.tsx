'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

/* ─── SVG Lens Flare for Completed Nodes ───────────────────── */

export const LensFlare = memo(function LensFlare({ size, color }: { size: number; color: string }) {
  const r = size * 0.8;
  const rayCount = 6;
  return (
    <svg
      className="absolute pointer-events-none"
      style={{ width: r * 2, height: r * 2, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`}
    >
      <defs>
        <radialGradient id={`flare-core-${size}`}>
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="40%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Central glow */}
      <circle cx="0" cy="0" r={size * 0.3} fill={`url(#flare-core-${size})`}>
        <animate attributeName="r" values={`${size * 0.25};${size * 0.35};${size * 0.25}`} dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Cross rays */}
      {Array.from({ length: rayCount }).map((_, i) => {
        const angle = (i / rayCount) * 360;
        return (
          <line
            key={i}
            x1="0" y1="0"
            x2={Math.cos((angle * Math.PI) / 180) * r * 0.9}
            y2={Math.sin((angle * Math.PI) / 180) * r * 0.9}
            stroke={color}
            strokeWidth="1"
            opacity="0.4"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.6;0.2"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
            />
            <animate
              attributeName="x2"
              values={`${Math.cos((angle * Math.PI) / 180) * r * 0.7};${Math.cos((angle * Math.PI) / 180) * r * 0.95};${Math.cos((angle * Math.PI) / 180) * r * 0.7}`}
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
            />
            <animate
              attributeName="y2"
              values={`${Math.sin((angle * Math.PI) / 180) * r * 0.7};${Math.sin((angle * Math.PI) / 180) * r * 0.95};${Math.sin((angle * Math.PI) / 180) * r * 0.7}`}
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
            />
          </line>
        );
      })}
    </svg>
  );
});

/* ─── Orbiting Sparkle Particles ───────────────────────────── */

export const OrbitingSparkles = memo(function OrbitingSparkles({ size, color }: { size: number; color: string }) {
  const orbitR = size * 0.7;
  return (
    <svg
      className="absolute pointer-events-none"
      style={{ width: orbitR * 2 + 8, height: orbitR * 2 + 8, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      viewBox={`${-orbitR - 4} ${-orbitR - 4} ${orbitR * 2 + 8} ${orbitR * 2 + 8}`}
    >
      <defs>
        <filter id="sparkle-glow">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      {[0, 1, 2].map(i => (
        <circle key={i} r="2" fill={color} filter="url(#sparkle-glow)">
          <animateMotion
            dur={`${3 + i}s`}
            repeatCount="indefinite"
            begin={`${i * 1.2}s`}
            path={`M0,${-orbitR} A${orbitR},${orbitR} 0 1,1 0.01,${-orbitR}`}
          />
          <animate attributeName="opacity" values="0;1;1;0" dur={`${3 + i}s`} repeatCount="indefinite" begin={`${i * 1.2}s`} />
        </circle>
      ))}
    </svg>
  );
});

/* ─── HUD Targeting Reticle (hover state) ──────────────────── */

export const HudReticle = memo(function HudReticle({
  size, color, label, xp,
}: { size: number; color: string; label: string; xp: number }) {
  const reticleSize = size * 2.8;
  const r = reticleSize / 2 - 4;
  const dashLen = Math.PI * r * 0.15;
  return (
    <div
      className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
      style={{ width: reticleSize, height: reticleSize, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <svg className="w-full h-full" viewBox={`0 0 ${reticleSize} ${reticleSize}`}>
        {/* Rotating dashed circle */}
        <circle
          cx={reticleSize / 2} cy={reticleSize / 2} r={r}
          fill="none" stroke={color} strokeWidth="1" strokeDasharray={`${dashLen} ${dashLen * 0.6}`}
          opacity="0.5"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${reticleSize / 2} ${reticleSize / 2}`}
            to={`360 ${reticleSize / 2} ${reticleSize / 2}`}
            dur="12s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Corner brackets */}
        {[0, 90, 180, 270].map(angle => (
          <line
            key={angle}
            x1={reticleSize / 2 + Math.cos((angle * Math.PI) / 180) * (r - 6)}
            y1={reticleSize / 2 + Math.sin((angle * Math.PI) / 180) * (r - 6)}
            x2={reticleSize / 2 + Math.cos((angle * Math.PI) / 180) * (r + 2)}
            y2={reticleSize / 2 + Math.sin((angle * Math.PI) / 180) * (r + 2)}
            stroke={color} strokeWidth="1.5" opacity="0.7"
          />
        ))}
      </svg>
      {/* Tooltip */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm rounded-md px-2.5 py-1 border border-border/60 whitespace-nowrap"
        style={{ bottom: -6 }}
      >
        <span className="text-[9px] font-mono text-text-primary block leading-tight">{label}</span>
        <span className="text-[8px] font-mono block leading-tight" style={{ color }}>{xp} XP</span>
      </div>
    </div>
  );
});

/* ─── Pulsing Beacon Ring (available nodes) ────────────────── */

export const BeaconRing = memo(function BeaconRing({ size, color }: { size: number; color: string }) {
  return (
    <>
      <motion.div
        className="absolute rounded-full border-2"
        style={{ width: size * 1.6, height: size * 1.6, borderColor: color, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full border"
        style={{ width: size * 1.3, height: size * 1.3, borderColor: color, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.2, height: size * 1.2,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${color.replace(')', ',0.15)')} 0%, transparent 70%)`,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
});
