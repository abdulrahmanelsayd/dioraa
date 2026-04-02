"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Bookmark, ArrowRight, Truck, Sparkles, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/useCartStore";
import { CartItem } from "@/shared/types";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import { useCouponStore } from "@/features/coupons/store/useCouponStore";
import { CouponDrawer } from "@/features/coupons/components";
import { cn, formatPrice } from "@/shared/lib/utils";
import unsplashLoader from "@/shared/lib/unsplash-loader";

// Dior Vision Glass Effect - Ethereal & Premium
const glassStyles = "bg-white/60 backdrop-blur-3xl border border-white/50 shadow-[0_20px_60px_rgba(212,165,165,0.15)]";

// Smooth ethereal animation
const springTransition = { type: "spring" as const, damping: 30, stiffness: 280 };

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.9 }
};

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem,
    addItem: addToCart
  } = useCartStore();

  const {
    items: savedItems,
    addToWishlist: saveForLater,
    removeFromWishlist: removeSavedItem,
    moveToCart
  } = useWishlistStore();

  const moveAllToCart = () => {
    savedItems.forEach(item => moveToCart(item.id, addToCart));
  };
  
  const toggleCouponDrawer = useCouponStore((state) => state.toggleCouponDrawer);
  const appliedCoupon = useCouponStore((state) => state.appliedCoupon);
  const getSuggestions = useCouponStore((state) => state.getSuggestions);
  
  const [activeTab, setActiveTab] = useState<"cart" | "saved">("cart");

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartItemsForCoupons = items.map(item => ({
    id: item.id,
    price: item.price,
    quantity: item.quantity,
  }));
  
  const couponSuggestions = getSuggestions(subtotal, cartItemsForCoupons);
  const topSuggestion = couponSuggestions[0];

  const handleSaveForLater = (item: CartItem) => {
    saveForLater(item);
    removeItem(item.id);
  };

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
              onClick={toggleCart}
              className="fixed inset-0 z-[60] bg-gradient-to-br from-brand-blush/30 via-brand-rose/10 to-brand-mist/20 backdrop-blur-md"
            />

            {/* VisionOS Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={springTransition}
              className={cn(
                "fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] flex flex-col",
                glassStyles
              )}
            >
              {/* Header - Floating Glass - Ultra Compact Mobile */}
              <div className="flex-shrink-0 p-2 sm:p-4 border-b border-brand-blush/40">
                <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                  <div className="flex items-center gap-2">
                    {/* Animated Bag Icon */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, ...springTransition }}
                      className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-blush to-brand-rose/30 flex items-center justify-center shadow-[0_6px_18px_rgba(212,165,165,0.3)]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-brand-deepRose" />
                      {totalItems > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-deepRose text-white text-[8px] font-medium rounded-full flex items-center justify-center shadow-sm">
                          {totalItems}
                        </span>
                      )}
                    </motion.div>
                    <div>
                      <h2 className="font-serif text-base sm:text-xl text-brand-ink tracking-tight">Your Bag</h2>
                      <p className="text-[11px] sm:text-xs text-brand-mist font-sans">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleCart}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-blush/50 hover:bg-brand-rose/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-ink/70" />
                  </motion.button>
                </div>

                {/* Tabs - Compact */}
                {(items.length > 0 || savedItems.length > 0) && (
                  <div className="flex gap-1 p-0.5 bg-brand-blush/30 rounded-full">
                    <button
                      onClick={() => setActiveTab("cart")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-[11px] font-sans uppercase tracking-wider transition-all touch-target ${
                        activeTab === "cart"
                          ? "bg-brand-ink text-white shadow-md"
                          : "text-brand-ink/60 hover:text-brand-ink"
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Cart
                      {totalItems > 0 && (
                        <span className="bg-brand-rose/30 text-brand-rose px-1 py-0 rounded-full text-[9px]">
                          {totalItems}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("saved")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-[11px] font-sans uppercase tracking-wider transition-all touch-target ${
                        activeTab === "saved"
                          ? "bg-brand-ink text-white shadow-md"
                          : "text-brand-ink/60 hover:text-brand-ink"
                      }`}
                    >
                      <Bookmark className="w-3 h-3" />
                      Saved
                      {savedItems.length > 0 && (
                        <span className="bg-brand-rose/30 text-brand-rose px-1 py-0 rounded-full text-[9px]">
                          {savedItems.length}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping Note - Compact */}
              <AnimatePresence mode="wait">
                {activeTab === "cart" && items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-brand-blush/30 via-brand-rose/5 to-brand-blush/30 border-b border-brand-blush/30"
                  >
                    <div className="flex items-center justify-between text-brand-ink/70">
                      <span className="font-sans text-[11px] text-brand-mist">
                        Shipping calculated at checkout
                      </span>
                      <Truck className="w-3.5 h-3.5 text-brand-rose" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <AnimatePresence mode="wait">
                  {/* CART TAB */}
                  {activeTab === "cart" && (
                    <motion.div
                      key="cart"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {items.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-col items-center justify-center h-full text-center py-12 px-6"
                        >
                          {/* Empty State - Dior Vision Style */}
                          <div className="relative w-32 h-32 mb-8">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-blush/60 via-brand-rose/20 to-white shadow-[0_12px_40px_rgba(212,165,165,0.2)]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ShoppingBag className="w-14 h-14 text-brand-rose/50" strokeWidth={1} />
                            </div>
                          </div>
                          <h3 className="font-serif text-xl text-brand-ink mb-3">Your bag is empty</h3>
                          <p className="text-sm text-brand-mist mb-8 max-w-[220px] leading-relaxed">
                            Discover our curated collection of luxury beauty
                          </p>
                          <Link
                            href="/shop"
                            onClick={toggleCart}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-ink text-white rounded-full text-sm font-medium hover:bg-brand-deepRose transition-colors shadow-lg"
                          >
                            Explore the Collection
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </motion.div>
                      ) : (
                        <div className="p-5 sm:p-6 space-y-4">
                          <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                              <motion.div
                                key={item.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                className="group relative bg-gradient-to-br from-white/80 to-brand-blush/20 rounded-3xl p-4 border border-white/80 shadow-[0_4px_20px_rgba(212,165,165,0.08)]"
                              >
                                <div className="flex gap-4">
                                  {/* Product Image */}
                                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-brand-blush/30 flex-shrink-0 ring-2 ring-white/60">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>

                                  {/* Product Info */}
                                  <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                      <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-serif text-sm text-brand-ink line-clamp-2 pr-2">
                                          {item.name}
                                        </h3>
                                        <div className="flex gap-1 flex-shrink-0">
                                          <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleSaveForLater(item)}
                                            className="p-1.5 text-brand-mist hover:text-brand-rose hover:bg-brand-blush/50 rounded-full transition-colors"
                                          >
                                            <Bookmark className="w-4 h-4" />
                                          </motion.button>
                                          <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeItem(item.id)}
                                            className="p-1.5 text-brand-mist hover:text-brand-deepRose hover:bg-rose-50 rounded-full transition-colors"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </motion.button>
                                        </div>
                                      </div>
                                      <span className="text-xs text-brand-mist mt-0.5 block">{item.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center border border-brand-blush/50 rounded-full overflow-hidden bg-white">
                                        <button
                                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                          className="px-2.5 py-1.5 text-brand-ink hover:bg-brand-blush/30 transition-colors"
                                        >
                                          <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="font-sans text-xs w-6 text-center text-brand-ink font-medium">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="px-2.5 py-1.5 text-brand-ink hover:bg-brand-blush/30 transition-colors"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <span className="font-medium text-sm text-brand-ink">
                                        {formatPrice(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* SAVED TAB */}
                  {activeTab === "saved" && (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      {savedItems.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-col items-center justify-center h-full text-center py-12 px-6"
                        >
                          <div className="relative w-32 h-32 mb-8">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-blush/60 via-brand-rose/20 to-white shadow-[0_12px_40px_rgba(212,165,165,0.2)]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Bookmark className="w-14 h-14 text-brand-rose/50" strokeWidth={1} />
                            </div>
                          </div>
                          <h3 className="font-serif text-xl text-brand-ink mb-3">Saved for later</h3>
                          <p className="text-sm text-brand-mist mb-8 max-w-[220px]">
                            Items you save will appear here for easy access
                          </p>
                          <button
                            onClick={() => setActiveTab("cart")}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-brand-ink text-brand-ink rounded-full text-sm font-medium hover:bg-brand-ink hover:text-white transition-colors"
                          >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Back to Cart
                          </button>
                        </motion.div>
                      ) : (
                        <div className="p-5 sm:p-6">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-brand-mist font-sans">
                              {savedItems.length} {savedItems.length === 1 ? "item" : "items"} saved
                            </p>
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={moveAllToCart}
                              className="text-xs font-sans text-brand-rose hover:text-brand-deepRose transition-colors flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Move all
                            </motion.button>
                          </div>

                          <div className="space-y-4">
                            <AnimatePresence>
                              {savedItems.map((item, index) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                                  transition={{ delay: index * 0.08, duration: 0.4 }}
                                  layout
                                  className="flex gap-3 p-3 rounded-2xl bg-white/50 border border-brand-blush/30 hover:border-brand-blush/60 hover:shadow-md transition-all"
                                >
                                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-brand-blush/20 flex-shrink-0 ring-2 ring-white/60">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" loader={unsplashLoader} unoptimized />
                                  </div>
                                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                    <div className="min-w-0">
                                      <h3 className="font-serif text-sm text-brand-ink line-clamp-2">{item.name}</h3>
                                      <span className="text-xs text-brand-mist mt-0.5 block">{item.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm text-brand-ink">
                                        {formatPrice(item.price)}
                                      </span>
                                      <div className="flex gap-1">
                                        <motion.button
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => moveToCart(item.id, addToCart)}
                                          className="px-3 py-1.5 bg-brand-ink text-white text-xs font-sans rounded-full hover:bg-brand-deepRose transition-colors"
                                        >
                                          Add
                                        </motion.button>
                                        <motion.button
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => removeSavedItem(item.id)}
                                          className="p-1.5 text-brand-mist hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer - Dior Vision Glass - Ultra Compact */}
              <AnimatePresence>
                {activeTab === "cart" && items.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-shrink-0 p-2 sm:p-4 border-t border-brand-blush/60 bg-gradient-to-t from-brand-blush/30 to-white/60 backdrop-blur-xl"
                  >
                    {/* Applied Coupon or Suggestion */}
                    {appliedCoupon ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-1 p-1 sm:p-1.5 bg-gradient-to-r from-brand-rose/10 to-brand-deepRose/5 rounded-lg border border-brand-rose/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-rose" />
                            <span className="text-[10px] sm:text-[11px] font-medium text-brand-rose">
                              {appliedCoupon.coupon.code}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-brand-mist">
                              -${appliedCoupon.discountAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : topSuggestion && (
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={toggleCouponDrawer}
                        className="mb-1 w-full p-1 sm:p-1.5 bg-brand-rose/5 rounded-lg border border-brand-rose/20 hover:bg-brand-rose/10 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-rose" />
                            <span className="text-[10px] sm:text-[11px] text-brand-rose font-medium truncate">
                              {topSuggestion.message}
                            </span>
                          </div>
                          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-rose flex-shrink-0" />
                        </div>
                      </motion.button>
                    )}

                    {/* Subtotal */}
                    <div className="flex justify-between items-center mb-1 sm:mb-1.5">
                      <span className="text-[10px] sm:text-[11px] text-brand-mist font-sans">Subtotal</span>
                      <motion.span 
                        key={subtotal}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-sm sm:text-base font-serif text-brand-ink"
                      >
                        {formatPrice(Math.max(0, subtotal - (appliedCoupon?.discountAmount || 0)))}
                      </motion.span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-0.5 sm:space-y-1">
                      <Link
                        href="/checkout"
                        onClick={toggleCart}
                        className="block w-full py-3 sm:py-4 bg-brand-ink text-white rounded-full font-semibold hover:bg-brand-deepRose transition-all text-center text-sm sm:text-base tracking-wide shadow-[0_8px_24px_rgba(212,165,165,0.4)]"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                          Proceed to Secure Checkout
                        </span>
                      </Link>

                      <Link
                        href="/shop"
                        onClick={toggleCart}
                        className="block text-center text-[10px] sm:text-xs text-brand-mist hover:text-brand-deepRose transition-colors py-1.5 sm:py-2"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Coupon Drawer */}
      <CouponDrawer 
        cartTotal={subtotal}
        cartItems={cartItemsForCoupons}
      />
    </>
  );
}
