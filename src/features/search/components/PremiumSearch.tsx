"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, Filter, ChevronRight, TrendingUp, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { searchProducts, getAllIngredients, getAllSkinTypes, getAllSkinConcerns } from "@/lib/api";
import type { Product, ProductCategory } from "@/lib/api";
import { formatPrice } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

interface PremiumSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES = ["Rose Serum", "Vitamin C", "Night Cream", "Hair Mask"];
const TRENDING = ["Retinol", "Hyaluronic Acid", "Niacinamide"];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

export function PremiumSearch({ isOpen, onClose }: PremiumSearchProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300); // 300ms debounce
  
  const [activeFilters, setActiveFilters] = useState<{
    category?: ProductCategory;
    skinTypes: string[];
    concerns: string[];
    excludeIngredients: string[];
    priceRange?: [number, number];
  }>({ skinTypes: [], concerns: [], excludeIngredients: [] });
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search query with debounced value
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery, activeFilters],
    queryFn: () =>
      searchProducts(debouncedQuery, 1, 8).then((res) => ({
        ...res,
        data: res.data.filter((p) => {
          if (activeFilters.category && p.category !== activeFilters.category) return false;
          if (activeFilters.skinTypes.length > 0 && 
              !p.skinTypes?.some((st) => activeFilters.skinTypes.includes(st))) return false;
          if (activeFilters.concerns.length > 0 && 
              !p.concerns?.some((c) => activeFilters.concerns.includes(c))) return false;
          return true;
        }),
      })),
    enabled: debouncedQuery.length > 0 || activeFilters.skinTypes.length > 0 || activeFilters.concerns.length > 0,
  });

  // Filter options
  const { data: ingredients } = useQuery({
    queryKey: ["ingredients"],
    queryFn: getAllIngredients,
  });

  const { data: skinTypes } = useQuery({
    queryKey: ["skinTypes"],
    queryFn: getAllSkinTypes,
  });

  const { data: concerns } = useQuery({
    queryKey: ["concerns"],
    queryFn: getAllSkinConcerns,
  });

  const hasQuery = debouncedQuery.length > 0;
  const hasFilters = activeFilters.skinTypes.length > 0 || activeFilters.concerns.length > 0;
  const showResults = hasQuery || hasFilters;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-brand-ink/40 backdrop-blur-sm"
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-rose/10">
              {/* Search Input Header */}
              <div className="flex items-center gap-4 p-6 border-b border-brand-rose/10">
                <Search className="w-6 h-6 text-brand-ink/40" strokeWidth={1.5} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, ingredients, concerns..."
                  className="flex-1 text-xl font-light text-brand-ink placeholder:text-brand-ink/30 focus:outline-none bg-transparent"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-2 rounded-full hover:bg-brand-blush/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-brand-ink/40" />
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    showFilters || hasFilters
                      ? "bg-brand-ink text-white"
                      : "bg-brand-blush/30 text-brand-ink hover:bg-brand-blush/50"
                  )}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasFilters && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-brand-rose text-white text-xs flex items-center justify-center">
                      {activeFilters.skinTypes.length + activeFilters.concerns.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-brand-rose/10 bg-brand-offWhite/50"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Skin Types */}
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-brand-ink/50 mb-3 font-medium">
                          Skin Type
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skinTypes?.map((type) => (
                            <button
                              key={type}
                              onClick={() =>
                                setActiveFilters((prev) => ({
                                  ...prev,
                                  skinTypes: prev.skinTypes.includes(type)
                                    ? prev.skinTypes.filter((t) => t !== type)
                                    : [...prev.skinTypes, type],
                                }))
                              }
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs transition-all",
                                activeFilters.skinTypes.includes(type)
                                  ? "bg-brand-ink text-white"
                                  : "bg-white text-brand-ink/70 hover:bg-brand-blush/30 border border-brand-rose/20"
                              )}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Concerns */}
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-brand-ink/50 mb-3 font-medium">
                          Concerns
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {concerns?.slice(0, 8).map((concern) => (
                            <button
                              key={concern}
                              onClick={() =>
                                setActiveFilters((prev) => ({
                                  ...prev,
                                  concerns: prev.concerns.includes(concern)
                                    ? prev.concerns.filter((c) => c !== concern)
                                    : [...prev.concerns, concern],
                                }))
                              }
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs transition-all",
                                activeFilters.concerns.includes(concern)
                                  ? "bg-brand-rose text-white"
                                  : "bg-white text-brand-ink/70 hover:bg-brand-blush/30 border border-brand-rose/20"
                              )}
                            >
                              {concern}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Categories */}
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-brand-ink/50 mb-3 font-medium">
                          Category
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {["Skin Care", "Hair Care", "Makeup", "Body Care", "Fragrance"].map((cat) => (
                            <button
                              key={cat}
                              onClick={() =>
                                setActiveFilters((prev) => ({
                                  ...prev,
                                  category: prev.category === cat ? undefined : (cat as ProductCategory),
                                }))
                              }
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs transition-all",
                                activeFilters.category === cat
                                  ? "bg-brand-ink text-white"
                                  : "bg-white text-brand-ink/70 hover:bg-brand-blush/30 border border-brand-rose/20"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content Area */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!showResults ? (
                  /* Default State - Recent & Trending */
                  <div className="p-6 grid grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-2 text-brand-ink/50 mb-4">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-widest font-medium">Recent Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {RECENT_SEARCHES.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-4 py-2 rounded-full bg-brand-offWhite text-brand-ink/70 text-sm hover:bg-brand-blush/30 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-brand-rose mb-4">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-widest font-medium">Trending</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-4 py-2 rounded-full bg-brand-rose/10 text-brand-rose text-sm hover:bg-brand-rose/20 transition-colors"
                          >
                            <Sparkles className="w-3 h-3 inline mr-1" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : isLoading ? (
                  /* Loading State */
                  <div className="p-12 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-brand-rose/30 border-t-brand-rose rounded-full animate-spin" />
                  </div>
                ) : searchResults?.data.length === 0 ? (
                  /* Empty State */
                  <div className="p-12 text-center">
                    <p className="text-brand-ink/50 font-light">No products found</p>
                    <p className="text-sm text-brand-ink/30 mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  /* Results */
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <span className="text-xs uppercase tracking-widest text-brand-ink/50">
                        {searchResults?.total} Results
                      </span>
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="text-xs text-brand-rose hover:text-brand-deepRose flex items-center gap-1"
                      >
                        View All
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {searchResults?.data.map((product) => (
                        <SearchResultItem key={product.id} product={product} onClose={onClose} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-brand-offWhite/50 border-t border-brand-rose/10 text-center">
                <p className="text-xs text-brand-ink/40">
                  Press <kbd className="px-2 py-0.5 bg-white rounded text-brand-ink/60">ESC</kbd> to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SearchResultItem({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onClose}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-brand-blush/20 transition-colors group"
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-blush/30 flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-ink truncate group-hover:text-brand-rose transition-colors">
          {product.name}
        </p>
        <p className="text-xs text-brand-ink/50 mt-0.5">{product.category}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-brand-ink/40 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-brand-ink/20 group-hover:text-brand-rose transition-colors" />
    </Link>
  );
}
