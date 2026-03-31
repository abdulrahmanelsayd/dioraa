"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCouponStore } from "../store/useCouponStore";

interface CouponInputProps {
  cartTotal: number;
  cartItems: { id: string; price: number; quantity: number; category?: string }[];
  onOpenDrawer?: () => void;
  compact?: boolean;
}

export function CouponInput({ cartTotal, cartItems, onOpenDrawer, compact = false }: CouponInputProps) {
  const {
    couponInputValue,
    setCouponInputValue,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    validationError,
    clearValidation,
    getSuggestions,
  } = useCouponStore();

  const [isApplying, setIsApplying] = useState(false);

  const suggestions = getSuggestions(cartTotal, cartItems);
  const topSuggestion = suggestions[0];

  const handleApply = async () => {
    if (!couponInputValue.trim()) return;
    
    setIsApplying(true);
    clearValidation();
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    applyCoupon(couponInputValue, cartTotal, cartItems);
    setIsApplying(false);
  };

  const handleRemove = () => {
    removeCoupon();
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {appliedCoupon ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-brand-rose/10 to-brand-deepRose/10 rounded-luxury border border-brand-rose/30"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-rose flex items-center justify-center">
                <Tag size={12} className="text-white" />
              </div>
              <div>
                <span className="text-xs font-medium text-brand-rose">{appliedCoupon.coupon.code}</span>
                <span className="text-xs text-brand-slate ml-2">
                  -${appliedCoupon.discountAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-1 hover:bg-brand-rose/10 rounded-full transition-colors"
            >
              <X size={14} className="text-brand-rose" />
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-mist" size={14} />
                <input
                  type="text"
                  value={couponInputValue}
                  onChange={(e) => setCouponInputValue(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Coupon code"
                  className={cn(
                    "w-full pl-9 pr-3 py-2 border rounded-luxury text-xs font-mono tracking-wider uppercase",
                    "focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                    "placeholder:text-brand-mist/50",
                    validationError ? "border-red-300" : "border-brand-rose/20"
                  )}
                />
              </div>
              <button
                onClick={handleApply}
                disabled={!couponInputValue.trim() || isApplying}
                className={cn(
                  "px-4 py-2 rounded-luxury text-xs font-medium uppercase tracking-wider",
                  "transition-all duration-200",
                  !couponInputValue.trim()
                    ? "bg-brand-mist/20 text-brand-mist"
                    : "bg-brand-ink text-brand-offWhite hover:bg-brand-ink/90"
                )}
              >
                {isApplying ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
              </button>
            </div>

            {validationError && (
              <p className="text-[10px] text-red-500">{validationError}</p>
            )}

            {topSuggestion && !appliedCoupon && (
              <button
                onClick={onOpenDrawer}
                className="w-full flex items-center justify-between p-2 bg-brand-rose/5 rounded-luxury border border-brand-rose/20 hover:bg-brand-rose/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className="text-brand-rose" />
                  <span className="text-[10px] text-brand-rose font-medium">
                    {topSuggestion.message}
                  </span>
                </div>
                <ChevronRight size={12} className="text-brand-rose" />
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appliedCoupon ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-4 bg-gradient-to-r from-brand-rose/10 to-brand-deepRose/5 rounded-luxury border border-brand-rose/30"
        >
          {/* Decorative */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-rose/10" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-rose flex items-center justify-center">
                <Tag size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-ink">
                  {appliedCoupon.coupon.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-brand-rose font-bold">
                    {appliedCoupon.coupon.code}
                  </span>
                  <span className="text-xs text-brand-slate">
                    • Save ${appliedCoupon.discountAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-brand-rose/10 rounded-full transition-colors group"
            >
              <X size={16} className="text-brand-rose group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
              <Tag size={14} />
              Have a Coupon?
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponInputValue}
                  onChange={(e) => setCouponInputValue(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Enter code"
                  className={cn(
                    "w-full px-4 py-3 border rounded-luxury text-sm font-mono tracking-wider uppercase",
                    "focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                    "placeholder:text-brand-mist/50",
                    validationError ? "border-red-300 bg-red-50/50" : "border-brand-rose/20"
                  )}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                disabled={!couponInputValue.trim() || isApplying}
                className={cn(
                  "px-6 py-3 rounded-luxury font-sans text-sm font-medium uppercase tracking-wider",
                  "transition-all duration-200",
                  !couponInputValue.trim()
                    ? "bg-brand-mist/20 text-brand-mist cursor-not-allowed"
                    : "bg-brand-ink text-brand-offWhite hover:bg-brand-ink/90"
                )}
              >
                {isApplying ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Apply"
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-red-500 flex items-center gap-1"
                >
                  {validationError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !appliedCoupon && (
            <div className="space-y-2">
              <p className="text-xs text-brand-mist uppercase tracking-wider">
                Available Offers
              </p>
              <button
                onClick={onOpenDrawer}
                className="w-full p-3 bg-brand-rose/5 rounded-luxury border border-brand-rose/20 hover:bg-brand-rose/10 hover:border-brand-rose/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-rose/20 flex items-center justify-center">
                      <Sparkles size={14} className="text-brand-rose" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-brand-ink">
                        {suggestions.length} coupon{suggestions.length > 1 ? "s" : ""} available
                      </p>
                      <p className="text-xs text-brand-slate">
                        {topSuggestion?.message}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-brand-rose group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
