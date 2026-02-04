import React from 'react';
import { cn } from '@/lib/utils';
import { COMPETITION_LABELS, DIFFICULTY_LABELS } from '@/lib/constants';
import type { TierName } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'tier' | 'difficulty' | 'competition' | 'glass';
  tier?: TierName;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  competition?: 'low' | 'medium' | 'high';
  pulse?: boolean;
}

const tierStyles: Record<TierName, string> = {
  shade: 'bg-tier-shade/20 text-tier-shade border-tier-shade/30',
  specter: 'bg-tier-specter/20 text-tier-specter border-tier-specter/30',
  legion: 'bg-tier-legion/20 text-tier-legion border-tier-legion/30',
  leviathan: 'bg-tier-leviathan/20 text-tier-leviathan border-tier-leviathan/30',
};

const difficultyStyles = {
  beginner: 'bg-near-green/10 text-near-green border-near-green/20',
  intermediate: 'bg-warning/10 text-warning border-warning/20',
  advanced: 'bg-error/10 text-error border-error/20',
};

const competitionStyles = {
  low: 'bg-near-green/10 text-near-green border-near-green/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-error/10 text-error border-error/20',
};

export function Badge({
  className,
  variant = 'default',
  tier,
  difficulty,
  competition,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  let style = 'bg-surface border-border text-text-secondary';
  let label = children;

  if (variant === 'tier' && tier) {
    style = tierStyles[tier];
    label = label || tier.charAt(0).toUpperCase() + tier.slice(1);
  } else if (variant === 'difficulty' && difficulty) {
    style = difficultyStyles[difficulty];
    label = label || DIFFICULTY_LABELS[difficulty];
  } else if (variant === 'competition' && competition) {
    style = competitionStyles[competition];
    label = label || COMPETITION_LABELS[competition];
  } else if (variant === 'glass') {
    style = 'bg-surface/60 backdrop-blur-xl border-white/10 text-text-primary shadow-lg';
  }

  return (
    <span
      className={cn(
        'relative inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border',
        style,
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="absolute -inset-0.5 rounded-full animate-ping bg-current opacity-20 pointer-events-none" />
      )}
      {label}
    </span>
  );
}
