/**
 * CSRF Protection Utilities
 */

import { generateSecureToken } from "./password";

const CSRF_TOKEN_KEY = "diora-csrf-token";
const CSRF_HEADER = "x-csrf-token";
const CSRF_COOKIE_NAME = "csrf_token";

/**
 * Generate and store a CSRF token
 */
export function getOrCreateCsrfToken(): string {
  if (typeof window === "undefined") {
    return generateSecureToken();
  }

  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);

  if (!token) {
    token = generateSecureToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }

  return token;
}

/**
 * Get CSRF header name
 */
export function getCsrfHeaderName(): string {
  return CSRF_HEADER;
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(
  providedToken: string,
  storedToken: string
): boolean {
  if (!providedToken || !storedToken) return false;
  return providedToken === storedToken;
}

/**
 * Create CSRF-protected headers for API requests
 */
export function createCsrfHeaders(): Record<string, string> {
  const token = getOrCreateCsrfToken();
  return {
    [CSRF_HEADER]: token,
  };
}

/**
 * Server-side CSRF cookie management
 */
export function getCsrfCookieName(): string {
  return CSRF_COOKIE_NAME;
}
