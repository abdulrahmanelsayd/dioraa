"use client";

import { useEffect, useRef, useState } from "react";

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  placeholder?: React.ReactNode;
}

/**
 * LazyLoad component using Intersection Observer
 * Defers rendering of below-fold content until it's about to enter viewport
 */
export function LazyLoad({
  children,
  className,
  rootMargin = "200px",
  threshold = 0.1,
  placeholder,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder}
    </div>
  );
}

/**
 * Skeleton placeholder for lazy loaded content
 */
export function SkeletonPlaceholder({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`animate-pulse bg-brand-petal/20 rounded-luxury ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
    </div>
  );
}
