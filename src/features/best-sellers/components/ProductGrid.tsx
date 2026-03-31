"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { staggerContainer } from "@/shared/theme/animations";

export const CATEGORIES = ["All", "Skin Care", "Hair Care"];

interface ProductGridProps {
  showViewAll?: boolean;
  hideHeader?: boolean;
  externalCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function ProductGrid({ 
  showViewAll = true, 
  hideHeader = false,
  externalCategory,
  onCategoryChange
}: ProductGridProps) {
  const [internalCategory, setInternalCategory] = useState("All");

  const activeCategory = externalCategory !== undefined ? externalCategory : internalCategory;
  const setActiveCategory = onCategoryChange !== undefined ? onCategoryChange : setInternalCategory;

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", activeCategory],
    queryFn: () => getProducts({ 
      category: activeCategory as "Skin Care" | "Hair Care" | "All" 
    }),
  });

  return (
    <section id="bestsellers" className="section-padding py-24 md:py-32 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {!hideHeader && (
          <>
            <span className="label-luxury mb-4">Curated Collection</span>
            <h2 className="heading-display text-4xl md:text-5xl text-brand-ink mb-12">
              Best Sellers
            </h2>

            {/* Filter Chips */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-8 py-3 rounded-full text-xs font-sans tracking-[0.15em] uppercase transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-brand-ink text-brand-offWhite"
                      : "bg-transparent border border-brand-rose/30 text-brand-ink hover:border-brand-ink"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Product Grid | Loading state vs Data */}
        <div className="w-full min-h-[600px] relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-[4/5] bg-brand-blush/20 rounded-md mb-4" />
                    <div className="h-4 bg-brand-blush/30 rounded w-1/2 mx-auto mb-2" />
                    <div className="h-6 bg-brand-blush/30 rounded w-3/4 mx-auto mb-3" />
                    <div className="h-4 bg-brand-blush/30 rounded w-1/3 mx-auto" />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory} // Forces framer motion to replay transition on category change
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full"
              >
                {products?.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { 
                        opacity: 1, 
                        y: 0, 
                        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
                      }
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        {showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-24 flex justify-center w-full"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-12 py-4 bg-brand-ink text-brand-offWhite hover:bg-brand-rose hover:text-white font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Discover Full Collection
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
