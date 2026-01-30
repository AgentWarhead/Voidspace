import { cn } from '@/lib/utils';

interface GridPatternProps {
  className?: string;
}

export function GridPattern({ className }: GridPatternProps) {
  return (
    <div
      className={cn('absolute inset-0 bg-grid pointer-events-none', className)}
      aria-hidden="true"
    />
  );
}
