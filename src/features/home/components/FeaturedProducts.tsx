"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  TRANSITION_CINEMATIC,
  TRANSITION_STANDARD,
  createStaggerTransition,
} from "@/shared/theme/animations";

// 4 Cosmetics Categories
const categories = [
  {
    id: "makeup",
    name: "Makeup",
    description: "Luxurious cosmetics for every occasion",
    image: "/images/product-1/v1.png",
    href: "/shop?category=Makeup",
  },
  {
    id: "skincare",
    name: "Skin Care",
    description: "Premium skincare essentials",
    image: "/images/product-1/v2.jpg",
    href: "/shop?category=Skin%20Care",
  },
  {
    id: "haircare",
    name: "Hair Care",
    description: "Nourishing hair treatments",
    image: "/images/product-1/v3.png",
    href: "/shop?category=Hair%20Care",
  },
  {
    id: "bodycare",
    name: "Body Care",
    description: "Indulgent body essentials",
    image: "/images/product-1/v4.webp",
    href: "/shop?category=Body%20Care",
  },
];

export function FeaturedProducts() {
  return (
    <section className="relative w-full bg-white">
      <div className="max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-32 py-24 sm:py-32 lg:py-40">
        {/* Header - Ultra minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-200px" }}
          transition={TRANSITION_CINEMATIC}
          className="text-center mb-16 sm:mb-20 lg:mb-24"
        >
          <span className="block text-[10px] tracking-[0.35em] uppercase text-brand-mist/70 font-light mb-6">
            Curated Selection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-brand-ink leading-[1.1] tracking-[-0.02em] font-light">
            Signature Collection
          </h2>
        </motion.div>

        {/* Categories Grid - Gallery style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={TRANSITION_STANDARD}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16 sm:mb-20"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={createStaggerTransition(index)}
              className="group"
            >
              <Link href={category.href} className="block">
                {/* Image - Clean, no borders */}
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#f5f5f5]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    quality={80}
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-brand-ink/0 group-hover:bg-brand-ink/10 transition-colors duration-500" />
                </div>

                {/* Meta - Ultra minimal */}
                <div className="text-center">
                  <span className="block text-[9px] tracking-[0.2em] uppercase text-brand-mist/60 mb-1 font-light">
                    {category.description}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg text-brand-ink mb-2 tracking-tight group-hover:text-brand-rose transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-xs text-brand-mist/60 group-hover:text-brand-rose transition-colors duration-300">
                    <span>Explore</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA - Minimal underline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={TRANSITION_STANDARD}
          className="text-center"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-4 text-[11px] tracking-[0.25em] uppercase font-light text-brand-ink/60 hover:text-brand-ink transition-colors duration-500"
          >
            <span className="relative">
              Explore All Categories
              <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-brand-rose group-hover:bg-brand-deepRose transition-all duration-500" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
