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
        <linearGradient id="conn-completed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00EC97" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="conn-available" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00EC97" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.2" />
        </linearGradient>
        <filter id="conn-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="particle-glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        {/* Arrow marker for available connections */}
        <marker id="arrow-avail" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
        </marker>
        <marker id="arrow-completed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="rgba(0,236,151,0.5)" strokeWidth="1" />
        </marker>
      </defs>

      {connections.map((conn) => {
        const from = positions.get(conn.from);
        const to = positions.get(conn.to);
        if (!from || !to) return null;

        const fromDone = getStatus(conn.from) === 'completed';
        const toDone = getStatus(conn.to) === 'completed';
        const isCompleted = fromDone && toDone;
        const isAvailable = fromDone && !toDone;

        const stroke = isCompleted
          ? 'url(#conn-completed)'
          : isAvailable
          ? 'url(#conn-available)'
          : 'rgba(60,60,60,0.12)';

        const pathId = `path-${conn.from}-${conn.to}`;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dur = Math.max(2, dist / 80);

        const markerEnd = isCompleted
          ? 'url(#arrow-completed)'
          : isAvailable
          ? 'url(#arrow-avail)'
          : undefined;

        return (
          <g key={pathId}>
            {/* Define path for animateMotion */}
            <path id={pathId} d={`M${from.x},${from.y} L${to.x},${to.y}`} fill="none" stroke="none" />

            {/* Main line */}
            <motion.line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={stroke}
              strokeWidth={isCompleted ? 2 : isAvailable ? 1.5 : 0.6}
              strokeDasharray={isCompleted ? '0' : isAvailable ? '8 4' : '4 6'}
              filter={isCompleted ? 'url(#conn-glow)' : undefined}
              markerEnd={markerEnd}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Completed: multiple flowing particles */}
            {isCompleted && (
              <>
                <circle r="3" fill="#00EC97" filter="url(#particle-glow)">
                  <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={`M${from.x},${from.y} L${to.x},${to.y}`} />
                  <animate attributeName="opacity" values="0;1;1;0" dur={`${dur}s`} repeatCount="indefinite" />
                </circle>
                <circle r="2" fill="#00D4FF" filter="url(#particle-glow)">
                  <animateMotion dur={`${dur * 1.3}s`} repeatCount="indefinite" begin={`${dur * 0.4}s`} path={`M${from.x},${from.y} L${to.x},${to.y}`} />
                  <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${dur * 1.3}s`} repeatCount="indefinite" begin={`${dur * 0.4}s`} />
                </circle>
              </>
            )}

            {/* Available: breathing pulse glow */}
            {isAvailable && (
              <motion.line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="url(#conn-available)"
                strokeWidth={3}
                strokeOpacity={0}
                strokeDasharray="8 4"
                animate={{ strokeOpacity: [0, 0.5, 0], strokeDashoffset: [0, -24] }}
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
