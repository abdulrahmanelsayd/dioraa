"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import { ProductGallery } from "@/features/product-detail/components/ProductGallery";
import { ProductInfo } from "@/features/product-detail/components/ProductInfo";
import { ProductTabs } from "@/features/product-detail/components/ProductTabs";
import { RelatedProducts } from "@/features/product-detail/components/RelatedProducts";
import { pageTransition, staggerContainer, fadeInUp } from "@/shared/theme/animations";
import { Footer } from "@/features/footer";
import { PageHero } from "@/features/hero/components/PageHero";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import ProductLoading from "./loading";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });

  if (!isLoading && !product) {
    notFound();
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full bg-brand-offWhite min-h-screen"
    >
      {isLoading ? (
        <ProductLoading />
      ) : product ? (
        <>
          <PageHero
            label="Product Detail"
            title={product.name}
          />
          <section className="section-padding py-8 md:py-16 bg-brand-offWhite">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumbs */}
              <div className="mb-6">
                <Breadcrumbs
                  items={[
                    { label: product.category, href: `/category/${product.category.toLowerCase().replace(" ", "-")}` },
                    { label: product.name },
                  ]}
                />
              </div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
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
          <section className="section-padding bg-brand-offWhite pb-24 md:pb-32">
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

          {/* Related Products */}
          <RelatedProducts productId={product.id} category={product.category} />

          <Footer />
        </>
      ) : null}
    </motion.div>
  );
}
