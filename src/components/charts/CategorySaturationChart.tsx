'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartLegend } from './ChartLegend';
import type { CategoryWithStats } from '@/types';

interface CategorySaturationChartProps {
  categories: CategoryWithStats[];
}

/* ── Constants (scaled for 800×500 viewBox) ── */
const CX = 400;
const CY = 250;
const MIN_R = 30;
const MAX_R = 175;
const LABEL_R = MAX_R + 28;

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
      <div className="flex items-center justify-center h-[500px] text-text-muted text-sm font-mono">
        No category data available
      </div>
    );
  }

  const n = sorted.length;
  const step = (2 * Math.PI) / n;
  const pad = 0.015;

  const rings = [0.33, 0.66, 1].map((f) => MIN_R + (MAX_R - MIN_R) * f);
  const ringLabels = ['Low', 'Medium', 'High'];

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
    <div>
      <div className="relative" style={{ height: 500 }}>
        <svg viewBox="0 0 800 500" className="w-full h-full">
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
          <circle cx={CX} cy={CY} r={MAX_R + 40} fill="url(#vr-bg)" />

          {/* Concentric guide rings */}
          {rings.map((r, i) => (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          ))}

          {/* Score + descriptive labels along rings */}
          {[33, 66, 100].map((v, i) => (
            <g key={v}>
              <text
                x={CX + 6}
                y={CY - rings[i] + 4}
                fill="rgba(255,255,255,0.30)"
                fontSize={9}
                fontFamily="'JetBrains Mono', monospace"
              >
                {v}
              </text>
              <text
                x={CX + 28}
                y={CY - rings[i] + 4}
                fill="rgba(255,255,255,0.18)"
                fontSize={8}
                fontFamily="'JetBrains Mono', monospace"
              >
                {ringLabels[i]}
              </text>
            </g>
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
                stroke="rgba(255,255,255,0.06)"
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
              fillOpacity={hovered === null ? 0.35 : hovered === i ? 0.6 : 0.12}
              stroke={w.color}
              strokeWidth={hovered === i ? 2.5 : 1}
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

          {/* NEAR Priority arcs */}
          {wedges.map((w, i) => {
            if (!w.cat.is_strategic) return null;
            const r2 = w.r + 6;
            return (
              <path
                key={`st-${i}`}
                d={outerArc(r2, w.a1, w.a2)}
                fill="none"
                stroke="#00EC97"
                strokeWidth={2.5}
                strokeOpacity={0.4}
                filter="url(#vr-glow)"
              />
            );
          })}

          {/* Category labels — full names, larger font */}
          {wedges.map((w, i) => {
            const sinM = Math.sin(w.mid);
            const anchor = sinM > 0.15 ? 'start' : sinM < -0.15 ? 'end' : 'middle';
            return (
              <text
                key={`lb-${i}`}
                x={w.labelPt.x}
                y={w.labelPt.y}
                textAnchor={anchor}
                dominantBaseline="central"
                fill={hovered === i ? '#ffffff' : 'rgba(255,255,255,0.45)'}
                fontSize={12}
                fontFamily="'JetBrains Mono', monospace"
                style={{ transition: 'fill .3s', pointerEvents: 'none' }}
              >
                {w.cat.name}
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
            <path d={sweepTrail} fill="#00EC97" fillOpacity={0.05} />
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

          {/* Center pulse */}
          <circle cx={CX} cy={CY} r={4} fill="#00EC97" />
          <circle cx={CX} cy={CY} r={4} fill="#00EC97" opacity={0.5}>
            <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* SCANNING label */}
          <text
            x={CX}
            y={CY + 20}
            textAnchor="middle"
            fill="rgba(0,236,151,0.35)"
            fontSize={9}
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
              className="absolute top-3 right-3 backdrop-blur-md bg-surface/90 border border-white/10 rounded-lg p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-none z-10"
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

      {/* Legend */}
      <ChartLegend
        items={[
          { type: 'gradient', label: '0 \u2014 Void Score \u2014 100', gradient: 'linear-gradient(90deg, #FF4757, #FFA502, #00EC97)' },
          { type: 'ring', label: 'NEAR Priority', color: '#00EC97' },
          { type: 'text', label: 'Further from center = higher opportunity' },
        ]}
      />
    </div>
  );
}
