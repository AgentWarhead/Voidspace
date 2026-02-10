'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, RotateCcw, Clock, Activity, Zap, X,
  TrendingUp, TrendingDown, Shield,
} from 'lucide-react';
// These icons exist but TS types are broken in v0.453 RSC mode
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { EyeOff, Camera, Volume2, VolumeX, Share2, AlertTriangle } = require('lucide-react') as Record<string, React.ComponentType<{ className?: string }>>;

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { FeatureTip } from '@/components/ui/FeatureTip';
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
}

interface BubbleNode extends d3.SimulationNodeDatum {
  id: string;
  token: VoidBubbleToken;
  radius: number;
  color: string;
  glowColor: string;
  targetRadius: number;
}

interface WhaleAlert {
  id: string;
  token: VoidBubbleToken;
  amount: number;
  type: 'buy' | 'sell';
  timestamp: number;
}

// type ViewMode = 'market' | 'anatomy'; // Phase 2: Token Anatomy drill-down
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

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

// ────────────────────── Component ──────────────────────

export function VoidBubblesEngine() {
  // State
  const [tokens, setTokens] = useState<VoidBubbleToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ViewMode will be used for Token Anatomy drill-down (Phase 2)
  const [selectedToken, setSelectedToken] = useState<VoidBubbleToken | null>(null);
  const [hoveredToken, setHoveredToken] = useState<VoidBubbleToken | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [xrayMode, setXrayMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [highlightMode, setHighlightMode] = useState<'none' | 'gainers' | 'losers'>('none');
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [, setLastUpdated] = useState<string>('');
  // New state for the enhanced features
  const [period, setPeriod] = useState<'1h' | '4h' | '1d' | '7d' | '30d'>('1d');
  const [sizeMetric, setSizeMetric] = useState<'marketCap' | 'volume' | 'performance'>('marketCap');
  const [bubbleContent, setBubbleContent] = useState<'performance' | 'price' | 'volume' | 'marketCap'>('performance');

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

  // ────────────────────── Whale Alerts (simulated) ──────────────────────

  useEffect(() => {
    if (tokens.length === 0) return;

    const generateWhaleAlert = () => {
      const token = tokens[Math.floor(Math.random() * Math.min(tokens.length, 20))];
      const amount = 10000 + Math.random() * 90000;
      const alert: WhaleAlert = {
        id: `whale-${Date.now()}`,
        token,
        amount,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp: Date.now(),
      };
      setWhaleAlerts(prev => [alert, ...prev].slice(0, 5));
      sonicRef.current.playWhaleAlert();

      // Trigger shockwave on the bubble
      triggerShockwave(token.id, amount);
    };

    const interval = setInterval(generateWhaleAlert, 20000 + Math.random() * 25000);
    // First alert after 5 seconds
    const firstTimeout = setTimeout(generateWhaleAlert, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  // ────────────────────── D3 Force Simulation ──────────────────────

  const triggerShockwave = useCallback((tokenId: string, amount: number) => {
    const svg = d3.select(svgRef.current);
    const node = nodesRef.current.find(n => n.token.id === tokenId);
    if (!node || !node.x || !node.y) return;

    // Pulse the bubble
    svg.select(`circle[data-id="${tokenId}"]`)
      .transition().duration(200)
      .attr('r', (node.radius || 20) * 1.5)
      .transition().duration(500)
      .attr('r', node.radius || 20);

    // Shockwave ring
    const intensity = Math.min(amount / 50000, 1);
    const maxRadius = 80 + intensity * 120;
    svg.select('.shockwave-layer')
      .append('circle')
      .attr('cx', node.x)
      .attr('cy', node.y)
      .attr('r', node.radius || 20)
      .attr('fill', 'none')
      .attr('stroke', intensity > 0.5 ? '#FF6B6B' : '#00EC97')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .transition().duration(1000)
      .attr('r', maxRadius)
      .attr('opacity', 0)
      .remove();

    // Push nearby bubbles
    nodesRef.current.forEach(other => {
      if (other.id === tokenId || !other.x || !other.y || !node.x || !node.y) return;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxRadius && dist > 0) {
        const force = (1 - dist / maxRadius) * intensity * 30;
        other.vx = (other.vx || 0) + (dx / dist) * force;
        other.vy = (other.vy || 0) + (dy / dist) * force;
      }
    });

    simulationRef.current?.alpha(0.3).restart();
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
        glowColor: glowColor,
        x: centerX + Math.cos(angle) * spiralR,
        y: centerY + Math.sin(angle) * spiralR,
      };
    });

    nodesRef.current = nodes;

    // Clear previous
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs for gradients and filters
    const defs = svg.append('defs');

    // Glow filter — soft, premium outer glow (enhanced for more visibility)
    const glowFilter = defs.append('filter').attr('id', 'bubble-glow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'blur');
    glowFilter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter().append('feMergeNode')
      .attr('in', d => d);

    // X-ray ring filter
    const xrayFilter = defs.append('filter').attr('id', 'xray-glow');
    xrayFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    xrayFilter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter().append('feMergeNode')
      .attr('in', d => d);

    // Create radial gradients per node — brighter to darker version of bubble color (no white)
    nodes.forEach(node => {
      const base = d3.hsl(node.color);
      const highlight = d3.hsl(node.color);
      highlight.l = Math.min(base.l + 0.2, 0.8); // brighter version
      const shadow = d3.hsl(node.color);
      shadow.l = Math.max(base.l - 0.2, 0.05); // darker version

      const grad = defs.append('radialGradient')
        .attr('id', `grad-${node.id.replace(/[^a-zA-Z0-9]/g, '_')}`)
        .attr('cx', '30%').attr('cy', '30%').attr('r', '70%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', highlight.formatRgb());
      grad.append('stop').attr('offset', '70%').attr('stop-color', node.color);
      grad.append('stop').attr('offset', '100%').attr('stop-color', shadow.formatRgb());
    });

    // Category grouping — gentle nudge, not tight clustering
    const uniqueCats = Array.from(new Set(filteredTokens.map(t => t.category))).sort();
    const catAngle = (cat: string) => {
      const idx = uniqueCats.indexOf(cat);
      return (idx / uniqueCats.length) * 2 * Math.PI - Math.PI / 2;
    };
    const clusterRadius = Math.min(width, height) * 0.18;
    const catX = (cat: string) => centerX + Math.cos(catAngle(cat)) * clusterRadius;
    const catY = (cat: string) => centerY + Math.sin(catAngle(cat)) * clusterRadius;

    // Enhanced Voidspace void grid pattern
    const gridPattern = defs.append('pattern')
      .attr('id', 'void-grid')
      .attr('width', 40)
      .attr('height', 40)
      .attr('patternUnits', 'userSpaceOnUse');
    
    gridPattern.append('rect')
      .attr('width', 40)
      .attr('height', 40)
      .attr('fill', '#0a0a0f');
    
    // Primary grid lines (near-green)
    gridPattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', '#00EC97')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.08);
    
    // Secondary grid lines (accent cyan) for depth
    gridPattern.append('path')
      .attr('d', 'M 20 0 L 20 40 M 0 20 L 40 20')
      .attr('fill', 'none')
      .attr('stroke', '#00D4FF')
      .attr('stroke-width', 0.3)
      .attr('opacity', 0.04);
    
    // Grid intersection dots for extra detail
    gridPattern.selectAll('.grid-dot')
      .data([{x: 0, y: 0}, {x: 20, y: 20}, {x: 40, y: 40}])
      .enter().append('circle')
      .attr('class', 'grid-dot')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 0.5)
      .attr('fill', '#00EC97')
      .attr('opacity', 0.06);

    // Background with grid
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#void-grid)')
      .attr('class', 'void-grid-bg');

    // Enhanced Voidspace star-field particles for depth
    const starLayer = svg.append('g').attr('class', 'star-layer');
    for (let i = 0; i < 80; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      const sr = 0.5 + Math.random() * 1.5;
      
      // More varied star colors with Voidspace brand palette
      const colorChance = Math.random();
      const starColor = colorChance > 0.7 ? '#00EC97' : colorChance > 0.4 ? '#00D4FF' : '#9D4EDD';
      const shouldPulse = Math.random() > 0.6;
      
      const star = starLayer.append('circle')
        .attr('cx', sx).attr('cy', sy).attr('r', sr)
        .attr('fill', starColor)
        .attr('opacity', 0.06 + Math.random() * 0.12);
        
      if (shouldPulse) {
        star.append('animateTransform')
          .attr('attributeName', 'opacity')
          .attr('values', `${0.06 + Math.random() * 0.08};${0.18 + Math.random() * 0.08};${0.06 + Math.random() * 0.08}`)
          .attr('dur', `${2.5 + Math.random() * 5}s`)
          .attr('repeatCount', 'indefinite');
      }
    }
    
    // Add subtle Voidspace logo constellation in background
    const logoConstellation = starLayer.append('g').attr('class', 'logo-constellation');
    const logoX = centerX + (Math.random() - 0.5) * 200;
    const logoY = centerY + (Math.random() - 0.5) * 200;
    
    // Draw a subtle version of the Voidspace logo as connected stars
    const logoStars = [
      {x: logoX, y: logoY, r: 1.2}, // center
      {x: logoX - 20, y: logoY - 15, r: 0.8}, // top-left
      {x: logoX + 20, y: logoY + 15, r: 0.8}, // bottom-right
      {x: logoX - 15, y: logoY + 10, r: 0.6}, // bottom-left
      {x: logoX + 15, y: logoY - 10, r: 0.6}, // top-right
    ];
    
    logoStars.forEach(star => {
      logoConstellation.append('circle')
        .attr('cx', star.x).attr('cy', star.y).attr('r', star.r)
        .attr('fill', '#00EC97')
        .attr('opacity', 0.04)
        .append('animateTransform')
        .attr('attributeName', 'opacity')
        .attr('values', '0.04;0.12;0.04')
        .attr('dur', '8s')
        .attr('repeatCount', 'indefinite');
    });

    // Shockwave layer
    svg.append('g').attr('class', 'shockwave-layer');

    // Animated scan line layer
    const scanLineGroup = svg.append('g').attr('class', 'scan-line-layer');
    
    const scanLineGradient = defs.append('linearGradient')
      .attr('id', 'scan-line-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    
    scanLineGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'transparent');
    scanLineGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#00EC97')
      .attr('stop-opacity', '0.15');
    scanLineGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'transparent');
    
    const scanLine = scanLineGroup.append('rect')
      .attr('x', 0)
      .attr('y', -2)
      .attr('width', width)
      .attr('height', 2)
      .attr('fill', 'url(#scan-line-gradient)')
      .attr('opacity', 0);
    
    // Animate scan line
    const animateScanLine = () => {
      scanLine
        .attr('y', -2)
        .attr('opacity', 0)
        .transition()
        .duration(200)
        .attr('opacity', 1)
        .transition()
        .duration(8000)
        .ease(d3.easeLinear)
        .attr('y', height)
        .transition()
        .duration(200)
        .attr('opacity', 0)
        .on('end', () => {
          setTimeout(animateScanLine, 2000);
        });
    };
    
    setTimeout(animateScanLine, 2000);

    // Category zone labels (subtle, behind bubbles)
    const labelLayer = svg.append('g').attr('class', 'category-labels');
    if (filterCategory === 'all' && uniqueCats.length > 1) {
      uniqueCats.forEach(cat => {
        const angle = catAngle(cat);
        const labelDist = clusterRadius * 1.6;
        const lx = centerX + Math.cos(angle) * labelDist;
        const ly = centerY + Math.sin(angle) * labelDist;
        labelLayer.append('text')
          .attr('x', lx)
          .attr('y', ly)
          .attr('text-anchor', 'middle')
          .attr('fill', CATEGORY_COLORS[cat] || '#888')
          .attr('font-size', 10)
          .attr('font-family', "'JetBrains Mono', monospace")
          .attr('font-weight', '500')
          .attr('letter-spacing', '0.1em')
          .attr('opacity', 0.2)
          .text(cat.toUpperCase());
      });
    }

    // Bubble groups
    const bubbleGroups = svg.append('g').attr('class', 'bubbles-layer')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'bubble-group')
      .style('cursor', 'pointer');

    // Outer glow circle — soft colored halo (enhanced visibility)
    bubbleGroups.append('circle')
      .attr('class', 'bubble-glow')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => d.glowColor)
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.35)
      .attr('filter', 'url(#bubble-glow)');

    // Subtle outer ring on ALL bubbles
    bubbleGroups.append('circle')
      .attr('class', 'bubble-outer-ring')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => d.glowColor)
      .attr('stroke-width', 1)
      .attr('opacity', 0.15);

    // X-ray concentration rings (hidden by default)
    bubbleGroups.append('circle')
      .attr('class', 'xray-ring')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => RISK_COLORS[d.token.riskLevel])
      .attr('stroke-width', d => d.token.riskLevel === 'critical' ? 4 : d.token.riskLevel === 'high' ? 3 : 2)
      .attr('opacity', 0)
      .attr('filter', 'url(#xray-glow)');

    // Main bubble — clean, vibrant orb
    bubbleGroups.append('circle')
      .attr('class', 'bubble-main')
      .attr('data-id', d => d.token.id)
      .attr('r', 0)
      .attr('fill', d => `url(#grad-${d.id.replace(/[^a-zA-Z0-9]/g, '_')})`)
      .attr('stroke', d => {
        const s = d3.hsl(d.glowColor);
        s.l = Math.min(s.l + 0.1, 0.7);
        return s.formatRgb();
      })
      .attr('stroke-width', d => d.targetRadius > 30 ? 2 : d.targetRadius > 16 ? 1.5 : 0.5)
      .attr('opacity', 0.92);

    // Skull overlay for critical risk
    bubbleGroups.filter(d => d.token.riskLevel === 'critical' || d.token.riskLevel === 'high')
      .append('text')
      .attr('class', 'skull-overlay')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', d => Math.max(d.targetRadius * 0.6, 10))
      .attr('opacity', 0)
      .text('💀');

    // Symbol labels — all bubbles ≥8px radius get a label (lower threshold for mobile)
    bubbleGroups.filter(d => d.targetRadius >= 8)
      .append('text')
      .attr('class', 'bubble-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('dy', d => d.targetRadius >= 26 ? '-0.35em' : '0')
      .attr('fill', '#fff')
      .attr('font-size', d => {
        const symbolLen = d.token.symbol.length;
        const baseMultiplier = width < 768 ? 1.8 : 1.7; // Larger text on mobile
        const fitFont = (d.targetRadius * baseMultiplier) / Math.max(symbolLen, 2);
        return Math.max(Math.min(fitFont, 18), 8); // Increased max font size
      })
      .attr('font-weight', '700')
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('pointer-events', 'none')
      .attr('opacity', 1)
      .style('text-shadow', '0 2px 6px rgba(0,0,0,0.9)') // Stronger shadow for better readability
      .text(d => d.token.symbol);

    // Secondary label (on bubbles ≥20px radius) - content based on bubbleContent selection - reduced threshold for mobile
    bubbleGroups.filter(d => d.targetRadius >= 20)
      .append('text')
      .attr('class', 'bubble-secondary')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('dy', '0.6em')
      .attr('fill', d => {
        if (bubbleContent === 'performance') {
          const currentChange = getCurrentPriceChange(d.token);
          return currentChange >= 0 ? '#00EC97' : '#FF3366';
        }
        return '#d1d5db'; // neutral color for non-performance displays
      })
      .attr('font-size', d => {
        const mobileMultiplier = width < 768 ? 0.4 : 0.36; // Larger on mobile
        return Math.max(Math.min(d.targetRadius * mobileMultiplier, 14), 9); // Better size range
      })
      .attr('font-weight', '700') // Bolder for better visibility
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.9)') // Stronger shadow
      .text(d => {
        switch (bubbleContent) {
          case 'performance':
            const currentChange = getCurrentPriceChange(d.token);
            return `${currentChange >= 0 ? '+' : ''}${currentChange.toFixed(1)}%`;
          case 'price':
            return formatPrice(d.token.price);
          case 'volume':
            return formatCompact(d.token.volume24h);
          case 'marketCap':
            return formatCompact(d.token.marketCap);
          default:
            const defaultChange = getCurrentPriceChange(d.token);
            return `${defaultChange >= 0 ? '+' : ''}${defaultChange.toFixed(1)}%`;
        }
      });

    // Watchlist indicator
    bubbleGroups.append('circle')
      .attr('class', 'watchlist-indicator')
      .attr('r', 4)
      .attr('fill', '#00D4FF')
      .attr('cy', d => -d.targetRadius - 6)
      .attr('opacity', d => watchlist.has(d.token.id) ? 1 : 0);

    // Hover events
    bubbleGroups
      .on('mouseenter', function(event, d) {
        setHoveredToken(d.token);
        setHoverPos({ x: event.clientX, y: event.clientY });

        d3.select(this).select('.bubble-main')
          .transition().duration(200)
          .attr('stroke-width', 2)
          .attr('opacity', 1);

        d3.select(this).select('.bubble-glow')
          .transition().duration(200)
          .attr('opacity', 0.7);
      })
      .on('mousemove', (event) => {
        setHoverPos({ x: event.clientX, y: event.clientY });
      })
      .on('mouseleave', function() {
        setHoveredToken(null);

        d3.select(this).select('.bubble-main')
          .transition().duration(200)
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.9);

        d3.select(this).select('.bubble-glow')
          .transition().duration(200)
          .attr('opacity', 0.35);
      })
      .on('click', (_event, d) => {
        setSelectedToken(d.token);
        const currentChange = getCurrentPriceChange(d.token);
        if (currentChange > 5) sonicRef.current.playPump(Math.min(currentChange / 30, 1));
        else if (currentChange < -5) sonicRef.current.playDump(Math.min(Math.abs(currentChange) / 30, 1));
        if (d.token.riskLevel === 'critical') sonicRef.current.playRisk();
      });

    // Force simulation — enhanced spacing for better mobile UX
    const isMobile = width < 768;
    const spacingMultiplier = isMobile ? 1.8 : 1.4; // More spacing on mobile
    const repulsionStrength = isMobile ? -50 : -40; // Stronger repulsion on mobile
    
    const simulation = d3.forceSimulation(nodes)
      .force('center', d3.forceCenter(centerX, centerY).strength(0.04))
      .force('charge', d3.forceManyBody().strength(repulsionStrength))
      .force('collision', d3.forceCollide<BubbleNode>().radius(d => d.targetRadius + (15 * spacingMultiplier)).strength(0.98).iterations(6))
      .force('x', d3.forceX<BubbleNode>(d => catX(d.token.category)).strength(0.01)) // Further reduced clustering
      .force('y', d3.forceY<BubbleNode>(d => catY(d.token.category)).strength(0.01))
      .alphaDecay(0.008) // Even slower settling for better spacing
      .velocityDecay(0.6) // Higher friction for stability
      .on('tick', () => {
        bubbleGroups.attr('transform', d => `translate(${d.x},${d.y})`);
      });

    simulationRef.current = simulation;

    // Animate bubbles appearing (burst from center)
    nodes.forEach((node, i) => {
      const delay = i * 15;
      setTimeout(() => {
        node.radius = node.targetRadius;
        d3.select(bubbleGroups.nodes()[i]).select('.bubble-main')
          .transition().duration(600)
          .ease(d3.easeElasticOut.amplitude(1).period(0.4))
          .attr('r', node.targetRadius);

        d3.select(bubbleGroups.nodes()[i]).select('.bubble-glow')
          .transition().duration(600).delay(100)
          .attr('r', node.targetRadius + 4);

        d3.select(bubbleGroups.nodes()[i]).select('.bubble-outer-ring')
          .transition().duration(600).delay(150)
          .attr('r', node.targetRadius + 8);

        // Skulls fade in for risky tokens
        d3.select(bubbleGroups.nodes()[i]).select('.skull-overlay')
          .transition().duration(800).delay(400)
          .attr('opacity', 0.7);
      }, delay);
    });

    // Momentum pulse — elegant breathing glow for significant movers (enhanced visibility)
    const pulseHighMomentum = () => {
      nodes.forEach((node, i) => {
        const currentChange = getCurrentPriceChange(node.token);
        const absPct = Math.abs(currentChange);
        if (absPct < 5) return; // Lower threshold - pulse 5%+ movers (was 10%)
        const pulseExtra = Math.min(absPct / 30, 0.4) * node.targetRadius; // more visible
        const duration = 2000 - Math.min(absPct * 15, 700);
        const glowSel = d3.select(bubbleGroups.nodes()[i]).select('.bubble-glow');
        const pulseLoop = () => {
          glowSel
            .transition().duration(duration).ease(d3.easeSinInOut)
            .attr('r', node.targetRadius + 10 + pulseExtra) // +4 → +10
            .attr('opacity', 0.5) // 0.35 → 0.5
            .transition().duration(duration).ease(d3.easeSinInOut)
            .attr('r', node.targetRadius + 4)
            .attr('opacity', 0.2) // 0.15 → 0.2
            .on('end', pulseLoop);
        };
        setTimeout(pulseLoop, entryDelay + i * 80);
      });
    };
    const entryDelay = nodes.length * 15 + 800;
    setTimeout(pulseHighMomentum, entryDelay);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        svg.select('.bubbles-layer').attr('transform', event.transform);
        svg.select('.shockwave-layer').attr('transform', event.transform);
        svg.select('.category-labels').attr('transform', event.transform);
      });

    svg.call(zoom);

    return () => {
      simulation.stop();
      cancelAnimationFrame(animFrameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTokens, watchlist, sizeMetric, bubbleContent, getCurrentPriceChange]);

  useEffect(() => {
    const cleanup = initSimulation();
    return () => { cleanup?.(); };
  }, [initSimulation]);

  // X-ray mode toggle
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const rings = svg.selectAll('.xray-ring');
    const skulls = svg.selectAll('.skull-overlay');
    
    // Only proceed if elements exist
    if (rings.empty()) return;
    
    // Iterate over xray rings and toggle visibility
    (rings.nodes() as Element[]).forEach((el) => {
      if (!el?.parentNode) return;
      const d = d3.select(el.parentNode as Element).datum() as BubbleNode;
      d3.select(el)
        .transition().duration(400)
        .attr('r', xrayMode ? (d.targetRadius + 6) : 0)
        .attr('opacity', xrayMode ? 0.8 : 0);
    });

    // Iterate over skull overlays and toggle visibility
    (skulls.nodes() as Element[]).forEach((el) => {
      if (!el?.parentNode) return;
      const d = d3.select(el.parentNode as Element).datum() as BubbleNode;
      let opacity = 0;
      if (xrayMode && (d.token.riskLevel === 'critical' || d.token.riskLevel === 'high')) opacity = 0.9;
      else if (!xrayMode && d.token.riskLevel === 'critical') opacity = 0.7;
      d3.select(el)
        .transition().duration(400)
        .attr('opacity', opacity);
    });
  }, [xrayMode]);

  // Sound toggle
  useEffect(() => {
    if (soundEnabled) sonicRef.current.enable();
    else sonicRef.current.disable();
  }, [soundEnabled]);

  // Gainers/Losers highlight mode effect
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const groups = svg.selectAll('.bubble-group');
    
    if (highlightMode === 'none') {
      // Reset all bubbles to normal
      groups.select('.bubble-main').transition().duration(300).attr('opacity', 0.92);
      groups.select('.bubble-glow').transition().duration(300).attr('opacity', 0.35);
      groups.select('.bubble-label').transition().duration(300).attr('opacity', 1);
      groups.select('.bubble-secondary').transition().duration(300).attr('opacity', 1);
      return;
    }
    
    // Sort tokens by price change using current period's data
    const sorted = [...filteredTokens].sort((a, b) => 
      highlightMode === 'gainers' 
        ? getCurrentPriceChange(b) - getCurrentPriceChange(a)
        : getCurrentPriceChange(a) - getCurrentPriceChange(b)
    );
    const topIds = new Set(sorted.slice(0, 15).map(t => t.id));
    
    groups.each(function() {
      const el = d3.select(this);
      const d = el.datum() as BubbleNode;
      const isHighlighted = topIds.has(d.token.id);
      
      el.select('.bubble-main')
        .transition().duration(400)
        .attr('opacity', isHighlighted ? 1 : 0.15);
      
      el.select('.bubble-glow')
        .transition().duration(400)
        .attr('opacity', isHighlighted ? 0.7 : 0.05);
      
      el.select('.bubble-label')
        .transition().duration(400)
        .attr('opacity', isHighlighted ? 1 : 0.1);
      
      el.select('.bubble-secondary')
        .transition().duration(400)
        .attr('opacity', isHighlighted ? 1 : 0.1);
    });
  }, [highlightMode, filteredTokens, getCurrentPriceChange]);

  // ────────────────────── Snapshot & Share ──────────────────────

  const handleSnapshot = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get the bounding box of actual bubble content to crop tightly
      const bubblesLayer = svgRef.current.querySelector('.bubbles-layer');
      // shockwaveLayer included via innerContent automatically
      // Use the bubbles layer bbox to determine content bounds
      let contentBBox = { x: 0, y: 0, width: 0, height: 0 };
      if (bubblesLayer && (bubblesLayer as SVGGraphicsElement).getBBox) {
        const bbox = (bubblesLayer as SVGGraphicsElement).getBBox();
        contentBBox = { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height };
      } else {
        // Fallback to container dimensions
        const rect = containerRef.current.getBoundingClientRect();
        contentBBox = { x: 0, y: 0, width: rect.width, height: rect.height };
      }

      // Add margin around the content
      const MARGIN = 60;
      const BRAND_H = 100;
      const contentW = Math.round(contentBBox.width + MARGIN * 2);
      const contentH = Math.round(contentBBox.height + MARGIN * 2);
      const totalW = Math.max(contentW, 800); // min width for branding
      const totalH = contentH + BRAND_H;

      // Offset to center the bubbles in the export
      const offsetX = Math.round(-contentBBox.x + MARGIN + (totalW - contentW) / 2);
      const offsetY = Math.round(-contentBBox.y + MARGIN);

      // Get the SVG inner content
      const innerContent = svgRef.current.innerHTML;

      // Branding positions
      const brandY = totalH - BRAND_H + 18;
      const logoX = totalW - 280;

      const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect width="${totalW}" height="${totalH}" fill="#0a0a0a"/>
  <g transform="translate(${offsetX},${offsetY})">
    ${innerContent}
  </g>
  <rect x="0" y="${totalH - BRAND_H}" width="${totalW}" height="${BRAND_H}" fill="#0a0a0a"/>
  <line x1="40" y1="${brandY - 12}" x2="${totalW - 40}" y2="${brandY - 12}" stroke="rgba(0,236,151,0.15)" stroke-width="1"/>
  <g transform="translate(${logoX},${brandY})" opacity="0.7">
    <path d="M 38 22 A 16 16 0 1 1 29 8.4" stroke="#00EC97" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 31 22 A 9 9 0 1 1 22 13" stroke="#00EC97" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.35"/>
    <line x1="11" y1="33" x2="33" y2="11" stroke="#00D4FF" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <circle cx="22" cy="22" r="2.5" fill="#00EC97"/>
    <text x="50" y="20" fill="#00EC97" font-family="monospace" font-size="18" font-weight="bold">VOIDSPACE<tspan fill="#00D4FF" font-weight="normal">.io</tspan></text>
    <text x="50" y="36" fill="rgba(255,255,255,0.35)" font-family="monospace" font-size="9">NEAR ECOSYSTEM INTELLIGENCE</text>
  </g>
  <text x="40" y="${brandY + 8}" fill="rgba(255,255,255,0.25)" font-family="monospace" font-size="10">VOID BUBBLES  ·  ${tokens.length} TOKENS  ·  ${today}</text>
</svg>`;

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voidspace-bubbles-${today}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Snapshot failed:', e);
      alert('Snapshot failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  }, [tokens.length]);

  const handleShareX = useCallback(() => {
    const text = `🫧 Exploring the NEAR ecosystem with @VoidSpaceNear Void Bubbles\n\n${tokens.length} tokens tracked live\n\nMap the voids → voidspace.io/void-bubbles`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }, [tokens.length]);

  // Toggle watchlist
  const toggleWatchlist = useCallback((tokenId: string) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(tokenId)) next.delete(tokenId);
      else next.add(tokenId);
      return next;
    });
  }, []);

  // ────────────────────── Token Anatomy (Detail Panel) ──────────────────────

  const renderTokenAnatomy = () => {
    if (!selectedToken) return null;

    const days = daysSince(selectedToken.detectedAt);
    const timerColor = days < 7 ? 'text-near-green' : days < 30 ? 'text-warning' : days < 90 ? 'text-orange-400' : 'text-error';

    return (
      <motion.div
        initial={{ opacity: 0, x: 300, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-16 sm:top-4 left-2 right-2 sm:left-auto sm:right-4 sm:w-[340px] max-h-[calc(100%-5rem)] sm:max-h-[calc(100%-2rem)] overflow-y-auto z-30"
      >
        <Card variant="glass" padding="lg" className="relative animated-border">
          {/* Void pulse background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-near-green/3 to-accent-cyan/3 rounded-lg animate-pulse" />
          
          <button
            onClick={() => setSelectedToken(null)}
            className="absolute top-3 right-3 p-1 hover:bg-surface-hover rounded transition-colors z-10"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>

          {/* Content wrapper to stay above background pattern */}
          <div className="relative z-10">
          
          {/* Token Header */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm font-mono"
                style={{ background: CATEGORY_COLORS[selectedToken.category] || '#888', color: '#0a0a0a' }}
              >
                {selectedToken.symbol.slice(0, 3)}
              </div>
              <div>
                <h3 className="font-bold text-text-primary">{selectedToken.symbol}</h3>
                <p className="text-xs text-text-muted">{selectedToken.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default" className="text-xs">{selectedToken.category}</Badge>
              <span className={cn('text-xs font-mono flex items-center gap-1', timerColor)}>
                <Clock className="w-3 h-3" />
                {days < 7 ? `${days}d — NEW` : days < 30 ? `${days} days` : days < 90 ? `${days} days — unfilled` : `${days} DAYS — wide open`}
              </span>
            </div>
          </div>

          {/* Price & Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-surface rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Price</p>
              <p className="text-lg font-bold font-mono text-text-primary">{formatPrice(selectedToken.price)}</p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">{period} Change</p>
              <p className={cn('text-lg font-bold font-mono flex items-center gap-1',
                getCurrentPriceChange(selectedToken) >= 0 ? 'text-near-green' : 'text-error'
              )}>
                {getCurrentPriceChange(selectedToken) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {getCurrentPriceChange(selectedToken) >= 0 ? '+' : ''}{getCurrentPriceChange(selectedToken).toFixed(1)}%
              </p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Market Cap</p>
              <p className="text-sm font-bold font-mono text-text-primary">{formatCompact(selectedToken.marketCap)}</p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Liquidity</p>
              <p className="text-sm font-bold font-mono text-text-primary">{formatCompact(selectedToken.liquidity)}</p>
            </div>
          </div>

          {/* Health Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Health Score</span>
              <div className="flex items-center gap-2">
                {selectedToken.riskLevel === 'critical' && <span className="text-lg">💀</span>}
                <span className={cn('text-2xl font-bold font-mono', `text-[${RISK_COLORS[selectedToken.riskLevel]}]`)}
                  style={{ color: RISK_COLORS[selectedToken.riskLevel] }}
                >
                  {selectedToken.healthScore}
                </span>
                <span className="text-xs text-text-muted">/100</span>
              </div>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: RISK_COLORS[selectedToken.riskLevel],
                  boxShadow: `0 0 8px ${RISK_COLORS[selectedToken.riskLevel]}40`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${selectedToken.healthScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* All Timeframe Changes */}
          <div className="mb-4">
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">All Timeframes</p>
            <div className="text-xs font-mono text-text-secondary space-y-1">
              <div>
                <span className="mr-3">1H: <span className={selectedToken.priceChange1h >= 0 ? 'text-near-green' : 'text-error'}>
                  {selectedToken.priceChange1h >= 0 ? '+' : ''}{selectedToken.priceChange1h.toFixed(1)}%
                </span></span>
                <span className="mr-3">6H: <span className={selectedToken.priceChange6h >= 0 ? 'text-near-green' : 'text-error'}>
                  {selectedToken.priceChange6h >= 0 ? '+' : ''}{selectedToken.priceChange6h.toFixed(1)}%
                </span></span>
                <span>24H: <span className={selectedToken.priceChange24h >= 0 ? 'text-near-green' : 'text-error'}>
                  {selectedToken.priceChange24h >= 0 ? '+' : ''}{selectedToken.priceChange24h.toFixed(1)}%
                </span></span>
              </div>
            </div>
          </div>
          
          {/* External Links */}
          <div className="mb-4 flex gap-2">
            {selectedToken.dexScreenerUrl && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => window.open(selectedToken.dexScreenerUrl, '_blank')}
              >
                🔗 DexScreener
              </Button>
            )}
            {selectedToken.refFinanceUrl && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => window.open(selectedToken.refFinanceUrl, '_blank')}
              >
                🔗 Trade on Ref
              </Button>
            )}
          </div>
          
          {/* Contract Address */}
          <div className="mb-4">
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Contract</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-surface rounded px-2 py-1 font-mono text-text-secondary">
                {selectedToken.contractAddress.length > 20 
                  ? `${selectedToken.contractAddress.slice(0, 10)}...${selectedToken.contractAddress.slice(-8)}`
                  : selectedToken.contractAddress
                }
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(selectedToken.contractAddress)}
                className="px-2 py-1 text-xs bg-surface hover:bg-surface-hover rounded transition-colors"
              >
                📋
              </button>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="mb-4">
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
              {selectedToken.riskLevel === 'low' ? <Shield className="w-3 h-3 text-near-green" /> : <AlertTriangle className="w-3 h-3 text-warning" />}
              Risk Assessment
            </p>
            <div className="space-y-1">
              {selectedToken.riskFactors.map((factor, i) => (
                <p key={i} className="text-xs text-text-secondary flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: RISK_COLORS[selectedToken.riskLevel] }} />
                  {factor}
                </p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant={watchlist.has(selectedToken.id) ? 'primary' : 'secondary'}
              size="sm"
              className="flex-1"
              onClick={() => toggleWatchlist(selectedToken.id)}
            >
              {watchlist.has(selectedToken.id) ? '★ Watching' : '☆ Watch'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShareX}>
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
          
          </div> {/* End content wrapper */}
        </Card>
      </motion.div>
    );
  };

  // ────────────────────── Hover Tooltip ──────────────────────

  const renderHoverTooltip = () => {
    if (!hoveredToken || selectedToken) return null;

    const verdict = hoveredToken.healthScore >= 75 ? 'Healthy' :
      hoveredToken.healthScore >= 50 ? 'Moderate' :
      hoveredToken.healthScore >= 25 ? 'Risky' : 'Dangerous';

    const verdictColor = hoveredToken.healthScore >= 75 ? 'text-near-green' :
      hoveredToken.healthScore >= 50 ? 'text-warning' :
      hoveredToken.healthScore >= 25 ? 'text-orange-400' : 'text-error';

    // Smart positioning to prevent cutoff - especially important on mobile
    const tooltip = {
      width: 180, // estimated tooltip width
      height: 60, // estimated tooltip height
    };
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    
    let left = hoverPos.x + 16;
    let top = hoverPos.y - 10;
    
    // Adjust horizontal position if tooltip would overflow
    if (left + tooltip.width > viewport.width - 10) {
      left = hoverPos.x - tooltip.width - 16;
    }
    
    // Adjust vertical position if tooltip would overflow
    if (top + tooltip.height > viewport.height - 10) {
      top = hoverPos.y - tooltip.height - 16;
    }
    
    // Ensure tooltip stays on screen
    left = Math.max(10, Math.min(left, viewport.width - tooltip.width - 10));
    top = Math.max(10, Math.min(top, viewport.height - tooltip.height - 10));

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="fixed z-50 pointer-events-none hidden sm:block"
        style={{ left, top }}
      >
        <div className="relative animated-border bg-surface/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-2xl min-w-[180px]">
          {/* Scan line sweep effect */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-near-green/40 to-transparent animate-scan opacity-60" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-text-primary font-mono text-sm">{hoveredToken.symbol}</span>
              <span className={cn('text-xs font-mono font-bold', verdictColor)}>{verdict}</span>
            </div>
            <div className="text-xs text-text-muted font-mono">
              {formatPrice(hoveredToken.price)} · <span className={getCurrentPriceChange(hoveredToken) >= 0 ? 'text-near-green' : 'text-error'}>
                {getCurrentPriceChange(hoveredToken) >= 0 ? '+' : ''}{getCurrentPriceChange(hoveredToken).toFixed(1)}%
              </span>
            </div>
            {hoveredToken.riskLevel === 'critical' && (
              <div className="text-xs text-error mt-1 flex items-center gap-1">
                💀 High rug risk
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ────────────────────── Whale Alert Feed ──────────────────────

  const renderWhaleAlerts = () => {
    if (whaleAlerts.length === 0) return null;

    return (
      <div className="hidden sm:block absolute bottom-14 left-4 z-20 space-y-1.5 max-w-[280px]">
        <AnimatePresence mode="popLayout">
          {whaleAlerts.slice(0, 3).map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                boxShadow: [
                  `0 0 0px ${alert.type === 'buy' ? '#00EC97' : '#FF4757'}`,
                  `0 0 20px ${alert.type === 'buy' ? '#00EC9740' : '#FF475740'}`,
                  `0 0 0px ${alert.type === 'buy' ? '#00EC97' : '#FF4757'}`
                ]
              }}
              exit={{ opacity: 0, x: -50, scale: 0.8 }}
              transition={{
                boxShadow: { duration: 1.5, times: [0, 0.1, 1] },
                type: "spring",
                damping: 15,
                stiffness: 100
              }}
              className={cn(
                "flex items-center gap-2 bg-surface/80 backdrop-blur-xl border rounded-lg px-2.5 py-1.5 shadow-lg",
                "transform hover:scale-105 transition-transform duration-200",
                alert.type === 'buy' 
                  ? 'border-l-2 border-l-near-green border-border/50' 
                  : 'border-l-2 border-l-error border-border/50'
              )}
            >
              <Zap className={cn('w-3 h-3 shrink-0', alert.type === 'buy' ? 'text-near-green' : 'text-error')} />
              <div className="min-w-0">
                <p className="text-[10px] text-text-primary font-mono truncate">
                  <span className={alert.type === 'buy' ? 'text-near-green' : 'text-error'}>
                    {alert.type === 'buy' ? '🐋 BUY' : '🐋 SELL'}
                  </span>
                  {' '}{formatCompact(alert.amount)} {alert.token.symbol}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  // ────────────────────── Main Render ──────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-background rounded-xl border border-border relative overflow-hidden">
        {/* Void grid background */}
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
      <div className="flex items-center justify-center h-[600px] bg-background rounded-xl border border-border">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
          <p className="text-text-primary font-semibold">{error}</p>
          <Button variant="secondary" onClick={fetchTokens}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-0 bg-background rounded-xl border border-border overflow-hidden">
      {/* Top Controls — single row on desktop, stacked on mobile */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        {/* Timeframe selector and filters */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0">
          {/* Timeframe selector - FIRST element */}
          <div className="flex items-center gap-0.5 bg-surface/80 backdrop-blur-xl rounded-lg border border-border p-0.5 flex-shrink-0">
            {(['1h', '4h', '1d', '7d', '30d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 sm:px-3 py-2 sm:py-1 rounded-md text-xs sm:text-[11px] font-mono font-bold transition-all uppercase',
                  'min-w-[40px] sm:min-w-auto min-h-[40px] sm:min-h-auto touch-manipulation', // Better touch targets on mobile
                  period === p
                    ? 'bg-near-green/20 text-near-green border border-near-green/30'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          
          {/* Category filters — command terminal aesthetic */}
          <div className="relative flex items-center gap-1 bg-surface/80 backdrop-blur-xl rounded-lg border border-border p-1 overflow-x-auto scrollbar-hide max-w-full min-w-0 scroll-smooth">
          {/* Scan line glow behind control row */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-near-green/5 to-transparent opacity-30" />
          
          {/* Gainers/Losers filter buttons */}
          <button
            onClick={() => setHighlightMode(highlightMode === 'gainers' ? 'none' : 'gainers')}
            className={cn(
              'relative px-3 sm:px-2.5 py-2 sm:py-1 rounded-md text-xs sm:text-[11px] font-mono transition-all whitespace-nowrap flex-shrink-0 group flex items-center gap-1',
              'min-h-[44px] sm:min-h-auto touch-manipulation', // Better touch targets and touch optimization
              highlightMode === 'gainers'
                ? 'bg-near-green/20 text-near-green border border-near-green/30 border-l-2 border-l-near-green'
                : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
            )}
          >
            <span className="relative z-10">🔥 Gainers</span>
          </button>
          
          <button
            onClick={() => setHighlightMode(highlightMode === 'losers' ? 'none' : 'losers')}
            className={cn(
              'relative px-3 sm:px-2.5 py-2 sm:py-1 rounded-md text-xs sm:text-[11px] font-mono transition-all whitespace-nowrap flex-shrink-0 group flex items-center gap-1',
              'min-h-[44px] sm:min-h-auto touch-manipulation', // Better touch targets
              highlightMode === 'losers'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 border-l-2 border-l-red-500'
                : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
            )}
          >
            <span className="relative z-10">💀 Losers</span>
          </button>
          
          {/* Divider */}
          <div className="w-px h-4 bg-border mx-1" />
          
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                'relative px-3 sm:px-2.5 py-2 sm:py-1 rounded-md text-xs sm:text-[11px] font-mono transition-all whitespace-nowrap flex-shrink-0 group',
                'min-h-[44px] sm:min-h-auto touch-manipulation', // Better touch targets
                filterCategory === cat
                  ? 'bg-near-green/20 text-near-green border border-near-green/30 border-l-2 border-l-near-green'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
              )}
            >
              {/* Scan line sweep effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-near-green/20 to-transparent transform -skew-x-12 animate-pulse" />
              </div>
              
              <span className="relative z-10">
                {cat === 'all' ? 'ALL' : cat}
              </span>
            </button>
          ))}
          </div>
        </div>

        {/* Action buttons and toggles */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 self-end sm:self-auto">
          {/* Bubble Size Toggle */}
          <div className="flex items-center gap-0.5 bg-surface/80 backdrop-blur-xl rounded-lg border border-border p-0.5">
            <span className="hidden sm:block text-[9px] font-mono text-text-muted px-1.5 uppercase">Size</span>
            {[
              { key: 'marketCap', label: 'Cap' },
              { key: 'volume', label: 'Vol' },
              { key: 'performance', label: 'Perf' },
            ].map(opt => (
              <button 
                key={opt.key} 
                onClick={() => setSizeMetric(opt.key as typeof sizeMetric)}
                className={cn(
                  'px-2.5 sm:px-2 py-2 sm:py-1 rounded-md text-xs sm:text-[10px] font-mono font-bold transition-all uppercase',
                  'min-w-[40px] sm:min-w-auto min-h-[40px] sm:min-h-auto touch-manipulation', // Better touch targets
                  sizeMetric === opt.key
                    ? 'bg-near-green/20 text-near-green border border-near-green/30'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          {/* Bubble Content Toggle */}
          <div className="flex items-center gap-0.5 bg-surface/80 backdrop-blur-xl rounded-lg border border-border p-0.5">
            <span className="hidden sm:block text-[9px] font-mono text-text-muted px-1.5 uppercase">Show</span>
            {[
              { key: 'performance', label: '%' },
              { key: 'price', label: '$' },
              { key: 'volume', label: 'Vol' },
              { key: 'marketCap', label: 'Cap' },
            ].map(opt => (
              <button 
                key={opt.key} 
                onClick={() => setBubbleContent(opt.key as typeof bubbleContent)}
                className={cn(
                  'px-2.5 sm:px-2 py-2 sm:py-1 rounded-md text-xs sm:text-[10px] font-mono font-bold transition-all uppercase',
                  'min-w-[36px] sm:min-w-auto min-h-[40px] sm:min-h-auto touch-manipulation', // Better touch targets
                  bubbleContent === opt.key
                    ? 'bg-near-green/20 text-near-green border border-near-green/30'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setXrayMode(!xrayMode)}
              className={cn(
                'relative p-2.5 sm:p-2 rounded-lg border transition-all group overflow-hidden',
                'min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto touch-manipulation', // Better mobile touch targets
                xrayMode
                  ? 'bg-accent-cyan/20 border-accent-cyan/30 text-accent-cyan'
                  : 'bg-surface/80 border-border text-text-muted hover:text-text-secondary'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
              <div className="relative z-10">
                {xrayMode ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>
            </button>
            <div className="hidden sm:block">
              <FeatureTip
                tip="X-Ray Mode reveals concentration risk and rug detection scores. Red rings = high risk. Use this before aping!"
                title="🔍 X-RAY MODE"
                position="bottom"
                className="ml-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setSoundEnabled(!soundEnabled); }}
              className={cn(
                'relative p-2.5 sm:p-2 rounded-lg border transition-all group overflow-hidden',
                'min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto touch-manipulation', // Better mobile touch targets
                soundEnabled
                  ? 'bg-near-green/20 border-near-green/30 text-near-green'
                  : 'bg-surface/80 border-border text-text-muted hover:text-text-secondary'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-near-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
              <div className="relative z-10">
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>
            </button>
            <div className="hidden sm:block">
              <FeatureTip
                tip="Sonic Mode lets you HEAR the market. Pumps play ascending tones, dumps play low rumbles, and whale alerts get dramatic chimes."
                title="🔊 SONIC MODE"
                position="bottom"
                className="ml-1"
              />
            </div>
          </div>
          <button
            onClick={handleSnapshot}
            className="relative p-2.5 sm:p-2 rounded-lg border bg-surface/80 border-border text-text-muted hover:text-text-secondary transition-all group overflow-hidden min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto touch-manipulation"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-near-green/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
            <div className="relative z-10">
              <Camera className="w-4 h-4 sm:w-4 sm:h-4" />
            </div>
          </button>
          <button
            onClick={handleShareX}
            className="relative p-2.5 sm:p-2 rounded-lg border bg-surface/80 border-border text-text-muted hover:text-text-secondary transition-all group overflow-hidden min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto touch-manipulation"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-near-green/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
            <div className="relative z-10">
              <Share2 className="w-4 h-4 sm:w-4 sm:h-4" />
            </div>
          </button>
          <button
            onClick={() => { initSimulation(); }}
            className="relative p-2.5 sm:p-2 rounded-lg border bg-surface/80 border-border text-text-muted hover:text-text-secondary transition-all group overflow-hidden min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto touch-manipulation"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-near-green/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
            <div className="relative z-10">
              <RotateCcw className="w-4 h-4 sm:w-4 sm:h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Branding Bar — always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-px bg-gradient-to-r from-transparent via-near-green/20 to-transparent" />
        <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 bg-background/90 backdrop-blur-xl">
          {/* Left: Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-near-green" />
              <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">
                VOID BUBBLES · {filteredTokens.length} TOKENS
              </span>
            </div>
            {xrayMode && (
              <>
                <div className="w-px h-3 bg-border" />
                <span className="text-[10px] sm:text-[11px] font-mono text-accent-cyan flex items-center gap-1">
                  <Eye className="w-3 h-3" /> X-RAY
                </span>
              </>
            )}
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">
                AI-POWERED
              </span>
              <div className="hidden sm:block">
                <FeatureTip
                  tip="Void Bubbles uses AI health scoring to assess every token's risk level. Click any bubble for the full breakdown."
                  title="🧠 AI-POWERED"
                  position="bottom"
                  className=""
                />
              </div>
            </div>
          </div>
          {/* Right: Voidspace logo */}
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 44 44" className="opacity-70">
              <path d="M 38 22 A 16 16 0 1 1 29 8.4" stroke="#00EC97" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M 31 22 A 9 9 0 1 1 22 13" stroke="#00EC97" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
              <line x1="11" y1="33" x2="33" y2="11" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <circle cx="22" cy="22" r="2.5" fill="#00EC97"/>
            </svg>
            <span className="text-[11px] sm:text-xs font-mono">
              <span className="text-near-green font-bold">VOIDSPACE</span>
              <span className="text-accent-cyan">.io</span>
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div ref={containerRef} className="w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ 
            background: 'radial-gradient(ellipse at 50% 45%, #0d1a15 0%, #0a0f14 30%, #0a0a0f 60%, #080809 100%)',
          }}
        />
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {renderHoverTooltip()}
        {renderTokenAnatomy()}
      </AnimatePresence>
      {renderWhaleAlerts()}
    </div>
  );
}
