'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoidspaceLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: 24,
  md: 32,
  lg: 64,
  xl: 96,
};

export function VoidspaceLogo({ size = 'md', className, animate = true }: VoidspaceLogoProps) {
  const s = sizes[size];

  return (
    <svg
      viewBox="0 0 100 100"
      width={s}
      height={s}
      className={cn('void-glow', className)}
      fill="none"
    >
      {/* Outer broken ring — the void */}
      <motion.path
        d="M 85 50 A 35 35 0 1 1 65 18.4"
        stroke="#00EC97"
        strokeWidth={size === 'sm' ? 5 : 4}
        strokeLinecap="round"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Inner arc — depth ring */}
      <motion.path
        d="M 68 50 A 18 18 0 1 1 50 32"
        stroke="#00EC97"
        strokeWidth={size === 'sm' ? 3 : 2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.3}
        initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
      />

      {/* Diagonal scan line */}
      <motion.line
        x1="25"
        y1="75"
        x2="75"
        y2="25"
        stroke="#00D4FF"
        strokeWidth={size === 'sm' ? 2.5 : 2}
        strokeLinecap="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.7 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
      />

      {/* Center dot — the discovery point */}
      <motion.circle
        cx="50"
        cy="50"
        r={size === 'sm' ? 4 : 3}
        fill="#00EC97"
        initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.6, type: 'spring', stiffness: 400 }}
      />
    </svg>
  );
}
