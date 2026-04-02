import { Variants, Transition } from "framer-motion";

// ============================================================================
// EASING CURVES - GPU-friendly string easings
// ============================================================================

/** Primary easing - smooth deceleration */
export const EASE_LUXURY = "easeOut" as const;

/** Secondary easing - gentle in-out */
export const EASE_EDITORIAL = "easeInOut" as const;

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

/** Quick fade for small elements */
export const TRANSITION_QUICK: Transition = {
  duration: 0.6,
  ease: EASE_LUXURY,
};

/** Standard fade for sections */
export const TRANSITION_STANDARD: Transition = {
  duration: 0.8,
  ease: EASE_EDITORIAL,
};

/** Slow cinematic fade for hero elements */
export const TRANSITION_CINEMATIC: Transition = {
  duration: 1.2,
  ease: EASE_EDITORIAL,
};

/** Staggered item animation with configurable delay */
export const createStaggerTransition = (index: number): Transition => ({
  duration: 0.8,
  delay: index * 0.1,
  ease: EASE_EDITORIAL,
});

// ============================================================================
// VARIANTS
// ============================================================================

// Cinematic page entrance — GPU composited with opacity and transform only
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Staggered children container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

// Fade up for individual items
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Scale fade for cards
export const scaleFadeIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Slide in from right
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// SHOP PAGE ANIMATIONS - Stable references for memoization
// ============================================================================

/** Product grid item animation - optimized without layout prop */
export const productGridItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/** Dropdown animation for filters */
export const filterDropdown: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.95 },
};

/** Filter section expansion - GPU composited with scaleY and transform origin */
export const filterSectionExpand: Variants = {
  initial: { opacity: 0, scaleY: 0.95 },
  animate: { 
    opacity: 1, 
    scaleY: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: { 
    opacity: 0, 
    scaleY: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/** Stagger delay for product grid items */
export const PRODUCT_STAGGER_DELAY = 0.05;

/** Filter section transition */
export const filterSectionTransition: Transition = {
  duration: 0.25,
  ease: "easeOut",
};

/** Dropdown transition */
export const dropdownTransition: Transition = {
  duration: 0.2,
};
