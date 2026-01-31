export default function OpportunitiesLoading() {
  return (
    <div className="min-h-screen">
      {/* Banner skeleton */}
      <div className="py-12 sm:py-16 flex flex-col items-center gap-4 px-4">
        <div className="h-10 w-56 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-4 w-80 max-w-full bg-white/5 rounded animate-pulse" />
        <div className="flex gap-8 mt-4">
          <div className="h-8 w-20 bg-white/5 rounded animate-pulse" />
          <div className="h-8 w-20 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Filters + list skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
