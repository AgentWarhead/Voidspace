import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

export function GradientText({
  className,
  children,
  as: Tag = 'span',
  ...props
}: GradientTextProps) {
  return (
    <Tag className={cn('text-gradient', className)} {...props}>
      {children}
    </Tag>
  );
}
