"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductVariant } from "@/shared/types";
import { formatPrice } from "@/shared/lib/utils";
import { Button, StarRating, Badge } from "@/shared/ui";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { showToast } from "@/shared/providers/ToastProvider";
import { Minus, Plus, CreditCard, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.find((v) => v.isDefault) || product.variants?.[0]
  );
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearLastAddedItem = useCartStore((state) => state.clearLastAddedItem);
  const router = useRouter();

  // Calculate effective price and stock based on selected variant
  const effectivePrice = selectedVariant?.price ?? product.price;
  const effectiveOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const maxStock = selectedVariant?.stockCount ?? product.stockCount ?? 99;
  const isInStock = selectedVariant?.inStock ?? product.inStock ?? true;
  
  const discount = effectiveOriginalPrice
    ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
    : 0;

  // Reset quantity when variant changes if it exceeds new stock
  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (quantity > variant.stockCount) {
      setQuantity(variant.stockCount);
    }
    setShowStockWarning(false);
  };

  // Handle quantity changes with stock limits
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > maxStock) {
      setQuantity(maxStock);
      setShowStockWarning(true);
      setTimeout(() => setShowStockWarning(false), 3000);
    } else {
      setQuantity(Math.max(1, newQuantity));
      setShowStockWarning(false);
    }
  };

  // E-commerce Event Tracking Hook for GTM/Meta Pixel
  const trackBeginCheckout = useCallback((
    value: number,
    currency: string,
    items: string[]
  ): void => {
    // DataLayer push for Google Tag Manager (if available)
    if (typeof window !== "undefined") {
      const win = window as unknown as Window & { dataLayer?: unknown[] };
      if (win.dataLayer) {
        win.dataLayer.push({
          event: "begin_checkout",
          ecommerce: {
            value,
            currency,
            items: items.map((id) => ({
              item_id: id,
              item_name: product.name,
              price: effectivePrice,
              quantity: quantity,
            })),
          },
        });
      }
    }

    // Meta Pixel fbq call (if available)
    if (typeof window !== "undefined") {
      const win = window as unknown as Window & { fbq?: (...args: unknown[]) => void };
      if (win.fbq) {
        win.fbq("track", "InitiateCheckout", {
          value,
          currency,
          content_ids: items,
          content_type: "product",
        });
      }
    }
  }, [product.name, effectivePrice, quantity]);

  // Direct Checkout Funnel: Clear -> Add -> Redirect
  // SECURITY: Re-verifies stock even if DOM was tampered with
  const handleBuyNow = useCallback(async () => {
    // Primary guard (from state)
    if (!isInStock || isRedirecting) return;

    // SECURITY GUARD: Re-verify stock availability before proceeding
    // This prevents tampering where a malicious user removes the 'disabled' attribute
    const currentStock = selectedVariant?.stockCount ?? product.stockCount ?? 0;
    const currentInStock = selectedVariant?.inStock ?? product.inStock ?? true;
    
    if (!currentInStock || currentStock <= 0) {
      // Security violation detected - show error toast
      showToast({
        type: "error",
        title: "Unable to Process",
        message: "This item is currently unavailable. Please check back later.",
        duration: 5000,
      });
      return;
    }
    
    setIsRedirecting(true);
    
    try {
      // Create cart item with variant info
      const cartItem = {
        ...product,
        price: effectivePrice,
        originalPrice: effectiveOriginalPrice,
        selectedVariantId: selectedVariant?.id,
      };
      
      // 1. Clear cart for single-product funnel
      clearCart();
      
      // 2. Add current item
      addItem(cartItem, quantity, selectedVariant?.id);
      
      // 3. Clear toast notification
      clearLastAddedItem();
      
      // 4. Fire e-commerce tracking event before redirect
      trackBeginCheckout(effectivePrice, "USD", [product.id]);
      
      // 5. Redirect to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Buy Now error:", error);
      setIsRedirecting(false);
    }
  }, [isInStock, isRedirecting, product, effectivePrice, effectiveOriginalPrice, selectedVariant, quantity, clearCart, addItem, clearLastAddedItem, router, trackBeginCheckout]);

  // Expose handleBuyNow for StickyBuyBar via window event (cleaner than DOM hacking)
  // This runs once on mount to register the handler
  useState(() => {
    if (typeof window !== 'undefined') {
      (window as Window & { handleProductBuyNow?: () => void }).handleProductBuyNow = handleBuyNow;
    }
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Category */}
      <span className="label-luxury text-[10px] sm:text-xs">{product.category}</span>

      {/* Title */}
      <h1 className="font-serif text-2xl sm:text-3xl md:text-display text-brand-ink leading-tight">{product.name}</h1>

      {/* Rating */}
      <StarRating
        rating={product.rating}
        reviewCount={product.reviewCount}
        size="sm"
      />

      {/* Price */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        <span className="font-serif text-2xl sm:text-3xl text-brand-ink">
          {formatPrice(effectivePrice)}
        </span>
        {effectiveOriginalPrice && (
          <>
            <span className="text-base sm:text-lg text-brand-mist line-through">
              {formatPrice(effectiveOriginalPrice)}
            </span>
            <Badge variant="discount">{discount}% OFF</Badge>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="font-sans text-brand-slate text-xs sm:text-sm leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-brand-petal" />

      {/* Size/Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs sm:text-sm font-medium text-brand-ink">
              Select Size
            </span>
            <span className="font-sans text-xs text-brand-mist">
              {selectedVariant?.size}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant)}
                disabled={!variant.inStock}
                className={cn(
                  "relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-luxury font-sans text-xs sm:text-sm transition-all duration-300 min-w-[60px] sm:min-w-[72px]",
                  selectedVariant?.id === variant.id
                    ? "bg-brand-ink text-brand-offWhite ring-2 ring-brand-ink ring-offset-1 sm:ring-offset-2"
                    : variant.inStock
                    ? "bg-brand-offWhite border border-brand-rose/30 text-brand-ink active:border-brand-ink active:bg-brand-blush/30"
                    : "bg-brand-blush/20 border border-brand-rose/20 text-brand-mist cursor-not-allowed"
                )}
              >
                {variant.size}
                {!variant.inStock && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status - FOMO Style for Out of Stock */}
      {isInStock ? (
        <motion.div 
          initial={false}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-luxury self-start bg-emerald-50"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-sans text-[10px] sm:text-xs font-medium text-emerald-600">
            {maxStock <= 5 ? `Only ${maxStock} left` : "In Stock"}
          </span>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-blush/30 border border-brand-rose/20">
            <Sparkles className="w-4 h-4 text-brand-rose" />
            <span className="font-sans text-xs font-medium text-brand-ink">
              Limited Edition - Fully Claimed
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-brand-petal" />

      {/* Quantity Selector + Buy Now (Direct Checkout Funnel) */}
      <div id="product-buy-section" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Quantity - Only show when in stock */}
        {isInStock && (
          <div className="relative w-full sm:w-auto flex justify-center">
            <div className="flex items-center border border-brand-rose/30 rounded-full overflow-hidden">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-4 sm:px-4 py-3 sm:py-3 text-brand-ink active:bg-brand-blush transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="font-sans text-sm w-10 text-center text-brand-ink font-medium">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={!isInStock || quantity >= maxStock}
                className="px-4 sm:px-4 py-3 sm:py-3 text-brand-ink active:bg-brand-blush transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* Stock Warning */}
            <AnimatePresence>
              {showStockWarning && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 mt-2 text-xs text-amber-600 font-sans"
                >
                  Maximum {maxStock} items available
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Buy Now Button - Direct Checkout Funnel */}
        {isInStock ? (
          <Button
            data-buy-now
            size="lg"
            className="flex-1 gap-2 h-11 sm:h-auto min-h-[48px]"
            onClick={handleBuyNow}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting securely...</span>
              </>
            ) : (
              <>
                <CreditCard size={18} strokeWidth={1.5} />
                <span>Buy Now</span>
              </>
            )}
          </Button>
        ) : (
          <div className="flex-1 space-y-2">
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-blush/40 border border-brand-rose/20 text-brand-mist font-sans text-sm font-medium cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Sold Out - Join Waitlist
            </button>
            <p className="text-center font-sans text-[10px] text-brand-mist italic">
              Due to high demand, this item is currently reserved. Check back later.
            </p>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-2 sm:pt-4">
        {[
          { label: "Fast Shipping", sub: "2-3 Days" },
          { label: "100% Authentic", sub: "Genuine" },
          { label: "Easy Returns", sub: "30-day policy" },
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-[10px] sm:text-xs font-sans font-semibold text-brand-ink uppercase tracking-wider leading-tight">
              {badge.label}
            </span>
            <span className="text-[9px] sm:text-[10px] font-sans text-brand-mist mt-0.5 leading-tight">
              {badge.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
