import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  animated?: boolean;
}

export function GradientText({
  className,
  children,
  as: Tag = 'span',
  animated = false,
  ...props
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        animated ? 'text-gradient-animated' : 'text-gradient',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
