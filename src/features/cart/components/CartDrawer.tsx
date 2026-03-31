"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Gift, Truck, Bookmark, ArrowRight, Sparkles, Tag, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/useCartStore";
import { useCouponStore } from "@/features/coupons/store/useCouponStore";
import { CouponDrawer } from "@/features/coupons/components";
import { Button } from "@/shared/ui";
import { formatPrice } from "@/shared/lib/utils";
import { CartUpsell } from "./CartUpsell";

const FREE_SHIPPING_THRESHOLD = 75;

// Luxury animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.9 }
};

export function CartDrawer() {
  const { 
    items, 
    savedItems,
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem,
    saveForLater,
    moveToCart,
    removeSavedItem,
    moveAllToCart
  } = useCartStore();
  
  const toggleCouponDrawer = useCouponStore((state) => state.toggleCouponDrawer);
  const appliedCoupon = useCouponStore((state) => state.appliedCoupon);
  const getSuggestions = useCouponStore((state) => state.getSuggestions);
  
  const [activeTab, setActiveTab] = useState<"cart" | "saved">("cart");
  const [justSaved, setJustSaved] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const hasReachedFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  
  const cartItemsForCoupons = items.map(item => ({
    id: item.id,
    price: item.price,
    quantity: item.quantity,
  }));
  
  const couponSuggestions = getSuggestions(subtotal, cartItemsForCoupons);
  const topSuggestion = couponSuggestions[0];

  const handleSaveForLater = (productId: string) => {
    saveForLater(productId);
    setJustSaved(productId);
    setTimeout(() => setJustSaved(null), 1500);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with enhanced blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 z-50 bg-brand-ink/50 backdrop-blur-md"
            />

            {/* Luxury Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-gradient-to-b from-brand-offWhite via-white to-brand-blush/10 shadow-2xl flex flex-col border-l border-brand-rose/20"
            >
              {/* Luxury Header with Tabs */}
              <div className="flex flex-col p-6 border-b border-brand-rose/20 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <Sparkles className="w-5 h-5 text-brand-rose" />
                    </motion.div>
                    <h2 className="font-serif text-2xl text-brand-ink tracking-tight">Your Bag</h2>
                  </div>
                  <button
                    onClick={toggleCart}
                    className="p-2 text-brand-ink/60 hover:text-brand-ink hover:bg-brand-blush/30 rounded-full transition-all duration-300"
                    aria-label="Close cart"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Luxury Tab Navigation */}
                {(items.length > 0 || savedItems.length > 0) && (
                  <div className="flex gap-1 p-1 bg-brand-blush/20 rounded-full">
                    <button
                      onClick={() => setActiveTab("cart")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-sans uppercase tracking-wider transition-all duration-500 ${
                        activeTab === "cart"
                          ? "bg-brand-ink text-white shadow-lg"
                          : "text-brand-ink/60 hover:text-brand-ink"
                      }`}
                    >
                      <ShoppingBag size={14} />
                      Cart
                      {totalItems > 0 && (
                        <span className="bg-brand-rose/20 text-brand-rose px-1.5 py-0.5 rounded-full text-[10px]">
                          {totalItems}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("saved")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-sans uppercase tracking-wider transition-all duration-500 ${
                        activeTab === "saved"
                          ? "bg-brand-ink text-white shadow-lg"
                          : "text-brand-ink/60 hover:text-brand-ink"
                      }`}
                    >
                      <Bookmark size={14} />
                      Saved
                      {savedItems.length > 0 && (
                        <span className="bg-brand-rose/20 text-brand-rose px-1.5 py-0.5 rounded-full text-[10px]">
                          {savedItems.length}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Free Shipping Progress - Only in Cart Tab */}
              <AnimatePresence mode="wait">
                {activeTab === "cart" && items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-6 py-4 bg-gradient-to-r from-brand-blush/30 via-brand-rose/5 to-brand-blush/30 border-b border-brand-rose/10"
                  >
                    {hasReachedFreeShipping ? (
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-brand-rose"
                      >
                        <Gift className="w-4 h-4" />
                        <span className="font-sans text-xs uppercase tracking-wider font-medium">
                          Complimentary shipping unlocked
                        </span>
                      </motion.div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs text-brand-ink/70">
                            Add <span className="font-semibold text-brand-rose">{formatPrice(remainingForFreeShipping)}</span> for complimentary shipping
                          </span>
                          <Truck className="w-4 h-4 text-brand-rose" />
                        </div>
                        <div className="h-1 bg-brand-rose/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${freeShippingProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-brand-rose to-brand-deepRose rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
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
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blush/40 to-brand-rose/20 flex items-center justify-center mb-6"
                          >
                            <ShoppingBag className="w-10 h-10 text-brand-rose" />
                          </motion.div>
                          <p className="font-serif text-xl text-brand-ink mb-2">Your bag awaits</p>
                          <p className="font-sans text-sm text-brand-mist mb-6 max-w-xs">
                            Discover our curated collection of luxury beauty
                          </p>
                          <Link
                            href="/#bestsellers"
                            onClick={toggleCart}
                            className="inline-flex items-center justify-center px-8 py-3 bg-brand-ink text-brand-offWhite font-sans text-xs uppercase tracking-widest rounded-full hover:bg-brand-ink/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
                          >
                            Explore Collection
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="p-6 space-y-6">
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
                                  className="flex gap-4 group"
                                >
                                  <div className="relative w-24 h-32 bg-brand-blush/20 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-brand-rose/10">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                  </div>
                                  <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                      <div className="flex justify-between items-start">
                                        <h3 className="font-serif font-medium text-brand-ink leading-tight pr-4">
                                          {item.name}
                                        </h3>
                                        <div className="flex gap-1">
                                          {/* Save for Later Button */}
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleSaveForLater(item.id)}
                                            className="p-1.5 text-brand-ink/40 hover:text-brand-rose hover:bg-brand-blush/30 rounded-full transition-all"
                                            title="Save for later"
                                          >
                                            <Bookmark size={16} />
                                          </motion.button>
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeItem(item.id)}
                                            className="p-1.5 text-brand-ink/40 hover:text-brand-deepRose hover:bg-red-50 rounded-full transition-all"
                                          >
                                            <Trash2 size={16} />
                                          </motion.button>
                                        </div>
                                      </div>
                                      <span className="text-[10px] uppercase tracking-widest text-brand-ink/60 mt-1 block">
                                        {item.category}
                                      </span>
                                      {item.selectedVariantId && (
                                        <span className="text-[10px] text-brand-rose mt-0.5 block">
                                          Size: {item.selectedVariantId}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                      <div className="flex items-center border border-brand-rose/30 rounded-full overflow-hidden bg-white">
                                        <button
                                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                          className="px-3 py-1.5 text-brand-ink hover:bg-brand-blush transition-colors"
                                        >
                                          <Minus size={14} />
                                        </button>
                                        <span className="font-sans text-xs w-8 text-center text-brand-ink font-medium">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="px-3 py-1.5 text-brand-ink hover:bg-brand-blush transition-colors"
                                        >
                                          <Plus size={14} />
                                        </button>
                                      </div>
                                      <span className="font-mono text-sm font-semibold text-brand-ink">
                                        {formatPrice(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                          {/* Upsell Section */}
                          <CartUpsell currentProductIds={items.map((item) => item.id)} />
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* SAVED TAB - Luxury Implementation */}
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
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blush/40 to-brand-rose/10 flex items-center justify-center mb-6"
                          >
                            <Bookmark className="w-10 h-10 text-brand-rose/60" />
                          </motion.div>
                          <p className="font-serif text-xl text-brand-ink mb-2">Saved for later</p>
                          <p className="font-sans text-sm text-brand-mist mb-6 max-w-xs">
                            Items you save will appear here for easy access
                          </p>
                          <button
                            onClick={() => setActiveTab("cart")}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-brand-ink/20 text-brand-ink font-sans text-xs uppercase tracking-widest rounded-full hover:bg-brand-ink hover:text-white transition-all duration-300"
                          >
                            <ArrowRight size={14} className="rotate-180" />
                            Back to Cart
                          </button>
                        </div>
                      ) : (
                        <div className="p-6">
                          {/* Header */}
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between mb-6"
                          >
                            <p className="text-xs text-brand-mist font-sans">
                              {savedItems.length} {savedItems.length === 1 ? "item" : "items"} saved
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={moveAllToCart}
                              className="text-xs font-sans text-brand-rose hover:text-brand-deepRose transition-colors flex items-center gap-1"
                            >
                              <ShoppingBag size={14} />
                              Move all to bag
                            </motion.button>
                          </motion.div>

                          {/* Saved Items List */}
                          <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                              {savedItems.map((item, index) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                                  transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                  layout
                                  className="flex gap-4 p-3 rounded-xl bg-white border border-brand-rose/10 hover:border-brand-rose/30 hover:shadow-lg transition-all duration-300 group"
                                >
                                  <div className="relative w-20 h-24 bg-brand-blush/10 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 flex flex-col justify-between py-0.5">
                                    <div>
                                      <h3 className="font-serif text-sm text-brand-ink leading-tight">
                                        {item.name}
                                      </h3>
                                      <span className="text-[10px] uppercase tracking-widest text-brand-ink/50 mt-0.5 block">
                                        {item.category}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono text-sm font-semibold text-brand-ink">
                                        {formatPrice(item.price)}
                                      </span>
                                      <div className="flex gap-1">
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => moveToCart(item.id)}
                                          className="px-3 py-1.5 bg-brand-ink text-white text-xs font-sans rounded-full hover:bg-brand-deepRose transition-colors flex items-center gap-1"
                                        >
                                          <ShoppingBag size={12} />
                                          Add
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => removeSavedItem(item.id)}
                                          className="p-1.5 text-brand-ink/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        >
                                          <Trash2 size={14} />
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>

                          {/* Elegant Bottom Note */}
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center text-[10px] text-brand-mist mt-8 font-sans"
                          >
                            Saved items are reserved for 30 days
                          </motion.p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer - Only show in Cart tab with items */}
              <AnimatePresence>
                {activeTab === "cart" && items.length > 0 && (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="p-6 border-t border-brand-rose/20 bg-white/90 backdrop-blur-xl"
                  >
                    {/* Applied Coupon or Suggestion */}
                    {appliedCoupon ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-gradient-to-r from-brand-rose/10 to-brand-deepRose/5 rounded-luxury border border-brand-rose/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag size={14} className="text-brand-rose" />
                            <span className="text-xs font-medium text-brand-rose">
                              {appliedCoupon.coupon.code}
                            </span>
                            <span className="text-xs text-brand-slate">
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
                        className="mb-4 w-full p-3 bg-brand-rose/5 rounded-luxury border border-brand-rose/20 hover:bg-brand-rose/10 hover:border-brand-rose/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-brand-rose" />
                            <span className="text-xs text-brand-rose font-medium">
                              {topSuggestion.message}
                            </span>
                          </div>
                          <ChevronRight size={14} className="text-brand-rose group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.button>
                    )}

                    {/* Subtotal */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-sans uppercase tracking-widest text-sm text-brand-ink/80">
                        Subtotal
                      </span>
                      <motion.span 
                        key={subtotal}
                        initial={{ scale: 1.2, color: "#d4a5a5" }}
                        animate={{ scale: 1, color: "#1a1a2e" }}
                        className="font-serif text-2xl text-brand-ink"
                      >
                        {formatPrice(subtotal - (appliedCoupon?.discountAmount || 0))}
                      </motion.span>
                    </div>

                    {/* Shipping Note */}
                    <div className="flex items-center justify-between mb-6 text-brand-mist">
                      <span className="font-sans text-xs">
                        {hasReachedFreeShipping ? (
                          <span className="text-brand-rose flex items-center gap-1">
                            <Truck className="w-3 h-3" /> Complimentary shipping
                          </span>
                        ) : (
                          "Shipping calculated at checkout"
                        )}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <Link href="/checkout" onClick={toggleCart}>
                      <Button className="w-full text-lg tracking-wide uppercase shadow-lg hover:shadow-xl transition-shadow">
                        Proceed to Checkout
                      </Button>
                    </Link>

                    {/* Continue Shopping */}
                    <Link
                      href="/#bestsellers"
                      onClick={toggleCart}
                      className="block text-center text-xs text-brand-mist hover:text-brand-rose transition-colors mt-4 font-sans uppercase tracking-wider"
                    >
                      Continue Shopping
                    </Link>
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
