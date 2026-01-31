export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="py-16 sm:py-24 flex flex-col items-center gap-4 px-4">
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-white/5 rounded animate-pulse" />
        <div className="flex gap-6 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-8 w-16 bg-white/5 rounded animate-pulse mx-auto" />
              <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-4">
            <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((card) => (
                <div key={card} className="h-40 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
