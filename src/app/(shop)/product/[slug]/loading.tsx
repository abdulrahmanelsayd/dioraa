export default function ProductLoading() {
  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-6 sm:py-8 md:py-16 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
        {/* Gallery Skeleton */}
        <div className="flex flex-col-reverse md:flex-row gap-2 sm:gap-3 md:gap-4">
          <div className="flex md:flex-col gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-16 h-20 sm:w-18 sm:h-22 md:w-20 md:h-24 rounded-lg md:rounded-luxury bg-[#FCE4EC]/20 animate-pulse flex-shrink-0" />
            ))}
          </div>
          <div className="flex-1 aspect-[3/4] sm:aspect-[4/5] rounded-lg md:rounded-luxury bg-[#FCE4EC]/20 animate-pulse" />
        </div>
        {/* Info Skeleton */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="h-2.5 sm:h-3 bg-[#FCE4EC]/30 rounded w-16 sm:w-20 animate-pulse" />
          <div className="h-8 sm:h-10 bg-[#FCE4EC]/30 rounded w-3/4 animate-pulse" />
          <div className="h-3 sm:h-4 bg-[#FCE4EC]/30 rounded w-28 sm:w-32 animate-pulse" />
          <div className="h-6 sm:h-8 bg-[#FCE4EC]/30 rounded w-20 sm:w-24 animate-pulse" />
          <div className="space-y-1.5 sm:space-y-2">
            <div className="h-2.5 sm:h-3 bg-[#FCE4EC]/20 rounded w-full animate-pulse" />
            <div className="h-2.5 sm:h-3 bg-[#FCE4EC]/20 rounded w-5/6 animate-pulse" />
            <div className="h-2.5 sm:h-3 bg-[#FCE4EC]/20 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-px bg-[#E8C4CE]" />
          <div className="h-11 sm:h-12 bg-[#FCE4EC]/30 rounded-full w-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
