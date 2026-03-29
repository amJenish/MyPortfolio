import type { TargetAndTransition, Variants } from "framer-motion";

/** Shared easing for scroll-driven entrances — smooth deceleration */
export const scrollEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const scrollRevealDuration = 0.85;

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
    hidden: { opacity: 0, y: 44, scale: 0.965, filter: "blur(11px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  };
}

/** Stagger children: same visual language as `ScrollReveal` */
export function getScrollRevealStaggerItemVariants(reduceMotion: boolean | null): Variants {
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
    hidden: { opacity: 0, y: 44, scale: 0.965, filter: "blur(11px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: scrollRevealDuration * 0.92, ease: scrollEase },
    },
  };
}
