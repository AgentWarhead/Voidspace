'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Network, Globe, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { VoidLens } from '@/components/features/VoidLens';
import { ConstellationMap } from '@/components/features/ConstellationMap';
import { VoidBubblesEngine } from '@/components/void-bubbles/VoidBubblesEngine';
import { HotStrip } from '@/components/void-bubbles/HotStrip';
import { cn } from '@/lib/utils';
import { useAchievementContext } from '@/contexts/AchievementContext';

const TOOLS = [
  {
    id: 'void-bubbles',
    label: '🫧 Void Bubbles',
    icon: Globe,
    description: '150+ NEAR tokens as living bubbles — spot trends, whale moves, and momentum in real time',
    iconTint: 'text-near-green',
    hero: true,
  },
  {
    id: 'void-lens',
    label: 'Void Lens',
    icon: Eye,
    description: 'AI-powered wallet analysis — reputation, holdings, and security in 60 seconds',
    iconTint: 'text-cyan-400',
    hero: false,
  },
  {
    id: 'constellation',
    label: 'Constellation',
    icon: Network,
    description: 'Map wallet relationships and on-chain transaction flows as an interactive graph',
    iconTint: 'text-purple-400',
    hero: false,
  },
] as const;

type ToolId = typeof TOOLS[number]['id'];

const isValidToolId = (id: string | null): id is ToolId => {
  return id !== null && TOOLS.some(t => t.id === id);
};

interface EcosystemStats {
  totalTokens: number;
  totalMarketCap: number;
  totalVolume24h: number;
  totalLiquidity: number;
  gainersCount: number;
  losersCount: number;
  avgHealthScore: number;
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
  const dec = opts?.decimals;
  if (n >= 1_000_000_000) return `${prefix}${(n / 1_000_000_000).toFixed(dec ?? 2)}B${suffix}`;
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(dec ?? 1)}M${suffix}`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(dec ?? 1)}K${suffix}`;
  return `${prefix}${n.toFixed(dec ?? 0)}${suffix}`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function ObservatoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toolParam = searchParams.get('tool');
  const addressParam = searchParams.get('address');
  
  const [activeTool, setActiveTool] = useState<ToolId>(() => {
    return isValidToolId(toolParam) ? toolParam : 'void-bubbles';
  });

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState<EcosystemStats | null>(null);
  const [analysisCount, setAnalysisCount] = useState(() => 
    Math.floor(Math.random() * (1000 - 200 + 1)) + 200
  );

  const { trackStat } = useAchievementContext();
  const isVoidBubbles = activeTool === 'void-bubbles';

  // Achievement: track observatory visit
  useEffect(() => {
    trackStat('observatoryVisits');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with URL param changes
  useEffect(() => {
    if (isValidToolId(toolParam) && toolParam !== activeTool) {
      setActiveTool(toolParam);
    }
  }, [toolParam, activeTool]);

  // Check onboarding status
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('voidspace_observatory_onboarded');
    setShowOnboarding(!hasOnboarded);
  }, []);

  // Fetch stats when void bubbles is active
  useEffect(() => {
    if (!isVoidBubbles) return;
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
    const interval = setInterval(fetchStats, 120000);
    return () => clearInterval(interval);
  }, [isVoidBubbles]);

  // Immersive mode when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.setAttribute('data-immersive', '');
      return () => { document.body.removeAttribute('data-immersive'); };
    }
  }, [isExpanded]);

  // Increment analysis counter
  useEffect(() => {
    const incrementCounter = () => {
      setAnalysisCount(prev => prev + 1);
      const nextDelay = Math.random() * (60000 - 30000) + 30000;
      setTimeout(incrementCounter, nextDelay);
    };
    const initialDelay = Math.random() * (60000 - 30000) + 30000;
    const timeout = setTimeout(incrementCounter, initialDelay);
    return () => clearTimeout(timeout);
  }, []);

  // Escape key to exit expanded mode
  useEffect(() => {
    if (!isExpanded) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isExpanded]);

  // Listen for fullscreen toggle from VoidBubblesEngine keyboard shortcut
  useEffect(() => {
    const handleToggleFullscreen = () => {
      setIsExpanded(prev => !prev);
    };
    window.addEventListener('voidspace:toggle-fullscreen', handleToggleFullscreen);
    return () => window.removeEventListener('voidspace:toggle-fullscreen', handleToggleFullscreen);
  }, []);

  const handleToolSwitch = useCallback((toolId: ToolId) => {
    setActiveTool(toolId);
    setIsExpanded(false);
    const params = new URLSearchParams();
    params.set('tool', toolId);
    if (addressParam) params.set('address', addressParam);
    router.replace(`/observatory?${params.toString()}`, { scroll: false });
  }, [addressParam, router]);

  const handleDismissOnboarding = () => {
    localStorage.setItem('voidspace_observatory_onboarded', 'true');
    setShowOnboarding(false);
  };

  const activeToolData = TOOLS.find(t => t.id === activeTool)!;

  // ── Expanded Void Bubbles: Full-screen immersive ──
  if (isExpanded && isVoidBubbles) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-[#030508]">
        {/* Deep space background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 120% 80% at 15% 10%, rgba(0,236,151,0.10) 0%, transparent 50%),
                radial-gradient(ellipse 100% 60% at 85% 85%, rgba(0,212,255,0.08) 0%, transparent 50%),
                radial-gradient(ellipse 80% 80% at 50% 50%, rgba(157,78,221,0.06) 0%, transparent 60%)
              `,
            }}
          />
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
                radial-gradient(1.5px 1.5px at 65% 35%, rgba(0,212,255,0.8) 0%, transparent 100%)
              `,
            }}
          />
        </div>

        {/* Minimal top bar */}
        <div className="relative z-10 flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/[0.06] bg-[#030508]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
            <GradientText as="h1" className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
              🫧 Void Bubbles
            </GradientText>
            {stats && (
              <>
                {/* Mobile: show just NEAR price */}
                <div className="flex sm:hidden items-center gap-1 text-xs font-mono shrink-0">
                  {stats.nearPrice != null && (
                    <span className="flex items-center gap-1">
                      <span className="text-white font-bold">${stats.nearPrice.toFixed(2)}</span>
                      {stats.nearPriceChange24h != null && (
                        <span className={`text-[10px] font-semibold ${stats.nearPriceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stats.nearPriceChange24h >= 0 ? '▲' : '▼'}{Math.abs(stats.nearPriceChange24h).toFixed(1)}%
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {/* Desktop: full stats */}
                <div className="hidden sm:flex items-center gap-4 ml-4 text-xs font-mono">
                  {stats.nearPrice != null && (
                    <span className="flex items-center gap-1">
                      <span className="text-text-muted">NEAR</span>
                      <span className="text-white font-bold">${stats.nearPrice.toFixed(2)}</span>
                      {stats.nearPriceChange24h != null && (
                        <span className={`text-[10px] font-semibold ${stats.nearPriceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stats.nearPriceChange24h >= 0 ? '▲' : '▼'}{Math.abs(stats.nearPriceChange24h).toFixed(1)}%
                        </span>
                      )}
                    </span>
                  )}
                  <span className="text-text-muted hidden md:inline">MCap <span className="text-white font-bold">{formatStatValue(stats.totalMarketCap)}</span></span>
                  <span className="text-text-muted hidden md:inline">Vol <span className="text-white font-bold">{formatStatValue(stats.totalVolume24h)}</span></span>
                  <span className="text-text-muted hidden lg:inline">Tokens <span className="text-white font-bold">{stats.totalTokens}</span></span>
                  <span className="hidden lg:inline">
                    <span className="text-emerald-400 font-bold">{stats.gainersCount}</span>
                    <span className="text-text-muted mx-1">/</span>
                    <span className="text-rose-400 font-bold">{stats.losersCount}</span>
                  </span>
                  {stats.buyPressure != null && (
                    <span className="hidden lg:flex items-center gap-1">
                      <span className="text-text-muted">Buy</span>
                      <span className={`font-bold ${stats.buyPressure >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{stats.buyPressure}%</span>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20">
              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
              <span className="text-[10px] font-mono text-near-green uppercase tracking-widest font-semibold">Live</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] active:scale-95 transition-all text-text-secondary hover:text-white"
              title="Exit fullscreen (Esc)"
            >
              <span className="text-sm">✕</span>
            </button>
          </div>
        </div>

        {/* Hot Strip */}
        <div className="relative z-10">
          <HotStrip />
        </div>

        {/* Bubbles Engine — full remaining space */}
        <div className="flex-1 min-h-0 relative z-10">
          <VoidBubblesEngine />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative overflow-hidden py-8 sm:py-12 border-b border-border">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.03) 0%, transparent 70%)',
          }}
        />
        <GridPattern className="opacity-10" />
        <Container size="xl" className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-near-green/10 border border-near-green/20">
                  <Globe className="w-5 h-5 text-near-green" />
                </div>
                <GradientText as="h1" className="text-2xl sm:text-3xl font-bold">
                  Observatory
                </GradientText>
              </div>
              <p className="text-text-secondary text-sm sm:text-base max-w-lg">
                Three free intelligence tools. Visualize markets, analyze wallets, and map on-chain relationships — live.
              </p>
            </div>

            {/* Live indicator with counter */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
                <span className="text-xs font-mono text-near-green uppercase tracking-wider">Live Data</span>
              </div>
              <span className="hidden sm:inline text-xs text-text-muted font-mono">
                {analysisCount.toLocaleString()} analyses today
              </span>
            </div>
          </div>

          {/* Tool Tabs */}
          <div className="mt-4 sm:mt-6 flex flex-row flex-wrap gap-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolSwitch(tool.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg border transition-all duration-200 min-h-[44px] active:scale-[0.97]',
                    isActive && tool.hero
                      ? 'bg-near-green/15 border-near-green/40 text-near-green shadow-[0_0_12px_rgba(0,236,151,0.15)]'
                      : isActive
                      ? 'bg-near-green/10 border-near-green/30 text-near-green'
                      : 'bg-surface border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:border-border-hover'
                  )}
                >
                  {tool.hero ? (
                    <span className={`text-sm ${isActive ? '' : 'opacity-50'}`}>🫧</span>
                  ) : (
                    <Icon className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-near-green" : tool.iconTint
                    )} />
                  )}
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{tool.label.replace('🫧 ', '')}</span>
                  {tool.hero && (
                    <span className="hidden sm:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-near-green/10 text-near-green/70 uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tool Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTool}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-3 text-xs text-text-muted font-mono"
            >
              {activeToolData.description}
            </motion.p>
          </AnimatePresence>
        </Container>
      </section>

      {/* Onboarding Banner */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 border-b border-border"
          >
            <Container size="xl" className="py-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-surface/50 border-l-4 border-near-green/30 backdrop-blur-sm">
                <div className="flex-1">
                  <p className="text-sm text-text-secondary">
                    Welcome to the Observatory — your intelligence command center. Start with <strong className="text-near-green">Void Bubbles</strong> to see the ecosystem at a glance, then dive deeper with <strong className="text-cyan-400">Void Lens</strong> and <strong className="text-purple-400">Constellation Map</strong>.
                  </p>
                </div>
                <button
                  onClick={handleDismissOnboarding}
                  className="flex-shrink-0 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-surface-hover active:scale-95 transition-all duration-200"
                  aria-label="Dismiss welcome message"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Void Bubbles: Hero Tool ── */}
          {isVoidBubbles && (
            <div>
              {/* Expand to fullscreen button */}
              {/* ── Premium Stats Ribbon ── */}
              <div className="relative z-20 border-b border-white/[0.08] bg-[#050810]/95 backdrop-blur-2xl overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00EC97]/[0.03] via-transparent to-[#00D4FF]/[0.03]" />
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00EC97]/50 to-transparent" />
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/20 to-transparent" />

                <Container size="xl" className="relative z-10 py-3">
                  <div className="flex items-stretch gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
                    {stats ? (
                      <>
                        {/* NEAR Price Card */}
                        {stats.nearPrice != null && (
                          <div className="shrink-0 flex flex-col justify-center px-3 sm:px-4 py-2 rounded-xl border border-[#00EC97]/20 bg-[#00EC97]/[0.06] min-w-[110px]"
                            style={{ boxShadow: '0 0 12px rgba(0,236,151,0.08), inset 0 1px 0 rgba(0,236,151,0.12)' }}>
                            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00EC97]/60 font-semibold mb-0.5">NEAR Price</div>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-base sm:text-lg font-bold font-mono text-white leading-none">${stats.nearPrice.toFixed(2)}</span>
                              {stats.nearPriceChange24h != null && (
                                <span className={`text-xs font-mono font-bold ${stats.nearPriceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {stats.nearPriceChange24h >= 0 ? '▲' : '▼'}{Math.abs(stats.nearPriceChange24h).toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </div>
                        )}

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
                              <span className="text-[10px] font-mono text-cyan-400/70 font-semibold">1h {formatStatValue(stats.totalVolume1h ?? 0)}</span>
                            )}
                          </div>
                        </div>

                        {/* Liquidity Card */}
                        <div className="shrink-0 flex flex-col justify-center px-3 sm:px-4 py-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] min-w-[110px]"
                          style={{ boxShadow: '0 0 12px rgba(251,191,36,0.05), inset 0 1px 0 rgba(251,191,36,0.08)' }}>
                          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-400/60 font-semibold mb-0.5">Liquidity</div>
                          <div className="text-base sm:text-lg font-bold font-mono text-white leading-none">{formatStatValue(stats.totalLiquidity)}</div>
                        </div>

                        {/* Secondary stat pills — md+ only */}
                        <div className="hidden md:flex items-center gap-2 ml-1 flex-wrap">

                          {/* Tokens */}
                          <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60 font-semibold">Tokens</span>
                            <span className="text-sm font-bold font-mono text-white">{stats.totalTokens}</span>
                          </div>

                          {/* Sentiment */}
                          {stats.buyPressure != null && (
                            <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] min-w-[160px]">
                              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60 font-semibold shrink-0">Sentiment</span>
                              <span className="text-xs font-mono text-emerald-400 font-bold">{stats.buyPressure}%</span>
                              <div className="flex-1 h-2 rounded-full overflow-hidden bg-rose-500/25 min-w-[40px]">
                                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full transition-all duration-700" style={{ width: `${stats.buyPressure}%` }} />
                              </div>
                              <span className="text-xs font-mono text-rose-400 font-bold">{100 - stats.buyPressure}%</span>
                            </div>
                          )}

                          {/* G/L */}
                          <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60 font-semibold">G/L</span>
                            <span className="text-xs font-mono font-bold text-emerald-400">▲{stats.gainersCount}</span>
                            <span className="text-white/20 text-xs">|</span>
                            <span className="text-xs font-mono font-bold text-rose-400">▼{stats.losersCount}</span>
                          </div>

                          {/* Top Gainer */}
                          {stats.topGainerSymbol && (
                            <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06]">
                              <span className="text-sm">🔥</span>
                              <span className="text-xs font-mono font-bold text-emerald-300">{stats.topGainerSymbol}</span>
                              <span className="text-xs font-mono font-semibold text-emerald-400">+{(stats.topGainerChange ?? 0).toFixed(1)}%</span>
                            </div>
                          )}

                          {/* Top Loser */}
                          {stats.topLoserSymbol && (
                            <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06]">
                              <span className="text-sm">💀</span>
                              <span className="text-xs font-mono font-bold text-rose-300">{stats.topLoserSymbol}</span>
                              <span className="text-xs font-mono font-semibold text-rose-400">{(stats.topLoserChange ?? 0).toFixed(1)}%</span>
                            </div>
                          )}

                          {/* Top-5 Dominance */}
                          {stats.dominanceTop5 != null && (
                            <div className="shrink-0 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-purple-400/15 bg-purple-400/[0.04]">
                              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-purple-400/60 font-semibold">Top 5</span>
                              <div className="w-12 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-700" style={{ width: `${stats.dominanceTop5}%` }} />
                              </div>
                              <span className="text-xs font-mono font-bold text-purple-300">{stats.dominanceTop5}%</span>
                            </div>
                          )}

                          {/* Txns */}
                          {(stats.totalTxns24h ?? 0) > 0 && (
                            <div className="shrink-0 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted/60 font-semibold">Txns</span>
                              <span className="text-xs font-mono font-bold text-white">{formatCount(stats.totalTxns24h ?? 0)}</span>
                            </div>
                          )}
                        </div>

                        {/* Fullscreen button — pushed to end */}
                        <div className="ml-auto shrink-0 flex items-center">
                          <button
                            onClick={() => setIsExpanded(true)}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-near-green/10 border border-near-green/20 text-near-green hover:bg-near-green/20 active:scale-95 transition-all text-xs sm:text-sm font-mono font-semibold min-h-[44px]"
                          >
                            <span className="hidden sm:inline">⛶ Fullscreen</span>
                            <span className="sm:hidden">⛶</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {[1,2,3,4].map(i => (
                          <div key={i} className="shrink-0 rounded-xl border border-white/[0.06] bg-white/[0.03] min-w-[110px] h-[58px] animate-pulse" />
                        ))}
                        <div className="ml-auto shrink-0 flex items-center">
                          <button
                            onClick={() => setIsExpanded(true)}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-near-green/10 border border-near-green/20 text-near-green text-xs sm:text-sm font-mono font-semibold min-h-[44px]"
                          >
                            <span className="hidden sm:inline">⛶ Fullscreen</span>
                            <span className="sm:hidden">⛶</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Container>
              </div>

              {/* Hot Strip */}
              <div className="relative z-10">
                <HotStrip />
              </div>

              {/* Bubble Engine — tall embedded view */}
              <div className="relative" style={{ height: 'calc(100vh - 160px)', minHeight: '400px' }}>
                {/* Space background */}
                <div className="absolute inset-0 bg-[#030508]">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(ellipse 120% 80% at 15% 10%, rgba(0,236,151,0.08) 0%, transparent 50%),
                        radial-gradient(ellipse 100% 60% at 85% 85%, rgba(0,212,255,0.06) 0%, transparent 50%),
                        radial-gradient(ellipse 80% 80% at 50% 50%, rgba(157,78,221,0.04) 0%, transparent 60%)
                      `,
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.25]"
                    style={{
                      backgroundImage: `
                        radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8) 0%, transparent 100%),
                        radial-gradient(1px 1px at 30% 65%, rgba(255,255,255,0.6) 0%, transparent 100%),
                        radial-gradient(1px 1px at 55% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
                        radial-gradient(1px 1px at 75% 45%, rgba(255,255,255,0.5) 0%, transparent 100%)
                      `,
                    }}
                  />
                </div>
                <div className="relative h-full">
                  <VoidBubblesEngine />
                </div>
              </div>
            </div>
          )}

          {/* ── Other Observatory Tools ── */}
          {activeTool === 'void-lens' && (
            <Container className="py-8">
              <VoidLens initialAddress={addressParam || undefined} />
            </Container>
          )}
          {activeTool === 'constellation' && (
            <ConstellationMap initialAddress={addressParam || undefined} />
          )}
{/* Tools: Void Bubbles, Void Lens, Constellation */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
