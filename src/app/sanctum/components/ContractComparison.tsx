'use client';

import { useState, useMemo } from 'react';
import { GitCompare, Plus, Minus, Equal, Copy, Check } from 'lucide-react';
import { ContractDNAInline } from './ContractDNA';

interface ContractComparisonProps {
  currentCode: string;
  onClose: () => void;
  /** Optional: Solidity source for cross-chain comparison mode */
  solidityCode?: string;
  /** Optional: NEAR/Rust output for cross-chain comparison mode */
  nearCode?: string;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  lineNumber: { old?: number; new?: number };
  content: string;
}

// Key concept annotations shown in Solidity vs NEAR mode
const CONCEPT_ANNOTATIONS = [
  {
    id: 'storage',
    solidityKeyword: 'mapping',
    nearKeyword: 'LookupMap',
    label: 'Storage',
    description: 'Solidity mapping → NEAR LookupMap',
    color: 'amber',
  },
  {
    id: 'caller',
    solidityKeyword: 'msg.sender',
    nearKeyword: 'predecessor_account_id',
    label: 'Caller',
    description: 'msg.sender → env::predecessor_account_id()',
    color: 'cyan',
  },
  {
    id: 'payable',
    solidityKeyword: 'payable',
    nearKeyword: '#[payable]',
    label: 'Payable',
    description: 'payable modifier → #[payable] attribute',
    color: 'green',
  },
  {
    id: 'require',
    solidityKeyword: 'require(',
    nearKeyword: 'assert!(',
    label: 'Assertions',
    description: 'require() → assert!()',
    color: 'purple',
  },
  {
    id: 'events',
    solidityKeyword: 'emit ',
    nearKeyword: 'log_str',
    label: 'Events',
    description: 'emit Event() → env::log_str()',
    color: 'pink',
  },
  {
    id: 'address',
    solidityKeyword: 'address',
    nearKeyword: 'AccountId',
    label: 'Address Type',
    description: 'address → AccountId',
    color: 'blue',
  },
];

const COLOR_MAP: Record<string, { badge: string; text: string; bg: string }> = {
  amber: { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  cyan: { badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  green: { badge: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'text-green-400', bg: 'bg-green-500/10' },
  purple: { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-500/10' },
  pink: { badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30', text: 'text-pink-400', bg: 'bg-pink-500/10' },
  blue: { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/10' },
};

/** Highlight known Solidity/NEAR keywords in a line */
function highlightLine(line: string, keywords: string[], colorClass: string): React.ReactNode {
  if (!keywords.length) return <span>{line}</span>;
  
  // Simple regex-based highlighter for known keywords
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;
  
  while (remaining.length > 0) {
    let earliest = -1;
    let earliestKw = '';
    
    for (const kw of keywords) {
      const idx = remaining.indexOf(kw);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestKw = kw;
      }
    }
    
    if (earliest === -1) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
    
    if (earliest > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, earliest)}</span>);
    }
    parts.push(
      <span key={key++} className={`${colorClass} font-semibold`}>
        {earliestKw}
      </span>
    );
    remaining = remaining.slice(earliest + earliestKw.length);
  }
  
  return <>{parts}</>;
}

function CodePanel({
  title,
  code,
  language,
  readOnly = true,
  onChange,
  highlightKeywords,
  keywordColor,
}: {
  title: string;
  code: string;
  language: string;
  readOnly?: boolean;
  onChange?: (v: string) => void;
  highlightKeywords?: string[];
  keywordColor?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-void-black/40 rounded-xl border border-void-purple/20 overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-void-purple/20 bg-void-black/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{title}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-void-purple/20 text-purple-400 font-mono">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all min-h-[32px]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-near-green" />
              <span className="text-near-green">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      {readOnly ? (
        <div className="flex-1 overflow-auto">
          <div className="font-mono text-sm">
            {lines.map((line, i) => (
              <div key={i} className="flex hover:bg-white/[0.02] group">
                <div className="w-10 flex-shrink-0 px-2 py-0.5 text-right text-gray-600 select-none border-r border-void-purple/10 text-xs leading-5">
                  {i + 1}
                </div>
                <pre className="flex-1 px-4 py-0.5 text-gray-300 overflow-x-auto leading-5 whitespace-pre">
                  {highlightKeywords && keywordColor
                    ? highlightLine(line, highlightKeywords, keywordColor)
                    : line || ' '}
                </pre>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <textarea
          value={code}
          onChange={e => onChange?.(e.target.value)}
          className="flex-1 bg-transparent px-4 py-3 text-gray-300 font-mono text-sm resize-none focus:outline-none"
          spellCheck={false}
        />
      )}
    </div>
  );
}

export function ContractComparison({ currentCode, onClose, solidityCode, nearCode }: ContractComparisonProps) {
  const [compareCode, setCompareCode] = useState('');
  const [showPaste, setShowPaste] = useState(true);

  // Detect if we're in Solidity vs NEAR mode
  const isSolidityMode = !!(solidityCode !== undefined || nearCode !== undefined);
  const soliditySource = solidityCode || '';
  const nearSource = nearCode || currentCode;

  // Detect which annotation concepts appear in each code
  const activeAnnotations = useMemo(() => {
    if (!isSolidityMode) return [];
    return CONCEPT_ANNOTATIONS.filter(a =>
      soliditySource.includes(a.solidityKeyword) || nearSource.includes(a.nearKeyword)
    );
  }, [isSolidityMode, soliditySource, nearSource]);

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

  // ── Solidity vs NEAR side-by-side mode ──
  if (isSolidityMode) {
    const solidityKeywords = CONCEPT_ANNOTATIONS.map(a => a.solidityKeyword);
    const nearKeywords = CONCEPT_ANNOTATIONS.map(a => a.nearKeyword);

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl shadow-void-purple/20">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-void-purple/20 flex items-center justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🔄</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white">Solidity → NEAR Conversion</h3>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                  Side-by-side comparison of key differences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Annotation badges */}
          {activeAnnotations.length > 0 && (
            <div className="px-4 sm:px-6 py-3 border-b border-void-purple/20 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                {activeAnnotations.map((ann) => {
                  const colors = COLOR_MAP[ann.color];
                  return (
                    <div
                      key={ann.id}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${colors.badge}`}
                      title={ann.description}
                    >
                      <span className="font-mono">{ann.solidityKeyword}</span>
                      <span className="opacity-60">→</span>
                      <span className="font-mono">{ann.nearKeyword}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Side-by-side panels */}
          <div className="flex-1 overflow-hidden flex flex-col sm:flex-row gap-0 sm:gap-0">
            {/* Left: Solidity */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col border-b sm:border-b-0 sm:border-r border-void-purple/20">
              <CodePanel
                title="Original (Solidity)"
                code={soliditySource || '// No Solidity code provided'}
                language="Solidity"
                readOnly={true}
                highlightKeywords={solidityKeywords}
                keywordColor="text-amber-300"
              />
            </div>

            {/* Right: NEAR/Rust */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <CodePanel
                title="Converted (NEAR / Rust)"
                code={nearSource || '// Converted NEAR code will appear here'}
                language="Rust"
                readOnly={false}
                highlightKeywords={nearKeywords}
                keywordColor="text-near-green"
              />
            </div>
          </div>

          {/* Footer: concept guide */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-void-purple/20 bg-void-black/20">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {CONCEPT_ANNOTATIONS.map((ann) => {
                const colors = COLOR_MAP[ann.color];
                return (
                  <div key={ann.id} className="flex items-center gap-1.5 text-xs">
                    <code className="text-gray-500">{ann.solidityKeyword}</code>
                    <span className="text-gray-600">→</span>
                    <code className={colors.text}>{ann.nearKeyword}</code>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Default: NEAR version diff mode ──
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl shadow-void-purple/20">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-void-purple/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white">Contract Comparison</h3>
              <p className="text-sm text-gray-400 hidden sm:block">Compare your current contract with another version</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {showPaste ? (
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
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
                  className="min-h-[44px] px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  Compare
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Stats bar */}
              {stats && (
                <div className="px-4 sm:px-6 py-3 bg-void-black/30 border-b border-void-purple/20 flex flex-wrap items-center gap-3 sm:gap-6">
                  <div className="hidden sm:flex items-center gap-4">
                    <ContractDNAInline code={compareCode} />
                    <span className="text-gray-500">→</span>
                    <ContractDNAInline code={currentCode} />
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-sm">
                    <span className="flex items-center gap-1 text-green-400">
                      <Plus className="w-4 h-4" /> {stats.added}
                    </span>
                    <span className="flex items-center gap-1 text-red-400">
                      <Minus className="w-4 h-4" /> {stats.removed}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Equal className="w-4 h-4" /> {stats.unchanged}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPaste(true)}
                    className="ml-auto min-h-[44px] px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
  
  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);
  
  let oldIdx = 0;
  let newIdx = 0;
  
  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const oldLine = oldLines[oldIdx];
    const newLine = newLines[newIdx];
    
    if (oldIdx >= oldLines.length) {
      result.push({
        type: 'added',
        lineNumber: { new: newIdx + 1 },
        content: newLine,
      });
      newIdx++;
    } else if (newIdx >= newLines.length) {
      result.push({
        type: 'removed',
        lineNumber: { old: oldIdx + 1 },
        content: oldLine,
      });
      oldIdx++;
    } else if (oldLine === newLine) {
      result.push({
        type: 'unchanged',
        lineNumber: { old: oldIdx + 1, new: newIdx + 1 },
        content: oldLine,
      });
      oldIdx++;
      newIdx++;
    } else if (!newSet.has(oldLine)) {
      result.push({
        type: 'removed',
        lineNumber: { old: oldIdx + 1 },
        content: oldLine,
      });
      oldIdx++;
    } else if (!oldSet.has(newLine)) {
      result.push({
        type: 'added',
        lineNumber: { new: newIdx + 1 },
        content: newLine,
      });
      newIdx++;
    } else {
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
