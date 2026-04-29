import Layout from "@/components/layout";
import { WorkListCard } from "@/components/work/WorkListCard";
import { kaggleProjects } from "@/lib/content/registry";
import { mlDetailPath } from "@/lib/routes";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ScrollRevealStagger } from "@/components/motion/ScrollRevealStagger";
import { SectionDivider } from "@/components/home/SectionDivider";
import {
  scrollRevealRouteDelayChildren,
  scrollRevealRouteDuration,
  scrollRevealRouteStagger,
} from "@/components/motion/scrollMotion";

export default function Ml() {
  return (
    <Layout>
      <div className="space-y-12">
        {/* ── Page header ── */}
        <ScrollReveal as="header" className="max-w-2xl space-y-4 text-left">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            Data science, ML &amp; notebooks
          </h1>
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
             Reports with metrics, tables, and Recharts 
          </p>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/20" aria-hidden />
        </ScrollReveal>

        <SectionDivider />

        {/* ── Notebooks grid ── */}
        <ScrollRevealStagger
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          stagger={scrollRevealRouteStagger}
          delayChildren={scrollRevealRouteDelayChildren}
          duration={scrollRevealRouteDuration}
        >
          {kaggleProjects.map((p) => (
            <WorkListCard
              key={p.id}
              href={mlDetailPath(p.id)}
              title={p.title}
              summary={p.summary}
              tags={p.tags}
              date={p.date}
              metrics={p.cardMetrics}
              variant="ml"
              ctaLabel="View report"
            />
          ))}
        </ScrollRevealStagger>
      </div>
    </Layout>
  );
}
