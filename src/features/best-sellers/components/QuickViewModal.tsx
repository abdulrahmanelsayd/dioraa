"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Heart, Minus, Plus, Truck, Shield } from "lucide-react";
import { Product, ProductVariant } from "@/shared/types";
import { formatPrice } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.find((v) => v.isDefault) || product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [mounted, setMounted] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const images = product.images?.length ? product.images : [product.image];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedVariant(product.variants?.find((v) => v.isDefault) || product.variants?.[0]);
      setQuantity(1);
      setActiveImage(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, product.variants]);

  const displayPrice = useMemo(() => {
    return selectedVariant?.price ?? product.price;
  }, [selectedVariant, product.price]);

  const displayOriginalPrice = useMemo(() => {
    return selectedVariant?.originalPrice ?? product.originalPrice;
  }, [selectedVariant, product.originalPrice]);

  const discount = displayOriginalPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant?.id);
    onClose();
  };

  if (!mounted) return null;

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 lg:inset-8 z-[110] flex items-center justify-center pointer-events-none"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col lg:flex-row pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Side */}
              <div className="relative w-full lg:w-1/2 bg-brand-blush/30">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-brand-ink hover:text-white transition-all shadow-lg"
                >
                  <X size={16} strokeWidth={2} />
                </button>

                <div className="relative aspect-square lg:aspect-[4/5]">
                  <Image
                    src={images[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>

                {images.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    {images.slice(0, 4).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={cn(
                          "relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all",
                          activeImage === idx ? "border-white shadow-md" : "border-white/50 opacity-70"
                        )}
                      >
                        <Image src={img} alt="" fill className="object-cover" sizes="40px" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isNew && (
                    <span className="px-2.5 py-1 bg-brand-ink text-white text-[10px] uppercase tracking-wider font-medium rounded-full">
                      New
                    </span>
                  )}
                  {product.badge && (
                    <span className="px-2.5 py-1 bg-brand-rose text-white text-[10px] uppercase tracking-wider font-medium rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 p-5 lg:p-6 flex flex-col overflow-y-auto">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-mist font-medium">
                  {product.category}
                </span>

                <h2 className="font-serif text-xl lg:text-2xl text-brand-ink mt-1 leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "text-sm",
                          i < Math.floor(product.rating) ? "text-amber-400" : "text-brand-petal"
                        )}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-brand-slate">({product.reviewCount})</span>
                </div>

                <div className="flex items-baseline gap-2 mt-3 pb-3 border-b border-brand-petal/30">
                  <span className="font-serif text-2xl text-brand-ink">{formatPrice(displayPrice)}</span>
                  {displayOriginalPrice && (
                    <>
                      <span className="text-sm text-brand-mist line-through">{formatPrice(displayOriginalPrice)}</span>
                      {discount > 0 && (
                        <span className="px-2 py-0.5 bg-brand-rose/10 text-brand-rose text-xs rounded-full">-{discount}%</span>
                      )}
                    </>
                  )}
                </div>

                <p className="text-brand-slate text-sm leading-relaxed mt-3 line-clamp-3">
                  {product.shortDescription || product.description}
                </p>

                {hasVariants && (
                  <div className="mt-4">
                    <span className="text-[10px] uppercase tracking-wider text-brand-mist font-medium block mb-2">
                      Select Size
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {product.variants?.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={!variant.inStock}
                          className={cn(
                            "py-2.5 px-2 rounded-xl border-2 transition-all text-center",
                            selectedVariant?.id === variant.id
                              ? "border-brand-ink bg-brand-ink text-white"
                              : variant.inStock
                                ? "border-brand-petal/40 hover:border-brand-ink/50"
                                : "border-brand-petal/30 opacity-50 cursor-not-allowed"
                          )}
                        >
                          <span className="block text-[10px] opacity-70">{variant.volume}</span>
                          <span className="block font-medium text-sm">{variant.size}</span>
                          {!variant.inStock && <span className="absolute inset-0 flex items-center justify-center"><span className="w-full h-px bg-brand-mist rotate-45" /></span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-5 mt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-brand-mist font-medium block mb-1.5">Qty</span>
                    <div className="flex items-center bg-brand-offWhite rounded-lg p-0.5">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center hover:bg-brand-blush/30"><Minus size={12} /></button>
                      <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center hover:bg-brand-blush/30"><Plus size={12} /></button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-brand-mist font-medium block mb-1.5">Status</span>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", (selectedVariant?.inStock ?? product.inStock) ? "bg-emerald-500" : "bg-brand-mist")} />
                      <span className="text-xs text-brand-ink">{(selectedVariant?.inStock ?? product.inStock) ? "In Stock" : "Out of Stock"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!(selectedVariant?.inStock ?? product.inStock)}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all",
                      (selectedVariant?.inStock ?? product.inStock) ? "bg-brand-ink text-white hover:bg-brand-ink/90" : "bg-brand-mist/30 text-brand-mist cursor-not-allowed"
                    )}
                  >
                    <ShoppingBag size={16} />
                    Add to Bag — {formatPrice(displayPrice * quantity)}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      "w-full py-2.5 px-4 rounded-xl border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all",
                      isWishlisted ? "border-brand-rose bg-brand-rose/5 text-brand-rose" : "border-brand-petal/50 hover:border-brand-rose/50"
                    )}
                  >
                    <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-petal/30 flex justify-center gap-4 text-xs text-brand-slate">
                  <span className="flex items-center gap-1"><Truck size={14} /> Free Shipping</span>
                  <span className="flex items-center gap-1"><Shield size={14} /> Authentic</span>
                </div>

                <Link href={`/product/${product.slug}`} onClick={onClose} className="mt-3 text-center text-xs text-brand-ink hover:text-brand-rose transition-colors">
                  View Full Details →
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
