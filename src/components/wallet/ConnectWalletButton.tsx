'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/utils';

export function ConnectWalletButton() {
  const { accountId, isConnected, isLoading, openModal, signOut } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <Button variant="primary" size="sm" onClick={openModal}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-near-green bg-near-green/10 rounded-lg hover:bg-near-green/20 transition-colors"
      >
        <span>{truncateAddress(accountId)}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50">
          <Link
            href="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={async () => {
              setDropdownOpen(false);
              await signOut();
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors w-full text-left border-t border-border"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
