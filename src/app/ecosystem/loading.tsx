import { Skeleton } from '@/components/ui/Skeleton';

export default function EcosystemLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner skeleton */}
      <div className="py-16 sm:py-24 flex flex-col items-center gap-6 px-4 text-center">
        <Skeleton className="h-12 w-80 animate-pulse bg-white/5" />
        <Skeleton className="h-6 w-96 max-w-full animate-pulse bg-white/5" />
        <div className="flex gap-6 mt-4">
          <Skeleton className="h-10 w-36 animate-pulse bg-white/5" />
          <Skeleton className="h-10 w-32 animate-pulse bg-white/5" />
        </div>
      </div>

      {/* Stats overview skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {['Total Projects', 'Active Developers', 'Total Funding', 'Network Activity'].map((label, i) => (
            <div key={i} className="text-center space-y-2 p-6 bg-surface rounded-xl border border-border">
              <Skeleton className="h-10 w-20 animate-pulse bg-white/5 mx-auto" />
              <Skeleton className="h-5 w-24 animate-pulse bg-white/5 mx-auto" />
              <Skeleton className="h-4 w-16 animate-pulse bg-white/5 mx-auto" />
            </div>
          ))}
        </div>

        {/* Charts section skeleton */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {/* Activity chart */}
          <div className="space-y-4 p-6 bg-surface rounded-xl border border-border">
            <Skeleton className="h-6 w-40 animate-pulse bg-white/5" />
            <Skeleton className="h-64 w-full animate-pulse bg-white/5 rounded-lg" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
              <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
              <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
            </div>
          </div>

          {/* Distribution chart */}
          <div className="space-y-4 p-6 bg-surface rounded-xl border border-border">
            <Skeleton className="h-6 w-48 animate-pulse bg-white/5" />
            <div className="flex items-center justify-center">
              <Skeleton className="h-48 w-48 animate-pulse bg-white/5 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 animate-pulse bg-white/5 rounded-full" />
                  <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured projects section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48 animate-pulse bg-white/5" />
            <Skeleton className="h-10 w-24 animate-pulse bg-white/5" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4 p-6 bg-surface rounded-xl border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 animate-pulse bg-white/5 rounded-lg" />
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-32 animate-pulse bg-white/5" />
                      <Skeleton className="h-4 w-24 animate-pulse bg-white/5" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-6 animate-pulse bg-white/5 rounded-full" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full animate-pulse bg-white/5" />
                  <Skeleton className="h-4 w-3/4 animate-pulse bg-white/5" />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Skeleton className="h-6 w-16 animate-pulse bg-white/5 rounded-full" />
                  <Skeleton className="h-6 w-20 animate-pulse bg-white/5 rounded-full" />
                  <Skeleton className="h-6 w-18 animate-pulse bg-white/5 rounded-full" />
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 animate-pulse bg-white/5 rounded-full" />
                    <Skeleton className="h-4 w-20 animate-pulse bg-white/5" />
                  </div>
                  <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}