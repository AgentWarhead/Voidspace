'use client';

import { useState } from 'react';

export interface CodeAnnotation {
  line: number;
  concept: string;
  explanation: string;
}

interface CodeAnnotationsProps {
  annotations: CodeAnnotation[];
  code: string;
}

function getMarker(concept: string): string {
  const lower = concept.toLowerCase();
  if (lower.includes('security') || lower.includes('vulnerability') || lower.includes('audit')) return '🔴';
  if (lower.includes('near') || lower.includes('sdk') || lower.includes('nep')) return '🔵';
  if (lower.includes('performance') || lower.includes('gas') || lower.includes('optim')) return '⚡';
  return '🟢'; // Rust concept default
}

function getMarkerColor(concept: string): string {
  const lower = concept.toLowerCase();
  if (lower.includes('security') || lower.includes('vulnerability') || lower.includes('audit')) return 'border-red-500/30 bg-red-500/10 hover:bg-red-500/20';
  if (lower.includes('near') || lower.includes('sdk') || lower.includes('nep')) return 'border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20';
  if (lower.includes('performance') || lower.includes('gas') || lower.includes('optim')) return 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20';
  return 'border-green-500/30 bg-green-500/10 hover:bg-green-500/20';
}

export function CodeAnnotations({ annotations, code }: CodeAnnotationsProps) {
  const [expandedLine, setExpandedLine] = useState<number | null>(null);

  if (!annotations || annotations.length === 0) return null;

  const lines = code.split('\n');

  return (
    <div className="mt-3 space-y-1.5">
      <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
        <span className="font-medium text-text-secondary">📝 Code Annotations</span>
        <span className="text-text-muted">({annotations.length})</span>
        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1">🟢 Rust</span>
          <span className="flex items-center gap-1">🔵 NEAR</span>
          <span className="flex items-center gap-1">🔴 Security</span>
          <span className="flex items-center gap-1">⚡ Perf</span>
        </div>
      </div>

      {annotations.map((annotation, idx) => {
        const marker = getMarker(annotation.concept);
        const colorClass = getMarkerColor(annotation.concept);
        const isExpanded = expandedLine === idx;
        const codeLine = lines[annotation.line - 1]?.trim() || '';

        return (
          <button
            key={idx}
            onClick={() => setExpandedLine(isExpanded ? null : idx)}
            className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${colorClass}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{marker}</span>
              <span className="text-xs text-text-muted font-mono">L{annotation.line}</span>
              <span className="text-sm font-medium text-text-primary">{annotation.concept}</span>
              <span className="ml-auto text-xs text-text-muted">{isExpanded ? '▼' : '▶'}</span>
            </div>

            {codeLine && !isExpanded && (
              <div className="mt-1 text-xs font-mono text-text-muted truncate pl-7">
                {codeLine}
              </div>
            )}

            {isExpanded && (
              <div className="mt-2 pl-7 space-y-2">
                {codeLine && (
                  <div className="text-xs font-mono text-near-green/80 bg-void-black/30 rounded px-2 py-1 overflow-x-auto">
                    {codeLine}
                  </div>
                )}
                <p className="text-sm text-text-secondary leading-relaxed">
                  {annotation.explanation}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
