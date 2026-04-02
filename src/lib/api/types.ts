/**
 * API Types - Shared across all API services
 * These types represent the data contracts between frontend and backend
 * 
 * Note: Core entity types (Product, CartItem, etc.) are re-exported from @/shared/types
 * to maintain a single source of truth.
 */

import type {
  Product,
  ProductVariant,
  CartItem,
  Review,
  SkinType,
  SkinConcern,
  ProductCategory,
} from "@/shared/types";

export type {
  Product,
  ProductVariant,
  CartItem,
  Review,
  SkinType,
  SkinConcern,
  ProductCategory,
};

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
  limit?: number;
  /** Page number for pagination (1-indexed) */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
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
