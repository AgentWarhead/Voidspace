'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Circle } from 'lucide-react';

interface VoidEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

export function VoidEmptyState({ 
  icon: Icon = Circle, 
  title, 
  description, 
  actionLabel,
  actionHref,
  actionOnClick
}: VoidEmptyStateProps) {
  const ActionButton = actionLabel ? (
    <button
      onClick={actionOnClick}
      className="px-4 py-2 bg-near-green hover:bg-near-green/80 text-white font-medium rounded-lg transition-colors"
    >
      {actionLabel}
    </button>
  ) : null;

  const ActionLink = actionLabel && actionHref ? (
    <Link
      href={actionHref}
      className="px-4 py-2 bg-near-green hover:bg-near-green/80 text-white font-medium rounded-lg transition-colors"
    >
      {actionLabel}
    </Link>
  ) : null;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-6"
      >
        {/* Ambient glow behind icon */}
        <div className="absolute inset-0 blur-2xl bg-near-green/10 rounded-full scale-150" />
        <div className="relative p-4 rounded-full border border-border bg-surface/50">
          <Icon className="w-16 h-16 text-text-muted" />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-lg font-semibold text-text-primary"
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="text-sm text-text-muted mt-2 max-w-sm"
        >
          {description}
        </motion.p>
      )}

      {(ActionLink || ActionButton) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-4"
        >
          {actionHref ? ActionLink : ActionButton}
        </motion.div>
      )}
    </div>
  );
}
