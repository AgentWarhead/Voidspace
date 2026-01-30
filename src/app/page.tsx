import nextDynamic from 'next/dynamic';
import Link from 'next/link';

import { BookOpen } from 'lucide-react';
import { Container, Card } from '@/components/ui';
import { HeroSection } from '@/components/hero/HeroSection';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScanLine } from '@/components/effects/ScanLine';
import { GradientText } from '@/components/effects/GradientText';
import { EcosystemOverview } from '@/components/dashboard/EcosystemOverview';
import { ChainHealth } from '@/components/dashboard/ChainHealth';
import { GitHubPulse } from '@/components/dashboard/GitHubPulse';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { TrendingGaps } from '@/components/dashboard/TrendingGaps';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import {
  getEcosystemStats,
  getCategoriesWithStats,
  getTopOpportunities,
  getRecentProjects,
  getLatestChainStats,
  getGitHubAggregateStats,
  getChainStatsHistory,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

const CategorySaturationChart = nextDynamic(
  () => import('@/components/charts/CategorySaturationChart').then((m) => m.CategorySaturationChart),
  { ssr: false }
);

const TVLByCategory = nextDynamic(
  () => import('@/components/charts/TVLByCategory').then((m) => m.TVLByCategory),
  { ssr: false }
);

const GitHubActivityChart = nextDynamic(
  () => import('@/components/charts/GitHubActivityChart').then((m) => m.GitHubActivityChart),
  { ssr: false }
);

const ChainActivityChart = nextDynamic(
  () => import('@/components/charts/ChainActivityChart').then((m) => m.ChainActivityChart),
  { ssr: false }
);

export default async function DashboardPage() {
  const [stats, categories, opportunities, recentProjects, chainStats, githubStats, chainHistory] = await Promise.all([
    getEcosystemStats(),
    getCategoriesWithStats(),
    getTopOpportunities(5),
    getRecentProjects(5),
    getLatestChainStats(),
    getGitHubAggregateStats(),
    getChainStatsHistory(30),
  ]);

  const avgGapScore = categories.length > 0
    ? Math.round(categories.reduce((s, c) => s + c.gapScore, 0) / categories.length)
    : 0;

  // Compute GitHub stars by category for chart
  const githubStarsByCategory = categories
    .map((c) => ({ name: c.name, stars: 0 })) // Will be populated as projects have github_stars
    .filter((c) => c.stars > 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10);

  return (
    <div className="min-h-screen">
      {/* Hero — The Void Portal */}
      <HeroSection stats={stats} totalStars={githubStats.totalStars} />

      <Container size="xl" className="py-8 space-y-10">
        {/* Ecosystem Stats */}
        <ScrollReveal>
          <section>
            <SectionHeader title="Ecosystem Overview" badge="LIVE" />
            <EcosystemOverview stats={stats} avgGapScore={avgGapScore} chainStats={chainStats} githubStats={githubStats} />
          </section>
        </ScrollReveal>

        {/* Chain Health */}
        {chainStats && (
          <ScrollReveal delay={0.05}>
            <section>
              <SectionHeader title="Chain Health" badge="NEARBLOCKS" />
              <ChainHealth chainStats={chainStats} />
            </section>
          </ScrollReveal>
        )}

        {/* GitHub Pulse */}
        <ScrollReveal delay={0.08}>
          <section>
            <SectionHeader title="GitHub Ecosystem Pulse" badge="GITHUB" />
            <GitHubPulse stats={githubStats} />
          </section>
        </ScrollReveal>

        {/* Charts */}
        <ScrollReveal delay={0.1}>
          <section>
            <SectionHeader title="Analytics" badge="AI ANALYZED" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="glass" padding="md" className="relative overflow-hidden">
                <ScanLine />
                <h3 className="text-sm font-medium text-text-secondary mb-4">Category Saturation</h3>
                <CategorySaturationChart categories={categories} />
              </Card>
              <Card variant="glass" padding="md" className="relative overflow-hidden">
                <ScanLine />
                <h3 className="text-sm font-medium text-text-secondary mb-4">TVL Distribution</h3>
                <TVLByCategory categories={categories} />
              </Card>
              <Card variant="glass" padding="md" className="relative overflow-hidden">
                <ScanLine />
                <h3 className="text-sm font-medium text-text-secondary mb-4">Chain Activity Trend</h3>
                <ChainActivityChart history={chainHistory} />
              </Card>
              <Card variant="glass" padding="md" className="relative overflow-hidden">
                <ScanLine />
                <h3 className="text-sm font-medium text-text-secondary mb-4">GitHub Stars by Category</h3>
                <GitHubActivityChart categories={categories} githubStarsByCategory={githubStarsByCategory} />
              </Card>
            </div>
          </section>
        </ScrollReveal>

        {/* Education CTA */}
        <ScrollReveal delay={0.12}>
          <Card variant="glass" padding="lg" className="text-center">
            <BookOpen className="w-8 h-8 text-near-green mx-auto mb-3" />
            <GradientText as="h3" className="text-lg font-bold mb-2">
              New to NEAR?
            </GradientText>
            <p className="text-sm text-text-secondary mb-4 max-w-md mx-auto">
              Learn about NEAR Protocol, its cutting-edge technology, and how Voidspace helps you find your next build.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-near-green/30 text-text-secondary hover:text-near-green rounded-lg transition-colors text-sm"
            >
              Start Learning
            </Link>
          </Card>
        </ScrollReveal>

        {/* Category Grid */}
        <ScrollReveal delay={0.15}>
          <section>
            <SectionHeader title="Ecosystem Categories" count={categories.length} />
            <CategoryGrid categories={categories} />
          </section>
        </ScrollReveal>

        {/* Trending Gaps */}
        <ScrollReveal delay={0.1}>
          <section>
            <SectionHeader title="Trending Opportunities" count={opportunities.length} badge="HOT" />
            <TrendingGaps opportunities={opportunities} />
          </section>
        </ScrollReveal>

        {/* Recent Activity */}
        <ScrollReveal delay={0.1}>
          <section>
            <SectionHeader title="Recent Activity" />
            <RecentActivity recentProjects={recentProjects} lastSyncAt={stats.lastSyncAt} />
          </section>
        </ScrollReveal>
      </Container>
    </div>
  );
}
