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

  const title = `${opportunity.title} — NEAR Ecosystem Gap | Voidspace`;
  const description =
    opportunity.description ||
    `An identified gap in the NEAR Protocol ecosystem — analyze the opportunity, review existing projects, and build what's missing.`;
  const canonical = `https://voidspace.io/opportunities/${params.id}`;

  const ogTitle = encodeURIComponent(opportunity.title?.slice(0, 80) || 'Ecosystem Void');
  const ogSubtitle = encodeURIComponent(
    opportunity.description?.slice(0, 100) ||
      'AI-detected gap in the NEAR Protocol ecosystem. Analyze the opportunity and build what\'s missing.'
  );
  const ogTag = opportunity.category?.name ? encodeURIComponent(opportunity.category.name) : '';
  const ogImageUrl = `https://voidspace.io/api/og?type=void&title=${ogTitle}&subtitle=${ogSubtitle}${ogTag ? `&tag=${ogTag}` : ''}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Voidspace',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${opportunity.title} — Voidspace`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opportunity.title} — NEAR Gap | Voidspace`,
      description: opportunity.description || `NEAR ecosystem gap — analyze and build what's missing.`,
      creator: '@VoidSpaceIO',
      images: [ogImageUrl],
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
