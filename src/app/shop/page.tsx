"use client";

import { Suspense, useMemo, useCallback, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProductBySlug } from "@/lib/api";
import type { ProductFilters } from "@/lib/api";
import { ProductCard } from "@/shared/components/ProductCard";
import { Footer } from "@/features/footer";
import { PageHero } from "@/features/hero/components/PageHero";
import { CategoryFilters } from "@/features/search/components/CategoryFilters";
import { ActiveFilterChips } from "@/features/search/components/ActiveFilterChips";
import { EmptyState } from "@/features/search/components/EmptyState";
import { useShopFilters } from "@/hooks/useShopFilters";
import { SlidersHorizontal, AlertTriangle, RefreshCw } from "lucide-react";
import type { SkinType, SkinConcern } from "@/shared/types";

// ============================================================================
// Debounce Hook - Prevents API spam during rapid filter changes
// ============================================================================

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

// ============================================================================
// Query Key Factory - Centralized query key management
// ============================================================================

export const shopKeys = {
  all: ["products", "shop"] as const,
  lists: () => [...shopKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...shopKeys.lists(), filters] as const,
  maxPrice: () => [...shopKeys.all, "maxPrice"] as const,
  detail: (slug: string) => [...shopKeys.all, "detail", slug] as const,
} as const;

/** Stale time for product queries (2 minutes) */
const PRODUCT_STALE_TIME = 2 * 60 * 1000;

// ============================================================================
// Shop Constants - Centralized configuration values
// ============================================================================

export const SHOP_CONSTANTS = {
  /** Number of skeleton placeholders shown during initial load */
  INITIAL_SKELETON_COUNT: 8,
  /** Number of skeleton placeholders shown during filter changes */
  FILTER_SKELETON_COUNT: 6,
  /** Default page size for product queries */
  PAGE_SIZE: 24,
  /** Default max price fallback */
  DEFAULT_MAX_PRICE: 500,
  /** Stale time for max price query (30 minutes) */
  MAX_PRICE_STALE_TIME: 30 * 60 * 1000,
} as const;

/**
 * Shop Page - Main entry point wrapped in Suspense for useSearchParams support.
 *
 * This page displays the complete product catalog with filtering capabilities.
 * Uses URL-synced filter state via useShopFilters for shareable filter URLs.
 *
 * @see useShopFilters - URL-synced filter state management
 * @see CategoryFilters - Filter sidebar/drawer component
 * @see ActiveFilterChips - Active filter display with removal
 * @see EmptyState - Premium empty results display
 */
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoadingShell />}>
      <ShopPageContent />
    </Suspense>
  );
}

/**
 * Loading shell displayed during initial SSR and Suspense fallback.
 * Shows skeleton placeholders matching the final grid layout.
 */
function ShopLoadingShell() {
  return (
    <div className="flex flex-col w-full bg-brand-offWhite min-h-screen">
      <PageHero
        title="Shop"
        description="Discover our complete collection of premium skincare essentials, crafted to reveal your purest, most radiant natural beauty."
      />
      <section className="py-16 md:py-24 pb-24 md:pb-32 bg-brand-offWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(SHOP_CONSTANTS.INITIAL_SKELETON_COUNT)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[4/5] bg-brand-blush/20 rounded-luxury mb-4" />
                <div className="h-4 bg-brand-blush/30 rounded w-1/2 mx-auto mb-2" />
                <div className="h-6 bg-brand-blush/30 rounded w-3/4 mx-auto mb-3" />
                <div className="h-4 bg-brand-blush/30 rounded w-1/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Transforms hook FilterState into API-compatible ProductFilters.
 *
 * Only includes filter params when they differ from defaults,
 * reducing unnecessary API constraints.
 *
 * @param filters - Filter state from useShopFilters hook
 * @param maxPrice - Maximum price for comparison
 * @returns API-compatible ProductFilters object
 */
function mapToAPIFilters(
  filters: ReturnType<typeof useShopFilters>["filters"],
  maxPrice: number
): ProductFilters {
  const apiFilters: ProductFilters = {
    category: (filters.category as ProductFilters["category"]) || "All",
    sortBy: filters.sortBy,
  };

  // Only constrain price when user has explicitly narrowed
  if (filters.priceRange[0] > 0.01) {
    apiFilters.minPrice = filters.priceRange[0];
  }
  if (
    isFinite(filters.priceRange[1]) &&
    Math.abs(filters.priceRange[1] - maxPrice) > 0.01
  ) {
    apiFilters.maxPrice = filters.priceRange[1];
  }

  if (filters.skinTypes.length > 0) apiFilters.skinTypes = filters.skinTypes;
  if (filters.concerns.length > 0) apiFilters.concerns = filters.concerns;
  if (filters.inStock) apiFilters.inStock = true;

  // Pagination foundation — page flows through query key & API params
  apiFilters.page = filters.page;
  apiFilters.pageSize = SHOP_CONSTANTS.PAGE_SIZE;

  return apiFilters;
}

/**
 * Main shop page content with filter sidebar and product grid.
 *
 * Features:
 * - URL-synced filter state with shareable links
 * - Responsive layout with mobile filter drawer
 * - Active filter chips with individual removal
 * - Screen reader announcements for product count
 * - Prefetching on product hover for instant navigation
 *
 * Requires Suspense wrapper due to useSearchParams usage.
 */
function ShopPageContent() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Stable query for maxPrice (long cache, independent of filters)
  const { data: maxPriceData } = useQuery({
    queryKey: ["products", "maxPrice"],
    queryFn: async () => {
      const all = await getProducts({ category: "All" });
      return Math.ceil(Math.max(...all.map((p) => p.price), SHOP_CONSTANTS.DEFAULT_MAX_PRICE));
    },
    staleTime: SHOP_CONSTANTS.MAX_PRICE_STALE_TIME,
  });

  const maxPrice = maxPriceData ?? SHOP_CONSTANTS.DEFAULT_MAX_PRICE;

  // URL-synced filter state (centralized hook)
  const { filters, setFilters, clearFilters, activeFilterCount } =
    useShopFilters(maxPrice);

  // Build API filters from hook state
  const apiFilters = useMemo(
    () => mapToAPIFilters(filters, maxPrice),
    [filters, maxPrice]
  );

  // Debounce filters to prevent API spam during rapid filter changes (400ms delay)
  const debouncedApiFilters = useDebounce(apiFilters, 400);

  // Server-side filtering: query key includes debounced filter state
  // AbortSignal enables request cancellation when filters change mid-flight
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: shopKeys.list(debouncedApiFilters),
    queryFn: ({ signal }) => getProducts(debouncedApiFilters, signal),
    staleTime: PRODUCT_STALE_TIME,
    // Cancel pending requests when query key changes (critical for filter spam protection)
    queryKeyHashFn: (queryKey) => JSON.stringify(queryKey),
  });

  const filteredProducts = products ?? [];

  // ========================================================================
  // Individual Filter Removal Handlers (for ActiveFilterChips)
  // ========================================================================

  /** Remove a specific skin type from the active filters */
  const handleRemoveSkinType = useCallback(
    (skinType: SkinType) => {
      setFilters((prev) => ({
        ...prev,
        skinTypes: prev.skinTypes.filter((t) => t !== skinType),
      }));
    },
    [setFilters]
  );

  /** Remove a specific concern from the active filters */
  const handleRemoveConcern = useCallback(
    (concern: SkinConcern) => {
      setFilters((prev) => ({
        ...prev,
        concerns: prev.concerns.filter((c) => c !== concern),
      }));
    },
    [setFilters]
  );

  /** Reset price filter to default range */
  const handleResetPrice = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [0, maxPrice],
    }));
  }, [setFilters, maxPrice]);

  /** Reset in-stock filter */
  const handleResetInStock = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      inStock: false,
    }));
  }, [setFilters]);

  // Query client for prefetching
  const queryClient = useQueryClient();

  // Prefetch product detail on hover - makes navigation feel instant
  const prefetchProduct = useCallback(
    (slug: string) => {
      queryClient.prefetchQuery({
        queryKey: shopKeys.detail(slug),
        queryFn: () => getProductBySlug(slug),
        staleTime: PRODUCT_STALE_TIME,
      });
    },
    [queryClient]
  );

  return (
    <div className="flex flex-col w-full bg-brand-offWhite min-h-screen animate-fade-in">
      <PageHero
        title="Shop"
        description="Discover our complete collection of premium skincare essentials, crafted to reveal your purest, most radiant natural beauty."
      />

      {/* Products Section with Sidebar */}
      <section className="py-16 md:py-24 pb-24 md:pb-32 bg-brand-offWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* Filters — consumes hook values via props */}
            <CategoryFilters
              filters={filters}
              onFiltersChange={setFilters}
              productCount={filteredProducts.length}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              maxPrice={maxPrice}
              activeFilterCount={activeFilterCount}
              onClearFilters={clearFilters}
            />

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Screen Reader Announcements */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {isLoading
                  ? "Loading products..."
                  : `Showing ${filteredProducts.length} ${
                      filteredProducts.length === 1 ? "product" : "products"
                    }`}
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-10">
                <p className="text-[11px] tracking-[0.2em] uppercase text-brand-ink/40 font-medium">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "item" : "items"}
                </p>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-brand-ink/10 text-xs font-medium text-brand-ink hover:border-brand-rose hover:text-brand-rose transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Sort &amp; Filter
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-rose text-white text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Active Filter Chips */}
              <ActiveFilterChips
                filters={filters}
                maxPrice={maxPrice}
                onRemoveSkinType={handleRemoveSkinType}
                onRemoveConcern={handleRemoveConcern}
                onResetPrice={handleResetPrice}
                onResetInStock={handleResetInStock}
                activeFilterCount={activeFilterCount}
                onClearAll={clearFilters}
              />

              {isError ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={32} className="text-red-400" />
                  </div>
                  <h2 className="font-serif text-xl text-brand-ink mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-brand-slate mb-6 max-w-md mx-auto">
                    {error instanceof Error
                      ? error.message
                      : "We couldn't load the products. Please check your connection and try again."}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-ink text-white text-xs tracking-[0.15em] uppercase font-medium rounded-lg hover:bg-brand-ink/90 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Retry
                  </button>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  {[...Array(SHOP_CONSTANTS.FILTER_SKELETON_COUNT)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-full aspect-[4/5] bg-brand-blush/20 rounded-luxury mb-4" />
                      <div className="h-4 bg-brand-blush/30 rounded w-1/2 mx-auto mb-2" />
                      <div className="h-6 bg-brand-blush/30 rounded w-3/4 mx-auto mb-3" />
                      <div className="h-4 bg-brand-blush/30 rounded w-1/3 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}
                    >
                      <ProductCard
                        product={product}
                        index={index}
                        priority={index < 4}
                        onHover={() => prefetchProduct(product.slug)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  onClearFilters={clearFilters}
                  activeFilterCount={activeFilterCount}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
