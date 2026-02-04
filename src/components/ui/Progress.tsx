import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'green' | 'cyan' | 'warning' | 'error' | 'auto';
  size?: 'sm' | 'md';
  className?: string;
}

const colorStyles = {
  green: 'bg-near-green',
  cyan: 'bg-accent-cyan',
  warning: 'bg-warning',
  error: 'bg-error',
};

function getAutoColor(value: number): string {
  if (value >= 67) return 'bg-near-green';
  if (value >= 34) return 'bg-warning';
  return 'bg-error';
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'auto',
  size = 'md',
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = color === 'auto' ? getAutoColor(percentage) : colorStyles[color];

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-text-secondary">{label}</span>}
          {showValue && <span className="text-xs text-text-muted">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-background rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5',
          className
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
