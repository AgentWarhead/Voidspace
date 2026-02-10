'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Info, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureTipProps {
  tip: string;
  title?: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: 'info' | 'sparkle' | 'bolt';
}

export function FeatureTip({ tip, title, className, position = 'top', icon = 'info' }: FeatureTipProps) {
  const [show, setShow] = useState(false);
  const [resolvedPos, setResolvedPos] = useState(position);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const iconMap = {
    info: Info,
    sparkle: Sparkles,
    bolt: Zap
  };

  const IconComponent = iconMap[icon];

  // Viewport-aware positioning: flip if tooltip would overflow
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) { setResolvedPos(position); return; }
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipH = 100; // estimated max height
    const tooltipW = 224; // w-56 = 14rem = 224px
    const margin = 12;

    let pos = position;
    // Flip vertical if no room
    if (pos === 'top' && rect.top < tooltipH + margin) pos = 'bottom';
    if (pos === 'bottom' && window.innerHeight - rect.bottom < tooltipH + margin) pos = 'top';
    // Flip horizontal if no room
    if (pos === 'left' && rect.left < tooltipW + margin) pos = 'right';
    if (pos === 'right' && window.innerWidth - rect.right < tooltipW + margin) pos = 'left';
    setResolvedPos(pos);
  }, [position]);

  // Clamp tooltip horizontally so it never overflows the viewport
  useEffect(() => {
    if (!show || !tooltipRef.current) return;
    const el = tooltipRef.current;
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth - 8) {
      el.style.transform = `translateX(${window.innerWidth - 8 - r.right}px)`;
    } else if (r.left < 8) {
      el.style.transform = `translateX(${8 - r.left}px)`;
    }
  }, [show, resolvedPos]);

  const handleShow = () => { updatePosition(); setShow(true); };
  
  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        ref={triggerRef}
        onClick={() => { if (show) { setShow(false); } else { handleShow(); } }}
        onMouseEnter={handleShow}
        onMouseLeave={() => setShow(false)}
        className="p-0.5 text-text-muted hover:text-near-green transition-colors"
      >
        <IconComponent className="w-3.5 h-3.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              'absolute z-50 w-56 bg-surface/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-2xl pointer-events-none',
              resolvedPos === 'top' && 'bottom-full mb-2 left-1/2 -translate-x-1/2',
              resolvedPos === 'bottom' && 'top-full mt-2 left-1/2 -translate-x-1/2',
              resolvedPos === 'left' && 'right-full mr-2 top-1/2 -translate-y-1/2',
              resolvedPos === 'right' && 'left-full ml-2 top-1/2 -translate-y-1/2',
            )}
          >
            {title && <p className="text-xs font-bold text-near-green font-mono mb-1">{title}</p>}
            <p className="text-xs text-text-secondary leading-relaxed">{tip}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}