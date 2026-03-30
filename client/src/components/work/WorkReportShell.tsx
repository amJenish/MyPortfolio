import { Button } from "@/components/ui/button";
import type { WorkPageProps } from "@/content/portfolio/workPageTypes";
import { C, FONT_MONO, FONT_SANS } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { ArrowLeft, BookOpen, Github, Play } from "lucide-react";
import { Link } from "wouter";
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
        borderBottom: `1px solid ${C.border}`,
        padding: "48px 0 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.28,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-25%",
          right: "8%",
          width: 480,
          height: 480,
          background: `radial-gradient(ellipse, ${C.teal}08 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px", position: "relative" }}>
        <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textDim, marginBottom: 16 }}>
          {categoryLabel}
          {entry.date ? ` · ${entry.date}` : ""}
        </p>
        <h1
          style={{
            fontFamily: FONT_SANS,
            fontSize: "clamp(26px, 4vw, 44px)",
            fontWeight: 800,
            margin: "0 0 16px",
            lineHeight: 1.12,
            letterSpacing: -0.5,
            color: C.text,
          }}
        >
          {entry.title}
        </h1>
        {entry.summary ? (
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: 15,
              color: C.textSub,
              lineHeight: 1.85,
              margin: "0 0 24px",
              maxWidth: 720,
            }}
          >
            {entry.summary}
          </p>
        ) : null}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {entry.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: C.teal,
                background: `${C.teal}14`,
                border: `1px solid ${C.teal}30`,
                padding: "3px 10px",
                borderRadius: 20,
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
      {/* Back button */}
      <div style={{ padding: "20px 40px 0" }}>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-sm font-mono text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {backLabel}
        </Link>
      </div>

      {/* Hero section - only if page doesn't own it */}
      {!ownsHero ? <ReportCatalogHero categoryLabel={categoryLabel} entry={entry} /> : null}

      {/* Content - full width, no wrapper */}
      {children}

      {/* Action buttons - aligned horizontally */}
      <div
        style={{
          padding: "40px",
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Button asChild size="lg" variant="default" className="gap-2 font-mono text-xs font-semibold">
          <a href={entry.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </Button>
        {entry.notebookUrl ? (
          <Button variant="outline" size="lg" asChild className="gap-2 font-mono text-xs">
            <a href={entry.notebookUrl} target="_blank" rel="noopener noreferrer">
              <BookOpen className="h-4 w-4" />
              Notebook
            </a>
          </Button>
        ) : null}
        {entry.videoUrl ? (
          <Button variant="outline" size="lg" asChild className="gap-2 font-mono text-xs">
            <a href={entry.videoUrl} target="_blank" rel="noopener noreferrer">
              <Play className="h-4 w-4" />
              Demo video
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
