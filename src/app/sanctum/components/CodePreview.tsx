'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, Copy, Download, Code, Lock, BookOpen, FolderTree } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';
import { CodeAnnotations, type CodeAnnotation } from './CodeAnnotations';
import { FileStructure } from './FileStructure';

interface CodePreviewProps {
  code: string;
  mode?: string;        // 'learn' | 'expert' | etc.
  contractName?: string;
  annotations?: CodeAnnotation[]; // optional pre-computed; will auto-generate if absent
}

// ---------------------------------------------------------------------------
// Auto-generate beginner-friendly annotations from Rust/NEAR code
// ---------------------------------------------------------------------------
function autoAnnotate(code: string): CodeAnnotation[] {
  const annotations: CodeAnnotation[] = [];
  const lines = (code ?? '').split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed === '#[near_bindgen]') {
      annotations.push({
        line: lineNum,
        concept: 'NEAR Contract Macro',
        explanation:
          'This attribute tells NEAR that the struct below is your smart contract. It auto-generates the glue code so NEAR can call your functions from the blockchain.',
      });
    } else if (trimmed.startsWith('#[payable]')) {
      annotations.push({
        line: lineNum,
        concept: 'Payable Function',
        explanation:
          'This function can receive NEAR tokens. Without this, sending NEAR to the function panics. Use it for deposit, mint, or buy functions.',
      });
    } else if (trimmed === '#[init]' || trimmed === '#[init(ignore_state)]') {
      annotations.push({
        line: lineNum,
        concept: 'Contract Initializer',
        explanation:
          'The constructor — runs once after deployment to set up initial contract state. Can only be called once; calling again will fail.',
      });
    } else if (trimmed.startsWith('pub fn ')) {
      const fnName = trimmed.replace('pub fn ', '').split('(')[0].trim();
      annotations.push({
        line: lineNum,
        concept: `Public Method: ${fnName}`,
        explanation: `"pub fn" makes this callable from outside the contract. Anyone (or any other contract) can invoke "${fnName}" on-chain.`,
      });
    } else if (trimmed.startsWith('fn ') && !trimmed.startsWith('pub fn ')) {
      const fnName = trimmed.replace('fn ', '').split('(')[0].trim();
      annotations.push({
        line: lineNum,
        concept: `Private Helper: ${fnName}`,
        explanation: `No "pub" means this function is private — only other functions inside this contract can call "${fnName}". Good for internal logic.`,
      });
    } else if (trimmed.startsWith('pub struct ')) {
      const structName = trimmed.replace('pub struct ', '').split(/[\s{]/)[0].trim();
      annotations.push({
        line: lineNum,
        concept: `Contract State: ${structName}`,
        explanation:
          'This struct defines what your contract stores on-chain. Every field persists between calls — it\'s your contract\'s permanent memory on NEAR.',
      });
    } else if (trimmed.startsWith('impl ')) {
      const implTarget = trimmed.replace('impl ', '').split('{')[0].trim();
      annotations.push({
        line: lineNum,
        concept: `Implementation Block: ${implTarget}`,
        explanation:
          '"impl" groups all the methods (functions) that belong to this type. Think of it as defining the actions your contract can perform.',
      });
    } else if (trimmed.includes('LookupMap') || trimmed.includes('UnorderedMap')) {
      annotations.push({
        line: lineNum,
        concept: 'On-Chain Storage Map',
        explanation:
          'A key-value store living on the blockchain. Like a HashMap, but each read/write costs a tiny amount of gas. Perfect for per-user data (address → balance).',
      });
    } else if (trimmed.includes('LazyOption')) {
      annotations.push({
        line: lineNum,
        concept: 'Lazy Storage Field',
        explanation:
          'LazyOption only loads from storage when you actually access it, saving gas on calls that don\'t need this value.',
      });
    } else if (trimmed.includes('env::predecessor_account_id')) {
      annotations.push({
        line: lineNum,
        concept: 'Caller Identity',
        explanation:
          'Gets the account ID of whoever is calling this function right now. Essential for access control — e.g., checking if the caller is the owner.',
      });
    } else if (trimmed.includes('env::attached_deposit')) {
      annotations.push({
        line: lineNum,
        concept: 'Attached NEAR Tokens',
        explanation:
          'Reads how much NEAR the caller sent with this transaction (in yoctoNEAR). 1 NEAR = 1,000,000,000,000,000,000,000,000 yoctoNEAR.',
      });
    } else if (trimmed.includes('env::signer_account_id')) {
      annotations.push({
        line: lineNum,
        concept: 'Transaction Signer',
        explanation:
          'The account that signed (and paid for) the original transaction. Can differ from predecessor in cross-contract calls.',
      });
    } else if (trimmed.includes('Promise::new') || trimmed.includes('ext_contract')) {
      annotations.push({
        line: lineNum,
        concept: 'Cross-Contract Call',
        explanation:
          'Calls another NEAR contract. Promises are async — they return a receipt that executes after the current call completes.',
      });
    } else if (trimmed.startsWith('#[test]')) {
      annotations.push({
        line: lineNum,
        concept: 'Unit Test',
        explanation:
          'Marks a test function. Run "cargo test" to execute all tests and verify contract logic before deploying to testnet.',
      });
    } else if (trimmed.startsWith('use near_sdk')) {
      annotations.push({
        line: lineNum,
        concept: 'NEAR SDK Import',
        explanation:
          'Imports types and utilities from the NEAR SDK — the official Rust library for writing NEAR smart contracts.',
      });
    }
  });

  // Cap at 14 to avoid overwhelming beginners
  return annotations.slice(0, 14);
}

// ---------------------------------------------------------------------------
// Token-based Rust syntax highlighter (unchanged from original)
// ---------------------------------------------------------------------------
function highlightRust(code: string): string {
  if (!code) return '';

  const keywordSet = new Set([
    'fn', 'pub', 'struct', 'impl', 'let', 'mut', 'const', 'use', 'mod', 'self', 'Self',
    'return', 'if', 'else', 'match', 'for', 'while', 'loop', 'break', 'continue', 'true',
    'false', 'None', 'Some', 'Ok', 'Err', 'where', 'as', 'in', 'ref', 'type', 'enum',
    'trait', 'crate', 'super', 'async', 'await', 'move', 'dyn', 'static', 'extern',
  ]);
  const typeSet = new Set([
    'u8', 'u16', 'u32', 'u64', 'u128', 'i8', 'i16', 'i32', 'i64', 'i128', 'f32', 'f64',
    'bool', 'String', 'str', 'Vec', 'Option', 'Result', 'Balance', 'AccountId', 'Promise',
    'LookupMap', 'UnorderedMap', 'LazyOption', 'Gas', 'NearToken',
  ]);
  const nearSet = new Set([
    'near', 'near_bindgen', 'contract_state', 'payable', 'private', 'init',
    'PanicOnDefault', 'BorshDeserialize', 'BorshSerialize', 'Deserialize', 'Serialize',
    'near_sdk', 'serde',
  ]);

  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return code
    .split('\n')
    .map((line) => {
      const commentIdx = line.indexOf('//');
      const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
      const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';

      const tokens: string[] = [];
      let remaining = codePart;

      while (remaining.length > 0) {
        const strMatch = remaining.match(/^"(?:[^"\\]|\\.)*"/);
        if (strMatch) {
          tokens.push(`<span class="text-emerald-400">${esc(strMatch[0])}</span>`);
          remaining = remaining.slice(strMatch[0].length);
          continue;
        }

        const attrMatch = remaining.match(/^#\[([^\]]*)\]/);
        if (attrMatch) {
          tokens.push(`<span class="text-amber-400">${esc(attrMatch[0])}</span>`);
          remaining = remaining.slice(attrMatch[0].length);
          continue;
        }

        const wordMatch = remaining.match(/^[a-zA-Z_]\w*/);
        if (wordMatch) {
          const word = wordMatch[0];
          if (nearSet.has(word)) {
            tokens.push(`<span class="text-near-green">${esc(word)}</span>`);
          } else if (keywordSet.has(word)) {
            tokens.push(`<span class="text-purple-400">${esc(word)}</span>`);
          } else if (typeSet.has(word)) {
            tokens.push(`<span class="text-cyan-400">${esc(word)}</span>`);
          } else {
            tokens.push(esc(word));
          }
          remaining = remaining.slice(word.length);
          continue;
        }

        const numMatch = remaining.match(/^\d[\d_]*/);
        if (numMatch) {
          tokens.push(`<span class="text-orange-400">${esc(numMatch[0])}</span>`);
          remaining = remaining.slice(numMatch[0].length);
          continue;
        }

        tokens.push(esc(remaining[0]));
        remaining = remaining.slice(1);
      }

      const commentHtml = commentPart
        ? `<span class="text-slate-500">${esc(commentPart)}</span>`
        : '';

      let result = tokens.join('') + commentHtml;
      result = result.replace(
        /(<span class="text-purple-400">fn<\/span>\s+)([a-zA-Z_]\w*)/g,
        '$1<span class="text-blue-400">$2</span>',
      );

      return result;
    })
    .join('\n');
}

// ---------------------------------------------------------------------------
// CodePreview component
// ---------------------------------------------------------------------------
const LS_ANNOTATIONS = 'sanctum-annotations-visible';
const LS_FILE_TREE = 'sanctum-file-tree-visible';

export function CodePreview({ code, mode, contractName, annotations: propAnnotations }: CodePreviewProps) {
  const { user } = useWallet();
  const userTier: SanctumTier = (user?.tier as SanctumTier) || 'shade';
  const canExport = SANCTUM_TIERS[userTier].canExport;

  const isLearnMode = mode === 'learn';

  // --- Annotations toggle (default ON for learn, OFF for expert) ---
  const [annotationsVisible, setAnnotationsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return isLearnMode;
    try {
      const stored = localStorage.getItem(LS_ANNOTATIONS);
      return stored !== null ? stored === 'true' : isLearnMode;
    } catch {
      return isLearnMode;
    }
  });

  // --- File tree toggle ---
  const [fileTreeVisible, setFileTreeVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(LS_FILE_TREE);
      return stored !== null ? stored === 'true' : false;
    } catch {
      return false;
    }
  });

  // --- Active file content (for multi-file switching) ---
  const [activeFileContent, setActiveFileContent] = useState<string>(code ?? '');
  const [activeFileName, setActiveFileName] = useState<string>('src/lib.rs');

  // Sync activeFileContent when code prop changes
  useEffect(() => {
    if (activeFileName === 'src/lib.rs') {
      setActiveFileContent(code);
    }
  }, [code, activeFileName]);

  const [copied, setCopied] = useState(false);

  const toggleAnnotations = useCallback(() => {
    setAnnotationsVisible((v) => {
      const next = !v;
      try { localStorage.setItem(LS_ANNOTATIONS, String(next)); } catch {}
      return next;
    });
  }, []);

  const toggleFileTree = useCallback(() => {
    setFileTreeVisible((v) => {
      const next = !v;
      try { localStorage.setItem(LS_FILE_TREE, String(next)); } catch {}
      return next;
    });
  }, []);

  const handleFileSelect = useCallback((filename: string, content: string) => {
    setActiveFileName(filename);
    setActiveFileContent(content);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canExport) return;
    const blob = new Blob([activeFileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFileName.split('/').pop() || 'contract.rs';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute annotations (prop overrides auto-gen)
  const computedAnnotations: CodeAnnotation[] = propAnnotations ?? autoAnnotate(activeFileContent);

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------
  if (!code) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Code className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium text-text-secondary mb-2">No code yet</h3>
          <p className="text-sm text-text-muted max-w-xs">
            Start chatting with Sanctum to generate your smart contract code
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Full preview
  // ---------------------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 border-b border-border-subtle">
        {/* Left: file-tree + annotations toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleFileTree}
            title={fileTreeVisible ? 'Hide file tree' : 'Show file tree'}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
              fileTreeVisible
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-text-muted hover:text-text-primary bg-void-gray/50 hover:bg-void-gray border border-transparent'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Files</span>
          </button>

          <button
            onClick={toggleAnnotations}
            title={annotationsVisible ? 'Hide annotations' : 'Show plain-English annotations'}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
              annotationsVisible
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-text-muted hover:text-text-primary bg-void-gray/50 hover:bg-void-gray border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Annotate</span>
          </button>
        </div>

        {/* Right: copy + download */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary bg-void-gray/50 hover:bg-void-gray rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-near-green" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={canExport ? handleDownload : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              canExport
                ? 'text-text-secondary hover:text-text-primary bg-void-gray/50 hover:bg-void-gray'
                : 'text-text-muted bg-void-gray/30 cursor-not-allowed'
            }`}
            title={canExport ? 'Download' : 'Upgrade to export code'}
          >
            {canExport ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {canExport ? 'Download' : 'Upgrade'}
          </button>
        </div>
      </div>

      {/* Body: optional file tree sidebar + code */}
      <div className="flex-1 flex overflow-hidden">
        {/* File tree sidebar — hidden on mobile (too cramped), visible sm+ */}
        {fileTreeVisible && (
          <div className="hidden sm:block sm:w-48 md:w-56 flex-shrink-0 border-r border-border-subtle overflow-y-auto bg-void-black/30">
            <FileStructure
              code={code}
              contractName={contractName || 'my-contract'}
              onFileSelect={handleFileSelect}
            />
          </div>
        )}

        {/* Code panel */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <pre className="p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">
              <code
                className="text-text-primary"
                dangerouslySetInnerHTML={{ __html: highlightRust(activeFileContent) }}
              />
            </pre>

            {/* Inline annotations */}
            {annotationsVisible && computedAnnotations.length > 0 && (
              <div className="px-3 pb-4">
                <CodeAnnotations
                  annotations={computedAnnotations}
                  code={activeFileContent}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File info footer */}
      <div className="p-2 border-t border-border-subtle bg-void-gray/30 flex items-center justify-between text-xs text-text-muted">
        <span>📄 {activeFileName}</span>
        <span>
          {(activeFileContent ?? '').split('\n').length} lines
          {annotationsVisible && computedAnnotations.length > 0
            ? ` • ${computedAnnotations.length} annotations`
            : ''}
        </span>
      </div>
    </div>
  );
}
