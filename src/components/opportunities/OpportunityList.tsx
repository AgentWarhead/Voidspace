import Link from 'next/link';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { VoidEmptyState } from '@/components/ui/VoidEmptyState';
import type { Opportunity } from '@/types';

interface OpportunityListProps {
  opportunities: Opportunity[];
  total: number;
  page: number;
  pageSize: number;
  searchParams?: Record<string, string | undefined>;
  baseUrl?: string;
  onClearFilters?: () => void;
}

function buildPageUrl(targetPage: number, currentParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(currentParams).forEach(([key, value]) => {
    if (value && key !== 'page') params.set(key, value);
  });
  params.set('page', String(targetPage));
  return `/opportunities?${params.toString()}`;
}

export function OpportunityList({
  opportunities,
  total,
  page,
  pageSize,
  searchParams = {},
  baseUrl = '/opportunities',
  onClearFilters,
}: OpportunityListProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (opportunities.length === 0) {
    return (
      <VoidEmptyState
        icon={Filter}
        title="No voids match your filters"
        description="Try adjusting your filters or broadening your search to discover more ecosystem gaps."
        actionLabel={onClearFilters ? 'Clear Filters' : undefined}
        actionOnClick={onClearFilters}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stagger-animated grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opp, i) => (
          <div
            key={opp.id}
            className="animate-fade-in opacity-0"
            style={{
              animationDelay: `${i * 60}ms`,
              animationFillMode: 'forwards',
            }}
          >
            <OpportunityCard opportunity={opp} index={i} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          {page > 1 ? (
            <Link
              href={buildPageUrl(page - 1, searchParams)}
              className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-surface border border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-surface/30 border border-border/50 text-text-muted cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </span>
          )}

          <span className="text-xs text-text-secondary font-mono">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={buildPageUrl(page + 1, searchParams)}
              className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-surface border border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-surface/30 border border-border/50 text-text-muted cursor-not-allowed">
              Next
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
