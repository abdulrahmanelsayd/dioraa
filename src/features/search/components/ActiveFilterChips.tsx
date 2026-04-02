"use client";

import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { FilterState } from "@/hooks/useShopFilters";

/**
 * Props for the ActiveFilterChips component.
 * Displays active filters as removable chips above the product grid.
 */
export interface ActiveFilterChipsProps {
  /** Current filter state from useShopFilters hook */
  filters: FilterState;
  /** Maximum price value (used to determine if price filter is active) */
  maxPrice: number;
  /** Callback to remove a specific skin type filter */
  onRemoveSkinType: (skinType: FilterState["skinTypes"][number]) => void;
  /** Callback to remove a specific concern filter */
  onRemoveConcern: (concern: FilterState["concerns"][number]) => void;
  /** Callback to reset price filter to default range */
  onResetPrice: () => void;
  /** Callback to reset in-stock filter */
  onResetInStock: () => void;
  /** Total count of active filters for display */
  activeFilterCount: number;
  /** Callback to clear all filters at once */
  onClearAll: () => void;
}

/**
 * ActiveFilterChips displays all currently applied filters as removable chips.
 * Each chip shows the filter name with an '✕' button to remove it.
 * Includes a "Clear All" button when multiple filters are active.
 *
 * @example
 * ```tsx
 * <ActiveFilterChips
 *   filters={filters}
 *   maxPrice={500}
 *   onRemoveSkinType={(type) => handleRemoveSkinType(type)}
 *   onRemoveConcern={(concern) => handleRemoveConcern(concern)}
 *   onResetPrice={() => handleResetPrice()}
 *   onResetInStock={() => handleResetInStock()}
 *   activeFilterCount={3}
 *   onClearAll={() => clearFilters()}
 * />
 * ```
 */
export function ActiveFilterChips({
  filters,
  maxPrice,
  onRemoveSkinType,
  onRemoveConcern,
  onResetPrice,
  onResetInStock,
  activeFilterCount,
  onClearAll,
}: ActiveFilterChipsProps) {
  // Determine if price filter is active (not at default range)
  const isPriceFiltered =
    filters.priceRange[0] > 0.01 ||
    (isFinite(filters.priceRange[1]) &&
      Math.abs(filters.priceRange[1] - maxPrice) > 0.01);

  // Generate price chip label
  const getPriceLabel = (): string => {
    if (filters.priceRange[0] === 0 && filters.priceRange[1] === 50) return "Under $50";
    if (filters.priceRange[0] === 50 && filters.priceRange[1] === 100) return "$50–$100";
    if (filters.priceRange[0] === 100 && filters.priceRange[1] === 200) return "$100–$200";
    if (filters.priceRange[0] === 200) return "$200+";
    if (filters.priceRange[0] > 0 && filters.priceRange[1] < maxPrice) {
      return `$${filters.priceRange[0]}–$${filters.priceRange[1]}`;
    }
    if (filters.priceRange[0] > 0) return `From $${filters.priceRange[0]}`;
    if (filters.priceRange[1] < maxPrice) return `Up to $${filters.priceRange[1]}`;
    return "Custom Price";
  };

  // Don't render if no active filters
  if (activeFilterCount === 0) return null;

  return (
    <div className="mb-6" role="region" aria-label="Active filters">
      <div className="flex flex-wrap items-center gap-2">
        {/* Price Filter Chip */}
        {isPriceFiltered && (
          <button
            key="price-filter"
            onClick={onResetPrice}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "bg-brand-ink/5 border border-brand-ink/10",
              "text-xs font-medium text-brand-ink/80",
              "hover:bg-brand-rose/10 hover:border-brand-rose/30 hover:text-brand-rose",
              "transition-all duration-200 animate-fade-in-scale"
            )}
            aria-label={`Remove price filter: ${getPriceLabel()}`}
          >
            <span className="tracking-wide">{getPriceLabel()}</span>
            <X size={12} className="opacity-60" />
          </button>
        )}

        {/* Skin Type Filter Chips */}
        {filters.skinTypes.map((type) => (
          <button
            key={`skinType-${type}`}
            onClick={() => onRemoveSkinType(type)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "bg-brand-ink/5 border border-brand-ink/10",
              "text-xs font-medium text-brand-ink/80",
              "hover:bg-brand-rose/10 hover:border-brand-rose/30 hover:text-brand-rose",
              "transition-all duration-200 animate-fade-in-scale"
            )}
            aria-label={`Remove skin type filter: ${type}`}
          >
            <span className="tracking-wide">{type}</span>
            <X size={12} className="opacity-60" />
          </button>
        ))}

        {/* Concern Filter Chips */}
        {filters.concerns.map((concern) => (
          <button
            key={`concern-${concern}`}
            onClick={() => onRemoveConcern(concern)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "bg-brand-ink/5 border border-brand-ink/10",
              "text-xs font-medium text-brand-ink/80",
              "hover:bg-brand-rose/10 hover:border-brand-rose/30 hover:text-brand-rose",
              "transition-all duration-200 animate-fade-in-scale"
            )}
            aria-label={`Remove concern filter: ${concern}`}
          >
            <span className="tracking-wide">{concern}</span>
            <X size={12} className="opacity-60" />
          </button>
        ))}

        {/* In Stock Filter Chip */}
        {filters.inStock && (
          <button
            key="instock-filter"
            onClick={onResetInStock}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "bg-brand-ink/5 border border-brand-ink/10",
              "text-xs font-medium text-brand-ink/80",
              "hover:bg-brand-rose/10 hover:border-brand-rose/30 hover:text-brand-rose",
              "transition-all duration-200 animate-fade-in-scale"
            )}
            aria-label="Remove in stock filter"
          >
            <span className="tracking-wide">In Stock</span>
            <X size={12} className="opacity-60" />
          </button>
        )}

        {/* Clear All Button */}
        {activeFilterCount > 1 && (
          <button
            key="clear-all"
            onClick={onClearAll}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full",
              "text-xs font-medium text-brand-rose",
              "hover:text-brand-deepRose hover:underline",
              "transition-all duration-200 animate-fade-in-scale"
            )}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
