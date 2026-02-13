'use client';

import { BookOpen, Sparkles, Rocket } from 'lucide-react';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { TypewriterText } from '@/components/effects/TypewriterText';

const STATS = [
  { value: '20+', label: 'Contract Templates' },
  { value: '10+', label: 'Data Sources' },
  { value: '<1s', label: 'Finality' },
  { value: 'AI', label: 'Powered Briefs' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background effects */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.06) 0%, transparent 70%)',
        }}
      />
      <GridPattern className="opacity-20" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)',
        }}
      />

      <Container>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 mb-6">
            <BookOpen className="w-4 h-4 text-near-green" />
            <span className="text-xs font-mono text-near-green uppercase tracking-wider">Builder Academy</span>
          </div>

          {/* Title */}
          <GradientText as="h1" className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Master NEAR Protocol
          </GradientText>

          {/* Subtitle with typewriter */}
          <p className="text-text-secondary text-lg lg:text-xl mb-4 max-w-2xl mx-auto">
            Everything you need to go from zero to shipping on NEAR —
          </p>
          <div className="text-near-green font-mono text-sm lg:text-base mb-8 h-6">
            <TypewriterText
              lines={[
                'Learn Rust for smart contracts',
                'Build with AI in the Sanctum',
                'Ship with 20+ contract templates',
                'Find voids the ecosystem needs',
              ]}
            />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="#tracks"
              className="shimmer-btn text-background font-semibold px-6 py-3 rounded-lg text-sm inline-flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              Start Learning
            </a>
            <a
              href="#key-tech"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary rounded-lg transition-all text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Explore Technologies
            </a>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-near-green">{stat.value}</div>
                <div className="text-xs text-text-muted font-mono uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
