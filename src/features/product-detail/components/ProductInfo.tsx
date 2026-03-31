"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductVariant } from "@/shared/types";
import { formatPrice } from "@/shared/lib/utils";
import { Button, StarRating, Badge } from "@/shared/ui";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { Minus, Plus, ShoppingBag, AlertCircle, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.find((v) => v.isDefault) || product.variants?.[0]
  );
  const [showStockWarning, setShowStockWarning] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);

  // Calculate effective price and stock based on selected variant
  const effectivePrice = selectedVariant?.price ?? product.price;
  const effectiveOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const maxStock = selectedVariant?.stockCount ?? product.stockCount ?? 99;
  const isInStock = selectedVariant?.inStock ?? product.inStock ?? true;
  
  const discount = effectiveOriginalPrice
    ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
    : 0;
  
  // Stock status display
  const getStockStatus = () => {
    if (!isInStock) return { text: "Out of Stock", color: "text-red-500", bg: "bg-red-50" };
    if (maxStock <= 5) return { text: `Only ${maxStock} left`, color: "text-amber-600", bg: "bg-amber-50" };
    if (maxStock <= 10) return { text: `Low Stock - ${maxStock} left`, color: "text-amber-600", bg: "bg-amber-50" };
    return { text: "In Stock", color: "text-emerald-600", bg: "bg-emerald-50" };
  };

  const stockStatus = getStockStatus();

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

  const handleAddToCart = () => {
    if (!isInStock) return;
    
    // Create cart item with variant info
    const cartItem = {
      ...product,
      price: effectivePrice,
      originalPrice: effectiveOriginalPrice,
      selectedVariantId: selectedVariant?.id,
    };
    
    addItem(cartItem, quantity);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <span className="label-luxury">{product.category}</span>

      {/* Title */}
      <h1 className="font-serif text-display text-brand-ink">{product.name}</h1>

      {/* Rating */}
      <StarRating
        rating={product.rating}
        reviewCount={product.reviewCount}
        size="md"
      />

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="font-serif text-3xl text-brand-ink">
          {formatPrice(effectivePrice)}
        </span>
        {effectiveOriginalPrice && (
          <>
            <span className="text-lg text-brand-mist line-through">
              {formatPrice(effectiveOriginalPrice)}
            </span>
            <Badge variant="discount">{discount}% OFF</Badge>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="font-sans text-brand-slate text-sm leading-relaxed max-w-lg">
          {product.description}
        </p>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-brand-petal" />

      {/* Size/Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm font-medium text-brand-ink">
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
                  "relative px-4 py-2 rounded-luxury font-sans text-sm transition-all duration-300",
                  selectedVariant?.id === variant.id
                    ? "bg-brand-ink text-brand-offWhite ring-2 ring-brand-ink ring-offset-2"
                    : variant.inStock
                    ? "bg-brand-offWhite border border-brand-rose/30 text-brand-ink hover:border-brand-ink"
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

      {/* Stock Status */}
      <motion.div 
        initial={false}
        animate={{ opacity: 1 }}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-luxury self-start",
          stockStatus.bg
        )}
      >
        {isInStock ? (
          <Check className={cn("w-4 h-4", stockStatus.color)} />
        ) : (
          <AlertCircle className={cn("w-4 h-4", stockStatus.color)} />
        )}
        <span className={cn("font-sans text-xs font-medium", stockStatus.color)}>
          {stockStatus.text}
        </span>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px bg-brand-petal" />

      {/* Quantity Selector + Add to Cart */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Quantity */}
        <div className="relative">
          <div className="flex items-center border border-brand-rose/30 rounded-full overflow-hidden self-start">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="px-4 py-3 text-brand-ink hover:bg-brand-blush transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
              className="px-4 py-3 text-brand-ink hover:bg-brand-blush transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

        {/* Add to Cart */}
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={!isInStock}
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          {isInStock ? "Add to Bag" : "Out of Stock"}
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-6 pt-4">
        {[
          { label: "Free Shipping", sub: "On orders over $75" },
          { label: "100% Authentic", sub: "Guaranteed genuine" },
          { label: "Easy Returns", sub: "30-day return policy" },
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col">
            <span className="text-xs font-sans font-semibold text-brand-ink uppercase tracking-wider">
              {badge.label}
            </span>
            <span className="text-[10px] font-sans text-brand-mist mt-0.5">
              {badge.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
