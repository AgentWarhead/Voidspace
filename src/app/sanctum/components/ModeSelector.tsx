'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export type ChatMode = 'learn' | 'void';

interface ModeSelectorProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  disabled?: boolean;
}

const MODES: { key: ChatMode; label: string; emoji: string; tooltip: string }[] = [
  { key: 'learn', label: 'Learn', emoji: '🎓', tooltip: 'Step-by-step guidance. Every concept explained as we build together.' },
  { key: 'void', label: 'Void', emoji: '🌑', tooltip: 'Enter the Void. Production-ready code instantly — zero questions, zero hand-holding.' },
];

export function ModeSelector({ mode, onModeChange, disabled }: ModeSelectorProps) {
  const [hoveredMode, setHoveredMode] = useState<ChatMode | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Position tooltip via portal to escape stacking contexts (backdrop-blur)
  useLayoutEffect(() => {
    if (!hoveredMode || !buttonRefs.current[hoveredMode] || !tooltipRef.current) return;
    const btn = buttonRefs.current[hoveredMode]!;
    const rect = btn.getBoundingClientRect();
    const tt = tooltipRef.current;
    const ttWidth = tt.offsetWidth;

    let left = rect.left + rect.width / 2 - ttWidth / 2;
    // Clamp to viewport
    if (left < 8) left = 8;
    if (left + ttWidth > window.innerWidth - 8) left = window.innerWidth - ttWidth - 8;

    tt.style.top = `${rect.bottom + 8}px`;
    tt.style.left = `${left}px`;
  }, [hoveredMode]);

  const hoveredModeData = hoveredMode ? MODES.find(m => m.key === hoveredMode) : null;

  return (
    <>
      <div className="relative flex items-center gap-1 p-1 rounded-xl bg-void-black/40 backdrop-blur-sm border border-white/[0.08]">
        {MODES.map((m) => (
          <button
            key={m.key}
            ref={(el) => { buttonRefs.current[m.key] = el; }}
            onClick={() => onModeChange(m.key)}
            onMouseEnter={() => setHoveredMode(m.key)}
            onMouseLeave={() => setHoveredMode(null)}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === m.key
                ? 'bg-near-green/20 text-near-green border border-near-green/30 shadow-sm shadow-near-green/10'
                : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.05] border border-transparent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-base">{m.emoji}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Tooltip rendered via portal to escape backdrop-blur stacking context */}
      {hoveredModeData && typeof document !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          className="fixed px-3 py-2 rounded-lg bg-void-gray border border-border-subtle text-xs text-text-secondary whitespace-nowrap z-[9999] shadow-lg pointer-events-none"
          style={{ top: -9999, left: -9999 }}
        >
          {hoveredModeData.tooltip}
        </div>,
        document.body
      )}
    </>
  );
}
