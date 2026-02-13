'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { VoidBubblesEngine } from '@/components/void-bubbles/VoidBubblesEngine';
import { HotStrip } from '@/components/void-bubbles/HotStrip';
import { GradientText } from '@/components/effects/GradientText';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';
import { NAV_ITEMS } from '@/lib/constants';

interface EcosystemStats {
  totalTokens: number;
  totalMarketCap: number;
  totalVolume24h: number;
  totalLiquidity: number;
  gainersCount: number;
  losersCount: number;
  avgHealthScore: number;
  categoryBreakdown?: Record<string, number>;
  // Enhanced stats
  totalTxns24h?: number;
  buyPressure?: number;
  newPairsLast24h?: number;
  topGainerSymbol?: string | null;
  topGainerChange?: number;
  topLoserSymbol?: string | null;
  topLoserChange?: number;
  nearPrice?: number | null;
  nearPriceChange24h?: number | null;
  totalVolume1h?: number;
  dominanceTop5?: number;
}

function formatStatValue(n: number, opts?: { prefix?: string; suffix?: string; decimals?: number }): string {
  const prefix = opts?.prefix ?? '$';
  const suffix = opts?.suffix ?? '';
  const decimals = opts?.decimals;
  if (n >= 1_000_000_000) return `${prefix}${(n / 1_000_000_000).toFixed(decimals ?? 2)}B${suffix}`;
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(decimals ?? 1)}M${suffix}`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(decimals ?? 1)}K${suffix}`;
  return `${prefix}${n.toFixed(decimals ?? 0)}${suffix}`;
}

function formatCount(n: number): string {
  return formatStatValue(n, { prefix: '', decimals: 1 });
}

export function VoidBubblesPageClient() {
  const [stats, setStats] = useState<EcosystemStats | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const interval = setInterval(fetchStats, 120000); // 2 min refresh to reduce load
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
            {/* Left: Branding — clickable to home */}
            <Link href="/" className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-opacity">
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
            </Link>

            {/* Center spacer — stats moved to dedicated ribbon below */}
            <div className="flex-1" />

            {/* Right: Live indicator + hamburger */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-near-green/10 border border-near-green/20">
                <span className="w-2 h-2 rounded-full bg-near-green animate-pulse void-glow" />
                <span className="text-[10px] font-mono text-near-green uppercase tracking-widest font-semibold">Live</span>
              </div>
              {/* Hamburger menu — visible on mobile & desktop */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-text-secondary" /> : <Menu className="w-5 h-5 text-text-secondary" />}
              </button>
            </div>
          </div>
        </Container>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00EC97]/20 to-transparent" />
      </section>

      {/* ── Stats Ribbon ── */}
      <section className="relative shrink-0 z-10 border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-[#060a0f]/90 backdrop-blur-2xl" />
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00EC97]/15 to-transparent" />

        <Container size="xl" className="relative z-10">
          {/* Row 1: Primary stats */}
          <div className="py-2 flex items-center gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-none">
            {stats ? (
              <>
                {/* NEAR Price */}
                <div className="shrink-0 text-center min-w-[100px]">
                  <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-text-muted/50">NEAR</div>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm font-bold font-mono text-white">
                      {stats.nearPrice != null ? `$${stats.nearPrice.toFixed(2)}` : '—'}
                    </span>
                    {stats.nearPriceChange24h != null && (
                      <span className={`text-[10px] font-mono font-semibold ${stats.nearPriceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stats.nearPriceChange24h >= 0 ? '▲' : '▼'}{Math.abs(stats.nearPriceChange24h).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-px h-7 bg-white/[0.06] shrink-0" />

                {/* Total MCap */}
                <div className="shrink-0 text-center min-w-[90px]">
                  <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-text-muted/50">MCap</div>
                  <div className="text-sm font-bold font-mono text-white">{formatStatValue(stats.totalMarketCap)}</div>
                </div>
                <div className="w-px h-7 bg-white/[0.06] shrink-0" />

                {/* 24h Volume + 1h pulse */}
                <div className="shrink-0 text-center min-w-[100px]">
                  <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-text-muted/50">24h Vol</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm font-bold font-mono text-white">{formatStatValue(stats.totalVolume24h)}</span>
                    {(stats.totalVolume1h ?? 0) > 0 && (
                      <span className="text-[9px] font-mono text-cyan-400/70">
                        1h:{formatStatValue(stats.totalVolume1h ?? 0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-px h-7 bg-white/[0.06] shrink-0" />

                {/* Liquidity */}
                <div className="shrink-0 text-center min-w-[90px]">
                  <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-text-muted/50">Liquidity</div>
                  <div className="text-sm font-bold font-mono text-white">{formatStatValue(stats.totalLiquidity)}</div>
                </div>
              </>
            ) : (
              /* Skeleton shimmer */
              <>
                {[1,2,3,4].map(i => (
                  <div key={i} className="shrink-0 text-center min-w-[90px]">
                    <div className="h-2.5 w-12 mx-auto bg-white/[0.06] rounded animate-pulse mb-1.5" />
                    <div className="h-4 w-16 mx-auto bg-white/[0.08] rounded animate-pulse" />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Row 2: Secondary stats — hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 pb-2 overflow-x-auto scrollbar-none border-t border-white/[0.03] pt-1.5">
            {stats ? (
              <>
                {/* Tokens */}
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-text-muted/50">Tokens</span>
                  <span className="text-xs font-bold font-mono text-white">{stats.totalTokens}</span>
                </div>
                <div className="w-px h-4 bg-white/[0.04] shrink-0" />

                {/* Sentiment Bar */}
                <div className="shrink-0 flex items-center gap-2 min-w-[140px]">
                  <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-text-muted/50">Sentiment</span>
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-[9px] font-mono text-emerald-400 font-semibold">{stats.buyPressure ?? 50}%</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-rose-500/30 min-w-[50px]">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${stats.buyPressure ?? 50}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-rose-400 font-semibold">{100 - (stats.buyPressure ?? 50)}%</span>
                  </div>
                </div>
                <div className="w-px h-4 bg-white/[0.04] shrink-0" />

                {/* Gainers/Losers */}
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-text-muted/50">G/L</span>
                  <div className="flex items-center gap-0.5">
                    <div className="flex h-1.5 rounded-full overflow-hidden w-10">
                      <div className="bg-emerald-400" style={{ width: `${stats.totalTokens > 0 ? (stats.gainersCount / stats.totalTokens) * 100 : 50}%` }} />
                      <div className="bg-rose-500 flex-1" />
                    </div>
                    <span className="text-[10px] font-mono">
                      <span className="text-emerald-400 font-semibold">{stats.gainersCount}</span>
                      <span className="text-text-muted/40">/</span>
                      <span className="text-rose-400 font-semibold">{stats.losersCount}</span>
                    </span>
                  </div>
                </div>
                <div className="w-px h-4 bg-white/[0.04] shrink-0" />

                {/* Top Gainer */}
                {stats.topGainerSymbol && (
                  <>
                    <div className="shrink-0 flex items-center gap-1">
                      <span className="text-[10px]">🔥</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">{stats.topGainerSymbol}</span>
                      <span className="text-[9px] font-mono text-emerald-400/80">+{(stats.topGainerChange ?? 0).toFixed(1)}%</span>
                    </div>
                    <div className="w-px h-4 bg-white/[0.04] shrink-0" />
                  </>
                )}

                {/* Top Loser */}
                {stats.topLoserSymbol && (
                  <>
                    <div className="shrink-0 flex items-center gap-1">
                      <span className="text-[10px]">💀</span>
                      <span className="text-[10px] font-mono font-bold text-rose-400">{stats.topLoserSymbol}</span>
                      <span className="text-[9px] font-mono text-rose-400/80">{(stats.topLoserChange ?? 0).toFixed(1)}%</span>
                    </div>
                    <div className="w-px h-4 bg-white/[0.04] shrink-0" />
                  </>
                )}

                {/* New Pairs */}
                <div className="shrink-0 flex items-center gap-1">
                  <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-text-muted/50">New</span>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">{stats.newPairsLast24h ?? 0}</span>
                  {(stats.newPairsLast24h ?? 0) > 0 && (
                    <span className="text-[7px] font-mono font-bold bg-cyan-400/20 text-cyan-300 px-1 py-px rounded tracking-wider">NEW</span>
                  )}
                </div>
                <div className="w-px h-4 bg-white/[0.04] shrink-0" />

                {/* Top 5 Dominance */}
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-text-muted/50">Top5</span>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-purple-400/70 rounded-full transition-all duration-700" style={{ width: `${stats.dominanceTop5 ?? 0}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-purple-300">{stats.dominanceTop5 ?? 0}%</span>
                  </div>
                </div>
                <div className="w-px h-4 bg-white/[0.04] shrink-0" />

                {/* Txns 24h */}
                <div className="shrink-0 flex items-center gap-1">
                  <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-text-muted/50">Txns</span>
                  <span className="text-[10px] font-mono font-bold text-white">{formatCount(stats.totalTxns24h ?? 0)}</span>
                </div>
              </>
            ) : (
              /* Skeleton shimmer row 2 */
              <>
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-3 w-14 bg-white/[0.04] rounded animate-pulse shrink-0" />
                ))}
              </>
            )}
          </div>
        </Container>
      </section>

      {/* ── Navigation Menu Dropdown ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="relative z-30 overflow-hidden border-b border-white/[0.06]"
          >
            <div className="bg-[#060a0f]/95 backdrop-blur-2xl">
              <Container size="xl">
                <nav className="py-3 flex flex-wrap gap-1.5">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        item.href === '/observatory'
                          ? 'bg-near-green/15 text-near-green border border-near-green/25'
                          : 'text-text-muted hover:text-white hover:bg-white/[0.06] border border-transparent'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </Container>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
