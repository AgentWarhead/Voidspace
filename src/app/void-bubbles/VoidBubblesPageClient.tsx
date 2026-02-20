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
import { useAchievementContext } from '@/contexts/AchievementContext';

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
  const { trackStat, setStat } = useAchievementContext();

  // Achievement: track page visit
  useEffect(() => {
    trackStat('bubblesVisits');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Achievement: track time spent on bubbles
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const minutes = Math.floor((Date.now() - startTime) / 60000);
      if (minutes > 0) setStat('bubblesMinutesSpent', minutes);
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/* ── Stats Ribbon — Premium Redesign ── */}
      <section className="relative shrink-0 z-10 border-b border-white/[0.08] overflow-hidden">
        {/* Deep dark base */}
        <div className="absolute inset-0 bg-[#050810]/95 backdrop-blur-2xl" />
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00EC97]/[0.03] via-transparent to-[#00D4FF]/[0.03]" />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00EC97]/50 to-transparent" />
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/20 to-transparent" />

        <Container size="xl" className="relative z-10 py-3">
          {/* ── Primary Stats Row ── */}
          <div className="flex items-stretch gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-0.5">
            {stats ? (
              <>
                {/* NEAR Price Card */}
                <div className="shrink-0 flex flex-col justify-center px-3 sm:px-4 py-2 rounded-xl border border-[#00EC97]/20 bg-[#00EC97]/[0.06] min-w-[110px]"
                  style={{ boxShadow: '0 0 12px rgba(0,236,151,0.08), inset 0 1px 0 rgba(0,236,151,0.12)' }}>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00EC97]/60 font-semibold mb-0.5">NEAR Price</div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-base sm:text-lg font-bold font-mono text-white leading-none">
                      {stats.nearPrice != null ? `$${stats.nearPrice.toFixed(2)}` : '—'}
                    </span>
                    {stats.nearPriceChange24h != null && (
                      <span className={`text-xs font-mono font-bold ${stats.nearPriceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stats.nearPriceChange24h >= 0 ? '▲' : '▼'}{Math.abs(stats.nearPriceChange24h).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Market Cap Card */}
                <div className="shrink-0 flex flex-col justify-center px-3 sm:px-4 py-2 rounded-xl border border-[#00D4FF]/15 bg-[#00D4FF]/[0.05] min-w-[110px]"
                  style={{ boxShadow: '0 0 12px rgba(0,212,255,0.06), inset 0 1px 0 rgba(0,212,255,0.10)' }}>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00D4FF]/60 font-semibold mb-0.5">Market Cap</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white leading-none">{formatStatValue(stats.totalMarketCap)}</div>
                </div>

                {/* 24h Volume Card */}
                <div className="shrink-0 flex flex-col justify-center px-3 sm:px-4 py-2 rounded-xl border border-violet-400/15 bg-violet-400/[0.05] min-w-[110px]"
                  style={{ boxShadow: '0 0 12px rgba(167,139,250,0.06), inset 0 1px 0 rgba(167,139,250,0.10)' }}>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-violet-400/60 font-semibold mb-0.5">24h Volume</div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-base sm:text-lg font-bold font-mono text-white leading-none">{formatStatValue(stats.totalVolume24h)}</span>
                    {(stats.totalVolume1h ?? 0) > 0 && (
                      <span className="text-[10px] font-mono text-cyan-400/70 font-semibold">
                        1h {formatStatValue(stats.totalVolume1h ?? 0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Liquidity Card */}
                <div className="shrink-0 flex flex-col justify-center px-3 sm:px-4 py-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] min-w-[110px]"
                  style={{ boxShadow: '0 0 12px rgba(251,191,36,0.05), inset 0 1px 0 rgba(251,191,36,0.08)' }}>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-400/60 font-semibold mb-0.5">Liquidity</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white leading-none">{formatStatValue(stats.totalLiquidity)}</div>
                </div>

                {/* ── Secondary stats: hidden on mobile, pill row on md+ ── */}
                <div className="hidden md:flex items-center gap-2 ml-1 flex-wrap">

                  {/* Tokens count */}
                  <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60 font-semibold">Tokens</span>
                    <span className="text-sm font-bold font-mono text-white">{stats.totalTokens}</span>
                  </div>

                  {/* Sentiment pill */}
                  <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] min-w-[160px]">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60 font-semibold shrink-0">Sentiment</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{stats.buyPressure ?? 50}%</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-rose-500/25 min-w-[40px]">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full transition-all duration-700"
                        style={{ width: `${stats.buyPressure ?? 50}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-rose-400 font-bold">{100 - (stats.buyPressure ?? 50)}%</span>
                  </div>

                  {/* Gainers / Losers */}
                  <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60 font-semibold">G/L</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">▲{stats.gainersCount}</span>
                    <span className="text-white/20 text-xs">|</span>
                    <span className="text-xs font-mono font-bold text-rose-400">▼{stats.losersCount}</span>
                  </div>

                  {/* Top Gainer badge */}
                  {stats.topGainerSymbol && (
                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06]">
                      <span className="text-sm">🔥</span>
                      <span className="text-xs font-mono font-bold text-emerald-300">{stats.topGainerSymbol}</span>
                      <span className="text-xs font-mono font-semibold text-emerald-400">+{(stats.topGainerChange ?? 0).toFixed(1)}%</span>
                    </div>
                  )}

                  {/* Top Loser badge */}
                  {stats.topLoserSymbol && (
                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06]">
                      <span className="text-sm">💀</span>
                      <span className="text-xs font-mono font-bold text-rose-300">{stats.topLoserSymbol}</span>
                      <span className="text-xs font-mono font-semibold text-rose-400">{(stats.topLoserChange ?? 0).toFixed(1)}%</span>
                    </div>
                  )}

                  {/* Top-5 Dominance */}
                  <div className="shrink-0 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-purple-400/15 bg-purple-400/[0.04]">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-purple-400/60 font-semibold">Top 5</span>
                    <div className="w-12 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-700" style={{ width: `${stats.dominanceTop5 ?? 0}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-300">{stats.dominanceTop5 ?? 0}%</span>
                  </div>

                  {/* Txns 24h */}
                  <div className="shrink-0 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60 font-semibold">Txns</span>
                    <span className="text-xs font-mono font-bold text-white">{formatCount(stats.totalTxns24h ?? 0)}</span>
                  </div>

                </div>
              </>
            ) : (
              /* Skeleton shimmer */
              <>
                {[1,2,3,4].map(i => (
                  <div key={i} className="shrink-0 rounded-xl border border-white/[0.06] bg-white/[0.03] min-w-[110px] h-[58px] animate-pulse" />
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
