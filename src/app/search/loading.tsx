export default function SearchLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="py-12 sm:py-16 flex flex-col items-center gap-4 px-4">
        <div className="h-10 w-40 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-4 w-72 max-w-full bg-white/5 rounded animate-pulse" />
        <div className="h-12 w-full max-w-xl bg-white/5 rounded-xl animate-pulse mt-4" />
      </div>

      {/* Results skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
