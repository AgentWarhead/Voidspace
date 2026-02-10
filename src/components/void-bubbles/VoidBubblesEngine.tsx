'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, RotateCcw, Clock, Activity, X, Copy, ExternalLink,
  TrendingUp, TrendingDown, Search, Settings, Brain, Link,
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
  // Social links
  website?: string;
  twitter?: string;
  telegram?: string;
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
  const [popupCard, setPopupCard] = useState<{ token: VoidBubbleToken; position: { x: number; y: number } } | null>(null);
  
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

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000); // Refresh every 60s
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
  const handleShowPopup = useCallback((tokenId: string, event: { clientX: number; clientY: number }) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token || !containerRef.current) return;

    // Use viewport coordinates for fixed positioning
    const x = event.clientX;
    const y = event.clientY;
    
    setPopupCard({ token, position: { x, y } });
  }, [tokens]);

  // **NEW: Premium Popup Card Component**
  const renderPopupCard = () => {
    if (!popupCard) return null;

    const { token, position } = popupCard;
    const currentChange = getCurrentPriceChange(token);
    const healthStatus = getHealthStatus(token.healthScore);
    const intelBrief = generateIntelBrief(token);
    const supplyConcentration = getSupplyConcentration(token);
    const volLiqRatio = token.liquidity > 0 ? token.volume24h / token.liquidity : 0;
    const isPositive = currentChange >= 0;
    const accentColor = isPositive ? '#00EC97' : '#FF3366';
    const accentBg = isPositive ? 'rgba(0,236,151,' : 'rgba(255,51,102,';

    // Position the card (mobile = centered, desktop = near bubble)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const clampedX = Math.min(position.x + 20, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 420);
    const clampedY = Math.max(20, Math.min(position.y - 200, (typeof window !== 'undefined' ? window.innerHeight : 800) - 600));
    const cardStyle: React.CSSProperties = isMobile 
      ? { left: '1rem', right: '1rem', top: '50%', transform: 'translateY(-50%)' }
      : { left: clampedX, top: clampedY };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed z-50 w-[380px]"
          style={cardStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Outer glow */}
          <div className="absolute -inset-px rounded-2xl opacity-60" style={{
            background: `linear-gradient(135deg, ${accentBg}0.3), ${accentBg}0.1), transparent, ${accentBg}0.2))`,
          }} />
          
          <div className="relative bg-[#080b11]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.08] overflow-hidden">
            {/* Top accent line */}
            <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />
            
            {/* Header — token identity with momentum indicator */}
            <div className="p-4 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border"
                      style={{ 
                        borderColor: `${accentBg}0.2)`, 
                        backgroundColor: `${accentBg}0.08)`,
                        color: accentColor 
                      }}>
                      {token.category}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      {token.symbol}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{token.name}</h3>
                </div>
                <button
                  onClick={() => setPopupCard(null)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price hero section */}
            <div className="px-4 pt-3 pb-4">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-white font-mono tracking-tight">
                  {formatPrice(token.price)}
                </span>
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-lg font-bold font-mono mb-0.5"
                  style={{ color: accentColor }}
                >
                  {isPositive ? '▲' : '▼'} {Math.abs(currentChange).toFixed(1)}%
                </motion.span>
              </div>
              
              {/* Timeframe pills */}
              <div className="flex gap-1.5 mt-3">
                {[
                  { label: '1H', value: token.priceChange1h },
                  { label: '6H', value: token.priceChange6h },
                  { label: '24H', value: token.priceChange24h },
                  { label: '7D', value: token.priceChange24h * 1.5 },
                ].map(({ label, value }) => (
                  <div key={label} className={cn(
                    "flex-1 text-center py-1.5 rounded-lg font-mono text-[11px] font-semibold border",
                    value >= 0 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  )}>
                    {label}: {value >= 0 ? '+' : ''}{value.toFixed(1)}%
                  </div>
                ))}
              </div>
            </div>

            {/* Divider with glow */}
            <div className="h-px mx-4" style={{ background: `linear-gradient(90deg, transparent, ${accentBg}0.15), transparent)` }} />

            {/* Market metrics grid */}
            <div className="grid grid-cols-2 gap-px bg-white/[0.03] mx-4 my-3 rounded-xl overflow-hidden border border-white/[0.04]">
              {[
                { label: 'Market Cap', value: formatCompact(token.marketCap), icon: '◆' },
                { label: '24h Volume', value: formatCompact(token.volume24h), icon: '◈' },
                { label: 'Liquidity', value: formatCompact(token.liquidity), icon: '◇' },
                { label: 'Vol/Liq', value: volLiqRatio.toFixed(2), icon: '⟡', warn: volLiqRatio > 2 },
              ].map(({ label, value, icon, warn }) => (
                <div key={label} className="bg-[#0a0f14]/60 p-3">
                  <div className="text-[10px] text-text-muted font-mono uppercase tracking-wider">{icon} {label}</div>
                  <div className={cn("text-sm font-mono font-bold mt-0.5", warn ? "text-amber-400" : "text-white")}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Health Score — animated bar */}
            <div className="mx-4 mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Health Score</span>
                <span className={cn("text-sm font-bold font-mono", {
                  'text-emerald-400': healthStatus === 'healthy',
                  'text-amber-400': healthStatus === 'medium',
                  'text-rose-400': healthStatus === 'unhealthy'
                })}>
                  {token.healthScore}<span className="text-text-muted font-normal">/100</span>
                </span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${token.healthScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={cn("h-full rounded-full", {
                    'bg-gradient-to-r from-emerald-500 to-emerald-400': healthStatus === 'healthy',
                    'bg-gradient-to-r from-amber-500 to-yellow-400': healthStatus === 'medium',
                    'bg-gradient-to-r from-rose-600 to-rose-400': healthStatus === 'unhealthy'
                  })}
                />
              </div>
              {/* Risk tags */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded border", {
                  'border-emerald-500/20 text-emerald-400 bg-emerald-500/10': token.riskLevel === 'low',
                  'border-amber-500/20 text-amber-400 bg-amber-500/10': token.riskLevel === 'medium',
                  'border-rose-500/20 text-rose-400 bg-rose-500/10': token.riskLevel === 'high',
                  'border-rose-500/30 text-rose-300 bg-rose-500/20': token.riskLevel === 'critical',
                })}>
                  {token.riskLevel.toUpperCase()} RISK
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/[0.06] text-text-muted bg-white/[0.02]">
                  Supply: {supplyConcentration}
                </span>
                {token.riskFactors.slice(0, 2).map((factor, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/[0.06] text-text-muted bg-white/[0.02]">
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Intelligence — premium card */}
            <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-[#00EC97]/15">
              <div className="bg-gradient-to-br from-[#00EC97]/[0.08] to-transparent p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md bg-[#00EC97]/20 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-[#00EC97]" />
                  </div>
                  <span className="text-xs font-semibold text-[#00EC97] tracking-wide">AI Intelligence Brief</span>
                </div>
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  {intelBrief}
                </p>
              </div>
            </div>

            {/* Action buttons — prominent CTAs */}
            <div className="px-4 pb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`https://dexscreener.com/near/${token.contractAddress}`, '_blank')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-[#00EC97]/15 border border-[#00EC97]/25 text-[#00EC97] hover:bg-[#00EC97]/25 transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  DexScreener
                </button>
                <button
                  onClick={() => window.open(`https://app.ref.finance/#near|${token.contractAddress}`, '_blank')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-white/[0.04] border border-white/[0.08] text-text-secondary hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ref Finance
                </button>
              </div>
              {(token.website || token.twitter) && (
                <div className="flex gap-2 mt-2">
                  {token.website && (
                    <button
                      onClick={() => window.open(token.website, '_blank')}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] text-text-muted hover:text-text-secondary bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all"
                    >
                      <Link className="w-3 h-3" />
                      Website
                    </button>
                  )}
                  {token.twitter && (
                    <button
                      onClick={() => window.open(token.twitter, '_blank')}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] text-text-muted hover:text-text-secondary bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Twitter
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Contract footer */}
            <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.04]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-text-muted">
                    {token.contractAddress.slice(0, 8)}...{token.contractAddress.slice(-6)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(token.contractAddress)}
                    className="p-1 rounded hover:bg-white/[0.06] text-text-muted hover:text-[#00EC97] transition-all"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[9px] font-mono text-text-muted/50">
                  {formatDate(token.detectedAt)}
                </span>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)` }} />
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

    // Push nearby bubbles with enhanced force
    nodesRef.current.forEach(other => {
      if (other.id === tokenId || !other.x || !other.y || !node.x || !node.y) return;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxRadius && dist > 0) {
        const force = (1 - dist / maxRadius) * intensity * 50; // Increased force
        other.vx = (other.vx || 0) + (dx / dist) * force;
        other.vy = (other.vy || 0) + (dy / dist) * force;
      }
    });

    simulationRef.current?.alpha(0.4).restart();
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

    const interval = setInterval(generateWhaleAlert, 20000 + Math.random() * 25000);
    // First alert after 5 seconds
    const firstTimeout = setTimeout(generateWhaleAlert, 5000);

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
    const maxRadius = isMobile ? Math.min(width, height) * 0.07 : Math.min(width, height) * 0.065;
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

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
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
    svg.append('g').attr('class', 'background-layer');
    svg.append('g').attr('class', 'connection-lines-layer'); // **NEW: For capital flow hints**
    svg.append('g').attr('class', 'shockwave-layer');

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
    bubbleGroups.filter(d => d.targetRadius >= 8)
      .append('text')
      .attr('class', 'bubble-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('dy', d => d.targetRadius >= 26 ? '-0.35em' : '0')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', d => Math.min(d.targetRadius * 0.45, 14))
      .attr('font-weight', '700')
      .attr('fill', '#ffffff')
      .style('text-shadow', '0 2px 6px rgba(0,0,0,0.9)')
      .style('pointer-events', 'none')
      .text(d => d.token.symbol);

    // Enhanced floating content — price/volume/performance based on bubbleContent setting
    // Only show on larger bubbles to keep smaller ones clean
    bubbleGroups.filter(d => d.targetRadius >= 30)
      .append('text')
      .attr('class', 'bubble-content')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('dy', d => d.targetRadius >= 26 ? '0.8em' : '1.2em')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', d => Math.min(d.targetRadius * 0.25, 10))
      .attr('font-weight', 'bold')
      .attr('opacity', 0.9)
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)')
      .style('pointer-events', 'none')
      .attr('fill', (d: BubbleNode) => {
        const currentChange = getCurrentPriceChange(d.token);
        return currentChange >= 0 ? '#00EC97' : '#FF3366';
      })
      .text((d: BubbleNode) => {
        const currentChange = getCurrentPriceChange(d.token);
        switch (bubbleContent) {
          case 'price': return formatPrice(d.token.price);
          case 'volume': return formatCompact(d.token.volume24h);
          case 'marketCap': return formatCompact(d.token.marketCap);
          default: // performance
            return `${currentChange >= 0 ? '+' : ''}${currentChange.toFixed(1)}%`;
        }
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
        .radius(d => d.targetRadius * (xrayMode ? 1.5 : 1.35) + 6)
        .strength(0.95)
        .iterations(4)
      )
      .alphaDecay(0.015) // Slow decay for organic settling
      .alpha(0.6)
      .velocityDecay(0.4); // Higher friction for floaty feel

    // Store simulation reference
    simulationRef.current = simulation;

    // Animation loop with enhanced performance monitoring
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const tick = (currentTime: number) => {
      if (currentTime - lastFrameTime >= frameInterval) {
        // Soft boundary — gently push bubbles back when they drift out
        const margin = 40;
        nodes.forEach(d => {
          const r = d.targetRadius;
          if (d.x !== undefined) {
            if (d.x - r < margin) d.vx = (d.vx || 0) + 0.5;
            if (d.x + r > width - margin) d.vx = (d.vx || 0) - 0.5;
          }
          if (d.y !== undefined) {
            if (d.y - r < margin) d.vy = (d.vy || 0) + 0.5;
            if (d.y + r > height - margin) d.vy = (d.vy || 0) - 0.5;
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

    // Animate bubbles in with staggered entrance
    bubbleGroups.each(function(d, i) {
      const group = d3.select(this);
      
      // Delay based on distance from center for ripple effect
      const delay = i * 30; // Faster stagger for premium feel
      
      setTimeout(() => {
        // Animate radius growth
        group.selectAll('circle')
          .transition()
          .duration(800)
          .ease(d3.easeElasticOut.amplitude(1).period(0.3))
          .attr('r', function() {
            const className = d3.select(this).attr('class');
            if (className?.includes('bubble-main')) return d.targetRadius;
            if (className?.includes('bubble-glow')) return d.targetRadius + 4;
            if (className?.includes('bubble-outer-ring')) return d.targetRadius + 8;
            if (className?.includes('xray-ring')) return d.targetRadius + 12;
            return d.targetRadius;
          });
        
        // Animate labels with slight delay for premium cascade effect
        setTimeout(() => {
          group.selectAll('text')
            .attr('opacity', 0)
            .transition()
            .duration(400)
            .ease(d3.easeCubicOut)
            .attr('opacity', function() {
              const className = d3.select(this).attr('class');
              if (className?.includes('skull-overlay')) return d.token.riskLevel === 'critical' ? 0.7 : 0.4;
              return 1;
            });
        }, 200);
      }, delay);
    });

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
      
      highVolTokens.forEach(d => {
        bubbleGroups.filter(node => node.id === d.id)
          .select('.bubble-main')
          .classed('whale-pulse', true);
      });
    }

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
  }, [filteredTokens, sizeMetric, bubbleContent, xrayMode, pulseMode, period, highlightMode, getCurrentPriceChange, handleShowPopup, selectedToken, categories]);

  // Handle window resize with proper debounce
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initSimulation();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [initSimulation]);

  // Initialize on mount and when dependencies change
  useEffect(() => {
    if (filteredTokens.length > 0) {
      initSimulation();
    }
  }, [initSimulation]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
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
    
    // Create canvas for export
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Draw dark background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Convert SVG to image (simplified for now)
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      
      // Download
      const link = document.createElement('a');
      link.download = `voidspace-bubbles-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      URL.revokeObjectURL(url);
    };
    img.src = url;
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
      {/* Power Bar — Desktop: Premium Glassmorphism Panel */}
      <div className="hidden sm:block absolute top-4 left-4 z-20 w-56">
        <div className="bg-[#0a0f14]/80 backdrop-blur-2xl border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Accent glow line at top */}
          <div className="h-px bg-gradient-to-r from-transparent via-near-green/40 to-transparent" />
          
          <div className="p-4 space-y-4">
            {/* Timeframe — pill selector */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3 h-3 text-near-green/70" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Timeframe</span>
              </div>
              <div className="flex bg-white/[0.04] rounded-lg p-0.5">
                {(['1h', '4h', '1d', '7d', '30d'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`flex-1 text-[11px] font-mono py-1.5 rounded-md transition-all duration-200 ${
                      period === p
                        ? 'bg-near-green/20 text-near-green shadow-sm shadow-near-green/10 font-semibold'
                        : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Movers */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Activity className="w-3 h-3 text-near-green/70" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Movers</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setHighlightMode(highlightMode === 'gainers' ? 'none' : 'gainers')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 border ${
                    highlightMode === 'gainers'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-white/[0.03] border-white/[0.06] text-text-muted hover:border-emerald-500/20 hover:text-emerald-400/70'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  Gainers
                </button>
                <button
                  onClick={() => setHighlightMode(highlightMode === 'losers' ? 'none' : 'losers')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 border ${
                    highlightMode === 'losers'
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                      : 'bg-white/[0.03] border-white/[0.06] text-text-muted hover:border-rose-500/20 hover:text-rose-400/70'
                  }`}
                >
                  <TrendingDown className="w-3 h-3" />
                  Losers
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Category Filter */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Category</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-200 border ${
                      filterCategory === cat
                        ? 'bg-near-green/15 border-near-green/30 text-near-green'
                        : 'bg-white/[0.02] border-white/[0.04] text-text-muted hover:border-white/10 hover:text-text-secondary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Size & Display — compact two-column */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-1.5">Size</span>
                <div className="space-y-0.5">
                  {[
                    { key: 'marketCap', label: 'MCap', icon: '◆' },
                    { key: 'volume', label: 'Vol', icon: '◈' },
                    { key: 'performance', label: 'Δ Move', icon: '◉' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSizeMetric(opt.key as typeof sizeMetric)}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] transition-all duration-150 ${
                        sizeMetric === opt.key
                          ? 'text-near-green bg-near-green/10 font-medium'
                          : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="mr-1 opacity-50">{opt.icon}</span>{opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-1.5">Show</span>
                <div className="space-y-0.5">
                  {[
                    { key: 'performance', label: 'Δ%', icon: '▲' },
                    { key: 'price', label: 'Price', icon: '$' },
                    { key: 'volume', label: 'Vol', icon: '≋' },
                    { key: 'marketCap', label: 'MCap', icon: '◆' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setBubbleContent(opt.key as typeof bubbleContent)}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] transition-all duration-150 ${
                        bubbleContent === opt.key
                          ? 'text-near-green bg-near-green/10 font-medium'
                          : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="mr-1 opacity-50 font-mono text-[9px]">{opt.icon}</span>{opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Tools Row */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setXrayMode(!xrayMode)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-200 border ${
                  xrayMode
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-500/10'
                    : 'bg-white/[0.03] border-white/[0.06] text-text-muted hover:border-cyan-500/20'
                }`}
              >
                {xrayMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                X-Ray
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-all duration-200 border ${
                  soundEnabled
                    ? 'bg-near-green/10 border-near-green/20 text-near-green'
                    : 'bg-white/[0.03] border-white/[0.06] text-text-muted hover:text-text-secondary'
                }`}
                title={soundEnabled ? 'Sound On' : 'Sound Off'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex gap-1">
              <button
                onClick={handleSnapshot}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] text-text-muted hover:text-text-secondary bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-200"
              >
                <Camera className="w-3 h-3" />
                Export
              </button>
              <button
                onClick={handleShareX}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] text-text-muted hover:text-text-secondary bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-200"
              >
                <Share2 className="w-3 h-3" />
                Share
              </button>
              <button
                onClick={() => initSimulation()}
                className="p-1.5 rounded-lg text-text-muted hover:text-near-green bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-200"
                title="Reset Layout"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Bottom accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-near-green/20 to-transparent" />
        </div>
      </div>

      {/* Mobile Panel Toggle */}
      <div className="sm:hidden absolute top-4 left-4 z-20">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowMobilePanel(true)}
        >
          <Settings className="w-4 h-4 mr-1" />
          Controls
        </Button>
      </div>

      {/* Mobile Panel */}
      <AnimatePresence>
        {showMobilePanel && (
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
                        onClick={() => setPeriod(p)}
                        className="text-xs"
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
                      onClick={() => setHighlightMode(highlightMode === 'gainers' ? 'none' : 'gainers')}
                      className="text-xs flex-1"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Gainers
                    </Button>
                    <Button
                      size="sm"
                      variant={highlightMode === 'losers' ? 'primary' : 'secondary'}
                      onClick={() => setHighlightMode(highlightMode === 'losers' ? 'none' : 'losers')}
                      className="text-xs flex-1"
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
                        onClick={() => setFilterCategory(cat)}
                        className="text-xs"
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
                        onClick={() => setSizeMetric(opt.key as typeof sizeMetric)}
                        className="text-xs justify-start"
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
                        onClick={() => setBubbleContent(opt.key as typeof bubbleContent)}
                        className="text-xs justify-start"
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
        )}
      </AnimatePresence>

      {/* Main Visualization Area */}
      <div ref={containerRef} className="w-full h-full">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

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