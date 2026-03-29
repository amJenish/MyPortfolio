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
  tags: string[];
  date?: string;
  meta?: string;
  metrics?: CardMetric[];
  ctaLabel?: string;
  /** Visual accent: software = neutral, ml = left accent bar */
  variant?: WorkListCardVariant;
  /** Merged onto the card `<article>` (e.g. snap, min-width for horizontal rows) */
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
          "group relative flex h-full min-h-[10rem] flex-col rounded-[10px] border border-border bg-card p-5 sm:p-6",
          "transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card-hover",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          variant === "ml" && "border-l-[3px] border-l-primary/70 pl-[calc(1.25rem-3px)] sm:pl-[calc(1.5rem-3px)]",
          articleClassName,
        )}
      >
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              {(date || meta) && (
                <p className="text-xs font-medium text-muted-foreground">
                  {[date, meta].filter(Boolean).join(" · ")}
                </p>
              )}
              <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                {title}
              </h2>
              {summary.trim() ? (
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {summary}
                </p>
              ) : null}
            </div>
            <ArrowRight
              className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden
            />
          </div>

          {metrics && metrics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metrics.map((m) => (
                <span
                  key={`${m.label}-${m.value}`}
                  className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium tabular-nums text-foreground"
                >
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="mx-1 text-border">·</span>
                  {m.value}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {tags.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {tags.length > 6 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{tags.length - 6}
              </Badge>
            )}
          </div>

          {ctaLabel && (
            <p className="pt-1 text-left text-xs font-medium text-primary">
              {ctaLabel}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
