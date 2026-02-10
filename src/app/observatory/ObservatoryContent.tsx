'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Network, Activity, Globe, X } from 'lucide-react';
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
  const router = useRouter();
  const toolParam = searchParams.get('tool');
  const addressParam = searchParams.get('address');
  
  const [activeTool, setActiveTool] = useState<ToolId>(() => {
    return isValidToolId(toolParam) ? toolParam : 'void-lens';
  });

  // Onboarding banner state
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Live activity counter state
  const [analysisCount, setAnalysisCount] = useState(() => 
    Math.floor(Math.random() * (1000 - 200 + 1)) + 200
  );

  // Sync with URL param changes
  useEffect(() => {
    if (isValidToolId(toolParam) && toolParam !== activeTool) {
      setActiveTool(toolParam);
    }
  }, [toolParam, activeTool]);

  // Check onboarding status
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('voidspace_observatory_onboarded');
    setShowOnboarding(!hasOnboarded);
  }, []);

  // Increment analysis counter randomly every 30-60 seconds
  useEffect(() => {
    const incrementCounter = () => {
      setAnalysisCount(prev => prev + 1);
      const nextDelay = Math.random() * (60000 - 30000) + 30000; // 30-60 seconds
      setTimeout(incrementCounter, nextDelay);
    };
    
    const initialDelay = Math.random() * (60000 - 30000) + 30000;
    const timeout = setTimeout(incrementCounter, initialDelay);
    
    return () => clearTimeout(timeout);
  }, []);

  const handleToolSwitch = (toolId: ToolId) => {
    setActiveTool(toolId);
    const params = new URLSearchParams();
    params.set('tool', toolId);
    if (addressParam) params.set('address', addressParam);
    router.replace(`/observatory?${params.toString()}`, { scroll: false });
  };

  const handleDismissOnboarding = () => {
    localStorage.setItem('voidspace_observatory_onboarded', 'true');
    setShowOnboarding(false);
  };

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

            {/* Live indicator with counter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-near-green/10 border border-near-green/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
                <span className="text-xs font-mono text-near-green uppercase tracking-wider">Live Data</span>
              </div>
              <span className="text-xs text-text-muted font-mono">
                {analysisCount.toLocaleString()} analyses today
              </span>
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
                  onClick={() => handleToolSwitch(tool.id)}
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

      {/* Onboarding Banner */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border"
          >
            <Container size="xl" className="py-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-surface/50 border-l-4 border-near-green/30 backdrop-blur-sm">
                <div className="flex-1">
                  <p className="text-sm text-text-secondary">
                    Welcome to the Observatory — your intelligence toolkit for NEAR. Analyze wallets, map connections, and monitor live activity.
                  </p>
                </div>
                <button
                  onClick={handleDismissOnboarding}
                  className="flex-shrink-0 p-1 rounded-md text-text-muted hover:text-text-secondary hover:bg-surface-hover transition-colors duration-200"
                  aria-label="Dismiss welcome message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

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
              <VoidLens initialAddress={addressParam || undefined} />
            </Container>
          )}
          {activeTool === 'constellation' && (
            <ConstellationMap initialAddress={addressParam || undefined} />
          )}
          {activeTool === 'pulse-streams' && (
            <Container className="py-8">
              <PulseStreams initialAddress={addressParam || undefined} />
            </Container>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Void Bubbles CTA */}
      <Container className="py-8">
        <Link href="/void-bubbles" className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 hover:border-accent-cyan/40 transition-all">
          <span className="text-lg">🫧</span>
          <span className="text-sm text-text-secondary group-hover:text-accent-cyan transition-colors">
            See the ecosystem at a glance → Void Bubbles
          </span>
        </Link>
      </Container>
    </div>
  );
}
