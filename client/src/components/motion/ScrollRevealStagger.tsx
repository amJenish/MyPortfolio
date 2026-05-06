import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { MOTION_CONFIG as M } from "@/motion/config";
import { useSafeMotion } from "@/motion/useSafeMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  duration?: number;
  role?: React.AriaRole;
  "aria-label"?: string;
};

/**
 * Staggered grid reveal when the container enters the viewport (below-the-fold).
 */
export function ScrollRevealStagger({
  children,
  className,
  stagger = M.stagger,
  delayChildren = M.delayChildren,
  duration = M.duration.standard,
  role,
  "aria-label": ariaLabel,
}: Props) {
  const { safeTransition, shouldAnimate } = useSafeMotion();
  const ease = [...M.easing] as [number, number, number, number];

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: M.revealDistance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration, ease },
    },
  };

  if (!shouldAnimate) {
    return (
      <div className={className} role={role} aria-label={ariaLabel}>
        {React.Children.map(children, (child, i) => (
          <div
            key={
              React.isValidElement(child) && child.key != null
                ? String(child.key)
                : i
            }
            className="min-h-0 min-w-0 h-full"
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      role={role}
      aria-label={ariaLabel}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={M.revealViewport}
      transition={safeTransition}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={
            React.isValidElement(child) && child.key != null
              ? String(child.key)
              : i
          }
          variants={item}
          transition={safeTransition}
          className="min-h-0 min-w-0 h-full"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
