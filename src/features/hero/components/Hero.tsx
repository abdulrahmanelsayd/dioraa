"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { fadeInUp, staggerContainer } from "@/shared/theme/animations";

export function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check video ready state on mount (handles cached videos)
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVideoLoaded(true);
    }
  }, []);

  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden -mt-20">
      {/* Hero Poster Image - LCP Element with priority */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/product-1/v1.png"
          alt="Luxury skincare hero"
          fill
          priority
          quality={85}
          sizes="100vw"
          fetchPriority="high"
          className="object-cover"
        />
      </div>
      
      {/* Fallback gradient */}
      <div className="absolute inset-0 z-[0] bg-gradient-to-br from-[#E8D4D0] via-[#D4B5B0] to-[#C9A9A4] -z-10" />
      
      {/* Video Error Fallback */}
      {videoError && (
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-brand-rose/20 via-brand-blush/30 to-brand-offWhite flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <svg
                className="w-6 h-6 text-brand-deepRose"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <p className="text-xs text-white/80 font-light tracking-wider uppercase">
              Visual Experience
            </p>
          </div>
        </div>
      )}
      
      {/* Video - no poster, uses optimized Image behind it as fallback */}
      {!videoError && (
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
        preload="metadata"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
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
          className="flex flex-col sm:flex-row items-center justify-center gap-y-1 sm:gap-y-0 sm:gap-x-4 lg:gap-x-6 drop-shadow-2xl text-center"
        >
          <div className="flex items-center justify-center gap-x-2 sm:gap-x-4">
            <span className="font-serif text-5xl sm:text-6xl lg:text-[6.5rem] tracking-tight text-white font-normal capitalize">
              Pure
            </span>
            <span className="font-serif text-3xl sm:text-4xl lg:text-[4.5rem] text-white/90 italic -translate-y-1 sm:-translate-y-1">
              &
            </span>
          </div>
          <span className="font-sans text-5xl sm:text-6xl lg:text-[6.5rem] font-bold tracking-tighter text-white uppercase leading-none mt-2 sm:mt-0">
            Radiant
          </span>
        </motion.h1>
      </motion.div>
    </section>
  );
}
