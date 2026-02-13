'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { connections, type NodeStatus } from './constellation-data';

/* ─── Animated Connection Lines ────────────────────────────── */

interface ConstellationLinesProps {
  positions: Map<string, { x: number; y: number }>;
  getStatus: (id: string) => NodeStatus;
}

function ConstellationLinesInner({ positions, getStatus }: ConstellationLinesProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1600 1400"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="conn-completed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00EC97" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="conn-available" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00EC97" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.2" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="conn-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Particle filter for flowing dots */}
        <filter id="particle-glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {connections.map((conn) => {
        const from = positions.get(conn.from);
        const to = positions.get(conn.to);
        if (!from || !to) return null;

        const fromDone = getStatus(conn.from) === 'completed';
        const toDone = getStatus(conn.to) === 'completed';
        const isCompleted = fromDone && toDone;
        const isAvailable = fromDone && !toDone;
        const isLocked = !fromDone;

        const stroke = isCompleted
          ? 'url(#conn-completed)'
          : isAvailable
          ? 'url(#conn-available)'
          : 'rgba(60,60,60,0.15)';

        const pathId = `path-${conn.from}-${conn.to}`;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        return (
          <g key={pathId}>
            {/* Main line */}
            <motion.line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={stroke}
              strokeWidth={isCompleted ? 2 : isAvailable ? 1.5 : 0.8}
              strokeDasharray={isLocked ? '6 4' : '0'}
              filter={isCompleted ? 'url(#conn-glow)' : undefined}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Animated flowing particle for completed connections */}
            {isCompleted && (
              <>
                <circle r="3" fill="#00EC97" filter="url(#particle-glow)">
                  <animateMotion
                    dur={`${Math.max(2, dist / 80)}s`}
                    repeatCount="indefinite"
                    path={`M${from.x},${from.y} L${to.x},${to.y}`}
                  />
                  <animate attributeName="opacity" values="0;1;1;0" dur={`${Math.max(2, dist / 80)}s`} repeatCount="indefinite" />
                </circle>
              </>
            )}

            {/* Subtle pulse for available connections */}
            {isAvailable && (
              <motion.line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="url(#conn-available)"
                strokeWidth={2.5}
                strokeOpacity={0}
                animate={{ strokeOpacity: [0, 0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export const ConstellationLines = memo(ConstellationLinesInner);
