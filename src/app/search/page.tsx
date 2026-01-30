export const dynamic = 'force-dynamic';

import { Search } from 'lucide-react';
import { Container, Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { ScanLine } from '@/components/effects/ScanLine';
import { SearchResults } from '@/components/search/SearchResults';
import { searchAll } from '@/lib/queries';

interface Props {
  searchParams: { q?: string };
}

export const metadata = {
  title: 'Search — Voidspace',
  description: 'Search across projects, voids, and categories in the NEAR ecosystem.',
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
          <GradientText as="h1" className="text-4xl sm:text-5xl font-bold tracking-tight">
            Search
          </GradientText>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            Search across projects, voids, and categories in the NEAR ecosystem.
          </p>

          {/* Search Form */}
          <form action="/search" method="GET" className="mt-6 max-w-xl mx-auto">
            <Card variant="glass" padding="none" className="relative overflow-hidden">
              <ScanLine />
              <div className="relative z-10 flex items-center">
                <Search className="w-5 h-5 text-text-muted ml-4 shrink-0" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search projects, voids, categories..."
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-4 py-3 text-sm outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-3 text-sm font-medium text-near-green hover:bg-near-green/10 transition-colors"
                >
                  Search
                </button>
              </div>
            </Card>
          </form>

          {query && (
            <p className="text-sm text-text-muted mt-4 font-mono">
              {totalResults} result{totalResults !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          )}
        </Container>
      </section>

      <Container size="xl" className="py-8">
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
