"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

// Generate a tiny blur placeholder (solid color approximation)
const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZkZTRlYyIvPjwvc3ZnPg==";

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Use CSS custom properties for zoom position - bypasses React render cycle
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isZoomed) return;

    // Cancel any pending RAF to prevent queue buildup
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Schedule update on next frame for smooth 60fps
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      
      // Update CSS custom properties directly - no React state!
      containerRef.current.style.setProperty('--zoom-x', `${x * 100}%`);
      containerRef.current.style.setProperty('--zoom-y', `${y * 100}%`);
    });
  }, [isZoomed]);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    // Reset CSS variables
    if (containerRef.current) {
      containerRef.current.style.setProperty('--zoom-x', '50%');
      containerRef.current.style.setProperty('--zoom-y', '50%');
    }
  }, []);

  const currentImage = images[selectedIndex] || images[0];
  const hasMultipleImages = images.length > 1;
  const isLCP = selectedIndex === 0;

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-2 sm:gap-3 md:gap-4">
        {/* Thumbnails - Horizontal scroll on mobile, vertical on desktop */}
        {hasMultipleImages && (
          <div className="flex md:flex-col gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible scrollbar-hide pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative w-16 h-20 sm:w-[72px] sm:h-[88px] md:w-20 md:h-24 rounded-lg md:rounded-luxury overflow-hidden flex-shrink-0 transition-all duration-200",
                  selectedIndex === i
                    ? "ring-2 ring-brand-rose ring-offset-1 md:ring-offset-2 opacity-100"
                    : "ring-1 ring-brand-rose/20 opacity-60 hover:opacity-80"
                )}
                aria-label={`View ${name} - image ${i + 1}`}
                aria-pressed={selectedIndex === i}
              >
                <Image
                  src={img}
                  alt={`${name} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image with Zoom */}
        <div
          ref={containerRef}
          className={cn(
            "relative flex-1 w-full pb-[133.33%] sm:pb-[125%] md:pb-0 md:h-[500px] lg:h-[600px] bg-brand-blush/20 rounded-lg md:rounded-luxury overflow-hidden",
            "cursor-zoom-in",
            isZoomed && "cursor-zoom-out"
          )}
          style={{
            '--zoom-x': '50%',
            '--zoom-y': '50%',
          } as React.CSSProperties}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Simple opacity crossfade - no layout thrashing */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage}
                alt={`${name} — view ${selectedIndex + 1}`}
                fill
                className={cn(
                  "object-cover transition-transform duration-150 ease-out",
                  isZoomed && "scale-[2.5]"
                )}
                style={{
                  transformOrigin: 'var(--zoom-x) var(--zoom-y)',
                }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={isLCP}
                fetchPriority={isLCP ? "high" : undefined}
                {...(!isLCP && { placeholder: "blur", blurDataURL: BLUR_DATA_URL })}
              />
            </motion.div>
          </AnimatePresence>

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 bg-brand-ink/80 backdrop-blur-sm text-brand-offWhite px-2 py-1 rounded-full text-[10px] font-sans pointer-events-none">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

    </>
  );
}
