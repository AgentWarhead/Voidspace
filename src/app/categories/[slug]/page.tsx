export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { Container } from '@/components/ui';
import { CategoryHeader } from '@/components/dashboard/CategoryHeader';
import { CategoryStats } from '@/components/dashboard/CategoryStats';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GridPattern } from '@/components/effects/GridPattern';
import {
  getCategoryBySlug,
  getProjectsByCategory,
  getCategoryProjectStats,
} from '@/lib/queries';
import { calculateGapScore } from '@/lib/gap-score';
import { CategoryTokenStats } from '@/components/categories/CategoryTokenStats';

interface Props {
  params: { slug: string };
  searchParams: { sort?: string; activeOnly?: string };
}

export async function generateMetadata({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'Category Not Found — Voidspace' };

  return {
    title: `${category.name} on NEAR Protocol — Projects, Gaps & Opportunities | Voidspace`,
    description: category.description || `Explore ${category.name} in the NEAR ecosystem. Track active projects, identify gaps, and find what's missing.`,
    alternates: { canonical: `https://voidspace.io/categories/${params.slug}` },
    openGraph: {
      title: `${category.name} on NEAR Protocol — Projects & Gaps | Voidspace`,
      description: category.description || `Explore ${category.name} projects and gaps in the NEAR ecosystem.`,
      url: `https://voidspace.io/categories/${params.slug}`,
      siteName: 'Voidspace',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} — NEAR Ecosystem | Voidspace`,
      description: category.description || `${category.name} projects and opportunities on NEAR Protocol.`,
      creator: '@VoidSpaceNear',
    },
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
    isStrategic: category.is_strategic,
    strategicMultiplier: Number(category.strategic_multiplier) || 1,
    projectTVLs: projects.map((p) => Number(p.tvl_usd) || 0),
    projectGithubStats: projects.map((p) => ({
      stars: p.github_stars || 0,
      forks: p.github_forks || 0,
      openIssues: p.github_open_issues || 0,
      lastCommit: p.last_github_commit,
      isActive: p.is_active,
    })),
  });

  // Compute additional stats from project data
  const totalStars = projects.reduce((s, p) => s + (p.github_stars || 0), 0);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentlyActive = projects.filter(
    (p) => p.last_github_commit && new Date(p.last_github_commit) > thirtyDaysAgo
  ).length;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-10 sm:py-14">
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
        <Container size="xl" className="relative z-10">
          <CategoryHeader
            category={category}
            gapScore={gapScore}
            projectCount={stats.total}
          />
        </Container>
      </section>

      <Container size="xl" className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <ScrollReveal>
          <section>
            <CategoryTokenStats
              categoryName={category.name}
              categorySlug={category.slug}
            />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section>
            <SectionHeader title="Category Statistics" badge="AI ANALYZED" />
            <CategoryStats
              totalProjects={stats.total}
              activeProjects={stats.active}
              totalTVL={stats.tvl}
              gapScore={gapScore}
              totalStars={totalStars}
              recentlyActive={recentlyActive}
            />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section>
            <SectionHeader title="Projects" count={stats.total} />
            <ProjectList projects={projects} initialSort={searchParams.sort || 'tvl'} />
          </section>
        </ScrollReveal>
      </Container>
    </div>
  );
}
