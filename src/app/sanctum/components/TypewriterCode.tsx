'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';

interface TypewriterCodeProps {
  code: string;
  speed?: number; // ms per character
  instant?: boolean; // skip animation — show code immediately (restored sessions)
  onComplete?: () => void;
  onSelectionChange?: (selectedCode: string | null) => void;
}

const HINT_DISMISSED_KEY = 'sanctum-highlight-hint-dismissed';

export function TypewriterCode({ code, speed = 10, instant = false, onComplete, onSelectionChange }: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // Tracks the current selection for the visible badge (lines/chars count)
  const [selectionBadge, setSelectionBadge] = useState<string | null>(null);
  // Use a ref (not state) so setting the selection doesn't trigger a re-render,
  // which would cause dangerouslySetInnerHTML to wipe out the highlight marks.
  const selectedTextRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLPreElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const userHasScrolledRef = useRef(false);
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  const highlightMarksRef = useRef<HTMLElement[]>([]);

  // Store onComplete in a ref to avoid re-triggering the effect
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Show highlight hint on first code generation (one-time)
  useEffect(() => {
    if (!code || typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(HINT_DISMISSED_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setShowHint(true), instant ? 500 : 3000);
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

  // Clear any persisted highlight marks + native browser selection + badge
  const clearHighlightMarks = useCallback(() => {
    highlightMarksRef.current.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        const text = document.createTextNode(mark.textContent || '');
        parent.replaceChild(text, mark);
        parent.normalize();
      }
    });
    highlightMarksRef.current = [];
    window.getSelection()?.removeAllRanges();
    setSelectionBadge(null);
  }, []);

  // Selection detection — notify parent of selected text; native ::selection CSS handles the visual
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      // Don't clear immediately — let the click handler decide
      return;
    }

    const text = sel.toString().trim();
    if (text.length < 3) return;

    // Dismiss the hint when user first highlights
    if (showHint) dismissHint();

    // Keep the pre focused so ::selection CSS stays visually active
    containerRef.current?.focus();

    // Show selection badge — visible indicator even if native highlight glitches
    const lineCount = text.split('\n').length;
    setSelectionBadge(lineCount > 1 ? `${lineCount} lines selected` : `${text.length} chars selected`);

    // Store selected text in ref — the native browser ::selection CSS handles the visual
    selectedTextRef.current = text;
    onSelectionChangeRef.current?.(text);
  }, [showHint, dismissHint]);

  // Clear selection on click inside the code area (but not on the marks themselves)
  const handleClick = useCallback((e: React.MouseEvent) => {
    // If clicking on a highlight mark, don't clear (user might be re-selecting)
    const target = e.target as HTMLElement;
    if (target.classList?.contains('sanctum-highlight') || target.closest?.('.sanctum-highlight')) return;

    // If there's an active browser selection (user is making a new selection), don't clear
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;

    // Clear existing highlight marks and selection state
    if (selectedTextRef.current) {
      clearHighlightMarks();
      selectedTextRef.current = null;
      onSelectionChangeRef.current?.(null);
    }
  }, [clearHighlightMarks]);

  // Clear selection state on click outside the wrapper
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        // Don't clear if clicking action bar buttons (they have data-preserve-selection)
        const target = e.target as HTMLElement;
        if (target.closest?.('[data-preserve-selection]')) return;

        clearHighlightMarks();
        selectedTextRef.current = null;
        onSelectionChangeRef.current?.(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearHighlightMarks]);

  // Typewriter effect — or instant display for restored sessions
  useEffect(() => {
    if (!code) {
      setDisplayedCode('');
      setIsComplete(false);
      return;
    }

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

  // Memoize highlighted HTML — ensures dangerouslySetInnerHTML gets the SAME string
  // reference when displayedCode hasn't changed, so React skips DOM replacement and
  // the browser's native text selection (::selection CSS) stays intact across re-renders.
  const highlightedHtml = useMemo(() => highlightRust(displayedCode), [displayedCode]);

  return (
    <div ref={wrapperRef} className="relative flex-1 min-h-0 flex flex-col">
      {/* Highlight mark styles */}
      <style jsx global>{`
        pre ::selection {
          background: rgba(0, 236, 151, 0.35);
          color: inherit;
        }
        pre ::-moz-selection {
          background: rgba(0, 236, 151, 0.35);
          color: inherit;
        }
        mark.sanctum-highlight {
          background: rgba(0, 236, 151, 0.35);
          color: inherit;
          border-radius: 2px;
          padding: 1px 0;
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
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 sm:px-4 py-2 rounded-xl bg-purple-500/15 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-500/10 animate-in fade-in slide-in-from-top-2 duration-300 flex items-start sm:items-center gap-2 sm:gap-3 max-w-[calc(100%-1rem)] w-max">
          <span className="text-xs text-purple-300">
            ✨ <span className="font-medium">Pro tip:</span> <span className="hidden sm:inline">Highlight any code — the toolbar below will act on your selection</span><span className="sm:hidden">Highlight code to query AI on selection</span>
          </span>
          <button
            onClick={dismissHint}
            className="text-purple-400/60 hover:text-purple-300 text-xs transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Selection active badge — persistent visual indicator */}
      {selectionBadge && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-near-green/15 border border-near-green/40 flex items-center gap-2 shadow-lg shadow-near-green/10 pointer-events-none animate-in fade-in duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-near-green animate-pulse flex-shrink-0" />
          <span className="text-xs text-near-green font-medium whitespace-nowrap">{selectionBadge} — use toolbar</span>
        </div>
      )}

      <pre
        ref={containerRef}
        tabIndex={0}
        onScroll={handleScroll}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed bg-void-black/50 outline-none"
      >
        <div className="flex">
          {/* Line number gutter */}
          <div className="flex-shrink-0 text-right pr-3 mr-3 border-r border-white/[0.06] select-none">
            {displayedCode.split('\n').map((_, i) => (
              <div key={i} className="text-text-muted/30 text-xs leading-relaxed">{i + 1}</div>
            ))}
          </div>
          {/* Code content — memoized HTML so re-renders don't replace DOM nodes and kill browser selection */}
          <code
            ref={codeRef}
            className="flex-1 overflow-x-auto text-text-primary"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
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
