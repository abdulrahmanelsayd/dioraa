import dynamic from "next/dynamic";
import Script from "next/script";
import { Hero } from "@/features/hero";
import { PageTransitionWrapper } from "@/shared/components/PageTransitionWrapper";

// Dynamic imports for below-the-fold components to reduce initial bundle
const TrustBadgesPill = dynamic(
  () => import("@/features/home/components/TrustBadgesPill").then((m) => m.TrustBadgesPill),
  { ssr: true }
);
const FeaturedProducts = dynamic(
  () => import("@/features/home/components/FeaturedProducts").then((m) => m.FeaturedProducts),
  { ssr: true }
);
const Footer = dynamic(
  () => import("@/features/footer/components/Footer").then((m) => m.Footer),
  { ssr: true }
);

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://diora.com/#organization",
      name: "Diora Store",
      url: "https://diora.com",
      logo: {
        "@type": "ImageObject",
        url: "https://diora.com/LOGO.png",
      },
      description: "Premium personal care and beauty products. Luxury skincare, hair care, and cosmetics.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": "https://diora.com/#website",
      url: "https://diora.com",
      name: "Diora Store",
      publisher: {
        "@id": "https://diora.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://diora.com/shop?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageTransitionWrapper>
        {/* Hero - Full Screen Minimal */}
        <Hero />

        {/* Trust Badges - Overlapping Pill */}
        <TrustBadgesPill />

        {/* Featured Products - Gallery Grid */}
        <FeaturedProducts />

        <Footer />
      </PageTransitionWrapper>
    </>
  );
}
