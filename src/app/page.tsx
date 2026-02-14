import { Container } from '@/components/ui';
import { HeroSection } from '@/components/hero/HeroSection';
import { PriorityVoids } from '@/components/dashboard/PriorityVoids';
import { VoidsForEveryBuilder } from '@/components/dashboard/VoidsForEveryBuilder';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { MissionControlBar } from '@/components/landing/MissionControlBar';
import { BuildPlansSection } from '@/components/landing/BuildPlansSection';
import { VoidBubblesSection } from '@/components/landing/VoidBubblesSection';
import { IntelligenceToolsSection } from '@/components/landing/IntelligenceToolsSection';
import { SanctumSection } from '@/components/landing/SanctumSection';
import { LearnSection } from '@/components/landing/LearnSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { DataSourcesSection } from '@/components/landing/DataSourcesSection';
import { BottomCtaSection } from '@/components/landing/BottomCtaSection';
import {
  getEcosystemStats,
  getCategoriesWithStats,
  getTopOpportunities,
} from '@/lib/queries';

export const revalidate = 300; // ISR: regenerate every 5 minutes

export default async function DashboardPage() {
  let stats: Awaited<ReturnType<typeof getEcosystemStats>>;
  let categories: Awaited<ReturnType<typeof getCategoriesWithStats>>;
  let opportunities: Awaited<ReturnType<typeof getTopOpportunities>>;

  try {
    [stats, categories, opportunities] = await Promise.all([
      getEcosystemStats(),
      getCategoriesWithStats(),
      getTopOpportunities(100),
    ]);
  } catch (error) {
    console.error('[DashboardPage] Failed to fetch Supabase data:', error);
    stats = {
      totalProjects: 0,
      activeProjects: 0,
      totalTVL: 0,
      categoryCount: 0,
      lastSyncAt: null,
    };
    categories = [];
    opportunities = [];
  }

  return (
    <div className="min-h-screen">
      {/* SECTION 1: Hero */}
      <HeroSection stats={stats} totalOpportunities={opportunities.length} />

      {/* SECTION 2: Mission Control Stats Bar */}
      <MissionControlBar />

      <Container size="xl" className="py-8 space-y-16">
        {/* SECTION 3: Priority Voids */}
        <section>
          <SectionHeader title="Here's what NEAR needs" badge="NEARCON TRACKS" />
          <div className="mb-8">
            <p className="text-text-secondary max-w-3xl mx-auto text-center">
              Explore the highest-impact voids aligned with Nearcon Innovation Sandbox prize tracks. Each track maps to real ecosystem gaps where builders can win.
            </p>
          </div>
          <PriorityVoids categories={categories} opportunities={opportunities} />
        </section>

        {/* SECTION 3.5: Pick Your Path */}
        <section>
          <SectionHeader title="Pick your path" badge="FOR EVERY BUILDER" />
          <VoidsForEveryBuilder opportunities={opportunities} />
        </section>

        {/* SECTION 4: Build Plans */}
        <ScrollReveal delay={0.08}>
          <BuildPlansSection />
        </ScrollReveal>

        {/* SECTION 5: Void Bubbles */}
        <ScrollReveal delay={0.1}>
          <VoidBubblesSection />
        </ScrollReveal>

        {/* SECTION 6: Intelligence Tools */}
        <ScrollReveal delay={0.12}>
          <IntelligenceToolsSection />
        </ScrollReveal>

        {/* SECTION 7: The Sanctum */}
        <ScrollReveal delay={0.13}>
          <SanctumSection />
        </ScrollReveal>

        {/* SECTION 8: Learn NEAR */}
        <ScrollReveal delay={0.14}>
          <LearnSection />
        </ScrollReveal>

        {/* SECTION 8.5: Social Proof */}
        <ScrollReveal delay={0.15}>
          <SocialProofSection />
        </ScrollReveal>

        {/* SECTION 8.6: Data Sources */}
        <ScrollReveal delay={0.155}>
          <DataSourcesSection />
        </ScrollReveal>

        {/* SECTION 9: Bottom CTA */}
        <ScrollReveal delay={0.16}>
          <BottomCtaSection />
        </ScrollReveal>
      </Container>
    </div>
  );
}
