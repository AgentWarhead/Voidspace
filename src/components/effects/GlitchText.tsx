'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const GLITCH_CHARS = '█▓▒░⌬⌖◈⊗⌀⌁⌂⌃⌄⌅⌆⌇';

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: 'subtle' | 'medium';
}

export function GlitchText({ children, className, intensity = 'subtle' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrambleCount = intensity === 'medium' ? 3 : 1;

  const triggerGlitch = useCallback(() => {
    const original = children;
    const chars = original.split('');
    const numToScramble = Math.min(scrambleCount + Math.floor(Math.random() * 2), chars.length);

    // Pick random positions to scramble
    const positions: number[] = [];
    while (positions.length < numToScramble) {
      const pos = Math.floor(Math.random() * chars.length);
      if (!positions.includes(pos)) positions.push(pos);
    }

    // Apply scramble
    const scrambled = chars.map((ch, i) =>
      positions.includes(i)
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        : ch
    );
    setDisplayText(scrambled.join(''));

    // Restore after ~200ms
    timeoutRef.current = setTimeout(() => {
      setDisplayText(original);
    }, 200);
  }, [children, scrambleCount]);

  useEffect(() => {
    setDisplayText(children);

    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 8000; // 4-12s
      intervalRef.current = setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [children, triggerGlitch]);

  return (
    <span
      className={cn('inline-block', className)}
      style={{ animation: 'glitch-1 8s ease-in-out infinite' }}
      aria-label={children}
    >
      {displayText}
    </span>
  );
}
