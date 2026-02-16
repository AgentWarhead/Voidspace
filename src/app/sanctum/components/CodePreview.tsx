'use client';

import { useState } from 'react';
import { Check, Copy, Download, Code, Lock } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const { user } = useWallet();
  const userTier: SanctumTier = (user?.tier as SanctumTier) || 'shade';
  const canExport = SANCTUM_TIERS[userTier].canExport;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canExport) return;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract.rs';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Token-based syntax highlighting for Rust (prevents regex self-corruption)
  const highlightRust = (code: string): string => {
    if (!code) return '';

    const keywordSet = new Set(['fn', 'pub', 'struct', 'impl', 'let', 'mut', 'const', 'use', 'mod', 'self', 'Self', 'return', 'if', 'else', 'match', 'for', 'while', 'loop', 'break', 'continue', 'true', 'false', 'None', 'Some', 'Ok', 'Err', 'where', 'as', 'in', 'ref', 'type', 'enum', 'trait', 'crate', 'super', 'async', 'await', 'move', 'dyn', 'static', 'extern']);
    const typeSet = new Set(['u8', 'u16', 'u32', 'u64', 'u128', 'i8', 'i16', 'i32', 'i64', 'i128', 'f32', 'f64', 'bool', 'String', 'str', 'Vec', 'Option', 'Result', 'Balance', 'AccountId', 'Promise', 'LookupMap', 'UnorderedMap', 'LazyOption', 'Gas', 'NearToken']);
    const nearSet = new Set(['near', 'near_bindgen', 'contract_state', 'payable', 'private', 'init', 'PanicOnDefault', 'BorshDeserialize', 'BorshSerialize', 'Deserialize', 'Serialize', 'near_sdk', 'serde']);

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return code.split('\n').map(line => {
      const commentIdx = line.indexOf('//');
      let codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
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
        '$1<span class="text-blue-400">$2</span>'
      );

      return result;
    }).join('\n');
  };

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 p-2 border-b border-border-subtle">
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
          {canExport ? 'Download' : 'Upgrade to Export'}
        </button>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto">
        <pre className="p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">
          <code 
            className="text-text-primary"
            dangerouslySetInnerHTML={{ __html: highlightRust(code) }}
          />
        </pre>
      </div>

      {/* File info */}
      <div className="p-2 border-t border-border-subtle bg-void-gray/30 flex items-center justify-between text-xs text-text-muted">
        <span>📄 contract.rs</span>
        <span>{code.split('\n').length} lines • {code.length} chars</span>
      </div>
    </div>
  );
}
