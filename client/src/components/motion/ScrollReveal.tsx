import * as React from "react";
import { RevealOnScroll, type RevealDirection } from "./RevealOnScroll";
import { MOTION_CONFIG as M } from "@/motion/config";

const tagWhitelist = [
  "div",
  "section",
  "article",
  "main",
  "aside",
  "header",
  "footer",
] as const;

type Tag = (typeof tagWhitelist)[number];

export type ScrollRevealProps = {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
} & Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
>;

/**
 * Backwards-compatible wrapper around the canonical RevealOnScroll primitive.
 */
export function ScrollReveal({
  as = "div",
  children,
  className,
  delay = 0,
  duration = M.duration.standard,
  direction = "up",
  distance = M.revealDistance,
  ...rest
}: ScrollRevealProps) {
  return (
    <RevealOnScroll
      as={as}
      className={className}
      delay={delay}
      duration={duration}
      direction={direction}
      distance={distance}
      {...rest}
    >
      {children}
    </RevealOnScroll>
  );
}
