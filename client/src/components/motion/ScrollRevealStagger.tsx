import * as React from "react";
import { motion, type HTMLMotionProps, type Variants, useReducedMotion } from "framer-motion";
import {
  getScrollRevealStaggerItemVariants,
  scrollRevealDuration,
  scrollRevealRootMargin,
} from "./scrollMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  /** Override default stagger item reveal length */
  duration?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "whileInView" | "variants">;

/**
 * Staggers children when the container intersects the viewport (IntersectionObserver + variants).
 * Replays when the container leaves and re-enters the viewport.
 */
export function ScrollRevealStagger({
  children,
  className,
  stagger = 0.04,
  delayChildren = 0.03,
  duration = scrollRevealDuration,
  ...rest
}: Props) {
  const reduceMotion = useReducedMotion();
  const [rootEl, setRootEl] = React.useState<Element | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;
    if (!rootEl) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setRevealed(entry.isIntersecting);
        });
      },
      { root: null, rootMargin: scrollRevealRootMargin, threshold: 0 },
    );
    io.observe(rootEl);
    return () => io.disconnect();
  }, [rootEl, reduceMotion]);

  const active = Boolean(reduceMotion || revealed);

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: reduceMotion ? 0 : delayChildren,
      },
    },
  };

  const item: Variants = getScrollRevealStaggerItemVariants(reduceMotion, duration);

  return (
    <motion.div
      ref={setRootEl}
      className={className}
      variants={container}
      initial="hidden"
      animate={active ? "show" : "hidden"}
      {...rest}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={React.isValidElement(child) && child.key != null ? String(child.key) : i}
          variants={item}
          className="min-h-0 min-w-0 h-full"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
