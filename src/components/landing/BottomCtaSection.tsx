import Link from 'next/link';
import { ChevronRight, BookOpen, Search, Sparkles } from 'lucide-react';
import { GradientText } from '@/components/effects/GradientText';

export function BottomCtaSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-near-green/15">
      {/* Multi-layer glow background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,236,151,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(147,51,234,0.08) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,236,151,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,236,151,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      <div className="relative z-10 text-center py-10 sm:py-14 px-4 sm:px-6">
        <GradientText as="h2" className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          The Void Won&apos;t Fill Itself
        </GradientText>
        <p className="text-text-secondary mt-3 max-w-md mx-auto text-sm">
          Find your void. Generate a build plan. Ship it. Your next NEAR project starts in 60 seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <Link
            href="/opportunities"
            className="shimmer-btn text-background font-semibold px-5 sm:px-6 py-3 rounded-lg text-sm inline-flex items-center gap-2 active:scale-[0.98] hover:scale-[1.03] transition-transform duration-200 min-h-[44px]"
          >
            Find Your Void
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sanctum"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 active:scale-[0.98] hover:scale-[1.02] text-purple-300 rounded-lg transition-all duration-200 text-sm min-h-[44px]"
          >
            <Sparkles className="w-4 h-4" />
            Build Now
          </Link>
          <Link
            href="/void-bubbles"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 active:scale-[0.98] hover:scale-[1.02] text-cyan-300 rounded-lg transition-all duration-200 text-sm min-h-[44px]"
          >
            🫧 Void Bubbles
          </Link>
          <Link
            href="/observatory"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-surface border border-border hover:border-accent-cyan/30 active:scale-[0.98] hover:scale-[1.02] text-text-secondary hover:text-accent-cyan rounded-lg transition-all duration-200 text-sm min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            Observatory
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-surface border border-border hover:border-near-green/30 active:scale-[0.98] hover:scale-[1.02] text-text-secondary hover:text-near-green rounded-lg transition-all duration-200 text-sm min-h-[44px]"
          >
            <BookOpen className="w-4 h-4" />
            Learn
          </Link>
        </div>

        {/* Credibility badges */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <p className="text-xs text-text-muted font-mono mb-3">
            Built on <span className="text-purple-400">Claude AI</span> · <span className="text-accent-cyan">DexScreener</span> · <span className="text-near-green">NEAR Protocol</span>
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-near-green/5 border border-near-green/15">
            <span className="text-sm">🏆</span>
            <span className="text-xs font-semibold text-near-green/80 tracking-wide">
              AI-Native NEAR Ecosystem Intelligence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
