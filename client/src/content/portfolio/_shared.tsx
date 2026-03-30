import * as React from "react";
import { cn } from "@/lib/utils";

/** Section label with number badge — establishes clear reading order */
export function WorkSectionLabel({
  number,
  title,
  className,
  id,
}: {
  number: number;
  title: string;
  className?: string;
  id?: string;
}) {
  const n = String(number).padStart(2, "0");
  return (
    <div id={id} className={cn("mb-8 scroll-mt-28 flex items-center gap-4", className)}>
      <span
        className="rounded-lg border border-primary/35 bg-primary/[0.08] px-2.5 py-1 font-mono text-xs font-bold text-primary"
        aria-hidden
      >
        {n}
      </span>
      <h2 className="font-heading m-0 text-xl font-bold tracking-tight text-foreground md:text-2xl">
        {title}
      </h2>
      <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-r from-border to-transparent" aria-hidden />
    </div>
  );
}

/** Metric stat card — strong number emphasis, clear label hierarchy */
export function WorkStatCard({
  label,
  value,
  sub,
  className,
  accentClassName,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  className?: string;
  /** Top accent border, e.g. border-t-rose-500 */
  accentClassName?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-[10rem] flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm border-t-[3px]",
        accentClassName ?? "border-t-primary",
        className,
      )}
    >
      <div className="text-report-label mb-2.5">{label}</div>
      <div className="text-report-metric">{value}</div>
      {sub ? (
        <p className="mt-2.5 text-left text-sm leading-[1.7] text-muted-foreground">{sub}</p>
      ) : null}
    </div>
  );
}

/** Insight pill — subtle, readable, good proximity grouping */
export function WorkInsightPill({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div className="mb-3 flex gap-3 rounded-xl border border-border bg-muted/25 p-4 last:mb-0">
      {icon != null ? (
        <span className="shrink-0 text-base leading-none">{icon}</span>
      ) : null}
      <p className="m-0 text-left text-[0.9375rem] leading-[1.7] text-muted-foreground">{text}</p>
    </div>
  );
}

/** Inline code chip */
export function WorkCodeChip({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-lg border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-primary">
      {children}
    </code>
  );
}

/** Chart card — consistent container for all charts */
export function WorkChartCard({
  title,
  takeaway,
  children,
  className,
}: {
  title?: string;
  takeaway?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 rounded-2xl border border-border bg-card p-6 pb-5 shadow-sm", className)}>
      {title ? (
        <div className="text-report-label mb-2">{title}</div>
      ) : null}
      {takeaway ? (
        <p className="mb-5 text-left text-[0.9375rem] leading-[1.7] text-muted-foreground">{takeaway}</p>
      ) : null}
      {children}
    </div>
  );
}

/** Recharts tooltip — theme-aligned */
export function WorkChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: unknown; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg">
      {label != null ? (
        <div className="mb-1.5 font-heading font-semibold text-primary">{label}</div>
      ) : null}
      {payload.map((p, i) => (
        <div key={i} className="text-muted-foreground">
          {p.name}:{" "}
          <span className="font-semibold tabular-nums text-foreground">{String(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/** Executive summary — prominent, highlighted section */
export function WorkExecutiveSummary({
  id,
  title = "Summary",
  paragraphs,
  bullets,
}: {
  id?: string;
  title?: string;
  paragraphs: string[];
  bullets?: string[];
}) {
  return (
    <section
      id={id ?? "summary"}
      className="work-report-summary scroll-mt-28 space-y-4 rounded-2xl border border-primary/25 bg-primary/[0.06] p-7 text-left md:p-9"
    >
      <h3 className="font-heading text-left text-lg font-bold text-foreground">{title}</h3>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-report-body">
          {p}
        </p>
      ))}
      {bullets && bullets.length > 0 ? (
        <ul className="text-report-body list-disc space-y-2 pl-5">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/** Framing question — blockquote-style emphasis */
export function WorkFramingQuestion({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-report-body border-l-[3px] border-primary/50 pl-5 not-italic">{children}</p>
  );
}

/** Portfolio reflection: strengths vs planned next steps */
export function WorkProsCons({
  pros,
  cons,
  doneWellTitle = "Done well",
  futureTitle = "Future improvements",
}: {
  pros: string[];
  cons: string[];
  doneWellTitle?: string;
  futureTitle?: string;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="text-report-label mb-4 text-primary">{doneWellTitle}</div>
        <ul className="m-0 list-none space-y-2.5 p-0 text-left text-[0.9375rem] leading-[1.7] text-muted-foreground">
          {pros.map((t, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="shrink-0 font-bold text-primary" aria-hidden>·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="text-report-label mb-4 text-muted-foreground">{futureTitle}</div>
        <ul className="m-0 list-none space-y-2.5 p-0 text-left text-[0.9375rem] leading-[1.7] text-muted-foreground">
          {cons.map((t, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="shrink-0 font-medium text-muted-foreground" aria-hidden>·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Figure with caption */
export function WorkFigure({
  src,
  alt,
  caption,
  placeholder,
}: {
  src: string;
  alt: string;
  caption?: string;
  placeholder?: boolean;
}) {
  const [broken, setBroken] = React.useState(false);
  const showPh = placeholder || broken;
  return (
    <figure className="my-9 space-y-3">
      <div
        className={cn(
          "aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-muted/25",
        )}
      >
        {showPh ? (
          <div className="flex h-full min-h-[200px] flex-col items-start justify-center gap-2 px-7 text-left">
            <span className="font-mono text-xs font-medium text-muted-foreground">
              Figure placeholder
            </span>
            <p className="max-w-sm text-[0.9375rem] leading-[1.7] text-muted-foreground">
              Add the image to{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">
                client/public{src}
              </code>{" "}
              and set placeholder to false.
            </p>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-contain"
            loading="lazy"
            onError={() => setBroken(true)}
          />
        )}
      </div>
      {caption ? (
        <figcaption className="max-w-3xl text-left text-sm font-medium leading-[1.7] text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Footer links */
export function WorkFooterLinks({
  github,
  notebook,
  githubLabel = "Repository",
  notebookLabel = "Notebook",
}: {
  github?: string;
  notebook?: string;
  githubLabel?: string;
  notebookLabel?: string;
}) {
  if (!github && !notebook) return null;
  return (
    <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 font-mono text-xs text-muted-foreground">
      <div className="flex flex-wrap gap-5">
        {github ? (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary transition-colors hover:underline"
          >
            {githubLabel} ↗
          </a>
        ) : null}
        {notebook ? (
          <a
            href={notebook}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary transition-colors hover:underline"
          >
            {notebookLabel} ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}

/** Callout / notice block */
export function WorkCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] px-5 py-4 text-left text-[0.9375rem] leading-[1.7] text-muted-foreground">
      {children}
    </div>
  );
}

/** Data table */
export function WorkDataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/35">
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left font-heading text-xs font-bold uppercase tracking-wider text-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border last:border-0 hover:bg-muted/20">
              {row.map((cell, ci) => (
                <td key={ci} className="px-5 py-3 text-[0.9375rem] text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Chart color constants — updated to match indigo-violet system */
export const chartMuted = "#6b7299";
export const chartPrimary = "#818cf8";
export const chartRose = "hsl(350 80% 58%)";
export const chartTeal = "hsl(258 70% 65%)";
export const chartViolet = "hsl(270 65% 60%)";
export const chartOrange = "hsl(25 90% 55%)";
