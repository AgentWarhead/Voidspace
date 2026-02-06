import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="py-16 sm:py-24 flex flex-col items-center gap-4 px-4">
        <Skeleton className="h-12 w-80 animate-pulse bg-white/5" />
        <Skeleton className="h-6 w-96 max-w-full animate-pulse bg-white/5" />
        <div className="flex gap-6 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-8 w-16 animate-pulse bg-white/5 mx-auto" />
              <Skeleton className="h-4 w-20 animate-pulse bg-white/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-6">
            <Skeleton className="h-8 w-64 animate-pulse bg-white/5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((card) => (
                <div key={card} className="space-y-4">
                  <Skeleton className="h-48 w-full animate-pulse bg-white/5 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4 animate-pulse bg-white/5" />
                    <Skeleton className="h-4 w-full animate-pulse bg-white/5" />
                    <Skeleton className="h-4 w-2/3 animate-pulse bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
