/**
 * Products API Service - Part 1: Types and Reviews Generator
 * Expanded catalog with Makeup, Body Care, Fragrance, Tools
 */

import type {
  Product,
  ProductFilters,
  Category,
  PaginatedResponse,
  Review,
} from "./types";
import { withErrorHandling, simulateDelay } from "./client";

// Reviews generator for social proof
const generateReviews = (productId: string, count: number, avgRating: number): Review[] => {
  const templates = [
    { title: "Absolutely love this!", comment: "This product has completely transformed my skin. I've been using it for 3 weeks and the results are incredible." },
    { title: "Holy grail product", comment: "I've tried so many products but this one actually works. The texture is luxurious and absorbs quickly." },
    { title: "Worth every penny", comment: "Yes, it's pricey, but you only need a small amount so it lasts. Quality is exceptional." },
    { title: "Great for sensitive skin", comment: "I have very sensitive skin and this doesn't irritate it at all. Finally found something that works!" },
    { title: "Visible results in 2 weeks", comment: "Started seeing improvements within 2 weeks. Friends have commented on how radiant my skin looks." },
  ];
  const firstNames = ["Sarah", "Emma", "Lisa", "Jennifer", "Maria", "Amanda", "Rachel", "Michelle"];
  
  return Array.from({ length: count }, (_, i) => {
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
      helpful: Math.floor(Math.random() * 50) + 1,
      verified: Math.random() > 0.2,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};
