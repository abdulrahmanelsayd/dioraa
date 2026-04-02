"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api";
import type { Product } from "@/shared/types/product";

// Debounce hook - 300ms delay to prevent API spam
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

interface SearchBarProps {
  className?: string;
  onClose?: () => void;
}

export function SearchBar({ className, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300); // 300ms debounce

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery, 1, 5),
    enabled: debouncedQuery.length >= 2,
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setQuery("");
        setIsOpen(false);
        onClose?.();
      }
      if (e.key === "Enter" && query.trim()) {
        // Search for products and navigate to first result
        searchProducts(query.trim(), 1, 5).then((res) => {
          if (res.data.length > 0) {
            router.push(`/product/${res.data[0].slug}`);
          } else {
            router.push("/shop");
          }
          setQuery("");
          setIsOpen(false);
          onClose?.();
        });
      }
    },
    [query, router, onClose]
  );

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search
          className="absolute left-3 w-4 h-4 text-brand-mist pointer-events-none"
          strokeWidth={1.5}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2.5 bg-brand-offWhite border border-brand-rose/20 rounded-full text-sm font-sans text-brand-ink placeholder:text-brand-mist focus:outline-none focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 text-brand-mist hover:text-brand-ink transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-luxury shadow-lg border border-brand-rose/10 overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="w-5 h-5 border-2 border-brand-rose/30 border-t-brand-rose rounded-full animate-spin mx-auto" />
              </div>
            ) : searchResults?.data.length ? (
              <div className="max-h-80 overflow-y-auto">
                {/* Prioritize Hero products first, then by relevance */}
                {searchResults.data
                  .slice()
                  .sort((a: Product, b: Product) => {
                    const aIsHero = a.badge?.toLowerCase().includes('hero') || 
                      (typeof a === 'object' && a !== null && 'isHero' in a && (a as { isHero?: boolean }).isHero);
                    const bIsHero = b.badge?.toLowerCase().includes('hero') || 
                      (typeof b === 'object' && b !== null && 'isHero' in b && (b as { isHero?: boolean }).isHero);
                    if (aIsHero && !bIsHero) return -1;
                    if (!aIsHero && bIsHero) return 1;
                    return 0;
                  })
                  .map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setQuery("");
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-brand-blush/20 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-brand-blush/20 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-brand-ink truncate">
                        {product.name}
                      </p>
                      <p className="font-sans text-[10px] text-brand-mist uppercase tracking-wider">
                        {product.category}
                      </p>
                    </div>
                    {/* Price */}
                    <span className="font-sans text-sm font-medium text-brand-ink">
                      ${product.price}
                    </span>
                  </Link>
                ))}
                {/* View All Results - Go to shop filtered by search */}
                {searchResults.hasMore && (
                  <Link
                    href="/shop"
                    onClick={() => {
                      setQuery("");
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className="block p-3 text-center font-sans text-xs text-brand-rose uppercase tracking-wider hover:bg-brand-blush/20 transition-colors border-t border-brand-rose/10"
                  >
                    View all results ({searchResults.total})
                  </Link>
                )}
              </div>
            ) : debouncedQuery.length >= 2 ? (
              <div className="p-6 text-center">
                <p className="font-sans text-sm text-brand-mist">
                  No products found for &quot;{query}&quot;
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
