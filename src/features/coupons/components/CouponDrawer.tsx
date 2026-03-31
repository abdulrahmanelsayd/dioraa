"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronRight, Percent } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCouponStore } from "../store/useCouponStore";
import { CouponCard } from "./CouponCard";
import { useState } from "react";

interface CouponDrawerProps {
  cartTotal: number;
  cartItems: { id: string; price: number; quantity: number; category?: string }[];
  onApplySuccess?: () => void;
}

export function CouponDrawer({ cartTotal, cartItems, onApplySuccess }: CouponDrawerProps) {
  const {
    isCouponDrawerOpen,
    toggleCouponDrawer,
    couponInputValue,
    setCouponInputValue,
    appliedCoupon,
    availableCoupons,
    getSuggestions,
    applyCoupon,
    removeCoupon,
    validateCoupon,
    validationError,
    validationWarning,
    clearValidation,
  } = useCouponStore();

  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<"suggested" | "all">("suggested");

  const suggestions = getSuggestions(cartTotal, cartItems);

  const handleApplyCode = async () => {
    if (!couponInputValue.trim()) return;
    
    setIsApplying(true);
    clearValidation();
    
    // Simulate network delay for luxury feel
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const success = applyCoupon(couponInputValue, cartTotal, cartItems);
    
    if (success) {
      onApplySuccess?.();
    }
    
    setIsApplying(false);
  };

  const handleApplySuggestion = async (code: string) => {
    setIsApplying(true);
    clearValidation();
    
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const success = applyCoupon(code, cartTotal, cartItems);
    
    if (success) {
      onApplySuccess?.();
    }
    
    setIsApplying(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  return (
    <AnimatePresence>
      {isCouponDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCouponDrawer}
            className="fixed inset-0 bg-brand-ink/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-brand-offWhite z-50 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-brand-rose to-brand-deepRose p-6 text-white">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white" />
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl">Offers & Coupons</h2>
                    <p className="text-sm text-white/80">Unlock exclusive savings</p>
                  </div>
                </div>
                <button
                  onClick={toggleCouponDrawer}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Applied Coupon Banner */}
            {appliedCoupon && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-green-50 border-b border-green-200"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Percent size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {appliedCoupon.coupon.code} Applied
                      </p>
                      <p className="text-xs text-green-600">
                        You're saving ${appliedCoupon.discountAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-green-700 hover:text-green-800 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            )}

            {/* Manual Code Entry */}
            <div className="p-6 border-b border-brand-rose/20 bg-white">
              <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                Enter Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInputValue}
                    onChange={(e) => setCouponInputValue(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                    placeholder="Enter coupon code"
                    className={cn(
                      "w-full px-4 py-3 border rounded-luxury text-sm font-mono tracking-wider uppercase",
                      "focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                      "placeholder:text-brand-mist/50",
                      validationError ? "border-red-300 bg-red-50/50" : "border-brand-rose/20"
                    )}
                    disabled={!!appliedCoupon}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplyCode}
                  disabled={!couponInputValue.trim() || isApplying || !!appliedCoupon}
                  className={cn(
                    "px-6 py-3 rounded-luxury font-sans text-sm font-medium uppercase tracking-wider",
                    "transition-all duration-200",
                    !couponInputValue.trim() || appliedCoupon
                      ? "bg-brand-mist/20 text-brand-mist cursor-not-allowed"
                      : "bg-brand-ink text-brand-offWhite hover:bg-brand-ink/90"
                  )}
                >
                  {isApplying ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={18} />
                    </motion.div>
                  ) : (
                    "Apply"
                  )}
                </motion.button>
              </div>

              {/* Validation messages */}
              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-red-500 flex items-center gap-1"
                >
                  {validationError}
                </motion.p>
              )}
              
              {validationWarning && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-amber-600 flex items-center gap-1"
                >
                  {validationWarning}
                </motion.p>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-brand-rose/20 bg-white">
              <button
                onClick={() => setActiveTab("suggested")}
                className={cn(
                  "flex-1 py-3 text-sm font-sans font-medium uppercase tracking-wider transition-colors",
                  activeTab === "suggested"
                    ? "text-brand-rose border-b-2 border-brand-rose"
                    : "text-brand-mist hover:text-brand-ink"
                )}
              >
                For You ({suggestions.length})
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "flex-1 py-3 text-sm font-sans font-medium uppercase tracking-wider transition-colors",
                  activeTab === "all"
                    ? "text-brand-rose border-b-2 border-brand-rose"
                    : "text-brand-mist hover:text-brand-ink"
                )}
              >
                All Offers
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === "suggested" && (
                <>
                  {suggestions.length > 0 ? (
                    <>
                      <p className="text-xs text-brand-mist uppercase tracking-wider mb-4">
                        Recommended based on your cart
                      </p>
                      {suggestions.map((suggestion) => (
                        <motion.div
                          key={suggestion.coupon.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <CouponCard
                            coupon={suggestion.coupon}
                            isSuggested
                            savingsAmount={suggestion.savingsAmount}
                            onApply={() => handleApplySuggestion(suggestion.coupon.code)}
                            disabled={!suggestion.autoApplicable || !!appliedCoupon}
                          />
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-rose/10 flex items-center justify-center">
                        <Sparkles size={28} className="text-brand-rose/50" />
                      </div>
                      <h3 className="font-serif text-lg text-brand-ink mb-2">
                        No Suggestions Available
                      </h3>
                      <p className="text-sm text-brand-slate">
                        Add more items to your cart to unlock exclusive offers
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "all" && (
                <>
                  {availableCoupons
                    .filter((c) => c.status === "active")
                    .map((coupon) => {
                      const isApplied = appliedCoupon?.coupon.id === coupon.id;
                      const validation = validateCoupon(coupon.code, cartTotal, cartItems.length);
                      const suggestion = suggestions.find((s) => s.coupon.id === coupon.id);
                      
                      return (
                        <CouponCard
                          key={coupon.id}
                          coupon={coupon}
                          isApplied={isApplied}
                          savingsAmount={suggestion?.savingsAmount}
                          onApply={() => handleApplySuggestion(coupon.code)}
                          onRemove={handleRemoveCoupon}
                          disabled={!validation.valid && !isApplied}
                        />
                      );
                    })}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-brand-rose/20 bg-white">
              <button
                onClick={toggleCouponDrawer}
                className="w-full py-3 bg-brand-ink text-brand-offWhite rounded-full font-sans text-sm font-medium uppercase tracking-wider hover:bg-brand-ink/90 transition-colors flex items-center justify-center gap-2"
              >
                Continue Shopping
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
