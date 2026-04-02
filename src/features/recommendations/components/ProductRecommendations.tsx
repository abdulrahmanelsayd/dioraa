"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart, ShoppingBag, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { MOCK_PRODUCTS } from "@/lib/api";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";
import unsplashLoader from "@/shared/lib/unsplash-loader";

interface ProductRecommendationsProps {
  currentProduct: Product;
  cartProductIds?: string[];
  variant?: "complete-ritual" | "pair-with" | "trending-now" | "ai-curated";
}

export function ProductRecommendations({
  currentProduct,
  cartProductIds = [],
  variant = "complete-ritual",
}: ProductRecommendationsProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addItem);

  // AI-style recommendation engine
  const recommendations = useMemo(() => {
    const scored = MOCK_PRODUCTS.filter(
      (p) => p.id !== currentProduct.id && !cartProductIds.includes(p.id)
    ).map((product) => {
      let score = 0;
      const reasons: string[] = [];

      // Category matching
      if (product.category === currentProduct.category) {
        score += 30;
        reasons.push("Same category");
      }

      // Complementary categories (e.g., if buying serum, recommend moisturizer)
      const complementary: Record<string, string[]> = {
        "Skin Care": ["Makeup", "Tools & Accessories"],
        "Makeup": ["Tools & Accessories", "Fragrance"],
        "Hair Care": ["Body Care"],
        "Body Care": ["Fragrance", "Tools & Accessories"],
        Fragrance: ["Body Care", "Makeup"],
      };

      if (complementary[currentProduct.category]?.includes(product.category)) {
        score += 40;
        reasons.push("Perfect pairing");
      }

      // Skin type matching
      if (product.skinTypes && currentProduct.skinTypes) {
        const shared = product.skinTypes.filter((st) =>
          currentProduct.skinTypes?.includes(st)
        );
        if (shared.length > 0) {
          score += shared.length * 15;
          reasons.push("For your skin type");
        }
      }

      // Concern matching
      if (product.concerns && currentProduct.concerns) {
        const shared = product.concerns.filter((c) =>
          currentProduct.concerns?.includes(c)
        );
        if (shared.length > 0) {
          score += shared.length * 20;
          reasons.push("Addresses same concerns");
        }
      }

      // High rating bonus
      if (product.rating >= 4.8) {
        score += 10;
        reasons.push("Top rated");
      }

      // Bestseller bonus
      if (product.badge === "Bestseller") {
        score += 15;
        reasons.push("Bestseller");
      }

      // New product bonus
      if (product.isNew) {
        score += 5;
        reasons.push("New arrival");
      }

      return { product, score, reasons: [...new Set(reasons)].slice(0, 2) };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [currentProduct, cartProductIds]);

  const variantConfig = {
    "complete-ritual": {
      title: "Complete Your Ritual",
      subtitle: "Curated essentials to enhance your beauty routine",
      icon: Sparkles,
      gradient: "from-brand-rose/20 via-brand-blush/10 to-transparent",
    },
    "pair-with": {
      title: "Perfect Pairings",
      subtitle: "Products that work beautifully together",
      icon: Heart,
      gradient: "from-brand-deepRose/20 via-brand-rose/10 to-transparent",
    },
    "trending-now": {
      title: "Trending Now",
      subtitle: "What our community is loving this week",
      icon: Zap,
      gradient: "from-amber-100/50 via-brand-blush/10 to-transparent",
    },
    "ai-curated": {
      title: "Curated For You",
      subtitle: "Personalized recommendations based on your selection",
      icon: Sparkles,
      gradient: "from-violet-100/50 via-brand-blush/10 to-transparent",
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  if (recommendations.length === 0) return null;

  return (
    <section className={cn("py-16 rounded-3xl bg-gradient-to-b", config.gradient)}>
      <div className="section-padding mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-brand-ink/5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-rose" />
              </div>
              <h2 className="font-serif text-3xl text-brand-ink">{config.title}</h2>
            </div>
            <p className="text-brand-ink/50 ml-13">{config.subtitle}</p>
          </div>
          <Link
            href={`/category/${currentProduct.category.toLowerCase().replace(" ", "-")}`}
            className="hidden sm:flex items-center gap-2 text-brand-rose hover:text-brand-deepRose transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map(({ product, reasons }, index) => (
            <RecommendationCard
              key={product.id}
              product={product}
              reasons={reasons}
              index={index}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({
  product,
  reasons,
  index,
  onAddToCart,
}: {
  product: Product;
  reasons: string[];
  index: number;
  onAddToCart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-brand-rose/10 hover:border-brand-rose/30 hover:shadow-xl transition-all duration-500">
        {/* Image */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loader={unsplashLoader}
            unoptimized
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badge && (
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-brand-ink">
                {product.badge}
              </span>
            )}
            {product.isNew && (
              <span className="px-3 py-1 bg-brand-rose/90 text-white rounded-full text-xs font-medium">
                New
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            className="absolute bottom-3 right-3 w-10 h-10 bg-brand-ink text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </Link>

        {/* Content */}
        <div className="p-4">
          {/* AI Reasons */}
          {reasons.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {reasons.map((reason) => (
                <span
                  key={reason}
                  className="text-[10px] uppercase tracking-wider text-brand-rose bg-brand-rose/10 px-2 py-0.5 rounded-full"
                >
                  {reason}
                </span>
              ))}
            </div>
          )}

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium text-brand-ink group-hover:text-brand-rose transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-xs text-brand-ink/50 mt-1">{product.category}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={cn(
                    "w-3 h-3",
                    star <= product.rating ? "text-brand-rose fill-brand-rose" : "text-brand-rose/20"
                  )}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-brand-ink/50">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            <span className="font-medium">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-brand-ink/40 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Variant Options Preview */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex gap-1 mt-3">
              {product.variants.slice(0, 3).map((variant) => (
                <span
                  key={variant.id}
                  className="text-[10px] px-2 py-1 bg-brand-offWhite rounded text-brand-ink/60"
                >
                  {variant.volume}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="text-[10px] px-2 py-1 text-brand-ink/40">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Cart-based recommendations (For cart drawer)
export function CartRecommendations({ cartProductIds }: { cartProductIds: string[] }) {
  const cartProducts = MOCK_PRODUCTS.filter((p) => cartProductIds.includes(p.id));
  const addToCart = useCartStore((state) => state.addItem);

  // Find complementary products
  const recommendations = useMemo(() => {
    const categories = [...new Set(cartProducts.map((p) => p.category))];
    
    return MOCK_PRODUCTS.filter(
      (p) => !cartProductIds.includes(p.id) && !categories.includes(p.category)
    )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  }, [cartProductIds, cartProducts]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-brand-rose/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-brand-rose" />
        <span className="text-xs uppercase tracking-widest font-medium text-brand-ink">
          Complete Your Look
        </span>
      </div>
      <div className="space-y-3">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-brand-offWhite/50 hover:bg-brand-blush/20 transition-colors"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                loader={unsplashLoader}
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-brand-ink truncate">
                {product.name}
              </h4>
              <p className="text-xs text-brand-ink/50">{formatPrice(product.price)}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="p-2 bg-brand-ink text-white rounded-full hover:bg-brand-deepRose transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
