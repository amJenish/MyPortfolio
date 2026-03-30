import type { TargetAndTransition, Variants } from "framer-motion";

/** Shared easing for scroll-driven entrances — smooth deceleration */
export const scrollEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Short, snappy — long blurs/lifts read as distracting */
export const scrollRevealDuration = 0.38;

/**
 * Faster timing for route-level list pages (Projects / Data & ML / Paperwork) so the first paint
 * after navigation feels closer to Home. Home keeps the default `scrollRevealDuration`.
 */
export const scrollRevealRouteDuration = 0.22;
export const scrollRevealRouteStagger = 0.028;
export const scrollRevealRouteDelayChildren = 0.02;

/** Bottom inset: smaller (more negative %) = reveal earlier as you scroll */
export const scrollRevealRootMargin = "0px 0px -10% 0px";

/** Viewport preset for occasional `whileInView` usage */
export const scrollViewport = {
  once: true as const,
  margin: scrollRevealRootMargin,
  amount: "some" as const,
};

/** Single-block scroll reveal: blur + lift + slight scale (“decode” as it enters) */
export function getScrollRevealMotion(reduceMotion: boolean | null): {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
} {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0, y: 0, scale: 1, filter: "blur(0px)" },
      visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    };
  }
  return {
    hidden: { opacity: 0, y: 18, scale: 0.99, filter: "blur(5px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  };
}

/** Stagger children: same visual language as `ScrollReveal` */
export function getScrollRevealStaggerItemVariants(
  reduceMotion: boolean | null,
  itemDuration: number = scrollRevealDuration,
): Variants {
  const r = Boolean(reduceMotion);
  if (r) {
    return {
      hidden: {},
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0, ease: scrollEase },
      },
    };
  }
  return {
    hidden: { opacity: 0, y: 18, scale: 0.99, filter: "blur(5px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: itemDuration * 0.95, ease: scrollEase },
    },
  };
}
