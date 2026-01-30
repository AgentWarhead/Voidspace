import { Suspense } from 'react';
import { Container } from '@/components/ui';
import { OpportunityFilters } from '@/components/opportunities/OpportunityFilters';
import { OpportunityList } from '@/components/opportunities/OpportunityList';
import { Skeleton } from '@/components/ui';
import { getOpportunities, getAllCategories } from '@/lib/queries';

interface Props {
  searchParams: {
    category?: string;
    difficulty?: string;
    sort?: string;
    minScore?: string;
    maxScore?: string;
    page?: string;
  };
}

export const metadata = {
  title: 'Opportunities — Voidspace',
  description: 'Discover gap opportunities in the NEAR ecosystem.',
};

export default async function OpportunitiesPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 12;

  const [{ data: opportunities, total }, categories] = await Promise.all([
    getOpportunities({
      category: searchParams.category,
      difficulty: searchParams.difficulty,
      sort: searchParams.sort || 'gap_score',
      minScore: searchParams.minScore ? parseInt(searchParams.minScore) : undefined,
      maxScore: searchParams.maxScore ? parseInt(searchParams.maxScore) : undefined,
      page,
      pageSize,
    }),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen">
      <Container size="xl" className="py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Opportunities</h1>
          <p className="text-text-secondary mt-1">
            Discover gaps in the NEAR ecosystem. Higher gap scores indicate greater opportunity.
          </p>
        </div>

        <Suspense fallback={<Skeleton variant="rectangular" height="40px" />}>
          <OpportunityFilters categories={categories} />
        </Suspense>

        <OpportunityList
          opportunities={opportunities}
          total={total}
          page={page}
          pageSize={pageSize}
        />
      </Container>
    </div>
  );
}
