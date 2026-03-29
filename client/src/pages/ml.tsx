import Layout from "@/components/layout";
import { WorkListCard } from "@/components/work/WorkListCard";
import { kaggleProjects } from "@/lib/content/registry";
import { mlDetailPath } from "@/lib/routes";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ScrollRevealStagger } from "@/components/motion/ScrollRevealStagger";

export default function Ml() {
  return (
    <Layout>
      <div className="space-y-10">
        <ScrollReveal as="section" className="max-w-2xl space-y-3 text-left">
          <p className="text-xs font-medium text-muted-foreground">Experiments and write-ups</p>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Data science, ML, and notebooks</h1>
          <p className="leading-[1.6] text-muted-foreground">
            Structured reports with metrics, tables, and Recharts—drop exported figures under{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">public/portfolio/notebooks/&lt;slug&gt;/</code> when ready.
          </p>
        </ScrollReveal>

        <ScrollRevealStagger className="grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.07} delayChildren={0.08}>
          {kaggleProjects.map((p) => (
            <WorkListCard
              key={p.id}
              href={mlDetailPath(p.id)}
              title={p.title}
              summary={p.summary}
              tags={p.tags}
              date={p.date}
              meta="Data-Science, ML"
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
