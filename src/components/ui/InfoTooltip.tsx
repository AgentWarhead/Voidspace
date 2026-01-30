'use client';

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoTooltip({ term, children, className }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [isOpen]);

  return (
    <span className={cn('relative inline-flex items-center', className)} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-text-muted hover:text-near-green transition-colors ml-1"
        aria-label={`Learn about ${term}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-3 rounded-lg bg-surface border border-border shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-xs text-text-secondary leading-relaxed"
          >
            <p className="font-semibold text-text-primary mb-1">{term}</p>
            {children}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px]">
              <div className="w-2.5 h-2.5 bg-surface border-r border-b border-border rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
