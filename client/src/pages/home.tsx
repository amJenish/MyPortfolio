import React, { useRef, useCallback, useMemo } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { profile, projects, kaggleProjects } from "@/lib/content/registry";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ML_LIST_PATH } from "@/lib/routes";
import {
  HOME_SPOTLIGHT_NOTEBOOK_IDS,
  HOME_SPOTLIGHT_PROJECT_IDS,
  resolveSpotlightByIds,
} from "@/lib/content/home/spotlightConfig";
import { HomeSpotlightSection } from "@/components/home/HomeSpotlightSection";
import { SkillsShowcase } from "@/components/home/SkillsShowcase";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionDivider } from "@/components/home/SectionDivider";
import { AnimatedButton } from "@/components/motion/AnimatedButton";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { PageWrapper } from "@/motion/PageWrapper";
import { MOTION_CONFIG as M } from "@/motion/config";
import {
  fadeUp,
  heroBadge,
  heroContainer,
  heroCtaRow,
  heroSubhead,
} from "@/motion/variants";
import { useSafeMotion } from "@/motion/useSafeMotion";
import { cn } from "@/lib/utils";

function HeroHeadline({ text }: { text: string }) {
  const words = useMemo(() => text.split(/\s+/), [text]);
  const { shouldAnimate } = useSafeMotion();

  if (!shouldAnimate) {
    return (
      <h1 className="gradient-heading font-heading text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
        {text}
      </h1>
    );
  }

  return (
    <h1 className="gradient-heading font-heading text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden={false}
          className="inline-block"
          variants={fadeUp}
          style={{ marginRight: i === words.length - 1 ? 0 : "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

export default function Home() {
  const { shouldAnimate, safeTransition } = useSafeMotion();
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

  const onHeroPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!shouldAnimate) return;
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--hero-x", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--hero-y", `${((e.clientY - r.top) / r.height) * 100}%`);
    },
    [shouldAnimate],
  );

  const onHeroPointerLeave = useCallback(() => {
    heroRef.current?.style.removeProperty("--hero-x");
    heroRef.current?.style.removeProperty("--hero-y");
  }, []);

  return (
    <Layout>
      <PageWrapper className="space-y-20 md:space-y-28">
          <motion.section
            ref={heroRef}
            onPointerMove={onHeroPointerMove}
            onPointerLeave={onHeroPointerLeave}
            variants={shouldAnimate ? heroContainer : undefined}
            className={cn(
              "home-hero home-hero-interactive relative overflow-hidden rounded-3xl border border-border/60 bg-card px-8 py-16 shadow-xl sm:px-12 sm:py-20 md:py-24",
            )}
          >
            <motion.div
              className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/[0.08] blur-3xl"
              aria-hidden
              style={shouldAnimate ? { y: heroParallax } : undefined}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl"
              aria-hidden
            />

            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <motion.div
                className="mb-6 flex justify-center"
                variants={shouldAnimate ? heroBadge : undefined}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5 text-accent-highlight" aria-hidden />
                  Available for Work
                  {shouldAnimate ? (
                    <motion.span
                      aria-hidden
                      className="inline-block h-4 w-px bg-primary/40"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: [1, 1, 0, 0] }}
                      transition={{
                        duration: M.heroCursorBlinkDuration,
                        times: [0, 0.5, 0.5, 1],
                        ease: "linear",
                        repeat: M.heroCursorRepeat,
                        ...safeTransition,
                      }}
                    />
                  ) : (
                    <span aria-hidden className="inline-block h-4 w-px bg-primary/40" />
                  )}
                </span>
              </motion.div>

              <HeroHeadline text={profile.name} />

              <motion.p
                className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                variants={shouldAnimate ? heroSubhead : undefined}
              >
                CS student at Western University building full-stack systems with React, TypeScript, and Python-backed APIs,
                then pressure-testing ideas through reproducible Data & ML notebook studies.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
                variants={shouldAnimate ? heroCtaRow : undefined}
              >
                <AnimatedButton variant="primary">
                  <Link href="/projects">
                    <Button size="lg" variant="cta" className="h-12 min-w-[11rem] px-8 text-sm font-semibold">
                      View Projects
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </AnimatedButton>
                <AnimatedButton variant="secondary">
                  <Button
                    variant="cta"
                    size="lg"
                    asChild
                    className="h-12 min-w-[11rem] px-8 text-sm font-semibold"
                  >
                    <Link href={ML_LIST_PATH}>
                      View Data &amp; ML work
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </AnimatedButton>
                <p className="mt-6 w-full text-center text-xs text-muted-foreground sm:mt-0 sm:basis-full">
                  Computer Science · Western University
                </p>
              </motion.div>
            </div>
          </motion.section>

          <SectionDivider />

          <section className="grid gap-12 lg:grid-cols-2 lg:gap-16" aria-labelledby="about-heading">
            <div className="space-y-5">
              <SectionHeading id="about-heading">About me</SectionHeading>
              <ScrollReveal as="div" className="space-y-5">
                <div className="prose prose-neutral max-w-none text-muted-foreground prose-p:leading-[1.75] prose-p:text-[0.9375rem]">
                  <p>{profile.bio}</p>
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal as="div" className="min-w-0" delay={0.08}>
              <SkillsShowcase heading="Stack" description={null} />
            </ScrollReveal>
          </section>

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

      </PageWrapper>
    </Layout>
  );
}
