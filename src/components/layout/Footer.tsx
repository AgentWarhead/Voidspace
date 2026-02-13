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
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <VoidspaceLogo size="sm" animate={false} />
            <div>
              <span className="text-sm font-semibold text-gradient">Voidspace</span>
              <p className="text-[10px] text-text-muted">
                NEAR ecosystem intelligence, education & AI development
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-1">
              Home
            </Link>
            <Link href="/opportunities" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-1">
              Voids
            </Link>
            <Link href="/sanctum" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-1">
              Sanctum
            </Link>
            <Link href="/observatory" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-1">
              Observatory
            </Link>
            <Link href="/learn" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-1">
              Learn
            </Link>
            <Link href="/pricing" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-1">
              Pricing
            </Link>
          </div>

          {/* Competition badge + social */}
          <div className="flex items-center justify-center sm:justify-end gap-3">
            <a
              href="https://x.com/voidspacenear"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Follow Voidspace on X"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
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
