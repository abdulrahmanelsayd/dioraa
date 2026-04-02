"use client";

import { useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SkinType, SkinConcern } from "@/shared/types";
import { SKIN_TYPES, SKIN_CONCERNS } from "@/shared/types";

// Re-export FilterState from hook for backward compatibility
export type { FilterState } from "@/hooks/useShopFilters";
import type { FilterState } from "@/hooks/useShopFilters";

const SORT_OPTIONS = [
  { value: "bestselling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;


/**
 * Props for the CategoryFilters component.
 * Manages filter state for the Shop page with desktop sidebar and mobile drawer layouts.
 */
interface CategoryFiltersProps {
  /** Current filter state from useShopFilters hook */
  filters: FilterState;
  /** Callback to update filter state (triggers URL sync) */
  onFiltersChange: (filters: FilterState) => void;
  /** Total number of products matching current filters */
  productCount: number;
  /** Whether mobile filter drawer is open */
  isOpen: boolean;
  /** Callback to close mobile filter drawer */
  onClose: () => void;
  /** Maximum price for price range filter (default: 500) */
  maxPrice?: number;
  /** Centralized active filter count from hook — eliminates duplicate calc */
  activeFilterCount: number;
  /** Centralized clear handler from hook — eliminates duplicate logic */
  onClearFilters: () => void;
}

export function CategoryFilters({
  filters,
  onFiltersChange,
  productCount,
  isOpen,
  onClose,
  maxPrice = 500,
  activeFilterCount,
  onClearFilters,
}: CategoryFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["sort", "price", "skinType", "concerns"])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  function toggleArrayFilter(key: "skinTypes", value: SkinType): void;
  function toggleArrayFilter(key: "concerns", value: SkinConcern): void;
  function toggleArrayFilter(
    key: "skinTypes" | "concerns",
    value: SkinType | SkinConcern
  ) {
    if (key === "skinTypes") {
      const current = filters.skinTypes;
      const v = value as SkinType;
      const updated = current.includes(v)
        ? current.filter((item) => item !== v)
        : [...current, v];
      updateFilter("skinTypes", updated);
    } else {
      const current = filters.concerns;
      const v = value as SkinConcern;
      const updated = current.includes(v)
        ? current.filter((item) => item !== v)
        : [...current, v];
      updateFilter("concerns", updated);
    }
  }

  // Shared filter content JSX - inlined to avoid creating components during render
  const filterContent = (
    <div className="space-y-5">
      {/* Sort */}
      <FilterSection
        title="Sort"
        isExpanded={expandedSections.has("sort")}
        onToggle={() => toggleSection("sort")}
      >
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Sort options">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("sortBy", option.value)}
              aria-pressed={filters.sortBy === option.value}
              className={cn(
                "px-3 py-2 text-xs text-left rounded-lg transition-all duration-200",
                filters.sortBy === option.value
                  ? "bg-brand-rose text-white"
                  : "bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-rose/10 hover:text-brand-rose"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection
        title="Price"
        isExpanded={expandedSections.has("price")}
        onToggle={() => toggleSection("price")}
      >
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Price range options">
          {[
            { label: "All", min: 0, max: maxPrice },
            { label: "Under $50", min: 0, max: 50 },
            { label: "$50–100", min: 50, max: 100 },
            { label: "$100–200", min: 100, max: 200 },
            { label: "$200+", min: 200, max: maxPrice },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => updateFilter("priceRange", [range.min, range.max])}
              aria-pressed={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
              className={cn(
                "px-3 py-2 text-xs text-left rounded-lg transition-all duration-200",
                filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                  ? "bg-brand-rose text-white"
                  : "bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-rose/10 hover:text-brand-rose"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Skin Type */}
      <FilterSection
        title="Skin Type"
        isExpanded={expandedSections.has("skinType")}
        onToggle={() => toggleSection("skinType")}
        badge={filters.skinTypes.length > 0 ? filters.skinTypes.length : undefined}
      >
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Skin type filters">
          {SKIN_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleArrayFilter("skinTypes", type)}
              aria-pressed={filters.skinTypes.includes(type)}
              className={cn(
                "px-3 py-2 text-xs text-left rounded-lg transition-all duration-200 flex items-center gap-1.5",
                filters.skinTypes.includes(type)
                  ? "bg-brand-rose text-white"
                  : "bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-rose/10 hover:text-brand-rose"
              )}
            >
              {filters.skinTypes.includes(type) && <Check size={10} strokeWidth={3} />}
              {type}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Concerns */}
      <FilterSection
        title="Concerns"
        isExpanded={expandedSections.has("concerns")}
        onToggle={() => toggleSection("concerns")}
        badge={filters.concerns.length > 0 ? filters.concerns.length : undefined}
      >
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Skin concern filters">
          {SKIN_CONCERNS.map((concern) => (
            <button
              key={concern}
              onClick={() => toggleArrayFilter("concerns", concern)}
              aria-pressed={filters.concerns.includes(concern)}
              className={cn(
                "px-3 py-2 text-xs text-left rounded-lg transition-all duration-200 flex items-center gap-1.5",
                filters.concerns.includes(concern)
                  ? "bg-brand-rose text-white"
                  : "bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-rose/10 hover:text-brand-rose"
              )}
            >
              {filters.concerns.includes(concern) && <Check size={10} strokeWidth={3} />}
              {concern}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection
        title="Availability"
        isExpanded={expandedSections.has("availability")}
        onToggle={() => toggleSection("availability")}
      >
        <button
          onClick={() => updateFilter("inStock", !filters.inStock)}
          aria-pressed={filters.inStock}
          className={cn(
            "w-full px-3 py-2 text-xs text-left rounded-lg transition-all duration-200 flex items-center gap-1.5",
            filters.inStock
              ? "bg-brand-rose text-white"
              : "bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-rose/10 hover:text-brand-rose"
          )}
        >
          {filters.inStock && <Check size={10} strokeWidth={3} />}
          In Stock Only
        </button>
      </FilterSection>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <p className="mt-6 text-xs text-brand-ink/60 text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
          Clear all filters
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-32 pr-8">
          {/* Header */}
          <div className="mb-10 pb-6 border-b border-brand-ink/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xs tracking-[0.2em] uppercase text-brand-ink font-medium">
                Filter
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={onClearFilters}
                  className="text-xs text-brand-ink/60 hover:text-brand-rose transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            {activeFilterCount > 0 && (
              <p className="text-xs text-brand-ink/60 mt-2">
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied
              </p>
            )}
          </div>

          {filterContent}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 bg-brand-ink/20 z-[49] lg:hidden animate-fade-in"
            role="presentation"
            aria-hidden="true"
          />
          <div
            className="fixed inset-x-0 bottom-0 top-16 bg-white z-50 lg:hidden overflow-y-auto flex flex-col animate-slide-in-left"
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-ink/10 flex-shrink-0">
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-brand-ink font-medium">
                  Filter
                </h2>
                <p className="text-xs text-brand-ink/80 mt-1">
                  {productCount} {productCount === 1 ? "product" : "products"}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close filter panel"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-offWhite transition-colors"
              >
                <X size={20} className="text-brand-ink/70" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
              {filterContent}

              {/* Apply Button */}
              <div className="pt-6 border-t border-brand-ink/10">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-brand-rose text-white text-xs tracking-[0.15em] uppercase font-medium rounded-lg hover:bg-brand-deepRose transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/**
 * Props for the FilterSection collapsible accordion component.
 */
interface FilterSectionProps {
  /** Section title displayed in the header */
  title: string;
  /** Filter controls rendered when section is expanded */
  children: React.ReactNode;
  /** Whether the section is currently expanded */
  isExpanded: boolean;
  /** Callback fired when section header is clicked */
  onToggle: () => void;
  /** Optional badge count displayed next to title (e.g., active filter count) */
  badge?: number;
}

function FilterSection({
  title,
  children,
  isExpanded,
  onToggle,
  badge,
}: FilterSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-[0.15em] uppercase text-brand-ink/70 font-medium group-hover:text-brand-ink transition-colors duration-200">
            {title}
          </span>
          {badge && (
            <span className="text-xs text-brand-rose">
              ({badge})
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "text-brand-ink/40 transition-transform duration-300",
            isExpanded && "rotate-180"
          )}
        />
      </button>
      {isExpanded && (
        <div className="overflow-hidden animate-fade-in-scale" style={{ transformOrigin: "top" }}>
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile Filter Button
export interface MobileFilterButtonProps {
  /** Callback fired when the filter button is clicked */
  onClick: () => void;
  /** Number of currently active filters to display in the badge */
  activeFilters: number;
}

export function MobileFilterButton({
  onClick,
  activeFilters,
}: MobileFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-white text-brand-ink shadow-lg border border-brand-ink/10 hover:border-brand-ink/20 transition-all"
    >
      <span className="text-xs tracking-[0.15em] uppercase font-medium">
        Filter
      </span>
      {activeFilters > 0 && (
        <span className="text-xs text-brand-rose">
          ({activeFilters})
        </span>
      )}
    </button>
  );
}
