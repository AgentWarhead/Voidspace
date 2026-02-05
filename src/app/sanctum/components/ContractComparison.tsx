'use client';

import { useState, useMemo } from 'react';
// @ts-expect-error - lucide-react 0.453.0 type issues
import { GitCompare, Plus, Minus, Equal } from 'lucide-react';
import { ContractDNAInline } from './ContractDNA';

interface ContractComparisonProps {
  currentCode: string;
  onClose: () => void;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  lineNumber: { old?: number; new?: number };
  content: string;
}

export function ContractComparison({ currentCode, onClose }: ContractComparisonProps) {
  const [compareCode, setCompareCode] = useState('');
  const [showPaste, setShowPaste] = useState(true);

  const diff = useMemo(() => {
    if (!compareCode || !currentCode) return null;
    return computeDiff(compareCode, currentCode);
  }, [compareCode, currentCode]);

  const stats = useMemo(() => {
    if (!diff) return null;
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const unchanged = diff.filter(d => d.type === 'unchanged').length;
    return { added, removed, unchanged, total: diff.length };
  }, [diff]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl shadow-void-purple/20">
        {/* Header */}
        <div className="px-6 py-4 border-b border-void-purple/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Contract Comparison</h3>
              <p className="text-sm text-gray-400">Compare your current contract with another version</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {showPaste ? (
            /* Paste area */
            <div className="p-6 flex-1 flex flex-col">
              <label className="text-sm text-gray-400 mb-2">Paste contract code to compare:</label>
              <textarea
                value={compareCode}
                onChange={(e) => setCompareCode(e.target.value)}
                placeholder="// Paste your Rust contract code here..."
                className="flex-1 bg-void-black/50 border border-void-purple/20 rounded-xl p-4 text-sm font-mono text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-void-purple/50"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Current: {currentCode.split('\n').length} lines</span>
                  {compareCode && <span>Compare: {compareCode.split('\n').length} lines</span>}
                </div>
                <button
                  onClick={() => compareCode && setShowPaste(false)}
                  disabled={!compareCode}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  Compare
                </button>
              </div>
            </div>
          ) : (
            /* Diff view */
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Stats bar */}
              {stats && (
                <div className="px-6 py-3 bg-void-black/30 border-b border-void-purple/20 flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <ContractDNAInline code={compareCode} />
                    <span className="text-gray-500">→</span>
                    <ContractDNAInline code={currentCode} />
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-green-400">
                      <Plus className="w-4 h-4" /> {stats.added} added
                    </span>
                    <span className="flex items-center gap-1 text-red-400">
                      <Minus className="w-4 h-4" /> {stats.removed} removed
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Equal className="w-4 h-4" /> {stats.unchanged} unchanged
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPaste(true)}
                    className="ml-auto px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Change source
                  </button>
                </div>
              )}

              {/* Diff content */}
              <div className="flex-1 overflow-auto">
                <div className="font-mono text-sm">
                  {diff?.map((line, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        line.type === 'added'
                          ? 'bg-green-500/10'
                          : line.type === 'removed'
                          ? 'bg-red-500/10'
                          : ''
                      }`}
                    >
                      {/* Line numbers */}
                      <div className="w-12 flex-shrink-0 px-2 py-0.5 text-right text-gray-600 bg-void-black/30 border-r border-void-purple/10 select-none">
                        {line.lineNumber.old || ''}
                      </div>
                      <div className="w-12 flex-shrink-0 px-2 py-0.5 text-right text-gray-600 bg-void-black/30 border-r border-void-purple/10 select-none">
                        {line.lineNumber.new || ''}
                      </div>
                      
                      {/* Change indicator */}
                      <div className={`w-6 flex-shrink-0 flex items-center justify-center ${
                        line.type === 'added'
                          ? 'text-green-400'
                          : line.type === 'removed'
                          ? 'text-red-400'
                          : 'text-gray-600'
                      }`}>
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                      </div>
                      
                      {/* Content */}
                      <pre className={`flex-1 px-4 py-0.5 overflow-x-auto ${
                        line.type === 'added'
                          ? 'text-green-300'
                          : line.type === 'removed'
                          ? 'text-red-300'
                          : 'text-gray-400'
                      }`}>
                        {line.content || ' '}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple diff algorithm
function computeDiff(oldCode: string, newCode: string): DiffLine[] {
  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');
  const result: DiffLine[] = [];
  
  // Simple line-by-line diff (not optimal but works for demo)
  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);
  
  let oldIdx = 0;
  let newIdx = 0;
  
  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const oldLine = oldLines[oldIdx];
    const newLine = newLines[newIdx];
    
    if (oldIdx >= oldLines.length) {
      // Rest is added
      result.push({
        type: 'added',
        lineNumber: { new: newIdx + 1 },
        content: newLine,
      });
      newIdx++;
    } else if (newIdx >= newLines.length) {
      // Rest is removed
      result.push({
        type: 'removed',
        lineNumber: { old: oldIdx + 1 },
        content: oldLine,
      });
      oldIdx++;
    } else if (oldLine === newLine) {
      // Unchanged
      result.push({
        type: 'unchanged',
        lineNumber: { old: oldIdx + 1, new: newIdx + 1 },
        content: oldLine,
      });
      oldIdx++;
      newIdx++;
    } else if (!newSet.has(oldLine)) {
      // Line was removed
      result.push({
        type: 'removed',
        lineNumber: { old: oldIdx + 1 },
        content: oldLine,
      });
      oldIdx++;
    } else if (!oldSet.has(newLine)) {
      // Line was added
      result.push({
        type: 'added',
        lineNumber: { new: newIdx + 1 },
        content: newLine,
      });
      newIdx++;
    } else {
      // Modified - show both
      result.push({
        type: 'removed',
        lineNumber: { old: oldIdx + 1 },
        content: oldLine,
      });
      result.push({
        type: 'added',
        lineNumber: { new: newIdx + 1 },
        content: newLine,
      });
      oldIdx++;
      newIdx++;
    }
  }
  
  return result;
}
