/**
 * Touch Gesture Hooks for DIORA
 * FAANG-level touch interaction utilities
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { vibrate, prefersReducedMotion } from "@/shared/lib/mobile";

// Types for gesture hooks
interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  direction: "left" | "right" | "up" | "down" | null;
  distance: number;
  velocity: number;
}

interface UseSwipeGestureOptions {
  threshold?: number;
  velocityThreshold?: number;
  preventDefaultTouch?: boolean;
  hapticFeedback?: boolean;
}

/**
 * Hook for detecting swipe gestures
 */
export function useSwipeGesture<T extends HTMLElement>(
  handlers: SwipeHandlers,
  options: UseSwipeGestureOptions = {}
) {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    preventDefaultTouch = false,
    hapticFeedback = true,
  } = options;

  const ref = useRef<T>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    direction: null,
    distance: 0,
    velocity: 0,
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setSwipeState({ direction: null, distance: 0, velocity: 0 });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    if (preventDefaultTouch) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const velocity = distance / deltaTime;

    setSwipeState({
      direction: null,
      distance,
      velocity,
    });
  }, [preventDefaultTouch]);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const velocity = distance / deltaTime;

      // Determine direction
      let direction: SwipeState["direction"] = null;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold && velocity > velocityThreshold) {
          direction = deltaX > 0 ? "right" : "left";
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold && velocity > velocityThreshold) {
          direction = deltaY > 0 ? "down" : "up";
        }
      }

      if (direction) {
        // Haptic feedback
        if (hapticFeedback && !prefersReducedMotion()) {
          vibrate(10);
        }

        // Call appropriate handler
        switch (direction) {
          case "left":
            handlers.onSwipeLeft?.();
            break;
          case "right":
            handlers.onSwipeRight?.();
            break;
          case "up":
            handlers.onSwipeUp?.();
            break;
          case "down":
            handlers.onSwipeDown?.();
            break;
        }

        setSwipeState({ direction, distance, velocity });
      }

      touchStart.current = null;
    },
    [handlers, threshold, velocityThreshold, hapticFeedback]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: !preventDefaultTouch });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefaultTouch]);

  return { ref, swipeState };
}

/**
 * Hook for pull-to-refresh gesture
 */
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  options: {
    threshold?: number;
    maxPullDistance?: number;
    hapticFeedback?: boolean;
  } = {}
) {
  const { threshold = 80, maxPullDistance = 150, hapticFeedback = true } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStart = useRef<number | null>(null);
  const lastTouch = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshing) return;

    const element = ref.current;
    if (!element || element.scrollTop > 0) return;

    touchStart.current = e.touches[0].clientY;
    lastTouch.current = e.touches[0].clientY;
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (touchStart.current === null || isRefreshing) return;

    const element = ref.current;
    if (!element || element.scrollTop > 0) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStart.current;

    if (deltaY > 0) {
      // Pulling down
      const distance = Math.min(deltaY, maxPullDistance);
      const resistance = 0.5;
      setPullDistance(distance * resistance);
      lastTouch.current = currentY;
    }
  }, [isRefreshing, maxPullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      // Haptic feedback
      if (hapticFeedback && !prefersReducedMotion()) {
        vibrate([10, 50, 10]);
      }

      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    touchStart.current = null;
    lastTouch.current = null;
  }, [pullDistance, threshold, isRefreshing, onRefresh, hapticFeedback]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { ref, isRefreshing, pullDistance };
}

/**
 * Hook for long press gesture
 */
export function useLongPress(
  callback: () => void,
  options: {
    delay?: number;
    hapticFeedback?: boolean;
    onStart?: () => void;
    onCancel?: () => void;
  } = {}
) {
  const { delay = 500, hapticFeedback = true, onStart, onCancel } = options;

  const ref = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(() => {
    isLongPress.current = false;
    onStart?.();

    timeoutRef.current = setTimeout(() => {
      isLongPress.current = true;

      // Haptic feedback
      if (hapticFeedback && !prefersReducedMotion()) {
        vibrate(50);
      }

      callback();
    }, delay);
  }, [callback, delay, hapticFeedback, onStart]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isLongPress.current) {
      onCancel?.();
    }
  }, [onCancel]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchstart", start, { passive: true });
    element.addEventListener("touchend", clear, { passive: true });
    element.addEventListener("touchmove", clear, { passive: true });
    element.addEventListener("touchcancel", clear, { passive: true });

    return () => {
      element.removeEventListener("touchstart", start);
      element.removeEventListener("touchend", clear);
      element.removeEventListener("touchmove", clear);
      element.removeEventListener("touchcancel", clear);
    };
  }, [start, clear]);

  return { ref };
}

/**
 * Hook for double tap gesture
 */
export function useDoubleTap(
  callback: () => void,
  options: {
    delay?: number;
    hapticFeedback?: boolean;
  } = {}
) {
  const { delay = 300, hapticFeedback = true } = options;

  const ref = useRef<HTMLElement>(null);
  const lastTap = useRef<number | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();

    if (lastTap.current && now - lastTap.current < delay) {
      // Double tap detected
      if (hapticFeedback && !prefersReducedMotion()) {
        vibrate([10, 50, 10]);
      }

      callback();
      lastTap.current = null;
    } else {
      lastTap.current = now;
    }
  }, [callback, delay, hapticFeedback]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchend", handleTap, { passive: true });

    return () => {
      element.removeEventListener("touchend", handleTap);
    };
  }, [handleTap]);

  return { ref };
}

/**
 * Hook for touch ripple effect
 */
export function useTouchRipple<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  return { ref, ripples, addRipple };
}

/**
 * Hook for pinch-to-zoom gesture
 */
export function usePinchZoom(
  options: {
    minScale?: number;
    maxScale?: number;
    onScaleChange?: (scale: number) => void;
  } = {}
) {
  const { minScale = 1, maxScale = 3, onScaleChange } = options;

  const ref = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);
  const initialDistance = useRef<number | null>(null);
  const initialScale = useRef(1);

  const getDistance = (touches: TouchList): number => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2) return;

    e.preventDefault();
    initialDistance.current = getDistance(e.touches);
    initialScale.current = scale;
  }, [scale]);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length !== 2 || initialDistance.current === null) return;

      e.preventDefault();

      const currentDistance = getDistance(e.touches);
      const scaleChange = currentDistance / initialDistance.current;
      const newScale = Math.min(maxScale, Math.max(minScale, initialScale.current * scaleChange));

      setScale(newScale);
      onScaleChange?.(newScale);
    },
    [minScale, maxScale, onScaleChange]
  );

  const handleTouchEnd = useCallback(() => {
    initialDistance.current = null;
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, { passive: false });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { ref, scale, setScale };
}
