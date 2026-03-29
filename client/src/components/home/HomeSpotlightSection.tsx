import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollRevealRootMargin } from "@/components/motion/scrollMotion";
import { Github } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import type { KaggleProject, Project } from "@/lib/interfaces";
import { mlDetailPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Variant = "software" | "ml";

export type HomeSpotlightSectionProps = {
  variant: Variant;
  items: Project[] | KaggleProject[];
  title: string;
  seeAllHref: string;
  seeAllLabel: string;
  className?: string;
};

function itemHref(p: Project | KaggleProject, v: Variant): string {
  return v === "software" ? `/project/${p.id}` : mlDetailPath(p.id);
}

function itemSubtitle(p: Project | KaggleProject, v: Variant): string {
  if (v === "software") return "Software project";
  const kp = p as KaggleProject;
  return `${kp.date} · Notebook report`;
}

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
};

export function HomeSpotlightSection({
  variant,
  items,
  title,
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
    if (listRevealed) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setListRevealed(true);
          }
        });
      },
      { root: null, rootMargin: scrollRevealRootMargin, threshold: 0 },
    );
    io.observe(listEl);
    return () => io.disconnect();
  }, [listEl, reduceMotion, listRevealed, variant]);

  const listActive = Boolean(reduceMotion || listRevealed);

  if (items.length === 0) return null;

  return (
    <section className={cn("w-full", className)} aria-labelledby={`spotlight-${variant}-heading`}>
      <div className="mb-8 w-full">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1 text-left">
            <h2
              id={`spotlight-${variant}-heading`}
              className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
            >
              {title}
            </h2>
            <div
              className="mt-4 h-1 w-full max-w-2xl rounded-full bg-gradient-to-r from-primary via-primary/50 to-transparent"
              aria-hidden
            />
          </div>
          <motion.div
            whileHover={reduceMotion ? undefined : { x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link
              href={seeAllHref}
              className="inline-flex shrink-0 items-center rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {seeAllLabel}
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.ul
        ref={setListEl}
        className="grid w-full grid-cols-1 gap-6 md:grid-cols-3"
        variants={reduceMotion ? undefined : listVariants}
        initial="hidden"
        animate={listActive ? "show" : "hidden"}
      >
        {items.map((p) => (
          <motion.li key={p.id} variants={reduceMotion ? undefined : cardVariants} className="min-w-0 list-none">
            <article className="home-spotlight-card flex h-full flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/90">{itemSubtitle(p, variant)}</p>
              <h3 className="font-heading mt-3 text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
                {p.title}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-5">
                {p.tags.slice(0, 6).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="border border-primary/20 bg-primary/[0.08] text-xs font-medium text-foreground/90"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    href={itemHref(p, variant)}
                    className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Open page
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
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-border bg-background/50 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
    </section>
  );
}
