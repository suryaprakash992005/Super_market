import { Variants, Transition } from 'framer-motion';

/**
 * BHARATHI STORE MOTION SYSTEM & DESIGN TOKENS
 * Premium retail easing curves and standardized timing tokens.
 */

// Luxury cubic-bezier curves
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const; // Decelerating silky ease
export const EASE_SMOOTH = [0.25, 0.1, 0.25, 1] as const; // Standard subtle ease
export const EASE_BOUNCE = [0.34, 1.56, 0.64, 1] as const; // Soft organic pop
export const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const; // Ultra fast snappy snap

// Duration tokens (seconds)
export const DURATION = {
  micro: 0.15,
  fast: 0.22,
  base: 0.35,
  smooth: 0.5,
  slow: 0.8,
  intro: 1.8,
} as const;

// Standard Framer Motion transitions
export const transitionFast: Transition = {
  duration: DURATION.fast,
  ease: EASE_PREMIUM,
};

export const transitionBase: Transition = {
  duration: DURATION.base,
  ease: EASE_PREMIUM,
};

export const transitionSmooth: Transition = {
  duration: DURATION.smooth,
  ease: EASE_PREMIUM,
};

export const transitionSpring = {
  type: 'spring',
  damping: 24,
  stiffness: 300,
  mass: 0.8,
} as const;

// Reusable Motion Variants for components
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: transitionBase 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: DURATION.fast, ease: 'easeOut' } 
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: transitionBase 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: DURATION.fast, ease: 'easeIn' } 
  },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: transitionBase 
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    transition: { duration: DURATION.fast } 
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: transitionBase 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: DURATION.fast } 
  },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      duration: DURATION.base, 
      ease: EASE_PREMIUM 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.97, 
    y: 8, 
    transition: { 
      duration: DURATION.fast, 
      ease: 'easeIn' 
    } 
  },
};

export const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0.5 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.38, 
      ease: EASE_PREMIUM 
    } 
  },
  exit: { 
    x: '100%', 
    opacity: 0, 
    transition: { 
      duration: 0.28, 
      ease: [0.32, 0, 0.67, 0] 
    } 
  },
};

// Staggered list container
export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Interactive hover and press states
export const cardHoverProps = {
  whileHover: { 
    y: -4, 
    transition: { duration: 0.2, ease: EASE_PREMIUM } 
  },
  whileTap: { 
    scale: 0.985, 
    transition: { duration: 0.1 } 
  },
};

export const buttonPressProps = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
  transition: { duration: 0.12 },
};

/**
 * Checks whether user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
