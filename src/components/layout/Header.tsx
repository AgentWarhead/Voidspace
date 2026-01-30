'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';
import { LiveScanIndicator } from '@/components/effects/LiveScanIndicator';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <VoidspaceLogo size="sm" animate={false} />
            <span className="text-xl font-bold text-gradient">Voidspace</span>
          </Link>

          {/* Live indicator */}
          <LiveScanIndicator />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg transition-colors',
                  pathname === item.href
                    ? 'text-near-green bg-near-green/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-4">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg transition-colors',
                    pathname === item.href
                      ? 'text-near-green bg-near-green/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 px-3">
              <ConnectWalletButton />
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
