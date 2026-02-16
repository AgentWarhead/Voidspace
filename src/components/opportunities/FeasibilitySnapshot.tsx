'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Users, DollarSign, Code2, X } from 'lucide-react';
import type { Opportunity } from '@/types';

interface FeasibilitySnapshotProps {
  opportunity: Opportunity;
}

// Derive estimates from opportunity data
function getEstimates(opportunity: Opportunity) {
  const { difficulty, gap_score, category } = opportunity;
  
  const mvpTime = {
    beginner: '2-4 weeks',
    intermediate: '4-8 weeks',
    advanced: '3-6 months',
  }[difficulty];
  
  const teamSize = {
    beginner: 'Solo',
    intermediate: '2-3 people',
    advanced: '3-5+ people',
  }[difficulty];
  
  const grantPotential = gap_score >= 80 
    ? '$25-50K+' 
    : gap_score >= 60 
    ? '$10-25K' 
    : '$5-10K';
  
  const categoryName = category?.name?.toLowerCase() || '';
  const nearStack = (() => {
    if (categoryName.includes('defi')) return 'NEAR SDK + Aurora';
    if (categoryName.includes('gaming')) return 'NEAR SDK + PlayNEAR';
    if (categoryName.includes('infrastructure')) return 'NEAR SDK + Pagoda';
    return 'NEAR SDK + BOS';
  })();
  
  return { mvpTime, teamSize, grantPotential, nearStack };
}

export function FeasibilitySnapshot({ opportunity }: FeasibilitySnapshotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const estimates = getEstimates(opportunity);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <>
      {/* Trigger button — 44px min touch target */}
      <button
        onClick={handleClick}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors group/snap active:scale-90 touch-manipulation"
        title="Quick feasibility check"
      >
        <Zap className="w-4 h-4 text-text-muted group-hover/snap:text-accent-cyan transition-colors" />
      </button>

      {/* Popup overlay */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={handleOverlayClick}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Popup card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-surface border border-border rounded-xl p-5 sm:p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm sm:text-base">Quick Check</h3>
                </div>
                <button
                  onClick={handleClose}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors active:scale-90 touch-manipulation"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              {/* Estimates */}
              <div className="space-y-4">
                <EstimateRow icon={Clock} label="Estimated MVP Time" value={estimates.mvpTime} />
                <EstimateRow icon={Users} label="Team Size" value={estimates.teamSize} />
                <EstimateRow icon={DollarSign} label="Grant Potential" value={estimates.grantPotential} valueClass="text-near-green" />
                <EstimateRow icon={Code2} label="NEAR Stack" value={estimates.nearStack} />
              </div>

              {/* Footer */}
              <div className="mt-5 sm:mt-6 pt-4 border-t border-border-secondary">
                <p className="text-xs text-text-muted text-center">
                  Estimates based on difficulty level and market opportunity
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function EstimateRow({
  icon: Icon,
  label,
  value,
  valueClass = 'text-text-primary',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | undefined;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-md bg-surface-hover flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-text-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-text-muted">{label}</p>
        <p className={`font-medium text-sm sm:text-base ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}
