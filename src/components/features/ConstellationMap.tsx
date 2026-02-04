'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Search, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
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

export function ConstellationMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState('');
  const [constellation, setConstellation] = useState<ConstellationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const simulationRef = useRef<d3.Simulation<ConstellationNode, ConstellationEdge> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Initialize D3 visualization
  const initializeVisualization = useCallback((data: ConstellationData) => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll('*').remove();
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    svg.attr('width', width).attr('height', height);

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

    // Scale for node sizes based on transaction count
    const nodeScale = d3.scalePow()
      .exponent(0.5)
      .domain(d3.extent(data.nodes, d => d.transactionCount) as [number, number])
      .range([NODE_RADIUS.min, NODE_RADIUS.max]);

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
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
        .radius(d => (d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount)) + 5)
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

    // Create nodes
    const nodes = nodeGroup.selectAll('.node')
      .data(data.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', d => d.id === data.centerNode ? NODE_RADIUS.center : nodeScale(d.transactionCount))
      .style('fill', d => d.id === data.centerNode ? NODE_COLORS.center : NODE_COLORS[d.type])
      .style('filter', d => `url(#outer-glow-${d.id === data.centerNode ? 'center' : d.type})`)
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

    // Add zoom and pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    zoomRef.current = zoom;

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => (d.source as ConstellationNode).x!)
        .attr('y1', d => (d.source as ConstellationNode).y!)
        .attr('x2', d => (d.target as ConstellationNode).x!)
        .attr('y2', d => (d.target as ConstellationNode).y!);

      nodes
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

  }, []);

  const expandNode = async (nodeId: string) => {
    // TODO: Fetch additional connections for the selected node
    // This would call the API again with the new node as center
    console.log('Expanding node:', nodeId);
  };

  const handleSearch = async () => {
    if (!address.trim()) {
      setError('Please enter a NEAR wallet address');
      return;
    }

    setLoading(true);
    setError('');
    setConstellation(null);

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
        throw new Error(errorData.error || 'Failed to fetch constellation data');
      }

      const data: ConstellationData = await response.json();
      setConstellation(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-6 h-screen flex flex-col">
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
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Enter NEAR wallet address (e.g., alice.near)"
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
        
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}
      </Card>

      {/* Constellation Visualization */}
      {constellation && (
        <div className="flex-1 mx-4 mb-4">
          <Card className="h-full relative overflow-hidden" variant="glass">
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
              <Search className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Ready to Explore the Void</h3>
              <p className="text-text-secondary">Enter a NEAR wallet address to visualize its connection constellation</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}