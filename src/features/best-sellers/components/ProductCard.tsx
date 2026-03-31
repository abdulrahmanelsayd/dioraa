"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductVariant } from "@/shared/types";
import { formatPrice } from "@/shared/lib/utils";
import { Badge, Button, StarRating } from "@/shared/ui";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import { Heart, ShoppingBag, Eye, ChevronDown, Check, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import { QuickViewModal } from "./QuickViewModal";
import { cn } from "@/shared/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.find((v) => v.isDefault) || product.variants?.[0]
  );
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const hasVariants = product.variants && product.variants.length > 0;

  // Calculate display price based on selected variant
  const displayPrice = useMemo(() => {
    return selectedVariant?.price ?? product.price;
  }, [selectedVariant, product.price]);

  const displayOriginalPrice = useMemo(() => {
    return selectedVariant?.originalPrice ?? product.originalPrice;
  }, [selectedVariant, product.originalPrice]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, selectedVariant?.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlistAnimating(true);
    toggleWishlist(product);
    setTimeout(() => setIsWishlistAnimating(false), 300);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <div className="group relative flex flex-col items-center">
      {/* Image Container with Premium Hover Effects */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full aspect-[4/5] bg-gradient-to-b from-brand-blush/20 to-brand-petal/30 overflow-hidden rounded-2xl mb-5 block shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-brand-rose/10"
      >
        {/* Premium Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        {/* Badges - Premium Positioning */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.isNew && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-3 py-1.5 bg-brand-ink text-white text-[10px] uppercase tracking-[0.15em] font-medium rounded-full backdrop-blur-sm"
            >
              New
            </motion.div>
          )}
          {product.badge && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1.5 bg-brand-rose text-white text-[10px] uppercase tracking-[0.15em] font-medium rounded-full backdrop-blur-sm"
            >
              {product.badge}
            </motion.div>
          )}
        </div>

        {/* Premium Action Buttons - Glassmorphism (Hover Only) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistToggle}
            className={cn(
              "p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg",
              isWishlisted 
                ? "bg-brand-rose text-white shadow-brand-rose/30" 
                : "bg-white/80 text-brand-ink hover:bg-brand-rose hover:text-white"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <motion.div
              animate={isWishlistAnimating ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
            </motion.div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickView}
            className="p-3 rounded-full bg-white/80 backdrop-blur-md text-brand-ink hover:bg-brand-ink hover:text-white shadow-lg transition-all duration-300"
            aria-label="Quick view"
          >
            <Eye size={18} strokeWidth={1.5} />
          </motion.button>
        </div>

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          placeholder="empty"
          quality={90}
          loading="lazy"
        />

        {/* Premium Floating Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <div className="flex flex-col gap-2">
            {/* Variant Selector - Premium Glassmorphism */}
            {hasVariants && (
              <div className="relative">
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowVariantDropdown(!showVariantDropdown);
                  }}
                  className="w-full bg-white/95 backdrop-blur-xl text-brand-ink text-xs py-2.5 px-4 rounded-xl shadow-lg border border-white/50 flex items-center justify-between hover:bg-white transition-all duration-300"
                >
                  <span className="font-medium tracking-wide">
                    {selectedVariant?.size || selectedVariant?.volume || "Select Size"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-rose font-semibold">{formatPrice(displayPrice)}</span>
                    <ChevronDown size={14} className={cn("transition-transform duration-300", showVariantDropdown && "rotate-180")} />
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {showVariantDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-white/98 backdrop-blur-xl rounded-xl shadow-2xl border border-brand-petal/30 overflow-hidden z-30"
                    >
                      {product.variants?.map((variant, idx) => (
                        <motion.button
                          key={variant.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedVariant(variant);
                            setShowVariantDropdown(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-3 text-xs flex items-center justify-between hover:bg-brand-blush/20 transition-all duration-200 border-b border-brand-petal/10 last:border-0",
                            selectedVariant?.id === variant.id && "bg-brand-blush/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                              selectedVariant?.id === variant.id ? "border-brand-rose" : "border-brand-mist"
                            )}>
                              {selectedVariant?.id === variant.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-brand-rose rounded-full"
                                />
                              )}
                            </div>
                            <span className="font-medium">{variant.size || variant.volume}</span>
                          </div>
                          <span className={cn(
                            "font-semibold",
                            selectedVariant?.id === variant.id ? "text-brand-rose" : "text-brand-ink"
                          )}>
                            {formatPrice(variant.price)}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Premium Add to Bag Button */}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-ink text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-brand-ink/20 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="font-medium tracking-wide">Add to Bag</span>
              <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
            </motion.button>
          </div>
        </div>
      </Link>

      {/* Premium Meta Text */}
      <div className="text-center w-full px-3">
        <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-brand-mist/80 block mb-1.5">
          {product.category}
        </span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg tracking-tight text-brand-ink mb-1.5 transition-colors duration-300 group-hover:text-brand-rose line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
          className="justify-center mb-2"
        />
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {displayOriginalPrice && (
            <span className="text-sm text-brand-mist/70 line-through">
              {formatPrice(displayOriginalPrice)}
            </span>
          )}
          <span className="font-sans text-base font-semibold text-brand-ink">
            {formatPrice(displayPrice)}
          </span>
          {hasVariants && (
            <span className="text-[10px] text-brand-mist/60 uppercase tracking-wider">
              {product.variants?.length} sizes
            </span>
          )}
        </div>
      </div>

      {/* Mobile Actions - Premium Styling */}
      <div className="mt-5 flex flex-col gap-2.5 md:hidden">
        {/* Mobile Variant Selector */}
        {hasVariants && (
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowVariantDropdown(!showVariantDropdown)}
              className="w-full bg-brand-offWhite/80 backdrop-blur-sm text-brand-ink text-sm py-3 px-4 rounded-xl flex items-center justify-between border border-brand-petal/30 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full border-2",
                  selectedVariant ? "border-brand-rose" : "border-brand-mist"
                )}>
                  {selectedVariant && <div className="w-full h-full rounded-full bg-brand-rose scale-[0.6]" />}
                </div>
                <span className="font-medium">
                  {selectedVariant?.size || selectedVariant?.volume || "Select Size"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-brand-rose">{formatPrice(displayPrice)}</span>
                <ChevronDown size={16} className={cn("text-brand-mist transition-transform duration-300", showVariantDropdown && "rotate-180")} />
              </div>
            </motion.button>
            
            <AnimatePresence>
              {showVariantDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-xl rounded-xl shadow-2xl border border-brand-petal/20 overflow-hidden z-30"
                >
                  {product.variants?.map((variant, idx) => (
                    <motion.button
                      key={variant.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setShowVariantDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-brand-blush/20 transition-all duration-200 border-b border-brand-petal/10 last:border-0",
                        selectedVariant?.id === variant.id && "bg-brand-blush/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          selectedVariant?.id === variant.id ? "border-brand-rose" : "border-brand-mist"
                        )}>
                          {selectedVariant?.id === variant.id && (
                            <motion.div layoutId="mobileCheck" className="w-2 h-2 bg-brand-rose rounded-full" />
                          )}
                        </div>
                        <span className="font-medium">{variant.size || variant.volume}</span>
                      </div>
                      <span className={cn(
                        "font-semibold",
                        selectedVariant?.id === variant.id ? "text-brand-rose" : "text-brand-ink"
                      )}>
                        {formatPrice(variant.price)}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Premium Mobile Action Buttons */}
        <div className="flex gap-2.5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => addItem(product, 1, selectedVariant?.id)}
            className="flex-1 bg-brand-ink text-white py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 font-medium tracking-wide"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            Add to Bag
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistToggle}
            className={cn(
              "p-3 rounded-xl border-2 transition-all duration-300",
              isWishlisted 
                ? "bg-brand-rose/10 border-brand-rose text-brand-rose" 
                : "bg-white border-brand-petal/50 text-brand-ink hover:border-brand-rose/50"
            )}
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
