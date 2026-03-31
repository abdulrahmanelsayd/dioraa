"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ErrorProps) {
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
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Label */}
        <span className="label-luxury mb-3 block">Product Not Available</span>

        {/* Title */}
        <h1 className="font-serif text-2xl md:text-3xl text-brand-ink mb-3 tracking-tight">
          Unable to Load Product
        </h1>

        {/* Description */}
        <p className="font-sans text-brand-slate text-sm leading-relaxed mb-6">
          This product may have been removed or is temporarily unavailable.
          Please browse our collection for similar luxury products.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-brand-ink text-brand-offWhite font-sans text-xs font-medium uppercase tracking-widest hover:bg-brand-ink/90 transition-all duration-300"
          >
            Try Again
          </button>
          <Link
            href="/#bestsellers"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-brand-ink/20 text-brand-ink font-sans text-xs font-medium uppercase tracking-widest hover:bg-brand-ink hover:text-brand-offWhite transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
