'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';
import { GridPattern } from '@/components/effects/GridPattern';

export function Footer() {
  const [isImmersive, setIsImmersive] = useState(false);

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

  // Hide footer in immersive mode
  if (isImmersive) return null;

  return (
    <footer className="relative bg-background overflow-hidden">
      {/* Gradient top border with glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-near-green/30 to-transparent" />
      <div className="h-px bg-gradient-to-r from-transparent via-near-green/10 to-transparent blur-sm" />

      <GridPattern className="opacity-10" />

      <Container>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 items-center py-8 gap-6">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <VoidspaceLogo size="sm" animate={false} />
            <div>
              <span className="text-sm font-semibold text-gradient">Voidspace</span>
              <p className="text-[10px] text-text-muted">
                NEAR ecosystem intelligence, education & AI development
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Home
            </Link>
            <Link href="/opportunities" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Voids
            </Link>
            <Link href="/sanctum" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Sanctum
            </Link>
            <Link href="/observatory" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Observatory
            </Link>
            <Link href="/learn" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Learn
            </Link>
            <Link href="/pricing" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Pricing
            </Link>
          </div>

          {/* Competition badge */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] font-mono text-text-muted">
              &copy; {new Date().getFullYear()}
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-near-green/60 bg-near-green/10 px-2 py-0.5 rounded-full border border-near-green/20">
              NEARCON 2026
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
