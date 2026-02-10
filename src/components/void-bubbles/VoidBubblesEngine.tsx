'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, RotateCcw, Clock, Activity, X,
  TrendingUp, TrendingDown, Shield, Search, Settings,
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

// WhaleAlert interface removed - whale activity now shows as visual effects on bubbles

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

const getHealthIcon = (healthScore: number) => {
  if (healthScore > 70) return '✅';
  if (healthScore >= 40) return '⚠️';
  return '❌';
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
  // Bubble Pop state - expanded bubble
  const [expandedBubble, setExpandedBubble] = useState<string | null>(null);
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

  // ────────────────────── D3 Force Simulation ──────────────────────

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

  // Bubble Pop - expand/collapse bubble in place
  const handleBubblePop = useCallback((tokenId: string) => {
    if (expandedBubble === tokenId) {
      // Collapse
      setExpandedBubble(null);
      const node = nodesRef.current.find(n => n.token.id === tokenId);
      if (!node) return;

      const svg = d3.select(svgRef.current);
      const bubbleGroup = svg.select(`g[data-bubble-id="${tokenId}"]`);
      
      // Animate bubble back to original size
      bubbleGroup.select('.bubble-main')
        .transition().duration(400)
        .ease(d3.easeBackOut.overshoot(1.2))
        .attr('r', node.targetRadius);
      
      bubbleGroup.select('.bubble-glow')
        .transition().duration(400)
        .attr('r', node.targetRadius + 4);
      
      bubbleGroup.select('.bubble-outer-ring')
        .transition().duration(400)
        .attr('r', node.targetRadius + 8);

      // Remove expanded content
      bubbleGroup.selectAll('.expanded-content').remove();
      
      // Restart simulation to re-settle bubbles
      simulationRef.current?.alpha(0.2).restart();
    } else {
      // Expand
      setExpandedBubble(tokenId);
      const node = nodesRef.current.find(n => n.token.id === tokenId);
      if (!node) return;

      const svg = d3.select(svgRef.current);
      const bubbleGroup = svg.select(`g[data-bubble-id="${tokenId}"]`);
      const expandedRadius = node.targetRadius * 2.5;
      
      // Animate bubble to expanded size
      bubbleGroup.select('.bubble-main')
        .transition().duration(600)
        .ease(d3.easeBackOut.overshoot(1.1))
        .attr('r', expandedRadius);
      
      bubbleGroup.select('.bubble-glow')
        .transition().duration(600)
        .attr('r', expandedRadius + 8)
        .attr('opacity', 0.6);
      
      bubbleGroup.select('.bubble-outer-ring')
        .transition().duration(600)
        .attr('r', expandedRadius + 12);

      // Add expanded content after animation starts
      setTimeout(() => {
        const token = node.token;
        const currentChange = getCurrentPriceChange(token);
        
        // Create content group
        const contentGroup = bubbleGroup.append('g').attr('class', 'expanded-content');
        
        // Calculate proper Y positions based on expanded radius
        const lineHeight = Math.max(18, expandedRadius * 0.12); // Minimum 18px between lines
        const startY = -expandedRadius * 0.4; // Start from top quarter of bubble
        
        // Determine how many lines to show based on bubble size
        const showAllLines = expandedRadius >= 40;
        
        // Symbol at the top (larger font)
        contentGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('y', startY)
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-size', Math.min(expandedRadius * 0.4, 24))
          .attr('font-weight', 'bold')
          .attr('fill', '#fff')
          .style('text-shadow', '0 2px 8px rgba(0,0,0,0.9)')
          .text(token.symbol);
        
        // Price
        contentGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('y', startY + lineHeight * 1.5)
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-size', Math.min(expandedRadius * 0.15, 14))
          .attr('font-weight', 'bold')
          .attr('fill', '#d1d5db')
          .style('text-shadow', '0 2px 6px rgba(0,0,0,0.9)')
          .text(formatPrice(token.price));
        
        // Price change
        contentGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('y', startY + lineHeight * 2.5)
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-size', Math.min(expandedRadius * 0.12, 12))
          .attr('font-weight', 'bold')
          .attr('fill', currentChange >= 0 ? '#00EC97' : '#FF3366')
          .style('text-shadow', '0 2px 6px rgba(0,0,0,0.9)')
          .text(`${currentChange >= 0 ? '+' : ''}${currentChange.toFixed(1)}%`);
        
        // Only show market cap and health score if bubble is large enough
        if (showAllLines) {
          // Market cap
          contentGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('y', startY + lineHeight * 3.5)
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('font-size', Math.min(expandedRadius * 0.1, 10))
            .attr('font-weight', 'normal')
            .attr('fill', '#9ca3af')
            .style('text-shadow', '0 2px 4px rgba(0,0,0,0.9)')
            .text(`MC: ${formatCompact(token.marketCap)}`);
          
          // Health score with enhanced X-ray coloring and icon
          const healthStatus = getHealthStatus(token.healthScore);
          const healthColor = HEALTH_COLORS[healthStatus];
          const healthIcon = getHealthIcon(token.healthScore);
          
          contentGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('y', startY + lineHeight * 4.5)
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('font-size', Math.min(expandedRadius * 0.1, 10))
            .attr('font-weight', 'normal')
            .attr('fill', healthColor)
            .style('text-shadow', '0 2px 4px rgba(0,0,0,0.9)')
            .text(`${healthIcon} Health: ${token.healthScore}/100`);
        }

        // DexScreener and Ref Finance links (if contract address available)
        if (token.contractAddress && token.contractAddress !== 'N/A' && expandedRadius >= 35) {
          const linkY = startY + lineHeight * (showAllLines ? 6 : 4);
          
          // DexScreener link
          const dexLink = contentGroup.append('g')
            .attr('class', 'dex-link')
            .style('cursor', 'pointer')
            .attr('transform', `translate(${-expandedRadius * 0.35}, ${linkY})`);
          
          dexLink.append('rect')
            .attr('x', -22)
            .attr('y', -8)
            .attr('width', 44)
            .attr('height', 16)
            .attr('rx', 8)
            .attr('fill', '#1a1a1a')
            .attr('stroke', '#00EC97')
            .attr('stroke-width', 1)
            .attr('opacity', 0.8);
          
          dexLink.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('font-size', '8')
            .attr('font-weight', 'bold')
            .attr('fill', '#00EC97')
            .text('📊 Dex');

          dexLink.on('click', (event) => {
            event.stopPropagation();
            window.open(`https://dexscreener.com/near/${token.contractAddress}`, '_blank');
          });
          
          // Ref Finance link
          const refLink = contentGroup.append('g')
            .attr('class', 'ref-link')
            .style('cursor', 'pointer')
            .attr('transform', `translate(${expandedRadius * 0.35}, ${linkY})`);
          
          refLink.append('rect')
            .attr('x', -22)
            .attr('y', -8)
            .attr('width', 44)
            .attr('height', 16)
            .attr('rx', 8)
            .attr('fill', '#1a1a1a')
            .attr('stroke', '#00D4FF')
            .attr('stroke-width', 1)
            .attr('opacity', 0.8);
          
          refLink.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('font-size', '8')
            .attr('font-weight', 'bold')
            .attr('fill', '#00D4FF')
            .text('💱 Ref');

          refLink.on('click', (event) => {
            event.stopPropagation();
            window.open(`https://app.ref.finance/#near|${token.contractAddress}`, '_blank');
          });
        }

        // Fade in the content
        contentGroup.attr('opacity', 0)
          .transition().duration(300)
          .attr('opacity', 1);
      }, 200);

      // Push other bubbles away using the existing force simulation
      nodesRef.current.forEach(other => {
        if (other.id === tokenId || !other.x || !other.y || !node.x || !node.y) return;
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = expandedRadius + (other.targetRadius || 20) + 20;
        if (dist < minDist && dist > 0) {
          const force = (minDist - dist) / minDist * 80;
          other.vx = (other.vx || 0) + (dx / dist) * force;
          other.vy = (other.vy || 0) + (dy / dist) * force;
        }
      });

      simulationRef.current?.alpha(0.3).restart();
    }
  }, [expandedBubble, getCurrentPriceChange]);

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

    // Enhanced cinematic glow filter — dramatic multi-layer outer glow
    const glowFilter = defs.append('filter').attr('id', 'bubble-glow')
      .attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
    
    // Large soft glow layer
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '12')
      .attr('result', 'blur-large');
      
    // Medium glow layer for brightness
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '6')
      .attr('result', 'blur-medium');
      
    // Small tight glow for definition
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'blur-small');
    
    // Merge all glow layers for dramatic effect
    glowFilter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur-large', 'blur-medium', 'blur-small', 'SourceGraphic'])
      .enter().append('feMergeNode')
      .attr('in', d => d);

    // Enhanced X-ray ring filter with dramatic pulse effect
    const xrayFilter = defs.append('filter').attr('id', 'xray-glow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    
    // Multiple blur layers for X-ray depth
    xrayFilter.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'blur-outer');
    xrayFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur-mid');
    xrayFilter.append('feGaussianBlur').attr('stdDeviation', '1.5').attr('result', 'blur-inner');
    
    // Enhanced merge for more dramatic X-ray effect
    xrayFilter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur-outer', 'blur-mid', 'blur-inner', 'SourceGraphic'])
      .enter().append('feMergeNode')
      .attr('in', d => d);

    // Create cinematic radial gradients per node with deeper contrast and 3D effect
    nodes.forEach(node => {
      const base = d3.hsl(node.color);
      const highlight = d3.hsl(node.color);
      highlight.l = Math.min(base.l + 0.35, 0.85); // brighter highlight
      highlight.s = Math.min(base.s + 0.15, 1.0); // more saturated highlight
      
      const midtone = d3.hsl(node.color);
      midtone.l = base.l + 0.1;
      midtone.s = base.s + 0.05;
      
      const shadow = d3.hsl(node.color);
      shadow.l = Math.max(base.l - 0.35, 0.02); // much darker shadow
      shadow.s = Math.max(base.s - 0.1, 0.3); // slightly desaturated shadow

      const grad = defs.append('radialGradient')
        .attr('id', `grad-${node.id.replace(/[^a-zA-Z0-9]/g, '_')}`)
        .attr('cx', '25%').attr('cy', '25%').attr('r', '85%'); // shifted light source for 3D effect
      
      // Create more stops for smoother gradient
      grad.append('stop').attr('offset', '0%').attr('stop-color', highlight.formatRgb()).attr('stop-opacity', '1');
      grad.append('stop').attr('offset', '15%').attr('stop-color', midtone.formatRgb()).attr('stop-opacity', '1');
      grad.append('stop').attr('offset', '65%').attr('stop-color', node.color).attr('stop-opacity', '1');
      grad.append('stop').attr('offset', '90%').attr('stop-color', shadow.formatRgb()).attr('stop-opacity', '1');
      grad.append('stop').attr('offset', '100%').attr('stop-color', shadow.formatRgb()).attr('stop-opacity', '0.95'); // slight transparency at edge
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

    // Enhanced Voidspace void grid pattern with cinematic depth
    const gridPattern = defs.append('pattern')
      .attr('id', 'void-grid')
      .attr('width', 40)
      .attr('height', 40)
      .attr('patternUnits', 'userSpaceOnUse');
    
    // Deep void background with subtle gradient
    const gridBg = gridPattern.append('rect')
      .attr('width', 40)
      .attr('height', 40)
      .attr('fill', 'url(#grid-bg-gradient)');
      
    // Create background gradient for grid cells
    const gridBgGradient = defs.append('radialGradient')
      .attr('id', 'grid-bg-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '70%');
    gridBgGradient.append('stop').attr('offset', '0%').attr('stop-color', '#0e1419').attr('stop-opacity', '1');
    gridBgGradient.append('stop').attr('offset', '100%').attr('stop-color', '#0a0a0f').attr('stop-opacity', '1');
    
    // Primary grid lines with enhanced glow (near-green)
    gridPattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', '#00EC97')
      .attr('stroke-width', 0.8)
      .attr('opacity', 0.12)
      .style('filter', 'drop-shadow(0 0 2px #00EC9740)');
    
    // Secondary grid lines with soft glow (accent cyan) for depth
    gridPattern.append('path')
      .attr('d', 'M 20 0 L 20 40 M 0 20 L 40 20')
      .attr('fill', 'none')
      .attr('stroke', '#00D4FF')
      .attr('stroke-width', 0.4)
      .attr('opacity', 0.08)
      .style('filter', 'drop-shadow(0 0 1px #00D4FF30)');
    
    // Enhanced grid intersection dots with varied sizes
    const intersectionData = [
      {x: 0, y: 0, r: 0.8, opacity: 0.1}, 
      {x: 20, y: 20, r: 1.2, opacity: 0.08}, 
      {x: 40, y: 40, r: 0.6, opacity: 0.06},
      {x: 40, y: 0, r: 0.4, opacity: 0.04},
      {x: 0, y: 40, r: 0.4, opacity: 0.04}
    ];
    
    gridPattern.selectAll('.grid-dot')
      .data(intersectionData)
      .enter().append('circle')
      .attr('class', 'grid-dot')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', '#00EC97')
      .attr('opacity', d => d.opacity)
      .style('filter', 'drop-shadow(0 0 2px #00EC9730)');

    // Background with enhanced grid and subtle nebula effect
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#void-grid)')
      .attr('class', 'void-grid-bg')
      .style('cursor', 'pointer')
      .style('filter', 'contrast(1.1) brightness(0.95)') // Subtle enhancement
      .on('click', () => {
        // Collapse any expanded bubble when clicking background
        if (expandedBubble) {
          setExpandedBubble(null);
          const node = nodesRef.current.find(n => n.token.id === expandedBubble);
          if (node) {
            const bubbleGroup = svg.select(`g[data-bubble-id="${expandedBubble}"]`);
            bubbleGroup.select('.bubble-main')
              .transition().duration(300)
              .ease(d3.easeBackOut.overshoot(1.1))
              .attr('r', node.targetRadius);
            bubbleGroup.select('.bubble-glow')
              .transition().duration(300)
              .attr('r', node.targetRadius + 4);
            bubbleGroup.select('.bubble-outer-ring')
              .transition().duration(300)
              .attr('r', node.targetRadius + 8);
            bubbleGroup.selectAll('.expanded-content')
              .transition().duration(200)
              .attr('opacity', 0)
              .remove();
            simulationRef.current?.alpha(0.2).restart();
          }
        }
      });

    // Cinematic Voidspace star-field with dynamic depth layers
    const starLayer = svg.append('g').attr('class', 'star-layer');
    
    // Create multiple depth layers for parallax effect
    for (let layer = 0; layer < 3; layer++) {
      const starCount = layer === 0 ? 120 : layer === 1 ? 60 : 30; // more stars in background
      const layerGroup = starLayer.append('g').attr('class', `star-layer-${layer}`);
      
      for (let i = 0; i < starCount; i++) {
        const sx = Math.random() * width;
        const sy = Math.random() * height;
        
        // Varied star sizes based on layer (background stars smaller)
        const baseSize = layer === 0 ? 0.3 : layer === 1 ? 0.8 : 1.5;
        const sr = baseSize + Math.random() * (layer === 0 ? 0.5 : layer === 1 ? 1.0 : 2.0);
        
        // Enhanced star color distribution with more dramatic variety
        const colorChance = Math.random();
        let starColor, starOpacity;
        
        if (colorChance > 0.8) {
          starColor = '#00EC97'; // Near green (brightest)
          starOpacity = layer === 2 ? 0.25 : layer === 1 ? 0.15 : 0.08;
        } else if (colorChance > 0.6) {
          starColor = '#00D4FF'; // Cyan
          starOpacity = layer === 2 ? 0.20 : layer === 1 ? 0.12 : 0.06;
        } else if (colorChance > 0.4) {
          starColor = '#9D4EDD'; // Purple
          starOpacity = layer === 2 ? 0.18 : layer === 1 ? 0.10 : 0.05;
        } else if (colorChance > 0.2) {
          starColor = '#FFB800'; // Gold (rare)
          starOpacity = layer === 2 ? 0.15 : layer === 1 ? 0.08 : 0.04;
        } else {
          starColor = '#FFFFFF'; // Pure white (rarest)
          starOpacity = layer === 2 ? 0.12 : layer === 1 ? 0.06 : 0.03;
        }
        
        const shouldPulse = Math.random() > (0.7 - layer * 0.1); // more pulsing in foreground
        const shouldTwinkle = Math.random() > 0.85; // rare twinkling stars
        
        const star = layerGroup.append('circle')
          .attr('cx', sx).attr('cy', sy).attr('r', sr)
          .attr('fill', starColor)
          .attr('opacity', starOpacity)
          .style('filter', layer === 2 ? 'drop-shadow(0 0 2px currentColor)' : 'none'); // glow on foreground stars
          
        if (shouldTwinkle) {
          // Dramatic twinkling with size and opacity changes
          star.append('animateTransform')
            .attr('attributeName', 'opacity')
            .attr('values', `${starOpacity};${starOpacity * 3};${starOpacity * 0.3};${starOpacity * 2.5};${starOpacity}`)
            .attr('dur', `${1.5 + Math.random() * 3}s`)
            .attr('repeatCount', 'indefinite');
            
          star.append('animateTransform')
            .attr('attributeName', 'r')
            .attr('values', `${sr};${sr * 1.4};${sr * 0.8};${sr * 1.2};${sr}`)
            .attr('dur', `${1.5 + Math.random() * 3}s`)
            .attr('repeatCount', 'indefinite');
        } else if (shouldPulse) {
          // Gentle pulsing
          star.append('animateTransform')
            .attr('attributeName', 'opacity')
            .attr('values', `${starOpacity};${starOpacity * 1.8};${starOpacity}`)
            .attr('dur', `${3 + Math.random() * 6}s`)
            .attr('repeatCount', 'indefinite');
        }
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

    // Enhanced cinematic scan line layer with multiple beams
    const scanLineGroup = svg.append('g').attr('class', 'scan-line-layer');
    
    // Primary scan line gradient (bright)
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
    
    // Secondary scan line gradient (trail effect)
    const scanLineTrail = defs.append('linearGradient')
      .attr('id', 'scan-line-trail')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    
    scanLineTrail.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'transparent');
    scanLineTrail.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#9D4EDD')
      .attr('stop-opacity', '0.08');
    scanLineTrail.append('stop')
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
    
    // Trail line (follows behind main line)
    const trailLine = scanLineGroup.append('rect')
      .attr('x', 0)
      .attr('y', -1)
      .attr('width', width)
      .attr('height', 2)
      .attr('fill', 'url(#scan-line-trail)')
      .attr('opacity', 0);
    
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
      
      // Trail line (delayed start)
      setTimeout(() => {
        trailLine
          .attr('y', -20)
          .attr('opacity', 0)
          .transition()
          .duration(200)
          .attr('opacity', 0.6)
          .transition()
          .duration(10000)
          .ease(d3.easeLinear)
          .attr('y', height)
          .transition()
          .duration(300)
          .attr('opacity', 0);
      }, 800); // Delayed start for trail effect
    };
    
    setTimeout(animateScanLine, 3000); // Delayed initial start

    // Category zone labels removed - replaced with colored bubble borders

    // Bubble groups
    const bubbleGroups = svg.append('g').attr('class', 'bubbles-layer')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'bubble-group')
      .attr('data-bubble-id', d => d.token.id)
      .style('cursor', 'pointer');

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

    // Enhanced subtle outer ring with premium stroke styling
    bubbleGroups.append('circle')
      .attr('class', 'bubble-outer-ring')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => d.glowColor)
      .attr('stroke-width', 1.5) // Slightly thicker for more definition
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

    // Health indicator icon (only visible in X-ray mode)
    bubbleGroups.append('text')
      .attr('class', 'health-indicator')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('y', d => -d.targetRadius - 15)
      .attr('font-size', '14')
      .attr('opacity', 0)
      .style('pointer-events', 'none')
      .text(d => getHealthIcon(d.token.healthScore));

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
      .attr('fill', '#ffffff')
      .attr('font-size', d => {
        const symbolLen = d.token.symbol.length;
        const baseMultiplier = width < 768 ? 1.9 : 1.8; // Enhanced size scaling
        const fitFont = (d.targetRadius * baseMultiplier) / Math.max(symbolLen, 2);
        return Math.max(Math.min(fitFont, 22), 9); // Larger range for better hierarchy
      })
      .attr('font-weight', '800') // Heavier weight for more impact
      .attr('font-family', "'JetBrains Mono', 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace")
      .attr('letter-spacing', '0.02em') // Subtle letter spacing for premium feel
      .attr('pointer-events', 'none')
      .attr('opacity', 1)
      .style('text-shadow', `
        0 0 8px rgba(0,236,151,0.4),
        0 2px 4px rgba(0,0,0,0.9),
        0 4px 8px rgba(0,0,0,0.7),
        0 1px 0px rgba(255,255,255,0.1)
      `) // Multi-layer shadow with subtle glow and highlight
      .text(d => d.token.symbol);

    // Enhanced secondary label with premium typography matching primary label
    bubbleGroups.filter(d => d.targetRadius >= 20)
      .append('text')
      .attr('class', 'bubble-secondary')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('dy', '0.65em')
      .attr('fill', d => {
        if (bubbleContent === 'performance') {
          const currentChange = getCurrentPriceChange(d.token);
          return currentChange >= 0 ? '#00EC97' : '#FF3366';
        }
        return '#e5e7eb'; // slightly brighter neutral
      })
      .attr('font-size', d => {
        const mobileMultiplier = width < 768 ? 0.42 : 0.38; // Enhanced mobile scaling
        return Math.max(Math.min(d.targetRadius * mobileMultiplier, 16), 10); // Better range
      })
      .attr('font-weight', '700') // Consistent bold weight
      .attr('font-family', "'JetBrains Mono', 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace")
      .attr('letter-spacing', '0.01em') // Subtle spacing for readability
      .attr('pointer-events', 'none')
      .style('text-shadow', `
        0 2px 6px rgba(0,0,0,0.9),
        0 4px 12px rgba(0,0,0,0.6),
        0 1px 0px rgba(255,255,255,0.08)
      `) // Enhanced multi-layer shadow
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

    // Enhanced hover events with premium micro-interactions
    bubbleGroups
      .on('mouseenter', function(event, d) {
        setHoveredToken(d.token);
        setHoverPos({ x: event.clientX, y: event.clientY });

        const bubbleGroup = d3.select(this);
        
        // Enhanced bubble scale and glow on hover
        bubbleGroup.select('.bubble-main')
          .transition().duration(250)
          .ease(d3.easeBackOut.overshoot(1.1))
          .attr('r', d.targetRadius * 1.08) // Subtle scale up
          .attr('stroke-width', 3) // Thicker border
          .attr('opacity', 1)
          .attr('stroke-opacity', 0.8); // Brighter border

        // Dramatic glow enhancement
        bubbleGroup.select('.bubble-glow')
          .transition().duration(250)
          .attr('r', (d.targetRadius * 1.08) + 6) // Sync with main bubble
          .attr('opacity', 0.85) // Much brighter glow
          .attr('stroke-width', 4.5); // Thicker glow

        // Outer ring enhancement
        bubbleGroup.select('.bubble-outer-ring')
          .transition().duration(250)
          .attr('r', (d.targetRadius * 1.08) + 10) // Sync with main bubble
          .attr('opacity', 0.6) // More visible
          .attr('stroke-width', 2.5); // Thicker ring

        // Subtle label enhancement
        bubbleGroup.select('.bubble-label')
          .transition().duration(200)
          .style('text-shadow', `
            0 0 12px rgba(0,236,151,0.8),
            0 2px 4px rgba(0,0,0,0.9),
            0 4px 8px rgba(0,0,0,0.7),
            0 1px 0px rgba(255,255,255,0.2)
          `);

        bubbleGroup.select('.bubble-secondary')
          .transition().duration(200)
          .style('text-shadow', `
            0 2px 8px rgba(0,0,0,0.9),
            0 4px 16px rgba(0,0,0,0.6),
            0 1px 0px rgba(255,255,255,0.15)
          `);
      })
      .on('mousemove', (event) => {
        setHoverPos({ x: event.clientX, y: event.clientY });
      })
      .on('mouseleave', function(event, d) {
        setHoveredToken(null);

        const bubbleGroup = d3.select(this);

        // Smooth return to normal state
        bubbleGroup.select('.bubble-main')
          .transition().duration(300)
          .ease(d3.easeBackOut.overshoot(1.05))
          .attr('r', d.targetRadius) // Back to original size
          .attr('stroke-width', 2) // Normal border
          .attr('opacity', 0.92)
          .attr('stroke-opacity', 0.4); // Normal border opacity

        // Glow return
        bubbleGroup.select('.bubble-glow')
          .transition().duration(300)
          .attr('r', d.targetRadius + 4) // Back to normal
          .attr('opacity', (node: BubbleNode) => {
            // Return to dynamic opacity
            const currentChange = getCurrentPriceChange(node.token);
            const baseOpacity = 0.45;
            const performanceBonus = Math.min(Math.abs(currentChange) / 50, 0.2);
            const sizeBonus = Math.min(node.targetRadius / 100, 0.15);
            return Math.min(baseOpacity + performanceBonus + sizeBonus, 0.8);
          })
          .attr('stroke-width', 3.5); // Back to normal

        // Outer ring return
        bubbleGroup.select('.bubble-outer-ring')
          .transition().duration(300)
          .attr('r', d.targetRadius + 8) // Back to normal
          .attr('opacity', (node: BubbleNode) => {
            const healthScore = node.token.healthScore;
            const baseOpacity = 0.18;
            const healthBonus = healthScore >= 75 ? 0.12 : healthScore >= 50 ? 0.06 : 0;
            return baseOpacity + healthBonus;
          })
          .attr('stroke-width', 1.5); // Back to normal

        // Label return to normal
        bubbleGroup.select('.bubble-label')
          .transition().duration(250)
          .style('text-shadow', `
            0 0 8px rgba(0,236,151,0.4),
            0 2px 4px rgba(0,0,0,0.9),
            0 4px 8px rgba(0,0,0,0.7),
            0 1px 0px rgba(255,255,255,0.1)
          `);

        bubbleGroup.select('.bubble-secondary')
          .transition().duration(250)
          .style('text-shadow', `
            0 2px 6px rgba(0,0,0,0.9),
            0 4px 12px rgba(0,0,0,0.6),
            0 1px 0px rgba(255,255,255,0.08)
          `);
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
          // Single-click - set timeout for bubble pop
          const timeout = setTimeout(() => {
            handleBubblePop(tokenId);
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

    // Volume-based pulse mode — physical radius oscillation based on volume/market cap ratio
    const initVolumePulse = () => {
      nodes.forEach((node, i) => {
        if (!pulseMode) return;
        
        const token = node.token;
        const volumeRatio = token.volume24h / Math.max(token.marketCap, 1); // Avoid division by zero
        
        // Skip tokens with very low volume activity
        if (volumeRatio < 0.001) return;
        
        // Calculate pulse parameters based on volume ratio
        const maxRatio = 0.5; // Cap at 50% volume/mcap ratio for scaling
        const normalizedRatio = Math.min(volumeRatio / maxRatio, 1);
        
        // Pulse amplitude: 0-15% of radius based on volume ratio
        const pulseAmplitude = normalizedRatio * 0.15 * node.targetRadius;
        
        // Pulse speed: high ratio = fast (800ms), low ratio = slow (3000ms)
        const pulseDuration = 3000 - (normalizedRatio * 2200); // 3000ms -> 800ms
        
        const bubbleSel = d3.select(bubbleGroups.nodes()[i]).select('.bubble-main');
        const glowSel = d3.select(bubbleGroups.nodes()[i]).select('.bubble-glow');
        const outerRingSel = d3.select(bubbleGroups.nodes()[i]).select('.bubble-outer-ring');
        
        let pulseDirection = 1; // 1 for expand, -1 for contract
        
        const volumePulseLoop = () => {
          if (!pulseMode) return;
          
          const targetRadius = node.targetRadius + (pulseAmplitude * pulseDirection);
          const targetGlowRadius = targetRadius + 4;
          const targetRingRadius = targetRadius + 8;
          
          // Use sinusoidal easing for smooth breathing effect
          bubbleSel
            .transition()
            .duration(pulseDuration / 2)
            .ease(d3.easeSinInOut)
            .attr('r', targetRadius)
            .on('end', volumePulseLoop);
          
          glowSel
            .transition()
            .duration(pulseDuration / 2)
            .ease(d3.easeSinInOut)
            .attr('r', targetGlowRadius);
          
          outerRingSel
            .transition()
            .duration(pulseDuration / 2)
            .ease(d3.easeSinInOut)
            .attr('r', targetRingRadius);
          
          pulseDirection *= -1; // Flip direction for next cycle
        };
        
        // Stagger the start times to avoid synchronization
        setTimeout(volumePulseLoop, entryDelay + i * 100 + Math.random() * 500);
      });
    };
    
    // Also keep momentum pulse for price direction (glow only, not size)
    const initMomentumGlow = () => {
      nodes.forEach((node, i) => {
        const currentChange = getCurrentPriceChange(node.token);
        const absPct = Math.abs(currentChange);
        if (absPct < 5) return; // Only significant movers
        
        const glowSel = d3.select(bubbleGroups.nodes()[i]).select('.bubble-glow');
        const glowIntensity = Math.min(absPct / 30, 0.6);
        const glowDuration = 2000 - Math.min(absPct * 15, 700);
        
        const momentumGlowLoop = () => {
          glowSel
            .transition().duration(glowDuration).ease(d3.easeSinInOut)
            .attr('opacity', 0.4 + glowIntensity)
            .transition().duration(glowDuration).ease(d3.easeSinInOut)
            .attr('opacity', 0.2)
            .on('end', momentumGlowLoop);
        };
        setTimeout(momentumGlowLoop, entryDelay + i * 80);
      });
    };
    
    const entryDelay = nodes.length * 15 + 800;
    setTimeout(() => {
      initVolumePulse();
      initMomentumGlow();
    }, entryDelay);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        svg.select('.bubbles-layer').attr('transform', event.transform);
        svg.select('.shockwave-layer').attr('transform', event.transform);
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
    const healthIndicators = svg.selectAll('.health-indicator');
    const bubbleGroups = svg.selectAll('.bubble-group');
    
    // Only proceed if elements exist
    if (rings.empty()) return;
    
    // Iterate over xray rings and toggle visibility with enhanced health-based styling
    (rings.nodes() as Element[]).forEach((el) => {
      if (!el?.parentNode) return;
      const d = d3.select(el.parentNode as Element).datum() as BubbleNode;
      const healthStatus = getHealthStatus(d.token.healthScore);
      
      d3.select(el)
        .transition().duration(400)
        .attr('r', xrayMode ? (d.targetRadius + 8) : 0) // Slightly larger for more visibility
        .attr('opacity', xrayMode ? 0.9 : 0)
        .attr('stroke', xrayMode ? HEALTH_COLORS[healthStatus] : RISK_COLORS[d.token.riskLevel])
        .attr('stroke-width', xrayMode ? 
          (healthStatus === 'unhealthy' ? 5 : healthStatus === 'medium' ? 4 : 3) : 
          (d.token.riskLevel === 'critical' ? 4 : d.token.riskLevel === 'high' ? 3 : 2)
        );
    });

    // Toggle health indicator icons
    (healthIndicators.nodes() as Element[]).forEach((el) => {
      d3.select(el)
        .transition().duration(400)
        .attr('opacity', xrayMode ? 1 : 0);
    });

    // Add pulsing effect for unhealthy tokens in X-ray mode
    if (xrayMode) {
      (bubbleGroups.nodes() as Element[]).forEach((groupEl) => {
        const d = d3.select(groupEl).datum() as BubbleNode;
        const healthStatus = getHealthStatus(d.token.healthScore);
        
        if (healthStatus === 'unhealthy') {
          // Add dramatic pulsing glow for unhealthy tokens
          const mainBubble = d3.select(groupEl).select('.bubble-main');
          const glow = d3.select(groupEl).select('.bubble-glow');
          
          const pulseLoop = () => {
            if (!xrayMode) return;
            
            mainBubble
              .transition().duration(800)
              .attr('opacity', 0.7)
              .transition().duration(800)
              .attr('opacity', 1)
              .on('end', pulseLoop);
              
            glow
              .transition().duration(800)
              .attr('opacity', 0.4)
              .attr('stroke', HEALTH_COLORS.unhealthy)
              .transition().duration(800)
              .attr('opacity', 0.8)
              .on('end', pulseLoop);
          };
          
          setTimeout(pulseLoop, Math.random() * 500);
        } else if (healthStatus === 'healthy') {
          // Bright steady glow for healthy tokens
          const glow = d3.select(groupEl).select('.bubble-glow');
          glow.transition().duration(400)
            .attr('stroke', HEALTH_COLORS.healthy)
            .attr('opacity', 0.6);
        } else if (healthStatus === 'medium') {
          // Warning amber glow for medium tokens
          const glow = d3.select(groupEl).select('.bubble-glow');
          glow.transition().duration(400)
            .attr('stroke', HEALTH_COLORS.medium)
            .attr('opacity', 0.5);
        }
      });
    } else {
      // Return to normal category-based coloring when X-ray is off
      (bubbleGroups.nodes() as Element[]).forEach((groupEl) => {
        const d = d3.select(groupEl).datum() as BubbleNode;
        const glow = d3.select(groupEl).select('.bubble-glow');
        
        glow.transition().duration(400)
          .attr('stroke', d.glowColor)
          .attr('opacity', 0.35);
      });
    }

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

  // Spotlight Search effect
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const groups = svg.selectAll('.bubble-group');
    
    if (!searchQuery.trim()) {
      // Reset all bubbles to normal when search is cleared
      groups.select('.bubble-main').transition().duration(300).attr('opacity', 0.92);
      groups.select('.bubble-glow').transition().duration(300).attr('opacity', 0.35);
      groups.select('.bubble-label').transition().duration(300).attr('opacity', 1);
      groups.select('.bubble-secondary').transition().duration(300).attr('opacity', 1);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    groups.each(function() {
      const el = d3.select(this);
      const d = el.datum() as BubbleNode;
      const matches = d.token.symbol.toLowerCase().includes(query) || 
                     d.token.name.toLowerCase().includes(query);
      
      el.select('.bubble-main')
        .transition().duration(400)
        .attr('opacity', matches ? 1 : 0.15);
      
      el.select('.bubble-glow')
        .transition().duration(400)
        .attr('opacity', matches ? 0.7 : 0.05);
      
      el.select('.bubble-label')
        .transition().duration(400)
        .attr('opacity', matches ? 1 : 0.1);
      
      el.select('.bubble-secondary')
        .transition().duration(400)
        .attr('opacity', matches ? 1 : 0.1);
    });
  }, [searchQuery, filteredTokens]);

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

          {/* Health Score with enhanced X-ray styling */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Health Score</span>
              <div className="flex items-center gap-2">
                {selectedToken.riskLevel === 'critical' && <span className="text-lg">💀</span>}
                <span className="text-sm">{getHealthIcon(selectedToken.healthScore)}</span>
                <span className="text-2xl font-bold font-mono"
                  style={{ color: HEALTH_COLORS[getHealthStatus(selectedToken.healthScore)] }}
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
                  backgroundColor: HEALTH_COLORS[getHealthStatus(selectedToken.healthScore)],
                  boxShadow: `0 0 8px ${HEALTH_COLORS[getHealthStatus(selectedToken.healthScore)]}40`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${selectedToken.healthScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            {/* Health status text */}
            <div className="mt-1">
              <span 
                className="text-xs font-mono font-bold"
                style={{ color: HEALTH_COLORS[getHealthStatus(selectedToken.healthScore)] }}
              >
                {getHealthStatus(selectedToken.healthScore).toUpperCase()} 
                {getHealthStatus(selectedToken.healthScore) === 'healthy' && ' - GOOD TO GO'}
                {getHealthStatus(selectedToken.healthScore) === 'medium' && ' - PROCEED WITH CAUTION'}
                {getHealthStatus(selectedToken.healthScore) === 'unhealthy' && ' - DANGER ZONE'}
              </span>
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
          <div className="mb-4">
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">External Links</p>
            
            {/* DexScreener and Ref Finance links (if contract address available) */}
            {selectedToken.contractAddress && selectedToken.contractAddress !== 'N/A' && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs h-10 bg-surface hover:bg-surface-hover border-near-green/30"
                  onClick={() => window.open(`https://dexscreener.com/near/${selectedToken.contractAddress}`, '_blank')}
                >
                  📊 DexScreener
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs h-10 bg-surface hover:bg-surface-hover border-accent-cyan/30"
                  onClick={() => window.open(`https://app.ref.finance/#near|${selectedToken.contractAddress}`, '_blank')}
                >
                  💱 Trade on Ref
                </Button>
              </div>
            )}
            
            {/* Social Links */}
            {(selectedToken.website || selectedToken.twitter || selectedToken.telegram) && (
              <div className="flex gap-2 flex-wrap">
                {selectedToken.website && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-xs h-8 px-2 min-w-[44px]"
                    onClick={() => window.open(selectedToken.website, '_blank')}
                  >
                    🌐
                  </Button>
                )}
                {selectedToken.twitter && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-xs h-8 px-2 min-w-[44px]"
                    onClick={() => window.open(selectedToken.twitter, '_blank')}
                  >
                    🐦
                  </Button>
                )}
                {selectedToken.telegram && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-xs h-8 px-2 min-w-[44px]"
                    onClick={() => window.open(selectedToken.telegram, '_blank')}
                  >
                    📱
                  </Button>
                )}
              </div>
            )}
            
            {/* Message if no contract address */}
            {(!selectedToken.contractAddress || selectedToken.contractAddress === 'N/A') && (
              <p className="text-xs text-text-muted italic">
                Trading links unavailable - contract address not found
              </p>
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

  // ────────────────────── Whale Alert Feed (Removed - replaced with bubble effects) ──────────────────────

  // Whale alerts now show as dramatic visual effects on the bubbles themselves
  // The renderWhaleAlerts function has been removed - all whale activity is now visualized
  // directly on the affected bubbles via the enhanced triggerShockwave function

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
      {/* Power Bar - Responsive Controls */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20">
        {/* Mobile Power Bar (< 768px) */}
        <div className="md:hidden flex items-center justify-between gap-2">
          {/* Critical timeframe selector stays visible */}
          <div className="flex items-center gap-0.5 bg-surface/80 backdrop-blur-xl rounded-lg border border-border p-0.5 flex-shrink-0">
            {(['1h', '4h', '1d', '7d', '30d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-2 py-1.5 rounded-md text-[10px] font-mono font-bold transition-all uppercase',
                  'min-w-[32px] touch-manipulation',
                  period === p
                    ? 'bg-near-green/20 text-near-green border border-near-green/30'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Settings gear opens mobile panel */}
          <button
            onClick={() => setShowMobilePanel(true)}
            className={cn(
              'relative p-2.5 rounded-lg border transition-all group overflow-hidden bg-surface/80 border-border text-text-muted',
              'min-w-[44px] min-h-[44px] touch-manipulation flex items-center justify-center'
            )}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Full Controls (>= 768px) */}
        <div className="hidden md:flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
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
      </div>

      {/* Mobile Settings Panel */}
      <AnimatePresence>
        {showMobilePanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowMobilePanel(false)}
            />
            
            {/* Slide-up Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-border rounded-t-xl z-50 md:hidden"
            >
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono font-bold text-text-primary">Settings</h3>
                  <button
                    onClick={() => setShowMobilePanel(false)}
                    className="p-1 rounded-md hover:bg-surface-hover transition-colors"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>

                {/* Category Filters */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Filters</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Gainers/Losers */}
                    <button
                      onClick={() => setHighlightMode(highlightMode === 'gainers' ? 'none' : 'gainers')}
                      className={cn(
                        'px-3 py-2 rounded-md text-xs font-mono transition-all',
                        highlightMode === 'gainers'
                          ? 'bg-near-green/20 text-near-green border border-near-green/30'
                          : 'bg-surface text-text-muted border border-border'
                      )}
                    >
                      🔥 Gainers
                    </button>
                    <button
                      onClick={() => setHighlightMode(highlightMode === 'losers' ? 'none' : 'losers')}
                      className={cn(
                        'px-3 py-2 rounded-md text-xs font-mono transition-all',
                        highlightMode === 'losers'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-surface text-text-muted border border-border'
                      )}
                    >
                      💀 Losers
                    </button>
                  </div>
                  {/* Categories */}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={cn(
                          'px-3 py-2 rounded-md text-xs font-mono transition-all',
                          filterCategory === cat
                            ? 'bg-near-green/20 text-near-green border border-near-green/30'
                            : 'bg-surface text-text-muted border border-border'
                        )}
                      >
                        {cat === 'all' ? 'ALL' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Metric */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Bubble Size</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'marketCap', label: 'Market Cap' },
                      { key: 'volume', label: 'Volume' },
                      { key: 'performance', label: 'Performance' },
                    ].map(opt => (
                      <button 
                        key={opt.key} 
                        onClick={() => setSizeMetric(opt.key as typeof sizeMetric)}
                        className={cn(
                          'px-3 py-2 rounded-md text-xs font-mono transition-all',
                          sizeMetric === opt.key
                            ? 'bg-near-green/20 text-near-green border border-near-green/30'
                            : 'bg-surface text-text-muted border border-border'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bubble Content */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Bubble Content</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'performance', label: 'Performance %' },
                      { key: 'price', label: 'Price $' },
                      { key: 'volume', label: 'Volume' },
                      { key: 'marketCap', label: 'Market Cap' },
                    ].map(opt => (
                      <button 
                        key={opt.key} 
                        onClick={() => setBubbleContent(opt.key as typeof bubbleContent)}
                        className={cn(
                          'px-3 py-2 rounded-md text-xs font-mono transition-all',
                          bubbleContent === opt.key
                            ? 'bg-near-green/20 text-near-green border border-near-green/30'
                            : 'bg-surface text-text-muted border border-border'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Toggles */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setXrayMode(!xrayMode)}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all font-mono text-sm',
                      xrayMode
                        ? 'bg-accent-cyan/20 border-accent-cyan/30 text-accent-cyan'
                        : 'bg-surface border-border text-text-muted'
                    )}
                  >
                    {xrayMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    X-Ray
                  </button>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all font-mono text-sm',
                      soundEnabled
                        ? 'bg-near-green/20 border-near-green/30 text-near-green'
                        : 'bg-surface border-border text-text-muted'
                    )}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    Sound
                  </button>

                  <button
                    onClick={handleSnapshot}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border bg-surface border-border text-text-muted transition-all font-mono text-sm"
                  >
                    <Camera className="w-4 h-4" />
                    Camera
                  </button>

                  <button
                    onClick={handleShareX}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border bg-surface border-border text-text-muted transition-all font-mono text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>

                  <button
                    onClick={() => initSimulation()}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border bg-surface border-border text-text-muted transition-all font-mono text-sm col-span-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Visualization
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

      {/* SVG Canvas with Enhanced Cosmic Background */}
      <div ref={containerRef} className="w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ 
            background: `
              radial-gradient(ellipse 120% 80% at 30% 20%, rgba(157, 78, 221, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 70% 80%, rgba(0, 212, 255, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse 150% 100% at 50% 45%, rgba(0, 236, 151, 0.04) 0%, rgba(13, 26, 21, 0.6) 25%, rgba(10, 15, 20, 0.8) 60%, rgba(8, 8, 9, 1) 100%),
              linear-gradient(135deg, #0a0f14 0%, #0d1119 25%, #0a0a0f 50%, #0c0e14 75%, #080809 100%)
            `,
          }}
        />
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {renderHoverTooltip()}
        {renderTokenAnatomy()}
      </AnimatePresence>

      {/* Spotlight Search */}
      <div className="absolute bottom-4 right-4 z-30">
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
    </div>
  );
}
