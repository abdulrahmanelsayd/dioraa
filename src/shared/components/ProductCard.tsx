"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Heart, Lock } from "lucide-react";
import { cn, formatPrice } from "@/shared/lib/utils";
import type { Product } from "@/shared/types/product";
import { useState, useCallback } from "react";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
  className?: string;
  onHover?: () => void;
}

export function ProductCard({ product, index = 0, priority = false, className, onHover }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);
  const isHalo = product.inStock === false || product.stockCount === 0;

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product, 1);
  }, [product, addItem]);

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }, [product, toggleWishlist]);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const hasDiscount = discount > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn("group", className)}
    >
      {/* Image Container - Clean gray background like Zara */}
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] mb-3"
        onMouseEnter={onHover}
      >
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Action Buttons - Quick Add, Wishlist, Quick View */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {/* Wishlist Heart - Only show on hover */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "w-8 h-8 flex items-center justify-center",
              "bg-white rounded-full",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-200",
              "hover:bg-gray-100",
              isWishlisted && "bg-brand-rose text-white hover:bg-brand-deepRose"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={16} 
              strokeWidth={1.5} 
              className={cn(
                isWishlisted ? "text-white fill-current" : "text-gray-800"
              )} 
            />
          </button>

          {/* Quick Add or Waitlist Indicator */}
          {isHalo ? (
            <button
              disabled
              className={cn(
                "w-8 h-8 flex items-center justify-center",
                "bg-gray-200 rounded-full",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200",
                "cursor-not-allowed"
              )}
              aria-label="Sold out - join waitlist"
            >
              <Lock size={16} strokeWidth={1.5} className="text-gray-500" />
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className={cn(
                "w-8 h-8 flex items-center justify-center",
                "bg-white rounded-full",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200",
                "hover:bg-gray-100"
              )}
              aria-label="Add to cart"
            >
              <Plus size={18} strokeWidth={1.5} className="text-gray-800" />
            </button>
          )}
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-brand-ink text-white text-[10px] font-medium uppercase tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Halo/Waitlist Badge */}
        {isHalo && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-gray-500/80 text-white text-[10px] font-medium uppercase tracking-wider">
            Waitlist
          </div>
        )}
      </div>

      {/* Product Info - Clean minimal text */}
      <div className="space-y-1">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide truncate hover:underline">
            {product.name}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
