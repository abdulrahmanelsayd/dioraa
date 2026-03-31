"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  description?: string;
  label?: string;
}

export function PageHero({ title, description, label }: PageHeroProps) {
  return (
    <section className="relative w-full bg-brand-blush pt-24 pb-12 md:pt-28 md:pb-16 flex flex-col items-center justify-center rounded-b-[24px] md:rounded-b-[40px] shadow-sm z-10 overflow-hidden">
      {/* Subtle Light Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl mx-auto px-5 text-center flex flex-col items-center"
      >
        {label && (
          <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-brand-ink/50 mb-3">
            {label}
          </span>
        )}

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-ink mb-3 tracking-tight">
          {title}
        </h1>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "60px", opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="md:w-[80px] h-[2px] bg-brand-deepRose rounded-full mb-4"
        />

        {description && (
          <p className="text-brand-ink/70 max-w-md font-serif text-xs md:text-sm leading-relaxed hidden sm:block">
            {description}
          </p>
        )}
      </motion.div>
    </section>
  );
}
