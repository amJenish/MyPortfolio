import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { BackToList } from "@/components/work/BackToList";
import type { WorkPageProps } from "@/content/portfolio/workPageTypes";
import { FONT_MONO, FONT_SANS } from "@/lib/theme";
import type { ReactNode } from "react";

function ReportCatalogHero({
  categoryLabel,
  entry,
}: {
  categoryLabel: string;
  entry: WorkPageProps["entry"];
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "56px 0 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle dot-grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.35,
        }}
      />
      {/* Radial glow — emphasis on top-right */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "5%",
          width: 520,
          height: 520,
          background: "radial-gradient(ellipse, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 62%)",
          pointerEvents: "none",
        }}
      />
      {/* Bottom-left secondary glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "10%",
          width: 320,
          height: 320,
          background: "radial-gradient(ellipse, color-mix(in srgb, var(--primary) 5%, transparent) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px", position: "relative" }}>
        {/* Category + date — small, monospace, tertiary hierarchy */}
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--primary)",
            marginBottom: 20,
          }}
        >
          {categoryLabel}
          {entry.date ? ` · ${entry.date}` : ""}
        </p>

        {/* Title — maximum hierarchy, largest element */}
        <h1
          style={{
            fontFamily: FONT_SANS,
            fontSize: "clamp(28px, 4.5vw, 48px)",
            fontWeight: 800,
            margin: "0 0 18px",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "var(--foreground)",
          }}
        >
          {entry.title}
        </h1>

        {/* Summary — secondary hierarchy, comfortable reading size */}
        {entry.summary ? (
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: 16,
              color: "var(--muted-foreground)",
              lineHeight: 1.8,
              margin: "0 0 28px",
              maxWidth: 680,
            }}
          >
            {entry.summary}
          </p>
        ) : null}

        {/* Tags — tertiary, small pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {entry.tags?.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 500,
                color: "var(--primary)",
                background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
                padding: "4px 12px",
                borderRadius: 24,
                letterSpacing: "0.04em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export type WorkReportShellProps = WorkPageProps & { children: ReactNode };

export function WorkReportShell({
  entry,
  backHref,
  backLabel,
  categoryLabel,
  sections,
  ownsHero,
  children,
}: WorkReportShellProps) {
  return (
    <div
      className="text-left bg-background text-foreground"
      style={{
        minHeight: "100vh",
        fontFamily: FONT_SANS,
      }}
    >
      <ScrollProgress />

      {/* Back link — small, unobtrusive, proper spacing */}
      <div style={{ padding: "24px clamp(1rem, 4vw, 3rem) 0" }}>
        <BackToList href={backHref} label={backLabel} />
      </div>

      {/* Hero — only rendered when page doesn't own it */}
      {!ownsHero ? <ReportCatalogHero categoryLabel={categoryLabel} entry={entry} /> : null}

      {/* Content */}
      {children}
    </div>
  );
}
