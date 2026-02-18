'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/utils';

export function ConnectWalletButton() {
  const { accountId, isConnected, isLoading, openModal, signOut } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if tooltip should be shown on mount
  useEffect(() => {
    const tooltipShown = localStorage.getItem('voidspace_wallet_tooltip_shown');
    if (!tooltipShown && !isConnected) {
      setShowTooltip(true);
      // Auto-dismiss after 12 seconds
      tooltipTimeoutRef.current = setTimeout(() => {
        handleTooltipDismiss();
      }, 12000);
    }
    
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [isConnected]);

  // Handle tooltip dismiss
  const handleTooltipDismiss = () => {
    setShowTooltip(false);
    localStorage.setItem('voidspace_wallet_tooltip_shown', 'true');
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (isLoading) {
    return (
      <Button variant="primary" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (!isConnected || !accountId) {
    return (
      <div className="relative">
        <Button variant="primary" size="sm" onClick={openModal}>
          Connect Wallet
        </Button>
        
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] z-50"
            >
              <div className="bg-surface/95 backdrop-blur-sm border border-near-green/30 rounded-lg p-3 shadow-lg">
                <div className="text-sm text-text-secondary leading-relaxed">
                  Connect your NEAR wallet to save opportunities, track builds, and get personalized recommendations
                </div>
                {/* Arrow pointing up */}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-surface/95 border-l border-t border-near-green/30 rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-near-green bg-near-green/10 rounded-lg hover:bg-near-green/20 transition-colors min-h-[44px] active:scale-[0.97]"
      >
        <span>{truncateAddress(accountId)}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-64 z-50"
          >
            <div
              className="relative rounded-xl overflow-hidden backdrop-blur-xl border border-near-green/20"
              style={{
                background: 'rgba(8, 12, 18, 0.92)',
                boxShadow: '0 0 0 1px rgba(0,236,151,0.08), 0 4px 30px rgba(0,0,0,0.5), 0 0 40px rgba(0,236,151,0.05)',
              }}
            >
              {/* Subtle inner gradient */}
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background:
                    'radial-gradient(ellipse at top left, rgba(0,236,151,0.06) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(123,97,255,0.04) 0%, transparent 60%)',
                }}
              />

              {/* Wallet address header */}
              <div className="relative px-4 py-3 border-b border-white/[0.06]">
                <div className="text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1.5 font-medium">Connected Wallet</div>
                <div className="text-xs font-mono text-near-green/70 break-all leading-relaxed">{accountId}</div>
              </div>

              {/* Menu items */}
              <div className="relative p-1.5">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/55 hover:text-near-green hover:bg-near-green/10 rounded-lg transition-all duration-150 min-h-[44px] group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] group-hover:bg-near-green/15 border border-white/[0.06] group-hover:border-near-green/20 flex items-center justify-center transition-all flex-shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    await signOut();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/55 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150 w-full text-left min-h-[44px] group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] group-hover:bg-red-500/10 border border-white/[0.06] group-hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0">
                    <LogOut className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Disconnect</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
