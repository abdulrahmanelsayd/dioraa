"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoryError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Error available for error reporting service integration
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 bg-brand-offWhite py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md text-center"
      >
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-blush/50 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-brand-deepRose"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        </div>

        {/* Label */}
        <span className="label-luxury mb-3 block">Category Error</span>

        {/* Title */}
        <h1 className="font-serif text-2xl md:text-3xl text-brand-ink mb-3 tracking-tight">
          Unable to Load Collection
        </h1>

        {/* Description */}
        <p className="font-sans text-brand-slate text-sm leading-relaxed mb-6">
          We couldn&apos;t load this collection at the moment.
          Please try again or explore our other categories.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-brand-ink text-brand-offWhite font-sans text-xs font-medium uppercase tracking-widest hover:bg-brand-ink/90 transition-all duration-300"
          >
            Retry
          </button>
          <Link
            href="/category/skin-care"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-brand-ink/20 text-brand-ink font-sans text-xs font-medium uppercase tracking-widest hover:bg-brand-ink hover:text-brand-offWhite transition-all duration-300"
          >
            Browse Skin Care
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
