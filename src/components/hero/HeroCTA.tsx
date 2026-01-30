'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroCTA() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Link href="/opportunities">
        <motion.button
          className="shimmer-btn text-background font-semibold px-8 py-3.5 rounded-lg text-base inline-flex items-center gap-2 transition-all"
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0,236,151,0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          Explore the Void
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </Link>

      <p className="text-xs text-text-muted font-mono">
        Powered by Claude AI
      </p>
    </div>
  );
}
