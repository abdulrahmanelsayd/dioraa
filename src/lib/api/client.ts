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
 * Simulates network delay for realistic loading states
 * Remove this when connecting to real backend
 */
const simulateDelay = (ms: number = 600): Promise<void> => {
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
 * Wraps async operations with consistent error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const apiError: ApiError =
      error instanceof Error
        ? createApiError("UNKNOWN_ERROR", error.message)
        : createApiError("UNKNOWN_ERROR", "An unexpected error occurred");
    return { data: null, error: apiError };
  }
}

/**
 * Base fetch wrapper - will be enhanced for real API calls
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${defaultConfig.baseUrl}${endpoint}`;

  // For now, we're using mock data, so this is a placeholder
  // When connecting to Supabase, this will make real HTTP requests
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultConfig.headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export { simulateDelay };
