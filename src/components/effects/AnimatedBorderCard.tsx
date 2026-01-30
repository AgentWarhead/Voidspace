'use client';

import { cn } from '@/lib/utils';

interface AnimatedBorderCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function AnimatedBorderCard({
  children,
  className,
  padding = 'md',
}: AnimatedBorderCardProps) {
  return (
    <div className={cn('animated-border', paddingStyles[padding], className)}>
      {children}
    </div>
  );
}
