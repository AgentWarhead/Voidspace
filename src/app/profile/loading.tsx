export default function ProfileLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile header skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-white/5 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>

        {/* Saved opportunities skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
