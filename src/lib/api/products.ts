/**
 * Products API Service
 * Abstracted data layer for product operations
 * Data imported from products-catalog.ts for easy maintenance
 */

import type { Product, ProductFilters, Category, PaginatedResponse } from "./types";
import { withErrorHandling, simulateDelay } from "./client";
import { MOCK_PRODUCTS } from "./products-catalog";

// ============================================================================
// CATEGORIES - Updated with subcategories
// ============================================================================

const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "Skin Care",
    slug: "skin-care",
    description:
      "Discover our curated selection of premium skincare products, crafted with the finest botanical ingredients for radiant, healthy skin.",
    productCount: 5,
    subcategories: ["Cleansers", "Toners", "Serums", "Essences", "Moisturizers", "Face Oils", "Masks", "Eye Care", "Sun Care"],
  },
  {
    id: "cat_2",
    name: "Hair Care",
    slug: "hair-care",
    description:
      "Explore our luxurious hair care collection, formulated with nourishing ingredients to restore shine, strength, and natural beauty.",
    productCount: 3,
    subcategories: ["Shampoo", "Conditioner", "Treatments", "Styling", "Tools"],
  },
  {
    id: "cat_3",
    name: "Makeup",
    slug: "makeup",
    description:
      "Enhance your natural beauty with our premium makeup collection. From flawless foundations to statement lipsticks, create your perfect look.",
    productCount: 6,
    subcategories: ["Face", "Eyes", "Lips", "Cheeks", "Brushes & Tools"],
  },
  {
    id: "cat_4",
    name: "Body Care",
    slug: "body-care",
    description:
      "Indulge in our luxurious body care essentials. From hydrating lotions to invigorating scrubs, transform your daily ritual into a spa experience.",
    productCount: 5,
    subcategories: ["Body Wash", "Body Lotion", "Body Scrub", "Hand Care", "Foot Care", "Sun Care"],
  },
  {
    id: "cat_5",
    name: "Fragrance",
    slug: "fragrance",
    description:
      "Discover your signature scent with our curated collection of luxurious fragrances. From fresh florals to warm orientals, find your perfect match.",
    productCount: 4,
    subcategories: ["Perfume", "Eau de Parfum", "Eau de Toilette", "Body Mist", "Home Fragrance"],
  },
  {
    id: "cat_6",
    name: "Tools & Accessories",
    slug: "tools-accessories",
    description:
      "Elevate your beauty routine with our premium tools and accessories. From rose quartz rollers to professional brush sets, every detail matters.",
    productCount: 5,
    subcategories: ["Skincare Tools", "Brushes", "Accessories", "Storage"],
  },
];

// ============================================================================
// API SERVICE FUNCTIONS
// ============================================================================

/**
 * Fetch all products with optional filtering
 */
export async function getProducts(
  filters?: ProductFilters
): Promise<Product[]> {
  return withErrorHandling(async () => {
    await simulateDelay(500);

    let products = [...MOCK_PRODUCTS];

    // Apply filters
    if (filters) {
      // Category filter
      if (filters.category && filters.category !== "All") {
        products = products.filter((p) => p.category === filters.category);
      }

      // Subcategory filter
      if (filters.subcategory) {
        products = products.filter((p) => p.subcategory === filters.subcategory);
      }

      // Price range filter
      if (filters.minPrice !== undefined) {
        products = products.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter((p) => p.price <= filters.maxPrice!);
      }

      // In stock filter
      if (filters.inStock) {
        products = products.filter((p) => p.inStock);
      }

      // New arrivals filter
      if (filters.isNew) {
        products = products.filter((p) => p.isNew);
      }

      // On sale filter
      if (filters.onSale) {
        products = products.filter((p) => p.originalPrice !== undefined);
      }

      // Skin type filter
      if (filters.skinTypes && filters.skinTypes.length > 0) {
        products = products.filter((p) =>
          p.skinTypes?.some((st) => filters.skinTypes!.includes(st))
        );
      }

      // Skin concern filter
      if (filters.concerns && filters.concerns.length > 0) {
        products = products.filter((p) =>
          p.concerns?.some((c) => filters.concerns!.includes(c))
        );
      }

      // Ingredient search (include)
      if (filters.ingredients && filters.ingredients.length > 0) {
        products = products.filter((p) =>
          filters.ingredients!.every((ing) =>
            p.ingredients?.some((pi) =>
              pi.toLowerCase().includes(ing.toLowerCase())
            )
          )
        );
      }

      // Exclude ingredients (allergy filter)
      if (filters.excludeIngredients && filters.excludeIngredients.length > 0) {
        products = products.filter((p) =>
          !filters.excludeIngredients!.some((exclude) =>
            p.ingredients?.some((pi) =>
              pi.toLowerCase().includes(exclude.toLowerCase())
            )
          )
        );
      }

      // Cruelty-free filter
      if (filters.crueltyFree) {
        products = products.filter((p) => p.crueltyFree);
      }

      // Vegan filter
      if (filters.vegan) {
        products = products.filter((p) => p.vegan);
      }

      // Min rating filter
      if (filters.minRating) {
        products = products.filter((p) => p.rating >= filters.minRating!);
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower) ||
            p.ingredients?.some((i) => i.toLowerCase().includes(searchLower)) ||
            p.skinTypes?.some((st) => st.toLowerCase().includes(searchLower)) ||
            p.concerns?.some((c) => c.toLowerCase().includes(searchLower))
        );
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-asc":
            products.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            products.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            products.sort((a, b) => b.rating - a.rating);
            break;
          case "newest":
            products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
          case "bestselling":
            products.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        }
      }
    }

    return products;
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return withErrorHandling(async () => {
    await simulateDelay(400);
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  return withErrorHandling(async () => {
    await simulateDelay(300);
    return MOCK_PRODUCTS.find((p) => p.id === id) || null;
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Fetch related products (same category, excluding current)
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  return withErrorHandling(async () => {
    await simulateDelay(400);

    const currentProduct = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!currentProduct) return [];

    return MOCK_PRODUCTS.filter(
      (p) => p.id !== productId && p.category === currentProduct.category
    )
      .slice(0, limit);
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  return withErrorHandling(async () => {
    await simulateDelay(200);
    return MOCK_CATEGORIES;
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Fetch category by slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return withErrorHandling(async () => {
    await simulateDelay(200);
    return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Search products with pagination
 */
export async function searchProducts(
  query: string,
  page: number = 1,
  pageSize: number = 12
): Promise<PaginatedResponse<Product>> {
  return withErrorHandling(async () => {
    await simulateDelay(400);

    const queryLower = query.toLowerCase();
    const allResults = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(queryLower) ||
        p.description?.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower) ||
        p.ingredients?.some((i) => i.toLowerCase().includes(queryLower)) ||
        p.skinTypes?.some((st) => st.toLowerCase().includes(queryLower)) ||
        p.concerns?.some((c) => c.toLowerCase().includes(queryLower))
    );

    const startIndex = (page - 1) * pageSize;
    const paginatedResults = allResults.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedResults,
      total: allResults.length,
      page,
      pageSize,
      hasMore: startIndex + pageSize < allResults.length,
    };
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Check product stock availability
 */
export async function checkProductStock(
  productId: string
): Promise<{ inStock: boolean; stockCount: number }> {
  return withErrorHandling(async () => {
    await simulateDelay(100);
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    return {
      inStock: product?.inStock ?? false,
      stockCount: product?.stockCount ?? 0,
    };
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

// ============================================================================
// NEW FUNCTIONS - Reviews, Ingredients, Advanced Filtering
// ============================================================================

import type { Review, ReviewFilters, ReviewSummary } from "./types";

/**
 * Get reviews for a product
 */
export async function getProductReviews(
  productId: string,
  filters?: ReviewFilters
): Promise<Review[]> {
  return withErrorHandling(async () => {
    await simulateDelay(300);
    
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product || !product.reviews) return [];
    
    let reviews = [...product.reviews];
    
    if (filters) {
      if (filters.rating) {
        reviews = reviews.filter((r) => r.rating === filters.rating);
      }
      
      if (filters.verifiedOnly) {
        reviews = reviews.filter((r) => r.verified);
      }
      
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "newest":
            reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "highest":
            reviews.sort((a, b) => b.rating - a.rating);
            break;
          case "lowest":
            reviews.sort((a, b) => a.rating - b.rating);
            break;
          case "helpful":
            reviews.sort((a, b) => b.helpful - a.helpful);
            break;
        }
      }
    }
    
    return reviews;
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Get review summary for a product
 */
export async function getReviewSummary(productId: string): Promise<ReviewSummary> {
  return withErrorHandling(async () => {
    await simulateDelay(200);
    
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product || !product.reviews) {
      return {
        productId,
        averageRating: 0,
        totalReviews: 0,
        verifiedCount: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
    
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let verifiedCount = 0;
    
    product.reviews.forEach((r) => {
      distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
      if (r.verified) verifiedCount++;
    });
    
    return {
      productId,
      averageRating: product.rating,
      totalReviews: product.reviewCount,
      verifiedCount,
      distribution,
    };
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Search ingredients across all products
 */
export async function searchIngredients(query: string): Promise<string[]> {
  return withErrorHandling(async () => {
    await simulateDelay(300);
    
    const queryLower = query.toLowerCase();
    const allIngredients = new Set<string>();
    
    MOCK_PRODUCTS.forEach((p) => {
      p.ingredients?.forEach((ing) => {
        if (ing.toLowerCase().includes(queryLower)) {
          allIngredients.add(ing);
        }
      });
    });
    
    return Array.from(allIngredients).sort();
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Get all unique ingredients (for allergy search)
 */
export async function getAllIngredients(): Promise<string[]> {
  return withErrorHandling(async () => {
    await simulateDelay(200);
    
    const allIngredients = new Set<string>();
    
    MOCK_PRODUCTS.forEach((p) => {
      p.ingredients?.forEach((ing) => allIngredients.add(ing));
    });
    
    return Array.from(allIngredients).sort();
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Get products by ingredient (include or exclude)
 */
export async function getProductsByIngredient(
  ingredient: string,
  exclude: boolean = false
): Promise<Product[]> {
  return withErrorHandling(async () => {
    await simulateDelay(400);
    
    const ingLower = ingredient.toLowerCase();
    
    if (exclude) {
      return MOCK_PRODUCTS.filter(
        (p) => !p.ingredients?.some((i) => i.toLowerCase().includes(ingLower))
      );
    }
    
    return MOCK_PRODUCTS.filter(
      (p) => p.ingredients?.some((i) => i.toLowerCase().includes(ingLower))
    );
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Get all skin types
 */
export async function getAllSkinTypes(): Promise<string[]> {
  return withErrorHandling(async () => {
    await simulateDelay(100);
    return ["Oily", "Dry", "Combination", "Sensitive", "Normal", "All Skin Types"];
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

/**
 * Get all skin concerns
 */
export async function getAllSkinConcerns(): Promise<string[]> {
  return withErrorHandling(async () => {
    await simulateDelay(100);
    return [
      "Acne",
      "Anti-Aging",
      "Dark Spots",
      "Dryness",
      "Dullness",
      "Fine Lines",
      "Oiliness",
      "Pores",
      "Redness",
      "Sensitivity",
      "Uneven Texture",
      "Hydration",
      "Firmness",
      "Brightening",
    ];
  }).then((result) => {
    if (result.error) throw result.error;
    return result.data!;
  });
}

