export const dynamic = 'force-dynamic';

import dynamic_import from 'next/dynamic';
import { Container, Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { ChainHealth } from '@/components/dashboard/ChainHealth';
import { GitHubPulse } from '@/components/dashboard/GitHubPulse';
import { HotWalletsTable } from '@/components/ecosystem/HotWalletsTable';
import { ScanLine } from '@/components/effects/ScanLine';
import {
  getLatestChainStats,
  getChainStatsHistory,
  getGitHubAggregateStats,
  getEcosystemStats,
} from '@/lib/queries';
import { formatNumber, formatCurrency } from '@/lib/utils';

const ChainActivityChart = dynamic_import(
  () => import('@/components/charts/ChainActivityChart').then((m) => ({ default: m.ChainActivityChart })),
  { ssr: false }
);

export const metadata = {
  title: 'Ecosystem Health — Voidspace',
  description: 'Live NEAR Protocol chain health, GitHub ecosystem pulse, and hot wallet analytics.',
};

export default async function EcosystemPage() {
  const [chainStats, chainHistory, githubStats, ecosystemStats] = await Promise.all([
    getLatestChainStats(),
    getChainStatsHistory(30),
    getGitHubAggregateStats(),
    getEcosystemStats(),
  ]);

  const hotWallets = chainStats?.hot_wallets || [];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,236,151,0.04) 0%, transparent 70%)',
          }}
        />
        <GridPattern className="opacity-20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)',
          }}
        />
        <Container size="xl" className="relative z-10 text-center">
          <GradientText as="h1" className="text-4xl sm:text-5xl font-bold tracking-tight">
            Ecosystem Health
          </GradientText>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            NEAR is a thriving, production-grade blockchain. These numbers prove your next project has real infrastructure and real users behind it.
          </p>

          {/* Summary Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-near-green font-mono">
                {formatNumber(ecosystemStats.totalProjects)}
              </p>
              <p className="text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Projects</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary font-mono">
                {formatCurrency(ecosystemStats.totalTVL)}
              </p>
              <p className="text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Total TVL</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary font-mono">
                {chainStats?.nodes_online || 0}
              </p>
              <p className="text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Nodes Online</p>
            </div>
          </div>
        </Container>
      </section>

      <Container size="xl" className="py-8 space-y-8">
        {/* Chain Health */}
        <ScrollReveal>
          <section>
            <SectionHeader title="Chain Health" badge="NEARBLOCKS" />
            <p className="text-xs text-text-muted mb-4 -mt-2">Sub-second finality, hundreds of nodes, millions of accounts — your app runs on serious infrastructure.</p>
            <ChainHealth chainStats={chainStats} />
          </section>
        </ScrollReveal>

        {/* Chain Activity Trend */}
        <ScrollReveal delay={0.05}>
          <section>
            <SectionHeader title="Chain Activity (30d)" badge="TREND" />
            <Card variant="glass" padding="lg" className="relative overflow-hidden">
              <ScanLine />
              <div className="relative z-10">
                <ChainActivityChart history={chainHistory} />
              </div>
            </Card>
          </section>
        </ScrollReveal>

        {/* GitHub Ecosystem Pulse */}
        <ScrollReveal delay={0.1}>
          <section>
            <SectionHeader title="GitHub Ecosystem Pulse" badge="GITHUB" />
            <p className="text-xs text-text-muted mb-4 -mt-2">An active open-source community means documentation, libraries, and support when you need it.</p>
            <GitHubPulse stats={githubStats} />
          </section>
        </ScrollReveal>

        {/* Hot Wallets */}
        <ScrollReveal delay={0.15}>
          <section>
            <SectionHeader title="Hot Wallets" badge="PIKESPEAK" />
            <HotWalletsTable wallets={hotWallets} />
          </section>
        </ScrollReveal>

        {/* CTA — Connect to Voids */}
        <ScrollReveal delay={0.2}>
          <div className="text-center py-6">
            <p className="text-sm text-text-secondary mb-3">
              NEAR is thriving. Now see where it needs you most.
            </p>
            <a
              href="/opportunities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-near-green/10 border border-near-green/20 text-near-green hover:bg-near-green/20 rounded-lg transition-colors text-sm font-medium"
            >
              Explore Voids
            </a>
          </div>
        </ScrollReveal>

        {/* Data Sources */}
        <ScrollReveal delay={0.25}>
          <Card variant="glass" padding="md" className="relative overflow-hidden">
            <ScanLine />
            <div className="relative z-10">
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3 font-mono">
                Data Sources
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { name: 'NearBlocks', desc: 'Chain metrics' },
                  { name: 'DeFiLlama', desc: 'TVL & DeFi' },
                  { name: 'GitHub', desc: 'Developer activity' },
                  { name: 'FastNEAR', desc: 'On-chain data' },
                  { name: 'Pikespeak', desc: 'Wallet analytics' },
                  { name: 'Ecosystem', desc: 'Project registry' },
                ].map((source) => (
                  <div
                    key={source.name}
                    className="text-center p-2 rounded-lg bg-near-green/5 border border-near-green/10"
                  >
                    <p className="text-xs font-mono text-near-green/70">{source.name}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{source.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </Container>
    </div>
  );
}
