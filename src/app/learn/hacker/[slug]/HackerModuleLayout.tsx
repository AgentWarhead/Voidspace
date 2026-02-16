'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ChevronLeft, ChevronRight, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { HackerModule } from '../../types';
import { RelatedContent } from '../../components/RelatedContent';
import { ModuleCompletionTracker } from '@/components/tracking/ModuleCompletionTracker';
import { WalletPromptBanner } from '@/components/tracking/WalletPromptBanner';

import {
  NearArchitectureDeepDive,
  CrossContractCalls,
  AdvancedStorage,
  ChainSignatures,
  IntentsChainAbstraction,
  ShadeAgents,
  AiAgentIntegration,
  MevTransactionOrdering,
  BuildingAnIndexer,
  MultiChainWithNear,
  ProductionPatterns,
  ZeroKnowledgeOnNear,
  OracleIntegration,
  GasOptimizationDeepDive,
  BridgeArchitecture,
  FormalVerification,
} from '../modules';

// ─── Module Component Map ──────────────────────────────────────────────────────

const MODULE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'near-architecture-deep-dive': NearArchitectureDeepDive,
  'cross-contract-calls': CrossContractCalls,
  'advanced-storage': AdvancedStorage,
  'chain-signatures': ChainSignatures,
  'intents-chain-abstraction': IntentsChainAbstraction,
  'shade-agents': ShadeAgents,
  'ai-agent-integration': AiAgentIntegration,
  'mev-transaction-ordering': MevTransactionOrdering,
  'building-an-indexer': BuildingAnIndexer,
  'multi-chain-with-near': MultiChainWithNear,
  'production-patterns': ProductionPatterns,
  'zero-knowledge-on-near': ZeroKnowledgeOnNear,
  'oracle-integration': OracleIntegration,
  'gas-optimization-deep-dive': GasOptimizationDeepDive,
  'bridge-architecture': BridgeArchitecture,
  'formal-verification': FormalVerification,
};

// ─── Layout Props ──────────────────────────────────────────────────────────────

interface HackerModuleLayoutProps {
  currentModule: HackerModule;
  prevModule: HackerModule | null;
  nextModule: HackerModule | null;
  totalModules: number;
  currentIndex: number;
}

export function HackerModuleLayout({
  currentModule,
  prevModule,
  nextModule,
  totalModules,
  currentIndex,
}: HackerModuleLayoutProps) {
  const ModuleComponent = MODULE_COMPONENTS[currentModule.slug];
  const progress = ((currentIndex + 1) / totalModules) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-surface">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-accent-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* ── Breadcrumbs ── */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <Container size="lg">
          <div className="flex items-center justify-between py-3 gap-2">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-muted overflow-x-auto min-w-0">
              <Link href="/" className="hover:text-text-secondary transition-colors flex-shrink-0 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <Link href="/learn" className="hover:text-text-secondary transition-colors flex-shrink-0">
                Learn
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-purple-400 font-medium flex-shrink-0 hidden sm:inline">Hacker Track</span>
              <span className="text-purple-400 font-medium flex-shrink-0 sm:hidden">Hacker</span>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-text-secondary truncate">{currentModule.title}</span>
            </nav>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <BookOpen className="w-4 h-4 text-text-muted hidden sm:block" />
              <span className="text-xs text-text-muted font-mono">
                {currentIndex + 1}/{totalModules}
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Wallet Prompt ── */}
      <WalletPromptBanner />

      {/* ── Module Content ── */}
      <main className="py-12 md:py-16">
        {ModuleComponent && <ModuleComponent isActive={true} onToggle={() => {}} />}
      </main>

      {/* ── Related Content ── */}
      <RelatedContent currentTrack="hacker" />

      {/* ── Completion Tracker ── */}
      <ModuleCompletionTracker moduleSlug={currentModule.slug} track="hacker" />

      {/* ── Prev / Next Navigation ── */}
      <div className="border-t border-border bg-surface/30">
        <Container size="lg">
          <div className="flex items-center justify-between py-4 sm:py-6 gap-2 sm:gap-4">
            {prevModule ? (
              <Link href={`/learn/hacker/${prevModule.slug}`} className="group flex-1 max-w-[40%] sm:max-w-xs">
                <Button variant="ghost" size="md" className="w-full justify-start gap-1.5 sm:gap-2 min-h-[44px] px-2 sm:px-4">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-text-muted">Previous</div>
                    <div className="text-xs sm:text-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">
                      {prevModule.title}
                    </div>
                  </div>
                </Button>
              </Link>
            ) : (
              <div className="flex-1 max-w-[40%] sm:max-w-xs" />
            )}

            <Link href="/learn#tracks" className="flex-shrink-0">
              <Button variant="ghost" size="sm" className="text-text-muted min-h-[44px] px-2 sm:px-4 text-xs sm:text-sm">
                All Modules
              </Button>
            </Link>

            {nextModule ? (
              <Link href={`/learn/hacker/${nextModule.slug}`} className="group flex-1 max-w-[40%] sm:max-w-xs">
                <Button variant="ghost" size="md" className="w-full justify-end gap-1.5 sm:gap-2 min-h-[44px] px-2 sm:px-4">
                  <div className="text-right min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-text-muted">Next</div>
                    <div className="text-xs sm:text-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">
                      {nextModule.title}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Button>
              </Link>
            ) : (
              <div className="flex-1 max-w-[40%] sm:max-w-xs" />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
