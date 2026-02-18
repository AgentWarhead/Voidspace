/* ─── XPRibbon — Always-visible XP progress bar ───────────────
 * A compact persistent ribbon showing level, title, and XP bar.
 * Pure display — pass totalXP and it does the rest.
 * ────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import { getLevel, LEVEL_TITLES } from '@/lib/xp';

interface XPRibbonProps {
  totalXP: number;
  /** Show the next-level title text */
  showNext?: boolean;
  /** Extra Tailwind classes */
  className?: string;
}

export function XPRibbon({ totalXP, showNext = true, className = '' }: XPRibbonProps) {
  const { level, currentXP, nextLevelXP, progress, title } = getLevel(totalXP);
  const nextTitle = LEVEL_TITLES[level] ?? 'Mythic';

  // Animate bar width (smooth transition on XP gain)
  const [displayProgress, setDisplayProgress] = useState(progress);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Smooth animate from current display to target
    const target = progress;
    const start = displayProgress;
    const diff = target - start;
    if (Math.abs(diff) < 0.1) return;

    let startTime: number | null = null;
    const duration = 600; // ms

    function step(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayProgress(start + diff * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayProgress(target);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps

  const pct = Math.min(Math.max(displayProgress, 0), 100);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-md border border-white/[0.07] px-3 py-2.5 ${className}`}
    >
      {/* Nebula shimmer overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(0,236,151,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(123,97,255,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Label */}
      <div className="relative mb-1.5">
        <span className="text-[9px] text-white/25 uppercase tracking-[0.15em] font-medium">🏆 Achievement Level</span>
      </div>

      <div className="relative flex items-center gap-3">
        {/* Level badge */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-void-black shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #00EC97 0%, #7B61FF 100%)',
            boxShadow: '0 0 14px rgba(0,236,151,0.4)',
          }}
        >
          {level}
        </div>

        {/* Progress section */}
        <div className="flex-1 min-w-0">
          {/* Top row: title + XP numbers */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-semibold text-white/90 tracking-wide">{title}</span>
            <span className="text-[10px] font-mono text-white/40">
              {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #7B61FF 0%, #00EC97 100%)',
                boxShadow: '0 0 8px rgba(0,236,151,0.5)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {/* Shimmer highlight */}
              <div
                className="absolute inset-0 animate-shimmer"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          </div>

          {/* Next level hint */}
          {showNext && level < LEVEL_TITLES.length && (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[9px] text-white/25 tracking-wider uppercase">
                Lv {level} → {level + 1}
              </span>
              <span className="text-[9px] text-white/30">{nextTitle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
