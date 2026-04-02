"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import { ShoppingBag, X, Search, Heart } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { SearchBar } from "./SearchBar";

// ============================================================================
// CUSTOM HOOKS - Extracted for reusability and cleaner component
// ============================================================================

/** Tracks scroll position with threshold */
function useScrollPosition(threshold: number = 50): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}

/** Detects clicks outside a referenced element */
function useClickOutside<T extends HTMLElement>(
  isActive: boolean,
  onClickOutside: () => void
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive, onClickOutside]);

  return ref;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Consolidated scroll tracking
  const scrolled = useScrollPosition(50);

  // Click outside handling for mobile menu
  const navRef = useClickOutside<HTMLElement>(mobileOpen, () => setMobileOpen(false));

  // Selective subscriptions - only derive the needed primitives to prevent re-renders
  const totalItems = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const toggleCart = useCartStore((state) => state.toggleCart);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const toggleWishlistDrawer = useWishlistStore((state) => state.toggleWishlistDrawer);

  // Consolidated route change handler - closes overlays on navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileOpen(false);
      setSearchOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-3 sm:py-4",
          "safe-top",
          {
            "glass-surface py-2 sm:py-3": scrolled || searchOpen,
            "bg-transparent": !scrolled && !searchOpen,
          }
        )}
      >
        <div className="section-padding mx-auto flex items-center justify-between gap-2">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-brand-ink p-2 touch-target rounded-lg active:bg-brand-blush/30 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "flex-shrink-0 z-10 transition-all duration-300 touch-target flex items-center",
              "absolute left-1/2 -translate-x-1/2 md:static md:transform-none md:left-auto",
              searchOpen ? "opacity-0 md:opacity-100 md:mr-4" : ""
            )}
          >
            <Image
              src="/LOGO.png"
              alt="DIORA"
              width={160}
              height={64}
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
              className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className={cn(
            "hidden md:flex items-center space-x-10 relative z-10 transition-all duration-300",
            searchOpen && "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
          )}>
            <Link
              href="/shop"
              className="text-lg font-serif font-normal hover:text-brand-rose transition-colors tracking-[0.08em] text-brand-ink/80"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-lg font-serif font-normal hover:text-brand-rose transition-colors tracking-[0.08em] text-brand-ink/80"
            >
              Story
            </Link>
            <Link
              href="/contact"
              className="text-lg font-serif font-normal hover:text-brand-rose transition-colors tracking-[0.08em] text-brand-ink/80"
            >
              Contact
            </Link>
          </div>

          {/* Right Actions: Search + Wishlist + Cart */}
          <div className="flex items-center gap-1 sm:gap-2 relative z-10">
            {/* Search Toggle (Desktop) — CSS transition instead of framer-motion */}
            {searchOpen ? (
              <div className="hidden md:block animate-fade-in">
                <SearchBar
                  className="w-64 lg:w-80"
                  onClose={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:block p-2 text-brand-ink hover:text-brand-rose transition-colors"
                aria-label="Open search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            )}

            {/* Wishlist Icon */}
            <button
              onClick={toggleWishlistDrawer}
              className="relative p-2 touch-target text-brand-ink hover:text-brand-rose transition-colors focus:outline-none active:bg-brand-blush/30 rounded-lg"
              aria-label="Open wishlist"
            >
              <Heart size={20} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand-rose text-white text-[10px] w-4 h-4 min-w-4 min-h-4 flex items-center justify-center rounded-full font-sans font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative p-2 touch-target text-brand-ink hover:text-brand-rose transition-colors focus:outline-none active:bg-brand-blush/30 rounded-lg"
              aria-label={`Open cart with ${totalItems} items`}
            >
              <ShoppingBag size={24} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-rose text-white text-[10px] w-5 h-5 min-w-5 min-h-5 flex items-center justify-center rounded-full font-sans font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay — CSS animation instead of framer-motion */}
        {mobileOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-brand-offWhite border-b border-brand-rose/10 shadow-lg md:hidden overflow-hidden safe-bottom animate-slide-in-left"
          >
            <div className="flex flex-col p-4 sm:p-6 space-y-2 sm:space-y-4">
              {/* Mobile Search */}
              <SearchBar
                className="w-full mb-4"
                onClose={() => setMobileOpen(false)}
              />

              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="text-xl font-serif tracking-[0.08em] hover:text-brand-rose transition-colors border-b border-brand-rose/10 pb-3 sm:pb-4 py-3 touch-target active:bg-brand-blush/20 rounded-lg"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="text-xl font-serif tracking-[0.08em] hover:text-brand-rose transition-colors border-b border-brand-rose/10 pb-3 sm:pb-4 py-3 touch-target active:bg-brand-blush/20 rounded-lg"
              >
                Story
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="text-xl font-serif tracking-[0.08em] hover:text-brand-rose transition-colors pb-2 py-3 touch-target active:bg-brand-blush/20 rounded-lg"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
