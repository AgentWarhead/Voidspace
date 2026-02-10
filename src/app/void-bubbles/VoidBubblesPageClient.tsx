'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { VoidBubblesEngine } from '@/components/void-bubbles/VoidBubblesEngine';
import { GradientText } from '@/components/effects/GradientText';

export function VoidBubblesPageClient() {
  // Enable immersive mode — hides the site footer
  useEffect(() => {
    document.body.setAttribute('data-immersive', '');
    return () => { document.body.removeAttribute('data-immersive'); };
  }, []);

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
        <Container size="xl" className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-2xl">🫧</span>
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

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 shrink-0">
              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
              <span className="text-xs font-mono text-near-green uppercase tracking-wider">Live</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Visualization — takes all remaining space */}
      <section className="flex-1 min-h-0 py-1">
        <Container size="xl" className="h-full">
          <VoidBubblesEngine />
        </Container>
      </section>
    </div>
  );
}
