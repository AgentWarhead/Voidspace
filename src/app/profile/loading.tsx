import { Skeleton } from '@/components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile header skeleton */}
        <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-surface rounded-xl border border-border">
          <Skeleton className="h-20 w-20 animate-pulse bg-white/5 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-64 animate-pulse bg-white/5" />
            <Skeleton className="h-5 w-48 animate-pulse bg-white/5" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32 animate-pulse bg-white/5" />
              <Skeleton className="h-4 w-28 animate-pulse bg-white/5" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 animate-pulse bg-white/5" />
            <Skeleton className="h-10 w-10 animate-pulse bg-white/5 rounded-full" />
          </div>
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Applications', 'Saved', 'Completed', 'Success Rate'].map((label, i) => (
            <div key={i} className="p-4 bg-surface rounded-xl border border-border space-y-2">
              <Skeleton className="h-8 w-16 animate-pulse bg-white/5" />
              <Skeleton className="h-4 w-20 animate-pulse bg-white/5" />
            </div>
          ))}
        </div>

        {/* Content sections skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Saved opportunities section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 animate-pulse bg-white/5" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-surface rounded-xl border border-border space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-48 animate-pulse bg-white/5" />
                    <Skeleton className="h-6 w-6 animate-pulse bg-white/5 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full animate-pulse bg-white/5" />
                    <Skeleton className="h-4 w-2/3 animate-pulse bg-white/5" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 animate-pulse bg-white/5 rounded-full" />
                    <Skeleton className="h-6 w-20 animate-pulse bg-white/5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 animate-pulse bg-white/5" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 bg-surface rounded-lg border border-border flex items-center gap-3">
                  <Skeleton className="h-8 w-8 animate-pulse bg-white/5 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full animate-pulse bg-white/5" />
                    <Skeleton className="h-3 w-24 animate-pulse bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
