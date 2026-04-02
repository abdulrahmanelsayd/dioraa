import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
    esmExternals: true,
  },
  images: {
    // Enable Next.js image optimization for automatic WebP/AVIF conversion
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.diora.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
    // Supported quality values
    qualities: [75, 80, 85],
  },
  turbopack: {},
};

export default nextConfig;
