"use client";

import { motion } from "framer-motion";

const TRUST_BADGES = [
  { label: "Fast Shipping" },
  { label: "Premium Quality" },
  { label: "24/7 Support" },
  { label: "Easy Returns" },
];

export function TrustBadgesPill() {
  return (
    <div className="relative z-50 flex justify-center w-full -mt-6 -mb-6 md:-mt-8 md:-mb-8 px-4">
      <motion.ul
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        aria-label="Trust badges and guarantees"
        className="inline-flex flex-row items-center justify-center p-2 md:p-3 bg-white/80 backdrop-blur-2xl rounded-full border border-white shadow-xl shadow-brand-rose/20 gap-2 md:gap-3 list-none m-0"
      >
        {TRUST_BADGES.map((badge) => (
          <li
            key={badge.label}
            className="flex items-center gap-1.5 md:gap-2 font-sans text-[10px] md:text-xs px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-brand-offWhite/50 text-brand-ink/70"
          >
            <span aria-hidden="true" className="sr-only">• </span>
            <span className="font-medium whitespace-nowrap">{badge.label}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
