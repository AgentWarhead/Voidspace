export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { Container } from '@/components/ui';
import { OpportunityDetail } from '@/components/opportunities/OpportunityDetail';
import { getOpportunityById, getRelatedProjects, getCategoryProjectStats, getProjectsByCategory } from '@/lib/queries';
import { calculateGapScoreBreakdown } from '@/lib/gap-score';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const opportunity = await getOpportunityById(params.id);
  if (!opportunity) return { title: 'Opportunity Not Found — Voidspace' };

  return {
    title: `${opportunity.title} — Voidspace`,
    description: opportunity.description || `Gap opportunity in the NEAR ecosystem.`,
  };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const opportunity = await getOpportunityById(params.id);
  if (!opportunity) notFound();

  const category = opportunity.category!;
  const [relatedProjects, catStats, categoryProjects] = await Promise.all([
    getRelatedProjects(opportunity.category_id, 10),
    getCategoryProjectStats(opportunity.category_id),
    getProjectsByCategory(opportunity.category_id),
  ]);

  const breakdown = calculateGapScoreBreakdown({
    categorySlug: category.slug,
    totalProjects: catStats.total,
    activeProjects: catStats.active,
    totalTVL: catStats.tvl,
    isStrategic: category.is_strategic,
    strategicMultiplier: Number(category.strategic_multiplier) || 1,
    projectTVLs: categoryProjects.map((p) => Number(p.tvl_usd) || 0),
    projectGithubStats: categoryProjects.map((p) => ({
      stars: p.github_stars || 0,
      forks: p.github_forks || 0,
      openIssues: p.github_open_issues || 0,
      lastCommit: p.last_github_commit,
      isActive: p.is_active,
    })),
  });

  return (
    <div className="min-h-screen">
      <Container size="lg" className="py-8">
        <OpportunityDetail
          opportunity={opportunity}
          relatedProjects={relatedProjects}
          category={category}
          breakdown={breakdown}
        />
      </Container>
    </div>
  );
}
