"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Gift, 
  Truck, 
  Percent, 
  Crown,
  Check,
  Clock,
  Lock
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Coupon } from "../types";

interface CouponCardProps {
  coupon: Coupon;
  onApply?: () => void;
  onRemove?: () => void;
  isApplied?: boolean;
  isSuggested?: boolean;
  savingsAmount?: number;
  disabled?: boolean;
  compact?: boolean;
}

const iconMap = {
  sparkles: Sparkles,
  gift: Gift,
  truck: Truck,
  percent: Percent,
  crown: Crown,
};

const gradientClasses: Record<string, string> = {
  "from-brand-rose to-brand-deepRose": "bg-gradient-to-r from-brand-rose to-brand-deepRose",
  "from-amber-400 to-amber-600": "bg-gradient-to-r from-amber-400 to-amber-600",
  "from-emerald-400 to-teal-500": "bg-gradient-to-r from-emerald-400 to-teal-500",
  "from-purple-400 to-indigo-500": "bg-gradient-to-r from-purple-400 to-indigo-500",
  "from-pink-400 to-rose-500": "bg-gradient-to-r from-pink-400 to-rose-500",
  "from-red-400 to-orange-500": "bg-gradient-to-r from-red-400 to-orange-500",
  "from-slate-600 to-slate-800": "bg-gradient-to-r from-slate-600 to-slate-800",
};

export function CouponCard({
  coupon,
  onApply,
  onRemove,
  isApplied = false,
  isSuggested = false,
  savingsAmount = 0,
  disabled = false,
  compact = false,
}: CouponCardProps) {
  const Icon = iconMap[coupon.icon || "sparkles"];
  const gradientClass = gradientClasses[coupon.gradient || "from-brand-rose to-brand-deepRose"];
  
  const formatDiscount = () => {
    switch (coupon.type) {
      case "percentage":
        return `${coupon.value}% OFF`;
      case "fixed":
        return `$${coupon.value} OFF`;
      case "free_shipping":
        return "FREE SHIPPING";
      case "tiered":
        return "TIERED SAVINGS";
      case "buy_x_get_y":
        return `BUY ${coupon.buyXGetY?.buyQuantity} GET ${coupon.buyXGetY?.getQuantity}`;
      default:
        return "SPECIAL OFFER";
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative overflow-hidden rounded-luxury border",
          isApplied 
            ? "border-brand-rose/50 bg-brand-rose/5" 
            : "border-brand-rose/20 bg-white"
        )}
      >
        <div className="flex items-center gap-3 p-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            gradientClass
          )}>
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-xs font-semibold text-brand-ink truncate">
              {coupon.code}
            </p>
            <p className="text-[10px] text-brand-slate">
              {formatDiscount()}
            </p>
          </div>
          {isApplied && (
            <div className="w-6 h-6 rounded-full bg-brand-rose flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: isApplied ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-luxury border-2 transition-all duration-300",
        isApplied 
          ? "border-brand-rose shadow-lg shadow-brand-rose/20" 
          : isSuggested 
            ? "border-brand-rose/40 bg-gradient-to-br from-brand-rose/5 to-transparent"
            : "border-brand-rose/10 bg-white hover:border-brand-rose/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={cn(
          "absolute -top-16 -right-16 w-32 h-32 rounded-full",
          gradientClass
        )} />
      </div>
      
      {/* Coupon notch */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-6 bg-brand-offWhite rounded-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-6 bg-brand-offWhite rounded-full" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-luxury flex items-center justify-center text-white shadow-md",
              gradientClass
            )}>
              <Icon size={24} />
            </div>
            <div>
              {coupon.badge && (
                <span className={cn(
                  "inline-block px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider text-white mb-1",
                  gradientClass
                )}>
                  {coupon.badge}
                </span>
              )}
              <h3 className="font-serif text-lg text-brand-ink leading-tight">
                {coupon.name}
              </h3>
            </div>
          </div>
          
          {isApplied && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center"
            >
              <Check size={18} className="text-white" />
            </motion.div>
          )}
        </div>

        {/* Discount Value */}
        <div className="mb-4">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            gradientClass
          )}>
            <span className="text-white font-serif text-xl font-bold">
              {formatDiscount()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-brand-slate mb-4 leading-relaxed">
          {coupon.description}
        </p>

        {/* Restrictions */}
        {coupon.restrictions.minimumPurchase && (
          <p className="text-xs text-brand-mist mb-2">
            Min. purchase: ${coupon.restrictions.minimumPurchase}
          </p>
        )}
        
        {coupon.restrictions.maximumDiscount && coupon.type === "percentage" && (
          <p className="text-xs text-brand-mist mb-2">
            Max. discount: ${coupon.restrictions.maximumDiscount}
          </p>
        )}

        {/* Savings highlight */}
        {isSuggested && savingsAmount > 0 && (
          <div className="mb-4 p-3 bg-brand-rose/10 rounded-luxury border border-brand-rose/20">
            <p className="text-sm font-medium text-brand-rose">
              You'll save <span className="font-bold">${savingsAmount.toFixed(2)}</span> with this coupon
            </p>
          </div>
        )}

        {/* Code display */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 px-4 py-2 bg-brand-offWhite rounded-luxury border border-dashed border-brand-rose/30">
            <p className="font-mono text-sm text-brand-ink tracking-wider text-center">
              {coupon.code}
            </p>
          </div>
        </div>

        {/* Action button */}
        {!isApplied && onApply && (
          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onApply}
            disabled={disabled}
            className={cn(
              "w-full py-3 rounded-full font-sans text-sm font-medium uppercase tracking-wider",
              "transition-all duration-200",
              disabled
                ? "bg-brand-mist/20 text-brand-mist cursor-not-allowed"
                : "bg-brand-ink text-brand-offWhite hover:bg-brand-ink/90",
              "flex items-center justify-center gap-2"
            )}
          >
            {disabled ? (
              <>
                <Lock size={16} />
                Requirements not met
              </>
            ) : (
              "Apply Coupon"
            )}
          </motion.button>
        )}

        {isApplied && onRemove && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRemove}
            className={cn(
              "w-full py-3 rounded-full font-sans text-sm font-medium uppercase tracking-wider",
              "border-2 border-brand-rose/30 text-brand-rose",
              "hover:bg-brand-rose/5 transition-all duration-200"
            )}
          >
            Remove Coupon
          </motion.button>
        )}

        {/* Expiry warning */}
        {coupon.status === "active" && (
          <div className="mt-4 flex items-center gap-2 text-xs text-brand-mist">
            <Clock size={12} />
            <span>
              Valid until {new Date(coupon.validUntil).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
