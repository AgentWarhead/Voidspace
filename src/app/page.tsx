import dynamic from 'next/dynamic';
import { Container, Card } from '@/components/ui';
import { HeroSection } from '@/components/hero/HeroSection';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScanLine } from '@/components/effects/ScanLine';
import { EcosystemOverview } from '@/components/dashboard/EcosystemOverview';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { TrendingGaps } from '@/components/dashboard/TrendingGaps';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import {
  getEcosystemStats,
  getCategoriesWithStats,
  getTopOpportunities,
  getRecentProjects,
} from '@/lib/queries';

const CategorySaturationChart = dynamic(
  () => import('@/components/charts/CategorySaturationChart').then((m) => m.CategorySaturationChart),
  { ssr: false }
);

const TVLByCategory = dynamic(
  () => import('@/components/charts/TVLByCategory').then((m) => m.TVLByCategory),
  { ssr: false }
);

export default async function DashboardPage() {
  const [stats, categories, opportunities, recentProjects] = await Promise.all([
    getEcosystemStats(),
    getCategoriesWithStats(),
    getTopOpportunities(5),
    getRecentProjects(5),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero — The Void Portal */}
      <HeroSection stats={stats} />

      <Container size="xl" className="py-8 space-y-10">
        {/* Ecosystem Stats */}
        <ScrollReveal>
          <section>
            <SectionHeader title="Ecosystem Overview" badge="LIVE" />
            <EcosystemOverview stats={stats} />
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
            </div>
          </section>
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
