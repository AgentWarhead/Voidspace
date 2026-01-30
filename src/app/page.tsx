import dynamic from 'next/dynamic';
import { Container } from '@/components/ui';
import { GradientText } from '@/components/effects/GradientText';
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
import { Card } from '@/components/ui';

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
      <Container size="xl" className="py-8 space-y-10">
        {/* Compact Hero */}
        <section className="text-center space-y-2 py-4">
          <GradientText as="h1" className="text-3xl sm:text-4xl font-bold">
            Voidspace
          </GradientText>
          <p className="text-text-secondary">
            Every ecosystem has voids. Voidspace finds them.
          </p>
        </section>

        {/* Ecosystem Stats */}
        <section>
          <EcosystemOverview stats={stats} />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card padding="md">
            <h3 className="text-sm font-medium text-text-secondary mb-4">Category Saturation</h3>
            <CategorySaturationChart categories={categories} />
          </Card>
          <Card padding="md">
            <h3 className="text-sm font-medium text-text-secondary mb-4">TVL Distribution</h3>
            <TVLByCategory categories={categories} />
          </Card>
        </section>

        {/* Category Grid */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Ecosystem Categories</h2>
          <CategoryGrid categories={categories} />
        </section>

        {/* Trending Gaps */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Trending Opportunities</h2>
          <TrendingGaps opportunities={opportunities} />
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
          <RecentActivity recentProjects={recentProjects} lastSyncAt={stats.lastSyncAt} />
        </section>
      </Container>
    </div>
  );
}
