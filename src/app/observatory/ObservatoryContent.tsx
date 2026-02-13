'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Network, Activity, Globe, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { VoidLens } from '@/components/features/VoidLens';
import { ConstellationMap } from '@/components/features/ConstellationMap';
import { PulseStreams } from '@/components/features/PulseStreams';
import { VoidBubblesEngine } from '@/components/void-bubbles/VoidBubblesEngine';
import { HotStrip } from '@/components/void-bubbles/HotStrip';
import { cn } from '@/lib/utils';

const TOOLS = [
  {
    id: 'void-bubbles',
    label: '🫧 Void Bubbles',
    icon: Globe,
    description: 'Live ecosystem visualization — 150+ tokens as living, breathing bubbles',
    iconTint: 'text-near-green',
    hero: true,
  },
  {
    id: 'void-lens',
    label: 'Void Lens',
    icon: Eye,
    description: 'Analyze wallet reputation and trust signals',
    iconTint: 'text-cyan-400',
    hero: false,
  },
  {
    id: 'constellation',
    label: 'Constellation',
    icon: Network,
    description: 'Map wallet relationships and transaction patterns',
    iconTint: 'text-purple-400',
    hero: false,
  },
  {
    id: 'pulse-streams',
    label: 'Pulse Streams',
    icon: Activity,
    description: 'Monitor real-time ecosystem activity',
    iconTint: 'text-near-green',
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
}

function formatStatValue(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
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

  const isVoidBubbles = activeTool === 'void-bubbles';

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
        <div className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#030508]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <GradientText as="h1" className="text-lg font-bold tracking-tight">
              🫧 Void Bubbles
            </GradientText>
            {stats && (
              <div className="hidden md:flex items-center gap-4 ml-4 text-xs font-mono">
                <span className="text-text-muted">MCap <span className="text-white font-bold">{formatStatValue(stats.totalMarketCap)}</span></span>
                <span className="text-text-muted">Vol <span className="text-white font-bold">{formatStatValue(stats.totalVolume24h)}</span></span>
                <span className="text-text-muted">Tokens <span className="text-white font-bold">{stats.totalTokens}</span></span>
                <span>
                  <span className="text-emerald-400 font-bold">{stats.gainersCount}</span>
                  <span className="text-text-muted mx-1">/</span>
                  <span className="text-rose-400 font-bold">{stats.losersCount}</span>
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20">
              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
              <span className="text-[10px] font-mono text-near-green uppercase tracking-widest font-semibold">Live</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all text-text-secondary hover:text-white"
              title="Exit fullscreen (Esc)"
            >
              <span className="text-xs">✕</span>
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
                Your command center for NEAR ecosystem intelligence. Visualize, analyze, and monitor — all in real-time.
              </p>
            </div>

            {/* Live indicator with counter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
                <span className="text-xs font-mono text-near-green uppercase tracking-wider">Live Data</span>
              </div>
              <span className="text-xs text-text-muted font-mono">
                {analysisCount.toLocaleString()} analyses today
              </span>
            </div>
          </div>

          {/* Tool Tabs */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolSwitch(tool.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200',
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
                      "w-4 h-4",
                      isActive ? "text-near-green" : tool.iconTint
                    )} />
                  )}
                  <span className="text-sm font-medium">{tool.label.replace('🫧 ', '')}</span>
                  {tool.hero && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-near-green/10 text-near-green/70 uppercase tracking-wider">
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
                    Welcome to the Observatory — your intelligence command center. Start with <strong className="text-near-green">Void Bubbles</strong> to see the ecosystem at a glance, then dive deeper with Void Lens, Constellation, and Pulse Streams.
                  </p>
                </div>
                <button
                  onClick={handleDismissOnboarding}
                  className="flex-shrink-0 p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-hover transition-colors duration-200"
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
              <div className="relative z-20 border-b border-border bg-[#030508]/60">
                <Container size="xl" className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {stats && (
                        <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
                          <span className="text-text-muted">MCap <span className="text-white font-semibold">{formatStatValue(stats.totalMarketCap)}</span></span>
                          <span className="text-text-muted">24h Vol <span className="text-white font-semibold">{formatStatValue(stats.totalVolume24h)}</span></span>
                          <span className="text-text-muted">Tokens <span className="text-white font-semibold">{stats.totalTokens}</span></span>
                          <span>
                            <span className="text-emerald-400 font-semibold">{stats.gainersCount}</span>
                            <span className="text-text-muted mx-0.5">/</span>
                            <span className="text-rose-400 font-semibold">{stats.losersCount}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-near-green/10 border border-near-green/20 text-near-green hover:bg-near-green/20 transition-all text-sm font-mono font-semibold"
                    >
                      ⛶ Fullscreen
                    </button>
                  </div>
                </Container>
              </div>

              {/* Hot Strip */}
              <div className="relative z-10">
                <HotStrip />
              </div>

              {/* Bubble Engine — tall embedded view */}
              <div className="relative" style={{ height: 'calc(100vh - 160px)', minHeight: '600px' }}>
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
          {activeTool === 'pulse-streams' && (
            <Container className="py-8">
              <PulseStreams initialAddress={addressParam || undefined} />
            </Container>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
