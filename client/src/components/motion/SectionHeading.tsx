import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION_CONFIG as M } from "@/motion/config";
import {
  sectionHeadingAccent,
  sectionHeadingEyebrow,
  sectionHeadingTitle,
} from "@/motion/variants";
import { useSafeMotion } from "@/motion/useSafeMotion";

type Level = "h1" | "h2" | "h3";

const tagMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

export type SectionHeadingProps = {
  children: React.ReactNode;
  eyebrow?: React.ReactNode;
  level?: Level;
  className?: string;
  headingClassName?: string;
  eyebrowClassName?: string;
  accentClassName?: string;
  hideAccent?: boolean;
  id?: string;
};

/**
 * Section heading with scroll-triggered reveal (below-the-fold sections).
 */
export function SectionHeading({
  children,
  eyebrow,
  level = "h2",
  className,
  headingClassName,
  eyebrowClassName,
  accentClassName,
  hideAccent = false,
  id,
}: SectionHeadingProps) {
  const { safeTransition, shouldAnimate } = useSafeMotion();
  const Heading = tagMap[level];

  const headingSizeClass =
    level === "h1"
      ? "text-3xl md:text-4xl"
      : level === "h2"
        ? "text-2xl md:text-3xl"
        : "text-xl md:text-2xl";

  if (!shouldAnimate) {
    return (
      <div className={cn("space-y-2", className)}>
        {eyebrow ? (
          <p
            className={cn(
              "font-mono text-xs font-semibold uppercase tracking-widest text-accent-highlight",
              eyebrowClassName,
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        {React.createElement(
          level,
          {
            id,
            className: cn(
              "font-heading font-bold tracking-tight text-foreground",
              headingSizeClass,
              headingClassName,
            ),
          },
          children,
        )}
        {hideAccent ? null : (
          <span
            aria-hidden
            className={cn(
              "block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/20",
              accentClassName,
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow ? (
        <motion.p
          className={cn(
            "font-mono text-xs font-semibold uppercase tracking-widest text-accent-highlight",
            eyebrowClassName,
          )}
          variants={sectionHeadingEyebrow}
          initial="hidden"
          whileInView="show"
          viewport={M.revealViewport}
          transition={safeTransition}
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <Heading
        id={id}
        className={cn(
          "font-heading font-bold tracking-tight text-foreground",
          headingSizeClass,
          headingClassName,
        )}
        variants={sectionHeadingTitle}
        initial="hidden"
        whileInView="show"
        viewport={M.revealViewport}
        transition={safeTransition}
      >
        {children}
      </Heading>

      {hideAccent ? null : (
        <motion.span
          aria-hidden
          className={cn(
            "block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/20",
            accentClassName,
          )}
          variants={sectionHeadingAccent}
          initial="hidden"
          whileInView="show"
          viewport={M.revealViewport}
          transition={safeTransition}
          style={{ transformOrigin: "left" }}
        />
      )}
    </div>
  );
}
