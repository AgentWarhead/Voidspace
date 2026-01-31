'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import type { CategoryWithStats } from '@/types';

interface TVLByCategoryProps {
  categories: CategoryWithStats[];
}

/* ── Constants ── */
const CX = 200;
const CY = 200;
const MIN_ORBIT = 65;
const MAX_ORBIT = 155;
const MIN_NODE = 8;
const MAX_NODE = 22;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~137.5° — maximises angular separation

/* ── Helpers ── */
function voidColor(score: number): string {
  if (score >= 67) return '#00EC97';
  if (score >= 34) return '#FFA502';
  return '#FF4757';
}

/* ── Component ── */
export function TVLByCategory({ categories }: TVLByCategoryProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const totalTVL = categories.reduce((s, c) => s + c.totalTVL, 0);

  // Sort by TVL descending — highest TVL near center
  const sorted = useMemo(
    () => [...categories].sort((a, b) => b.totalTVL - a.totalTVL),
    [categories]
  );

  if (!sorted.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-text-muted text-sm font-mono">
        No TVL data available
      </div>
    );
  }

  const maxTVL = Math.max(...sorted.map((c) => c.totalTVL), 1);
  const maxProjects = Math.max(...sorted.map((c) => c.projectCount), 1);

  const nodes = sorted.map((cat, i) => {
    // Golden angle distribution avoids adjacent nodes clustering
    const angle = i * GOLDEN_ANGLE - Math.PI / 2;
    // High TVL → close to center (captured by gravity); low TVL → far (floating in the void)
    const tvlRatio = cat.totalTVL / maxTVL;
    const orbit = MAX_ORBIT - tvlRatio * (MAX_ORBIT - MIN_ORBIT);
    const x = CX + orbit * Math.cos(angle);
    const y = CY + orbit * Math.sin(angle);
    const size = MIN_NODE + (cat.projectCount / maxProjects) * (MAX_NODE - MIN_NODE);
    const color = voidColor(cat.gapScore);
    return { cat, x, y, orbit, size, color, angle };
  });

  // Unique orbit radii for orbital path rings (rounded to avoid duplicates)
  const orbitRings = (() => {
    const seen = new Set<number>();
    return nodes
      .map((n) => Math.round(n.orbit / 10) * 10)
      .filter((r) => {
        if (seen.has(r)) return false;
        seen.add(r);
        return true;
      })
      .sort((a, b) => a - b);
  })();

  return (
    <div className="relative" style={{ height: 300 }}>
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <filter id="gw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gw-core" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="gw-sphere">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="70%" stopColor="#0a0a14" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="gw-bg">
            <stop offset="0%" stopColor="#00EC97" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <circle cx={CX} cy={CY} r={MAX_ORBIT + 30} fill="url(#gw-bg)" />

        {/* Orbital path rings (slowly rotating dashes) */}
        {orbitRings.map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none"
            stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} strokeDasharray="2 6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${CX} ${CY}`}
              to={`360 ${CX} ${CY}`}
              dur="120s"
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Connection line from center to hovered node */}
        {hovered !== null && nodes[hovered] && (
          <line
            x1={CX} y1={CY}
            x2={nodes[hovered].x} y2={nodes[hovered].y}
            stroke={nodes[hovered].color}
            strokeWidth={1}
            strokeOpacity={0.3}
            strokeDasharray="4 4"
          />
        )}

        {/* Center sphere (the gravity well core) */}
        <circle cx={CX} cy={CY} r={32} fill="url(#gw-sphere)" />

        {/* Pulsing ring around the core */}
        <circle cx={CX} cy={CY} r={36} fill="none"
          stroke="#00EC97" strokeWidth={1} strokeOpacity={0.15}
          filter="url(#gw-core)"
        >
          <animate attributeName="r" values="36;40;36" dur="4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.15;0.3;0.15" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Category nodes */}
        {nodes.map((node, i) => (
          <g
            key={i}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Outer glow ring */}
            <circle
              cx={node.x} cy={node.y} r={node.size + 3}
              fill={node.color}
              fillOpacity={hovered === i ? 0.12 : 0.04}
              filter="url(#gw-glow)"
              style={{ transition: 'fill-opacity .3s' }}
            />

            {/* Node body */}
            <circle
              cx={node.x} cy={node.y}
              r={hovered === i ? node.size * 1.25 : node.size}
              fill={node.color}
              fillOpacity={hovered === null ? 0.6 : hovered === i ? 0.9 : 0.15}
              stroke={node.color}
              strokeWidth={hovered === i ? 1.5 : 0.5}
              strokeOpacity={hovered === i ? 0.8 : 0.3}
              style={{ transition: 'all .3s ease' }}
            />

            {/* NEAR Priority halo */}
            {node.cat.is_strategic && (
              <circle
                cx={node.x} cy={node.y}
                r={node.size + 7}
                fill="none"
                stroke="#00EC97"
                strokeWidth={1}
                strokeOpacity={0.3}
                strokeDasharray="2 2"
              >
                <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
              </circle>
            )}

            {/* 2-letter abbreviation inside node */}
            <text
              x={node.x} y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fillOpacity={hovered === null ? 0.7 : hovered === i ? 1 : 0.15}
              fontSize={Math.max(6, node.size * 0.5)}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={600}
              style={{ transition: 'fill-opacity .3s', pointerEvents: 'none' }}
            >
              {node.cat.name.slice(0, 2).toUpperCase()}
            </text>
          </g>
        ))}

        {/* Center labels */}
        <text
          x={CX} y={CY - 6}
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize={6}
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing={1.5}
        >
          TOTAL TVL
        </text>
      </svg>

      {/* Center TVL counter (HTML overlay, doesn't rotate) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-2">
          <p className="text-sm font-bold text-text-primary font-mono">
            <AnimatedCounter value={totalTVL} formatter={formatCurrency} />
          </p>
        </div>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered !== null && nodes[hovered] && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-2 left-2 backdrop-blur-md bg-surface/90 border border-white/10 rounded-lg p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-none z-10"
          >
            <p className="font-medium text-text-primary text-sm">
              {nodes[hovered].cat.name}
            </p>
            <div className="mt-1.5 space-y-0.5">
              <p className="text-xs text-text-muted font-mono">
                TVL:{' '}
                <span className="text-near-green font-bold">
                  {formatCurrency(nodes[hovered].cat.totalTVL)}
                </span>
              </p>
              <p className="text-xs text-text-muted font-mono">
                Projects:{' '}
                <span className="text-text-primary">{nodes[hovered].cat.projectCount}</span>
              </p>
              <p className="text-xs text-text-muted font-mono">
                Void Score:{' '}
                <span className="font-bold" style={{ color: nodes[hovered].color }}>
                  {nodes[hovered].cat.gapScore}
                </span>
              </p>
              {nodes[hovered].cat.is_strategic && (
                <span className="inline-block text-[9px] font-mono font-semibold uppercase tracking-wider text-near-green/80 bg-near-green/10 px-1.5 py-0.5 rounded-full border border-near-green/20 mt-1">
                  NEAR Priority
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
