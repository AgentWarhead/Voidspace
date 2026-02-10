'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Home, Target, Sparkles, Globe, BookOpen, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';
import { LiveScanIndicator } from '@/components/effects/LiveScanIndicator';
import { NearPriceTicker } from '@/components/layout/NearPriceTicker';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const { isConnected } = useWallet();

  // Listen for immersive mode changes
  useEffect(() => {
    const checkImmersive = () => {
      setIsImmersive(document.body.hasAttribute('data-immersive'));
    };
    
    // Check on mount
    checkImmersive();
    
    // Watch for attribute changes
    const observer = new MutationObserver(checkImmersive);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-immersive'] });
    
    return () => observer.disconnect();
  }, []);

  // Hide header in immersive mode
  if (isImmersive) return null;

  // Get icon for nav item
  const getNavIcon = (label: string, isActive: boolean) => {
    const iconClass = `w-4 h-4 ${isActive ? 'text-near-green' : 'text-text-muted'}`;
    switch (label) {
      case 'Home': return <Home className={iconClass} />;
      case 'Voids': return <Target className={iconClass} />;
      case 'Sanctum': return <Sparkles className={iconClass} />;
      case 'Observatory': return <Globe className={iconClass} />;
      case 'Learn': return <BookOpen className={iconClass} />;
      case 'Profile': return <User className={iconClass} />;
      default: return null;
    }
  };

  // Create nav items with conditional Profile
  const navItems = [...NAV_ITEMS] as Array<{ label: string; href: string }>;
  if (isConnected) {
    navItems.push({ label: 'Profile', href: '/profile' });
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <VoidspaceLogo size="sm" animate={false} />
            <span className="text-xl font-bold text-gradient">Voidspace</span>
          </Link>

          {/* Center section: Live indicator + Price ticker */}
          <div className="hidden md:flex items-center gap-3">
            <LiveScanIndicator />
            <NearPriceTicker />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-2 text-sm rounded-lg transition-colors',
                    isActive
                      ? 'text-near-green'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-near-green rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="flex items-center gap-1 p-2 text-text-secondary hover:text-cyan-400 transition-all duration-200 hover:drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs text-text-muted font-mono">⌘K</span>
            </Link>
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden pb-4 border-t border-border mt-2 pt-4"
            >
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                        isActive
                          ? 'text-near-green bg-near-green/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                      )}
                    >
                      {getNavIcon(item.label, isActive)}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-3 px-3">
                <ConnectWalletButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
