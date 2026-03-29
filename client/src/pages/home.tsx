import React, { useRef, useCallback, useMemo } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Mail, FileText } from "lucide-react";
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
import { scrollEase } from "@/components/motion/scrollMotion";
import { cn } from "@/lib/utils";

export default function Home() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.12], [0, 48]);

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
      transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: reduceMotion ? 0 : 0.06 },
    },
  };

  const heroItem: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: scrollEase },
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
      <div className="space-y-16 md:space-y-24">
        <section
          ref={heroRef}
          onPointerMove={onHeroPointerMove}
          onPointerLeave={onHeroPointerLeave}
          className={cn(
            "home-hero home-hero-interactive relative overflow-hidden rounded-2xl border border-border/70 bg-card/40 px-6 py-14 shadow-lg sm:px-10 sm:py-16 md:py-20",
          )}
        >
          <motion.div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl"
            aria-hidden
            style={reduceMotion ? undefined : { y: heroParallax }}
          />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.div
              variants={heroContainer}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
            >
              <motion.p
                variants={heroItem}
                className="mb-4 flex flex-wrap items-center justify-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              >
                <span>Available for Internships</span>
                <span className="inline-block h-4 w-px translate-y-px bg-primary animate-blink" aria-hidden />
              </motion.p>
              <motion.h1
                variants={heroItem}
                className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
              >
                {profile.name}
              </motion.h1>
              <motion.p
                variants={heroItem}
                className="mt-5 max-w-lg text-base leading-[1.6] text-muted-foreground sm:text-lg"
              >
                Computer Science student focused on software engineering and machine learning, with experience building backend systems and practical ML models.
              </motion.p>
              <motion.div
                variants={heroItem}
                className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start"
              >
                <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                  <Link href="/projects">
                    <Button size="lg" variant="cta" className="h-12 min-w-[12rem] w-full px-8 text-base sm:w-auto">
                      View projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                  <Button variant="outline" size="lg" asChild className="h-12 min-w-[12rem] border-2 border-border bg-card/60 text-base hover:border-primary/40">
                    <a href={profile.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                      GitHub
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                  <Button variant="outline" size="lg" asChild className="h-12 min-w-[12rem] border-2 border-border bg-card/60 text-base hover:border-primary/40">
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="h-5 w-5" />
                      Email
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2 lg:gap-14" aria-labelledby="about-heading">
          <ScrollReveal as="div" className="space-y-4">
            <h2 id="about-heading" className="font-heading text-xl font-bold md:text-2xl">
              About me
            </h2>
            <div className="prose prose-invert prose-neutral max-w-none text-muted-foreground prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base">
              <p>{profile.bio}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal as="div" className="min-w-0" delay={0.08}>
            <SkillsShowcase heading="Stack" />
          </ScrollReveal>
        </section>

        <ScrollReveal as="section">
          <HomeSpotlightSection
            variant="software"
            items={spotlightProjects}
            title="Projects"
            seeAllHref="/projects"
            seeAllLabel="All projects"
          />
        </ScrollReveal>

        <ScrollReveal as="section" delay={0.04}>
          <HomeSpotlightSection
            variant="ml"
            items={spotlightNotebooks}
            title="Notebooks"
            seeAllHref={ML_LIST_PATH}
            seeAllLabel={`All notebooks (${kaggleProjects.length})`}
          />
        </ScrollReveal>

        <ScrollReveal
          as="section"
          className="space-y-5 border-t border-border/60 pt-12"
          aria-labelledby="paperwork-home-heading"
          delay={0.06}
        >
          <h2 id="paperwork-home-heading" className="font-heading text-xl font-bold md:text-2xl">
            Paperwork
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            PDFs and write-ups. open the list to read or download.
          </p>
          <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
            <Link
              href={PAPERWORK_LIST_PATH}
              className="paperwork-home-card group flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-foreground">Papers &amp; PDFs</p>
                  <p className="text-sm text-muted-foreground">{researchPapers.length} available</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </motion.div>
        </ScrollReveal>
      </div>
    </Layout>
  );
}
