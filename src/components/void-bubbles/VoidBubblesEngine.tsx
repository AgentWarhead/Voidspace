'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, RotateCcw, Clock, Activity, X, Copy, ExternalLink,
  TrendingUp, TrendingDown, Search, Settings, Brain, Link, Keyboard,
} from 'lucide-react';
// These icons exist but TS types are broken in v0.453 RSC mode
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { EyeOff, Camera, Volume2, VolumeX, Share2, AlertTriangle } = require('lucide-react') as Record<string, React.ComponentType<{ className?: string }>>;

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
// import { FeatureTip } from '@/components/ui/FeatureTip';
import { VoidspaceLogo } from '@/components/brand/VoidspaceLogo';
import { cn } from '@/lib/utils';

// ────────────────────── Types ──────────────────────

interface VoidBubbleToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  category: string;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  detectedAt: string;
  // New fields for timeframe support
  priceChange1h: number;
  priceChange6h: number;
  dexScreenerUrl?: string;
  refFinanceUrl?: string;
  contractAddress: string;
  // Social links (legacy)
  website?: string;
  twitter?: string;
  telegram?: string;
  // Rich DexScreener data
  imageUrl?: string;
  socials?: { url: string; type: string }[];
  websites?: { url: string; label: string }[];
  txns24h?: { buys: number; sells: number };
  txns1h?: { buys: number; sells: number };
  txns6h?: { buys: number; sells: number };
  volume1h?: number;
  volume6h?: number;
  dexId?: string;
  pairCreatedAt?: string;
  pairAddress?: string;
  quoteToken?: string;
  fdv?: number;
  priceChange5m?: number;
}

interface BubbleNode extends d3.SimulationNodeDatum {
  id: string;
  token: VoidBubbleToken;
  radius: number;
  color: string;
  glowColor: string;
  targetRadius: number;
}

type FilterCategory = 'all' | string;

// ────────────────────── Constants ──────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  DeFi: '#00EC97',        // Voidspace near-green (flagship)
  Stablecoin: '#00D4FF',  // Voidspace cyan
  Infrastructure: '#9D4EDD', // Voidspace purple  
  Meme: '#FF3366',        // Hot pink-red (was #FF6B6B, too muted)
  Gaming: '#FFB800',      // Bold gold (was #FFA502, too orange-muted)
  NFT: '#FF69B4',         // Keep hot pink
  'Move-to-Earn': '#00E5CC', // Bright teal (was #00CED1)
  AI: '#8B5CF6',          // Vivid violet (was #7B68EE, too muted)
  Other: '#64748B',       // Slate gray (was #888888)
};

const RISK_COLORS = {
  low: '#00EC97',
  medium: '#FFA502',
  high: '#FF6B6B',
  critical: '#FF4757',
};

// Enhanced X-Ray Mode health-based colors
const HEALTH_COLORS = {
  healthy: '#00FF88',    // Bright vivid GREEN for health > 70
  medium: '#FFAA00',     // YELLOW/AMBER for health 40-70  
  unhealthy: '#FF2244',  // Bright RED for health < 40
};

const getHealthStatus = (healthScore: number) => {
  if (healthScore > 70) return 'healthy';
  if (healthScore >= 40) return 'medium';
  return 'unhealthy';
};

// Health icons removed from bubbles — health data displayed in popup card only

const getSupplyConcentration = (token: VoidBubbleToken) => {
  if (!token.liquidity || !token.marketCap) return 'Unknown';
  const ratio = token.liquidity / token.marketCap;
  if (ratio > 0.3) return 'Low';
  if (ratio > 0.1) return 'Medium';
  return 'High';
};

// ────────────────────── Sonic Engine (Web Audio API) ──────────────────────

class SonicEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;

  enable() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    this.enabled = true;
  }

  disable() { this.enabled = false; }
  isEnabled() { return this.enabled; }

  playTone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    gain.gain.setValueAtTime(Math.min(volume, 0.15), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  playPump(intensity: number) {
    const freq = 400 + intensity * 400;
    this.playTone(freq, 0.3, 0.08 + intensity * 0.05, 'sine');
  }

  playDump(intensity: number) {
    const freq = 200 - intensity * 80;
    this.playTone(Math.max(freq, 80), 0.5, 0.06 + intensity * 0.04, 'triangle');
  }

  playWhaleAlert() {
    this.playTone(600, 0.1, 0.12, 'square');
    setTimeout(() => this.playTone(800, 0.15, 0.1, 'square'), 120);
    setTimeout(() => this.playTone(1000, 0.2, 0.08, 'sine'), 260);
  }

  playRisk() {
    this.playTone(150, 0.8, 0.06, 'sawtooth');
  }
}

// ────────────────────── Utility ──────────────────────

function formatPrice(n: number): string {
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(8)}`;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

// ────────────────────── Component ──────────────────────

export function VoidBubblesEngine() {
  // State
  const [tokens, setTokens] = useState<VoidBubbleToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<VoidBubbleToken | null>(null);
  const [hoveredToken, setHoveredToken] = useState<VoidBubbleToken | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [xrayMode, setXrayMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [highlightMode, setHighlightMode] = useState<'none' | 'gainers' | 'losers'>('none');
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [, setLastUpdated] = useState<string>('');
  
  // New state for the enhanced features
  const [period, setPeriod] = useState<'1h' | '4h' | '1d' | '7d' | '30d'>('1d');
  const [sizeMetric, setSizeMetric] = useState<'marketCap' | 'volume' | 'performance'>('marketCap');
  const [bubbleContent, setBubbleContent] = useState<'performance' | 'price' | 'volume' | 'marketCap'>('performance');
  
  // Power Bar state - mobile panel
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  
  // Spotlight Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // **NEW: Popup Card state - floating overlay**
  const [popupCard, setPopupCard] = useState<{ token: VoidBubbleToken } | null>(null);
  
  // Top Movers panel visibility
  const [showMovers, setShowMovers] = useState(true);
  
  // Keyboard shortcuts tooltip
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  // Pulse Mode state - volume-based pulsing (always enabled for now)
  const pulseMode = true;
  
  // Click timing for double-click detection
  // clickTimeouts removed — single click now opens popup immediately

  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<BubbleNode, undefined> | null>(null);
  const nodesRef = useRef<BubbleNode[]>([]);
  const sonicRef = useRef(new SonicEngine());
  const animFrameRef = useRef<number | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const injectedStylesRef = useRef<HTMLStyleElement[]>([]);

  // Categories from data
  const categories = useMemo(() => {
    const cats = new Set(tokens.map(t => t.category));
    return ['all', ...Array.from(cats).sort()];
  }, [tokens]);

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    if (filterCategory === 'all') return tokens;
    return tokens.filter(t => t.category === filterCategory);
  }, [tokens, filterCategory]);

  // ────────────────────── Data Fetching ──────────────────────

  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch(`/api/void-bubbles?period=${period}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTokens(data.tokens || []);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      setError(null);
    } catch {
      setError('Failed to load NEAR ecosystem data');
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Track whether this is the initial load vs a refresh
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    fetchTokens().then(() => { isInitialLoadRef.current = false; });
    const interval = setInterval(fetchTokens, 120000); // Refresh every 120s (was 60s — reduces flashing)
    return () => clearInterval(interval);
  }, [fetchTokens, period]);

  // ────────────────────── AI Intelligence & Popup ──────────────────────

  // AI Intelligence Brief Generator
  const generateIntelBrief = useCallback((token: VoidBubbleToken) => {
    const currentChange = getCurrentPriceChange(token);
    const volLiqRatio = token.liquidity > 0 ? token.volume24h / token.liquidity : 0;
    const healthStatus = getHealthStatus(token.healthScore);
    
    // High health + high volume
    if (token.healthScore > 70 && volLiqRatio > 0.2) {
      return "Strong fundamentals with healthy trading activity. Liquidity depth suggests institutional interest. Low risk profile.";
    }
    
    // Low health + dropping price
    if (token.healthScore < 40 && currentChange < -10) {
      return "⚠️ Warning signals detected. Price declining across all timeframes with deteriorating health score. Multiple risk factors flagged — proceed with extreme caution.";
    }
    
    // Stablecoin depeg detection
    if (token.category === 'Stablecoin' && (token.price < 0.99 || token.price > 1.01)) {
      return `⚠️ Stablecoin trading ${token.price < 1 ? 'below' : 'above'} peg at ${formatPrice(token.price)}. Health score ${healthStatus === 'unhealthy' ? 'critical' : 'flagged'}. Monitor closely for recovery or further deterioration.`;
    }
    
    // High momentum
    if (Math.abs(currentChange) > 15) {
      return currentChange > 0 
        ? "🚀 Strong positive momentum detected. Trading volume elevated with healthy price action. Consider profit-taking levels."
        : "📉 Significant downward pressure detected. Volume suggests selling pressure. Risk management advised.";
    }
    
    // Low liquidity risk
    if (volLiqRatio < 0.05 && token.marketCap > 1000000) {
      return "⚠️ Low liquidity relative to market cap. Large trades may cause significant slippage. Entry/exit timing critical.";
    }
    
    // Whale activity
    if (token.volume24h > token.liquidity * 2) {
      return "🐋 Unusual whale activity detected. Trading volume significantly exceeds normal liquidity patterns. Monitor for large position movements.";
    }
    
    // Default assessment
    if (healthStatus === 'healthy') {
      return "Stable token with balanced risk profile. Trading within normal parameters with adequate liquidity support.";
    } else if (healthStatus === 'medium') {
      return "Mixed signals present. Some risk factors identified but overall stability maintained. Monitor key metrics closely.";
    } else {
      return "⚠️ Multiple risk factors detected. Exercise extreme caution. Consider position sizing and stop-loss strategies.";
    }
  }, []);

  // Get current period's price change for a token
  const getCurrentPriceChange = useCallback((token: VoidBubbleToken) => {
    switch (period) {
      case '1h': return token.priceChange1h;
      case '4h': return token.priceChange6h; // closest available
      case '1d': return token.priceChange24h;
      case '7d':
      case '30d':
        // For 7d/30d, the API already simulates this in priceChange24h when period is set
        return token.priceChange24h;
      default: return token.priceChange24h;
    }
  }, [period]);

  // **NEW: Popup Card Handler** - shows floating card instead of expanding bubble
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleShowPopup = useCallback((tokenId: string, _event?: { clientX: number; clientY: number }) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;
    setPopupCard({ token });
  }, [tokens]);

  // **NEW: Premium Popup Card Component**
  const renderPopupCard = () => {
    if (!popupCard) return null;

    const { token } = popupCard;
    const currentChange = getCurrentPriceChange(token);
    const healthStatus = getHealthStatus(token.healthScore);
    const intelBrief = generateIntelBrief(token);
    const supplyConcentration = getSupplyConcentration(token);
    const volLiqRatio = token.liquidity > 0 ? token.volume24h / token.liquidity : 0;
    const isPositive = currentChange >= 0;
    const accentColor = isPositive ? '#00EC97' : '#FF3366';
    const totalTxns24h = token.txns24h ? token.txns24h.buys + token.txns24h.sells : 0;
    const buyRatio = token.txns24h && totalTxns24h > 0 ? (token.txns24h.buys / totalTxns24h) * 100 : 50;

    return (
      <AnimatePresence>
        <motion.div
          key={token.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 flex flex-col"
          onClick={(e) => e.stopPropagation()}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0, right: 0.5 }}
          onDragEnd={(_e, info) => { if (info.offset.x > 100) setPopupCard(null); }}
        >
          <div className="h-full flex flex-col bg-[#060a0f]/95 backdrop-blur-2xl border-l border-white/[0.06] shadow-2xl shadow-black/60 overflow-hidden">
            <div className="h-[2px] shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, ${accentColor}40, transparent)` }} />
            
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Header */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight">{token.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-mono text-text-muted">{token.symbol}</span>
                        {token.quoteToken && <span className="text-[10px] font-mono text-text-muted/50">/ {token.quoteToken}</span>}
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium border"
                          style={{ backgroundColor: `${CATEGORY_COLORS[token.category] || '#64748B'}12`, color: CATEGORY_COLORS[token.category] || '#64748B', borderColor: `${CATEGORY_COLORS[token.category] || '#64748B'}25` }}>
                          {token.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setPopupCard(null)} className="p-2 rounded-xl hover:bg-white/[0.06] text-text-muted hover:text-white transition-all shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-3xl font-bold text-white font-mono tracking-tight">{formatPrice(token.price)}</span>
                  <span className={`text-base font-bold font-mono ${isPositive ? 'text-[#00EC97]' : 'text-[#FF3366]'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(currentChange).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Multi-timeframe */}
              <div className="px-5 pb-3">
                <div className="flex gap-1">
                  {[
                    { label: '5M', value: token.priceChange5m ?? 0 },
                    { label: '1H', value: token.priceChange1h },
                    { label: '6H', value: token.priceChange6h },
                    { label: '24H', value: token.priceChange24h },
                  ].map((tf) => (
                    <div key={tf.label} className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-mono font-bold border ${
                      tf.value >= 0 ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' : 'bg-rose-500/10 border-rose-500/15 text-rose-400'
                    }`}>
                      <div className="text-[8px] text-text-muted/50 mb-0.5">{tf.label}</div>
                      {tf.value >= 0 ? '+' : ''}{tf.value.toFixed(1)}%
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Market Data */}
              <div className="px-5 py-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Market Cap', value: formatCompact(token.marketCap) },
                    { label: '24h Volume', value: formatCompact(token.volume24h) },
                    { label: 'Liquidity', value: formatCompact(token.liquidity) },
                    { label: 'FDV', value: token.fdv ? formatCompact(token.fdv) : '—' },
                    { label: 'Vol/Liq', value: volLiqRatio.toFixed(2) },
                    { label: 'Supply Conc.', value: supplyConcentration },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/[0.02] rounded-lg px-2.5 py-2 border border-white/[0.03]">
                      <div className="text-[8px] font-mono uppercase tracking-wider text-text-muted/50">{item.label}</div>
                      <div className="text-[13px] font-bold font-mono text-white mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Transactions — DexScreener style */}
              {token.txns24h && (
                <div className="px-5 py-3">
                  <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-text-muted/50 mb-2">24h Transactions</div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-center"><div className="text-[9px] text-text-muted/50">Txns</div><div className="text-sm font-bold font-mono text-white">{totalTxns24h.toLocaleString()}</div></div>
                    <div className="text-center"><div className="text-[9px] text-emerald-400/60">Buys</div><div className="text-sm font-bold font-mono text-emerald-400">{token.txns24h.buys.toLocaleString()}</div></div>
                    <div className="text-center"><div className="text-[9px] text-rose-400/60">Sells</div><div className="text-sm font-bold font-mono text-rose-400">{token.txns24h.sells.toLocaleString()}</div></div>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 transition-all" style={{ width: `${buyRatio}%` }} />
                    <div className="bg-rose-500 transition-all" style={{ width: `${100 - buyRatio}%` }} />
                  </div>
                  {(token.txns1h || token.txns6h) && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {token.txns1h && (
                        <div className="bg-white/[0.02] rounded-lg px-2 py-1.5 border border-white/[0.03] text-center">
                          <div className="text-[8px] text-text-muted/50">1h B/S</div>
                          <div className="text-[11px] font-mono"><span className="text-emerald-400">{token.txns1h.buys}</span><span className="text-text-muted mx-1">/</span><span className="text-rose-400">{token.txns1h.sells}</span></div>
                        </div>
                      )}
                      {token.txns6h && (
                        <div className="bg-white/[0.02] rounded-lg px-2 py-1.5 border border-white/[0.03] text-center">
                          <div className="text-[8px] text-text-muted/50">6h B/S</div>
                          <div className="text-[11px] font-mono"><span className="text-emerald-400">{token.txns6h.buys}</span><span className="text-text-muted mx-1">/</span><span className="text-rose-400">{token.txns6h.sells}</span></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Health Score */}
              <div className="px-5 py-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Health Score</span>
                  <span className={cn("text-sm font-bold font-mono", { 'text-emerald-400': healthStatus === 'healthy', 'text-amber-400': healthStatus === 'medium', 'text-rose-400': healthStatus === 'unhealthy' })}>{token.healthScore}/100</span>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
                  <div className={cn("h-2.5 rounded-full transition-all duration-500", { 'bg-gradient-to-r from-emerald-600 to-emerald-400': healthStatus === 'healthy', 'bg-gradient-to-r from-amber-600 to-amber-400': healthStatus === 'medium', 'bg-gradient-to-r from-rose-600 to-rose-400': healthStatus === 'unhealthy' })} style={{ width: `${token.healthScore}%` }} />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${token.riskLevel === 'low' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : token.riskLevel === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>{token.riskLevel.toUpperCase()} RISK</span>
                  {token.riskFactors.filter(f => f !== 'No significant risk factors detected').map((factor, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-text-muted">{factor}</span>
                  ))}
                </div>
              </div>

              <div className="h-px mx-5 bg-gradient-to-r from-transparent via-[#00EC97]/15 to-transparent" />

              {/* AI Intel */}
              <div className="px-5 py-3">
                <div className="rounded-xl p-3.5 border border-[#00EC97]/15 bg-[#00EC97]/[0.03]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Brain className="w-4 h-4 text-[#00EC97]" />
                    <span className="text-[11px] font-bold text-[#00EC97] tracking-wide">AI Intelligence Brief</span>
                  </div>
                  <p className="text-[12px] text-text-secondary leading-relaxed">{intelBrief}</p>
                </div>
              </div>

              <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Links */}
              <div className="px-5 py-3">
                <div className="flex gap-2 mb-2">
                  <button onClick={() => window.open(`https://dexscreener.com/near/${token.contractAddress}`, '_blank')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold bg-[#00EC97]/12 border border-[#00EC97]/20 text-[#00EC97] hover:bg-[#00EC97]/20 transition-all">
                    <ExternalLink className="w-3.5 h-3.5" /> DexScreener
                  </button>
                  <button onClick={() => window.open(`https://app.ref.finance/#near|${token.contractAddress}`, '_blank')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold bg-white/[0.03] border border-white/[0.06] text-text-secondary hover:bg-white/[0.06] hover:text-white transition-all">
                    <ExternalLink className="w-3.5 h-3.5" /> Ref Finance
                  </button>
                </div>
                {token.socials && token.socials.length > 0 && (
                  <div className="flex gap-1.5 mb-2">
                    {token.socials.map((social, i) => (
                      <button key={i} onClick={() => window.open(social.url, '_blank')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-medium text-text-muted hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] transition-all capitalize">
                        {social.type === 'twitter' ? '𝕏' : social.type === 'telegram' ? '✈️' : social.type === 'discord' ? '💬' : '🔗'} {social.type}
                      </button>
                    ))}
                  </div>
                )}
                {token.websites && token.websites.length > 0 && (
                  <div className="flex gap-1.5">
                    {token.websites.slice(0, 3).map((site, i) => (
                      <button key={i} onClick={() => window.open(site.url, '_blank')} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] text-text-muted hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all">
                        <Link className="w-3 h-3" /> {site.label}
                      </button>
                    ))}
                  </div>
                )}
                {!token.socials?.length && (token.website || token.twitter) && (
                  <div className="flex gap-2">
                    {token.website && <button onClick={() => window.open(token.website, '_blank')} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] text-text-muted hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all"><Link className="w-3 h-3" /> Website</button>}
                    {token.twitter && <button onClick={() => window.open(token.twitter, '_blank')} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] text-text-muted hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all">𝕏 Twitter</button>}
                  </div>
                )}
              </div>

              <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Contract Info */}
              <div className="px-5 py-3 space-y-2">
                <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-text-muted/50 mb-1">Contract Info</div>
                {token.pairCreatedAt && (
                  <div className="flex items-center justify-between"><span className="text-[11px] text-text-muted">Pair Created</span><span className="text-[11px] font-mono text-text-secondary">{formatDate(token.pairCreatedAt)}</span></div>
                )}
                {token.dexId && (
                  <div className="flex items-center justify-between"><span className="text-[11px] text-text-muted">DEX</span><span className="text-[11px] font-mono text-[#00EC97]/70 capitalize">{token.dexId.replace('-', ' ')}</span></div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Contract</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-text-secondary">{token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-6)}</span>
                    <button onClick={() => copyToClipboard(token.contractAddress)} className="p-1 rounded-md hover:bg-white/[0.06] text-text-muted hover:text-[#00EC97] transition-all"><Copy className="w-3 h-3" /></button>
                    <button onClick={() => window.open(`https://nearblocks.io/address/${token.contractAddress}`, '_blank')} className="p-1 rounded-md hover:bg-white/[0.06] text-text-muted hover:text-white transition-all" title="NearBlocks"><ExternalLink className="w-3 h-3" /></button>
                  </div>
                </div>
                <button onClick={() => window.open(`https://x.com/search?q=$${token.symbol}+NEAR&src=typed_query&f=live`, '_blank')} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-medium text-text-muted hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all mt-2">
                  𝕏 Search on Twitter
                </button>
              </div>

              {/* Safe area spacer for mobile */}
              <div className="h-6 sm:h-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
            </div>

            <div className="h-[2px] shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };
  const triggerShockwave = useCallback((tokenId: string, amount: number) => {
    const svg = d3.select(svgRef.current);
    const node = nodesRef.current.find(n => n.token.id === tokenId);
    if (!node || !node.x || !node.y) return;

    // Enhanced dramatic whale splash effects
    const intensity = Math.min(amount / 50000, 1);
    const baseRadius = node.targetRadius || 20;
    const maxRadius = 150 + intensity * 200; // Much larger shockwave
    
    // Bubble size pulse (1.3x then back)
    svg.select(`circle[data-id="${tokenId}"]`)
      .transition().duration(150)
      .attr('r', baseRadius * 1.3)
      .transition().duration(400)
      .attr('r', baseRadius);

    // Flash the bubble brighter
    svg.select(`g[data-bubble-id="${tokenId}"] .bubble-main`)
      .transition().duration(100)
      .attr('opacity', 1)
      .attr('stroke-width', 4)
      .transition().duration(600)
      .attr('opacity', 0.92)
      .attr('stroke-width', 2);

    const shockwaveLayer = svg.select('.shockwave-layer');
    
    // Multiple concentric rings expanding at different speeds
    for (let i = 0; i < 3; i++) {
      const delay = i * 150;
      const ringColor = amount > 50000 ? (i % 2 === 0 ? '#FF3366' : '#FF4757') : (i % 2 === 0 ? '#00EC97' : '#00D4FF');
      const ringRadius = maxRadius * (0.6 + i * 0.3);
      
      setTimeout(() => {
        shockwaveLayer
          .append('circle')
          .attr('cx', node.x || 0)
          .attr('cy', node.y || 0)
          .attr('r', baseRadius)
          .attr('fill', 'none')
          .attr('stroke', ringColor)
          .attr('stroke-width', 3 - i * 0.5)
          .attr('opacity', 0.9 - i * 0.2)
          .transition().duration(1200 - i * 200)
          .attr('r', ringRadius)
          .attr('opacity', 0)
          .remove();
      }, delay);
    }

    // Particle scatter effect
    const particleCount = Math.floor(8 + intensity * 12);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 2 * Math.PI;
      const distance = 40 + Math.random() * 60;
      const particleColor = amount > 50000 ? '#FF3366' : '#00EC97';
      
      setTimeout(() => {
        shockwaveLayer
          .append('circle')
          .attr('cx', node.x || 0)
          .attr('cy', node.y || 0)
          .attr('r', 2 + Math.random() * 2)
          .attr('fill', particleColor)
          .attr('opacity', 0.8)
          .transition().duration(800 + Math.random() * 400)
          .attr('cx', (node.x || 0) + Math.cos(angle) * distance)
          .attr('cy', (node.y || 0) + Math.sin(angle) * distance)
          .attr('opacity', 0)
          .attr('r', 0.5)
          .remove();
      }, Math.random() * 200);
    }

    // Whale alert text that fades after 2 seconds
    const whaleText = shockwaveLayer
      .append('text')
      .attr('x', node.x || 0)
      .attr('y', (node.y || 0) - baseRadius - 20)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '14')
      .attr('font-weight', 'bold')
      .attr('fill', amount > 50000 ? '#FF3366' : '#00EC97')
      .attr('opacity', 0)
      .style('text-shadow', '0 2px 8px rgba(0,0,0,0.9)')
      .text(`🐋 $${formatCompact(amount).replace('$', '')} ${amount > 50000 ? 'SELL' : 'BUY'}`);
    
    whaleText
      .transition().duration(200)
      .attr('opacity', 1)
      .transition().duration(1800).delay(200)
      .attr('opacity', 0)
      .attr('y', (node.y || 0) - baseRadius - 40)
      .remove();

    // Push nearby bubbles — gentle on mobile to prevent seizure-like chaos
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    const forceMultiplier = isMobileDevice ? 8 : 25;
    const pushRadius = isMobileDevice ? maxRadius * 0.6 : maxRadius;
    nodesRef.current.forEach(other => {
      if (other.id === tokenId || !other.x || !other.y || !node.x || !node.y) return;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pushRadius && dist > 0) {
        const force = (1 - dist / pushRadius) * intensity * forceMultiplier;
        other.vx = (other.vx || 0) + (dx / dist) * force;
        other.vy = (other.vy || 0) + (dy / dist) * force;
      }
    });

    simulationRef.current?.alpha(isMobileDevice ? 0.1 : 0.2).restart();
  }, []);

  // ────────────────────── Whale Alerts (simulated) ──────────────────────

  useEffect(() => {
    if (tokens.length === 0) return;

    const generateWhaleAlert = () => {
      const token = tokens[Math.floor(Math.random() * Math.min(tokens.length, 20))];
      const amount = 10000 + Math.random() * 90000;
      
      // Play whale alert sound
      sonicRef.current.playWhaleAlert();

      // Trigger dramatic visual shockwave effect on the bubble
      triggerShockwave(token.id, amount);
    };

    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    const baseInterval = isMobileDevice ? 40000 : 20000;
    const randomRange = isMobileDevice ? 30000 : 25000;
    const interval = setInterval(generateWhaleAlert, baseInterval + Math.random() * randomRange);
    const firstTimeout = setTimeout(generateWhaleAlert, isMobileDevice ? 10000 : 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, [tokens, triggerShockwave]);

  const initSimulation = useCallback(() => {
    if (!svgRef.current || !containerRef.current || filteredTokens.length === 0) return;

    // Clean up previous simulation before creating new one
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Guard: if container has zero dimensions during re-render, schedule a retry
    if (width === 0 || height === 0) {
      requestAnimationFrame(() => {
        initSimulation();
      });
      return;
    }
    
    const centerX = width / 2;
    const centerY = height / 2;
    const isMobile = width < 768;

    // Scale radius by selected size metric — log scale for balanced distribution
    const getMetricValue = (token: VoidBubbleToken) => {
      switch (sizeMetric) {
        case 'volume': return token.volume24h;
        case 'performance': return Math.abs(getCurrentPriceChange(token)) * 1000; // scale up for visibility
        default: return token.marketCap;
      }
    };
    
    const values = filteredTokens.map(t => getMetricValue(t)).filter(v => v > 0);
    const minValue = Math.min(...values, 1);
    const maxValue = Math.max(...values, 1);
    const maxRadius = isMobile ? Math.min(width, height) * 0.055 : Math.min(width, height) * 0.065;
    const radiusScale = d3.scaleLog()
      .domain([minValue, maxValue])
      .range([8, maxRadius])
      .clamp(true);

    // Create nodes
    const nodes: BubbleNode[] = filteredTokens.map((token, i) => {
      const spread = Math.min(width, height) * 0.3;
      const r = radiusScale(getMetricValue(token));
      
      // Performance-based color: GREEN = up, RED = down
      // Intensity scales with magnitude of change - using CURRENT PERIOD's data
      const change = getCurrentPriceChange(token);
      const absChange = Math.min(Math.abs(change), 30); // cap at 30% for color scaling
      const intensity = absChange / 30; // 0-1 scale

      let bubbleColor: string;
      let glowColor: string;

      if (Math.abs(change) < 0.5) {
        // Near-zero: neutral with subtle Voidspace tint
        bubbleColor = '#2a3a35'; // dark void-green tint
        glowColor = '#00EC97';
      } else if (change > 0) {
        // GREEN spectrum: from muted green to vivid neon green
        const h = d3.hsl('#00EC97'); // Voidspace near-green as the green
        h.s = 0.6 + intensity * 0.4; // 0.6 → 1.0
        h.l = 0.25 + intensity * 0.25; // 0.25 → 0.50
        bubbleColor = h.formatRgb();
        glowColor = '#00EC97';
      } else {
        // RED spectrum: from muted red to vivid blood red
        const h = d3.hsl('#FF3333');
        h.s = 0.6 + intensity * 0.4;
        h.l = 0.20 + intensity * 0.20; // darker range for red
        bubbleColor = h.formatRgb();
        glowColor = '#FF4444';
      }

      // Golden-angle spiral for even distribution across the viewport
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
      const spiralAngle = i * goldenAngle;
      const spiralR = spread * 0.15 + Math.sqrt(i / filteredTokens.length) * spread * 0.7;
      return {
        id: token.id,
        token,
        radius: 0,
        targetRadius: r,
        color: bubbleColor,
        glowColor,
        x: centerX + Math.cos(spiralAngle) * spiralR,
        y: centerY + Math.sin(spiralAngle) * spiralR,
      };
    });

    nodesRef.current = nodes;

    // Clean up previously injected styles to prevent memory leak
    injectedStylesRef.current.forEach(style => style.remove());
    injectedStylesRef.current = [];

    // Stop previous simulation and animation frame
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (simulationRef.current as any)?.stop?.();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = null;

    // CRITICAL: Hide SVG BEFORE clearing to prevent flash of empty content
    const svgEl = d3.select(svgRef.current);
    svgEl.style('opacity', '0');

    // Clear previous (now invisible — no flash)
    svgEl.selectAll('*').remove();

    const svg = svgEl
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

    // SVG Definitions for gradients and filters
    const defs = svg.append('defs');

    // Unique radial gradients for each bubble
    nodes.forEach(d => {
      const gradient = defs.append('radialGradient')
        .attr('id', `grad-${d.id.replace(/[^a-zA-Z0-9]/g, '_')}`)
        .attr('cx', '30%').attr('cy', '30%')
        .attr('r', '70%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.color(d.color)?.brighter(0.8)?.formatRgb() || d.color)
        .attr('stop-opacity', '0.9');

      gradient.append('stop')
        .attr('offset', '70%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', '0.7');

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.color(d.color)?.darker(0.5)?.formatRgb() || d.color)
        .attr('stop-opacity', '0.9');
    });

    // Enhanced glow filters
    const glowFilter = defs.append('filter')
      .attr('id', 'bubble-glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // X-ray glow filter
    const xrayGlow = defs.append('filter')
      .attr('id', 'xray-glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');

    xrayGlow.append('feGaussianBlur')
      .attr('stdDeviation', '8')
      .attr('result', 'coloredBlur');

    const xrayMerge = xrayGlow.append('feMerge');
    xrayMerge.append('feMergeNode').attr('in', 'coloredBlur');
    xrayMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Background layers
    const bgLayer = svg.append('g').attr('class', 'background-layer');
    svg.append('g').attr('class', 'connection-lines-layer'); // **NEW: For capital flow hints**
    svg.append('g').attr('class', 'shockwave-layer');

    // ── Voidspace-Themed Background ──

    // Vignette (dark edges, lighter center)
    const vignetteGrad = defs.append('radialGradient')
      .attr('id', 'vignette-grad')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '70%');
    vignetteGrad.append('stop').attr('offset', '0%').attr('stop-color', 'transparent');
    vignetteGrad.append('stop').attr('offset', '70%').attr('stop-color', 'transparent');
    vignetteGrad.append('stop').attr('offset', '100%').attr('stop-color', '#000000').attr('stop-opacity', '0.6');
    bgLayer.append('rect').attr('width', width).attr('height', height).attr('fill', 'url(#vignette-grad)');

    // Nebula fog — layered radial gradients with brand colors
    const nebulaColors = [
      { cx: 0.25, cy: 0.3, color: '#00EC97', opacity: 0.035, r: 0.45 },
      { cx: 0.7, cy: 0.6, color: '#9D4EDD', opacity: 0.03, r: 0.5 },
      { cx: 0.5, cy: 0.2, color: '#00D4FF', opacity: 0.025, r: 0.4 },
      { cx: 0.8, cy: 0.15, color: '#00EC97', opacity: 0.02, r: 0.35 },
      { cx: 0.15, cy: 0.75, color: '#9D4EDD', opacity: 0.025, r: 0.4 },
    ];
    nebulaColors.forEach((n, i) => {
      const nebulaGrad = defs.append('radialGradient')
        .attr('id', `nebula-${i}`)
        .attr('cx', `${n.cx * 100}%`).attr('cy', `${n.cy * 100}%`).attr('r', `${n.r * 100}%`);
      nebulaGrad.append('stop').attr('offset', '0%').attr('stop-color', n.color).attr('stop-opacity', n.opacity * 2);
      nebulaGrad.append('stop').attr('offset', '100%').attr('stop-color', n.color).attr('stop-opacity', '0');

      // Inject drift animation CSS
      const driftStyle = document.createElement('style');
      driftStyle.textContent = `
        @keyframes nebula-drift-${i} {
          0%, 100% { transform: translate(0px, 0px); }
          33% { transform: translate(${10 + i * 5}px, ${-8 + i * 3}px); }
          66% { transform: translate(${-6 - i * 4}px, ${12 + i * 2}px); }
        }
        .nebula-fog-${i} { animation: nebula-drift-${i} ${20 + i * 8}s ease-in-out infinite; }
      `;
      document.head.appendChild(driftStyle);
      injectedStylesRef.current.push(driftStyle);

      bgLayer.append('rect')
        .attr('class', `nebula-fog-${i}`)
        .attr('width', width).attr('height', height)
        .attr('fill', `url(#nebula-${i})`);
    });

    // Holographic wireframe grid (perspective-fading)
    const gridGroup = bgLayer.append('g').attr('class', 'void-grid').attr('opacity', 0.07);
    const gridSpacing = 60;
    // Vertical lines
    for (let x = 0; x < width; x += gridSpacing) {
      const distFromCenter = Math.abs(x - width / 2) / (width / 2);
      gridGroup.append('line')
        .attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', height)
        .attr('stroke', '#00D4FF').attr('stroke-width', 0.5)
        .attr('opacity', Math.max(0.1, 1 - distFromCenter * 1.2));
    }
    // Horizontal lines
    for (let y = 0; y < height; y += gridSpacing) {
      const distFromCenter = Math.abs(y - height / 2) / (height / 2);
      gridGroup.append('line')
        .attr('x1', 0).attr('y1', y).attr('x2', width).attr('y2', y)
        .attr('stroke', '#00D4FF').attr('stroke-width', 0.5)
        .attr('opacity', Math.max(0.1, 1 - distFromCenter * 1.2));
    }
    // Grid pulse animation
    const gridPulseStyle = document.createElement('style');
    gridPulseStyle.textContent = `
      @keyframes grid-pulse { 0%, 100% { opacity: 0.07; } 50% { opacity: 0.12; } }
      .void-grid { animation: grid-pulse 8s ease-in-out infinite; }
    `;
    document.head.appendChild(gridPulseStyle);
    injectedStylesRef.current.push(gridPulseStyle);

    // Star field — varying sizes and brightness
    const starGroup = bgLayer.append('g').attr('class', 'star-field');
    const starCount = Math.min(Math.floor(width * height / 3000), 200);
    for (let i = 0; i < starCount; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      const sr = 0.3 + Math.random() * 1.5;
      const so = 0.15 + Math.random() * 0.6;
      const starColor = ['#ffffff', '#00EC97', '#00D4FF', '#9D4EDD'][Math.floor(Math.random() * 4)];
      starGroup.append('circle')
        .attr('cx', sx).attr('cy', sy).attr('r', sr)
        .attr('fill', starColor).attr('opacity', so);
    }
    // Twinkle animation for some stars
    const twinkleStyle = document.createElement('style');
    twinkleStyle.textContent = `
      @keyframes star-twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }
    `;
    document.head.appendChild(twinkleStyle);
    injectedStylesRef.current.push(twinkleStyle);
    // Apply twinkle to ~30% of stars
    starGroup.selectAll('circle')
      .filter(() => Math.random() < 0.3)
      .style('animation', () => `star-twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`);

    // **NEW: Premium Visual Effects - Connection Lines**
    const connectionLinesLayer = svg.select('.connection-lines-layer');

    // Enhanced X-ray scanning effect
    const scanLineGroup = svg.append('g').attr('class', 'scan-line-layer');
    
    // Scan line gradients
    const scanLineGradient = defs.append('linearGradient')
      .attr('id', 'scan-line-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    
    scanLineGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'transparent');
    scanLineGradient.append('stop')
      .attr('offset', '30%')
      .attr('stop-color', '#00EC97')
      .attr('stop-opacity', '0.05');
    scanLineGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#00EC97')
      .attr('stop-opacity', '0.25'); // Brighter center
    scanLineGradient.append('stop')
      .attr('offset', '70%')
      .attr('stop-color', '#00D4FF')
      .attr('stop-opacity', '0.08');
    scanLineGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'transparent');
    
    // Main scan line (thicker and brighter)
    const scanLine = scanLineGroup.append('rect')
      .attr('x', 0)
      .attr('y', -3)
      .attr('width', width)
      .attr('height', 4) // Thicker for more impact
      .attr('fill', 'url(#scan-line-gradient)')
      .attr('opacity', 0)
      .style('filter', 'drop-shadow(0 0 6px #00EC9750)'); // Added glow
    
    // Enhanced scan line animation
    const animateScanLine = () => {
      // Main scan line
      scanLine
        .attr('y', -3)
        .attr('opacity', 0)
        .transition()
        .duration(300) // Slower fade in
        .attr('opacity', 1)
        .transition()
        .duration(10000) // Slower traverse
        .ease(d3.easeLinear)
        .attr('y', height)
        .transition()
        .duration(400) // Slower fade out
        .attr('opacity', 0)
        .on('end', () => {
          setTimeout(animateScanLine, 8000); // Longer interval between scans
        });
    };
    
    setTimeout(animateScanLine, 3000); // Delayed initial start

    // Bubble groups
    const bubbleGroups = svg.append('g').attr('class', 'bubbles-layer')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'bubble-group')
      .attr('data-bubble-id', d => d.token.id)
      .style('cursor', 'pointer');

    // **NEW: Premium Visual Effects - Add CSS animations for critical tokens**
    const criticalTokens = nodes.filter(d => d.token.riskLevel === 'critical' || d.token.healthScore < 20);
    criticalTokens.forEach(d => {
      // Add pulsing red ring animation via CSS
      const style = document.createElement('style');
      style.textContent = `
        @keyframes danger-pulse-${d.id} {
          0% { stroke-opacity: 0.3; stroke-width: 2; }
          50% { stroke-opacity: 0.8; stroke-width: 4; }
          100% { stroke-opacity: 0.3; stroke-width: 2; }
        }
        .danger-pulse-${d.id} {
          animation: danger-pulse-${d.id} 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
      injectedStylesRef.current.push(style);
    });

    // Enhanced outer glow circle — dramatic colored halo with dynamic opacity
    bubbleGroups.append('circle')
      .attr('class', 'bubble-glow')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => d.glowColor)
      .attr('stroke-width', 3.5) // Thicker stroke for more dramatic effect
      .attr('opacity', (d: BubbleNode) => {
        // Dim for highlight mode
        const change = getCurrentPriceChange(d.token);
        if (highlightMode === 'gainers' && change < 0) return 0.05;
        if (highlightMode === 'losers' && change >= 0) return 0.05;
        const baseOpacity = 0.45;
        const performanceBonus = Math.min(Math.abs(change) / 50, 0.2);
        const sizeBonus = Math.min(d.targetRadius / 100, 0.15);
        return Math.min(baseOpacity + performanceBonus + sizeBonus, 0.8);
      })
      .attr('filter', 'url(#bubble-glow)');

    // Enhanced subtle outer ring with premium stroke styling + danger pulse
    bubbleGroups.append('circle')
      .attr('class', d => `bubble-outer-ring ${d.token.riskLevel === 'critical' || d.token.healthScore < 20 ? `danger-pulse-${d.id}` : ''}`)
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => {
        // **NEW: Danger pulse for critical tokens**
        if (d.token.riskLevel === 'critical' || d.token.healthScore < 20) {
          return '#FF2244'; // Bright red for danger
        }
        return d.glowColor;
      })
      .attr('stroke-width', d => d.token.riskLevel === 'critical' ? 2 : 1.5)
      .attr('opacity', (d: BubbleNode) => {
        // Vary opacity based on token importance
        const healthScore = d.token.healthScore;
        const baseOpacity = 0.18;
        const healthBonus = healthScore >= 75 ? 0.12 : healthScore >= 50 ? 0.06 : 0;
        return baseOpacity + healthBonus;
      })
      .attr('stroke-dasharray', (d: BubbleNode) => {
        // Solid rings for healthy tokens, dashed for risky ones
        return d.token.riskLevel === 'critical' ? '3,2' : d.token.riskLevel === 'high' ? '5,3' : 'none';
      });

    // X-ray concentration rings (hidden by default) - now using health-based colors
    bubbleGroups.append('circle')
      .attr('class', 'xray-ring')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (xrayMode) {
          const healthStatus = getHealthStatus(d.token.healthScore);
          return HEALTH_COLORS[healthStatus];
        }
        return RISK_COLORS[d.token.riskLevel];
      })
      .attr('stroke-width', d => {
        if (xrayMode) {
          const healthStatus = getHealthStatus(d.token.healthScore);
          return healthStatus === 'unhealthy' ? 4 : healthStatus === 'medium' ? 3 : 2;
        }
        return d.token.riskLevel === 'critical' ? 4 : d.token.riskLevel === 'high' ? 3 : 2;
      })
      .attr('opacity', 0)
      .attr('filter', 'url(#xray-glow)');

    // Health indicator icons removed — health data now displayed in popup card only

    // Main bubble — clean, vibrant orb with category-colored border
    bubbleGroups.append('circle')
      .attr('class', 'bubble-main')
      .attr('data-id', d => d.token.id)
      .attr('r', 0)
      .attr('fill', d => `url(#grad-${d.id.replace(/[^a-zA-Z0-9]/g, '_')})`)
      .attr('stroke', d => CATEGORY_COLORS[d.token.category] || '#64748B')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.4)
      .attr('opacity', (d: BubbleNode) => {
        // Gainers/Losers highlight: dim non-matching bubbles
        const change = getCurrentPriceChange(d.token);
        if (highlightMode === 'gainers' && change < 0) return 0.15;
        if (highlightMode === 'losers' && change >= 0) return 0.15;
        return 0.92;
      });

    // **NEW: Momentum Trails - Add particle trails for strong movers**
    const strongMovers = nodes.filter(d => Math.abs(getCurrentPriceChange(d.token)) > 15);
    strongMovers.forEach(d => {
      const change = getCurrentPriceChange(d.token);
      const isPositive = change > 0;
      const trailColor = isPositive ? '#00EC97' : '#FF3366';
      
      // Create subtle particle trail
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const trail = bubbleGroups.filter(node => node.id === d.id)
            .append('circle')
            .attr('class', 'momentum-trail')
            .attr('r', 1)
            .attr('fill', trailColor)
            .attr('opacity', 0.6)
            .attr('x', d.x || 0)
            .attr('y', d.y || 0);
          
          trail
            .transition().duration(1500)
            .attr('cy', (d.y || 0) + (isPositive ? -30 : 30))
            .attr('opacity', 0)
            .remove();
        }, i * 300);
      }
    });

    // Skull overlay for critical risk
    bubbleGroups.filter(d => d.token.riskLevel === 'critical' || d.token.riskLevel === 'high')
      .append('text')
      .attr('class', 'skull-overlay')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', d => Math.max(d.targetRadius * 0.6, 10))
      .attr('opacity', 0)
      .text('💀');

    // Enhanced symbol labels with premium typography
    // Only show symbol on bubbles large enough to fit both symbol + content below
    bubbleGroups.filter(d => d.targetRadius >= 15)
      .append('text')
      .attr('class', 'bubble-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('dy', '-0.35em')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', d => Math.min(d.targetRadius * 0.45, 14))
      .attr('font-weight', '700')
      .attr('fill', '#ffffff')
      .style('text-shadow', '0 2px 6px rgba(0,0,0,0.9)')
      .style('pointer-events', 'none')
      .text(d => d.token.symbol);

    // Floating content — price/volume/performance on ALL bubbles with dynamic sizing
    bubbleGroups
      .append('text')
      .attr('class', 'bubble-content')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('dy', d => d.targetRadius >= 15 ? '0.8em' : '0')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', d => {
        // Dynamic font size scaled to fit inside the bubble
        if (d.targetRadius < 10) return Math.max(d.targetRadius * 0.6, 5);
        if (d.targetRadius < 15) return Math.max(d.targetRadius * 0.5, 6);
        if (d.targetRadius < 30) return Math.min(d.targetRadius * 0.3, 9);
        return Math.min(d.targetRadius * 0.25, 10);
      })
      .attr('font-weight', 'bold')
      .attr('opacity', d => d.targetRadius < 10 ? 0.75 : 0.9)
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)')
      .style('pointer-events', 'none')
      .attr('fill', (d: BubbleNode) => {
        const currentChange = getCurrentPriceChange(d.token);
        return currentChange >= 0 ? '#00EC97' : '#FF3366';
      })
      .text((d: BubbleNode) => {
        const currentChange = getCurrentPriceChange(d.token);
        // For very small bubbles, show just the number
        const pctText = bubbleContent === 'performance' || d.targetRadius < 15
          ? `${currentChange >= 0 ? '+' : ''}${currentChange.toFixed(d.targetRadius < 15 ? 0 : 1)}%`
          : (() => {
              switch (bubbleContent) {
                case 'price': return formatPrice(d.token.price);
                case 'volume': return formatCompact(d.token.volume24h);
                case 'marketCap': return formatCompact(d.token.marketCap);
                default: return `${currentChange >= 0 ? '+' : ''}${currentChange.toFixed(1)}%`;
              }
            })();
        return pctText;
      });

    // **NEW: Updated Click Handler** - Single click shows popup, double click shows side panel
    bubbleGroups
      .on('mouseenter', function(event, d) {
        setHoveredToken(d.token);
        setHoverPos({ x: event.layerX, y: event.layerY });
        
        // Highlight the bubble — scale up slightly for premium feel
        d3.select(this).select('.bubble-main')
          .transition().duration(150)
          .attr('stroke-width', 3)
          .attr('stroke-opacity', 0.8);
        
        d3.select(this).select('.bubble-glow')
          .transition().duration(150)
          .attr('stroke-width', 5)
          .attr('opacity', 0.9);
      })
      .on('mouseleave', function() {
        setHoveredToken(null);
        
        // Reset bubble appearance
        d3.select(this).select('.bubble-main')
          .transition().duration(200)
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.4);
        
        d3.select(this).select('.bubble-glow')
          .transition().duration(200)
          .attr('stroke-width', 3.5)
          .attr('opacity', (d: unknown) => {
            const node = d as BubbleNode;
            const currentChange = getCurrentPriceChange(node.token);
            const baseOpacity = 0.45;
            const performanceBonus = Math.min(Math.abs(currentChange) / 50, 0.2);
            const sizeBonus = Math.min(node.targetRadius / 100, 0.15);
            return Math.min(baseOpacity + performanceBonus + sizeBonus, 0.8);
          });
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        // Single click = open popup card immediately (no double-click delay)
        handleShowPopup(d.token.id, event);
        
        // Play sounds based on token state
        const currentChange = getCurrentPriceChange(d.token);
        if (currentChange > 5) sonicRef.current.playPump(Math.min(currentChange / 30, 1));
        else if (currentChange < -5) sonicRef.current.playDump(Math.min(Math.abs(currentChange) / 30, 1));
        if (d.token.riskLevel === 'critical') sonicRef.current.playRisk();
      });

    // Force simulation — enhanced spacing for better mobile UX
    // Build category cluster positions — arrange categories in a circle around center
    const activeCategories = Array.from(new Set(filteredTokens.map(t => t.category)));
    const categoryPositions: Record<string, { x: number; y: number }> = {};
    const clusterRadius = Math.min(width, height) * 0.3;
    activeCategories.forEach((cat, i) => {
      const angle = (i / activeCategories.length) * 2 * Math.PI - Math.PI / 2;
      categoryPositions[cat] = {
        x: centerX + Math.cos(angle) * clusterRadius,
        y: centerY + Math.sin(angle) * clusterRadius,
      };
    });
    // If only one category (filtered), center it
    if (activeCategories.length === 1) {
      categoryPositions[activeCategories[0]] = { x: centerX, y: centerY };
    }
    
    const simulation = d3.forceSimulation(nodes)
      // Gentle centering — keeps the cloud roughly centered
      .force('x', d3.forceX<BubbleNode>(d => categoryPositions[d.token.category]?.x ?? centerX).strength(0.03))
      .force('y', d3.forceY<BubbleNode>(d => categoryPositions[d.token.category]?.y ?? centerY).strength(0.03))
      .force('charge', d3.forceManyBody()
        .strength(isMobile ? -20 : -15)
        .distanceMax(Math.min(width, height) * 0.4)
      )
      .force('collision', d3.forceCollide<BubbleNode>()
        .radius(d => {
          // X-ray rings need more space, but less on mobile to prevent overflow
          const xrayPad = isMobile ? 1.25 : 1.5;
          const normalPad = isMobile ? 1.2 : 1.35;
          return d.targetRadius * (xrayMode ? xrayPad : normalPad) + (isMobile ? 3 : 6);
        })
        .strength(0.95)
        .iterations(isMobile ? 6 : 4) // More iterations on mobile for tighter packing
      )
      .alphaDecay(isMobile ? 0.03 : 0.025) // Even faster settling on mobile
      .alpha(0.5)
      .velocityDecay(isMobile ? 0.55 : 0.45); // More friction on mobile

    // Store simulation reference
    simulationRef.current = simulation;

    // Animation loop with enhanced performance monitoring
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const tick = (currentTime: number) => {
      if (currentTime - lastFrameTime >= frameInterval) {
        // Soft boundary — proportional force prevents oscillation on mobile
        const margin = 40;
        nodes.forEach(d => {
          const r = d.targetRadius;
          if (d.x !== undefined) {
            const leftOverlap = margin - (d.x - r);
            const rightOverlap = (d.x + r) - (width - margin);
            if (leftOverlap > 0) d.vx = (d.vx || 0) + leftOverlap * 0.05;
            if (rightOverlap > 0) d.vx = (d.vx || 0) - rightOverlap * 0.05;
          }
          if (d.y !== undefined) {
            const topOverlap = margin - (d.y - r);
            const bottomOverlap = (d.y + r) - (height - margin);
            if (topOverlap > 0) d.vy = (d.vy || 0) + topOverlap * 0.05;
            if (bottomOverlap > 0) d.vy = (d.vy || 0) - bottomOverlap * 0.05;
          }
        });

        // Update bubble positions
        bubbleGroups
          .attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);

        // Update connection lines if any exist
        connectionLinesLayer.selectAll('.connection-line')
          .attr('x1', function() {
            const d = d3.select(this).datum() as { source: BubbleNode };
            return d.source.x || 0;
          })
          .attr('y1', function() {
            const d = d3.select(this).datum() as { source: BubbleNode };
            return d.source.y || 0;
          });

        lastFrameTime = currentTime;
      }

      if (simulation.alpha() > 0.01) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    simulation.on('tick', () => {
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    });

    // Set all bubble radii immediately (no staggered entrance — prevents mobile flashing)
    bubbleGroups.selectAll('circle').each(function() {
      const el = d3.select(this);
      const className = el.attr('class') || '';
      const parentData = d3.select((this as SVGElement).parentNode as Element).datum() as BubbleNode;
      if (!parentData) return;
      const r = parentData.targetRadius;
      if (className.includes('bubble-main')) el.attr('r', r);
      else if (className.includes('bubble-glow')) el.attr('r', r + (isMobile ? 2 : 4));
      else if (className.includes('bubble-outer-ring')) el.attr('r', r + (isMobile ? 4 : 8));
      else if (className.includes('xray-ring')) el.attr('r', r + (isMobile ? 6 : 12));
      else el.attr('r', r);
    });

    // Labels start visible immediately
    bubbleGroups.selectAll('text').attr('opacity', function() {
      const className = d3.select(this).attr('class') || '';
      if (className.includes('skull-overlay')) {
        const parentData = d3.select((this as SVGElement).parentNode as Element).datum() as BubbleNode;
        return parentData?.token.riskLevel === 'critical' ? 0.7 : 0.4;
      }
      return 1;
    });

    // Let the simulation run a few ticks to position bubbles BEFORE showing anything
    // This prevents the "seizure" of bubbles spawning at random positions then rearranging
    for (let i = 0; i < 60; i++) simulation.tick();
    // Update positions after pre-ticking
    bubbleGroups.attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    // NOW fade in — everything is already in position
    svg.transition().duration(350).ease(d3.easeCubicOut).style('opacity', 1);

    // X-ray mode toggle
    bubbleGroups.selectAll('.xray-ring')
      .transition().duration(300)
      .attr('opacity', xrayMode ? 0.8 : 0);
    
    // Health indicators removed — data in popup card only

    // Enhanced pulsing animation for high volume tokens using CSS instead of JS for performance
    const highVolTokens = nodes.filter(d => d.token.volume24h > d.token.liquidity * 2);
    if (pulseMode && highVolTokens.length > 0) {
      // Add CSS animation for whale tokens
      const style = document.createElement('style');
      style.textContent = `
        @keyframes whale-pulse {
          0% { transform: scale(1); opacity: 0.92; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.92; }
        }
        .whale-pulse {
          animation: whale-pulse 3s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
      injectedStylesRef.current.push(style);
      
      highVolTokens.forEach(d => {
        bubbleGroups.filter(node => node.id === d.id)
          .select('.bubble-main')
          .classed('whale-pulse', true);
      });
    }

    // ── "Alive" Breathing Effect ──
    // Subtle CSS breathing animation on all bubble-main circles + glow rings
    const breatheStyle = document.createElement('style');
    breatheStyle.textContent = `
      @keyframes bubble-breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      @keyframes glow-breathe {
        0%, 100% { stroke-opacity: 0.4; }
        50% { stroke-opacity: 0.55; }
      }
    `;
    document.head.appendChild(breatheStyle);
    injectedStylesRef.current.push(breatheStyle);

    // ── New Pair Indicator — golden pulsing ring for tokens listed < 24h ──
    const newPairStyle = document.createElement('style');
    newPairStyle.textContent = `
      @keyframes new-pair-pulse {
        0%, 100% { stroke-opacity: 0.4; stroke-width: 2; }
        50% { stroke-opacity: 1; stroke-width: 4; }
      }
    `;
    document.head.appendChild(newPairStyle);
    injectedStylesRef.current.push(newPairStyle);

    const now = Date.now();
    nodes.forEach(d => {
      const createdAt = d.token.pairCreatedAt ? new Date(d.token.pairCreatedAt).getTime() : 0;
      if (createdAt && now - createdAt < 86400000) {
        const group = bubbleGroups.filter(n => n.id === d.id);
        // Golden ring
        group.insert('circle', '.bubble-main')
          .attr('class', 'new-pair-ring')
          .attr('r', d.targetRadius + (isMobile ? 5 : 10))
          .attr('fill', 'none')
          .attr('stroke', '#FFB800')
          .attr('stroke-width', 2)
          .style('animation', 'new-pair-pulse 2s ease-in-out infinite');
        // "NEW" label
        group.append('text')
          .attr('class', 'new-pair-label')
          .attr('text-anchor', 'middle')
          .attr('y', -(d.targetRadius + 6))
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-size', '7')
          .attr('font-weight', 'bold')
          .attr('fill', '#FFB800')
          .style('text-shadow', '0 1px 4px rgba(0,0,0,0.9)')
          .style('pointer-events', 'none')
          .text('NEW');
      }
    });

    // Apply breathing with random delays so bubbles don't sync
    bubbleGroups.each(function(_d, i) {
      const group = d3.select(this);
      const delay = (i * 0.7 + Math.random() * 3).toFixed(2);
      const duration = (3 + Math.random() * 3).toFixed(2);
      group.select('.bubble-main')
        .style('transform-origin', 'center')
        .style('transform-box', 'fill-box')
        .style('animation', `bubble-breathe ${duration}s ease-in-out ${delay}s infinite`);
      group.select('.bubble-glow')
        .style('animation', `glow-breathe ${duration}s ease-in-out ${delay}s infinite`);
    });

    // Keep simulation gently alive — periodic alpha nudge
    const breatheInterval = setInterval(() => {
      if (simulationRef.current) {
        simulationRef.current.alpha(0.015).restart();
      }
    }, 6000);
    // Clean up interval on next re-init or unmount
    const prevCleanup = () => clearInterval(breatheInterval);
    // Store cleanup in a style element's remove handler (piggyback)
    const breatheCleanupStyle = document.createElement('style');
    breatheCleanupStyle.textContent = '/* breathe-interval-cleanup */';
    const origRemove = breatheCleanupStyle.remove.bind(breatheCleanupStyle);
    breatheCleanupStyle.remove = () => { prevCleanup(); origRemove(); };
    document.head.appendChild(breatheCleanupStyle);
    injectedStylesRef.current.push(breatheCleanupStyle);

    // Enhanced zoom behavior with double-click reset
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on('zoom', (event) => {
        svg.select('.bubbles-layer').attr('transform', event.transform);
        svg.select('.shockwave-layer').attr('transform', event.transform);
      });

    svg.call(zoom)
      .on('dblclick.zoom', () => {
        // Double-click to reset zoom
        svg.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity);
      });

    // Click outside to collapse any expanded bubbles or close popup
    svg.on('click', () => {
      setPopupCard(null); // Close popup card
      if (selectedToken) {
        setSelectedToken(null);
      }
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTokens, sizeMetric, bubbleContent, xrayMode, pulseMode, period, highlightMode, getCurrentPriceChange, handleShowPopup]);

  // Handle window resize with proper debounce
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initSimulation();
      }, 200);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [initSimulation]);

  // Track token IDs to detect real structural changes vs. just data refresh
  const prevTokenIdsRef = useRef<string>('');

  // Initialize on mount and when dependencies change
  useEffect(() => {
    if (filteredTokens.length === 0) return;
    
    // Build a key from token IDs + filter settings to detect structural changes
    const tokenKey = filteredTokens.map(t => t.id).sort().join(',');
    const structuralKey = `${tokenKey}|${filterCategory}|${sizeMetric}|${bubbleContent}|${xrayMode}|${period}|${highlightMode}`;
    
    if (prevTokenIdsRef.current === '' || prevTokenIdsRef.current !== structuralKey) {
      // First load or structural change — full re-init
      prevTokenIdsRef.current = structuralKey;
      initSimulation();
    }
    // Data-only refresh (same tokens, same filters) — skip re-init to prevent flashing
  }, [initSimulation, filteredTokens, filterCategory, sizeMetric, bubbleContent, xrayMode, period, highlightMode]);

  // Listen for token open events from HotStrip / Header ticker
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.tokenId) {
        handleShowPopup(detail.tokenId);
      }
    };
    window.addEventListener('voidspace:open-token', handler);
    return () => window.removeEventListener('voidspace:open-token', handler);
  }, [handleShowPopup]);

  // ── Keyboard Shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire when typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'f':
          window.dispatchEvent(new CustomEvent('voidspace:toggle-fullscreen'));
          break;
        case 's':
          setShowSearch(prev => !prev);
          break;
        case 'x':
          setXrayMode(prev => !prev);
          break;
        case 'Escape':
          setPopupCard(null);
          setShowSearch(false);
          setSearchQuery('');
          setShowMobilePanel(false);
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (simulationRef.current) simulationRef.current.stop();
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      // Remove all injected CSS styles
      injectedStylesRef.current.forEach(style => style.remove());
      injectedStylesRef.current = [];
    };
  }, []);

  // ────────────────────── Event Handlers ──────────────────────

  const toggleWatchlist = useCallback((tokenId: string) => {
    setWatchlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId);
      } else {
        newSet.add(tokenId);
      }
      return newSet;
    });
  }, []);

  const handleSnapshot = useCallback(() => {
    if (!svgRef.current) return;

    try {
      // Clone SVG so we can inline styles without affecting the live DOM
      const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
      const rect = svgRef.current.getBoundingClientRect();

      // Set explicit dimensions & a dark background rect
      clone.setAttribute('width', String(rect.width));
      clone.setAttribute('height', String(rect.height));
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // Insert background rect at the start
      const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('width', '100%');
      bgRect.setAttribute('height', '100%');
      bgRect.setAttribute('fill', '#0a0a0f');
      clone.insertBefore(bgRect, clone.firstChild);

      // Remove CSS animations (they break serialization) and inline computed styles
      const allEls = clone.querySelectorAll('*');
      allEls.forEach(el => {
        el.removeAttribute('class');
        (el as HTMLElement).style?.removeProperty?.('animation');
        // Remove url() filter references that break in serialized context
        const filter = el.getAttribute('filter');
        if (filter?.includes('url(')) el.removeAttribute('filter');
      });

      // Embed JetBrains Mono as a web font (base64 fallback not needed — use Google Fonts CSS)
      const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleEl.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        text { font-family: 'JetBrains Mono', monospace; }
      `;
      (clone.querySelector('defs') || clone).insertBefore(styleEl, (clone.querySelector('defs') || clone).firstChild);

      // Serialize to blob
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Draw to canvas for PNG export
      const canvas = document.createElement('canvas');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(svgUrl); return; }
      ctx.scale(dpr, dpr);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);

        const link = document.createElement('a');
        link.download = `voidspace-bubbles-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        URL.revokeObjectURL(svgUrl);
      };
      img.onerror = () => {
        // Fallback: open SVG in a new tab for manual save
        const fallbackUrl = URL.createObjectURL(svgBlob);
        window.open(fallbackUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(fallbackUrl), 10000);
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } catch {
      // Last resort: open raw SVG data URI
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
      window.open(dataUri, '_blank');
    }
  }, []);

  const handleShareX = useCallback(() => {
    const text = "Exploring the NEAR Protocol ecosystem with @VoidSpaceNear's Void Bubbles! 🫧\n\nReal-time token analytics, AI insights, and whale tracking in one beautiful interface. 🐋\n\n#NEAR #DeFi #Web3";
    const url = "https://voidspace.io";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  }, []);

  // ────────────────────── Render Functions ──────────────────────

  const renderHoverTooltip = () => {
    if (!hoveredToken) return null;

    const currentChange = getCurrentPriceChange(hoveredToken);
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute z-40 pointer-events-none"
          style={{
            left: hoverPos.x + 15,
            top: hoverPos.y - 60,
          }}
        >
          <Card className="bg-surface/95 backdrop-blur-xl border-border shadow-xl">
            <div className="px-3 py-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{hoveredToken.symbol}</span>
                <Badge variant="default" className="text-xs">{hoveredToken.category}</Badge>
              </div>
              <div className="text-xs text-text-muted">
                <div>{formatPrice(hoveredToken.price)} • MC: {formatCompact(hoveredToken.marketCap)}</div>
                <div className={cn("font-mono", {
                  'text-near-green': currentChange >= 0,
                  'text-red-400': currentChange < 0
                })}>
                  {currentChange >= 0 ? '+' : ''}{currentChange.toFixed(1)}% ({period})
                </div>
              </div>
              {/* Sparkline — 4 timeframe data points */}
              {(() => {
                const points = [
                  hoveredToken.priceChange5m ?? 0,
                  hoveredToken.priceChange1h,
                  hoveredToken.priceChange6h,
                  hoveredToken.priceChange24h,
                ];
                const maxAbs = Math.max(...points.map(Math.abs), 1);
                const w = 60;
                const h = 20;
                const mid = h / 2;
                const coords = points.map((p, i) => ({
                  x: (i / 3) * w,
                  y: mid - (p / maxAbs) * (mid - 2),
                }));
                const polyline = coords.map(c => `${c.x},${c.y}`).join(' ');
                const fillPath = `M${coords[0].x},${coords[0].y} ${coords.map(c => `L${c.x},${c.y}`).join(' ')} L${coords[coords.length - 1].x},${h} L${coords[0].x},${h} Z`;
                const overall = hoveredToken.priceChange24h >= 0;
                const color = overall ? '#00EC97' : '#FF3366';
                return (
                  <svg width={w} height={h} className="mt-1">
                    <path d={fillPath} fill={color} opacity={0.1} />
                    <polyline points={polyline} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
                  </svg>
                );
              })()}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderTokenAnatomy = () => {
    if (!selectedToken) return null;

    const currentChange = getCurrentPriceChange(selectedToken);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-0 right-0 h-full w-full sm:w-96 z-40 bg-surface/95 backdrop-blur-xl border-l border-border shadow-2xl overflow-y-auto"
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary">Token Profile</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedToken(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{selectedToken.name}</h3>
                <p className="text-text-muted font-mono">{selectedToken.symbol}</p>
                <Badge variant="default" className="mt-1">{selectedToken.category}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-text-muted">Price</p>
                  <p className="font-mono font-semibold">{formatPrice(selectedToken.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">24h Change</p>
                  <p className={cn("font-mono font-semibold", {
                    'text-near-green': currentChange >= 0,
                    'text-red-400': currentChange < 0
                  })}>
                    {currentChange >= 0 ? '+' : ''}{currentChange.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Market Cap</p>
                  <p className="font-mono font-semibold">{formatCompact(selectedToken.marketCap)}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Volume 24h</p>
                  <p className="font-mono font-semibold">{formatCompact(selectedToken.volume24h)}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Health Score</p>
                  <p className="font-mono font-semibold">{selectedToken.healthScore}/100</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Risk Level</p>
                  <Badge variant='default'>
                    {selectedToken.riskLevel}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedToken.contractAddress && selectedToken.contractAddress !== 'N/A' && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => window.open(`https://dexscreener.com/near/${selectedToken.contractAddress}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    DexScreener
                  </Button>
                )}
                {selectedToken.contractAddress && selectedToken.contractAddress !== 'N/A' && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => window.open(`https://app.ref.finance/#near|${selectedToken.contractAddress}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ref Finance
                  </Button>
                )}
              </div>

              {selectedToken.website && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => window.open(selectedToken.website, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Website
                </Button>
              )}

              {selectedToken.twitter && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => window.open(selectedToken.twitter, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Twitter
                </Button>
              )}

              {selectedToken.telegram && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => window.open(selectedToken.telegram, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Telegram
                </Button>
              )}

              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Contract Address:</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-surface-hover px-2 py-1 rounded font-mono flex-1">
                    {selectedToken.contractAddress}
                  </code>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigator.clipboard.writeText(selectedToken.contractAddress)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => toggleWatchlist(selectedToken.id)}
              >
                {watchlist.has(selectedToken.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </Button>
            <Button variant="secondary" size="sm" onClick={handleShareX}>
              <Share2 className="w-3 h-3 mr-1" />
              Share on X
            </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ────────────────────── Main Render ──────────────────────

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        
        {/* Animated scan line */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-near-green/30 to-transparent animate-scan" />
        </div>
        
        <div className="text-center space-y-6 relative z-10">
          {/* Voidspace Logo with draw animation */}
          <div className="mx-auto">
            <VoidspaceLogo size="lg" animate={true} className="mx-auto" />
          </div>
          
          <div className="space-y-2">
            <p className="text-near-green font-mono font-bold text-lg uppercase tracking-wider">
              SCANNING THE VOID
            </p>
            <p className="text-text-muted text-sm font-mono">
              Mapping {'>'}350 tokens across the NEAR ecosystem...
            </p>
          </div>
          
          {/* Additional scan line for loading state */}
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-near-green/20 to-transparent mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-text-primary">Connection Lost</h2>
          <p className="text-text-muted max-w-md">
            {error}
          </p>
          <Button variant="secondary" onClick={fetchTokens}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden h-full w-full">
      {/* ═══ COMMAND NEXUS — Desktop Control Panel ═══ */}
      <div className="hidden sm:block absolute top-4 left-4 z-20 w-60" style={{ maxHeight: 'calc(100% - 3rem)' }}>
        {/* Outer animated border glow */}
        <div className="relative rounded-2xl p-[1px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,236,151,0.3), rgba(0,212,255,0.15), rgba(157,78,221,0.2), rgba(0,236,151,0.3))',
            backgroundSize: '300% 300%',
            animation: 'gradient-shift 8s ease infinite',
          }}
        >
          <div className="bg-[#060a0f]/90 backdrop-blur-2xl rounded-2xl overflow-y-auto overflow-x-hidden shadow-2xl shadow-[#00EC97]/5" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
            {/* Animated top accent with sweep */}
            <div className="relative h-[2px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00EC97]/60 via-[#00D4FF]/80 to-[#9D4EDD]/60" />
              <div className="absolute inset-0" style={{ 
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                animation: 'shimmer-sweep 3s ease-in-out infinite',
                backgroundSize: '200% 100%',
              }} />
            </div>

            {/* Panel Header */}
            <div className="px-4 pt-3 pb-2 flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-[#00EC97]/15 border border-[#00EC97]/25 flex items-center justify-center">
                <Brain className="w-3 h-3 text-[#00EC97]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-white tracking-wide">Command Nexus</span>
                <span className="text-[8px] font-mono text-[#00EC97]/60 block -mt-0.5">VOID://CONTROL.MATRIX</span>
              </div>
            </div>
            
            <div className="px-4 pb-4 space-y-3">
              {/* ── Timeframe ── */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3 h-3 text-[#00D4FF]/70" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#00D4FF]/70">Temporal Range</span>
                </div>
                <div className="flex bg-white/[0.03] rounded-xl p-[3px] border border-white/[0.04]">
                  {(['1h', '4h', '1d', '7d', '30d'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`flex-1 text-[11px] font-mono py-1.5 rounded-lg transition-all duration-300 ${
                        period === p
                          ? 'bg-gradient-to-b from-[#00EC97]/25 to-[#00EC97]/10 text-[#00EC97] shadow-lg shadow-[#00EC97]/10 font-bold border border-[#00EC97]/20'
                          : 'text-text-muted hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Momentum Scanners ── */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Activity className="w-3 h-3 text-[#00D4FF]/70" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#00D4FF]/70">Momentum Scanner</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setHighlightMode(highlightMode === 'gainers' ? 'none' : 'gainers')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300 border ${
                      highlightMode === 'gainers'
                        ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border-emerald-400/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                        : 'bg-white/[0.02] border-white/[0.04] text-text-muted hover:border-emerald-500/20 hover:text-emerald-400/70'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    🔥 Gainers
                  </button>
                  <button
                    onClick={() => setHighlightMode(highlightMode === 'losers' ? 'none' : 'losers')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300 border ${
                      highlightMode === 'losers'
                        ? 'bg-gradient-to-b from-rose-500/20 to-rose-500/5 border-rose-400/40 text-rose-300 shadow-lg shadow-rose-500/10'
                        : 'bg-white/[0.02] border-white/[0.04] text-text-muted hover:border-rose-500/20 hover:text-rose-400/70'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    💀 Losers
                  </button>
                </div>
              </div>

              {/* ── Separator with glow ── */}
              <div className="relative h-px">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00EC97]/20 to-transparent" />
              </div>

              {/* ── Sector Filter ── */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#9D4EDD]/70">Sector Filter</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => {
                    const catColor = cat !== 'all' ? (CATEGORY_COLORS[cat] || '#64748B') : '#00EC97';
                    return (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all duration-200 border ${
                          filterCategory === cat
                            ? 'font-semibold shadow-sm'
                            : 'bg-white/[0.02] border-white/[0.03] text-text-muted hover:border-white/10 hover:text-text-secondary'
                        }`}
                        style={filterCategory === cat ? {
                          backgroundColor: `${catColor}15`,
                          borderColor: `${catColor}40`,
                          color: catColor,
                          boxShadow: `0 0 12px ${catColor}15`,
                        } : undefined}
                      >
                        {cat === 'all' ? '⚡ All' : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Separator ── */}
              <div className="relative h-px">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF]/15 to-transparent" />
              </div>

              {/* ── Dimension Controls ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#00D4FF]/60 block mb-1.5">◇ Bubble Size</span>
                  <div className="space-y-0.5">
                    {[
                      { key: 'marketCap', label: '◆ MCap' },
                      { key: 'volume', label: '◈ Volume' },
                      { key: 'performance', label: '◉ Move' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setSizeMetric(opt.key as typeof sizeMetric)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] transition-all duration-200 ${
                          sizeMetric === opt.key
                            ? 'text-[#00EC97] bg-[#00EC97]/10 font-semibold border border-[#00EC97]/15'
                            : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03] border border-transparent'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#00D4FF]/60 block mb-1.5">◇ Data Layer</span>
                  <div className="space-y-0.5">
                    {[
                      { key: 'performance', label: '▲ Change %' },
                      { key: 'price', label: '$ Price' },
                      { key: 'volume', label: '≋ Volume' },
                      { key: 'marketCap', label: '◆ MCap' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setBubbleContent(opt.key as typeof bubbleContent)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] transition-all duration-200 ${
                          bubbleContent === opt.key
                            ? 'text-[#00EC97] bg-[#00EC97]/10 font-semibold border border-[#00EC97]/15'
                            : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03] border border-transparent'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Separator ── */}
              <div className="relative h-px">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              </div>

              {/* ── Intelligence Tools ── */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setXrayMode(!xrayMode)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all duration-300 border ${
                    xrayMode
                      ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/15'
                      : 'bg-white/[0.03] border-white/[0.05] text-text-muted hover:border-cyan-500/20 hover:text-cyan-400/70'
                  }`}
                >
                  {xrayMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {xrayMode ? '⚡ X-Ray ON' : '◎ X-Ray'}
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2.5 rounded-xl transition-all duration-300 border ${
                    soundEnabled
                      ? 'bg-[#00EC97]/10 border-[#00EC97]/20 text-[#00EC97]'
                      : 'bg-white/[0.03] border-white/[0.05] text-text-muted hover:text-text-secondary'
                  }`}
                  title={soundEnabled ? 'Sonic: Active' : 'Sonic: Muted'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* ── X-Ray Legend (visible when X-Ray is ON) ── */}
              {xrayMode && (
                <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] px-3 py-2 space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-cyan-400/70">Health Ring Legend</span>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#00FF88' }} />
                    <span className="text-[10px] text-text-muted">Healthy <span className="text-[#00FF88] font-mono">&gt;70</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#FFAA00' }} />
                    <span className="text-[10px] text-text-muted">Caution <span className="text-[#FFAA00] font-mono">40–70</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#FF2244' }} />
                    <span className="text-[10px] text-text-muted">Unhealthy <span className="text-[#FF2244] font-mono">&lt;40</span></span>
                  </div>
                </div>
              )}

              {/* ── Quick Actions ── */}
              <div className="flex gap-1.5">
                <button
                  onClick={handleSnapshot}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] text-text-muted hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
                >
                  <Camera className="w-3 h-3" />
                  Capture
                </button>
                <button
                  onClick={handleShareX}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] text-text-muted hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
                <button
                  onClick={() => initSimulation()}
                  className="p-2 rounded-xl text-text-muted hover:text-[#00EC97] bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-[#00EC97]/20 transition-all duration-200"
                  title="Reset Void Matrix"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* ── Keyboard Shortcuts ── */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowShortcuts(true)}
                  onMouseLeave={() => setShowShortcuts(false)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] text-text-muted hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] transition-all"
                >
                  <Keyboard className="w-3 h-3" />
                  <span className="font-mono">Shortcuts</span>
                </button>
                {showShortcuts && (
                  <div className="absolute left-0 bottom-full mb-2 w-48 bg-[#0a0e14]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl z-50">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#00EC97]/70 mb-2">Keyboard Shortcuts</div>
                    <div className="space-y-1.5 text-[10px] font-mono text-text-muted">
                      <div className="flex justify-between"><span>Fullscreen</span><kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-white">F</kbd></div>
                      <div className="flex justify-between"><span>Search</span><kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-white">S</kbd></div>
                      <div className="flex justify-between"><span>X-Ray Mode</span><kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-white">X</kbd></div>
                      <div className="flex justify-between"><span>Close / Exit</span><kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-white">Esc</kbd></div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Powered By Footer ── */}
              <div className="flex items-center justify-center gap-1 pt-1">
                <span className="text-[8px] font-mono text-text-muted/40 uppercase tracking-widest">Powered by</span>
                <span className="text-[8px] font-mono text-[#00EC97]/50 uppercase tracking-widest font-semibold">Voidspace AI</span>
              </div>
            </div>
            
            {/* Animated bottom accent */}
            <div className="relative h-[2px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9D4EDD]/40 via-[#00D4FF]/60 to-[#00EC97]/40" />
            </div>
          </div>
        </div>

        {/* CSS Animations for panel */}
        <style jsx>{`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes shimmer-sweep {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>

      {/* Mobile Panel Toggle — 44px min touch target */}
      <div className="sm:hidden absolute top-4 left-4 z-20">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowMobilePanel(true)}
          className="min-h-[44px] min-w-[44px] px-3"
        >
          <Settings className="w-4 h-4 mr-1" />
          Controls
        </Button>
      </div>

      {/* Mobile Panel + Backdrop */}
      <AnimatePresence>
        {showMobilePanel && (
          <>
          {/* Tap-outside backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sm:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowMobilePanel(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="sm:hidden fixed top-0 left-0 h-full w-80 z-50 bg-surface/70 backdrop-blur-xl border-r border-white/5 shadow-2xl overflow-y-auto"
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">Controls</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobilePanel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Time Period */}
                <div>
                  <p className="text-sm text-text-muted mb-2">Time Period</p>
                  <div className="flex flex-wrap gap-1">
                    {(['1h', '4h', '1d', '7d', '30d'] as const).map((p) => (
                      <Button
                        key={p}
                        size="sm"
                        variant={period === p ? 'primary' : 'ghost'}
                        onClick={() => { setPeriod(p); setShowMobilePanel(false); }}
                        className="text-xs min-h-[44px] min-w-[44px]"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div>
                  <p className="text-sm text-text-muted mb-2">Highlights</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={highlightMode === 'gainers' ? 'primary' : 'secondary'}
                      onClick={() => { setHighlightMode(highlightMode === 'gainers' ? 'none' : 'gainers'); setShowMobilePanel(false); }}
                      className="text-xs flex-1 min-h-[44px]"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Gainers
                    </Button>
                    <Button
                      size="sm"
                      variant={highlightMode === 'losers' ? 'primary' : 'secondary'}
                      onClick={() => { setHighlightMode(highlightMode === 'losers' ? 'none' : 'losers'); setShowMobilePanel(false); }}
                      className="text-xs flex-1 min-h-[44px]"
                    >
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Losers
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-sm text-text-muted mb-2">Category Filter</p>
                  <div className="flex flex-wrap gap-1">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        size="sm"
                        variant={filterCategory === cat ? 'primary' : 'ghost'}
                        onClick={() => { setFilterCategory(cat); setShowMobilePanel(false); }}
                        className="text-xs min-h-[44px]"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Size Metric */}
                <div>
                  <p className="text-sm text-text-muted mb-2">Size Bubbles By</p>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'marketCap', label: 'Market Cap' },
                      { key: 'volume', label: 'Volume' },
                      { key: 'performance', label: 'Performance' },
                    ].map((opt) => (
                      <Button
                        key={opt.key}
                        size="sm"
                        variant={sizeMetric === opt.key ? 'primary' : 'ghost'}
                        onClick={() => { setSizeMetric(opt.key as typeof sizeMetric); setShowMobilePanel(false); }}
                        className="text-xs justify-start min-h-[44px]"
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bubble Content */}
                <div>
                  <p className="text-sm text-text-muted mb-2">Display Content</p>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'performance', label: 'Price Change %' },
                      { key: 'price', label: 'Current Price' },
                      { key: 'volume', label: '24h Volume' },
                      { key: 'marketCap', label: 'Market Cap' },
                    ].map((opt) => (
                      <Button
                        key={opt.key}
                        size="sm"
                        variant={bubbleContent === opt.key ? 'primary' : 'ghost'}
                        onClick={() => { setBubbleContent(opt.key as typeof bubbleContent); setShowMobilePanel(false); }}
                        className="text-xs justify-start min-h-[44px]"
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant={xrayMode ? 'primary' : 'secondary'}
                    onClick={() => setXrayMode(!xrayMode)}
                    className="w-full text-xs"
                  >
                    {xrayMode ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                    {xrayMode ? 'Exit X-Ray Mode' : 'Enable X-Ray Mode'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="w-full text-xs"
                  >
                    {soundEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
                    {soundEnabled ? 'Sound On' : 'Sound Off'}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSnapshot}
                    className="w-full text-xs"
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    Export Screenshot
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShareX}
                    className="w-full text-xs"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Share on X
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => initSimulation()}
                    className="w-full text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset Layout
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Visualization Area */}
      <div ref={containerRef} className="w-full h-full touch-manipulation">
        <svg ref={svgRef} className="w-full h-full" style={{ willChange: 'transform' }} />
      </div>

      {/* ═══ BUBBLE SIZE LEGEND — Bottom Left ═══ */}
      <div className="hidden sm:flex absolute bottom-10 left-4 z-20 items-center gap-3 px-3 py-2 rounded-xl bg-[#060a0f]/80 backdrop-blur-xl border border-white/[0.06]">
        <span className="text-[8px] font-mono uppercase tracking-wider text-text-muted/60">Size:</span>
        {[
          { r: 6, label: 'Low' },
          { r: 12, label: 'Mid' },
          { r: 20, label: 'High' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <svg width={item.r * 2 + 2} height={item.r * 2 + 2}>
              <circle cx={item.r + 1} cy={item.r + 1} r={item.r} fill="none" stroke="#00EC97" strokeWidth={1} opacity={0.5} />
            </svg>
            <span className="text-[9px] font-mono text-text-muted/70">{item.label}</span>
          </div>
        ))}
        <span className="text-[8px] font-mono text-[#00EC97]/50">
          {sizeMetric === 'marketCap' ? 'MCap' : sizeMetric === 'volume' ? 'Volume' : 'Performance'}
        </span>
      </div>

      {/* ═══ TOP MOVERS — Quick Access Pills ═══ */}
      {(() => {
        if (!showMovers || filteredTokens.length === 0) return null;
        const sorted = [...filteredTokens].sort((a, b) => getCurrentPriceChange(b) - getCurrentPriceChange(a));
        const gainers = sorted.slice(0, 3).filter(t => getCurrentPriceChange(t) > 0);
        const losers = sorted.slice(-3).filter(t => getCurrentPriceChange(t) < 0).reverse();
        if (gainers.length === 0 && losers.length === 0) return null;
        return (
          <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1">
            <button
              onClick={() => setShowMovers(false)}
              className="text-[8px] font-mono text-text-muted/50 hover:text-text-muted mb-0.5 self-end"
            >
              ✕ hide
            </button>
            {gainers.map(t => (
              <button
                key={t.id}
                onClick={() => handleShowPopup(t.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <span className="text-[10px] font-mono font-bold text-emerald-400">{t.symbol}</span>
                <span className="text-[10px] font-mono text-emerald-300">+{getCurrentPriceChange(t).toFixed(1)}%</span>
              </button>
            ))}
            {gainers.length > 0 && losers.length > 0 && (
              <div className="w-8 h-px bg-white/10 my-0.5" />
            )}
            {losers.map(t => (
              <button
                key={t.id}
                onClick={() => handleShowPopup(t.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <span className="text-[10px] font-mono font-bold text-rose-400">{t.symbol}</span>
                <span className="text-[10px] font-mono text-rose-300">{getCurrentPriceChange(t).toFixed(1)}%</span>
              </button>
            ))}
          </div>
        );
      })()}
      {!showMovers && filteredTokens.length > 0 && (
        <button
          onClick={() => setShowMovers(true)}
          className="absolute top-4 right-4 z-20 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[9px] font-mono text-text-muted hover:text-white transition-all"
        >
          📊 Movers
        </button>
      )}

      {/* Branding Bar — always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-px bg-gradient-to-r from-transparent via-near-green/20 to-transparent" />
        <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 bg-[#04060b]/60 backdrop-blur-xl">
          {/* Left: Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-near-green" />
              <span className="text-xs font-mono text-text-muted">
                {filteredTokens.length} tokens
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-text-muted" />
              <span className="text-xs font-mono text-text-muted">
                {period} view
              </span>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center">
            <VoidspaceLogo size="sm" className="opacity-60" />
          </div>

          {/* Right: Period indicator for mobile */}
          <div className="sm:hidden">
            <Badge variant="default" className="text-xs font-mono">
              {period}
            </Badge>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs text-text-muted">
              © 2026 Voidspace
            </span>
          </div>
        </div>
      </div>

      {/* Search — positioned directly above branding bar */}
      <div className="absolute bottom-10 right-4 z-30">
        <AnimatePresence>
          {showSearch ? (
            <motion.div
              initial={{ width: 44, opacity: 0.8 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 44, opacity: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-2 bg-surface/60 backdrop-blur-xl border border-white/10 rounded-lg p-2 shadow-xl"
            >
              <Search className="w-4 h-4 text-near-green shrink-0" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('');
                    setShowSearch(false);
                  }
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-text-primary placeholder-text-muted"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                }}
                className="p-1 hover:bg-surface-hover rounded transition-colors shrink-0"
              >
                <X className="w-3 h-3 text-text-muted" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(true)}
              className="flex items-center justify-center w-11 h-11 bg-surface/60 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl hover:border-near-green/30 transition-all group"
            >
              <Search className="w-4 h-4 text-near-green group-hover:text-near-green" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside handler for popup card (z-40 backdrop, below popup z-50) */}
      {popupCard && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setPopupCard(null)}
        />
      )}

      {/* **NEW: Popup Card** */}
      {renderPopupCard()}

      {/* Hover Tooltip & Token Profile Panel */}
      <AnimatePresence>
        {renderHoverTooltip()}
        {renderTokenAnatomy()}
      </AnimatePresence>
    </div>
  );
}