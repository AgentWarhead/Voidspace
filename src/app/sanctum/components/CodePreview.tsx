'use client';

import { useState } from 'react';
import { Check, Copy, Download, Code } from 'lucide-react';

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract.rs';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple syntax highlighting for Rust
  const highlightRust = (code: string): string => {
    if (!code) return '';
    
    // Keywords
    const keywords = ['fn', 'pub', 'struct', 'impl', 'let', 'mut', 'const', 'use', 'mod', 'self', 'Self', 'return', 'if', 'else', 'match', 'for', 'while', 'loop', 'break', 'continue', 'true', 'false', 'None', 'Some', 'Ok', 'Err'];
    
    // Types
    const types = ['u8', 'u16', 'u32', 'u64', 'u128', 'i8', 'i16', 'i32', 'i64', 'i128', 'f32', 'f64', 'bool', 'String', 'str', 'Vec', 'Option', 'Result', 'Balance', 'AccountId', 'Promise'];
    
    // NEAR-specific
    const nearKeywords = ['near', 'near_bindgen', 'contract_state', 'payable', 'private', 'init', 'PanicOnDefault', 'BorshDeserialize', 'BorshSerialize'];

    let highlighted = code
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Comments
      .replace(/(\/\/.*$)/gm, '<span class="text-slate-500">$1</span>')
      // Strings
      .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
      // Attributes/macros
      .replace(/(#\[.*?\])/g, '<span class="text-amber-400">$1</span>');
    
    // Keywords
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
    });
    
    // Types
    types.forEach(t => {
      const regex = new RegExp(`\\b(${t})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-cyan-400">$1</span>');
    });
    
    // NEAR keywords
    nearKeywords.forEach(nk => {
      const regex = new RegExp(`\\b(${nk})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-near-green">$1</span>');
    });
    
    // Numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
    
    // Function names
    highlighted = highlighted.replace(/\b(fn\s+)(\w+)/g, '$1<span class="text-blue-400">$2</span>');
    
    return highlighted;
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
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary bg-void-gray/50 hover:bg-void-gray rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
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
