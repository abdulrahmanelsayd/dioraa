/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiting for client-side protection
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Default configurations for different actions
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 attempts per minute
  signup: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  passwordReset: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  addToCart: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute
};

/**
 * Check if an action is rate limited
 */
export function isRateLimited(
  action: string,
  identifier: string = "default"
): { limited: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMITS[action] || RATE_LIMITS.api;
  const key = `${action}:${identifier}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Reset rate limit for a specific action/identifier
 */
export function resetRateLimit(action: string, identifier: string = "default"): void {
  const key = `${action}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Get remaining attempts for an action
 */
export function getRemainingAttempts(
  action: string,
  identifier: string = "default"
): number {
  const config = RATE_LIMITS[action] || RATE_LIMITS.api;
  const key = `${action}:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (!entry || Date.now() > entry.resetTime) {
    return config.maxRequests;
  }

  return Math.max(0, config.maxRequests - entry.count);
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto cleanup every 5 minutes
if (typeof window !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}
