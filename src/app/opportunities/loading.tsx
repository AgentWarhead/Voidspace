import { Skeleton } from '@/components/ui/Skeleton';

export default function OpportunitiesLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner skeleton */}
      <div className="py-8 sm:py-12 md:py-16 flex flex-col items-center gap-3 sm:gap-4 px-4 text-center">
        <Skeleton className="h-8 sm:h-10 w-48 sm:w-56 animate-pulse bg-white/5" />
        <Skeleton className="h-4 sm:h-5 w-64 sm:w-80 max-w-full animate-pulse bg-white/5" />
        <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-6">
          <Skeleton className="h-8 w-20 sm:w-24 animate-pulse bg-white/5" />
          <Skeleton className="h-8 w-20 sm:w-24 animate-pulse bg-white/5" />
          <Skeleton className="h-8 w-20 sm:w-24 animate-pulse bg-white/5" />
        </div>
      </div>

      {/* Filter bar + grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* Filter bar skeleton */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 p-3 sm:p-4 bg-surface rounded-xl border border-border">
          <Skeleton className="h-10 w-full sm:w-64 animate-pulse bg-white/5" />
          <Skeleton className="h-10 w-full sm:w-32 animate-pulse bg-white/5" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 animate-pulse bg-white/5" />
            <Skeleton className="h-10 w-28 animate-pulse bg-white/5" />
          </div>
        </div>
        
        {/* Opportunity cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3 p-3 sm:p-4 bg-surface rounded-xl border border-border">
              {/* Card header */}
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 animate-pulse bg-white/5" />
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse bg-white/5 rounded-full" />
              </div>
              
              {/* Card content */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full animate-pulse bg-white/5" />
                <Skeleton className="h-4 w-3/4 animate-pulse bg-white/5" />
              </div>
              
              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-5 sm:h-6 w-14 sm:w-16 animate-pulse bg-white/5 rounded-full" />
                <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 animate-pulse bg-white/5 rounded-full" />
              </div>
              
              {/* Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <Skeleton className="h-4 w-20 sm:w-24 animate-pulse bg-white/5" />
                <Skeleton className="h-4 w-12 sm:w-16 animate-pulse bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
