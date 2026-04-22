import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CardMetric } from "@/lib/interfaces";

export type WorkListCardVariant = "software" | "ml";

type WorkListCardProps = {
  href: string;
  title: string;
  summary: string;
  tags?: string[];
  date?: string;
  meta?: string;
  metrics?: CardMetric[];
  ctaLabel?: string;
  /** Visual accent: software = neutral, ml = left accent bar */
  variant?: WorkListCardVariant;
  /** Merged onto the card `<article>` */
  articleClassName?: string;
};

export function WorkListCard({
  href,
  title,
  summary,
  tags,
  date,
  meta,
  metrics,
  ctaLabel,
  variant = "software",
  articleClassName,
}: WorkListCardProps) {
  return (
    <Link href={href} className="block h-full min-h-0 focus-visible:outline-none">
      <article
        className={cn(
          "group relative flex h-full min-h-[11rem] flex-col rounded-2xl border border-border bg-card p-6 sm:p-7",
          "transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/[0.08]",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          variant === "ml" && "border-l-[3px] border-l-primary/70 pl-[calc(1.5rem-3px)] sm:pl-[calc(1.75rem-3px)]",
          articleClassName,
        )}
      >
        <div className="flex flex-1 flex-col gap-4">
          {/* Header row: meta + arrow */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2.5">
              {(date || meta) && (
                <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {[date, meta].filter(Boolean).join(" · ")}
                </p>
              )}
              {/* Title — strong hierarchy, largest text on card */}
              <h2 className="font-heading text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-[1.25rem]">
                {title}
              </h2>
              {summary.trim() ? (
                <p className="text-sm leading-[1.7] text-muted-foreground line-clamp-3">
                  {summary}
                </p>
              ) : null}
            </div>
            <ArrowRight
              className="mt-1 h-5 w-5 shrink-0 text-muted-foreground/60 transition-all group-hover:translate-x-1 group-hover:text-primary"
              aria-hidden
            />
          </div>

          {/* Metrics row */}
          {metrics && metrics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metrics.map((m) => (
                <span
                  key={`${m.label}-${m.value}`}
                  className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium tabular-nums text-foreground"
                >
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="mx-1.5 text-border">·</span>
                  <span className="font-semibold">{m.value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {tags?.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {tags && tags.length > 6 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{tags.length - 6}
              </Badge>
            )}
          </div>

          {/* CTA label */}
          {ctaLabel && (
            <p className="pt-0.5 text-left text-xs font-semibold text-primary">
              {ctaLabel} →
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
