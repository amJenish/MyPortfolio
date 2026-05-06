import * as React from "react";
import { motion } from "framer-motion";
import { MOTION_CONFIG as M } from "@/motion/config";
import { staggerContainerInView, cardItem } from "@/motion/variants";
import { useSafeMotion } from "@/motion/useSafeMotion";
import { AnimatedButton } from "@/components/motion/AnimatedButton";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Github, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { KaggleProject, Project } from "@/lib/interfaces";
import { mlDetailPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Variant = "software" | "ml";

export type HomeSpotlightSectionProps = {
  variant: Variant;
  items: Project[] | KaggleProject[];
  title: string;
  eyebrow?: string | null;
  seeAllHref: string;
  seeAllLabel: string;
  className?: string;
};

function itemHref(p: Project | KaggleProject, v: Variant): string {
  return v === "software" ? `/project/${p.id}` : mlDetailPath(p.id);
}

export function HomeSpotlightSection({
  variant,
  items,
  title,
  eyebrow,
  seeAllHref,
  seeAllLabel,
  className,
}: HomeSpotlightSectionProps) {
  const { shouldAnimate, safeTransition } = useSafeMotion();
  const resolvedEyebrow =
    eyebrow === null
      ? null
      : (eyebrow ?? (variant === "software" ? "Software engineering & More" : "Experiments & write-ups"));

  const microTransition = {
    duration: M.duration.micro,
    ease: [...M.easing] as [number, number, number, number],
    ...safeTransition,
  };

  return (
    <section className={cn("w-full", className)} aria-labelledby={`spotlight-${variant}-heading`}>
      <div className="mb-10 w-full">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <SectionHeading
            id={`spotlight-${variant}-heading`}
            eyebrow={resolvedEyebrow}
            className="min-w-0 flex-1 text-left"
          >
            {title}
          </SectionHeading>
          <motion.div
            whileHover={shouldAnimate ? { x: 3 } : undefined}
            transition={microTransition}
          >
            <Link
              href={seeAllHref}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-colors duration-150 hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {seeAllLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/70 p-6 text-sm text-muted-foreground">
          Spotlight content is being refreshed. Check back shortly.
        </div>
      ) : (
        <motion.ul
          className="grid w-full grid-cols-1 gap-6 md:grid-cols-3"
          variants={shouldAnimate ? staggerContainerInView : undefined}
          initial={shouldAnimate ? "hidden" : false}
          whileInView={shouldAnimate ? "show" : undefined}
          viewport={M.revealViewport}
          transition={safeTransition}
        >
          {items.map((p) => (
            <motion.li
              key={p.id}
              variants={shouldAnimate ? cardItem : undefined}
              className="min-w-0 list-none"
            >
              <article className="home-spotlight-card flex min-h-[23rem] flex-col">
                <h3 className="font-heading mt-3 text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
                  {p.title}
                </h3>

                {p.summary ? (
                  <p className="mt-4 text-sm leading-[1.75] text-muted-foreground">
                    {p.summary}
                  </p>
                ) : null}

                {p.cardMetrics?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-border/50 pt-5">
                    {p.cardMetrics.map((metric) => (
                      <span
                        key={`${metric.label}-${metric.value}`}
                        className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium tabular-nums text-foreground"
                      >
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="mx-1.5 text-border">·</span>
                        <span className="font-semibold text-accent-highlight">{metric.value}</span>
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border/50 pt-5">
                  <AnimatedButton variant="primary">
                    <Link
                      href={itemHref(p, variant)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Open page
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </AnimatedButton>
                  <AnimatedButton variant="secondary">
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl border-2 border-border bg-background/50 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-150 hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Github className="h-4 w-4 shrink-0" aria-hidden />
                      GitHub
                    </a>
                  </AnimatedButton>
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
}
