/**
 * API Types - Shared across all API services
 * These types represent the data contracts between frontend and backend
 */

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

export type SkinType =
  | "Oily"
  | "Dry"
  | "Combination"
  | "Sensitive"
  | "Normal"
  | "All Skin Types";

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

export type MakeupSubcategory =
  | "Face"
  | "Eyes"
  | "Lips"
  | "Cheeks"
  | "Brushes & Tools";

export type BodyCareSubcategory =
  | "Body Wash"
  | "Body Lotion"
  | "Body Scrub"
  | "Hand Care"
  | "Foot Care"
  | "Sun Care";

export type FragranceSubcategory =
  | "Perfume"
  | "Eau de Parfum"
  | "Eau de Toilette"
  | "Body Mist"
  | "Home Fragrance";

export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface ProductFilters {
  category?: ProductCategory | "All";
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest" | "bestselling";
  search?: string;
  skinTypes?: SkinType[];
  concerns?: SkinConcern[];
  ingredients?: string[];
  excludeIngredients?: string[];
  crueltyFree?: boolean;
  vegan?: boolean;
  minRating?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount: number;
  subcategories?: string[];
}

export interface ReviewFilters {
  rating?: number;
  verifiedOnly?: boolean;
  sortBy?: "newest" | "highest" | "lowest" | "helpful";
  page?: number;
  pageSize?: number;
}

export interface ReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  verifiedCount: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
