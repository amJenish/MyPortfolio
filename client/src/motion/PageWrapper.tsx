import * as React from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/motion/variants";
import { useSafeMotion } from "@/motion/useSafeMotion";
import { useInitialLoad } from "@/motion/useInitialLoad";
import { MOTION_CONFIG as M } from "@/motion/config";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Single orchestrator for above-the-fold page content. Children use variants only;
 * initial/animate live here so first paint and reduced-motion behave consistently.
 */
export function PageWrapper({ children, className }: Props) {
  const { safeTransition, shouldAnimate } = useSafeMotion();
  const isReady = useInitialLoad();

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={isReady ? "show" : "hidden"}
      transition={
        safeTransition ?? {
          duration: M.duration.standard,
          ease: [...M.easing],
        }
      }
    >
      {children}
    </motion.div>
  );
}
