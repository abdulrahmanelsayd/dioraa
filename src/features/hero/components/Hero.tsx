"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/shared/theme/animations";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS: readonly {
  label: string;
  href: string;
  isPrimary?: boolean;
  hideOn?: "sm" | "md" | "lg";
}[] = [
  { label: "All Products", href: "/#bestsellers", isPrimary: true },
  { label: "Skin Care", href: "/category/skin-care", hideOn: "sm" },
  { label: "Hair Care", href: "/category/hair-care", hideOn: "md" },
  { label: "Best Sellers", href: "/#bestsellers", hideOn: "lg" },
];

// Connection speed detection for adaptive loading
function useConnectionSpeed() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check if Network Information API is available
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    if (connection?.effectiveType) {
      setIsSlowConnection(
        connection.effectiveType === "slow-2g" || 
        connection.effectiveType === "2g" ||
        connection.effectiveType === "3g"
      );
    }
  }, []);

  return isSlowConnection;
}

export function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isSlowConnection = useConnectionSpeed();

  useEffect(() => {
    // Skip video on slow connections
    if (isSlowConnection) return;

    // Defer video load until after LCP — poster renders instantly
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.src = "/hero.mp4";
        videoRef.current.load();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isSlowConnection]);

  // Determine if we should show video or fallback
  const showVideo = !isSlowConnection && !videoError;
  const showFallback = isSlowConnection || videoError;

  return (
    <>
      <section className="relative w-full h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden -mt-20">
      {/* Fallback Image — always rendered for instant LCP */}
      <Image
        src="/hero-poster.jpg"
        alt="DIORA - Pure & Radiant luxury skincare"
        fill
        priority
        sizes="100vw"
        className={cn(
          "absolute inset-0 z-0 object-cover transition-opacity duration-500",
          showVideo && videoLoaded ? "opacity-0" : "opacity-100"
        )}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//wBAAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQD/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQD/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q=="
      />

      {/* Video — fades in after load, only on fast connections */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-1000",
            videoLoaded ? "opacity-100" : "opacity-0"
          )}
          preload="none"
        />
      )}

      {/* Connection indicator for slow networks */}
      {showFallback && (
        <div className="absolute inset-0 z-[1] bg-brand-blush/20" />
      )}

      {/* Luxury Vignette Overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-brand-offWhite via-transparent to-brand-ink/10" />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4"
      >
        <motion.h1
          variants={fadeInUp}
          className="flex flex-row flex-nowrap items-center justify-center gap-x-2 md:gap-x-4 lg:gap-x-6 drop-shadow-2xl"
        >
          <span className="font-serif text-4xl md:text-6xl lg:text-[6.5rem] tracking-tight text-white font-normal capitalize">
            Pure
          </span>
          <span className="font-serif text-2xl md:text-4xl lg:text-[4.5rem] text-white/90 italic -translate-y-0.5 md:-translate-y-1">
            &
          </span>
          <span className="font-sans text-4xl md:text-6xl lg:text-[6.5rem] font-bold tracking-tighter text-white uppercase">
            Radiant
          </span>
        </motion.h1>

      </motion.div>
    </section>

    {/* Overlapping Chic Menu Pill */}
    <div className="relative z-50 flex justify-center w-full -mt-7 md:-mt-9 px-4">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="inline-flex flex-row items-center justify-center p-1.5 md:p-2 bg-white/70 backdrop-blur-2xl rounded-full border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "font-sans text-[10px] md:text-sm px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all text-center",
              item.isPrimary
                ? "bg-black text-white shadow-sm"
                : "text-black/60 hover:text-black",
              item.hideOn === "sm" && "hidden sm:block",
              item.hideOn === "md" && "hidden md:block",
              item.hideOn === "lg" && "hidden lg:block"
            )}
          >
            {item.label}
          </Link>
        ))}
      </motion.div>
    </div>
    </>
  );
}
