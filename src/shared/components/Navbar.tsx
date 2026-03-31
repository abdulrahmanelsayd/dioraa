"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistDrawer = useWishlistStore((state) => state.toggleWishlistDrawer);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileOpen(false);
      setSearchOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("nav")) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileOpen]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4",
          {
            "glass-surface py-3": scrolled || searchOpen,
            "bg-transparent": !scrolled && !searchOpen,
          }
        )}
      >
        <div className="section-padding mx-auto flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-brand-ink p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "flex-shrink-0 relative z-10 transition-all duration-300",
              searchOpen ? "opacity-0 md:opacity-100 md:mr-4" : "mx-auto md:mx-0"
            )}
          >
            <h1 className="heading-display text-2xl md:text-3xl tracking-widest uppercase font-semibold text-brand-ink">
              Diora
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className={cn(
            "hidden md:flex items-center space-x-10 relative z-10 transition-all duration-300",
            searchOpen && "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
          )}>
            <Link
              href="/#bestsellers"
              className="text-sm font-sans font-medium hover:text-brand-rose transition-colors uppercase tracking-widest text-brand-ink/80"
            >
              Best Sellers
            </Link>
            <Link
              href="/category/skin-care"
              className="text-sm font-sans font-medium hover:text-brand-rose transition-colors uppercase tracking-widest text-brand-ink/80"
            >
              Skin Care
            </Link>
            <Link
              href="/category/hair-care"
              className="text-sm font-sans font-medium hover:text-brand-rose transition-colors uppercase tracking-widest text-brand-ink/80"
            >
              Hair Care
            </Link>
          </div>

          {/* Right Actions: Search + Wishlist + Cart + User */}
          <div className="flex items-center gap-2 relative z-10">
            {/* Search Toggle (Desktop) */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-bar"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="hidden md:block"
                >
                  <SearchBar
                    className="w-64 lg:w-80"
                    onClose={() => setSearchOpen(false)}
                  />
                </motion.div>
              ) : (
                <motion.button
                  key="search-icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:block p-2 text-brand-ink hover:text-brand-rose transition-colors"
                  aria-label="Open search"
                >
                  <Search size={20} strokeWidth={1.5} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Wishlist Icon */}
            <button
              onClick={toggleWishlistDrawer}
              className="relative p-2 text-brand-ink hover:text-brand-rose transition-colors focus:outline-none"
              aria-label="Open wishlist"
            >
              <Heart size={24} strokeWidth={1.5} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-brand-rose text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-sans font-bold translate-x-1 -translate-y-1">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-brand-ink hover:text-brand-rose transition-colors focus:outline-none"
              aria-label={`Open cart with ${totalItems} items`}
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-rose text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-sans font-bold translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute top-full left-0 right-0 bg-brand-offWhite border-b border-brand-rose/10 shadow-lg md:hidden overflow-hidden"
              >
                <div className="flex flex-col p-6 space-y-4">
                  {/* Mobile Search */}
                  <SearchBar
                    className="w-full mb-4"
                    onClose={() => setMobileOpen(false)}
                  />

                  <Link
                    href="/#bestsellers"
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-sans uppercase tracking-widest hover:text-brand-rose transition-colors border-b border-brand-rose/10 pb-4"
                  >
                    Best Sellers
                  </Link>
                  <Link
                    href="/category/skin-care"
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-sans uppercase tracking-widest hover:text-brand-rose transition-colors border-b border-brand-rose/10 pb-4"
                  >
                    Skin Care
                  </Link>
                  <Link
                    href="/category/hair-care"
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-sans uppercase tracking-widest hover:text-brand-rose transition-colors pb-2"
                  >
                    Hair Care
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LazyMotion>
      </nav>
    </>
  );
}
