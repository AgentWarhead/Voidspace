export default function OpportunityDetailLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
        {/* Back link */}
        <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />

        {/* Title area */}
        <div className="space-y-3">
          <div className="h-7 sm:h-8 w-full sm:w-3/4 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
        </div>

        {/* Score + meta */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="h-20 w-20 bg-white/5 rounded-xl animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
          </div>
        </div>

        {/* Signal bars */}
        <div className="space-y-3 mt-4 sm:mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
          ))}
        </div>

        {/* Related projects */}
        <div className="mt-6 sm:mt-8 space-y-3">
          <div className="h-6 w-40 bg-white/5 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 sm:h-24 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
