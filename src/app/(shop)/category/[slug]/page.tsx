"use client";

import { use, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/features/best-sellers/components/ProductCard";
import { staggerContainer, pageTransition } from "@/shared/theme/animations";
import { Footer } from "@/features/footer";
import { PageHero } from "@/features/hero/components/PageHero";
import {
  CategoryFilters,
  FilterState,
  MobileFilterButton,
} from "@/features/search/components/CategoryFilters";
import { SlidersHorizontal } from "lucide-react";

const CATEGORY_MAP: Record<string, string> = {
  "skin-care": "Skin Care",
  "hair-care": "Hair Care",
  "makeup": "Makeup",
  "body-care": "Body Care",
  "fragrance": "Fragrance",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Skin Care": "Discover our curated selection of premium skincare products, crafted with the finest botanical ingredients for radiant, healthy skin.",
  "Hair Care": "Explore our luxurious hair care collection, formulated with nourishing ingredients to restore shine, strength, and natural beauty.",
  "Makeup": "Elevate your beauty routine with our premium makeup collection, featuring high-performance formulas and sophisticated shades.",
  "Body Care": "Indulge in our body care essentials, designed to nourish, hydrate, and pamper your skin from head to toe.",
  "Fragrance": "Discover our curated selection of exquisite fragrances, crafted to captivate and leave a lasting impression.",
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const categoryName = CATEGORY_MAP[slug] || slug;
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500],
    skinTypes: [],
    concerns: [],
    sortBy: "bestselling",
    inStock: false,
  });

  // Fetch products
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["products", categoryName],
    queryFn: () =>
      getProducts({
        category: categoryName as
          | "Skin Care"
          | "Hair Care"
          | "Makeup"
          | "Body Care"
          | "Fragrance",
      }),
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    let result = [...allProducts];

    // Price filter
    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Skin type filter
    if (filters.skinTypes.length > 0) {
      result = result.filter(
        (p) =>
          p.skinTypes?.some((st) => filters.skinTypes.includes(st)) ?? false
      );
    }

    // Concerns filter
    if (filters.concerns.length > 0) {
      result = result.filter(
        (p) =>
          p.concerns?.some((c) => filters.concerns.includes(c)) ?? false
      );
    }

    // In stock filter
    if (filters.inStock) {
      result = result.filter((p) => p.inStock !== false);
    }

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "bestselling":
      default:
        break;
    }

    return result;
  }, [allProducts, filters]);

  // Calculate max price for slider
  const maxPrice = useMemo(() => {
    if (!allProducts?.length) return 500;
    return Math.max(...allProducts.map((p) => p.price), 500);
  }, [allProducts]);

  // Count active filters
  const activeFilterCount =
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    filters.skinTypes.length +
    filters.concerns.length +
    (filters.inStock ? 1 : 0);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full bg-brand-offWhite min-h-screen"
    >
      <PageHero
        label="Collection"
        title={categoryName}
        description={
          CATEGORY_DESCRIPTIONS[categoryName] ||
          `Discover our curated selection of premium ${categoryName.toLowerCase()} products, crafted with the finest botanical ingredients.`
        }
      />

      {/* Products Section with Sidebar */}
      <section className="section-padding pb-24 md:pb-32 bg-brand-offWhite">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <CategoryFilters
              filters={filters}
              onFiltersChange={setFilters}
              productCount={filteredProducts.length}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              maxPrice={maxPrice}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-brand-slate">
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      Showing{" "}
                      <span className="font-medium text-brand-ink">
                        {filteredProducts.length}
                      </span>{" "}
                      {filteredProducts.length === 1 ? "product" : "products"}
                    </>
                  )}
                </p>

                {/* Mobile Sort Toggle */}
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-petal text-sm font-medium text-brand-ink hover:border-brand-ink transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Sort & Filter
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-rose text-white text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-full aspect-[4/5] bg-brand-blush/20 rounded-luxury mb-4" />
                      <div className="h-4 bg-brand-blush/30 rounded w-1/2 mx-auto mb-2" />
                      <div className="h-6 bg-brand-blush/30 rounded w-3/4 mx-auto mb-3" />
                      <div className="h-4 bg-brand-blush/30 rounded w-1/3 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        variants={{
                          initial: { opacity: 0, y: 20 },
                          animate: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.5,
                              ease: [0.22, 1, 0.36, 1],
                              delay: index * 0.05,
                            },
                          },
                        }}
                        layout
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-blush/30 flex items-center justify-center">
                    <SlidersHorizontal size={32} className="text-brand-mist" />
                  </div>
                  <h3 className="font-serif text-xl text-brand-ink mb-2">
                    No products found
                  </h3>
                  <p className="text-brand-slate mb-6">
                    Try adjusting your filters to see more results.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        priceRange: [0, maxPrice],
                        skinTypes: [],
                        concerns: [],
                        sortBy: "bestselling",
                        inStock: false,
                      })
                    }
                    className="text-brand-rose hover:text-brand-deepRose font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter FAB */}
      <MobileFilterButton
        onClick={() => setFiltersOpen(true)}
        activeFilters={activeFilterCount}
      />

      <Footer />
    </motion.div>
  );
}
