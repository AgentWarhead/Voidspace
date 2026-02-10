'use client';
import { useState } from 'react';
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

  const iconMap = {
    info: Info,
    sparkle: Sparkles,
    bolt: Zap
  };

  const IconComponent = iconMap[icon];
  
  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="p-0.5 text-text-muted hover:text-near-green transition-colors"
      >
        <IconComponent className="w-3.5 h-3.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              'absolute z-50 w-56 bg-surface/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-2xl',
              position === 'top' && 'bottom-full mb-2 left-1/2 -translate-x-1/2',
              position === 'bottom' && 'top-full mt-2 left-1/2 -translate-x-1/2',
              position === 'left' && 'right-full mr-2 top-1/2 -translate-y-1/2',
              position === 'right' && 'left-full ml-2 top-1/2 -translate-y-1/2',
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