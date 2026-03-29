import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Reading progress under the header — uses window scroll so it works even when scrollingElement is quirky.
 */
export function ScrollReadingProgress() {
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);

  React.useEffect(() => {
    if (reduceMotion) return;

    const read = () => {
      const root = document.scrollingElement ?? document.documentElement;
      if (!root) return;
      const scrollable = root.scrollHeight - root.clientHeight;
      progress.set(scrollable <= 0 ? 0 : root.scrollTop / scrollable);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [progress, reduceMotion]);

  const scaleX = useSpring(progress, {
    stiffness: 140,
    damping: 32,
    mass: 0.35,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 right-0 top-[3.25rem] z-[55] h-[2px] origin-left bg-gradient-to-r from-primary via-primary/85 to-primary/50 shadow-[0_0_12px_hsl(165_90%_50%_/_0.35)]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
