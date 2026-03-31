"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Error is available for error reporting service integration (e.g., Sentry)
    // Error digest available: error.digest
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 bg-brand-offWhite">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md text-center"
      >
        {/* Decorative Element */}
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-brand-blush/50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-brand-deepRose"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Label */}
        <span className="label-luxury mb-4 block">Something Went Wrong</span>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl text-brand-ink mb-4 tracking-tight">
          We Apologize
        </h1>

        {/* Description */}
        <p className="font-sans text-brand-slate text-sm leading-relaxed mb-8">
          An unexpected error has occurred. Our team has been notified and is working to resolve this.
          Please try again or return to our homepage to continue shopping.
        </p>

        {/* Error Code (for support reference) */}
        {error.digest && (
          <p className="font-mono text-[10px] text-brand-mist mb-6 uppercase tracking-wider">
            Error Reference: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-brand-ink text-brand-offWhite font-sans text-sm font-medium uppercase tracking-widest hover:bg-brand-ink/90 transition-all duration-300 active:scale-[0.97]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-brand-ink/20 text-brand-ink font-sans text-sm font-medium uppercase tracking-widest hover:bg-brand-ink hover:text-brand-offWhite transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
