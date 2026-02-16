'use client';

import { motion } from 'framer-motion';
import { Briefcase, ArrowRight } from 'lucide-react';

export function NonDevCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm px-5 py-3.5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Briefcase className="w-5 h-5 text-purple-400 shrink-0" />
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Not a developer?</span>{' '}
          The Founder Track covers tokenomics, pitching, grants, and business models — no coding required.
        </p>
      </div>
      <button
        onClick={() =>
          document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors min-h-[44px] py-2"
      >
        Go to Founder Track
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
