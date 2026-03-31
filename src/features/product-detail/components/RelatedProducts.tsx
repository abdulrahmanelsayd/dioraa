"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getRelatedProducts } from "@/lib/api";
import { Product } from "@/shared/types";
import { formatPrice } from "@/shared/lib/utils";
import { fadeInUp, staggerContainer } from "@/shared/theme/animations";

interface RelatedProductsProps {
  productId: string;
  category: string;
}

export function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: ["relatedProducts", productId],
    queryFn: () => getRelatedProducts(productId, 4),
  });

  if (isLoading || !relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-brand-offWhite py-16 md:py-24 border-t border-brand-rose/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="label-luxury mb-4 block">Complete Your Routine</span>
          <h2 className="heading-display text-3xl md:text-4xl text-brand-ink">
            You May Also Like
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <RelatedProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] bg-brand-blush/20 rounded-luxury overflow-hidden mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-brand-ink text-brand-offWhite text-[10px] font-sans uppercase tracking-wider rounded-full">
            {product.badge}
          </div>
        )}
        {product.isNew && !product.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-brand-rose text-white text-[10px] font-sans uppercase tracking-wider rounded-full">
            New
          </div>
        )}
      </div>
      <div className="space-y-2">
        <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-brand-mist">
          {product.category}
        </span>
        <h3 className="font-serif text-lg text-brand-ink group-hover:text-brand-rose transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-medium text-brand-ink">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-brand-mist line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-[10px] text-brand-rose font-medium">
                {discount}% off
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
