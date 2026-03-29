import Layout from "@/components/layout";
import { getWorkPage } from "@/content/portfolio/registry";
import type { WorkEntry } from "@/lib/interfaces";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

type WorkDetailLayoutProps = {
  entry: WorkEntry;
  backHref: string;
  backLabel: string;
  categoryLabel: string;
};

export function WorkDetailLayout({
  entry,
  backHref,
  backLabel,
  categoryLabel,
}: WorkDetailLayoutProps) {
  const work = entry.reportSlug != null ? getWorkPage(entry.reportSlug) : undefined;
  const hasWorkPage = work != null;
  const WorkPageComponent = work?.Page;
  const ownsHero = work?.ownsHero === true;
  const sections = work?.sections ?? [];

  return (
    <Layout>
      <div className="pb-16 text-left">
        {hasWorkPage && WorkPageComponent ? (
          <WorkPageComponent
            entry={entry}
            backHref={backHref}
            backLabel={backLabel}
            categoryLabel={categoryLabel}
            sections={sections}
            ownsHero={ownsHero}
          />
        ) : (
          <ScrollReveal
            as="aside"
            className="mx-auto max-w-[min(100%,60rem)] rounded-[10px] border border-dashed border-border bg-card/50 p-8 text-left text-sm leading-[1.6] text-muted-foreground"
            delay={0.1}
          >
            No work page for this <code className="theme-code text-xs">reportSlug</code>. Add{" "}
            <code className="theme-code text-xs">client/src/content/portfolio/notebooks/&lt;slug&gt;.page.tsx</code> or{" "}
            <code className="theme-code text-xs">.../portfolio/projects/&lt;slug&gt;.page.tsx</code>, then register in{" "}
            <code className="theme-code text-xs">portfolio/registry.ts</code>.
          </ScrollReveal>
        )}
      </div>
    </Layout>
  );
}
