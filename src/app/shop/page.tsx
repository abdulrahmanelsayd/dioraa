"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/shared/theme/animations";
import { ProductGrid, CATEGORIES } from "@/features/best-sellers/components/ProductGrid";
import { Footer } from "@/features/footer/components/Footer";
import { PageHero } from "@/features/hero/components/PageHero";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full bg-brand-offWhite min-h-screen"
    >
      <PageHero
        title="Best Sellers"
        description="Explore our most loved and celebrated skincare essentials, crafted to reveal your purest, most radiant natural beauty."
      />

      {/* Overlapping Luxury Filter Menu Pill */}
      <div className="relative z-50 flex justify-center w-full -mt-7 md:-mt-9 px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="inline-flex flex-row items-center justify-center p-1.5 md:p-2 bg-white/80 backdrop-blur-2xl rounded-full border border-white shadow-xl shadow-brand-rose/20"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative font-sans text-[9px] md:text-[11px] tracking-[0.2em] uppercase px-5 md:px-8 py-3 md:py-3.5 rounded-full font-semibold transition-colors text-center z-10 ${
                  isActive ? "text-brand-offWhite" : "text-brand-ink/60 hover:text-brand-ink"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="shopActiveFilter"
                    className="absolute inset-0 bg-brand-ink rounded-full -z-10 shadow-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Product Grid Layout */}
      <div className="relative z-0 bg-brand-offWhite pt-12 md:pt-16 pb-16">
        <ProductGrid 
          showViewAll={false} 
          hideHeader={true} 
          externalCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>
      
      <Footer />
    </motion.div>
  );
}
