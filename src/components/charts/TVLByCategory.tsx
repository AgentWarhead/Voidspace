'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { ChartLegend } from './ChartLegend';
import type { CategoryWithStats } from '@/types';

interface TVLByCategoryProps {
  categories: CategoryWithStats[];
}

/* ── Constants (scaled for 800×520 viewBox) ── */
const CX = 400;
const CY = 260;
const MIN_ORBIT = 80;
const MAX_ORBIT = 210;
const MIN_NODE = 12;
const MAX_NODE = 30;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/* ── Continuous color gradient: red → amber → green ── */
function voidColor(score: number): string {
  const s = Math.max(0, Math.min(100, score));
  if (s <= 50) {
    const t = s / 50;
    const h = t * 35;
    const sat = 85 + t * 15;
    const l = 55 + t * 5;
    return `hsl(${h}, ${sat}%, ${l}%)`;
  }
  const t = (s - 50) / 50;
  const h = 35 + t * 120;
  const sat = 100 - t * 10;
  const l = 60 - t * 10;
  return `hsl(${h}, ${sat}%, ${l}%)`;
}

/* ── Component ── */
export function TVLByCategory({ categories }: TVLByCategoryProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const totalTVL = categories.reduce((s, c) => s + c.totalTVL, 0);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => b.totalTVL - a.totalTVL),
    [categories]
  );

  if (!sorted.length) {
    return (
      <div className="flex items-center justify-center h-[520px] text-text-muted text-sm font-mono">
        No TVL data available
      </div>
    );
  }

  const maxTVL = Math.max(...sorted.map((c) => c.totalTVL), 1);
  const maxProjects = Math.max(...sorted.map((c) => c.projectCount), 1);

  const nodes = sorted.map((cat, i) => {
    const angle = i * GOLDEN_ANGLE - Math.PI / 2;
    const tvlRatio = cat.totalTVL / maxTVL;
    const orbit = MAX_ORBIT - tvlRatio * (MAX_ORBIT - MIN_ORBIT);
    const x = CX + orbit * Math.cos(angle);
    const y = CY + orbit * Math.sin(angle);
    const size = MIN_NODE + (cat.projectCount / maxProjects) * (MAX_NODE - MIN_NODE);
    const color = voidColor(cat.gapScore);

    // External label position — pushed outward from node along the same angle
    const labelDist = orbit + size + 28;
    const labelX = CX + labelDist * Math.cos(angle);
    const labelY = CY + labelDist * Math.sin(angle);
    const textAnchor = Math.cos(angle) < -0.15 ? 'end' as const : Math.cos(angle) > 0.15 ? 'start' as const : 'middle' as const;

    return { cat, x, y, orbit, size, color, angle, labelX, labelY, textAnchor };
  });

  // Unique orbit radii for orbital path rings
  const orbitRings = (() => {
    const seen = new Set<number>();
    return nodes
      .map((n) => Math.round(n.orbit / 15) * 15)
      .filter((r) => {
        if (seen.has(r)) return false;
        seen.add(r);
        return true;
      })
      .sort((a, b) => a - b);
  })();

  return (
    <div>
      <div className="relative" style={{ height: 520 }}>
        <svg viewBox="0 0 800 520" className="w-full h-full">
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
          <circle cx={CX} cy={CY} r={MAX_ORBIT + 40} fill="url(#gw-bg)" />

          {/* Orbital path rings */}
          {orbitRings.map((r) => (
            <circle key={r} cx={CX} cy={CY} r={r} fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} strokeDasharray="3 6"
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
              strokeOpacity={0.4}
              strokeDasharray="4 4"
            />
          )}

          {/* Center sphere */}
          <circle cx={CX} cy={CY} r={42} fill="url(#gw-sphere)" />

          {/* Pulsing ring around the core */}
          <circle cx={CX} cy={CY} r={48} fill="none"
            stroke="#00EC97" strokeWidth={1} strokeOpacity={0.15}
            filter="url(#gw-core)"
          >
            <animate attributeName="r" values="48;54;48" dur="4s" repeatCount="indefinite" />
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
                cx={node.x} cy={node.y} r={node.size + 4}
                fill={node.color}
                fillOpacity={hovered === i ? 0.15 : 0.05}
                filter="url(#gw-glow)"
                style={{ transition: 'fill-opacity .3s' }}
              />

              {/* Node body */}
              <circle
                cx={node.x} cy={node.y}
                r={hovered === i ? node.size * 1.2 : node.size}
                fill={node.color}
                fillOpacity={hovered === null ? 0.55 : hovered === i ? 0.85 : 0.15}
                stroke={node.color}
                strokeWidth={hovered === i ? 2 : 0.5}
                strokeOpacity={hovered === i ? 0.8 : 0.3}
                style={{ transition: 'all .3s ease' }}
              />

              {/* NEAR Priority halo */}
              {node.cat.is_strategic && (
                <circle
                  cx={node.x} cy={node.y}
                  r={node.size + 8}
                  fill="none"
                  stroke="#00EC97"
                  strokeWidth={1.5}
                  strokeOpacity={0.3}
                  strokeDasharray="3 3"
                >
                  <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}

          {/* External labels with leader lines */}
          {nodes.map((node, i) => {
            // Leader line from node edge to label
            const edgeX = node.x + (node.size + 4) * Math.cos(node.angle);
            const edgeY = node.y + (node.size + 4) * Math.sin(node.angle);
            return (
              <g key={`lbl-${i}`}>
                <line
                  x1={edgeX} y1={edgeY}
                  x2={node.labelX} y2={node.labelY}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={0.5}
                  strokeDasharray="2 3"
                />
                <text
                  x={node.labelX}
                  y={node.labelY}
                  textAnchor={node.textAnchor}
                  dominantBaseline="central"
                  fill={hovered === i ? '#ffffff' : 'rgba(255,255,255,0.45)'}
                  fontSize={11}
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ transition: 'fill .3s', pointerEvents: 'none' }}
                >
                  {node.cat.name}
                </text>
              </g>
            );
          })}

          {/* Center labels */}
          <text
            x={CX} y={CY - 8}
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize={9}
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing={1.5}
          >
            TOTAL TVL
          </text>
        </svg>

        {/* Center TVL counter (HTML overlay) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center mt-3">
            <p className="text-lg font-bold text-text-primary font-mono">
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
              className="absolute top-3 left-3 backdrop-blur-md bg-surface/90 border border-white/10 rounded-lg p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-none z-10"
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

      {/* Legend */}
      <ChartLegend
        items={[
          { type: 'gradient', label: '0 \u2014 Void Score \u2014 100', gradient: 'linear-gradient(90deg, #FF4757, #FFA502, #00EC97)' },
          { type: 'ring', label: 'NEAR Priority', color: '#00EC97' },
          { type: 'text', label: 'Closer to center = more TVL' },
          { type: 'text', label: 'Larger circle = more projects' },
        ]}
      />
    </div>
  );
}
