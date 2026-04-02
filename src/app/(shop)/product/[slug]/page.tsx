import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getProductBySlug, MOCK_PRODUCTS } from "@/lib/api";
import { ProductDetailClient } from "./ProductDetailClient";
import { Product } from "@/shared/types";

// Generate static paths for all products at build time
export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

// Generate dynamic metadata for SEO and OpenGraph
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | Diora",
      description: "The requested product could not be found.",
    };
  }

  const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  const price = defaultVariant?.price ?? product.price;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const originalPrice = defaultVariant?.originalPrice ?? product.originalPrice;

  const title = `${product.name} | ${product.category} | Diora`;
  const description = product.shortDescription || product.description || `Shop ${product.name} at Diora. Premium luxury beauty and skincare products.`;

  return {
    title,
    description,
    keywords: [product.name, product.category, "luxury beauty", "skincare", "Diora"],
    openGraph: {
      title: `${product.name} - ${formatPrice(price)}`,
      description,
      images: [
        {
          url: product.image,
          width: 640,
          height: 853,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `/product/${slug}`,
    },
  };
}

// Server Component - fetches data server-side
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Fetch product server-side
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = generateProductJsonLd(product, slug);

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}

// Helper function for price formatting
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// JSON-LD Structured Data Type Definitions
interface ProductOffer {
  "@type": "Offer";
  price: string;
  priceCurrency: string;
  availability: string;
  url: string;
}

interface ProductJsonLd {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  image: string | string[];
  sku: string;
  offers: ProductOffer;
}

// Generate Product JSON-LD structured data
function generateProductJsonLd(product: Product, slug: string): ProductJsonLd {
  const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  const price = defaultVariant?.price ?? product.price;
  const isInStock = defaultVariant?.inStock ?? product.inStock ?? true;
  const stockCount = defaultVariant?.stockCount ?? product.stockCount ?? 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription || `Shop ${product.name} at Diora. Premium luxury beauty and skincare products.`,
    image: product.images?.[0] || product.image,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: "USD",
      availability: isInStock && stockCount > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://diora.com/product/${slug}`,
    },
  };
}
