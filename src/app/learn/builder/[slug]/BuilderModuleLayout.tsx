'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ChevronLeft, ChevronRight, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BuilderModule } from '../../types';
import { ModuleCompletionTracker } from '@/components/tracking/ModuleCompletionTracker';
import { WalletPromptBanner } from '@/components/tracking/WalletPromptBanner';

import {
  CollectionsIterators,
  DevEnvironmentSetup,
  ErrorHandling,
  OwnershipBorrowing,
  RustFundamentals,
  StructsEnums,
  TraitsGenerics,
  YourFirstContract,
  AccountModelAccessKeys,
  StateManagement,
  NearCliMastery,
  TestingDebugging,
  FrontendIntegration,
  TokenStandards,
  NepStandardsDeepDive,
  BuildingADapp,
  SecurityBestPractices,
  UpgradingContracts,
  Deployment,
  Optimization,
  LaunchChecklist,
  BuildingAnNftContract,
  BuildingADaoContract,
  DefiContractPatterns,
  AuroraEvmCompatibility,
  WalletSelectorIntegration,
  NearSocialBos,
} from '../modules';

// ─── Module Component Map ──────────────────────────────────────────────────────

const MODULE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'collections-iterators': CollectionsIterators,
  'dev-environment-setup': DevEnvironmentSetup,
  'error-handling': ErrorHandling,
  'ownership-borrowing': OwnershipBorrowing,
  'rust-fundamentals': RustFundamentals,
  'structs-enums': StructsEnums,
  'traits-generics': TraitsGenerics,
  'your-first-contract': YourFirstContract,
  'account-model-access-keys': AccountModelAccessKeys,
  'state-management': StateManagement,
  'near-cli-mastery': NearCliMastery,
  'testing-debugging': TestingDebugging,
  'frontend-integration': FrontendIntegration,
  'token-standards': TokenStandards,
  'nep-standards-deep-dive': NepStandardsDeepDive,
  'building-a-dapp': BuildingADapp,
  'security-best-practices': SecurityBestPractices,
  'upgrading-contracts': UpgradingContracts,
  'deployment': Deployment,
  'optimization': Optimization,
  'launch-checklist': LaunchChecklist,
  'building-an-nft-contract': BuildingAnNftContract,
  'building-a-dao-contract': BuildingADaoContract,
  'defi-contract-patterns': DefiContractPatterns,
  'aurora-evm-compatibility': AuroraEvmCompatibility,
  'wallet-selector-integration': WalletSelectorIntegration,
  'near-social-bos': NearSocialBos,
};

// ─── Layout Props ──────────────────────────────────────────────────────────────

interface BuilderModuleLayoutProps {
  currentModule: BuilderModule;
  prevModule: BuilderModule | null;
  nextModule: BuilderModule | null;
  totalModules: number;
  currentIndex: number;
}

export function BuilderModuleLayout({
  currentModule,
  prevModule,
  nextModule,
  totalModules,
  currentIndex,
}: BuilderModuleLayoutProps) {
  const ModuleComponent = MODULE_COMPONENTS[currentModule.slug];
  const progress = ((currentIndex + 1) / totalModules) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-surface">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-cyan to-near-green"
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
              <span className="text-accent-cyan font-medium flex-shrink-0 hidden sm:inline">Builder Track</span>
              <span className="text-accent-cyan font-medium flex-shrink-0 sm:hidden">Builder</span>
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

      {/* ── Completion Tracker ── */}
      <ModuleCompletionTracker
        moduleSlug={currentModule.slug}
        track="builder"
        nextModule={nextModule ? { title: nextModule.title, slug: nextModule.slug } : undefined}
      />

      {/* ── Prev / Next Navigation ── */}
      <div className="border-t border-border bg-surface/30">
        <Container size="lg">
          <div className="flex items-center justify-between py-4 sm:py-6 gap-2 sm:gap-4">
            {prevModule ? (
              <Link href={`/learn/builder/${prevModule.slug}`} className="group flex-1 max-w-[40%] sm:max-w-xs">
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
              <Link href={`/learn/builder/${nextModule.slug}`} className="group flex-1 max-w-[40%] sm:max-w-xs">
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
