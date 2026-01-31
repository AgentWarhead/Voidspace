'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    // Reposition on scroll/resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        wrapperRef.current && !wrapperRef.current.contains(target) &&
        tooltipRef.current && !tooltipRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Clamp tooltip so it doesn't overflow viewport edges
  const getStyle = (): React.CSSProperties => {
    if (!coords) return { position: 'fixed', opacity: 0 };
    return {
      position: 'absolute',
      top: coords.top - 8, // mb-2 gap
      left: coords.left,
      transform: 'translate(-50%, -100%)',
    };
  };

  const tooltip = (
    <AnimatePresence>
      {isOpen && coords && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="w-64 p-3 rounded-lg bg-surface border border-border shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-xs text-text-secondary leading-relaxed"
          style={{
            ...getStyle(),
            zIndex: 9999,
          }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <p className="font-semibold text-text-primary mb-1">{term}</p>
          {children}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px]">
            <div className="w-2.5 h-2.5 bg-surface border-r border-b border-border rotate-45" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <span className={cn('relative inline-flex items-center', className)} ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-text-muted hover:text-near-green transition-colors ml-1"
        aria-label={`Learn about ${term}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {typeof document !== 'undefined' ? createPortal(tooltip, document.body) : null}
    </span>
  );
}
