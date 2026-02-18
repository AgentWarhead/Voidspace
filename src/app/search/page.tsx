export const dynamic = 'force-dynamic';

import { Container } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchInput } from '@/components/search/SearchInput';
import { searchAll } from '@/lib/queries';

interface Props {
  searchParams: { q?: string };
}

export const metadata = {
  title: 'Search NEAR Ecosystem — Projects, Gaps & Categories | Voidspace',
  description: 'Search the NEAR Protocol ecosystem. Find projects, identify gaps, and explore categories across DeFi, NFTs, DAOs, gaming, and infrastructure.',
  alternates: { canonical: 'https://voidspace.io/search' },
  openGraph: {
    title: 'Search NEAR Ecosystem — Projects, Gaps & Categories | Voidspace',
    description: 'Search the NEAR Protocol ecosystem. Find projects, identify gaps, and explore categories.',
    url: 'https://voidspace.io/search',
    siteName: 'Voidspace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search NEAR Ecosystem | Voidspace',
    description: 'Find projects, gaps, and categories across the NEAR Protocol ecosystem.',
    creator: '@VoidSpaceIO',
  },
};

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() || '';

  const results = query ? await searchAll(query) : { projects: [], opportunities: [], categories: [] };
  const totalResults = results.projects.length + results.opportunities.length + results.categories.length;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
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
            Search the Void
          </GradientText>
          <p className="text-sm sm:text-base text-text-secondary mt-3 max-w-lg mx-auto px-4 sm:px-0">
            Projects, opportunities, and ecosystem gaps — all searchable, all scored. Find what others haven&apos;t built yet.
          </p>

          {/* Search Input with Client-Side Debounce */}
          <SearchInput initialQuery={query} />

          {query && (
            <p className="text-sm text-text-muted mt-4 font-mono">
              {totalResults} result{totalResults !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          )}
        </Container>
      </section>

      <Container size="xl" className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SearchResults
            projects={results.projects}
            opportunities={results.opportunities}
            categories={results.categories}
            query={query}
          />
        </ScrollReveal>
      </Container>
    </div>
  );
}
