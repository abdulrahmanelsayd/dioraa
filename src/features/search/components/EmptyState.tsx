"use client";

import { SlidersHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Props for the EmptyState component.
 * Displays a premium empty state when no products match the current filters.
 */
export interface EmptyStateProps {
  /** Callback to clear all filters and reset to default state */
  onClearFilters: () => void;
  /** Number of active filters (for contextual messaging) */
  activeFilterCount: number;
}

/**
 * EmptyState displays a premium, visually pleasing empty state
 * when no products match the current filter criteria.
 *
 * Features:
 * - Subtle faded icon with brand colors
 * - Contextual messaging based on filter count
 * - Prominent "Clear All Filters" button
 * - Accessible with proper ARIA labels
 *
 * @example
 * ```tsx
 * <EmptyState
 *   onClearFilters={() => clearFilters()}
 *   activeFilterCount={3}
 * />
 * ```
 */
export function EmptyState({ onClearFilters, activeFilterCount }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up"
      role="status"
      aria-label="No products found"
    >
      {/* Decorative Icon Container */}
      <div
        className={cn(
          "relative w-24 h-24 mb-8 rounded-full",
          "bg-gradient-to-br from-brand-blush/20 to-brand-rose/10",
          "flex items-center justify-center"
        )}
      >
        {/* Primary Icon */}
        <SlidersHorizontal
          size={36}
          className="text-brand-mist/60"
          strokeWidth={1.5}
        />

        {/* Decorative sparkle accent */}
        <div className="absolute -top-1 -right-1 animate-fade-in-scale" style={{ animationDelay: "300ms" }}>
          <div className="w-6 h-6 rounded-full bg-brand-rose/20 flex items-center justify-center">
            <Sparkles size={12} className="text-brand-rose" />
          </div>
        </div>
      </div>

      {/* Heading */}
      <h3 className="font-serif text-2xl text-brand-ink mb-3 text-center">
        No products found
      </h3>

      {/* Contextual Description */}
      <p className="text-brand-slate text-center max-w-md mb-8 leading-relaxed">
        {activeFilterCount > 0 ? (
          <>
            We couldn&apos;t find any products matching your current filters.
            <br />
            Try adjusting your selections to discover more products.
          </>
        ) : (
          <>
            It seems our collection is temporarily unavailable.
            <br />
            Please try again in a moment.
          </>
        )}
      </p>

      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={onClearFilters}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3.5",
            "bg-brand-ink text-white",
            "text-xs tracking-[0.15em] uppercase font-medium",
            "rounded-lg",
            "hover:bg-brand-ink/90",
            "transition-all duration-200",
            "shadow-sm hover:shadow-md animate-fade-in"
          )}
          style={{ animationDelay: "200ms" }}
          aria-label="Clear all filters and show all products"
        >
          <SlidersHorizontal size={14} />
          Clear All Filters
        </button>
      )}

      {/* Helpful Hint */}
      {activeFilterCount > 1 && (
        <p className="mt-6 text-xs text-brand-ink/60 text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
          Tip: Removing some filters may reveal more results
        </p>
      )}
    </div>
  );
}
