'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { VoidBubblesEngine } from '@/components/void-bubbles/VoidBubblesEngine';
import { HotStrip } from '@/components/void-bubbles/HotStrip';
import { GradientText } from '@/components/effects/GradientText';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';

interface EcosystemStats {
  totalTokens: number;
  totalMarketCap: number;
  totalVolume24h: number;
  totalLiquidity: number;
  gainersCount: number;
  losersCount: number;
  avgHealthScore: number;
}

function formatStatValue(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function VoidBubblesPageClient() {
  const [stats, setStats] = useState<EcosystemStats | null>(null);

  // Fetch aggregate stats for header
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/void-bubbles?period=1d');
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
        }
      } catch { /* silent */ }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Enable immersive mode — hides the site footer
  useEffect(() => {
    document.body.setAttribute('data-immersive', '');
    return () => { document.body.removeAttribute('data-immersive'); };
  }, []);

  return (
    <div className="flex flex-col overflow-hidden relative" style={{ height: '100dvh' }}>
      {/* ── Full-Viewport Voidspace Background ── */}
      <div className="absolute inset-0 z-0 bg-[#030508]">
        {/* Deep space gradient layers — enhanced intensity */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 15% 10%, rgba(0,236,151,0.10) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 85% 85%, rgba(0,212,255,0.08) 0%, transparent 50%),
              radial-gradient(ellipse 80% 80% at 50% 50%, rgba(157,78,221,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 70% 20%, rgba(255,51,102,0.04) 0%, transparent 50%)
            `,
          }}
        />
        {/* Animated nebula pulse — two layers */}
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            animationDuration: '8s',
            background: `
              radial-gradient(ellipse 60% 40% at 25% 70%, rgba(0,236,151,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 75% 25%, rgba(0,212,255,0.05) 0%, transparent 70%)
            `,
          }}
        />
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            animationDuration: '12s',
            animationDelay: '4s',
            background: `
              radial-gradient(ellipse 40% 60% at 80% 60%, rgba(157,78,221,0.04) 0%, transparent 60%),
              radial-gradient(ellipse 50% 30% at 20% 40%, rgba(0,236,151,0.03) 0%, transparent 60%)
            `,
          }}
        />
        {/* Star field — CSS dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8) 0%, transparent 100%),
              radial-gradient(1px 1px at 30% 65%, rgba(255,255,255,0.6) 0%, transparent 100%),
              radial-gradient(1px 1px at 55% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
              radial-gradient(1px 1px at 75% 45%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.6) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 20% 85%, rgba(0,236,151,0.9) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 65% 35%, rgba(0,212,255,0.8) 0%, transparent 100%),
              radial-gradient(1px 1px at 45% 55%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 85% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 5% 50%, rgba(255,255,255,0.3) 0%, transparent 100%)
            `,
          }}
        />
        {/* Finer star layer */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              radial-gradient(0.5px 0.5px at 12% 33%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 28% 72%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 42% 18%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 58% 88%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 72% 52%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 88% 28%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 35% 45%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 62% 68%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 95% 55%, white 0%, transparent 100%),
              radial-gradient(0.5px 0.5px at 8% 92%, white 0%, transparent 100%)
            `,
          }}
        />
        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,236,151,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,236,151,0.4) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Deep vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,5,8,0.8) 100%)',
          }}
        />
        {/* Horizontal scan line (slow sweep) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(0,236,151,0.2) 20%, rgba(0,212,255,0.25) 50%, rgba(0,236,151,0.2) 80%, transparent 100%)',
              animation: 'void-bg-scan 12s linear infinite',
            }}
          />
        </div>
      </div>

      {/* ── Premium Header Bar ── */}
      <section className="relative py-2 border-b border-white/[0.06] shrink-0 overflow-hidden z-10">
        <div
          className="absolute inset-0 bg-[#030508]/80 backdrop-blur-xl"
        />
        {/* Animated accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00EC97]/40 to-transparent" />
        
        {/* Scan line sweep across hero bar */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-near-green/20 to-transparent animate-scan" />
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Branding */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <VoidspaceLogo size="sm" animate={false} className="opacity-80" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-near-green rounded-full animate-pulse" />
              </div>
              <div>
                <GradientText as="h1" className="text-lg sm:text-xl font-bold tracking-tight leading-none">
                  Void Bubbles
                </GradientText>
                <p className="hidden sm:block text-[10px] text-text-muted font-mono mt-0.5">
                  NEAR Protocol Ecosystem Intelligence
                </p>
              </div>
            </div>

            {/* Center: Live Stats — desktop only */}
            {stats && (
              <div className="hidden md:flex items-center gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted/60">Total MCap</div>
                  <div className="text-sm font-bold font-mono text-white">{formatStatValue(stats.totalMarketCap)}</div>
                </div>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div className="text-center">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted/60">24h Volume</div>
                  <div className="text-sm font-bold font-mono text-white">{formatStatValue(stats.totalVolume24h)}</div>
                </div>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div className="text-center">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted/60">Liquidity</div>
                  <div className="text-sm font-bold font-mono text-white">{formatStatValue(stats.totalLiquidity)}</div>
                </div>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div className="text-center">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted/60">Tokens</div>
                  <div className="text-sm font-bold font-mono text-white">{stats.totalTokens}</div>
                </div>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div className="text-center">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted/60">Gainers/Losers</div>
                  <div className="text-sm font-bold font-mono">
                    <span className="text-emerald-400">{stats.gainersCount}</span>
                    <span className="text-text-muted mx-1">/</span>
                    <span className="text-rose-400">{stats.losersCount}</span>
                  </div>
                </div>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div className="text-center">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted/60">Avg Health</div>
                  <div className={`text-sm font-bold font-mono ${
                    stats.avgHealthScore > 60 ? 'text-emerald-400' : stats.avgHealthScore > 40 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {stats.avgHealthScore}/100
                  </div>
                </div>
              </div>
            )}

            {/* Right: Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 shrink-0">
              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse void-glow" />
              <span className="text-[10px] font-mono text-near-green uppercase tracking-widest font-semibold">Live</span>
            </div>
          </div>
        </Container>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00EC97]/20 to-transparent" />
      </section>

      {/* Hot Strip - Live Market Movers */}
      <div className="relative z-10">
        <HotStrip />
      </div>

      {/* Main Visualization — takes all remaining space, full width */}
      <section className="flex-1 min-h-0 relative z-10">
        <div className="h-full w-full">
          <VoidBubblesEngine />
        </div>
      </section>
    </div>
  );
}
