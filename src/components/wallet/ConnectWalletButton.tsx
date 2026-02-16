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

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50">
          <Link
            href="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors min-h-[44px] active:scale-[0.97]"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={async () => {
              setDropdownOpen(false);
              await signOut();
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors w-full text-left border-t border-border min-h-[44px] active:scale-[0.97]"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
