"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/shared/theme/animations";
import { Footer } from "@/features/footer/components/Footer";
import { PageHero } from "@/features/hero/components/PageHero";

export default function AboutPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full bg-brand-offWhite min-h-screen"
    >
      <PageHero
        title="Our Story"
        description="Where passion meets purity. Every product tells a story of dedication and timeless beauty."
      />

      {/* Content */}
      <div className="relative z-0 bg-brand-offWhite pt-12 md:pt-16 pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-brand-ink/60 font-light leading-relaxed mb-8">
            Born from a simple belief: that beauty should be pure, conscious, and timeless. 
            Every formula is meticulously developed with nature&apos;s finest ingredients.
          </p>
          <p className="text-brand-ink/60 font-light leading-relaxed">
            To create rituals that honor both your beauty and our planet.
          </p>
        </div>
      </div>
      
      <Footer />
    </motion.div>
  );
}
