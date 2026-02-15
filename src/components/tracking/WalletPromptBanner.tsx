'use client';

import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X } from 'lucide-react';
import { WalletContext } from '@/contexts/WalletContext';

const DISMISS_KEY = 'voidspace-wallet-banner-dismissed';

export function WalletPromptBanner() {
  const { isConnected, openModal } = useContext(WalletContext);
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
      setDismissed(wasDismissed);
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* silent */ }
  };

  if (!mounted || isConnected || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <div className="mx-auto max-w-5xl px-4 pt-3">
          <div
            className="
              flex items-center gap-3 px-4 py-2.5 rounded-xl
              bg-accent-cyan/5 border border-accent-cyan/15
              backdrop-blur-sm
            "
          >
            <Wallet className="w-4 h-4 text-accent-cyan flex-shrink-0" />
            <p className="text-xs text-text-muted flex-1">
              Connect your NEAR wallet to track progress, earn achievements,
              and unlock your Skill Constellation
            </p>
            <button
              onClick={openModal}
              className="
                px-3 py-1 rounded-lg text-xs font-medium
                bg-accent-cyan/10 text-accent-cyan
                hover:bg-accent-cyan/20 transition-colors
                flex-shrink-0
              "
            >
              Connect Wallet
            </button>
            <button
              onClick={handleDismiss}
              className="text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
