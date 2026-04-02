import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 bg-brand-offWhite">
      <span className="label-luxury mb-6">Lost In Luxury</span>
      <h1 className="heading-display text-6xl md:text-8xl text-brand-ink mb-6">404</h1>
      <p className="font-sans text-brand-slate text-sm md:text-base text-center max-w-md mb-10 leading-relaxed">
        The page you&apos;re looking for has been moved, renamed, or simply doesn&apos;t exist.
        Let us guide you back to something beautiful.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/shop"
          className="group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-brand-ink text-brand-offWhite font-sans text-sm font-medium uppercase tracking-widest hover:bg-brand-ink/90 transition-all duration-300 active:scale-[0.97]"
        >
          Continue Shopping
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-brand-ink/20 text-brand-ink font-sans text-sm font-medium uppercase tracking-widest hover:bg-brand-ink hover:text-brand-offWhite transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
