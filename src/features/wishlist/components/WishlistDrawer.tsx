"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ShoppingBag, Heart, Trash2, Share2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "../store/useWishlistStore";
import { Product } from "@/shared/types";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { cn, formatPrice } from "@/shared/lib/utils";
import unsplashLoader from "@/shared/lib/unsplash-loader";

// Dior Vision Glass Effect - Ethereal & Premium
const glassStyles = "bg-white/60 backdrop-blur-3xl border border-white/50 shadow-[0_20px_60px_rgba(212,165,165,0.15)]";

// Dior Pink Palette
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const diorPink = {
  50: "#fdf2f2",
  100: "#fce7e7", 
  200: "#f8d0d0",
  300: "#f2b0b0",
  400: "#ea8585",
  500: "#d4a5a5", // brand-rose
  600: "#b88484",
  700: "#9a6a6a",
  800: "#7d5656",
  900: "#1a1a2e", // deep navy replaced with dark rose
};

// Smooth ethereal animation
const springTransition = { type: "spring" as const, damping: 30, stiffness: 280 };

export function WishlistDrawer() {
  const { items, isOpen, toggleWishlistDrawer, removeFromWishlist, moveToCart } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [shareOpen, setShareOpen] = useState(false);
  const totalValue = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* VisionOS Backdrop - Dior Pink Tint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={toggleWishlistDrawer}
              className="fixed inset-0 z-50 bg-gradient-to-br from-brand-blush/30 via-brand-rose/10 to-brand-mist/20 backdrop-blur-md"
            />

            {/* VisionOS Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={springTransition}
              className={cn(
                "fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] flex flex-col",
                glassStyles
              )}
            >
              {/* Header - Floating Glass */}
              <div className="flex-shrink-0 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Animated Heart Icon - Dior Style */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, ...springTransition }}
                      className="relative w-14 h-14 rounded-3xl bg-gradient-to-br from-brand-blush to-brand-rose/30 flex items-center justify-center shadow-[0_8px_24px_rgba(212,165,165,0.3)]"
                    >
                      <Heart className="w-6 h-6 text-brand-deepRose" fill="currentColor" />
                      {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-deepRose text-white text-[10px] font-medium rounded-full flex items-center justify-center shadow-lg">
                          {items.length}
                        </span>
                      )}
                    </motion.div>
                    <div>
                      <h2 className="font-serif text-xl text-brand-ink tracking-tight">Your Wishlist</h2>
                      <p className="text-sm text-brand-mist font-sans">
                        {items.length} {items.length === 1 ? "saved item" : "saved items"}
                      </p>
                    </div>
                  </div>

                  {/* Close Button - Dior Vision Style */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleWishlistDrawer}
                    className="w-10 h-10 rounded-full bg-brand-blush/50 hover:bg-brand-rose/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-brand-ink/70" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto min-h-0 px-6 sm:px-8">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                  >
                    {/* Empty State - Dior Vision Style */}
                    <div className="relative w-36 h-36 mb-8">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-blush/60 via-brand-rose/20 to-white shadow-[0_12px_40px_rgba(212,165,165,0.2)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="w-14 h-14 text-brand-rose/50" strokeWidth={1} />
                      </div>
                    </div>
                    <h3 className="font-serif text-xl text-brand-ink mb-3">Your waitlist is empty</h3>
                    <p className="text-sm text-brand-mist mb-8 max-w-[240px] leading-relaxed">
                      Save exclusive pieces to your personal waitlist. Be first to know when limited editions arrive.
                    </p>
                    <Link
                      href="/shop"
                      onClick={toggleWishlistDrawer}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-ink text-white rounded-full text-sm font-medium hover:bg-brand-deepRose transition-colors shadow-lg"
                    >
                      Explore Exclusives
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-4 pb-6">
                    <AnimatePresence mode="popLayout">
                      {items.map((item, index) => {
                        const isOutOfStock = item.inStock === false || item.stockCount === 0;
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.9 }}
                            transition={{ delay: index * 0.05, ...springTransition }}
                            className={cn(
                              "group relative bg-gradient-to-br rounded-3xl p-4 border shadow-[0_4px_20px_rgba(212,165,165,0.08)] hover:shadow-[0_8px_30px_rgba(212,165,165,0.15)] transition-all duration-300",
                              isOutOfStock 
                                ? "from-brand-blush/30 to-brand-rose/10 border-brand-rose/20"
                                : "from-white/80 to-brand-blush/20 border-white/80"
                            )}
                          >
                            {/* Waitlist Badge for Out-of-Stock */}
                            {isOutOfStock && (
                              <div className="absolute -top-2 left-4 bg-brand-ink text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-md">
                                Waitlist
                              </div>
                            )}
                            
                            <div className="flex gap-4">
                              {/* Product Image */}
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={toggleWishlistDrawer}
                                className={cn(
                                  "relative w-20 h-24 rounded-2xl overflow-hidden bg-brand-blush/30 flex-shrink-0 ring-2 ring-white/60",
                                  isOutOfStock && "opacity-80 grayscale-[30%]"
                                )}
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </Link>

                              {/* Product Info */}
                              <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                  <Link
                                    href={`/product/${item.slug}`}
                                    onClick={toggleWishlistDrawer}
                                    className="font-serif text-sm text-brand-ink line-clamp-2 hover:text-brand-deepRose transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="text-xs text-brand-mist mt-0.5 font-sans">{item.category}</p>
                                  
                                  {/* Waitlist Messaging */}
                                  {isOutOfStock && (
                                    <p className="text-[10px] text-brand-rose mt-1 font-medium">
                                      Limited availability · Join waitlist
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm text-brand-ink">
                                    {formatPrice(item.price)}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {/* Remove Button */}
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => removeFromWishlist(item.id)}
                                      className="p-2 text-brand-mist hover:text-brand-deepRose hover:bg-brand-blush/50 rounded-full transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                    
                                    {/* Add to Cart - Disabled for out of stock */}
                                    <motion.button
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => !isOutOfStock && moveToCart(item.id, addToCart)}
                                      disabled={isOutOfStock}
                                      className={cn(
                                        "p-2.5 rounded-full transition-colors shadow-md flex items-center gap-1.5",
                                        isOutOfStock
                                          ? "bg-brand-mist/30 text-brand-mist cursor-not-allowed"
                                          : "bg-brand-ink text-white hover:bg-brand-deepRose"
                                      )}
                                    >
                                      <ShoppingBag className="w-4 h-4" />
                                      {!isOutOfStock && <span className="text-xs pr-1">Add</span>}
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer - Dior Vision Glass - Compact */}
              {items.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-shrink-0 p-3 sm:p-5 border-t border-brand-blush/60 bg-gradient-to-t from-brand-blush/30 to-white/60 backdrop-blur-xl"
                >
                  {/* Total */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-brand-mist font-sans tracking-wide">Total Value</span>
                    <span className="text-lg sm:text-xl font-serif text-brand-ink">
                      {formatPrice(totalValue)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-1.5">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        items.forEach((item) => moveToCart(item.id, addToCart));
                        toggleWishlistDrawer();
                      }}
                      className="w-full py-2.5 sm:py-3 bg-brand-ink text-white rounded-full font-medium hover:bg-brand-deepRose transition-colors flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(212,165,165,0.3)]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-sm">Add All to Bag</span>
                    </motion.button>

                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShareOpen(true)}
                        className="flex-1 py-2 sm:py-2.5 bg-white/80 border border-brand-blush rounded-full font-medium text-brand-ink hover:bg-brand-blush/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Share</span>
                      </motion.button>
                      <Link
                        href="/shop"
                        onClick={toggleWishlistDrawer}
                        className="flex-1 py-2 sm:py-2.5 text-center text-brand-mist hover:text-brand-deepRose transition-colors font-sans text-xs"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share Sheet - VisionOS Style */}
      <ShareSheet 
        isOpen={shareOpen} 
        onClose={() => setShareOpen(false)} 
        items={items}
        totalValue={totalValue}
      />
    </>
  );
}

// VisionOS Share Sheet
function ShareSheet({ 
  isOpen, 
  onClose, 
  items, 
  totalValue 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: Product[]; 
  totalValue: number;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/wishlist` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={springTransition}
              className={cn(
                "w-full max-w-md rounded-[2rem] sm:rounded-3xl overflow-hidden border border-brand-blush/50 mb-2 sm:mb-0",
                "bg-gradient-to-b from-white/90 via-brand-blush/20 to-white/80 backdrop-blur-3xl",
                "shadow-[0_20px_60px_rgba(212,165,165,0.25)]"
              )}
            >
              {/* Handle */}
              <div className="pt-4 pb-2 sm:pb-3 flex justify-center">
                <div className="w-12 h-1.5 bg-brand-rose/40 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 sm:px-6 py-3 sm:py-4 border-b border-brand-blush/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg sm:text-xl text-brand-ink">Share Collection</h3>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-blush/50 hover:bg-brand-rose/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-brand-ink/70" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-brand-mist mt-1 font-sans">
                  {items.length} items · {formatPrice(totalValue)}
                </p>
              </div>

              {/* Preview */}
              <div className="px-5 sm:px-6 py-4 sm:py-5">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar">
                  {items.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-brand-blush/30 ring-2 ring-white/60"
                    >
                      <Image src={item.image} alt={item.name} fill className="object-cover" loader={unsplashLoader} unoptimized />
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy Link */}
              <div className="px-5 sm:px-6 pb-6 sm:pb-7">
                <div className="flex gap-2 w-full">
                  <div className="flex-1 flex items-center px-3 sm:px-4 py-3 sm:py-3.5 bg-brand-blush/30 rounded-xl sm:rounded-2xl border border-white/60 min-w-0">
                    <span className="text-xs sm:text-sm text-brand-mist truncate block w-full">{shareUrl}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={cn(
                      "px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm font-medium transition-colors flex-shrink-0",
                      copied 
                        ? "bg-green-500 text-white" 
                        : "bg-brand-ink text-white hover:bg-brand-deepRose"
                    )}
                  >
                    {copied ? "Copied" : "Copy"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
