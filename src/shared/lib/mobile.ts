/**
 * Mobile Performance Optimizations for DIORA
 * FAANG-level performance utilities for mobile devices
 */

// Network Information API types
interface NetworkInformation {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

// iOS standalone mode type
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

// Idle Deadline type for requestIdleCallback
interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

type IdleRequestCallback = (deadline: IdleDeadline) => void;

interface IdleRequestOptions {
  timeout?: number;
}

interface WindowWithIdleCallback extends Window {
  requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback: (handle: number) => void;
}

// Detect slow connections and adapt loading strategy
export function detectConnectionSpeed(): 'slow' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (connection) {
    const { effectiveType, downlink } = connection;
    
    // Slow connection: 2G, 3G, or downlink < 1.5 Mbps
    if (effectiveType === '2g' || effectiveType === '3g' || downlink < 1.5) {
      return 'slow';
    }
    
    return 'fast';
  }
  
  return 'unknown';
}

// Check if device prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check if device is mobile
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check if device supports touch
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Check if device is in standalone mode (PWA)
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as NavigatorWithStandalone).standalone === true;
}

// Get device viewport dimensions
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

// Calculate optimal image size based on viewport
export function getOptimalImageSize(containerWidth: number): string {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  const width = containerWidth * dpr;
  
  // Return optimal size for responsive images
  if (width <= 320) return '320w';
  if (width <= 480) return '480w';
  if (width <= 640) return '640w';
  if (width <= 768) return '768w';
  if (width <= 1024) return '1024w';
  if (width <= 1280) return '1280w';
  return '1536w';
}

// Debounce function for scroll/resize handlers
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for continuous events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Request Idle Callback polyfill
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }): ReturnType<typeof setTimeout> {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = (window as WindowWithIdleCallback).requestIdleCallback(callback, options);
    return id as unknown as ReturnType<typeof setTimeout>;
  }
  
  return setTimeout(callback, 1);
}

// Cancel Idle Callback polyfill
export function cancelIdleCallback(id: ReturnType<typeof setTimeout>): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    (window as WindowWithIdleCallback).cancelIdleCallback(id as unknown as number);
  } else {
    clearTimeout(id);
  }
}

// Preload critical resources
export function preloadResource(href: string, as: 'image' | 'style' | 'script' | 'font'): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

// Prefetch next page resources
export function prefetchPage(href: string): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
}

// Check if element is in viewport
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= windowHeight + offset &&
    rect.right <= windowWidth + offset
  );
}

// Get scroll percentage
export function getScrollPercentage(): number {
  if (typeof window === 'undefined') return 0;
  
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  
  return (scrollTop / scrollHeight) * 100;
}

// Smooth scroll to element
export function smoothScrollTo(element: HTMLElement, offset = 0): void {
  if (typeof window === 'undefined') return;
  
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
}

// Vibrate for haptic feedback (mobile only)
export function vibrate(pattern: number | number[] = 10): boolean {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return false;
  
  navigator.vibrate(pattern);
  return true;
}

// Mobile performance configuration
export const MOBILE_CONFIG = {
  // Lazy loading threshold (distance from viewport)
  lazyLoadThreshold: 200,
  
  // Image quality based on connection
  imageQuality: {
    slow: 60,
    fast: 85,
    unknown: 75,
  },
  
  // Animation duration multiplier for reduced motion
  animationMultiplier: prefersReducedMotion() ? 0 : 1,
  
  // Touch target minimum size (Apple HIG)
  touchTargetMin: 44,
  
  // Scroll debounce time
  scrollDebounce: 100,
  
  // Resize debounce time
  resizeDebounce: 150,
} as const;
