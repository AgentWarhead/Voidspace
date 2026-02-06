import { Skeleton } from '@/components/ui/Skeleton';

export default function LearnLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner skeleton */}
      <div className="py-16 sm:py-24 flex flex-col items-center gap-4 px-4 text-center">
        <Skeleton className="h-12 w-72 animate-pulse bg-white/5" />
        <Skeleton className="h-6 w-96 max-w-full animate-pulse bg-white/5" />
        <div className="flex gap-4 mt-6">
          <Skeleton className="h-10 w-32 animate-pulse bg-white/5" />
          <Skeleton className="h-10 w-28 animate-pulse bg-white/5" />
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Featured section */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 animate-pulse bg-white/5" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 p-6 bg-surface rounded-xl border border-border">
                <Skeleton className="h-40 w-full animate-pulse bg-white/5 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full animate-pulse bg-white/5" />
                  <Skeleton className="h-4 w-3/4 animate-pulse bg-white/5" />
                  <Skeleton className="h-4 w-1/2 animate-pulse bg-white/5" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 animate-pulse bg-white/5 rounded-full" />
                    <Skeleton className="h-6 w-20 animate-pulse bg-white/5 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning paths section */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-56 animate-pulse bg-white/5" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 p-4 bg-surface rounded-xl border border-border">
                <Skeleton className="h-12 w-12 animate-pulse bg-white/5 rounded-lg" />
                <Skeleton className="h-5 w-full animate-pulse bg-white/5" />
                <Skeleton className="h-4 w-2/3 animate-pulse bg-white/5" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16 animate-pulse bg-white/5" />
                  <Skeleton className="h-6 w-16 animate-pulse bg-white/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories section */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-44 animate-pulse bg-white/5" />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="text-center space-y-3 p-4 bg-surface rounded-xl border border-border">
                <Skeleton className="h-16 w-16 animate-pulse bg-white/5 rounded-full mx-auto" />
                <Skeleton className="h-5 w-20 animate-pulse bg-white/5 mx-auto" />
                <Skeleton className="h-4 w-12 animate-pulse bg-white/5 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}