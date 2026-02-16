'use client';

import { useState } from 'react';

export interface FeatureSuggestionData {
  title: string;
  description: string;
  codeSnippet?: string;
  why: string;
}

interface FeatureSuggestionProps {
  suggestion: FeatureSuggestionData;
  onAddFeature: (text: string) => void;
}

export function FeatureSuggestion({ suggestion, onAddFeature }: FeatureSuggestionProps) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">💡</span>
        <span className="text-sm font-medium text-amber-400">Did you know?</span>
      </div>

      {/* Title + Description */}
      <h4 className="text-sm font-semibold text-text-primary mb-1">{suggestion.title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed">{suggestion.description}</p>

      {/* Code snippet preview */}
      {suggestion.codeSnippet && (
        <div className="mt-3 rounded-lg bg-void-black/40 border border-white/[0.05] p-3 overflow-x-auto">
          <pre className="text-xs font-mono text-near-green/80 whitespace-pre">
            {suggestion.codeSnippet}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={() => onAddFeature(`Add this feature: ${suggestion.title} — ${suggestion.description}`)}
          className="px-3 py-2 min-h-[44px] text-sm font-medium rounded-lg bg-near-green/20 text-near-green border border-near-green/30 hover:bg-near-green/30 transition-all"
        >
          Add this feature →
        </button>

        <button
          onClick={() => setShowWhy(!showWhy)}
          className="px-3 py-2 min-h-[44px] text-sm rounded-lg text-text-muted hover:text-text-secondary hover:bg-white/[0.05] transition-all"
        >
          {showWhy ? 'Hide' : 'Why?'}
        </button>
      </div>

      {/* Why section */}
      {showWhy && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-text-secondary leading-relaxed">
          {suggestion.why}
        </div>
      )}
    </div>
  );
}
