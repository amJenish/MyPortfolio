import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import {
  getScrollRevealStaggerItemVariants,
  scrollRevealRootMargin,
} from "./scrollMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "whileInView" | "variants">;

/**
 * Staggers children into view once the container crosses the viewport (IntersectionObserver + variants).
 */
export function ScrollRevealStagger({
  children,
  className,
  stagger = 0.065,
  delayChildren = 0.05,
  ...rest
}: Props) {
  const reduceMotion = useReducedMotion();
  const [rootEl, setRootEl] = React.useState<Element | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;
    if (!rootEl) return;
    if (revealed) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setRevealed(true);
        });
      },
      { root: null, rootMargin: scrollRevealRootMargin, threshold: 0 },
    );
    io.observe(rootEl);
    return () => io.disconnect();
  }, [rootEl, reduceMotion, revealed]);

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

  const item: Variants = getScrollRevealStaggerItemVariants(reduceMotion);

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
