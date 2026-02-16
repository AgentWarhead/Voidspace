'use client';

import { useEffect, useState, useRef } from 'react';

interface TypewriterCodeProps {
  code: string;
  speed?: number; // ms per character
  onComplete?: () => void;
}

export function TypewriterCode({ code, speed = 10, onComplete }: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLPreElement>(null);

  // Store onComplete in a ref to avoid re-triggering the effect
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!code) {
      setDisplayedCode('');
      setIsComplete(false);
      return;
    }

    setDisplayedCode('');
    setIsComplete(false);
    let index = 0;
    let cancelled = false;

    const typeChar = () => {
      if (cancelled) return;
      if (index < code.length) {
        // Type faster for whitespace
        const char = code[index];
        const isWhitespace = /\s/.test(char);
        
        setDisplayedCode(code.slice(0, index + 1));
        index++;

        // Auto-scroll to bottom
        if (containerRef.current) {
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
  }, [code, speed]);

  // Token-based syntax highlighting for Rust (prevents regex self-corruption)
  const highlightRust = (code: string): string => {
    if (!code) return '';

    const keywordSet = new Set(['fn', 'pub', 'struct', 'impl', 'let', 'mut', 'const', 'use', 'mod', 'self', 'Self', 'return', 'if', 'else', 'match', 'for', 'while', 'loop', 'true', 'false', 'where', 'as', 'in', 'ref', 'type', 'enum', 'trait', 'crate', 'super', 'async', 'await', 'move', 'dyn', 'static', 'extern']);
    const typeSet = new Set(['u8', 'u16', 'u32', 'u64', 'u128', 'i8', 'i16', 'i32', 'i64', 'i128', 'f32', 'f64', 'bool', 'String', 'str', 'Vec', 'Option', 'Result', 'Balance', 'AccountId', 'Promise', 'LookupMap', 'UnorderedMap', 'LazyOption', 'Gas', 'NearToken']);
    const nearSet = new Set(['near', 'near_bindgen', 'contract_state', 'payable', 'private', 'init', 'PanicOnDefault', 'BorshDeserialize', 'BorshSerialize', 'Deserialize', 'Serialize', 'near_sdk', 'serde']);

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Tokenize line-by-line to handle comments correctly
    return code.split('\n').map(line => {
      // Check for line comment
      const commentIdx = line.indexOf('//');
      let codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
      const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';

      // Tokenize the code part
      // Split into: strings, attributes, words, numbers, and everything else
      const tokens: string[] = [];
      let remaining = codePart;

      while (remaining.length > 0) {
        // String literal
        const strMatch = remaining.match(/^"(?:[^"\\]|\\.)*"/);
        if (strMatch) {
          tokens.push(`<span class="text-emerald-400">${esc(strMatch[0])}</span>`);
          remaining = remaining.slice(strMatch[0].length);
          continue;
        }

        // Attribute #[...]
        const attrMatch = remaining.match(/^#\[([^\]]*)\]/);
        if (attrMatch) {
          tokens.push(`<span class="text-amber-400">${esc(attrMatch[0])}</span>`);
          remaining = remaining.slice(attrMatch[0].length);
          continue;
        }

        // Word (identifier / keyword)
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

        // Number literal (including underscored like 1_000_000)
        const numMatch = remaining.match(/^\d[\d_]*/);
        if (numMatch) {
          tokens.push(`<span class="text-orange-400">${esc(numMatch[0])}</span>`);
          remaining = remaining.slice(numMatch[0].length);
          continue;
        }

        // Any other character (operators, punctuation, whitespace)
        tokens.push(esc(remaining[0]));
        remaining = remaining.slice(1);
      }

      // Add comment part (highlighted)
      const commentHtml = commentPart
        ? `<span class="text-slate-500 italic">${esc(commentPart)}</span>`
        : '';

      // Post-process: color function names (word after "fn ")
      let result = tokens.join('') + commentHtml;
      result = result.replace(
        /(<span class="text-purple-400 font-semibold">fn<\/span>\s+)([a-zA-Z_]\w*)/g,
        '$1<span class="text-blue-400 font-semibold">$2</span>'
      );

      return result;
    }).join('\n');
  };

  return (
    <pre
      ref={containerRef}
      className="flex-1 overflow-auto overflow-x-auto p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed bg-void-black/50"
    >
      <code 
        className="text-text-primary"
        dangerouslySetInnerHTML={{ __html: highlightRust(displayedCode) }}
      />
      {!isComplete && code && (
        <span className="inline-block w-2 h-4 bg-near-green animate-pulse ml-0.5" />
      )}
    </pre>
  );
}
