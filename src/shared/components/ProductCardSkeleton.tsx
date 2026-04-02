"use client";

import { cn } from "@/shared/lib/utils";

interface ProductCardSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductCardSkeleton({ count = 4, className }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-white rounded-2xl overflow-hidden border border-brand-rose/10",
            "animate-pulse",
            className
          )}
        >
          {/* Image Skeleton */}
          <div className="aspect-[3/4] bg-brand-blush/30" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Category */}
            <div className="h-3 w-16 bg-brand-blush/50 rounded" />
            
            {/* Title */}
            <div className="h-5 w-full bg-brand-blush/50 rounded" />
            <div className="h-5 w-2/3 bg-brand-blush/50 rounded" />
            
            {/* Rating */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-2.5 w-2.5 bg-brand-blush/50 rounded-full" />
              ))}
            </div>
            
            {/* Price */}
            <div className="h-6 w-20 bg-brand-blush/50 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}
