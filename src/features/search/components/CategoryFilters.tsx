"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sliders, X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

export interface FilterState {
  priceRange: [number, number];
  skinTypes: string[];
  concerns: string[];
  sortBy: "price-asc" | "price-desc" | "rating" | "newest" | "bestselling";
  inStock: boolean;
}

const SKIN_TYPES = [
  "Oily",
  "Dry",
  "Combination",
  "Sensitive",
  "Normal",
  "All Skin Types",
];

const CONCERNS = [
  "Acne",
  "Anti-Aging",
  "Dark Spots",
  "Dryness",
  "Dullness",
  "Fine Lines",
  "Oiliness",
  "Pores",
  "Redness",
  "Sensitivity",
  "Hydration",
  "Brightening",
];

const SORT_OPTIONS = [
  { value: "bestselling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

interface CategoryFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  productCount: number;
  isOpen: boolean;
  onClose: () => void;
  maxPrice?: number;
}

export function CategoryFilters({
  filters,
  onFiltersChange,
  productCount,
  isOpen,
  onClose,
  maxPrice = 500,
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

  const toggleArrayFilter = (
    key: "skinTypes" | "concerns",
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const activeFilterCount =
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    filters.skinTypes.length +
    filters.concerns.length +
    (filters.inStock ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <FilterSection
        title="Sort By"
        isExpanded={expandedSections.has("sort")}
        onToggle={() => toggleSection("sort")}
      >
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("sortBy", option.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                filters.sortBy === option.value
                  ? "bg-brand-ink text-white font-medium"
                  : "text-brand-slate hover:bg-brand-blush/30"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.has("price")}
        onToggle={() => toggleSection("price")}
      >
        <div className="px-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-brand-slate">
              ${filters.priceRange[0]}
            </span>
            <span className="text-sm text-brand-slate">
              ${filters.priceRange[1]}
            </span>
          </div>
          <div className="relative h-2 bg-brand-petal rounded-full">
            <div
              className="absolute h-full bg-brand-ink rounded-full"
              style={{
                left: `${(filters.priceRange[0] / maxPrice) * 100}%`,
                right: `${100 - (filters.priceRange[1] / maxPrice) * 100}%`,
              }}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={filters.priceRange[0]}
              onChange={(e) =>
                updateFilter("priceRange", [
                  Math.min(parseInt(e.target.value), filters.priceRange[1] - 10),
                  filters.priceRange[1],
                ])
              }
              className="flex-1 accent-brand-ink"
            />
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={filters.priceRange[1]}
              onChange={(e) =>
                updateFilter("priceRange", [
                  filters.priceRange[0],
                  Math.max(parseInt(e.target.value), filters.priceRange[0] + 10),
                ])
              }
              className="flex-1 accent-brand-ink"
            />
          </div>
        </div>
      </FilterSection>

      {/* Skin Type */}
      <FilterSection
        title="Skin Type"
        isExpanded={expandedSections.has("skinType")}
        onToggle={() => toggleSection("skinType")}
        badge={filters.skinTypes.length > 0 ? filters.skinTypes.length : undefined}
      >
        <div className="flex flex-wrap gap-2">
          {SKIN_TYPES.map((type) => (
            <FilterChip
              key={type}
              label={type}
              isSelected={filters.skinTypes.includes(type)}
              onClick={() => toggleArrayFilter("skinTypes", type)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Concerns */}
      <FilterSection
        title="Skin Concerns"
        isExpanded={expandedSections.has("concerns")}
        onToggle={() => toggleSection("concerns")}
        badge={filters.concerns.length > 0 ? filters.concerns.length : undefined}
      >
        <div className="flex flex-wrap gap-2">
          {CONCERNS.map((concern) => (
            <FilterChip
              key={concern}
              label={concern}
              isSelected={filters.concerns.includes(concern)}
              onClick={() => toggleArrayFilter("concerns", concern)}
            />
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
          className={cn(
            "w-full flex items-center justify-between px-3 py-3 rounded-xl border transition-all duration-200",
            filters.inStock
              ? "border-brand-ink bg-brand-ink/5"
              : "border-brand-petal hover:border-brand-ink/30"
          )}
        >
          <span className="text-sm text-brand-ink">In Stock Only</span>
          <div
            className={cn(
              "w-11 h-6 rounded-full transition-colors duration-200 relative",
              filters.inStock ? "bg-brand-ink" : "bg-brand-petal"
            )}
          >
            <motion.div
              initial={false}
              animate={{ x: filters.inStock ? 20 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </div>
        </button>
      </FilterSection>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() =>
            onFiltersChange({
              priceRange: [0, maxPrice],
              skinTypes: [],
              concerns: [],
              sortBy: "bestselling",
              inStock: false,
            })
          }
          className="w-full py-3 text-sm text-brand-rose hover:text-brand-deepRose font-medium transition-colors"
        >
          Clear all filters ({activeFilterCount})
        </motion.button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-petal/50 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg text-brand-ink">Filters</h3>
              {activeFilterCount > 0 && (
                <span className="w-6 h-6 rounded-full bg-brand-rose text-white text-xs flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <FilterContent />
          </div>

          {/* Results Count */}
          <p className="mt-4 text-sm text-brand-mist text-center">
            {productCount} {productCount === 1 ? "product" : "products"} found
          </p>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-brand-ink/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl text-brand-ink">Filters</h3>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-brand-blush/30 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <FilterContent />
              </div>

              {/* Mobile Footer */}
              <div className="sticky bottom-0 bg-white border-t border-brand-petal p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-brand-slate">
                    {productCount} {productCount === 1 ? "product" : "products"}
                  </p>
                  <Button onClick={onClose} className="px-8">
                    Show Results
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Filter Section Component
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
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
    <div className="border-b border-brand-petal/50 last:border-0 pb-6 last:pb-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 mb-3 group"
      >
        <span className="font-medium text-brand-ink group-hover:text-brand-deepRose transition-colors">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="w-5 h-5 rounded-full bg-brand-rose text-white text-xs flex items-center justify-center">
              {badge}
            </span>
          )}
          <ChevronDown
            size={18}
            className={cn(
              "text-brand-mist transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Filter Chip Component
interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function FilterChip({ label, isSelected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
        isSelected
          ? "bg-brand-ink text-white shadow-md"
          : "bg-brand-offWhite text-brand-slate hover:bg-brand-blush/40 border border-brand-petal"
      )}
    >
      <span className="flex items-center gap-1">
        {isSelected && <Check size={12} />}
        {label}
      </span>
    </button>
  );
}

// Mobile Filter Button
export function MobileFilterButton({
  onClick,
  activeFilters,
}: {
  onClick: () => void;
  activeFilters: number;
}) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-brand-ink text-white rounded-full shadow-lg hover:bg-brand-ink/90 transition-all active:scale-95"
    >
      <Sliders size={18} />
      <span className="text-sm font-medium">Filters</span>
      {activeFilters > 0 && (
        <span className="w-5 h-5 rounded-full bg-brand-rose text-white text-xs flex items-center justify-center">
          {activeFilters}
        </span>
      )}
    </button>
  );
}
