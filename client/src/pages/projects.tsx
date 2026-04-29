import Layout from "@/components/layout";
import { WorkListCard } from "@/components/work/WorkListCard";
import { projects } from "@/lib/content/registry";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ScrollRevealStagger } from "@/components/motion/ScrollRevealStagger";
import { SectionDivider } from "@/components/home/SectionDivider";
import {
  scrollRevealRouteDelayChildren,
  scrollRevealRouteDuration,
  scrollRevealRouteStagger,
} from "@/components/motion/scrollMotion";

export default function Projects() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* ── Page header ── */}
        <ScrollReveal as="header" className="max-w-2xl space-y-4 text-left" duration={scrollRevealRouteDuration}>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            Projects
          </h1>
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            Backend-heavy work and full-stack applications built following SWE Principles alongside ML Implementations. Each card links to a full write-up.
          </p>
          {/* Visual divider with gradient — reinforces section hierarchy */}
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/20" aria-hidden />
        </ScrollReveal>

        <SectionDivider />

        {/* ── Project grid ── */}
        <ScrollRevealStagger
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          stagger={scrollRevealRouteStagger}
          delayChildren={scrollRevealRouteDelayChildren}
          duration={scrollRevealRouteDuration}
        >
          {projects.map((project) => (
            <WorkListCard
              key={project.id}
              href={`/project/${project.id}`}
              title={project.title}
              summary={project.summary}
              tags={project.tags}
              meta={
                project.reportSlug === "ai-1"
                  ? "AI AUTOMATION"
                  : project.reportSlug === "ml-exp-1"
                    ? "Experiment / RL"
                    : "Application / product"
              }
              variant="software"
              ctaLabel="View project"
            />
          ))}
        </ScrollRevealStagger>
      </div>
    </Layout>
  );
}
