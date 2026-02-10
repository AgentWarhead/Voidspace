'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Search, RotateCcw, ZoomIn, ZoomOut, Network, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { cn } from '@/lib/utils';

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
}

interface ConstellationData {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  centerNode: string;
}

interface TooltipData {
  x: number;
  y: number;
  content: {
    id: string;
    type: string;
    transactionCount: number;
    firstSeen?: string;
    lastSeen?: string;
  };
}

const NODE_COLORS = {
  wallet: '#8B5CF6', // Purple/violet glow
  contract: '#06B6D4', // Cyan/teal glow  
  dao: '#F59E0B', // Orange/amber glow
  center: '#FFFFFF', // White/bright for center
};

const NODE_RADIUS = {
  min: 3,
  max: 20,
  center: 15,
};

interface ConstellationMapProps {
  initialAddress?: string;
}

export function ConstellationMap({ initialAddress }: ConstellationMapProps = {}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState(initialAddress || '');
  const [constellation, setConstellation] = useState<ConstellationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [, setSelectedNode] = useState<string | null>(null);
  const [insightBanner, setInsightBanner] = useState<string>('');
  const [showInsight, setShowInsight] = useState(false);
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const simulationRef = useRef<d3.Simulation<ConstellationNode, ConstellationEdge> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Calculate insight banner content
  const calculateInsight = useCallback((data: ConstellationData) => {
    if (!data.edges.length) return '';
    
    // Find strongest connection
    const strongestEdge = data.edges.reduce((max, edge) => 
      edge.transactionCount > max.transactionCount ? edge : max
    );
    
    // Count node types
    const nodeCounts = data.nodes.reduce((counts, node) => {
      counts[node.type] = (counts[node.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const strongestConnection = typeof strongestEdge.target === 'string' 
      ? strongestEdge.target 
      : (strongestEdge.target as ConstellationNode).id;
      
    const parts = [
      `Strongest connection: ${strongestConnection} (${strongestEdge.transactionCount} txns)`
    ];
    
    if (nodeCounts.dao) parts.push(`${nodeCounts.dao} DAO${nodeCounts.dao > 1 ? 's' : ''}`);
    if (nodeCounts.contract) parts.push(`${nodeCounts.contract} contract${nodeCounts.contract > 1 ? 's' : ''} detected`);
    
    return parts.join(' · ');
  }, []);

  // Initialize D3 visualization
  const initializeVisualization = useCallback((data: ConstellationData) => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll('*').remove();
    setShowInsight(false);
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    svg.attr('width', width).attr('height', height)
       .style('opacity', 0); // Start with opacity 0 for entrance animation

    // Create main group for zoom/pan
    const g = svg.append('g');

    // Create gradients for glowing effects
    const defs = svg.append('defs');
    
    Object.entries(NODE_COLORS).forEach(([type, color]) => {
      const gradient = defs.append('radialGradient')
        .attr('id', `glow-${type}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', '0.8');
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', '0');

      // Create filter for outer glow
      const filter = defs.append('filter')
        .attr('id', `outer-glow-${type}`)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
      
      filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
      
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Create particle system for connection trails
    const particleGroup = g.append('g').attr('class', 'particles');

    // Create links group
    const linkGroup = g.append('g').attr('class', 'links');

    // Create nodes group  
    const nodeGroup = g.append('g').attr('class', 'nodes');
    
    // Create labels group
    const labelGroup = g.append('g').attr('class', 'labels');

    // Scale for node sizes based on transaction count
    const nodeScale = d3.scalePow()
      .exponent(0.5)
      .domain(d3.extent(data.nodes, d => d.transactionCount) as [number, number])
      .range([NODE_RADIUS.min, NODE_RADIUS.max]);

    // ENTRANCE ANIMATION: Start all nodes at center
    data.nodes.forEach(node => {
      node.x = width / 2;
      node.y = height / 2;
    });

    // Create force simulation with high alpha for dramatic entrance
    const simulation = d3.forceSimulation(data.nodes)
      .alpha(1.0) // High alpha for dramatic burst
      .force('link', d3.forceLink(data.edges)
        .id((d: ConstellationNode | d3.SimulationNodeDatum) => (d as ConstellationNode).id)
        .distance(d => 50 + (d as ConstellationEdge).weight)
        .strength(0.3)
      )
      .force('charge', d3.forceManyBody()
        .strength(-300)
        .distanceMax(400)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius((d) => {
          const node = d as ConstellationNode;
          return (node.id === data.centerNode ? NODE_RADIUS.center : nodeScale(node.transactionCount)) + 5;
        })
      );

    simulationRef.current = simulation;

    // Create links
    const links = linkGroup.selectAll('.link')
      .data(data.edges)
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke', '#374151')
      .style('stroke-opacity', d => Math.min(0.8, d.weight / 50))
      .style('stroke-width', d => Math.max(1, d.weight / 20))
      .style('filter', 'drop-shadow(0 0 3px #374151)')
      .style('transition', 'all 0.3s ease');

    // Determine important nodes for labeling
    const sortedNodes = [...data.nodes]
      .filter(n => n.id !== data.centerNode) // Exclude center node from sorting
      .sort((a, b) => b.transactionCount - a.transactionCount);
    
    const importantNodes = new Set<string>();
    importantNodes.add(data.centerNode); // Always label center node
    
    // Add nodes with transactionCount > 5
    data.nodes.forEach(node => {
      if (node.transactionCount > 5) {
        importantNodes.add(node.id);
      }
    });
    
    // Add top 5 nodes by transaction count if not already included
    sortedNodes.slice(0, 5).forEach(node => {
      importantNodes.add(node.id);
    });

    // Create nodes with expanded state styling
    const nodes = nodeGroup.selectAll('.node')
      .data(data.nodes)
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
        
        // Show tooltip
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: {
            id: d.id,
            type: d.type,
            transactionCount: d.transactionCount,
            firstSeen: d.firstSeen,
            lastSeen: d.lastSeen
          }
        });

        // Enlarge node
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount)) * 1.5);
      })
      .on('mouseout', function(event, d) {
        // Reset link opacity
        links.style('stroke-opacity', l => Math.min(0.8, l.weight / 50));
        
        // Hide tooltip
        setTooltip(null);

        // Reset node size
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount));
      })
      .on('click', function(event, d) {
        if (d.id !== data.centerNode) {
          setSelectedNode(d.id);
          expandNode(d.id);
        }
      })
      .call(d3.drag<SVGCircleElement, ConstellationNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Create loading indicators for expanding nodes
    const loadingIndicators = nodeGroup.selectAll('.loading-indicator')
      .data(data.nodes.filter(d => loadingNodes.has(d.id)))
      .enter().append('circle')
      .attr('class', 'loading-indicator')
      .attr('r', d => (d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount)) + 8)
      .style('fill', 'none')
      .style('stroke', '#10B981')
      .style('stroke-width', '2px')
      .style('stroke-dasharray', '5,5')
      .style('opacity', 0.8);

    // Animate loading indicators
    loadingIndicators
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .style('stroke-dashoffset', '-20')
      .on('end', function() {
        d3.select(this).transition().duration(0).style('stroke-dashoffset', '0');
      });

    // Create labels for important nodes
    const labels = labelGroup.selectAll('.label')
      .data(data.nodes.filter(d => importantNodes.has(d.id)))
      .enter().append('text')
      .attr('class', 'label')
      .style('font-size', '9px')
      .style('fill', '#9CA3AF')
      .style('text-anchor', 'middle')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text(d => {
        const name = d.id.length > 15 ? d.id.substring(0, 15) + '...' : d.id;
        return name;
      });

    // Add zoom and pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    zoomRef.current = zoom;

    // Entrance animation: Fade in after 300ms delay
    setTimeout(() => {
      svg.transition()
        .duration(800)
        .style('opacity', 1);
    }, 300);

    // Track simulation progress for insight banner
    let insightShown = false;
    const insightTimeout = setTimeout(() => {
      if (!insightShown) {
        setInsightBanner(calculateInsight(data));
        setShowInsight(true);
        insightShown = true;
      }
    }, 3000);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      // Check if simulation has settled
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

      nodes
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      // Update labels to follow nodes (positioned slightly below)
      labels
        .attr('x', d => d.x!)
        .attr('y', d => d.y! + (d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount)) + 12);

      // Update loading indicators
      loadingIndicators
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      // Animate particles along connections (simplified version)
      if (Math.random() < 0.1) { // 10% chance per tick
        animateParticle(data.edges[Math.floor(Math.random() * data.edges.length)]);
      }
    });

    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, ConstellationNode, ConstellationNode>, d: ConstellationNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, ConstellationNode, ConstellationNode>, d: ConstellationNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, ConstellationNode, ConstellationNode>, d: ConstellationNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function animateParticle(edge: ConstellationEdge) {
      const source = edge.source as ConstellationNode;
      const target = edge.target as ConstellationNode;
      
      if (!source.x || !source.y || !target.x || !target.y) return;

      const particle = particleGroup.append('circle')
        .attr('r', 2)
        .attr('cx', source.x)
        .attr('cy', source.y)
        .style('fill', '#60A5FA')
        .style('opacity', 0.8)
        .style('filter', 'drop-shadow(0 0 4px #60A5FA)');

      particle
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('cx', target.x)
        .attr('cy', target.y)
        .style('opacity', 0)
        .remove();
    }

  }, [expandedNodes, loadingNodes, calculateInsight]);

  const expandNode = async (nodeId: string) => {
    if (expandedNodes.has(nodeId) || loadingNodes.has(nodeId)) {
      return; // Already expanded or loading
    }

    // Add to loading state
    setLoadingNodes(prev => { const next = new Set(prev); next.add(nodeId); return next; });
    
    try {
      const response = await fetch('/api/constellation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: nodeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to expand node');
      }

      const newData: ConstellationData = await response.json();
      
      if (!constellation) return;

      // Merge new data with existing
      const existingNodeIds = new Set(constellation.nodes.map(n => n.id));
      const newNodes = newData.nodes.filter(n => !existingNodeIds.has(n.id));
      
      // Limit total nodes to 150
      const totalNodes = constellation.nodes.length + newNodes.length;
      const nodesToAdd = totalNodes > 150 
        ? newNodes.slice(0, 150 - constellation.nodes.length)
        : newNodes;

      const existingEdgeKeys = new Set(
        constellation.edges.map(e => {
          const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
          const targetId = typeof e.target === 'string' ? e.target : e.target.id;
          return `${sourceId}-${targetId}`;
        })
      );

      const newEdges = newData.edges.filter(e => {
        const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
        const targetId = typeof e.target === 'string' ? e.target : e.target.id;
        const key1 = `${sourceId}-${targetId}`;
        const key2 = `${targetId}-${sourceId}`;
        return !existingEdgeKeys.has(key1) && !existingEdgeKeys.has(key2);
      });

      // Update constellation state
      const updatedConstellation: ConstellationData = {
        ...constellation,
        nodes: [...constellation.nodes, ...nodesToAdd],
        edges: [...constellation.edges, ...newEdges]
      };

      setConstellation(updatedConstellation);
      setExpandedNodes(prev => { const next = new Set(prev); next.add(nodeId); return next; });

      // Update simulation with new nodes
      if (simulationRef.current) {
        simulationRef.current.nodes(updatedConstellation.nodes);
        simulationRef.current.force('link', d3.forceLink(updatedConstellation.edges)
          .id((d: ConstellationNode | d3.SimulationNodeDatum) => (d as ConstellationNode).id)
          .distance(d => 50 + (d as ConstellationEdge).weight)
          .strength(0.3)
        );
        simulationRef.current.alpha(0.3).restart();
      }

    } catch (err) {
      console.error('Failed to expand node:', err);
      setError(err instanceof Error ? err.message : 'Failed to expand node');
    } finally {
      // Remove from loading state
      setLoadingNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
    }
  };

  const getErrorMessage = (error: string, status?: number) => {
    if (status === 429 || error.toLowerCase().includes('rate limit')) {
      return "NEAR's data feeds are busy at the moment. Try again shortly.";
    }
    if (error.toLowerCase().includes('not found') || error.toLowerCase().includes('no data')) {
      return "No connections found for this wallet. It may be new or inactive.";
    }
    return error || 'An unexpected error occurred. Please try again.';
  };

  const handleSearch = async () => {
    if (!address.trim()) {
      setError('Please enter a NEAR wallet address');
      return;
    }

    setLoading(true);
    setError('');
    setConstellation(null);
    setShowInsight(false);
    setExpandedNodes(new Set());
    setLoadingNodes(new Set());

    try {
      const response = await fetch('/api/constellation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: address.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(getErrorMessage(errorData.error || 'Failed to fetch constellation data', response.status));
      }

      const data: ConstellationData = await response.json();
      if (!data.nodes.length) {
        throw new Error("No connections found for this wallet. It may be new or inactive.");
      }
      
      setConstellation(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const retrySearch = () => {
    handleSearch();
  };

  const resetView = () => {
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  const zoomIn = () => {
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.5);
    }
  };

  const zoomOut = () => {
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.67);
    }
  };

  useEffect(() => {
    if (constellation) {
      initializeVisualization(constellation);
    }
  }, [constellation, initializeVisualization]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wallet':
        return 'border-purple-500 bg-purple-500/20 text-purple-200';
      case 'contract':
        return 'border-cyan-500 bg-cyan-500/20 text-cyan-200';
      case 'dao':
        return 'border-amber-500 bg-amber-500/20 text-amber-200';
      default:
        return 'border-gray-500 bg-gray-500/20 text-gray-200';
    }
  };

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Constellation Mapping</h1>
        </div>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Explore the cosmic web of wallet relationships on NEAR Protocol
        </p>
      </div>

      {/* Search Interface */}
      <Card className="max-w-4xl mx-auto" padding="lg">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter NEAR wallet address (e.g., alex.near)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={loading || !address.trim()}
              variant="primary"
              className="px-8"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Mapping...
                </div>
              ) : (
                'Explore Constellation'
              )}
            </Button>
          </div>

          {/* Example Wallets */}
          <div className="space-y-2">
            <p className="text-xs text-text-muted">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {['starpause.near', 'mob.near', 'sweat_welcome.near'].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setAddress(example);
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="px-2.5 py-1 text-xs font-mono rounded-md bg-surface border border-border text-text-secondary hover:border-near-green/30 hover:text-text-primary transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-900/20 border border-red-500/20 text-red-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Connection Failed</p>
                <p className="text-xs text-red-200">{error}</p>
              </div>
              <Button 
                onClick={retrySearch}
                variant="secondary"
                size="sm"
                className="flex items-center gap-1.5 text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Insight Banner */}
      {showInsight && insightBanner && (
        <div className="max-w-4xl mx-auto px-4 transform transition-all duration-500 ease-out animate-in slide-in-from-top-4">
          <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <p className="text-sm text-green-400 font-medium text-center">
              ✨ {insightBanner}
            </p>
          </div>
        </div>
      )}

      {/* Constellation Visualization */}
      {constellation && (
        <div className="mx-4 mb-4">
          <Card className="h-[600px] min-h-[500px] max-h-[70vh] relative overflow-hidden" variant="glass">
            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <InfoTooltip term="Controls">
                Use mouse wheel to zoom, drag to pan, click nodes to explore connections
              </InfoTooltip>
              <Button variant="secondary" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="absolute top-4 left-4 z-10 space-y-2">
              <Badge variant="glass" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                {constellation.nodes.length} Nodes
              </Badge>
              <Badge variant="glass" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                {constellation.edges.length} Connections
              </Badge>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 space-y-2">
              <div className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium", getTypeColor('wallet'))}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Wallets
                </div>
              </div>
              <div className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium", getTypeColor('contract'))}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  Smart Contracts
                </div>
              </div>
              <div className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium", getTypeColor('dao'))}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  DAOs
                </div>
              </div>
            </div>

            {/* SVG Canvas */}
            <div ref={containerRef} className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
              <svg ref={svgRef} className="w-full h-full" />
            </div>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="fixed z-50 p-3 bg-black/90 border border-gray-600 rounded-lg shadow-xl pointer-events-none backdrop-blur-sm"
                style={{
                  left: tooltip.x + 10,
                  top: tooltip.y - 10,
                  transform: 'translateY(-100%)'
                }}
              >
                <div className="text-sm text-white space-y-1">
                  <div className="font-semibold text-cyan-400">{tooltip.content.id}</div>
                  <div className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs font-medium border",
                    getTypeColor(tooltip.content.type)
                  )}>
                    {tooltip.content.type.toUpperCase()}
                  </div>
                  <div className="text-gray-300 text-xs">
                    {tooltip.content.transactionCount} transactions
                  </div>
                  {tooltip.content.firstSeen && (
                    <div className="text-gray-400 text-xs">
                      Active: {formatDate(tooltip.content.firstSeen)} - {formatDate(tooltip.content.lastSeen)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
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