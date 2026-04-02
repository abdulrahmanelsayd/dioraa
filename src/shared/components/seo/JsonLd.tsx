/**
 * JSON-LD Structured Data Components for SEO
 * Follows Schema.org specifications for rich snippets
 */

import type { Product } from "@/shared/types/product";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationJsonLd({
  name = "DIORA",
  url = "https://diora.com",
  logo = "https://diora.com/logo.png",
}: OrganizationJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    sameAs: [
      "https://instagram.com/diora",
      "https://facebook.com/diora",
      "https://twitter.com/diora",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-DIORA-01",
      contactType: "customer service",
      availableLanguage: ["English", "French", "Spanish"],
    },
  };

  return <JsonLd data={data} />;
}

interface WebSiteJsonLdProps {
  name?: string;
  url?: string;
}

export function WebSiteJsonLd({
  name = "DIORA",
  url = "https://diora.com",
}: WebSiteJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

interface ProductJsonLdProps {
  product: Product;
  url?: string;
  // Price validity date - defaults to 1 year from build time for SSR compatibility
  priceValidUntil?: string;
}

export function ProductJsonLd({ 
  product, 
  url = "https://diora.com",
  priceValidUntil
}: ProductJsonLdProps) {
  // Use provided date or fallback to a far-future static date for SSR compatibility
  const validUntil = priceValidUntil || "2026-12-31T23:59:59Z";
  
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.images?.[0] || product.image,
    url: `${url}/product/${product.slug}`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "DIORA",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: product.inStock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceValidUntil: validUntil,
      url: `${url}/product/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "DIORA",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    ...(product.reviews && product.reviews.length > 0
      ? {
          review: product.reviews.slice(0, 10).map((review) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
            author: {
              "@type": "Person",
              name: review.userName,
            },
            reviewBody: review.comment,
            name: review.title,
            datePublished: review.createdAt,
          })),
        }
      : {}),
  };

  return <JsonLd data={data} />;
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

interface LocalBusinessJsonLdProps {
  name?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export function LocalBusinessJsonLd({
  name = "DIORA",
  address = {
    street: "123 Luxury Lane",
    city: "Beverly Hills",
    state: "CA",
    postalCode: "90210",
    country: "US",
  },
}: LocalBusinessJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Store",
    name,
    "@id": "https://diora.com/#store",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    openingHours: "Mo-Sa 10:00-20:00 Su 11:00-18:00",
    priceRange: "$$$",
    telephone: "+1-800-DIORA-01",
  };

  return <JsonLd data={data} />;
}

interface FAQJsonLdProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}
