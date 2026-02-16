'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Search, Network, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { ConstellationContextMenu } from './ConstellationContextMenu';
import { ConstellationMinimap } from './ConstellationMinimap';
import { ConstellationControls } from './ConstellationControls';
import { useAchievementContext } from '@/contexts/AchievementContext';

// ── Types ──────────────────────────────────────────────────────────

interface ConstellationNode {
  id: string;
  type: 'wallet' | 'contract' | 'dao';
  transactionCount: number;
  firstSeen?: string;
  lastSeen?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  expanded?: boolean;
}

interface ConstellationEdge {
  source: string | ConstellationNode;
  target: string | ConstellationNode;
  weight: number;
  transactionCount: number;
  totalValue: number;
  sentCount?: number;
  receivedCount?: number;
  totalValueSent?: number;
  totalValueReceived?: number;
  direction?: 'outflow' | 'inflow' | 'bidirectional';
  lastInteraction?: string;
  firstInteraction?: string;
}

interface ConstellationData {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  centerNode: string;
}

interface TooltipData {
  x: number;
  y: number;
  kind: 'node' | 'edge';
  node?: {
    id: string;
    type: string;
    transactionCount: number;
    firstSeen?: string;
    lastSeen?: string;
    totalValueIn?: number;
    totalValueOut?: number;
    isCenter?: boolean;
    isExpanded?: boolean;
  };
  edge?: {
    sourceId: string;
    targetId: string;
    transactionCount: number;
    totalValue: number;
    sentCount?: number;
    receivedCount?: number;
    totalValueSent?: number;
    totalValueReceived?: number;
    direction?: string;
    lastInteraction?: string;
    firstInteraction?: string;
  };
}

interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string;
  isCenter: boolean;
  isExpanded: boolean;
}

type NodeType = 'wallet' | 'contract' | 'dao';

// ── Constants ──────────────────────────────────────────────────────

const NODE_COLORS = {
  wallet: '#8B5CF6',
  contract: '#06B6D4',
  dao: '#F59E0B',
  center: '#FFFFFF',
};

const NODE_RADIUS = { min: 3, max: 20, center: 15 };

const EXAMPLE_WALLETS = [
  { id: 'starpause.near', label: 'NEAR OG' },
  { id: 'mob.near', label: 'Social' },
  { id: 'sweat_welcome.near', label: 'SWEAT' },
];

const POPULAR_WALLETS = ['near', 'app.nearcrowd.near', 'aurora', 'ref-finance.near'];

const PERIOD_OPTIONS = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'all', label: 'All' },
] as const;

const LS_KEY = 'voidspace:constellation:recent';

// ── Helpers ────────────────────────────────────────────────────────

function smartTruncate(name: string, max: number, isCenter: boolean): string {
  if (isCenter) return name; // Always show full center name
  if (name.length <= max) return name;
  const nearIdx = name.lastIndexOf('.near');
  if (nearIdx > 0) {
    const suffix = name.slice(nearIdx);
    const available = max - suffix.length - 2; // 2 for ".."
    if (available > 3) return name.slice(0, available) + '..' + suffix;
  }
  return name.slice(0, max - 2) + '..';
}

function formatNear(value: number): string {
  if (value === 0) return '0 NEAR';
  if (value < 0.001) return '<0.001 NEAR';
  if (value < 1) return value.toFixed(3) + ' NEAR';
  if (value < 1000) return value.toFixed(2) + ' NEAR';
  return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' NEAR';
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';
  const ts = Number(dateString);
  const date = ts > 1e15 ? new Date(ts / 1e6) : new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getRecent(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecent(address: string) {
  try {
    let recent = getRecent().filter(a => a !== address);
    recent.unshift(address);
    recent = recent.slice(0, 5);
    localStorage.setItem(LS_KEY, JSON.stringify(recent));
  } catch { /* noop */ }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'wallet': return 'border-purple-500 bg-purple-500/20 text-purple-200';
    case 'contract': return 'border-cyan-500 bg-cyan-500/20 text-cyan-200';
    case 'dao': return 'border-amber-500 bg-amber-500/20 text-amber-200';
    default: return 'border-gray-500 bg-gray-500/20 text-gray-200';
  }
}

// ── Component ──────────────────────────────────────────────────────

interface ConstellationMapProps {
  initialAddress?: string;
}

export function ConstellationMap({ initialAddress }: ConstellationMapProps = {}) {
  const { trackStat, triggerCustom } = useAchievementContext();
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState(initialAddress || '');
  const [constellation, setConstellation] = useState<ConstellationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [insightBanner, setInsightBanner] = useState('');
  const [showInsight, setShowInsight] = useState(false);
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [period, setPeriod] = useState<string>('all');
  const [minValue, setMinValue] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recentWallets, setRecentWallets] = useState<string[]>([]);
  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, k: 1 });
  // Issue 4: Type filter state
  const [hiddenTypes, setHiddenTypes] = useState<Set<NodeType>>(new Set());

  const simulationRef = useRef<d3.Simulation<ConstellationNode, ConstellationEdge> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Load recent wallets on mount
  useEffect(() => { setRecentWallets(getRecent()); }, []);

  // Fullscreen ESC handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  // Re-measure SVG on fullscreen toggle
  useEffect(() => {
    if (constellation) {
      // Small delay to let CSS transition settle
      const timer = setTimeout(() => {
        initializeVisualization(constellation);
      }, 50);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  // Edge-value-to-node lookup for value filter
  const nodeValueMap = useCallback(() => {
    if (!constellation) return new Map<string, { totalIn: number; totalOut: number }>();
    const map = new Map<string, { totalIn: number; totalOut: number }>();
    for (const edge of constellation.edges) {
      const srcId = typeof edge.source === 'string' ? edge.source : edge.source.id;
      const tgtId = typeof edge.target === 'string' ? edge.target : edge.target.id;
      const otherParty = srcId === constellation.centerNode ? tgtId : srcId;
      if (!map.has(otherParty)) map.set(otherParty, { totalIn: 0, totalOut: 0 });
      const entry = map.get(otherParty)!;
      entry.totalIn += edge.totalValueReceived || 0;
      entry.totalOut += edge.totalValueSent || 0;
    }
    return map;
  }, [constellation]);

  // ── Insight banner ───────────────────────────────────────────────
  const calculateInsight = useCallback((data: ConstellationData) => {
    if (!data.edges.length) return '';
    const strongestEdge = data.edges.reduce((max, edge) =>
      edge.transactionCount > max.transactionCount ? edge : max
    );
    const nodeCounts = data.nodes.reduce((counts, node) => {
      counts[node.type] = (counts[node.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    const strongestConnection = typeof strongestEdge.target === 'string'
      ? strongestEdge.target
      : (strongestEdge.target as ConstellationNode).id;
    const parts = [`Strongest connection: ${strongestConnection} (${strongestEdge.transactionCount} txns)`];
    if (nodeCounts.dao) parts.push(`${nodeCounts.dao} DAO${nodeCounts.dao > 1 ? 's' : ''}`);
    if (nodeCounts.contract) parts.push(`${nodeCounts.contract} contract${nodeCounts.contract > 1 ? 's' : ''} detected`);
    return parts.join(' · ');
  }, []);

  // ── Type filter toggle (Issue 4) ────────────────────────────────
  const toggleTypeFilter = useCallback((type: NodeType) => {
    setHiddenTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const resetTypeFilters = useCallback(() => {
    setHiddenTypes(new Set());
  }, []);

  // ── D3 Visualization ────────────────────────────────────────────
  const initializeVisualization = useCallback((data: ConstellationData) => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    setShowInsight(false);

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    svg.attr('width', width).attr('height', height).style('opacity', 0);

    // Filter edges by minValue
    const valueFilteredEdges = data.edges.filter(e => e.totalValue >= minValue);
    const connectedNodeIds = new Set<string>();
    connectedNodeIds.add(data.centerNode);
    for (const e of valueFilteredEdges) {
      const s = typeof e.source === 'string' ? e.source : e.source.id;
      const t = typeof e.target === 'string' ? e.target : e.target.id;
      connectedNodeIds.add(s);
      connectedNodeIds.add(t);
    }
    const valueFilteredNodes = data.nodes.filter(n => connectedNodeIds.has(n.id));

    // Issue 4: Apply type filter — hide nodes of hidden types (but never hide center)
    const visibleNodes = valueFilteredNodes.filter(n =>
      n.id === data.centerNode || !hiddenTypes.has(n.type)
    );
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    const filteredEdges = valueFilteredEdges.filter(e => {
      const s = typeof e.source === 'string' ? e.source : e.source.id;
      const t = typeof e.target === 'string' ? e.target : e.target.id;
      return visibleNodeIds.has(s) && visibleNodeIds.has(t);
    });
    const filteredNodes = visibleNodes;

    const g = svg.append('g');
    const defs = svg.append('defs');

    // ── Glow gradients + filters ──
    Object.entries(NODE_COLORS).forEach(([type, color]) => {
      const gradient = defs.append('radialGradient')
        .attr('id', `glow-${type}`).attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
      gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', '0.8');
      gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', '0');

      const filter = defs.append('filter')
        .attr('id', `outer-glow-${type}`).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // ── Cluster highlight filter ──
    const clusterFilter = defs.append('filter')
      .attr('id', 'cluster-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    clusterFilter.append('feGaussianBlur').attr('stdDeviation', '5').attr('result', 'blur');
    clusterFilter.append('feFlood').attr('flood-color', '#10B981').attr('flood-opacity', '0.4').attr('result', 'color');
    clusterFilter.append('feComposite').attr('in', 'color').attr('in2', 'blur').attr('operator', 'in').attr('result', 'glow');
    const clusterMerge = clusterFilter.append('feMerge');
    clusterMerge.append('feMergeNode').attr('in', 'glow');
    clusterMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // ── Arrow markers ──
    const arrowColors = { inflow: '#10B981', outflow: '#F97316', bidirectional: '#6B7280' };
    Object.entries(arrowColors).forEach(([dir, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${dir}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L10,0L0,4')
        .attr('fill', color)
        .attr('opacity', 0.7);
    });

    // Groups
    const particleGroup = g.append('g').attr('class', 'particles');
    const linkGroup = g.append('g').attr('class', 'links');
    const linkHitGroup = g.append('g').attr('class', 'link-hits');
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const labelGroup = g.append('g').attr('class', 'labels');

    const nodeScale = d3.scalePow().exponent(0.5)
      .domain(d3.extent(filteredNodes, d => d.transactionCount) as [number, number])
      .range([NODE_RADIUS.min, NODE_RADIUS.max]);

    // Start all nodes at center for entrance animation
    filteredNodes.forEach(node => { node.x = width / 2; node.y = height / 2; });

    const simulation = d3.forceSimulation(filteredNodes)
      .alpha(1.0)
      .force('link', d3.forceLink(filteredEdges)
        .id((d: d3.SimulationNodeDatum) => (d as ConstellationNode).id)
        .distance(d => 50 + (d as ConstellationEdge).weight)
        .strength(0.3))
      .force('charge', d3.forceManyBody().strength(-300).distanceMax(400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius(d => {
          const node = d as ConstellationNode;
          return (node.id === data.centerNode ? NODE_RADIUS.center : nodeScale(node.transactionCount)) + 5;
        }));

    simulationRef.current = simulation;

    // ── Edge color helper ──
    const edgeColor = (d: ConstellationEdge) => {
      if (d.direction === 'inflow') return '#10B981';
      if (d.direction === 'outflow') return '#F97316';
      return '#374151';
    };

    // ── Links ──
    const links = linkGroup.selectAll('.link')
      .data(filteredEdges)
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke', edgeColor)
      .style('stroke-opacity', d => Math.min(0.8, d.weight / 50))
      .style('stroke-width', d => Math.max(1, d.weight / 20))
      .attr('marker-end', d => `url(#arrow-${d.direction || 'bidirectional'})`)
      .style('filter', d => `drop-shadow(0 0 3px ${edgeColor(d)})`)
      .style('transition', 'all 0.3s ease');

    // Invisible wider hit areas for edge hover
    const linkHits = linkHitGroup.selectAll('.link-hit')
      .data(filteredEdges)
      .enter().append('line')
      .attr('class', 'link-hit')
      .style('stroke', 'transparent')
      .style('stroke-width', 12)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        const srcId = typeof d.source === 'string' ? d.source : (d.source as ConstellationNode).id;
        const tgtId = typeof d.target === 'string' ? d.target : (d.target as ConstellationNode).id;
        setTooltip({
          x: event.clientX, y: event.clientY,
          kind: 'edge',
          edge: {
            sourceId: srcId, targetId: tgtId,
            transactionCount: d.transactionCount, totalValue: d.totalValue,
            sentCount: d.sentCount, receivedCount: d.receivedCount,
            totalValueSent: d.totalValueSent, totalValueReceived: d.totalValueReceived,
            direction: d.direction, lastInteraction: d.lastInteraction, firstInteraction: d.firstInteraction,
          },
        });
      })
      .on('mouseout', () => setTooltip(null));

    // ── Issue 2: Show labels on ALL nodes ──
    // Nodes with 3+ txns get permanent visible labels
    // Nodes with fewer txns get smaller, slightly dimmer labels
    // All labels use smart truncation

    // Build adjacency for cluster highlighting
    const adjacency = new Map<string, Set<string>>();
    for (const e of filteredEdges) {
      const s = typeof e.source === 'string' ? e.source : e.source.id;
      const t = typeof e.target === 'string' ? e.target : e.target.id;
      if (!adjacency.has(s)) adjacency.set(s, new Set());
      if (!adjacency.has(t)) adjacency.set(t, new Set());
      adjacency.get(s)!.add(t);
      adjacency.get(t)!.add(s);
    }

    // Node value map for tooltip
    const nvm = nodeValueMap();

    // ── Nodes ──
    const nodes = nodeGroup.selectAll('.node')
      .data(filteredNodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', d => d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount))
      .style('fill', d => d.id === data.centerNode ? NODE_COLORS.center : NODE_COLORS[d.type])
      .style('filter', d => `url(#outer-glow-${d.id === data.centerNode ? 'center' : d.type})`)
      .style('stroke', d => expandedNodes.has(d.id) ? '#10B981' : 'none')
      .style('stroke-width', d => expandedNodes.has(d.id) ? '2px' : '0')
      .style('cursor', 'pointer')
      .style('transition', 'all 0.3s ease')
      .on('mouseover', function(event, d) {
        // Highlight connected links
        links.style('stroke-opacity', function(l) {
          return l.source === d || l.target === d ? 1 : 0.1;
        });
        // Cluster highlight
        const neighbors = adjacency.get(d.id) || new Set();
        const centerNeighbors = adjacency.get(data.centerNode) || new Set();
        const clusterPeers = new Set<string>();
        neighbors.forEach(n => { if (centerNeighbors.has(n) && n !== data.centerNode) clusterPeers.add(n); });
        nodes.style('filter', function(n) {
          if (n === d || clusterPeers.has(n.id)) return 'url(#cluster-glow)';
          return `url(#outer-glow-${n.id === data.centerNode ? 'center' : n.type})`;
        });
        // Tooltip
        const vals = nvm.get(d.id);
        setTooltip({
          x: event.clientX, y: event.clientY, kind: 'node',
          node: {
            id: d.id, type: d.type, transactionCount: d.transactionCount,
            firstSeen: d.firstSeen, lastSeen: d.lastSeen,
            totalValueIn: vals?.totalIn, totalValueOut: vals?.totalOut,
            isCenter: d.id === data.centerNode,
            isExpanded: expandedNodes.has(d.id),
          },
        });
        d3.select(this).transition().duration(200)
          .attr('r', (d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount)) * 1.5);
        // Highlight the label on hover too
        labels.filter(l => l.id === d.id)
          .style('fill', '#FFFFFF')
          .style('font-size', d.id === data.centerNode ? '11px' : '10px');
      })
      .on('mouseout', function(_event, d) {
        links.style('stroke-opacity', l => Math.min(0.8, l.weight / 50));
        nodes.style('filter', n => `url(#outer-glow-${n.id === data.centerNode ? 'center' : n.type})`);
        setTooltip(null);
        d3.select(this).transition().duration(200)
          .attr('r', d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount));
        // Restore label style
        labels.filter(l => l.id === d.id)
          .style('fill', d.id === data.centerNode ? '#FFFFFF' : (d.transactionCount >= 3 ? '#D1D5DB' : '#6B7280'))
          .style('font-size', d.id === data.centerNode ? '10px' : (d.transactionCount >= 3 ? '9px' : '8px'));
      })
      .on('click', function(_event, d) {
        if (d.id !== data.centerNode && !expandedNodes.has(d.id)) {
          expandNode(d.id);
        }
      })
      .on('contextmenu', function(event, d) {
        event.preventDefault();
        setContextMenu({
          x: event.clientX, y: event.clientY,
          nodeId: d.id,
          isCenter: d.id === data.centerNode,
          isExpanded: expandedNodes.has(d.id),
        });
      })
      .call(d3.drag<SVGCircleElement, ConstellationNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (_event, d) => { d.fx = _event.x; d.fy = _event.y; })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        }));

    // Loading indicators
    nodeGroup.selectAll('.loading-indicator')
      .data(filteredNodes.filter(d => loadingNodes.has(d.id)))
      .enter().append('circle')
      .attr('class', 'loading-indicator')
      .attr('r', d => (d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount)) + 8)
      .style('fill', 'none').style('stroke', '#10B981')
      .style('stroke-width', '2px').style('stroke-dasharray', '5,5').style('opacity', 0.8);

    // Issue 2 FIX: Labels on ALL nodes (not just importantNodes)
    // Center + high-txn nodes: bright, larger. Low-txn nodes: dimmer, smaller.
    const labels = labelGroup.selectAll('.label')
      .data(filteredNodes) // ALL nodes get labels
      .enter().append('text')
      .attr('class', 'label')
      .style('font-size', d => d.id === data.centerNode ? '10px' : (d.transactionCount >= 3 ? '9px' : '8px'))
      .style('fill', d => d.id === data.centerNode ? '#FFFFFF' : (d.transactionCount >= 3 ? '#D1D5DB' : '#6B7280'))
      .style('text-anchor', 'middle')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .style('paint-order', 'stroke')
      .style('stroke', 'rgba(0,0,0,0.7)')
      .style('stroke-width', '3px')
      .style('stroke-linejoin', 'round')
      .text(d => smartTruncate(d.id, 20, d.id === data.centerNode));

    // ── Zoom ──
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setViewTransform({ x: event.transform.x, y: event.transform.y, k: event.transform.k });
      });
    svg.call(zoom);
    zoomRef.current = zoom;

    // ── Branding watermark ──
    const branding = svg.append('g').attr('class', 'voidspace-branding')
      .attr('transform', `translate(${width - 170}, ${height - 50})`);
    const logoG = branding.append('g').attr('transform', 'scale(0.3) translate(0, -40)');
    logoG.append('path').attr('d', 'M 85 50 A 35 35 0 1 1 65 18.4')
      .attr('stroke', '#00EC97').attr('stroke-width', 4).attr('stroke-linecap', 'round').attr('fill', 'none');
    logoG.append('path').attr('d', 'M 68 50 A 18 18 0 1 1 50 32')
      .attr('stroke', '#00EC97').attr('stroke-width', 2.5).attr('stroke-linecap', 'round').attr('fill', 'none').attr('opacity', 0.3);
    logoG.append('line').attr('x1', 25).attr('y1', 75).attr('x2', 75).attr('y2', 25)
      .attr('stroke', '#00D4FF').attr('stroke-width', 2).attr('stroke-linecap', 'round').attr('opacity', 0.7);
    logoG.append('circle').attr('cx', 50).attr('cy', 50).attr('r', 3).attr('fill', '#00EC97');
    branding.append('text').attr('x', 38).attr('y', 2).attr('fill', '#00EC97')
      .attr('font-family', "'Inter', 'SF Pro Display', sans-serif").attr('font-size', '14px')
      .attr('font-weight', '600').attr('letter-spacing', '1.5px').attr('opacity', 0.7).text('voidspace.io');

    // Entrance animation
    setTimeout(() => { svg.transition().duration(800).style('opacity', 1); }, 300);

    // Insight banner timing
    let insightShown = false;
    const insightTimeout = setTimeout(() => {
      if (!insightShown) { setInsightBanner(calculateInsight(data)); setShowInsight(true); insightShown = true; }
    }, 3000);

    // ── Tick ──
    simulation.on('tick', () => {
      if (simulation.alpha() < 0.05 && !insightShown) {
        setInsightBanner(calculateInsight(data));
        setShowInsight(true);
        insightShown = true;
        clearTimeout(insightTimeout);
      }

      links
        .attr('x1', d => (d.source as ConstellationNode).x!)
        .attr('y1', d => (d.source as ConstellationNode).y!)
        .attr('x2', d => (d.target as ConstellationNode).x!)
        .attr('y2', d => (d.target as ConstellationNode).y!);

      linkHits
        .attr('x1', d => (d.source as ConstellationNode).x!)
        .attr('y1', d => (d.source as ConstellationNode).y!)
        .attr('x2', d => (d.target as ConstellationNode).x!)
        .attr('y2', d => (d.target as ConstellationNode).y!);

      nodes.attr('cx', d => d.x!).attr('cy', d => d.y!);

      // Labels positioned below nodes with offset to reduce overlap
      labels
        .attr('x', d => d.x!)
        .attr('y', d => {
          const radius = d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount);
          return d.y! + radius + 12;
        });

      // Rotate loading indicators
      nodeGroup.selectAll('.loading-indicator')
        .attr('cx', (d: unknown) => (d as ConstellationNode).x!)
        .attr('cy', (d: unknown) => (d as ConstellationNode).y!);

      // Particle animation
      if (Math.random() < 0.1 && filteredEdges.length > 0) {
        animateParticle(filteredEdges[Math.floor(Math.random() * filteredEdges.length)]);
      }
    });

    function animateParticle(edge: ConstellationEdge) {
      const source = edge.source as ConstellationNode;
      const target = edge.target as ConstellationNode;
      if (!source.x || !source.y || !target.x || !target.y) return;
      const particle = particleGroup.append('circle')
        .attr('r', 2).attr('cx', source.x).attr('cy', source.y)
        .style('fill', '#60A5FA').style('opacity', 0.8).style('filter', 'drop-shadow(0 0 4px #60A5FA)');
      particle.transition().duration(2000).ease(d3.easeLinear)
        .attr('cx', target.x).attr('cy', target.y).style('opacity', 0).remove();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedNodes, loadingNodes, calculateInsight, minValue, hiddenTypes]);

  // ── Expand node ────────────────────────────────────────────────
  const expandNode = async (nodeId: string) => {
    if (expandedNodes.has(nodeId) || loadingNodes.has(nodeId)) return;
    setLoadingNodes(prev => { const next = new Set(prev); next.add(nodeId); return next; });

    try {
      const response = await fetch('/api/constellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: nodeId, period }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to expand node');
      }

      const newData: ConstellationData = await response.json();
      if (!constellation) return;

      const existingNodeIds = new Set(constellation.nodes.map(n => n.id));
      const newNodes = newData.nodes.filter(n => !existingNodeIds.has(n.id));
      const totalNodes = constellation.nodes.length + newNodes.length;
      const nodesToAdd = totalNodes > 150 ? newNodes.slice(0, 150 - constellation.nodes.length) : newNodes;

      const existingEdgeKeys = new Set(
        constellation.edges.map(e => {
          const s = typeof e.source === 'string' ? e.source : e.source.id;
          const t = typeof e.target === 'string' ? e.target : e.target.id;
          return `${s}-${t}`;
        })
      );

      const newEdges = newData.edges.filter(e => {
        const s = typeof e.source === 'string' ? e.source : e.source.id;
        const t = typeof e.target === 'string' ? e.target : e.target.id;
        return !existingEdgeKeys.has(`${s}-${t}`) && !existingEdgeKeys.has(`${t}-${s}`);
      });

      const updatedConstellation: ConstellationData = {
        ...constellation,
        nodes: [...constellation.nodes, ...nodesToAdd],
        edges: [...constellation.edges, ...newEdges],
      };

      setConstellation(updatedConstellation);
      setExpandedNodes(prev => { const next = new Set(prev); next.add(nodeId); return next; });
      trackStat('nodesExpanded');

      if (simulationRef.current) {
        simulationRef.current.nodes(updatedConstellation.nodes);
        simulationRef.current.force('link', d3.forceLink(updatedConstellation.edges)
          .id((d: d3.SimulationNodeDatum) => (d as ConstellationNode).id)
          .distance(d => 50 + (d as ConstellationEdge).weight).strength(0.3));
        simulationRef.current.alpha(0.3).restart();
      }
    } catch (err) {
      console.error('Failed to expand node:', err);
      setError(err instanceof Error ? err.message : 'Failed to expand node');
    } finally {
      setLoadingNodes(prev => { const s = new Set(prev); s.delete(nodeId); return s; });
    }
  };

  // ── Search ─────────────────────────────────────────────────────
  const handleSearch = useCallback(async (searchAddress?: string) => {
    const addr = (searchAddress || address).trim();
    if (!addr) { setError('Please enter a NEAR wallet address'); return; }

    setLoading(true);
    setError('');
    setConstellation(null);
    setShowInsight(false);
    setExpandedNodes(new Set());
    setLoadingNodes(new Set());
    setContextMenu(null);
    setHiddenTypes(new Set());

    if (searchAddress) setAddress(searchAddress);

    try {
      const response = await fetch('/api/constellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, period }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.error || 'Failed to fetch constellation data';
        throw new Error(getErrorMessage(msg, response.status));
      }

      const data: ConstellationData = await response.json();
      if (!data.nodes.length) throw new Error("No connections found for this wallet. It may be new or inactive.");

      setConstellation(data);
      saveRecent(addr);
      setRecentWallets(getRecent());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [address, period]);

  const getErrorMessage = (error: string, status?: number) => {
    if (status === 429 || error.toLowerCase().includes('rate limit') || error.toLowerCase().includes('nearblocks is busy'))
      return "NearBlocks is busy, try again in a moment.";
    if (error.toLowerCase().includes('not found') || error.toLowerCase().includes('no data'))
      return "No connections found for this wallet. It may be new or inactive.";
    return error || 'An unexpected error occurred. Please try again.';
  };

  // ── Zoom controls ──────────────────────────────────────────────
  const resetView = () => {
    if (zoomRef.current && svgRef.current)
      d3.select(svgRef.current).transition().duration(750).call(zoomRef.current.transform, d3.zoomIdentity);
  };
  const zoomIn = () => {
    if (zoomRef.current && svgRef.current)
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
  };
  const zoomOut = () => {
    if (zoomRef.current && svgRef.current)
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.67);
  };

  // ── Issue 3 FIX: Screenshot — properly serialize SVG with inline styles ──
  const handleScreenshot = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;
    trackStat('screenshotsTaken');
    const svgEl = svgRef.current;
    const w = svgEl.clientWidth || containerRef.current.offsetWidth;
    const h = svgEl.clientHeight || containerRef.current.offsetHeight;

    // Clone the SVG to avoid modifying the live one
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(w));
    clone.setAttribute('height', String(h));

    // Add a background rect since canvas won't have the CSS background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', '#0a0a0a');
    clone.insertBefore(bgRect, clone.firstChild);

    // Remove any filters that might cause tainted canvas issues
    // (drop-shadow filters with url() references are fine since they're inline)

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w * 2;
      canvas.height = h * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(url); return; }
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0, w, h);
      // Watermark
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = 'rgba(0, 236, 151, 0.5)';
      ctx.fillText('voidspace.io', w - 120, h - 16);
      canvas.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `constellation-${constellation?.centerNode || 'map'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      }, 'image/png');
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      // Fallback: direct SVG download if canvas conversion fails
      const a = document.createElement('a');
      a.href = url;
      a.download = `constellation-${constellation?.centerNode || 'map'}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [constellation]);

  // Re-init visualization when constellation or minValue or hiddenTypes changes
  useEffect(() => {
    if (constellation) initializeVisualization(constellation);
  }, [constellation, initializeVisualization]);

  // ── Render ─────────────────────────────────────────────────────
  // Cursor-tracking glow for glassmorphism card
  const glassCardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = glassCardRef.current?.getBoundingClientRect();
    if (rect) setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { duration: 0.5, delay, ease: 'easeOut' } as const,
  });

  return (
    <div className="space-y-6 flex flex-col">
      {/* Background Atmosphere */}
      <div className="relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 30%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(6,182,212,0.04) 0%, transparent 50%)',
          }}
        />
        <GridPattern className="opacity-10" />

        {/* Header */}
        <div className="relative text-center py-6 sm:py-8 px-4">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.4)] animate-[constellationPulse_3s_ease-in-out_infinite]">
              <Network className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <GradientText as="h1" animated className="text-2xl sm:text-3xl font-bold">
              Constellation Mapping
            </GradientText>
          </motion.div>
          <motion.p {...fadeUp(0.2)} className="text-text-secondary text-sm sm:text-lg max-w-2xl mx-auto mt-2 sm:mt-3">
            Trace the invisible threads connecting NEAR&apos;s biggest players.
          </motion.p>
        </div>

        {/* Search Interface — Glassmorphism Card */}
        <motion.div
          {...fadeUp(0.3)}
          ref={glassCardRef}
          onMouseMove={handleCardMouseMove}
          className="relative max-w-4xl mx-4 sm:mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden"
        >
          {/* Top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          {/* Cursor glow spotlight */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px at ${glowPos.x}px ${glowPos.y}px, rgba(139,92,246,0.08), transparent 50%)`,
            }}
          />

          <div className="relative space-y-4">
            {/* Full-width input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
              <Input
                placeholder="Enter NEAR wallet address (e.g., alex.near)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-lg pl-11 w-full focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              />
            </div>

            {/* CTA Button — full width */}
            <Button
              onClick={() => handleSearch()}
              disabled={loading || !address.trim()}
              variant="primary"
              className="w-full py-3 min-h-[48px] text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all duration-300 border-0"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Mapping...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Network className="w-5 h-5" />
                  Explore Constellation
                </span>
              )}
            </Button>

            {/* Wallet Suggestions — Unified */}
            <div className="space-y-3 pt-2">
              {/* Featured */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs text-text-muted shrink-0">🌟 Featured:</span>
                {EXAMPLE_WALLETS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => handleSearch(id)}
                    className="px-2.5 py-2 min-h-[44px] flex items-center text-xs font-mono rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:border-purple-500/40 hover:shadow-[0_0_10px_rgba(139,92,246,0.15)] hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    {id} <span className="text-purple-400/60 ml-1 hidden sm:inline">— {label}</span>
                  </button>
                ))}
              </div>

              {/* Popular */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs text-text-muted shrink-0">🔥 Popular:</span>
                {POPULAR_WALLETS.map(w => (
                  <button
                    key={w}
                    onClick={() => handleSearch(w)}
                    className="px-2.5 py-2 min-h-[44px] flex items-center text-xs font-mono rounded bg-amber-500/10 border border-amber-500/20 text-amber-300/80 hover:border-amber-500/40 hover:shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Recent */}
              {recentWallets.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs text-text-muted shrink-0">🕐 Recent:</span>
                  {recentWallets.map(w => (
                    <button
                      key={w}
                      onClick={() => handleSearch(w)}
                      className="px-2.5 py-2 min-h-[44px] flex items-center text-xs font-mono rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300/80 hover:border-cyan-500/40 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-900/20 border border-red-500/20 text-red-300">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Connection Failed</p>
                  <p className="text-xs text-red-200">{error}</p>
                </div>
                <Button onClick={() => handleSearch()} variant="secondary" size="sm" className="flex items-center gap-1.5 text-xs">
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Mini Constellation Preview */}
        {!constellation && !loading && (
          <motion.div {...fadeUp(0.5)} className="flex justify-center py-6">
            <svg width="200" height="120" viewBox="0 0 200 120" className="opacity-35">
              {/* Connecting lines */}
              <line x1="40" y1="60" x2="100" y2="30" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.5" />
              <line x1="100" y1="30" x2="160" y2="55" stroke="#06B6D4" strokeWidth="0.5" opacity="0.5" />
              <line x1="100" y1="30" x2="70" y2="95" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.4" />
              <line x1="160" y1="55" x2="130" y2="95" stroke="#06B6D4" strokeWidth="0.5" opacity="0.4" />
              <line x1="40" y1="60" x2="70" y2="95" stroke="white" strokeWidth="0.3" opacity="0.3" />
              {/* Nodes */}
              <circle cx="40" cy="60" r="3" fill="#8B5CF6" opacity="0.8">
                <animate attributeName="cy" values="60;55;60" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="30" r="4" fill="white" opacity="0.9">
                <animate attributeName="cy" values="30;35;30" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="55" r="3" fill="#06B6D4" opacity="0.8">
                <animate attributeName="cy" values="55;50;55" dur="4.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="70" cy="95" r="2.5" fill="#8B5CF6" opacity="0.6">
                <animate attributeName="cx" values="70;75;70" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle cx="130" cy="95" r="2.5" fill="#06B6D4" opacity="0.6">
                <animate attributeName="cx" values="130;125;130" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
          </motion.div>
        )}
      </div>

      {/* Time Range + Value Filter */}
      {constellation && (
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 px-4">
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 overflow-x-auto scrollbar-none w-full sm:w-auto">
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setPeriod(opt.value); }}
                className={cn(
                  'px-3 py-2 min-h-[44px] text-xs font-medium rounded-md transition-colors active:scale-95 shrink-0',
                  period === opt.value
                    ? 'bg-near-green/20 text-near-green border border-near-green/30'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {opt.label}
              </button>
            ))}
            {period !== 'all' && (
              <Button
                variant="primary"
                size="sm"
                className="ml-2 text-xs px-3 min-h-[44px] shrink-0"
                onClick={() => handleSearch()}
                disabled={loading}
              >
                Apply
              </Button>
            )}
          </div>

          {/* Value filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs text-text-muted whitespace-nowrap">Min value:</label>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={minValue}
              onChange={e => setMinValue(parseFloat(e.target.value))}
              className="flex-1 sm:w-24 accent-purple-500 min-h-[44px]"
            />
            <span className="text-xs text-text-secondary font-mono w-24 shrink-0">{formatNear(minValue)}</span>
          </div>
        </div>
      )}

      {/* Insight Banner */}
      {showInsight && insightBanner && (
        <div className="max-w-4xl mx-auto px-4 transform transition-all duration-500 ease-out animate-in slide-in-from-top-4">
          <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <p className="text-sm text-green-400 font-medium text-center">✨ {insightBanner}</p>
          </div>
        </div>
      )}

      {/* Constellation Visualization */}
      {constellation && (
        <div className="mx-2 sm:mx-4 mb-4">
          <div
            ref={cardRef}
            className={cn(
              'relative overflow-hidden rounded-xl border border-border bg-surface/50',
              isFullscreen && 'fixed inset-0 z-50 rounded-none'
            )}
            style={isFullscreen ? { width: '100vw', height: '100vh' } : { height: 'min(600px, 70vh)', minHeight: '350px' }}
          >
            {/* Controls */}
            <ConstellationControls
              onResetView={resetView}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onScreenshot={handleScreenshot}
              onToggleFullscreen={() => { setIsFullscreen(f => !f); triggerCustom('fullscreen_used'); }}
              isFullscreen={isFullscreen}
            />

            {/* Stats */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 space-y-1.5 sm:space-y-2">
              <Badge variant="glass" className="flex items-center gap-1.5 sm:gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                {constellation.nodes.length} Nodes
              </Badge>
              <Badge variant="glass" className="flex items-center gap-1.5 sm:gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                {constellation.edges.length} Connections
              </Badge>
            </div>

            {/* Issue 4: Interactive Legend/Filter Pills */}
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 space-y-1.5 sm:space-y-2">
              {([
                { type: 'wallet' as NodeType, label: 'Wallets', color: 'bg-purple-500', dotColor: '#8B5CF6' },
                { type: 'contract' as NodeType, label: 'Smart Contracts', color: 'bg-cyan-500', dotColor: '#06B6D4' },
                { type: 'dao' as NodeType, label: 'DAOs', color: 'bg-amber-500', dotColor: '#F59E0B' },
              ]).map(({ type, label, color }) => {
                const isHidden = hiddenTypes.has(type);
                const count = constellation.nodes.filter(n => n.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={cn(
                      'px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[40px] rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer',
                      'hover:scale-105 hover:brightness-110 active:scale-95',
                      isHidden
                        ? 'border-gray-600 bg-gray-800/40 text-gray-500 opacity-30'
                        : getTypeColor(type)
                    )}
                    title={isHidden ? `Show ${label}` : `Hide ${label}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', color, isHidden && 'opacity-30')} />
                      <span className={isHidden ? 'line-through' : ''}>
                        {label}
                      </span>
                      <span className={cn('text-[10px] ml-1', isHidden ? 'text-gray-600' : 'opacity-60')}>
                        ({count})
                      </span>
                    </div>
                  </button>
                );
              })}
              {/* Reset button when any filter is active */}
              {hiddenTypes.size > 0 && (
                <button
                  onClick={resetTypeFilters}
                  className="px-3 py-1.5 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-medium cursor-pointer hover:bg-green-500/20 transition-colors"
                >
                  Show All
                </button>
              )}
              {/* Arrow legend — hidden on very small screens */}
              <div className="hidden sm:block px-3 py-1.5 rounded-lg border border-gray-600 bg-gray-800/40 text-xs text-gray-300 space-y-1">
                <div className="flex items-center gap-2"><span className="text-green-400">→</span> Inflow</div>
                <div className="flex items-center gap-2"><span className="text-orange-400">→</span> Outflow</div>
              </div>
            </div>

            {/* SVG Canvas */}
            <div ref={containerRef} className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
              <svg ref={svgRef} className="w-full h-full" />
            </div>

            {/* Minimap */}
            <ConstellationMinimap
              nodes={constellation.nodes}
              edges={constellation.edges}
              centerNodeId={constellation.centerNode}
              viewTransform={viewTransform}
              containerWidth={containerRef.current?.offsetWidth || 800}
              containerHeight={containerRef.current?.offsetHeight || 600}
            />

            {/* Tooltip — hidden on touch devices (use context menu instead) */}
            {tooltip && (
              <div
                className="fixed z-50 p-3 bg-black/90 border border-gray-600 rounded-lg shadow-xl pointer-events-none backdrop-blur-sm max-w-[calc(100vw-2rem)] sm:max-w-xs hidden sm:block"
                style={{
                  left: Math.min(tooltip.x + 10, (typeof window !== 'undefined' ? window.innerWidth : 9999) - 320),
                  top: tooltip.y - 10,
                  transform: tooltip.y > (typeof window !== 'undefined' ? window.innerHeight * 0.6 : 400) ? 'translateY(-100%)' : 'translateY(20px)',
                }}
              >
                {tooltip.kind === 'node' && tooltip.node && (
                  <div className="text-sm text-white space-y-1.5">
                    <div className="font-semibold text-cyan-400 break-all">{tooltip.node.id}</div>
                    <div className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium border', getTypeColor(tooltip.node.type))}>
                      {tooltip.node.type.toUpperCase()}
                    </div>
                    <div className="text-gray-300 text-xs">{tooltip.node.transactionCount} transactions</div>
                    {(tooltip.node.totalValueIn != null || tooltip.node.totalValueOut != null) && (
                      <div className="text-xs space-y-0.5">
                        {(tooltip.node.totalValueIn ?? 0) > 0 && (
                          <div className="text-green-400">↓ Received: {formatNear(tooltip.node.totalValueIn!)}</div>
                        )}
                        {(tooltip.node.totalValueOut ?? 0) > 0 && (
                          <div className="text-orange-400">↑ Sent: {formatNear(tooltip.node.totalValueOut!)}</div>
                        )}
                      </div>
                    )}
                    {tooltip.node.lastSeen && (
                      <div className="text-gray-400 text-xs">Last: {formatDate(tooltip.node.lastSeen)}</div>
                    )}
                    {!tooltip.node.isCenter && !tooltip.node.isExpanded && (
                      <div className="text-purple-300 text-xs italic">Click to expand · Right-click for menu</div>
                    )}
                    <div className="border-t border-gray-700 pt-1 flex gap-3">
                      <span className="text-cyan-400/70 text-xs cursor-pointer hover:underline">NearBlocks ↗</span>
                      <span className="text-purple-400/70 text-xs cursor-pointer hover:underline">Void Lens →</span>
                    </div>
                  </div>
                )}
                {tooltip.kind === 'edge' && tooltip.edge && (
                  <div className="text-sm text-white space-y-1.5">
                    <div className="text-xs text-gray-400">
                      <span className="text-cyan-400">{smartTruncate(tooltip.edge.sourceId, 16, false)}</span>
                      {' ↔ '}
                      <span className="text-cyan-400">{smartTruncate(tooltip.edge.targetId, 16, false)}</span>
                    </div>
                    <div className="text-gray-300 text-xs">{tooltip.edge.transactionCount} transactions</div>
                    <div className="text-gray-300 text-xs">Total: {formatNear(tooltip.edge.totalValue)}</div>
                    {tooltip.edge.sentCount != null && (
                      <div className="text-xs">
                        <span className="text-orange-400">↑ {tooltip.edge.sentCount} sent</span>
                        {' · '}
                        <span className="text-green-400">↓ {tooltip.edge.receivedCount} received</span>
                      </div>
                    )}
                    {tooltip.edge.firstInteraction && (
                      <div className="text-gray-400 text-xs">
                        {formatDate(tooltip.edge.firstInteraction)} — {formatDate(tooltip.edge.lastInteraction)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ConstellationContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          isCenter={contextMenu.isCenter}
          isExpanded={contextMenu.isExpanded}
          onExpand={() => expandNode(contextMenu.nodeId)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Empty State */}
      {!constellation && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
              <Network className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Ready to Explore the Void</h3>
              <p className="text-text-secondary">Enter a NEAR wallet address to visualize its transaction network</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
