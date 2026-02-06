import { Skeleton } from '@/components/ui/Skeleton';

export default function OpportunitiesLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner skeleton */}
      <div className="py-12 sm:py-16 flex flex-col items-center gap-4 px-4 text-center">
        <Skeleton className="h-10 w-56 animate-pulse bg-white/5" />
        <Skeleton className="h-5 w-80 max-w-full animate-pulse bg-white/5" />
        <div className="flex gap-6 mt-6">
          <Skeleton className="h-8 w-24 animate-pulse bg-white/5" />
          <Skeleton className="h-8 w-24 animate-pulse bg-white/5" />
          <Skeleton className="h-8 w-24 animate-pulse bg-white/5" />
        </div>
      </div>

      {/* Filter bar + grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Filter bar skeleton */}
        <div className="flex flex-wrap gap-4 p-4 bg-surface rounded-xl border border-border">
          <Skeleton className="h-10 w-64 animate-pulse bg-white/5" />
          <Skeleton className="h-10 w-32 animate-pulse bg-white/5" />
          <Skeleton className="h-10 w-32 animate-pulse bg-white/5" />
          <Skeleton className="h-10 w-28 animate-pulse bg-white/5" />
        </div>
        
        {/* Opportunity cards grid skeleton - 3x4 = 12 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4 bg-surface rounded-xl border border-border">
              {/* Card header */}
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-32 animate-pulse bg-white/5" />
                <Skeleton className="h-6 w-6 animate-pulse bg-white/5 rounded-full" />
              </div>
              
              {/* Card content */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full animate-pulse bg-white/5" />
                <Skeleton className="h-4 w-3/4 animate-pulse bg-white/5" />
              </div>
              
              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-6 w-16 animate-pulse bg-white/5 rounded-full" />
                <Skeleton className="h-6 w-20 animate-pulse bg-white/5 rounded-full" />
              </div>
              
              {/* Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <Skeleton className="h-4 w-24 animate-pulse bg-white/5" />
                <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
