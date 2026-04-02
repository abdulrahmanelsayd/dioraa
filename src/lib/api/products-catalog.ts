/**
 * Real Product Catalog - Using only local images from /public/images
 */

import type { Product, Review } from "./types";

// Reviews generator
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateReviews = (productId: string, count: number, avgRating: number): Review[] => {
  const templates = [
    { title: "Absolutely love this!", comment: "This product has completely transformed my skin. I've been using it for 3 weeks and the results are incredible." },
    { title: "Worth every penny", comment: "Yes, it's pricey, but you only need a small amount so it lasts. Quality is exceptional." },
    { title: "Great for sensitive skin", comment: "I have very sensitive skin and this doesn't irritate it at all. Finally found something that works!" },
  ];
  const firstNames = ["Sarah", "Emma", "Lisa", "Maria", "Amanda"];
  
  return Array.from({ length: Math.min(count, 5) }, (_, i) => {
    const t = templates[i % templates.length];
    const rating = Math.max(1, Math.min(5, Math.round(avgRating + (Math.random() - 0.5) * 2)));
    return {
      id: `rev_${productId}_${i}`,
      productId,
      userId: `user_${i}`,
      userName: `${firstNames[i % firstNames.length]} M.`,
      rating,
      title: t.title,
      comment: t.comment,
      helpful: Math.floor(Math.random() * 20) + 1,
      verified: Math.random() > 0.2,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p_1",
    name: "Premium Skincare Set",
    slug: "premium-skincare-set",
    category: "Skin Care",
    subcategory: "Sets",
    price: 2450,
    originalPrice: 2890,
    rating: 4.9,
    reviewCount: 128,
    image: "/images/product-1/v1.png",
    badge: "Hero",
    inStock: true,
    stockCount: 15,
    shortDescription: "Complete luxury skincare routine in one elegant set",
    description: "A complete luxury skincare routine featuring our signature products. This set includes everything you need for radiant, healthy-looking skin. Each product is carefully formulated with premium ingredients to deliver visible results.",
    ingredients: ["Hyaluronic Acid", "Vitamin C", "Niacinamide", "Rose Extract", "Peptides", "Squalane"],
    images: [
      "/images/product-1/v1.png",
      "/images/product-1/v2.jpg",
      "/images/product-1/v3.png",
      "/images/product-1/v4.webp",
    ],
    variants: [
      { id: "v_1_1", size: "Standard Set", volume: "5 pieces", price: 2450, originalPrice: 2890, stockCount: 15, inStock: true, isDefault: true },
    ],
    skinTypes: ["Dry", "Combination", "Normal", "Sensitive"],
    concerns: ["Dryness", "Dullness", "Fine Lines"],
    benefits: ["Hydrates", "Brightens", "Firms", "Nourishes"],
    howToUse: "Use cleanser morning and evening. Apply serum after cleansing. Follow with moisturizer. Use eye cream twice daily.",
    crueltyFree: true,
    vegan: true,
    expiryMonths: 24,
    countryOfOrigin: "France",
  },
  // Halo Products - Waitlist only
  {
    id: "p_2",
    name: "Rose Gold Serum",
    slug: "rose-gold-serum",
    category: "Skin Care",
    subcategory: "Serums",
    price: 1890,
    rating: 4.8,
    reviewCount: 84,
    image: "/images/product-2/v1.jpg",
    inStock: false,
    stockCount: 0,
    shortDescription: "Luxurious rose-infused serum for radiant skin",
    description: "A precious serum infused with pure rose gold extracts. Limited edition - join the waitlist to secure yours.",
    ingredients: ["Rose Extract", "Gold Particles", "Hyaluronic Acid", "Vitamin E"],
    images: ["/images/product-2/v1.jpg"],
    skinTypes: ["All Skin Types"],
    concerns: ["Dullness", "Anti-Aging"],
    benefits: ["Radiance", "Anti-Aging", "Hydration"],
    crueltyFree: true,
    vegan: false,
    expiryMonths: 18,
    countryOfOrigin: "France",
  },
  {
    id: "p_3",
    name: "Midnight Repair Cream",
    slug: "midnight-repair-cream",
    category: "Skin Care",
    subcategory: "Night Care",
    price: 2100,
    rating: 4.9,
    reviewCount: 112,
    image: "/images/product-3/v1.jpg",
    inStock: false,
    stockCount: 0,
    shortDescription: "Overnight skin renewal treatment",
    description: "Works while you sleep to repair and rejuvenate. Limited stock - join waitlist for next release.",
    ingredients: ["Retinol", "Peptides", "Niacinamide", "Ceramides"],
    images: ["/images/product-3/v1.jpg"],
    skinTypes: ["Dry", "Combination", "Normal"],
    concerns: ["Dark Spots", "Fine Lines", "Dullness"],
    benefits: ["Repair", "Firming", "Brightening"],
    crueltyFree: true,
    vegan: true,
    expiryMonths: 12,
    countryOfOrigin: "Switzerland",
  },
  {
    id: "p_4",
    name: "Crystal Eye Elixir",
    slug: "crystal-eye-elixir",
    category: "Skin Care",
    subcategory: "Eye Care",
    price: 1650,
    rating: 4.7,
    reviewCount: 67,
    image: "/images/product-4/v1.jpg",
    inStock: false,
    stockCount: 0,
    shortDescription: "Precious eye treatment with crystal extracts",
    description: "A rare elixir for the delicate eye area. Exclusive limited edition - waitlist now open.",
    ingredients: ["Crystal Extracts", "Caffeine", "Peptides", "Hyaluronic Acid"],
    images: ["/images/product-4/v1.jpg"],
    skinTypes: ["All Skin Types"],
    concerns: ["Dark Spots", "Fine Lines", "Sensitivity"],
    benefits: ["Brightens", "De-puffs", "Smooths"],
    crueltyFree: true,
    vegan: true,
    expiryMonths: 18,
    countryOfOrigin: "Japan",
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
};

export const getProducts = (): Product[] => {
  return MOCK_PRODUCTS;
};

export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  return MOCK_PRODUCTS
    .filter((p) => p.id !== productId)
    .slice(0, limit);
};

export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return MOCK_PRODUCTS.slice(0, limit);
};
