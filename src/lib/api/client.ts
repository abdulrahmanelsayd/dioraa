/**
 * API Client - Base configuration for all API calls
 * Currently returns mock data, designed to be replaced with Supabase/Backend
 */

import type { ApiError } from "./types";

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

// Default configuration - will be replaced with real API config
const defaultConfig: ApiClientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Simulates network delay for realistic loading states in development
 * Skipped in production for maximum performance
 */
const simulateDelay = (ms: number = 600): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    return Promise.resolve();
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Creates a standardized API error
 */
export const createApiError = (
  code: string,
  message: string,
  status: number = 500
): ApiError => ({
  code,
  message,
  status,
});

/**
 * Structured error logging for production monitoring
 * In production, this would send to an external service like Sentry
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logError = (error: ApiError, context?: Record<string, unknown>): void => {
  const timestamp = new Date().toISOString();
  const errorPayload = {
    timestamp,
    level: "error",
    code: error.code,
    message: error.message,
    status: error.status,
    environment: process.env.NODE_ENV || "development",
    ...context,
  };

  // In production, send to external monitoring service
  if (process.env.NODE_ENV === "production") {
    // Example: Sentry.captureException(error, { extra: context });
    // For now, use structured console.error
    console.error("[API_ERROR]", JSON.stringify(errorPayload));
  } else {
    // Development: pretty print for readability
    console.error("[API Error]", errorPayload);
  }
};


/**
 * Next.js fetch options for CDN edge caching
 */
interface NextFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Fetch with timeout, custom signal support, and CDN cache optimization.
 * Uses AbortSignal.timeout() for 8-second absolute timeout.
 * Combines with React Query's signal if provided.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number; next?: NextFetchOptions }
): Promise<Response> {
  const { timeout = 8000, next, ...fetchOptions } = options;

  // Create timeout signal (8 second default for Black Friday resilience)
  const timeoutSignal = AbortSignal.timeout(timeout);

  // Combine signals if a custom signal is provided (e.g., from React Query)
  const combinedSignal = fetchOptions.signal
    ? AbortSignal.any([fetchOptions.signal, timeoutSignal])
    : timeoutSignal;

  // Next.js App Router cache options for CDN edge caching
  const nextOptions = next ? { next } : {};

  return fetch(url, {
    ...fetchOptions,
    signal: combinedSignal,
    ...nextOptions,
  });
}

/**
 * Base fetch wrapper with timeout, signal support, CDN caching, and graceful error handling.
 * - 8-second absolute timeout prevents hanging requests
 * - 503/504 errors get user-friendly messaging
 * - AbortSignal integration enables request cancellation
 * - Next.js cache options enable CDN edge caching (5-minute revalidate for product lists)
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { timeout?: number; next?: NextFetchOptions }
): Promise<T> {
  const url = `${defaultConfig.baseUrl}${endpoint}`;

  // Default Next.js cache options for product data (5 minutes)
  const defaultNextOptions: NextFetchOptions = {
    revalidate: 300, // 5 minutes CDN edge cache
    tags: ["products"],
  };

  // Merge default cache options with user-provided options
  const nextOptions = options?.next !== undefined
    ? options.next
    : defaultNextOptions;

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      next: nextOptions,
      headers: {
        ...defaultConfig.headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      // Graceful degradation for server overload scenarios
      if (response.status === 503) {
        throw new Error("Service temporarily unavailable. Please try again shortly.");
      }
      if (response.status === 504) {
        throw new Error("Gateway timeout. The server is taking too long to respond. Please try again.");
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // Enhance timeout errors with user-friendly messaging
    if (error instanceof Error) {
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        throw new Error("Request timed out. Please check your connection and try again.");
      }
    }
    throw error;
  }
}

export { simulateDelay };
