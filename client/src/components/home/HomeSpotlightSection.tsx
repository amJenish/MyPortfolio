import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollRevealRootMargin } from "@/components/motion/scrollMotion";
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

function itemSubtitle(p: Project | KaggleProject, v: Variant): string {
  if (v === "software") {
    const proj = p as Project;
    const slug = proj.reportSlug ?? "";
    if (slug.startsWith("ai-")) return "Automation Project";
    if (slug.startsWith("ml-")) return "Machine Learning / Experiment";
    return "Software project";
  }
  const kp = p as KaggleProject;
  return `${kp.date} · Notebook`;
}

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.03 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
};

export function HomeSpotlightSection({
  variant,
  items,
  title,
  eyebrow,
  seeAllHref,
  seeAllLabel,
  className,
}: HomeSpotlightSectionProps) {
  const reduceMotion = useReducedMotion();
  const [listEl, setListEl] = React.useState<Element | null>(null);
  const [listRevealed, setListRevealed] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;
    if (!listEl) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setListRevealed(entry.isIntersecting);
        });
      },
      { root: null, rootMargin: scrollRevealRootMargin, threshold: 0 },
    );
    io.observe(listEl);
    return () => io.disconnect();
  }, [listEl, reduceMotion, variant]);

  const listActive = Boolean(reduceMotion || listRevealed);
  const resolvedEyebrow =
    eyebrow === null
      ? null
      : (eyebrow ?? (variant === "software" ? "Software engineering & More" : "Experiments & write-ups"));

  return (
    <section className={cn("w-full", className)} aria-labelledby={`spotlight-${variant}-heading`}>
      {/* ── Section header ── */}
      <div className="mb-10 w-full">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1 text-left space-y-2">
            {resolvedEyebrow ? (
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-highlight">
                {resolvedEyebrow}
              </p>
            ) : null}
            <h2
              id={`spotlight-${variant}-heading`}
              className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
            >
              {title}
            </h2>
            {/* Gradient underline — visual emphasis on section heading */}
            <div
              className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/20"
              aria-hidden
            />
          </div>
          <motion.div
            whileHover={reduceMotion ? undefined : { x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link
              href={seeAllHref}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.06] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {seeAllLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Cards grid ── */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/70 p-6 text-sm text-muted-foreground">
          Spotlight content is being refreshed. Check back shortly.
        </div>
      ) : (
        <motion.ul
          ref={setListEl}
          className="grid w-full grid-cols-1 gap-6 md:grid-cols-3"
          variants={reduceMotion ? undefined : listVariants}
          initial="hidden"
          animate={listActive ? "show" : "hidden"}
        >
          {items.map((p) => (
          <motion.li
            key={p.id}
            variants={reduceMotion ? undefined : cardVariants}
            className="min-w-0 list-none"
          >
            <article className="home-spotlight-card flex min-h-[23rem] flex-col">
              {/* Category label — smallest, tertiary hierarchy */}
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-accent-highlight">
                {itemSubtitle(p, variant)}
              </p>

              {/* Title — primary hierarchy on card */}
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

              {/* CTA buttons — clear primary action */}
              <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border/50 pt-5">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    href={itemHref(p, variant)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Open page
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border-2 border-border bg-background/50 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Github className="h-4 w-4 shrink-0" aria-hidden />
                    GitHub
                  </a>
                </motion.div>
              </div>
            </article>
          </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
}
