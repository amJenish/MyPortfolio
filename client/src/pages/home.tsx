import React, { useRef, useCallback, useMemo } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Mail, FileText, Sparkles } from "lucide-react";
import { profile, projects, researchPapers, kaggleProjects } from "@/lib/content/registry";
import { Link } from "wouter";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { ML_LIST_PATH, PAPERWORK_LIST_PATH } from "@/lib/routes";
import {
  HOME_SPOTLIGHT_NOTEBOOK_IDS,
  HOME_SPOTLIGHT_PROJECT_IDS,
  resolveSpotlightByIds,
} from "@/lib/content/home/spotlightConfig";
import { HomeSpotlightSection } from "@/components/home/HomeSpotlightSection";
import { SkillsShowcase } from "@/components/home/SkillsShowcase";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionDivider } from "@/components/home/SectionDivider";
import { scrollEase } from "@/components/motion/scrollMotion";
import { cn } from "@/lib/utils";

export default function Home() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.12], [0, 52]);

  const spotlightProjects = useMemo(
    () => resolveSpotlightByIds(projects, HOME_SPOTLIGHT_PROJECT_IDS),
    [],
  );
  const spotlightNotebooks = useMemo(
    () => resolveSpotlightByIds(kaggleProjects, HOME_SPOTLIGHT_NOTEBOOK_IDS),
    [],
  );

  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: reduceMotion ? 0 : 0.08 },
    },
  };

  const heroItem: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: scrollEase },
    },
  };

  const onHeroPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduceMotion) return;
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--hero-x", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--hero-y", `${((e.clientY - r.top) / r.height) * 100}%`);
    },
    [reduceMotion],
  );

  const onHeroPointerLeave = useCallback(() => {
    heroRef.current?.style.removeProperty("--hero-x");
    heroRef.current?.style.removeProperty("--hero-y");
  }, []);

  return (
    <Layout>
      <div className="space-y-20 md:space-y-28">

        {/* ── Hero ── */}
        <section
          ref={heroRef}
          onPointerMove={onHeroPointerMove}
          onPointerLeave={onHeroPointerLeave}
          className={cn(
            "home-hero home-hero-interactive relative overflow-hidden rounded-3xl border border-border/60 bg-card px-8 py-16 shadow-xl sm:px-12 sm:py-20 md:py-24",
          )}
        >
          {/* Decorative blobs */}
          <motion.div
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/[0.08] blur-3xl"
            aria-hidden
            style={reduceMotion ? undefined : { y: heroParallax }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.div
              variants={heroContainer}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
            >
              {/* Availability badge */}
              <motion.div variants={heroItem} className="mb-6 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5 text-accent-highlight" aria-hidden />
                  Available for Work
                  <span className="inline-block h-4 w-px bg-primary/40 animate-blink" aria-hidden />
                </span>
              </motion.div>

              {/* Name — largest element, maximum hierarchy */}
              <motion.h1
                variants={heroItem}
                className="gradient-heading font-heading text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
              >
                {profile.name}
              </motion.h1>

              {/* Subtitle — clear secondary hierarchy */}
              <motion.p
                variants={heroItem}
                className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                CS student at Western University building full-stack systems with React, TypeScript, and Python-backed APIs,
                then pressure-testing ideas through reproducible Data & ML notebook studies.
              </motion.p>

              {/* CTA buttons — strong emphasis, clear primary action */}
              <motion.div
                variants={heroItem}
                className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
              >
                <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
                  <Link href="/projects">
                    <Button size="lg" variant="cta" className="h-12 min-w-[11rem] px-8 text-sm font-semibold">
                      View Projects
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="h-12 min-w-[11rem] border-2 border-border bg-card/60 text-sm font-semibold hover:border-primary/50 hover:text-primary"
                  >
                    <a href={profile.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="h-12 min-w-[11rem] border-2 border-border bg-card/60 text-sm font-semibold hover:border-primary/50 hover:text-primary"
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.p variants={heroItem} className="mt-6 text-xs text-muted-foreground">
                Computer Science · Western University
              </motion.p>
            </motion.div>
          </div>
        </section>

        <SectionDivider />

        {/* ── About + Skills ── */}
        <section className="grid gap-12 lg:grid-cols-2 lg:gap-16" aria-labelledby="about-heading">
          <ScrollReveal as="div" className="space-y-5">
            <h2 id="about-heading" className="font-heading text-2xl font-bold md:text-3xl">
              About me
            </h2>
            <div className="prose prose-neutral max-w-none text-muted-foreground prose-p:leading-[1.75] prose-p:text-[0.9375rem]">
              <p>{profile.bio}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal as="div" className="min-w-0" delay={0.08}>
            <SkillsShowcase heading="Stack" description={null} />
          </ScrollReveal>
        </section>

        {/* ── Projects spotlight ── */}
        <ScrollReveal as="section">
          <HomeSpotlightSection
            variant="software"
            items={spotlightProjects}
            title="Projects"
            eyebrow={null}
            seeAllHref="/projects"
            seeAllLabel="See all projects"
          />
        </ScrollReveal>

        {/* ── Notebooks spotlight ── */}
        <ScrollReveal as="section" delay={0.04}>
          <HomeSpotlightSection
            variant="ml"
            items={spotlightNotebooks}
            title="Analytical & Research Thinking"
            eyebrow={null}
            seeAllHref={ML_LIST_PATH}
            seeAllLabel={`All notebooks (${kaggleProjects.length})`}
          />
        </ScrollReveal>

        <SectionDivider />

        {/* ── Paperwork CTA ── */}
        <ScrollReveal
          as="section"
          className="space-y-6 border-t border-border/60 pt-14"
          aria-labelledby="paperwork-home-heading"
          delay={0.06}
        >
          <div className="space-y-1">
            <h2 id="paperwork-home-heading" className="font-heading text-2xl font-bold md:text-3xl">
              Papers &amp; PDFs
            </h2>
          </div>
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            Long-form write-ups and research PDFs. Open the list to read or download.
          </p>
          <motion.div
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.99 }}
          >
            <Link
              href={PAPERWORK_LIST_PATH}
              className="group flex max-w-lg items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-md transition-all hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <FileText className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-heading font-semibold text-foreground">{researchPapers.length} documents available</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Research notes and PDF writeups</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </motion.div>
        </ScrollReveal>

      </div>
    </Layout>
  );
}
