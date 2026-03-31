/**
 * API Layer - Barrel Export
 * Central export point for all API services
 * 
 * Usage:
 *   import { getProducts, getProductBySlug } from '@/lib/api';
 * 
 * Migration to Supabase:
 *   1. Update client.ts with Supabase client configuration
 *   2. Replace mock data in products.ts with Supabase queries
 *   3. Types remain unchanged (shared contract)
 */

// Types
export type {
  Product,
  ProductCategory,
  SkinType,
  SkinConcern,
  CartItem,
  PaginatedResponse,
  ApiError,
  ProductFilters,
  Category,
  Review,
  ReviewFilters,
  ReviewSummary,
} from "./types";

// Client utilities
export { createApiError, withErrorHandling } from "./client";

// Product API
export {
  getProducts,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  searchProducts,
  checkProductStock,
  getProductReviews,
  getReviewSummary,
  searchIngredients,
  getAllIngredients,
  getProductsByIngredient,
  getAllSkinTypes,
  getAllSkinConcerns,
} from "./products";

// Category API
export { getCategories, getCategoryBySlug } from "./products";

// Catalog data (for seeding/reference)
export { MOCK_PRODUCTS } from "./products-catalog";
