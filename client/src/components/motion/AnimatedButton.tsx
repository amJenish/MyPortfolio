import * as React from "react";
import { motion } from "framer-motion";
import { MOTION_CONFIG as M } from "@/motion/config";
import { useSafeMotion } from "@/motion/useSafeMotion";

export type AnimatedButtonVariant = "primary" | "secondary" | "ghost";

export type AnimatedButtonProps = {
  children: React.ReactNode;
  variant?: AnimatedButtonVariant;
  className?: string;
};

const ease = [...M.easing] as [number, number, number, number];

/**
 * Hover/tap micro-interaction for CTAs. Uses MOTION_CONFIG + useSafeMotion.
 */
export function AnimatedButton({
  children,
  variant = "primary",
  className,
}: AnimatedButtonProps) {
  const { safeTransition, shouldAnimate } = useSafeMotion();

  const transition = {
    duration: M.duration.micro,
    ease,
    ...safeTransition,
  };

  return (
    <motion.div
      data-animated-button={variant}
      className={className}
      whileHover={shouldAnimate ? { scale: 1.03 } : undefined}
      whileTap={shouldAnimate ? { scale: 0.97 } : undefined}
      transition={transition}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
