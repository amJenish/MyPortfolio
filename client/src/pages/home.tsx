import React, { useRef, useCallback, useMemo } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { profile } from "@/lib/content/registry";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS_LIST_PATH, mlDetailPath } from "@/lib/routes";
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

              <motion.div
                className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
                variants={shouldAnimate ? heroCtaRow : undefined}
              >
                <p className="w-full text-center text-xs text-muted-foreground">
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

          <ScrollReveal
            as="section"
            className="experience-section space-y-8"
            aria-labelledby="experience-heading"
          >
            <div className="relative z-[1]">
              <SectionHeading id="experience-heading">Experience</SectionHeading>
            </div>
            <div className="relative z-[1] grid grid-cols-1 gap-5 md:grid-cols-3">
              <Link
                href={mlDetailPath("data-5")}
                className="experience-glass-card experience-glass-card--filled px-6 py-6"
                aria-label="AtoZDeals — View Dashboard"
              >
                <div className="relative z-[1] flex h-full flex-col gap-3 text-left">
                  <div className="space-y-1">
                    <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                      AtoZDeals
                    </h3>
                    <p className="text-xs font-medium text-primary sm:text-[0.8125rem]">
                      Freelance Data Analyst · July–August 2026
                    </p>
                  </div>
                  <p className="flex-1 text-[0.8125rem] leading-relaxed text-muted-foreground sm:text-[0.875rem]">
                    Built an interactive Power BI dashboard analyzing AtoZDeals&apos;
                    sales performance, surfacing trends in revenue and product categories to
                    identify top-performing categories. Data anonymized and used with permission.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    View Dashboard
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </Link>

              {[0, 1].map((slot) => (
                <article
                  key={slot}
                  className="experience-glass-card px-6 py-8"
                  aria-label={`Experience slot ${slot + 2}`}
                />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal as="div" className="flex justify-center">
            <AnimatedButton variant="primary">
              <Link href={PROJECTS_LIST_PATH}>
                <Button size="lg" variant="cta" className="h-12 min-w-[11rem] px-8 text-sm font-semibold">
                  View Projects
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedButton>
          </ScrollReveal>

      </PageWrapper>
    </Layout>
  );
}
