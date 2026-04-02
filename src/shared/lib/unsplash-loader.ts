import type { ImageLoaderProps } from "next/image";

/**
 * Custom image loader for Unsplash images
 * Uses Unsplash's built-in CDN resizing instead of Next.js optimization
 * 
 * Unsplash supports these URL params:
 * - w: width
 * - h: height  
 * - q: quality (1-100)
 * - fm: format (webp, jpg, png)
 * - fit: crop mode (crop, bounds, clamp)
 * - dpr: device pixel ratio
 * - auto: auto format (format)
 */
export default function unsplashLoader({ src, width, quality }: ImageLoaderProps): string {
  // Parse existing URL to preserve photo ID
  const url = new URL(src);
  
  // Build optimized Unsplash URL with WebP format hint and tighter quality
  const params = new URLSearchParams({
    w: width.toString(),
    q: (quality || 75).toString(),
    fm: "webp",
    auto: "format",
    fit: "crop",
  });
  
  // Replace existing params with optimized ones
  return `${url.origin}${url.pathname}?${params.toString()}`;
}

/**
 * Determines if a URL is an Unsplash image
 */
export function isUnsplashUrl(url: string): boolean {
  return url.includes("images.unsplash.com");
}
