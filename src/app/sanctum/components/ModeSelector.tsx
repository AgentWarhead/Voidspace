'use client';

import { useState } from 'react';

export type ChatMode = 'learn' | 'build' | 'expert';

interface ModeSelectorProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  disabled?: boolean;
}

const MODES: { key: ChatMode; label: string; emoji: string; tooltip: string }[] = [
  { key: 'learn', label: 'Learn', emoji: '🎓', tooltip: 'Step-by-step explanations with quizzes and tips' },
  { key: 'build', label: 'Build', emoji: '⚡', tooltip: 'Focused code generation with brief explanations' },
  { key: 'expert', label: 'Expert', emoji: '🔥', tooltip: 'Advanced mode — minimal hand-holding, max output' },
];

export function ModeSelector({ mode, onModeChange, disabled }: ModeSelectorProps) {
  const [hoveredMode, setHoveredMode] = useState<ChatMode | null>(null);

  return (
    <div className="relative flex items-center gap-1 p-1 rounded-xl bg-void-black/40 backdrop-blur-sm border border-white/[0.08]">
      {MODES.map((m) => (
        <div key={m.key} className="relative">
          <button
            onClick={() => onModeChange(m.key)}
            onMouseEnter={() => setHoveredMode(m.key)}
            onMouseLeave={() => setHoveredMode(null)}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === m.key
                ? 'bg-near-green/20 text-near-green border border-near-green/30 shadow-sm shadow-near-green/10'
                : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.05] border border-transparent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-base">{m.emoji}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </button>

          {/* Tooltip */}
          {hoveredMode === m.key && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg bg-void-gray border border-border-subtle text-xs text-text-secondary whitespace-nowrap z-50 shadow-lg pointer-events-none">
              {m.tooltip}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-void-gray border-l border-t border-border-subtle" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
