export default function ProductLoading() {
  return (
    <section className="px-6 md:px-12 lg:px-20 xl:px-28 py-8 md:py-16 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Gallery Skeleton */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-16 h-20 md:w-20 md:h-24 rounded-md bg-[#FCE4EC]/20 animate-pulse" />
            ))}
          </div>
          <div className="flex-1 aspect-[4/5] rounded-md bg-[#FCE4EC]/20 animate-pulse" />
        </div>
        {/* Info Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="h-3 bg-[#FCE4EC]/30 rounded w-20 animate-pulse" />
          <div className="h-10 bg-[#FCE4EC]/30 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-[#FCE4EC]/30 rounded w-32 animate-pulse" />
          <div className="h-8 bg-[#FCE4EC]/30 rounded w-24 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 bg-[#FCE4EC]/20 rounded w-full animate-pulse" />
            <div className="h-3 bg-[#FCE4EC]/20 rounded w-5/6 animate-pulse" />
            <div className="h-3 bg-[#FCE4EC]/20 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-px bg-[#E8C4CE]" />
          <div className="h-12 bg-[#FCE4EC]/30 rounded-full w-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
