'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface VoidspaceLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

// Height in pixels for each size — width scales from aspect ratio (~1.42:1)
const heights: Record<string, number> = {
  sm: 24,
  md: 32,
  lg: 64,
  xl: 120,
};

export function VoidspaceLogo({ size = 'md', className, animate = true }: VoidspaceLogoProps) {
  const h = heights[size];
  const w = Math.round(h * 1.42); // logo aspect ratio ~1278:903

  const img = (
    <Image
      src="/voidspace-logo.png"
      alt="Voidspace"
      width={w}
      height={h}
      className={cn('object-contain drop-shadow-[0_0_12px_rgba(0,236,151,0.35)]', className)}
      priority={size === 'xl' || size === 'sm'}
    />
  );

  if (!animate) return img;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {img}
    </motion.div>
  );
}
