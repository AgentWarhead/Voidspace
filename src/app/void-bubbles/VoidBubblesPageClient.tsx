'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { VoidBubblesEngine } from '@/components/void-bubbles/VoidBubblesEngine';
import { GradientText } from '@/components/effects/GradientText';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';

export function VoidBubblesPageClient() {
  const [showFeatureBanner, setShowFeatureBanner] = useState(true);

  // Enable immersive mode — hides the site footer
  useEffect(() => {
    document.body.setAttribute('data-immersive', '');
    return () => { document.body.removeAttribute('data-immersive'); };
  }, []);

  // Check localStorage for banner dismissal
  useEffect(() => {
    const bannerDismissed = localStorage.getItem('voidspace-feature-banner-dismissed');
    if (bannerDismissed === 'true') {
      setShowFeatureBanner(false);
    }
  }, []);

  const handleDismissBanner = () => {
    localStorage.setItem('voidspace-feature-banner-dismissed', 'true');
    setShowFeatureBanner(false);
  };

  return (
    <div className="flex flex-col bg-background overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Compact Hero */}
      <section className="relative py-2 border-b border-border shrink-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.04) 0%, transparent 70%)',
          }}
        />
        
        {/* Scan line sweep across hero bar */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-near-green/20 to-transparent animate-scan" />
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <VoidspaceLogo size="sm" animate={false} className="opacity-80" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-near-green rounded-full animate-pulse" />
              </div>
              <GradientText as="h1" className="text-xl sm:text-2xl font-bold tracking-tight">
                Void Bubbles
              </GradientText>
              <span className="hidden sm:inline text-text-muted text-xs">—</span>
              <p className="hidden sm:inline text-text-secondary text-xs max-w-md truncate">
                Live NEAR ecosystem visualization · size = market cap · color = momentum · AI health scores
              </p>
            </div>

            {/* Live indicator with void-glow effect */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 shrink-0">
              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse void-glow" />
              <span className="text-xs font-mono text-near-green uppercase tracking-wider">Live</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Discovery Banner */}
      {showFeatureBanner && (
        <section className="shrink-0 border-b border-border">
          <Container size="xl" className="py-2">
            <div className="relative overflow-hidden rounded-lg border border-near-green/20 bg-near-green/5 px-4 py-3">
              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-near-green/20 via-accent-cyan/20 to-near-green/20 animate-pulse" 
                   style={{ 
                     mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                     maskComposite: 'xor' 
                   }} 
              />
              
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-xs text-text-secondary font-mono">
                  <span className="hidden sm:inline">💡 Quick Tips:</span>
                  <span className="flex items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1">
                      <span>🟢🔴</span>
                      <span className="hidden sm:inline">Green = up, Red = down</span>
                      <span className="sm:hidden">Up/Down</span>
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <span>🔍</span>
                      <span className="hidden sm:inline">X-Ray for risk</span>
                      <span className="sm:hidden">X-Ray</span>
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <span>🔊</span>
                      <span className="hidden sm:inline">Turn on sound</span>
                      <span className="sm:hidden">Sound</span>
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <span>🐋</span>
                      <span className="hidden sm:inline">Watch for whales</span>
                      <span className="sm:hidden">Whales</span>
                    </span>
                  </span>
                </div>
                
                <button
                  onClick={handleDismissBanner}
                  className="p-1 rounded-md hover:bg-surface-hover transition-colors"
                  aria-label="Dismiss feature tips"
                >
                  <X className="w-3 h-3 text-text-muted hover:text-text-secondary" />
                </button>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Main Visualization — takes all remaining space */}
      <section className="flex-1 min-h-0 py-1">
        <Container size="xl" className="h-full">
          <VoidBubblesEngine />
        </Container>
      </section>
    </div>
  );
}
