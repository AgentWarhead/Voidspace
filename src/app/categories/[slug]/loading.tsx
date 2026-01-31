export default function CategoryDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="py-10 sm:py-14 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
          <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/5 rounded animate-pulse" />
          <div className="flex gap-4 mt-4">
            <div className="h-16 w-24 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-16 w-24 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-16 w-24 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats + project list skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>

        <div className="space-y-3">
          <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
