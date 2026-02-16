import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  badge?: string;
  count?: number;
  className?: string;
}

export function SectionHeader({ title, badge, count, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center gap-2 sm:gap-3 mb-4 max-w-full overflow-hidden', className)}>
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-near-green opacity-50" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-near-green" />
      </span>

      <h2 className="text-base sm:text-lg font-semibold text-text-primary whitespace-nowrap truncate">{title}</h2>

      {count !== undefined && (
        <span className="text-xs font-mono text-text-muted shrink-0">{count}</span>
      )}

      {/* Extending line */}
      <div className="flex-1 h-px bg-gradient-to-r from-near-green/30 to-transparent min-w-[1rem]" />

      {badge && (
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider sm:tracking-widest text-near-green/70 bg-near-green/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-near-green/20 shrink-0 whitespace-nowrap">
          {badge}
        </span>
      )}
    </div>
  );
}
