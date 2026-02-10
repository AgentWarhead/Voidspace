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
  const [clickTimeouts, setClickTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<BubbleNode, undefined> | null>(null);
  const nodesRef = useRef<BubbleNode[]>([]);
  const sonicRef = useRef(new SonicEngine());
  const animFrameRef = useRef<number>(0);

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

    // Position the card (mobile = centered, desktop = near bubble)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // Clamp position so card doesn't overflow viewport
    const clampedX = Math.min(position.x + 20, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 420);
    const clampedY = Math.max(20, Math.min(position.y - 200, (typeof window !== 'undefined' ? window.innerHeight : 800) - 500));
    const cardStyle: React.CSSProperties = isMobile 
      ? { left: '1rem', right: '1rem', top: '50%', transform: 'translateY(-50%)' }
      : { left: clampedX, top: clampedY };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="fixed z-50 max-w-sm"
          style={cardStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-[#0a0a0f]/95 backdrop-blur-xl border-[#00EC97]/30 shadow-2xl shadow-[#00EC97]/10">
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-mono">
                    {token.category}
                  </Badge>
                  <button
                    onClick={() => setPopupCard(null)}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{token.name}</h3>
                <p className="text-text-muted font-mono text-sm">{token.symbol}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{formatPrice(token.price)}</span>
                  <Badge 
                    variant={currentChange >= 0 ? "default" : "destructive"}
                    className="font-mono text-xs"
                  >
                    {currentChange >= 0 ? '+' : ''}{currentChange.toFixed(1)}%
                  </Badge>
                </div>

                {/* Price Performance Row */}
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs font-mono">
                    1H: {token.priceChange1h >= 0 ? '+' : ''}{token.priceChange1h.toFixed(1)}%
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono">
                    6H: {token.priceChange6h >= 0 ? '+' : ''}{token.priceChange6h.toFixed(1)}%
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono">
                    24H: {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              {/* Market Data Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-text-muted">Market Cap</p>
                  <p className="font-mono font-semibold">{formatCompact(token.marketCap)}</p>
                </div>
                <div>
                  <p className="text-text-muted">24h Volume</p>
                  <p className="font-mono font-semibold">{formatCompact(token.volume24h)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Liquidity</p>
                  <p className="font-mono font-semibold">{formatCompact(token.liquidity)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Vol/Liq Ratio</p>
                  <p className="font-mono font-semibold">{volLiqRatio.toFixed(2)}</p>
                </div>
              </div>

              {/* Health & Risk Section */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health Score</span>
                    <span className={cn("font-bold", {
                      'text-green-400': healthStatus === 'healthy',
                      'text-yellow-400': healthStatus === 'medium',
                      'text-red-400': healthStatus === 'unhealthy'
                    })}>
                      {token.healthScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={cn("h-2 rounded-full transition-all", {
                        'bg-green-400': healthStatus === 'healthy',
                        'bg-yellow-400': healthStatus === 'medium',
                        'bg-red-400': healthStatus === 'unhealthy'
                      })}
                      style={{ width: `${token.healthScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    {healthStatus === 'healthy' ? 'Healthy' : healthStatus === 'medium' ? 'Caution' : 'Danger'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={token.riskLevel === 'low' ? 'default' : token.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                    Risk: {token.riskLevel.charAt(0).toUpperCase() + token.riskLevel.slice(1)}
                  </Badge>
                </div>

                {token.riskFactors.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {token.riskFactors.map((factor, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Intelligence Brief */}
              <div className="border border-[#00EC97]/20 rounded-lg p-3 bg-[#00EC97]/5">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-[#00EC97]" />
                  <span className="text-sm font-semibold text-[#00EC97]">AI Intelligence</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {intelBrief}
                </p>
              </div>

              {/* Supply Concentration Indicator */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Supply Concentration:</span>
                <Badge 
                  variant={supplyConcentration === 'Low' ? 'default' : supplyConcentration === 'High' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {supplyConcentration}
                  {volLiqRatio < 0.05 && token.marketCap > 1000000 && (
                    <span className="ml-1">⚠️</span>
                  )}
                </Badge>
              </div>

              {/* Quick Links Row */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`https://dexscreener.com/near/${token.contractAddress}`, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  DexScreener
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`https://app.ref.finance/#near|${token.contractAddress}`, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ref Finance
                </Button>
                {token.website && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(token.website, '_blank')}
                    className="text-xs"
                  >
                    <Link className="w-3 h-3 mr-1" />
                    Website
                  </Button>
                )}
                {token.twitter && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(token.twitter, '_blank')}
                    className="text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Twitter
                  </Button>
                )}
              </div>

              {/* Contract Address */}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Contract:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono">
                      {token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(token.contractAddress)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-text-muted border-t border-border pt-2">
                <p>First detected: {formatDate(token.detectedAt)}</p>
                <p>Category: {token.category}</p>
              </div>
            </div>
          </Card>
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

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

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
    const radiusScale = d3.scaleLog()
      .domain([minValue, maxValue])
      .range([10, Math.min(width, height) * 0.09])
      .clamp(true);

    // Create nodes
    const nodes: BubbleNode[] = filteredTokens.map((token, i) => {
      const angle = (i / filteredTokens.length) * 2 * Math.PI;
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

      // Spiral spawn for even distribution
      const spiralR = spread * 0.3 + (i / filteredTokens.length) * spread * 0.5;
      return {
        id: token.id,
        token,
        radius: 0,
        targetRadius: r,
        color: bubbleColor,
        glowColor,
        x: centerX + Math.cos(angle * 3) * spiralR,
        y: centerY + Math.sin(angle * 3) * spiralR,
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
        // Dynamic opacity based on bubble size and performance
        const currentChange = getCurrentPriceChange(d.token);
        const baseOpacity = 0.45;
        const performanceBonus = Math.min(Math.abs(currentChange) / 50, 0.2);
        const sizeBonus = Math.min(d.targetRadius / 100, 0.15);
        return Math.min(baseOpacity + performanceBonus + sizeBonus, 0.8);
      })
      .attr('filter', 'url(#bubble-glow)');

    // **NEW: Whale Activity Pulse - Add whale indicator for high volume tokens**
    bubbleGroups.filter(d => d.token.volume24h > d.token.liquidity * 2)
      .append('text')
      .attr('class', 'whale-indicator')
      .attr('x', d => d.targetRadius + 8)
      .attr('y', d => -d.targetRadius - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12')
      .attr('opacity', 0)
      .text('🐋')
      .transition().duration(1000)
      .attr('opacity', 0.8);

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
      .attr('opacity', 0.92);

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
    bubbleGroups.filter(d => d.targetRadius >= 18)
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
        // **NEW: Connection Lines on Hover**
        const sameCategoryNodes = nodes.filter(node => 
          node.token.category === d.token.category && node.id !== d.id
        );
        
        // Draw connection lines to same category tokens
        sameCategoryNodes.forEach(targetNode => {
          if (!d.x || !d.y || !targetNode.x || !targetNode.y) return;
          
          connectionLinesLayer
            .append('line')
            .attr('class', 'connection-line')
            .attr('x1', d.x)
            .attr('y1', d.y)
            .attr('x2', targetNode.x)
            .attr('y2', targetNode.y)
            .attr('stroke', CATEGORY_COLORS[d.token.category] || '#64748B')
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0)
            .attr('stroke-dasharray', '3,3')
            .transition().duration(300)
            .attr('stroke-opacity', 0.3);
        });

        // Enhanced hover effects
        setHoveredToken(d.token);
        setHoverPos({ x: event.layerX, y: event.layerY });
        
        // Highlight the bubble
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
        // **NEW: Remove connection lines**
        connectionLinesLayer.selectAll('.connection-line')
          .transition().duration(200)
          .attr('stroke-opacity', 0)
          .remove();

        setHoveredToken(null);
        
        // Reset bubble appearance
        d3.select(this).select('.bubble-main')
          .transition().duration(200)
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.4);
        
        d3.select(this).select('.bubble-glow')
          .transition().duration(200)
          .attr('stroke-width', 3.5)
          .attr('opacity', d => {
            const currentChange = getCurrentPriceChange(d.token);
            const baseOpacity = 0.45;
            const performanceBonus = Math.min(Math.abs(currentChange) / 50, 0.2);
            const sizeBonus = Math.min(d.targetRadius / 100, 0.15);
            return Math.min(baseOpacity + performanceBonus + sizeBonus, 0.8);
          });
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        const tokenId = d.token.id;
        
        // Check for existing timeout (double-click detection)
        const existingTimeout = clickTimeouts.get(tokenId);
        if (existingTimeout) {
          // Double-click detected - open side panel
          clearTimeout(existingTimeout);
          setClickTimeouts(prev => {
            const newMap = new Map(prev);
            newMap.delete(tokenId);
            return newMap;
          });
          
          setSelectedToken(d.token);
          
          // Play sounds for double-click
          const currentChange = getCurrentPriceChange(d.token);
          if (currentChange > 5) sonicRef.current.playPump(Math.min(currentChange / 30, 1));
          else if (currentChange < -5) sonicRef.current.playDump(Math.min(Math.abs(currentChange) / 30, 1));
          if (d.token.riskLevel === 'critical') sonicRef.current.playRisk();
        } else {
          // **NEW: Single-click - Show popup card instead of expanding bubble**
          const timeout = setTimeout(() => {
            handleShowPopup(tokenId, event);
            setClickTimeouts(prev => {
              const newMap = new Map(prev);
              newMap.delete(tokenId);
              return newMap;
            });
          }, 250); // 250ms window for double-click
          
          setClickTimeouts(prev => {
            const newMap = new Map(prev);
            newMap.set(tokenId, timeout);
            return newMap;
          });
        }
      });

    // Force simulation — enhanced spacing for better mobile UX
    const isMobile = width < 768;
    const spacingMultiplier = isMobile ? 1.8 : 1.4; // More spacing on mobile
    const repulsionStrength = isMobile ? -50 : -40; // Stronger repulsion on mobile
    
    const simulation = d3.forceSimulation(nodes)
      .force('center', d3.forceCenter(centerX, centerY).strength(0.04))
      .force('charge', d3.forceManyBody()
        .strength(repulsionStrength)
        .distanceMax(200)
      )
      .force('collision', d3.forceCollide<BubbleNode>()
        .radius(d => (d.targetRadius + 5) * spacingMultiplier)
        .strength(0.8)
      )
      // Category clustering force
      .force('category', d3.forceX<BubbleNode>()
        .x(d => {
          // Distribute categories in a rough circle around the center
          const categoryIndex = categories.indexOf(d.token.category);
          const totalCategories = categories.length - 1; // exclude 'all'
          const angle = (categoryIndex / totalCategories) * 2 * Math.PI;
          return centerX + Math.cos(angle) * Math.min(width, height) * 0.15;
        })
        .strength(0.02)
      )
      .alphaDecay(0.02)
      .velocityDecay(0.3);

    // Store simulation reference
    simulationRef.current = simulation;

    // Animation loop with enhanced performance monitoring
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const tick = (currentTime: number) => {
      if (currentTime - lastFrameTime >= frameInterval) {
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
              if (className?.includes('whale-indicator')) return 0.8;
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

    // Click outside to collapse any expanded bubbles or close popup
    svg.on('click', () => {
      setPopupCard(null); // Close popup card
      if (selectedToken) {
        setSelectedToken(null);
      }
    });

  }, [filteredTokens, sizeMetric, bubbleContent, xrayMode, pulseMode, period, getCurrentPriceChange, handleShowPopup, selectedToken, categories]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Debounce resize for performance
      clearTimeout(animFrameRef.current);
      setTimeout(() => {
        initSimulation();
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
                <Badge variant="secondary" className="text-xs">{hoveredToken.category}</Badge>
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
                <Badge variant="secondary" className="mt-1">{selectedToken.category}</Badge>
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
                  <Badge variant={selectedToken.riskLevel === 'low' ? 'default' : 'destructive'}>
                    {selectedToken.riskLevel}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedToken.contractAddress && selectedToken.contractAddress !== 'N/A' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`https://dexscreener.com/near/${selectedToken.contractAddress}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    DexScreener
                  </Button>
                )}
                {selectedToken.contractAddress && selectedToken.contractAddress !== 'N/A' && (
                  <Button 
                    size="sm" 
                    variant="outline"
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
                  variant="outline"
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
                  variant="outline"
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
                  variant="outline"
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
                variant="default" 
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
    <div className="flex-1 relative overflow-hidden">
      {/* Power Bar — Desktop */}
      <div className="hidden sm:block absolute top-4 left-4 z-20">
        <div className="bg-surface/95 backdrop-blur-xl border border-border rounded-lg shadow-xl p-3">
          <div className="flex flex-col gap-3">
            {/* Time Period Selector */}
            <div className="flex gap-1">
              {(['1h', '4h', '1d', '7d', '30d'] as const).map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={period === p ? 'default' : 'ghost'}
                  onClick={() => setPeriod(p)}
                  className="text-xs px-2"
                >
                  {p}
                </Button>
              ))}
            </div>

            {/* Performance toggles */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={highlightMode === 'gainers' ? 'default' : 'secondary'}
                onClick={() => setHighlightMode(highlightMode === 'gainers' ? 'none' : 'gainers')}
                className="text-xs"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Gainers
              </Button>
              <Button
                size="sm"
                variant={highlightMode === 'losers' ? 'default' : 'secondary'}
                onClick={() => setHighlightMode(highlightMode === 'losers' ? 'none' : 'losers')}
                className="text-xs"
              >
                <TrendingDown className="w-3 h-3 mr-1" />
                Losers
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1 max-w-xs">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={filterCategory === cat ? 'default' : 'ghost'}
                  onClick={() => setFilterCategory(cat)}
                  className="text-xs px-2"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Size Metric */}
            <div className="space-y-2">
              <p className="text-xs text-text-muted uppercase tracking-wide">Size by:</p>
              <div className="flex flex-col gap-1">
                {[
                  { key: 'marketCap', label: 'Market Cap' },
                  { key: 'volume', label: 'Volume' },
                  { key: 'performance', label: 'Performance' },
                ].map((opt) => (
                  <Button
                    key={opt.key}
                    size="sm"
                    variant={sizeMetric === opt.key ? 'default' : 'ghost'}
                    onClick={() => setSizeMetric(opt.key as typeof sizeMetric)}
                    className="text-xs justify-start"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bubble Content */}
            <div className="space-y-2">
              <p className="text-xs text-text-muted uppercase tracking-wide">Show:</p>
              <div className="flex flex-col gap-1">
                {[
                  { key: 'performance', label: 'Change %' },
                  { key: 'price', label: 'Price' },
                  { key: 'volume', label: 'Volume' },
                  { key: 'marketCap', label: 'Market Cap' },
                ].map((opt) => (
                  <Button
                    key={opt.key}
                    size="sm"
                    variant={bubbleContent === opt.key ? 'default' : 'ghost'}
                    onClick={() => setBubbleContent(opt.key as typeof bubbleContent)}
                    className="text-xs justify-start"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* X-ray Mode */}
            <div className="border-t border-border pt-3">
              <Button
                size="sm"
                variant={xrayMode ? 'default' : 'secondary'}
                onClick={() => setXrayMode(!xrayMode)}
                className="w-full text-xs"
              >
                {xrayMode ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {xrayMode ? 'Exit X-Ray' : 'X-Ray Mode'}
              </Button>
            </div>

            {/* Sound Toggle */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setSoundEnabled(!soundEnabled); }}
              className="text-xs"
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </Button>

            {/* Quick Actions */}
            <div className="border-t border-border pt-3 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSnapshot}
                className="flex-1 text-xs"
              >
                <Camera className="w-3 h-3 mr-1" />
                Export
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleShareX}
                className="flex-1 text-xs"
              >
                <Share2 className="w-3 h-3 mr-1" />
                Share
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { initSimulation(); }}
                className="flex-1 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
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
            className="sm:hidden fixed top-0 left-0 h-full w-80 z-50 bg-surface/95 backdrop-blur-xl border-r border-border shadow-2xl overflow-y-auto"
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
                        variant={period === p ? 'default' : 'ghost'}
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
                      variant={highlightMode === 'gainers' ? 'default' : 'secondary'}
                      onClick={() => setHighlightMode(highlightMode === 'gainers' ? 'none' : 'gainers')}
                      className="text-xs flex-1"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Gainers
                    </Button>
                    <Button
                      size="sm"
                      variant={highlightMode === 'losers' ? 'default' : 'secondary'}
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
                        variant={filterCategory === cat ? 'default' : 'ghost'}
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
                        variant={sizeMetric === opt.key ? 'default' : 'ghost'}
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
                        variant={bubbleContent === opt.key ? 'default' : 'ghost'}
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
                    variant={xrayMode ? 'default' : 'secondary'}
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
        <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 bg-[#04060b]/80 backdrop-blur-xl">
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
            <Badge variant="secondary" className="text-xs font-mono">
              {period}
            </Badge>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs text-text-muted">
              © 2024 Voidspace
            </span>
          </div>
        </div>
      </div>

      {/* **FIXED: Search positioned to not overlap logo** */}
      <div className="absolute bottom-16 right-4 z-30">
        <AnimatePresence>
          {showSearch ? (
            <motion.div
              initial={{ width: 44, opacity: 0.8 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 44, opacity: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-2 bg-surface/95 backdrop-blur-xl border border-border rounded-lg p-2 shadow-xl"
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
              className="flex items-center justify-center w-11 h-11 bg-surface/95 backdrop-blur-xl border border-border rounded-lg shadow-xl hover:border-near-green/30 transition-all group"
            >
              <Search className="w-4 h-4 text-near-green group-hover:text-near-green" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* **NEW: Popup Card** */}
      {renderPopupCard()}

      {/* Hover Tooltip & Token Profile Panel */}
      <AnimatePresence>
        {renderHoverTooltip()}
        {renderTokenAnatomy()}
      </AnimatePresence>

      {/* Click outside handler for popup card */}
      {popupCard && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setPopupCard(null)}
        />
      )}
    </div>
  );
}