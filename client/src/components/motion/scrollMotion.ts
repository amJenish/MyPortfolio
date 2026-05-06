import type { Variants } from "framer-motion";
import { MOTION_CONFIG } from "@/motion/config";

const M = MOTION_CONFIG;

export type ScrollRevealDirection = "up" | "down" | "left" | "right";

function offsetFor(direction: ScrollRevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
  }
}

/** List / route pages — align with MOTION_CONFIG */
export const scrollEase = [...M.easing] as [number, number, number, number];
export const scrollRevealRouteDuration = M.duration.standard;
export const scrollRevealRouteStagger = M.stagger;
/** Route list pages: start stagger immediately (no extra delay before first card). */
export const scrollRevealRouteDelayChildren = 0;

export function getScrollRevealMotion(
  direction: ScrollRevealDirection = "up",
  distance: number = M.revealDistance,
): Variants {
  const hiddenPos = offsetFor(direction, distance);
  return {
    hidden: { opacity: 0, ...hiddenPos },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: M.duration.standard,
        ease: [...M.easing] as [number, number, number, number],
      },
    },
  };
}
