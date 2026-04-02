"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { CreditCard, Loader2, Sparkles } from "lucide-react";
import { formatPrice } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

interface StickyBuyBarProps {
  productName: string;
  price: number;
  originalPrice?: number;
  isInStock: boolean;
}

export function StickyBuyBar({
  productName,
  price,
  originalPrice,
  isInStock,
}: StickyBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Show bar when user scrolls past the main buy button
    const handleScroll = () => {
      const mainBuySection = document.getElementById("product-buy-section");
      if (mainBuySection) {
        const rect = mainBuySection.getBoundingClientRect();
        // Show when main button is scrolled out of view
        setIsVisible(rect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuyNow = useCallback(async () => {
    if (!isInStock || isProcessing) return;
    
    setIsProcessing(true);
    
    // Call the global handler registered by ProductInfo
    const globalHandler = (window as Window & { handleProductBuyNow?: () => void }).handleProductBuyNow;
    
    if (globalHandler) {
      try {
        await globalHandler();
      } catch {
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
    }
  }, [isInStock, isProcessing]);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-brand-rose/20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
              {/* Price Info - Only show when in stock */}
              {isInStock ? (
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs text-brand-mist truncate">
                    {productName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg text-brand-ink">
                      {formatPrice(price)}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-brand-mist line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-xs text-emerald-600 font-medium">
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs text-brand-mist truncate">
                    {productName}
                  </p>
                  <p className="font-sans text-xs text-brand-rose font-medium">
                    Limited Edition - Fully Claimed
                  </p>
                </div>
              )}

              {/* Buy Now Button - Direct Checkout */}
              {isInStock ? (
                <button
                  onClick={handleBuyNow}
                  disabled={isProcessing}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full",
                    "bg-brand-ink text-white font-sans text-sm font-medium",
                    "hover:bg-brand-ink/90 active:scale-95 transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                    "shadow-lg shadow-brand-ink/20"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirecting...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      <span>Buy Now</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-full",
                    "bg-brand-blush/40 border border-brand-rose/20 text-brand-mist",
                    "font-sans text-sm font-medium cursor-not-allowed"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sold Out</span>
                </button>
              )}
            </div>
          </div>
          {/* Safe area padding for mobile */}
          <div className="h-safe-area-inset-bottom bg-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
