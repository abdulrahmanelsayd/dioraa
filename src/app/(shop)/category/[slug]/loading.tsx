export default function CategoryLoading() {
  return (
    <section className="px-6 md:px-12 lg:px-20 xl:px-28 py-8 md:py-16 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-16">
          <div className="h-3 bg-[#FCE4EC]/30 rounded w-24 mb-4 animate-pulse" />
          <div className="h-12 bg-[#FCE4EC]/30 rounded w-48 mb-4 animate-pulse" />
          <div className="h-4 bg-[#FCE4EC]/20 rounded w-80 animate-pulse" />
        </div>
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-[4/5] bg-[#FCE4EC]/20 rounded-md mb-4" />
              <div className="h-3 bg-[#FCE4EC]/30 rounded w-1/2 mx-auto mb-2" />
              <div className="h-5 bg-[#FCE4EC]/30 rounded w-3/4 mx-auto mb-3" />
              <div className="h-3 bg-[#FCE4EC]/30 rounded w-1/3 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
