'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroCTA() {
  const [builderCount, setBuilderCount] = useState(0);

  useEffect(() => {
    setBuilderCount(Math.floor(Math.random() * 30) + 32);

    const interval = setInterval(() => {
      setBuilderCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(25, Math.min(65, prev + change));
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

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

      {builderCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-near-green opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-near-green" />
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={builderCount}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-mono"
            >
              {builderCount}
            </motion.span>
          </AnimatePresence>
          <span>builders scanning right now</span>
        </div>
      )}
    </div>
  );
}
