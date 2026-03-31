"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  }, []);

  const handlePrevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative w-16 h-20 md:w-20 md:h-24 rounded-luxury overflow-hidden flex-shrink-0 transition-all duration-300",
                selectedIndex === i
                  ? "ring-2 ring-brand-rose ring-offset-2 opacity-100"
                  : "ring-1 ring-brand-rose/20 opacity-60 hover:opacity-100 hover:ring-brand-rose/50"
              )}
            >
              <Image
                src={img}
                alt={`${name} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>

        {/* Main Image with Zoom */}
        <div
          ref={imageRef}
          className="relative flex-1 aspect-[4/5] bg-brand-blush/20 rounded-luxury overflow-hidden cursor-zoom-in group"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[selectedIndex]}
                alt={`${name} — view ${selectedIndex + 1}`}
                fill
                className={cn(
                  "object-cover transition-transform duration-200",
                  isZoomed && "scale-[2.5]"
                )}
                style={isZoomed ? {
                  transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
                } : {}}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={selectedIndex === 0}
                quality={90}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom Hint */}
          <div className="absolute bottom-4 right-4 bg-brand-ink/80 backdrop-blur-sm text-brand-offWhite px-3 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn size={16} />
            <span className="text-xs font-sans">Click to expand</span>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-brand-ink/80 backdrop-blur-sm text-brand-offWhite px-3 py-1 rounded-full text-xs font-sans">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-ink/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 bg-brand-offWhite/10 hover:bg-brand-offWhite/20 rounded-full text-brand-offWhite transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-brand-offWhite/10 hover:bg-brand-offWhite/20 rounded-full text-brand-offWhite transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-brand-offWhite/10 hover:bg-brand-offWhite/20 rounded-full text-brand-offWhite transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Main Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`${name} — view ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                quality={95}
                priority
              />
            </motion.div>

            {/* Thumbnails in Lightbox */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(i);
                  }}
                  className={cn(
                    "relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300",
                    selectedIndex === i
                      ? "ring-2 ring-brand-rose ring-offset-2 ring-offset-brand-ink"
                      : "opacity-50 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>

            {/* Image Name */}
            <div className="absolute bottom-6 left-6 text-brand-offWhite">
              <p className="font-serif text-lg">{name}</p>
              <p className="text-sm text-brand-offWhite/60">
                View {selectedIndex + 1} of {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
