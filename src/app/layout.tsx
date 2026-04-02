import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { ToastProvider } from "@/shared/providers/ToastProvider";
import { Navbar } from "@/shared/components/Navbar";

import { CartDrawer } from "@/features/cart/components/DynamicCartDrawer";
import { WishlistDrawer } from "@/features/wishlist/components/DynamicWishlistDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://diora.com"),
  title: {
    default: "DIORA | Premium Personal Care",
    template: "%s | DIORA",
  },
  description:
    "Experience luxury personal care and beauty products with DIORA. Original quality, fast global shipping. Shop premium skincare, hair care, and cosmetics.",
  keywords: [
    "luxury skincare",
    "premium beauty",
    "personal care",
    "DIORA",
    "skin care",
    "hair care",
    "cosmetics",
    "serum",
    "moisturizer",
    "organic beauty",
    "cruelty-free",
    "vegan skincare",
  ],
  authors: [{ name: "DIORA" }],
  creator: "DIORA",
  publisher: "DIORA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://diora.com",
    siteName: "DIORA",
    title: "DIORA | Premium Personal Care",
    description:
      "Experience luxury personal care and beauty products with DIORA. Original quality, fast global shipping.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DIORA - Premium Personal Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIORA | Premium Personal Care",
    description: "Luxury personal care and beauty products. Shop now.",
    images: ["/og-image.png"],
    creator: "@diora",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://diora.com",
  },
  verification: {
    google: "google-site-verification-code",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DIORA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Defer manifest loading - not critical for initial render */}
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" media="(max-width: 0)" />
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            const link = document.querySelector('link[href="/manifest.json"]');
            if (link) link.media = 'all';
          })();
        `}} />
      </head>
      <body className="min-h-full flex flex-col pt-16 sm:pt-20 pb-safe overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-brand-ink focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-rose"
        >
          Skip to content
        </a>
        <QueryProvider>
          <ToastProvider>
            <Navbar />
            <CartDrawer />
            <WishlistDrawer />
            <main className="flex-grow" id="main-content">
              {children}
            </main>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
