export const dynamic = 'force-dynamic';

import { Container } from '@/components/ui';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { getCategoriesWithStats } from '@/lib/queries';

export const metadata = {
  title: 'NEAR Ecosystem Categories — Gap Analysis & Opportunities | Voidspace',
  description: 'Browse 20+ NEAR Protocol categories with real-time gap scoring. Find where the ecosystem needs builders — DeFi, NFTs, DAOs, AI, gaming, and more.',
  keywords: ['NEAR Protocol', 'ecosystem categories', 'gap analysis', 'DeFi', 'NFTs', 'DAOs', 'blockchain opportunities'],
  alternates: { canonical: 'https://voidspace.io/categories' },
  openGraph: {
    title: 'NEAR Ecosystem Categories — Gap Analysis & Opportunities | Voidspace',
    description: 'Browse 20+ NEAR Protocol categories with real-time gap scoring. Find where the ecosystem needs builders.',
    url: 'https://voidspace.io/categories',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEAR Ecosystem Categories — Gap Analysis | Voidspace',
    description: 'Browse 20+ categories with real-time gap scoring. Find where NEAR needs builders.',
    creator: '@VoidSpaceNear',
  },
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithStats();

  const avgGapScore = categories.length > 0
    ? Math.round(categories.reduce((s, c) => s + c.gapScore, 0) / categories.length)
    : 0;
  const strategicCount = categories.filter((c) => c.is_strategic).length;

  return (
    <div className="min-h-screen">
      {/* Page Banner */}
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
          <GradientText as="h1" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Ecosystem Categories
          </GradientText>
          <p className="text-sm sm:text-base text-text-secondary mt-3 max-w-lg mx-auto px-4 sm:px-0">
            Browse the NEAR ecosystem by category. Green bars indicate deep voids with opportunity.
          </p>

          {/* Summary Stats */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 mt-6 px-4 sm:px-0">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-text-primary font-mono">{categories.length}</p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Categories</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold font-mono" style={{
                color: avgGapScore >= 67 ? '#00EC97' : avgGapScore >= 34 ? '#FFA502' : '#FF4757',
              }}>{avgGapScore}</p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-mono mt-1">Avg Void Score</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-near-green/30 to-transparent" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-near-green font-mono">{strategicCount}</p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted font-mono mt-1">NEAR Priority</p>
            </div>
          </div>
        </Container>
      </section>

      <Container size="xl" className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <section>
            <SectionHeader title="All Categories" count={categories.length} badge="LIVE" />
            <CategoryGrid categories={categories} />
          </section>
        </ScrollReveal>
      </Container>
    </div>
  );
}
