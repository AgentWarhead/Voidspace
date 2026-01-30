import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import type { Opportunity } from '@/types';

interface OpportunityListProps {
  opportunities: Opportunity[];
  total: number;
  page: number;
  pageSize: number;
  baseUrl?: string;
}

export function OpportunityList({
  opportunities,
  total,
  page,
  pageSize,
  baseUrl = '/opportunities',
}: OpportunityListProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No opportunities found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">
        {total} {total === 1 ? 'opportunity' : 'opportunities'} found
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          {page > 1 ? (
            <Link
              href={`${baseUrl}?page=${page - 1}`}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-muted cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </span>
          )}

          <span className="text-sm text-text-secondary">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={`${baseUrl}?page=${page + 1}`}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-muted cursor-not-allowed">
              Next
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
