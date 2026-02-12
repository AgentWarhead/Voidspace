'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ChevronLeft, ChevronRight, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { FounderModule } from './page';
import { RelatedContent } from '../../components/RelatedContent';

import {
  NearGrantsFunding,
  TokenomicsDesign,
  BuildingInPublic,
  PitchingYourProject,
  RevenueModelsForDapps,
  CommunityBuilding,
  GoToMarket,
  LegalRegulatoryBasics,
  TreasuryManagement,
  MetricsThatMatter,
  MarketingForWeb3,
  InvestorRelations,
} from '../modules';

// ─── Module Component Map ──────────────────────────────────────────────────────

const MODULE_COMPONENTS: Record<string, React.ComponentType> = {
  'near-grants-funding': NearGrantsFunding,
  'tokenomics-design': TokenomicsDesign,
  'building-in-public': BuildingInPublic,
  'pitching-your-project': PitchingYourProject,
  'revenue-models-for-dapps': RevenueModelsForDapps,
  'community-building': CommunityBuilding,
  'go-to-market': GoToMarket,
  'legal-regulatory-basics': LegalRegulatoryBasics,
  'treasury-management': TreasuryManagement,
  'metrics-that-matter': MetricsThatMatter,
  'marketing-for-web3': MarketingForWeb3,
  'investor-relations': InvestorRelations,
};

// ─── Layout Props ──────────────────────────────────────────────────────────────

interface FounderModuleLayoutProps {
  currentModule: FounderModule;
  prevModule: FounderModule | null;
  nextModule: FounderModule | null;
  totalModules: number;
  currentIndex: number;
}

export function FounderModuleLayout({
  currentModule,
  prevModule,
  nextModule,
  totalModules,
  currentIndex,
}: FounderModuleLayoutProps) {
  const ModuleComponent = MODULE_COMPONENTS[currentModule.slug];
  const progress = ((currentIndex + 1) / totalModules) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-surface">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 to-near-green"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* ── Breadcrumbs ── */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <Container size="lg">
          <div className="flex items-center justify-between py-3">
            <nav className="flex items-center gap-2 text-sm text-text-muted overflow-x-auto">
              <Link href="/" className="hover:text-text-secondary transition-colors flex-shrink-0">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <Link href="/learn" className="hover:text-text-secondary transition-colors flex-shrink-0">
                Learn
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-purple-400 font-medium flex-shrink-0">Founder Track</span>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-text-secondary truncate">{currentModule.title}</span>
            </nav>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <BookOpen className="w-4 h-4 text-text-muted" />
              <span className="text-xs text-text-muted font-mono">
                {currentIndex + 1}/{totalModules}
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Module Content ── */}
      <main className="py-12 md:py-16">
        {ModuleComponent && <ModuleComponent />}
      </main>

      {/* ── Related Content ── */}
      <RelatedContent currentTrack="founder" />

      {/* ── Prev / Next Navigation ── */}
      <div className="border-t border-border bg-surface/30">
        <Container size="lg">
          <div className="flex items-center justify-between py-6 gap-4">
            {prevModule ? (
              <Link href={`/learn/founder/${prevModule.slug}`} className="group flex-1 max-w-xs">
                <Button variant="ghost" size="md" className="w-full justify-start gap-2">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest text-text-muted">Previous</div>
                    <div className="text-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">
                      {prevModule.title}
                    </div>
                  </div>
                </Button>
              </Link>
            ) : (
              <div className="flex-1 max-w-xs" />
            )}

            <Link href="/learn#tracks">
              <Button variant="ghost" size="sm" className="text-text-muted">
                All Modules
              </Button>
            </Link>

            {nextModule ? (
              <Link href={`/learn/founder/${nextModule.slug}`} className="group flex-1 max-w-xs">
                <Button variant="ghost" size="md" className="w-full justify-end gap-2">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-text-muted">Next</div>
                    <div className="text-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">
                      {nextModule.title}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <div className="flex-1 max-w-xs" />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
