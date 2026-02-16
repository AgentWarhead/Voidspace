'use client';

import { useState, useEffect } from 'react';

export interface LearnedConcept {
  title: string;
  category: string;
  difficulty: string;
}

interface KnowledgeTrackerProps {
  concepts: LearnedConcept[];
}

const CATEGORIES: Record<string, { label: string; color: string }> = {
  'rust-basics': { label: 'Rust Basics', color: 'bg-orange-500' },
  'near-sdk': { label: 'NEAR SDK', color: 'bg-green-500' },
  'security': { label: 'Security', color: 'bg-red-500' },
  'gas': { label: 'Gas & Performance', color: 'bg-amber-500' },
  'cross-chain': { label: 'Cross-Chain', color: 'bg-purple-500' },
};

const STORAGE_KEY = 'sanctum-knowledge-tracker';

export function KnowledgeTracker({ concepts }: KnowledgeTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [persistedConcepts, setPersistedConcepts] = useState<LearnedConcept[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPersistedConcepts(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Merge and persist new concepts
  useEffect(() => {
    if (concepts.length === 0) return;

    setPersistedConcepts((prev) => {
      const existingTitles = new Set(prev.map((c) => c.title));
      const newOnes = concepts.filter((c) => !existingTitles.has(c.title));
      if (newOnes.length === 0) return prev;

      const merged = [...prev, ...newOnes];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // storage full
      }
      return merged;
    });
  }, [concepts]);

  const allConcepts = persistedConcepts;

  // Group by category
  const grouped: Record<string, LearnedConcept[]> = {};
  for (const concept of allConcepts) {
    const cat = concept.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(concept);
  }

  const totalCount = allConcepts.length;

  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🧠</span>
          <span className="text-sm font-medium text-text-primary">
            {totalCount} concept{totalCount !== 1 ? 's' : ''} learned
          </span>
        </div>
        <span className="text-xs text-text-muted">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {Object.entries(grouped).map(([catKey, items]) => {
            const catInfo = CATEGORIES[catKey] || { label: catKey, color: 'bg-gray-500' };
            // Arbitrary max of 10 per category for the progress bar
            const progress = Math.min((items.length / 10) * 100, 100);

            return (
              <div key={catKey}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-text-secondary">{catInfo.label}</span>
                  <span className="text-xs text-text-muted">{items.length}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-void-black/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${catInfo.color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* Concept pills */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {items.map((item, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] border border-white/[0.08] text-text-muted"
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {totalCount === 0 && (
            <p className="text-xs text-text-muted text-center py-2">
              Start chatting to learn concepts!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
