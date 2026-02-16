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
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-center py-6 sm:py-8 gap-4 sm:gap-6">
          {/* Logo + tagline */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <VoidspaceLogo size="sm" animate={false} />
            <div>
              <span className="text-sm font-semibold text-gradient">Voidspace</span>
              <p className="text-[10px] text-text-muted">
                NEAR ecosystem intelligence, education & AI development
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-2 min-h-[44px] flex items-center">
              Home
            </Link>
            <Link href="/opportunities" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-2 min-h-[44px] flex items-center">
              Voids
            </Link>
            <Link href="/sanctum" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-2 min-h-[44px] flex items-center">
              Sanctum
            </Link>
            <Link href="/observatory" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-2 min-h-[44px] flex items-center">
              Observatory
            </Link>
            <Link href="/learn" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-2 min-h-[44px] flex items-center">
              Learn
            </Link>
            <Link href="/pricing" className="text-xs text-text-muted hover:text-text-secondary transition-colors py-2 min-h-[44px] flex items-center">
              Pricing
            </Link>
          </div>

          {/* Contact + social */}
          <div className="flex items-center justify-center md:justify-end gap-3 flex-wrap">
            <a
              href="mailto:team@voidspace.io"
              className="text-[10px] text-text-muted hover:text-near-green transition-colors min-h-[44px] flex items-center active:scale-[0.97]"
              aria-label="Email Voidspace"
            >
              team@voidspace.io
            </a>
            <a
              href="https://x.com/voidspacenear"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.97]"
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

        {/* Copyright */}
        <div className="relative z-10 text-center pt-3">
          <p className="text-[10px] text-text-muted/40">
            &copy; 2026 Voidspace
          </p>
        </div>

        {/* Legal links */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 border-t border-white/[0.04]">
          <Link href="/legal/terms" className="text-[10px] text-text-muted/60 hover:text-near-green/80 transition-colors py-2 min-h-[44px] flex items-center">
            Terms
          </Link>
          <span className="text-text-muted/30 text-[10px]">·</span>
          <Link href="/legal/privacy" className="text-[10px] text-text-muted/60 hover:text-near-green/80 transition-colors py-2 min-h-[44px] flex items-center">
            Privacy
          </Link>
          <span className="text-text-muted/30 text-[10px]">·</span>
          <Link href="/legal/disclaimer" className="text-[10px] text-text-muted/60 hover:text-near-green/80 transition-colors py-2 min-h-[44px] flex items-center">
            Disclaimer
          </Link>
          <span className="text-text-muted/30 text-[10px]">·</span>
          <Link href="/legal/cookies" className="text-[10px] text-text-muted/60 hover:text-near-green/80 transition-colors py-2 min-h-[44px] flex items-center">
            Cookies
          </Link>
          <span className="text-text-muted/30 text-[10px]">·</span>
          <Link href="/legal/acceptable-use" className="text-[10px] text-text-muted/60 hover:text-near-green/80 transition-colors py-2 min-h-[44px] flex items-center">
            Acceptable Use
          </Link>
        </div>
      </Container>
    </footer>
  );
}
