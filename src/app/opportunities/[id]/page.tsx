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
    title: `${opportunity.title} — NEAR Ecosystem Gap | Voidspace`,
    description: opportunity.description || `An identified gap in the NEAR Protocol ecosystem — analyze the opportunity, review existing projects, and build what's missing.`,
    alternates: { canonical: `https://voidspace.io/opportunities/${params.id}` },
    openGraph: {
      title: `${opportunity.title} — NEAR Ecosystem Gap | Voidspace`,
      description: opportunity.description || `Ecosystem gap identified on NEAR Protocol. Analyze the opportunity and build what's missing.`,
      url: `https://voidspace.io/opportunities/${params.id}`,
      siteName: 'Voidspace',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opportunity.title} — NEAR Gap | Voidspace`,
      description: opportunity.description || `NEAR ecosystem gap — analyze and build what's missing.`,
      creator: '@VoidSpaceNear',
    },
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
      <Container size="lg" className="py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        <OpportunityDetail
          opportunity={opportunity}
          relatedProjects={relatedProjects}
          category={category}
          breakdown={breakdown}
          competitors={categoryProjects}
        />
      </Container>
    </div>
  );
}
