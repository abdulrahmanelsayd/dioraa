/**
 * @fileoverview URL-synced shop filter state management hook.
 *
 * This hook provides centralized, URL-synchronized filter state for the Shop page.
 * It implements a bidirectional sync between React state and URL search params,
 * enabling shareable filter URLs and browser history navigation support.
 *
 * @module useShopFilters
 * @see https://nextjs.org/docs/app/api-reference/functions/use-search-params
 */

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SkinType, SkinConcern } from "@/shared/types";
import { SKIN_TYPES, SKIN_CONCERNS } from "@/shared/types";

// ============================================================================
// Types
// ============================================================================

/**
 * Represents the complete filter state for the Shop page.
 * All fields are synced to URL search params for shareable links.
 *
 * @property priceRange - Tuple of [minPrice, maxPrice] for price filtering
 * @property skinTypes - Array of selected skin type filters
 * @property concerns - Array of selected skin concern filters
 * @property sortBy - Current sort option (price-asc, price-desc, rating, newest, bestselling)
 * @property inStock - Whether to show only in-stock products
 * @property page - Current pagination page (1-indexed)
 */
export interface FilterState {
  category: string;
  priceRange: [number, number];
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  sortBy: "price-asc" | "price-desc" | "rating" | "newest" | "bestselling";
  inStock: boolean;
  page: number;
}

const DEFAULT_SORT: FilterState["sortBy"] = "bestselling";
const DEFAULT_PAGE = 1;
export const PAGE_SIZE = 24;

// ============================================================================
// URL ↔ State Serialization
// ============================================================================

const VALID_SORT_VALUES = new Set<string>([
  "price-asc",
  "price-desc",
  "rating",
  "newest",
  "bestselling",
]);

function parseFiltersFromURL(
  params: URLSearchParams,
  maxPrice: number
): FilterState {
  const priceMin = Math.max(0, Number(params.get("priceMin")) || 0);
  const rawMax = params.get("priceMax");
  const priceMax =
    rawMax !== null ? Math.max(0, Number(rawMax) || maxPrice) : maxPrice;

  const category = params.get("category") || "All";

  const skinTypes = (params.get("skinTypes")?.split(",").filter(Boolean) ?? [])
    .filter((v): v is SkinType =>
      (SKIN_TYPES as readonly string[]).includes(v)
    );

  const concerns = (params.get("concerns")?.split(",").filter(Boolean) ?? [])
    .filter((v): v is SkinConcern =>
      (SKIN_CONCERNS as readonly string[]).includes(v)
    );

  const sortByRaw = params.get("sortBy") ?? "";
  const sortBy = VALID_SORT_VALUES.has(sortByRaw)
    ? (sortByRaw as FilterState["sortBy"])
    : DEFAULT_SORT;

  const inStock = params.get("inStock") === "true";
  const page = Math.max(1, Math.floor(Number(params.get("page")) || DEFAULT_PAGE));

  return { category, priceRange: [priceMin, priceMax], skinTypes, concerns, sortBy, inStock, page };
}

function serializeFiltersToURL(
  filters: FilterState,
  maxPrice: number
): string {
  const params = new URLSearchParams();

  if (filters.category !== "All" && filters.category) {
    params.set("category", filters.category);
  }
  if (filters.priceRange[0] > 0) {
    params.set("priceMin", String(filters.priceRange[0]));
  }
  if (
    isFinite(filters.priceRange[1]) &&
    Math.abs(filters.priceRange[1] - maxPrice) > 0.01
  ) {
    params.set("priceMax", String(filters.priceRange[1]));
  }
  if (filters.skinTypes.length > 0) {
    params.set("skinTypes", filters.skinTypes.join(","));
  }
  if (filters.concerns.length > 0) {
    params.set("concerns", filters.concerns.join(","));
  }
  if (filters.sortBy !== DEFAULT_SORT) {
    params.set("sortBy", filters.sortBy);
  }
  if (filters.inStock) {
    params.set("inStock", "true");
  }
  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  return params.toString();
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Custom hook for managing Shop page filter state with URL synchronization.
 *
 * This hook implements an optimistic UI pattern where local state updates immediately,
 * then syncs to the URL after a short debounce. This provides instant feedback while
 * maintaining URL shareability and browser history support.
 *
 * @param maxPrice - Maximum price value used for price range defaults (default: 500)
 *
 * @returns An object containing:
 * - `filters` - Current filter state (synced with URL)
 * - `setFilters` - Update filters (auto-resets page to 1 when non-page filters change)
 * - `clearFilters` - Reset all filters to defaults
 * - `setPage` - Update pagination page without resetting other filters
 * - `activeFilterCount` - Count of currently active (non-default) filters
 * - `maxPrice` - The maxPrice parameter for reference
 *
 * @example
 * ```tsx
 * function ShopPage() {
 *   const { filters, setFilters, clearFilters, activeFilterCount } = useShopFilters(500);
 *
 *   // Update a filter (URL syncs automatically)
 *   const handleSkinTypeToggle = (type: SkinType) => {
 *     setFilters(prev => ({
 *       ...prev,
 *       skinTypes: prev.skinTypes.includes(type)
 *         ? prev.skinTypes.filter(t => t !== type)
 *         : [...prev.skinTypes, type]
 *     }));
 *   };
 *
 *   return <ProductGrid filters={filters} onClear={clearFilters} />;
 * }
 * ```
 *
 * @remarks
 * - Uses 300ms debounce for URL updates to prevent history spam
 * - Automatically syncs from URL on browser back/forward navigation
 * - Page resets to 1 when any non-page filter changes
 * - Wrapped in Suspense boundary required due to useSearchParams()
 */
export function useShopFilters(maxPrice: number = 500) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Optimistic local state — initialized from URL
  const [filters, setFiltersInternal] = useState<FilterState>(() =>
    parseFiltersFromURL(searchParams, maxPrice)
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPushingRef = useRef(false);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Sync maxPrice when data arrives and user hasn't set a custom upper bound
  useEffect(() => {
    const hasCustomMax = searchParams.has("priceMax");
    if (!hasCustomMax) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiltersInternal((prev) => {
        if (prev.priceRange[1] !== maxPrice) {
          return { ...prev, priceRange: [prev.priceRange[0], maxPrice] };
        }
        return prev;
      });
    }
  }, [maxPrice, searchParams]);

  // Sync from URL on external navigation (browser back/forward)
  useEffect(() => {
    if (isPushingRef.current) {
      isPushingRef.current = false;
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiltersInternal(parseFiltersFromURL(searchParams, maxPrice));
  }, [searchParams, maxPrice]);

  // Push filters to URL (debounced to prevent history spam)
  const pushToURL = useCallback(
    (newFilters: FilterState) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        isPushingRef.current = true;
        const qs = serializeFiltersToURL(newFilters, maxPrice);
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }, 300);
    },
    [pathname, router, maxPrice]
  );

  // Set filters — auto-resets page to 1 when non-page filters change
  const setFilters = useCallback(
    (update: FilterState | ((prev: FilterState) => FilterState)) => {
      setFiltersInternal((prev) => {
        const next = typeof update === "function" ? update(prev) : update;

        // Detect if any non-page filter changed
        const filtersChanged =
          next.priceRange[0] !== prev.priceRange[0] ||
          next.priceRange[1] !== prev.priceRange[1] ||
          next.skinTypes.join(",") !== prev.skinTypes.join(",") ||
          next.concerns.join(",") !== prev.concerns.join(",") ||
          next.sortBy !== prev.sortBy ||
          next.inStock !== prev.inStock;

        const final = filtersChanged ? { ...next, page: 1 } : next;
        pushToURL(final);
        return final;
      });
    },
    [pushToURL]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    const cleared: FilterState = {
      category: "All",
      priceRange: [0, maxPrice],
      skinTypes: [],
      concerns: [],
      sortBy: DEFAULT_SORT,
      inStock: false,
      page: DEFAULT_PAGE,
    };
    setFiltersInternal(cleared);
    pushToURL(cleared);
  }, [maxPrice, pushToURL]);

  // Set page explicitly (no filter reset)
  const setPage = useCallback(
    (page: number) => {
      setFiltersInternal((prev) => {
        const next = { ...prev, page };
        pushToURL(next);
        return next;
      });
    },
    [pushToURL]
  );

  // Active filter count (centralized — DRY)
  const activeFilterCount = useMemo(() => {
    const isPriceFiltered =
      filters.priceRange[0] > 0.01 ||
      (isFinite(filters.priceRange[1]) &&
        Math.abs(filters.priceRange[1] - maxPrice) > 0.01);
    return (
      (filters.category !== "All" ? 1 : 0) +
      (isPriceFiltered ? 1 : 0) +
      filters.skinTypes.length +
      filters.concerns.length +
      (filters.inStock ? 1 : 0)
    );
  }, [filters, maxPrice]);

  return {
    filters,
    setFilters,
    clearFilters,
    setPage,
    activeFilterCount,
    maxPrice,
  };
}
