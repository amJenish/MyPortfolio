import * as React from "react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { MOTION_CONFIG as M } from "@/motion/config";
import { useSafeMotion } from "@/motion/useSafeMotion";
import { getScrollRevealMotion } from "./scrollMotion";
import type { ScrollRevealDirection } from "./scrollMotion";

const tagMap = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  main: motion.main,
  aside: motion.aside,
  header: motion.header,
  footer: motion.footer,
  ul: motion.ul,
  li: motion.li,
} as const;

type Tag = keyof typeof tagMap;

export type RevealDirection = ScrollRevealDirection;

export type RevealOnScrollProps = {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/**
 * Scroll-triggered reveal (below-the-fold). Uses MOTION_CONFIG.revealViewport and useSafeMotion.
 */
export function RevealOnScroll({
  as = "div",
  children,
  className,
  delay = 0,
  duration = M.duration.standard,
  direction = "up",
  distance = M.revealDistance,
  ...rest
}: RevealOnScrollProps) {
  const { safeTransition, shouldAnimate } = useSafeMotion();
  const Comp = tagMap[as];

  const variants = useMemo(() => {
    const base = getScrollRevealMotion(direction, distance);
    if (delay === 0 && duration === M.duration.standard) return base;
    const show = base.show;
    if (typeof show === "object" && show !== null && "transition" in show) {
      const tr = show.transition;
      return {
        ...base,
        show: {
          ...show,
          transition: {
            ...(typeof tr === "object" && tr !== null ? tr : {}),
            duration,
            delay,
            ease: [...M.easing] as [number, number, number, number],
          },
        },
      };
    }
    return base;
  }, [direction, distance, delay, duration]);

  const passthrough = rest as Record<string, unknown>;

  if (!shouldAnimate) {
    return (
      <Comp className={className} {...passthrough}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={M.revealViewport}
      transition={safeTransition}
      {...passthrough}
    >
      {children}
    </Comp>
  );
}
