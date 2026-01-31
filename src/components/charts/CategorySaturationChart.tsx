'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CategoryWithStats } from '@/types';

interface CategorySaturationChartProps {
  categories: CategoryWithStats[];
}

/* ── Constants ── */
const CX = 200;
const CY = 200;
const MIN_R = 25;
const MAX_R = 120;
const LABEL_R = MAX_R + 18;

/* ── Helpers ── */
function voidColor(score: number): string {
  if (score >= 67) return '#00EC97';
  if (score >= 34) return '#FFA502';
  return '#FF4757';
}

function xy(r: number, angle: number) {
  return {
    x: CX + r * Math.sin(angle),
    y: CY - r * Math.cos(angle),
  };
}

function wedgePath(r: number, a1: number, a2: number): string {
  const p1 = xy(r, a1);
  const p2 = xy(r, a2);
  const lg = a2 - a1 > Math.PI ? 1 : 0;
  return `M${CX},${CY}L${p1.x.toFixed(2)},${p1.y.toFixed(2)}A${r},${r},0,${lg},1,${p2.x.toFixed(2)},${p2.y.toFixed(2)}Z`;
}

function outerArc(r: number, a1: number, a2: number): string {
  const p1 = xy(r, a1);
  const p2 = xy(r, a2);
  const lg = a2 - a1 > Math.PI ? 1 : 0;
  return `M${p1.x.toFixed(2)},${p1.y.toFixed(2)}A${r},${r},0,${lg},1,${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
}

/* ── Component ── */
export function CategorySaturationChart({ categories }: CategorySaturationChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => b.gapScore - a.gapScore),
    [categories]
  );

  if (!sorted.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-text-muted text-sm font-mono">
        No category data available
      </div>
    );
  }

  const n = sorted.length;
  const step = (2 * Math.PI) / n;
  const pad = 0.015;

  // Guide rings at 33 / 66 / 100 of score range
  const rings = [0.33, 0.66, 1].map((f) => MIN_R + (MAX_R - MIN_R) * f);

  const wedges = sorted.map((cat, i) => {
    const a1 = i * step + pad;
    const a2 = (i + 1) * step - pad;
    const r = MIN_R + (cat.gapScore / 100) * (MAX_R - MIN_R);
    const color = voidColor(cat.gapScore);
    const mid = (a1 + a2) / 2;
    const labelPt = xy(LABEL_R, mid);
    return { cat, a1, a2, r, color, mid, labelPt, d: wedgePath(r, a1, a2) };
  });

  const sweepTrail = wedgePath(MAX_R, -0.45, 0);

  return (
    <div className="relative" style={{ height: 300 }}>
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <filter id="vr-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="vr-sweep" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="vr-bg">
            <stop offset="0%" stopColor="#00EC97" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <circle cx={CX} cy={CY} r={MAX_R + 30} fill="url(#vr-bg)" />

        {/* Concentric guide rings */}
        {rings.map((r, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={0.5}
            strokeDasharray="3 3"
          />
        ))}

        {/* Score labels along rings */}
        {[33, 66, 100].map((v, i) => (
          <text
            key={v}
            x={CX + 4}
            y={CY - rings[i] + 3}
            fill="rgba(255,255,255,0.12)"
            fontSize={7}
            fontFamily="monospace"
          >
            {v}
          </text>
        ))}

        {/* Radial guide lines */}
        {wedges.map((w, i) => {
          const p = xy(MAX_R, w.a1 - pad);
          return (
            <line
              key={`rg-${i}`}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Category wedges */}
        {wedges.map((w, i) => (
          <path
            key={`w-${i}`}
            d={w.d}
            fill={w.color}
            fillOpacity={hovered === null ? 0.25 : hovered === i ? 0.5 : 0.08}
            stroke={w.color}
            strokeWidth={hovered === i ? 2 : 0.8}
            strokeOpacity={hovered === i ? 1 : 0.5}
            filter={hovered === i ? 'url(#vr-glow)' : undefined}
            style={{
              transition: 'fill-opacity .3s, stroke-width .3s, stroke-opacity .3s',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* NEAR Priority arcs (glowing arc outside strategic wedges) */}
        {wedges.map((w, i) => {
          if (!w.cat.is_strategic) return null;
          const r2 = w.r + 5;
          return (
            <path
              key={`st-${i}`}
              d={outerArc(r2, w.a1, w.a2)}
              fill="none"
              stroke="#00EC97"
              strokeWidth={2}
              strokeOpacity={0.4}
              filter="url(#vr-glow)"
            />
          );
        })}

        {/* Category labels around perimeter */}
        {wedges.map((w, i) => {
          const sinM = Math.sin(w.mid);
          const anchor = sinM > 0.15 ? 'start' : sinM < -0.15 ? 'end' : 'middle';
          const name =
            w.cat.name.length > 12 ? w.cat.name.slice(0, 11) + '\u2026' : w.cat.name;
          return (
            <text
              key={`lb-${i}`}
              x={w.labelPt.x}
              y={w.labelPt.y}
              textAnchor={anchor}
              dominantBaseline="central"
              fill={hovered === i ? '#ffffff' : 'rgba(255,255,255,0.25)'}
              fontSize={8}
              fontFamily="'JetBrains Mono', monospace"
              style={{ transition: 'fill .3s', pointerEvents: 'none' }}
            >
              {name}
            </text>
          );
        })}

        {/* Rotating sweep line */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${CX} ${CY}`}
            to={`360 ${CX} ${CY}`}
            dur="8s"
            repeatCount="indefinite"
          />
          {/* Fading trail behind the sweep */}
          <path d={sweepTrail} fill="#00EC97" fillOpacity={0.05} />
          {/* The sweep line itself */}
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - MAX_R}
            stroke="#00EC97"
            strokeWidth={1.5}
            strokeOpacity={0.6}
            filter="url(#vr-sweep)"
          />
        </g>

        {/* Center pulse dot */}
        <circle cx={CX} cy={CY} r={3} fill="#00EC97" />
        <circle cx={CX} cy={CY} r={3} fill="#00EC97" opacity={0.5}>
          <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* "SCANNING" label */}
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          fill="rgba(0,236,151,0.35)"
          fontSize={7}
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing={2}
        >
          SCANNING
        </text>
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered !== null && wedges[hovered] && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-2 right-2 backdrop-blur-md bg-surface/90 border border-white/10 rounded-lg p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-none z-10"
          >
            <p className="font-medium text-text-primary text-sm">
              {wedges[hovered].cat.name}
            </p>
            <div className="mt-1.5 space-y-0.5">
              <p className="text-xs text-text-muted font-mono">
                Void Score:{' '}
                <span className="font-bold" style={{ color: wedges[hovered].color }}>
                  {wedges[hovered].cat.gapScore}
                </span>
              </p>
              <p className="text-xs text-text-muted font-mono">
                Projects:{' '}
                <span className="text-text-primary">{wedges[hovered].cat.projectCount}</span>
              </p>
              {wedges[hovered].cat.is_strategic && (
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
