"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface EditorialShowcaseProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  reverse?: boolean;
}

export function EditorialShowcase({
  title,
  subtitle,
  description,
  image,
  link,
  reverse = false,
}: EditorialShowcaseProps) {
  return (
    <section className="relative w-full bg-white">
      <div className="max-w-[1920px] mx-auto w-full">
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${reverse ? "lg:flex-row-reverse" : ""}`}>
          {/* Image Side - Full bleed on mobile, half on desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-200px" }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            className={`relative aspect-[3/4] lg:aspect-auto lg:h-[85vh] min-h-[500px] overflow-hidden ${reverse ? "lg:order-2" : ""}`}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-[3000ms] ease-out hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
              priority
            />
          </motion.div>

          {/* Content Side - Ultra minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-200px" }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className={`flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28 py-20 lg:py-0 ${reverse ? "lg:order-1" : ""}`}
          >
            <div className="max-w-md">
              {/* Label - Ultra thin */}
              <span className="block text-[10px] tracking-[0.35em] uppercase text-brand-mist/70 font-light mb-6">
                {subtitle}
              </span>

              {/* Title - Editorial serif */}
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-brand-ink leading-[1.05] tracking-[-0.02em] mb-8">
                {title}
              </h2>

              {/* Description - Refined */}
              <p className="text-sm sm:text-[15px] text-brand-ink/50 leading-[1.8] tracking-[0.01em] max-w-sm mb-12 font-light">
                {description}
              </p>

              {/* CTA - Minimal underline */}
              <Link
                href={link}
                className="group inline-flex items-center gap-4 text-[11px] tracking-[0.25em] uppercase font-light text-brand-ink/80"
              >
                <span className="relative">
                  Discover
                  <span className="absolute left-0 bottom-0 w-full h-px bg-brand-ink/20 transition-all duration-500 group-hover:bg-brand-ink/60 group-hover:w-full" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
