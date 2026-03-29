import Layout from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkEntry } from "@/lib/interfaces";
import { getWorkPage } from "@/content/portfolio/registry";
import { ArrowLeft, BookOpen, Github, Play } from "lucide-react";
import { Link } from "wouter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

type WorkDetailLayoutProps = {
  entry: WorkEntry;
  backHref: string;
  backLabel: string;
  categoryLabel: string;
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function WorkDetailLayout({
  entry,
  backHref,
  backLabel,
  categoryLabel,
}: WorkDetailLayoutProps) {
  const work = entry.reportSlug != null ? getWorkPage(entry.reportSlug) : undefined;
  const hasWorkPage = work != null;
  const sections = work?.sections ?? [];
  const WorkPageComponent = work?.Page;

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[min(100%,72rem)] space-y-10 pb-16 text-left">
        <ScrollReveal>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </ScrollReveal>

        <ScrollReveal as="header" className="work-detail-hero space-y-5 rounded-2xl border border-border/80 bg-gradient-to-br from-card via-background to-primary/[0.03] p-6 shadow-sm md:p-8" delay={0.04}>
          <p className="text-xs font-medium text-primary/90">
            {categoryLabel}
            {entry.date ? ` · ${entry.date}` : ""}
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl text-left">
            {entry.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="border border-primary/15 bg-background/80 text-xs font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" delay={0.08}>
          <Button asChild size="lg" className="gap-2 shadow-md">
            <a href={entry.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          {entry.notebookUrl && (
            <Button variant="outline" size="lg" asChild className="gap-2 border-2">
              <a href={entry.notebookUrl} target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-4 w-4" />
                Notebook
              </a>
            </Button>
          )}
          {entry.videoUrl && (
            <Button variant="outline" size="lg" asChild className="gap-2 border-2">
              <a href={entry.videoUrl} target="_blank" rel="noopener noreferrer">
                <Play className="h-4 w-4" />
                Demo video
              </a>
            </Button>
          )}
        </ScrollReveal>

        {hasWorkPage && work ? (
          <>
            {sections.length > 0 && (
              <ScrollReveal delay={0.1}>
                <nav
                  className="sticky top-[3.25rem] z-20 flex gap-2 overflow-x-auto rounded-xl border border-border/80 bg-background/95 py-3 pl-1 pr-2 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:gap-3"
                  aria-label="Report sections"
                >
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => scrollToSection(s.id)}
                      className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {s.label}
                    </button>
                  ))}
                </nav>
              </ScrollReveal>
            )}
            <ScrollReveal className="work-detail-report space-y-8 rounded-2xl border border-border/70 bg-card/40 p-6 shadow-inner md:p-10" delay={0.12}>
              {WorkPageComponent ? <WorkPageComponent /> : null}
            </ScrollReveal>
          </>
        ) : (
          <ScrollReveal as="aside" className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-left text-sm leading-[1.6] text-muted-foreground" delay={0.1}>
            No work page for this <code className="text-xs">reportSlug</code>. Add{" "}
            <code className="text-xs">client/src/content/portfolio/notebooks/&lt;slug&gt;.page.tsx</code> or{" "}
            <code className="text-xs">.../portfolio/projects/&lt;slug&gt;.page.tsx</code>, then register in{" "}
            <code className="text-xs">portfolio/registry.ts</code>.
          </ScrollReveal>
        )}
      </div>
    </Layout>
  );
}
