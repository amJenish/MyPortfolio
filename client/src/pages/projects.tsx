import Layout from "@/components/layout";
import { WorkListCard } from "@/components/work/WorkListCard";
import { projects } from "@/lib/content/registry";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ScrollRevealStagger } from "@/components/motion/ScrollRevealStagger";

export default function Projects() {
  return (
    <Layout>
      <div className="space-y-10">
        <ScrollReveal as="section" className="max-w-2xl space-y-3 text-left">
          <p className="text-xs font-medium text-muted-foreground">Software engineering</p>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Projects</h1>
          <p className="leading-[1.6] text-muted-foreground">
            Backend-heavy work, desktop tools, and one full-stack ML app. Each card links to a full write-up.
          </p>
        </ScrollReveal>

        <ScrollRevealStagger className="grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.07} delayChildren={0.08}>
          {projects.map((project) => (
            <WorkListCard
              key={project.id}
              href={`/project/${project.id}`}
              title={project.title}
              summary={project.summary}
              tags={project.tags}
              meta="Application / product"
              variant="software"
              ctaLabel="View project"
            />
          ))}
        </ScrollRevealStagger>
      </div>
    </Layout>
  );
}
