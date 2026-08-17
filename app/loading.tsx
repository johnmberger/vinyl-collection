export default function Loading() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 h-12 w-64 animate-pulse rounded bg-surface" />
        <div className="mb-8 flex gap-3">
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-surface" />
          <div className="h-11 w-44 animate-pulse rounded-lg bg-surface" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-square animate-pulse rounded-xl bg-surface" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-surface" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
