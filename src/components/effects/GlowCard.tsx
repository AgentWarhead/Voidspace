'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function GlowCard({
  className,
  children,
  padding = 'md',
  onClick,
}: GlowCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-surface border border-border rounded-lg cursor-pointer',
        paddingStyles[padding],
        className
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        borderColor: 'rgba(0, 236, 151, 0.3)',
        boxShadow: '0 0 20px rgba(0, 236, 151, 0.15)',
        y: -2,
      }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
