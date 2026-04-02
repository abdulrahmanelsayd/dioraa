"use client";

import { motion } from "framer-motion";
import { Product } from "@/shared/types";
import { ProductGallery } from "@/features/product-detail/components/ProductGallery";
import { ProductInfo } from "@/features/product-detail/components/ProductInfo";
import { ProductTabs } from "@/features/product-detail/components/ProductTabs";
import { ProductFAQ } from "@/features/product-detail/components/ProductFAQ";
import { RelatedProducts } from "@/features/product-detail/components/RelatedProducts";
import { StickyBuyBar } from "@/features/product-detail/components/StickyBuyBar";
import { pageTransition, staggerContainer, fadeInUp } from "@/shared/theme/animations";
import { Footer } from "@/features/footer";
import { PageHero } from "@/features/hero/components/PageHero";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full bg-brand-offWhite min-h-screen"
    >
      <PageHero
        label="Product Detail"
        title={product.name}
      />
      
      {/* Main Product Section */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-6 sm:py-8 md:py-16 bg-brand-offWhite">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16"
          >
            <motion.div variants={fadeInUp}>
              <ProductGallery
                images={product.images || [product.image]}
                name={product.name}
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ProductInfo product={product} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 bg-brand-offWhite pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductTabs product={product} />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <ProductFAQ />

      {/* Related Products */}
      <RelatedProducts productId={product.id} category={product.category} />

      {/* Sticky Buy Now Bar - Mobile Only */}
      <StickyBuyBar
        productName={product.name}
        price={product.variants?.find((v) => v.isDefault)?.price ?? product.price}
        originalPrice={product.variants?.find((v) => v.isDefault)?.originalPrice ?? product.originalPrice}
        isInStock={product.variants?.find((v) => v.isDefault)?.inStock ?? product.inStock ?? true}
      />

      <Footer />
    </motion.div>
  );
}
