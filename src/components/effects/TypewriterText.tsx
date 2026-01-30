'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  lines: string[];
  speed?: number;
  pauseBetween?: number;
  className?: string;
}

export function TypewriterText({
  lines,
  speed = 40,
  pauseBetween = 600,
  className,
}: TypewriterTextProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];

    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setCompletedLines((prev) => [...prev, line]);
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
      }, pauseBetween);
      return () => clearTimeout(timer);
    }

    if (currentChar < line.length) {
      const timer = setTimeout(() => {
        setCurrentChar((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }

    // Line complete
    setIsPaused(true);
  }, [currentLine, currentChar, isPaused, lines, speed, pauseBetween]);

  const activeLine = currentLine < lines.length ? lines[currentLine].slice(0, currentChar) : '';
  const isTyping = currentLine < lines.length;

  return (
    <div className={cn('space-y-1', className)}>
      {completedLines.map((line, i) => (
        <p key={i} className="text-text-secondary text-sm sm:text-base">
          {line}
        </p>
      ))}
      {isTyping && (
        <p className="text-text-secondary text-sm sm:text-base">
          {activeLine}
          <span className="inline-block w-[2px] h-[1em] ml-0.5 align-middle border-r-2 border-near-green animate-[cursor-blink_1s_step-end_infinite]" />
        </p>
      )}
    </div>
  );
}
