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

  useEffect(() => {
    if (!code) {
      setDisplayedCode('');
      setIsComplete(false);
      return;
    }

    setDisplayedCode('');
    setIsComplete(false);
    let index = 0;

    const typeChar = () => {
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
        onComplete?.();
      }
    };

    const timer = setTimeout(typeChar, 100);
    return () => clearTimeout(timer);
  }, [code, speed, onComplete]);

  // Simple syntax highlighting for Rust
  const highlightRust = (code: string): string => {
    if (!code) return '';
    
    const keywords = ['fn', 'pub', 'struct', 'impl', 'let', 'mut', 'const', 'use', 'mod', 'self', 'Self', 'return', 'if', 'else', 'match', 'for', 'while', 'loop', 'true', 'false'];
    const types = ['u8', 'u16', 'u32', 'u64', 'u128', 'i8', 'i16', 'i32', 'i64', 'i128', 'f32', 'f64', 'bool', 'String', 'str', 'Vec', 'Option', 'Result', 'Balance', 'AccountId', 'Promise'];
    const nearKeywords = ['near', 'near_bindgen', 'contract_state', 'payable', 'private', 'init', 'PanicOnDefault', 'BorshDeserialize', 'BorshSerialize'];

    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(\/\/.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
      .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(#\[.*?\])/g, '<span class="text-amber-400">$1</span>');
    
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-semibold">$1</span>');
    });
    
    types.forEach(t => {
      const regex = new RegExp(`\\b(${t})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-cyan-400">$1</span>');
    });
    
    nearKeywords.forEach(nk => {
      const regex = new RegExp(`\\b(${nk})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-near-green font-semibold">$1</span>');
    });
    
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
    highlighted = highlighted.replace(/\b(fn\s+)(\w+)/g, '$1<span class="text-blue-400 font-semibold">$2</span>');
    
    return highlighted;
  };

  return (
    <pre
      ref={containerRef}
      className="flex-1 overflow-auto p-4 text-sm font-mono leading-relaxed bg-void-black/50"
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
