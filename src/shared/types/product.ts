export interface ProductVariant {
  id: string;
  size: string;
  volume: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  inStock: boolean;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  image: string;
  images?: string[];
  badge?: string;
  isNew?: boolean;
  description?: string;
  shortDescription?: string;
  ingredients?: string[];
  allergens?: string[];
  inStock?: boolean;
  stockCount?: number;
  variants?: ProductVariant[];
  // Cosmetics-specific fields
  skinTypes?: SkinType[];
  concerns?: SkinConcern[];
  benefits?: string[];
  howToUse?: string;
  volume?: string;
  countryOfOrigin?: string;
  crueltyFree?: boolean;
  vegan?: boolean;
  expiryMonths?: number;
}

export type ProductCategory =
  | "Skin Care"
  | "Hair Care"
  | "Makeup"
  | "Body Care"
  | "Fragrance"
  | "Tools & Accessories";

export type SkinType = "Oily" | "Dry" | "Combination" | "Sensitive" | "Normal" | "All Skin Types";

export type SkinConcern =
  | "Acne"
  | "Anti-Aging"
  | "Dark Spots"
  | "Dryness"
  | "Dullness"
  | "Fine Lines"
  | "Oiliness"
  | "Pores"
  | "Redness"
  | "Sensitivity"
  | "Uneven Texture"
  | "Hydration"
  | "Firmness"
  | "Brightening";

export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: string;
}
