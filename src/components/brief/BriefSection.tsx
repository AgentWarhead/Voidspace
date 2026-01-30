'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BriefSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function BriefSection({ title, icon, children, defaultOpen = true }: BriefSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-surface-hover transition-colors"
      >
        <span className="text-near-green shrink-0">{icon}</span>
        <span className="text-sm font-semibold text-text-primary flex-1">{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-text-muted transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}
