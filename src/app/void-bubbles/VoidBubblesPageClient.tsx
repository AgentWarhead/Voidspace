'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { VoidBubblesEngine } from '@/components/void-bubbles/VoidBubblesEngine';
import { HotStrip } from '@/components/void-bubbles/HotStrip';
import { GradientText } from '@/components/effects/GradientText';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';

export function VoidBubblesPageClient() {
  // Enable immersive mode — hides the site footer
  useEffect(() => {
    document.body.setAttribute('data-immersive', '');
    return () => { document.body.removeAttribute('data-immersive'); };
  }, []);

  return (
    <div className="flex flex-col overflow-hidden relative" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* ── Full-Viewport Voidspace Background ── */}
      <div className="absolute inset-0 z-0 bg-[#04060b]">
        {/* Deep space gradient layers */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 20% 10%, rgba(0,236,151,0.06) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 80% 90%, rgba(0,212,255,0.05) 0%, transparent 50%),
              radial-gradient(ellipse 80% 80% at 50% 50%, rgba(157,78,221,0.04) 0%, transparent 60%),
              radial-gradient(circle at 50% 50%, rgba(0,236,151,0.02) 0%, transparent 80%)
            `,
          }}
        />
        {/* Animated nebula pulse */}
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            animationDuration: '8s',
            background: `
              radial-gradient(ellipse 60% 40% at 30% 70%, rgba(0,236,151,0.03) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 70% 30%, rgba(0,212,255,0.03) 0%, transparent 70%)
            `,
          }}
        />
        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,236,151,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,236,151,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4,6,11,0.7) 100%)',
          }}
        />
        {/* Horizontal scan line (slow sweep) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(0,236,151,0.15) 20%, rgba(0,212,255,0.2) 50%, rgba(0,236,151,0.15) 80%, transparent 100%)',
              animation: 'void-bg-scan 12s linear infinite',
            }}
          />
        </div>
      </div>

      {/* Compact Hero */}
      <section className="relative py-2 border-b border-border shrink-0 overflow-hidden z-10">
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

      {/* Hot Strip - Live Market Movers */}
      <div className="relative z-10">
        <HotStrip />
      </div>

      {/* Main Visualization — takes all remaining space */}
      <section className="flex-1 min-h-0 py-1 relative z-10">
        <Container size="xl" className="h-full">
          <VoidBubblesEngine />
        </Container>
      </section>
    </div>
  );
}
