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
  DeFi: '#00EC97',
  Stablecoin: '#00D4FF',
  Infrastructure: '#9D4EDD',
  Meme: '#FF6B6B',
  Gaming: '#FFA502',
  NFT: '#FF69B4',
  'Move-to-Earn': '#00CED1',
  AI: '#7B68EE',
  Other: '#888888',
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
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<string>('');

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
      const res = await fetch('/api/void-bubbles');
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
  }, []);

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [fetchTokens]);

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

  const initSimulation = useCallback(() => {
    if (!svgRef.current || !containerRef.current || filteredTokens.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Scale radius by market cap
    const maxCap = Math.max(...filteredTokens.map(t => t.marketCap), 1);
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxCap])
      .range([8, Math.min(width, height) * 0.08]);

    // Create nodes
    const nodes: BubbleNode[] = filteredTokens.map((token, i) => {
      const angle = (i / filteredTokens.length) * 2 * Math.PI;
      const spread = Math.min(width, height) * 0.3;
      const r = radiusScale(token.marketCap);
      const catColor = CATEGORY_COLORS[token.category] || '#888888';
      const changeColor = token.priceChange24h >= 0
        ? `rgba(0, 236, 151, ${Math.min(Math.abs(token.priceChange24h) / 30, 1) * 0.8 + 0.2})`
        : `rgba(255, 71, 87, ${Math.min(Math.abs(token.priceChange24h) / 30, 1) * 0.8 + 0.2})`;

      return {
        id: token.id,
        token,
        radius: 0,
        targetRadius: r,
        color: changeColor,
        glowColor: catColor,
        x: centerX + Math.cos(angle) * spread * 0.5,
        y: centerY + Math.sin(angle) * spread * 0.5,
      };
    });

    nodesRef.current = nodes;

    // Clear previous
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs for gradients and filters
    const defs = svg.append('defs');

    // Glow filter
    const glowFilter = defs.append('filter').attr('id', 'bubble-glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
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

    // Create radial gradients per node
    nodes.forEach(node => {
      const grad = defs.append('radialGradient')
        .attr('id', `grad-${node.id.replace(/[^a-zA-Z0-9]/g, '_')}`)
        .attr('cx', '35%').attr('cy', '35%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(255,255,255,0.25)');
      grad.append('stop').attr('offset', '50%').attr('stop-color', node.color);
      grad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0,0,0,0.3)');
    });

    // Shockwave layer
    svg.append('g').attr('class', 'shockwave-layer');

    // Bubble groups
    const bubbleGroups = svg.append('g').attr('class', 'bubbles-layer')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'bubble-group')
      .style('cursor', 'pointer');

    // Outer glow circle
    bubbleGroups.append('circle')
      .attr('class', 'bubble-glow')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => d.glowColor)
      .attr('stroke-width', 1)
      .attr('opacity', 0.3)
      .attr('filter', 'url(#bubble-glow)');

    // X-ray concentration rings (hidden by default)
    bubbleGroups.append('circle')
      .attr('class', 'xray-ring')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => RISK_COLORS[d.token.riskLevel])
      .attr('stroke-width', d => d.token.riskLevel === 'critical' ? 4 : d.token.riskLevel === 'high' ? 3 : 2)
      .attr('opacity', 0)
      .attr('filter', 'url(#xray-glow)');

    // Main bubble
    bubbleGroups.append('circle')
      .attr('class', 'bubble-main')
      .attr('data-id', d => d.token.id)
      .attr('r', 0)
      .attr('fill', d => `url(#grad-${d.id.replace(/[^a-zA-Z0-9]/g, '_')})`)
      .attr('stroke', d => d.glowColor)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.9);

    // Skull overlay for critical risk
    bubbleGroups.filter(d => d.token.riskLevel === 'critical' || d.token.riskLevel === 'high')
      .append('text')
      .attr('class', 'skull-overlay')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', d => Math.max(d.targetRadius * 0.6, 10))
      .attr('opacity', 0)
      .text('💀');

    // Symbol labels (only for larger bubbles)
    bubbleGroups.filter(d => d.targetRadius > 15)
      .append('text')
      .attr('class', 'bubble-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#fff')
      .attr('font-size', d => Math.max(Math.min(d.targetRadius * 0.4, 14), 8))
      .attr('font-weight', '600')
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('pointer-events', 'none')
      .text(d => d.token.symbol);

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
          .attr('opacity', 0.6);
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
          .attr('opacity', 0.3);
      })
      .on('click', (_event, d) => {
        setSelectedToken(d.token);
        if (d.token.priceChange24h > 5) sonicRef.current.playPump(Math.min(d.token.priceChange24h / 30, 1));
        else if (d.token.priceChange24h < -5) sonicRef.current.playDump(Math.min(Math.abs(d.token.priceChange24h) / 30, 1));
        if (d.token.riskLevel === 'critical') sonicRef.current.playRisk();
      });

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('center', d3.forceCenter(centerX, centerY).strength(0.02))
      .force('charge', d3.forceManyBody().strength(d => -(d as BubbleNode).targetRadius * 1.5))
      .force('collision', d3.forceCollide<BubbleNode>().radius(d => d.targetRadius + 3).strength(0.8))
      .force('x', d3.forceX(centerX).strength(0.015))
      .force('y', d3.forceY(centerY).strength(0.015))
      .alphaDecay(0.01)
      .velocityDecay(0.3)
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

        // Skulls fade in for risky tokens
        d3.select(bubbleGroups.nodes()[i]).select('.skull-overlay')
          .transition().duration(800).delay(400)
          .attr('opacity', 0.7);
      }, delay);
    });

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
  }, [filteredTokens, watchlist]);

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

  // ────────────────────── Snapshot & Share ──────────────────────

  const handleSnapshot = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get the bounding box of actual bubble content to crop tightly
      const bubblesLayer = svgRef.current.querySelector('.bubbles-layer');
      const shockwaveLayer = svgRef.current.querySelector('.shockwave-layer');

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
        <Card variant="glass" padding="lg" className="relative">
          <button
            onClick={() => setSelectedToken(null)}
            className="absolute top-3 right-3 p-1 hover:bg-surface-hover rounded transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>

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
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">24h Change</p>
              <p className={cn('text-lg font-bold font-mono flex items-center gap-1',
                selectedToken.priceChange24h >= 0 ? 'text-near-green' : 'text-error'
              )}>
                {selectedToken.priceChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {selectedToken.priceChange24h >= 0 ? '+' : ''}{selectedToken.priceChange24h.toFixed(1)}%
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
                style={{ backgroundColor: RISK_COLORS[selectedToken.riskLevel] }}
                initial={{ width: 0 }}
                animate={{ width: `${selectedToken.healthScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
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

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="fixed z-50 pointer-events-none"
        style={{ left: hoverPos.x + 16, top: hoverPos.y - 10 }}
      >
        <div className="bg-surface/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-2xl min-w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-text-primary font-mono text-sm">{hoveredToken.symbol}</span>
            <span className={cn('text-xs font-mono font-bold', verdictColor)}>{verdict}</span>
          </div>
          <div className="text-xs text-text-muted font-mono">
            {formatPrice(hoveredToken.price)} · <span className={hoveredToken.priceChange24h >= 0 ? 'text-near-green' : 'text-error'}>
              {hoveredToken.priceChange24h >= 0 ? '+' : ''}{hoveredToken.priceChange24h.toFixed(1)}%
            </span>
          </div>
          {hoveredToken.riskLevel === 'critical' && (
            <div className="text-xs text-error mt-1 flex items-center gap-1">
              💀 High rug risk
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // ────────────────────── Whale Alert Feed ──────────────────────

  const renderWhaleAlerts = () => {
    if (whaleAlerts.length === 0) return null;

    return (
      <div className="absolute bottom-14 sm:bottom-14 left-2 sm:left-4 z-20 space-y-1.5 max-w-[260px] sm:max-w-[280px]">
        <AnimatePresence mode="popLayout">
          {whaleAlerts.slice(0, 3).map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.8 }}
              className="flex items-center gap-2 bg-surface/90 backdrop-blur-xl border border-border rounded-lg px-3 py-2"
            >
              <Zap className={cn('w-3.5 h-3.5 shrink-0', alert.type === 'buy' ? 'text-near-green' : 'text-error')} />
              <div className="min-w-0">
                <p className="text-[11px] text-text-primary font-mono truncate">
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
      <div className="flex items-center justify-center h-[600px] bg-background rounded-xl border border-border">
        <div className="text-center space-y-4">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-near-green/30 border-t-near-green mx-auto"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
          <div>
            <p className="text-text-primary font-semibold">Scanning NEAR Ecosystem</p>
            <p className="text-text-muted text-sm">Loading {'>'}350 tokens from Ref Finance + DexScreener...</p>
          </div>
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
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] bg-background rounded-xl border border-border overflow-hidden">
      {/* Top Controls — single row on desktop, stacked on mobile */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        {/* Category filters — scrollable on mobile */}
        <div className="flex items-center gap-1 bg-surface/80 backdrop-blur-xl rounded-lg border border-border p-1 overflow-x-auto scrollbar-hide max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                'px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition-all whitespace-nowrap flex-shrink-0',
                filterCategory === cat
                  ? 'bg-near-green/20 text-near-green border border-near-green/30'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
              )}
            >
              {cat === 'all' ? 'ALL' : cat}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setXrayMode(!xrayMode)}
            className={cn(
              'p-1.5 sm:p-2 rounded-lg border transition-all',
              xrayMode
                ? 'bg-accent-cyan/20 border-accent-cyan/30 text-accent-cyan'
                : 'bg-surface/80 border-border text-text-muted hover:text-text-secondary'
            )}
            title="X-Ray Mode — See concentration risk"
          >
            {xrayMode ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
          <button
            onClick={() => { setSoundEnabled(!soundEnabled); }}
            className={cn(
              'p-1.5 sm:p-2 rounded-lg border transition-all',
              soundEnabled
                ? 'bg-near-green/20 border-near-green/30 text-near-green'
                : 'bg-surface/80 border-border text-text-muted hover:text-text-secondary'
            )}
            title="Sonic Mode — Hear the market"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
          <button
            onClick={handleSnapshot}
            className="p-1.5 sm:p-2 rounded-lg border bg-surface/80 border-border text-text-muted hover:text-text-secondary transition-all"
            title="Save snapshot"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleShareX}
            className="p-1.5 sm:p-2 rounded-lg border bg-surface/80 border-border text-text-muted hover:text-text-secondary transition-all"
            title="Share on X"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => { initSimulation(); }}
            className="p-1.5 sm:p-2 rounded-lg border bg-surface/80 border-border text-text-muted hover:text-text-secondary transition-all"
            title="Reset view"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-auto right-2 sm:right-4 z-20 flex items-center justify-center sm:justify-end gap-3 bg-surface/80 backdrop-blur-xl rounded-lg border border-border px-3 py-1.5 sm:py-2">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-near-green" />
          <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">
            {filteredTokens.length} tokens
          </span>
        </div>
        <div className="w-px h-3 bg-border" />
        <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">
          {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : 'Live'}
        </span>
        {xrayMode && (
          <>
            <div className="w-px h-3 bg-border" />
            <span className="text-[10px] sm:text-[11px] font-mono text-accent-cyan flex items-center gap-1">
              <Eye className="w-3 h-3" /> X-RAY
            </span>
          </>
        )}
      </div>

      {/* SVG Canvas */}
      <div ref={containerRef} className="w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ background: 'radial-gradient(ellipse at center, #111111 0%, #0a0a0a 70%)' }}
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
