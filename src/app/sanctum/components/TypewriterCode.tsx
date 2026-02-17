'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface CodeAction {
  action: string;
  selectedCode: string;
}

interface TypewriterCodeProps {
  code: string;
  speed?: number; // ms per character
  instant?: boolean; // skip animation — show code immediately (restored sessions)
  onComplete?: () => void;
  onCodeAction?: (action: CodeAction) => void;
}

const HINT_DISMISSED_KEY = 'sanctum-highlight-hint-dismissed';

export function TypewriterCode({ code, speed = 10, instant = false, onComplete, onCodeAction }: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef<HTMLPreElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const userHasScrolledRef = useRef(false);

  // Store onComplete in a ref to avoid re-triggering the effect
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Show highlight hint on first code generation (one-time)
  useEffect(() => {
    if (!code || typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(HINT_DISMISSED_KEY);
    if (!dismissed) {
      // Show hint after code appears (slight delay so it doesn't fight the typewriter)
      const timer = setTimeout(() => setShowHint(true), instant ? 500 : 3000);
      // Auto-dismiss after 8 seconds
      const autoHide = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem(HINT_DISMISSED_KEY, '1');
      }, instant ? 8500 : 11000);
      return () => { clearTimeout(timer); clearTimeout(autoHide); };
    }
  }, [code, instant]);

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem(HINT_DISMISSED_KEY, '1');
  };

  // Reset scroll state when code prop changes (new generation)
  useEffect(() => {
    userHasScrolledRef.current = false;
    setUserHasScrolled(false);
  }, [code]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 40;
    if (nearBottom) {
      userHasScrolledRef.current = false;
      setUserHasScrolled(false);
    } else {
      userHasScrolledRef.current = true;
      setUserHasScrolled(true);
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    userHasScrolledRef.current = false;
    setUserHasScrolled(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Selection detection
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setTimeout(() => {
        const s = window.getSelection();
        if (!s || s.isCollapsed || !s.toString().trim()) {
          setSelection(null);
        }
      }, 200);
      return;
    }

    const text = sel.toString().trim();
    if (text.length < 3) return;

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const wrapperRect = wrapperRef.current?.getBoundingClientRect();
    if (!wrapperRect) return;

    // Dismiss the hint when user first highlights
    if (showHint) dismissHint();

    setSelection({
      text,
      x: Math.min(rect.left - wrapperRect.left + rect.width / 2, wrapperRect.width - 120),
      y: rect.top - wrapperRect.top - 8,
    });
  }, [showHint]);

  // Close selection toolbar on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSelection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectionAction = (action: string) => {
    if (!selection) return;
    onCodeAction?.({ action, selectedCode: selection.text });
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  // Typewriter effect — or instant display for restored sessions
  useEffect(() => {
    if (!code) {
      setDisplayedCode('');
      setIsComplete(false);
      return;
    }

    // Instant mode: show all code immediately (restored from localStorage)
    if (instant) {
      setDisplayedCode(code);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    setDisplayedCode('');
    setIsComplete(false);
    let index = 0;
    let cancelled = false;

    const typeChar = () => {
      if (cancelled) return;
      if (index < code.length) {
        const char = code[index];
        const isWhitespace = /\s/.test(char);
        
        setDisplayedCode(code.slice(0, index + 1));
        index++;

        if (containerRef.current && !userHasScrolledRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        setTimeout(typeChar, isWhitespace ? speed / 3 : speed);
      } else {
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    };

    const timer = setTimeout(typeChar, 100);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [code, speed, instant]);

  // Token-based syntax highlighting for Rust (prevents regex self-corruption)
  const highlightRust = (code: string): string => {
    if (!code) return '';

    const keywordSet = new Set(['fn', 'pub', 'struct', 'impl', 'let', 'mut', 'const', 'use', 'mod', 'self', 'Self', 'return', 'if', 'else', 'match', 'for', 'while', 'loop', 'true', 'false', 'where', 'as', 'in', 'ref', 'type', 'enum', 'trait', 'crate', 'super', 'async', 'await', 'move', 'dyn', 'static', 'extern']);
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
            tokens.push(`<span class="text-near-green font-semibold">${esc(word)}</span>`);
          } else if (keywordSet.has(word)) {
            tokens.push(`<span class="text-purple-400 font-semibold">${esc(word)}</span>`);
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
        ? `<span class="text-slate-500 italic">${esc(commentPart)}</span>`
        : '';

      let result = tokens.join('') + commentHtml;
      result = result.replace(
        /(<span class="text-purple-400 font-semibold">fn<\/span>\s+)([a-zA-Z_]\w*)/g,
        '$1<span class="text-blue-400 font-semibold">$2</span>'
      );

      return result;
    }).join('\n');
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 min-h-0 flex flex-col">
      {/* Custom selection color via style tag */}
      <style jsx>{`
        pre ::selection {
          background: rgba(0, 236, 151, 0.25);
          color: inherit;
        }
        pre ::-moz-selection {
          background: rgba(0, 236, 151, 0.25);
          color: inherit;
        }
      `}</style>

      {/* Copy button */}
      {code && (
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs font-mono transition-all ${
            copied
              ? 'bg-near-green/20 text-near-green border border-near-green/40'
              : 'bg-void-black/60 text-text-muted border border-white/10 hover:border-white/30 hover:text-white'
          }`}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      )}

      {/* One-time highlight hint */}
      {showHint && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-purple-500/15 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-500/10 animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3">
          <span className="text-xs text-purple-300">
            ✨ <span className="font-medium">Pro tip:</span> Highlight any code to explain, optimize, or audit it
          </span>
          <button
            onClick={dismissHint}
            className="text-purple-400/60 hover:text-purple-300 text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Selection floating toolbar */}
      {selection && (
        <div
          className="absolute z-20 flex items-center gap-1 px-1.5 py-1 rounded-lg bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.15] shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-150"
          style={{
            left: Math.max(8, selection.x - 100),
            top: Math.max(8, selection.y - 36),
          }}
        >
          <button
            onClick={() => handleSelectionAction('explain')}
            className="px-2.5 py-1.5 text-xs rounded-md hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-all whitespace-nowrap"
          >
            💡 Explain
          </button>
          <button
            onClick={() => handleSelectionAction('optimize')}
            className="px-2.5 py-1.5 text-xs rounded-md hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-all whitespace-nowrap"
          >
            ⚡ Optimize
          </button>
          <button
            onClick={() => handleSelectionAction('security')}
            className="px-2.5 py-1.5 text-xs rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all whitespace-nowrap"
          >
            🔒 Audit
          </button>
          <button
            onClick={() => handleSelectionAction('modify')}
            className="px-2.5 py-1.5 text-xs rounded-md hover:bg-near-green/20 text-near-green hover:text-near-green/80 transition-all whitespace-nowrap"
          >
            ✏️ Modify
          </button>
        </div>
      )}

      <pre
        ref={containerRef}
        onScroll={handleScroll}
        onMouseUp={handleMouseUp}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed bg-void-black/50"
      >
        <div className="flex">
          {/* Line number gutter */}
          <div className="flex-shrink-0 text-right pr-3 mr-3 border-r border-white/[0.06] select-none">
            {displayedCode.split('\n').map((_, i) => (
              <div key={i} className="text-text-muted/30 text-xs leading-relaxed">{i + 1}</div>
            ))}
          </div>
          {/* Code content */}
          <code
            className="flex-1 overflow-x-auto text-text-primary"
            dangerouslySetInnerHTML={{ __html: highlightRust(displayedCode) }}
          />
        </div>
        {!isComplete && code && (
          <span className="inline-block w-2 h-4 bg-near-green animate-pulse ml-0.5" />
        )}
      </pre>

      {/* Scroll to bottom button */}
      {userHasScrolled && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-void-black/80 text-near-green border border-near-green/30 text-xs font-mono hover:bg-near-green/10 transition-all shadow-lg"
        >
          ↓ Scroll to bottom
        </button>
      )}
    </div>
  );
}
