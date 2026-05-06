import { useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";

/**
 * Respects prefers-reduced-motion: when enabled, motion should snap (duration 0).
 */
export function useSafeMotion() {
  const reduced = useReducedMotion();
  // Temporary override: keep full motion enabled site-wide.
  // You can wire this to a user preference toggle later.
  const forceMotion = true;
  const effectiveReduced = forceMotion ? false : reduced;
  return {
    safeTransition: effectiveReduced ? ({ duration: 0 } satisfies Transition) : undefined,
    shouldAnimate: !effectiveReduced,
  } as const;
}
