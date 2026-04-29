import * as React from "react";
import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import {
  getScrollRevealMotion,
  scrollEase,
  scrollRevealDuration,
  scrollRevealRootMargin,
} from "./scrollMotion";

const tags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  main: motion.main,
  aside: motion.aside,
  header: motion.header,
} as const;

type Tag = keyof typeof tags;

export type ScrollRevealProps = {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Override default reveal length (e.g. faster on route list pages) */
  duration?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "whileInView" | "transition">;

/**
 * Scroll-driven reveal using IntersectionObserver (more reliable than whileInView with routed/layout parents).
 */
export function ScrollReveal({
  as = "div",
  children,
  className,
  delay = 0,
  duration = scrollRevealDuration,
  ...rest
}: ScrollRevealProps) {
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

  const show = Boolean(reduceMotion || revealed);
  const Comp = tags[as];
  const { hidden, visible } = getScrollRevealMotion(reduceMotion);

  return (
    <Comp
      ref={setRootEl}
      className={className}
      initial={false}
      animate={show ? visible : hidden}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: scrollEase,
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
