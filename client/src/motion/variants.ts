import type { Transition, Variants } from "framer-motion";
import { MOTION_CONFIG as M } from "./config";

const baseEase = [...M.easing] as [number, number, number, number];

export function motionTransition(extra: Partial<Transition> = {}): Transition {
  return {
    duration: M.duration.standard,
    ease: baseEase,
    ...extra,
  };
}

function t(extra: Partial<Transition> = {}): Transition {
  return motionTransition(extra);
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: M.revealDistance },
  show: { opacity: 1, y: 0, transition: t() },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -M.revealDistance },
  show: { opacity: 1, x: 0, transition: t() },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: M.revealDistance },
  show: { opacity: 1, x: 0, transition: t() },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: t({ duration: M.duration.cinematic }),
  },
};

export const heroBadge: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: t({
      duration: M.duration.cinematic,
      delay: M.heroGraphicDelay,
    }),
  },
};

export const heroSubhead: Variants = {
  hidden: { opacity: 0, y: M.revealDistance },
  show: {
    opacity: 1,
    y: 0,
    transition: t({ delay: M.heroSubheadDelay }),
  },
};

export const heroCtaRow: Variants = {
  hidden: { opacity: 0, y: M.revealDistance },
  show: {
    opacity: 1,
    y: 0,
    transition: t({ delay: M.heroCtaDelay }),
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: M.stagger,
      delayChildren: M.delayChildren,
    },
  },
};

export const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: M.heroWordStagger,
      delayChildren: M.heroDelayChildren,
    },
  },
};

export const cardItem: Variants = {
  hidden: { opacity: 0, y: M.revealDistance },
  show: { opacity: 1, y: 0, transition: t() },
};

/** Staggered grid that reveals when the container enters view (below-fold grids). */
export const staggerContainerInView: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: M.stagger,
      delayChildren: M.delayChildren,
    },
  },
};

export const sectionHeadingEyebrow: Variants = {
  hidden: { opacity: 0, y: M.sectionEyebrowOffset },
  show: { opacity: 1, y: 0, transition: t() },
};

export const sectionHeadingTitle: Variants = {
  hidden: { opacity: 0, y: M.sectionTitleOffset },
  show: { opacity: 1, y: 0, transition: t() },
};

export const sectionHeadingAccent: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: t({ delay: M.sectionAccentDelay }),
  },
};
