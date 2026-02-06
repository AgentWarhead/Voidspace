'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Network, Activity, Globe } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { VoidLens } from '@/components/features/VoidLens';
import { ConstellationMap } from '@/components/features/ConstellationMap';
import { PulseStreams } from '@/components/features/PulseStreams';
import { cn } from '@/lib/utils';

const TOOLS = [
  {
    id: 'void-lens',
    label: 'Void Lens',
    icon: Eye,
    description: 'Analyze wallet reputation and trust signals',
    iconTint: 'text-cyan-400',
  },
  {
    id: 'constellation',
    label: 'Constellation',
    icon: Network,
    description: 'Map wallet relationships and transaction patterns',
    iconTint: 'text-purple-400',
  },
  {
    id: 'pulse-streams',
    label: 'Pulse Streams',
    icon: Activity,
    description: 'Monitor real-time ecosystem activity',
    iconTint: 'text-near-green',
  },
] as const;

type ToolId = typeof TOOLS[number]['id'];

const isValidToolId = (id: string | null): id is ToolId => {
  return id !== null && TOOLS.some(t => t.id === id);
};

export default function ObservatoryContent() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool');
  
  const [activeTool, setActiveTool] = useState<ToolId>(() => {
    return isValidToolId(toolParam) ? toolParam : 'void-lens';
  });

  // Sync with URL param changes
  useEffect(() => {
    if (isValidToolId(toolParam) && toolParam !== activeTool) {
      setActiveTool(toolParam);
    }
  }, [toolParam, activeTool]);

  const activeToolData = TOOLS.find(t => t.id === activeTool)!;

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
                Intelligence tools to analyze wallets, map relationships, and monitor the NEAR ecosystem in real-time.
              </p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
              <span className="text-xs font-mono text-near-green uppercase tracking-wider">Live Data</span>
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
                  onClick={() => setActiveTool(tool.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200',
                    isActive
                      ? 'bg-near-green/10 border-near-green/30 text-near-green'
                      : 'bg-surface border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:border-border-hover'
                  )}
                >
                  <Icon className={cn(
                    "w-4 h-4",
                    isActive ? "text-near-green" : tool.iconTint
                  )} />
                  <span className="text-sm font-medium">{tool.label}</span>
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

      {/* Tool Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTool === 'void-lens' && (
            <Container className="py-8">
              <VoidLens />
            </Container>
          )}
          {activeTool === 'constellation' && (
            <ConstellationMap />
          )}
          {activeTool === 'pulse-streams' && (
            <Container className="py-8">
              <PulseStreams />
            </Container>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
