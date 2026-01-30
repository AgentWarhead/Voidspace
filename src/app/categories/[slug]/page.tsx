import { notFound } from 'next/navigation';
import { Container, Card } from '@/components/ui';
import { CategoryHeader } from '@/components/dashboard/CategoryHeader';
import { CategoryStats } from '@/components/dashboard/CategoryStats';
import { ProjectList } from '@/components/dashboard/ProjectList';
import {
  getCategoryBySlug,
  getProjectsByCategory,
  getCategoryProjectStats,
} from '@/lib/queries';
import { calculateGapScore } from '@/lib/gap-score';

interface Props {
  params: { slug: string };
  searchParams: { sort?: string; activeOnly?: string };
}

export async function generateMetadata({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'Category Not Found — Voidspace' };

  return {
    title: `${category.name} — Voidspace`,
    description: category.description || `Explore ${category.name} projects in the NEAR ecosystem.`,
  };
}

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const [projects, stats] = await Promise.all([
    getProjectsByCategory(category.id, {
      sort: searchParams.sort,
      activeOnly: searchParams.activeOnly === 'true',
    }),
    getCategoryProjectStats(category.id),
  ]);

  const gapScore = calculateGapScore({
    categorySlug: category.slug,
    totalProjects: stats.total,
    activeProjects: stats.active,
    totalTVL: stats.tvl,
    transactionVolume: 0,
    isStrategic: category.is_strategic,
    strategicMultiplier: Number(category.strategic_multiplier) || 1,
  });

  return (
    <div className="min-h-screen">
      <Container size="xl" className="py-8 space-y-8">
        <Card padding="lg">
          <CategoryHeader
            category={category}
            gapScore={gapScore}
            projectCount={stats.total}
          />
        </Card>

        <CategoryStats
          totalProjects={stats.total}
          activeProjects={stats.active}
          totalTVL={stats.tvl}
          gapScore={gapScore}
        />

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Projects ({stats.total})
          </h2>
          <ProjectList projects={projects} initialSort={searchParams.sort || 'tvl'} />
        </div>
      </Container>
    </div>
  );
}
