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
      <Link
        href="/"
        className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-brand-ink text-brand-offWhite font-sans text-sm font-medium uppercase tracking-widest hover:bg-brand-ink/90 transition-all duration-300 active:scale-[0.97]"
      >
        Return Home
      </Link>
    </div>
  );
}
