"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { getProducts } from "@/lib/api";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { formatPrice } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import unsplashLoader from "@/shared/lib/unsplash-loader";

interface CartUpsellProps {
  currentProductIds: string[];
}

export function CartUpsell({ currentProductIds }: CartUpsellProps) {
  const { data: products } = useQuery({
    queryKey: ["upsellProducts"],
    queryFn: () => getProducts({ sortBy: "bestselling" }),
  });

  const addItem = useCartStore((state) => state.addItem);

  // Filter out products already in cart and limit to 3
  const upsellProducts = products
    ?.filter((p) => !currentProductIds.includes(p.id))
    ?.slice(0, 3);

  if (!upsellProducts || upsellProducts.length === 0) return null;

  return (
    <div className="border-t border-brand-rose/10 bg-brand-blush/10">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-brand-rose" />
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink">
            You Might Also Like
          </span>
        </div>

        <div className="space-y-3">
          {upsellProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-center p-2 bg-white/50 rounded-luxury"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-brand-blush/20">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                  loader={unsplashLoader}
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-brand-ink truncate">
                  {product.name}
                </p>
                <p className="font-sans text-xs text-brand-mist">
                  {formatPrice(product.price)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addItem(product, 1)}
                className="flex-shrink-0 px-3"
              >
                <Plus size={14} />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
