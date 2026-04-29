import { type ReactNode } from "react";
import { FONT_MONO, FONT_SANS } from "@/content/portfolio/reportPrimitives";

type PanelBorderRadius = "var(--radius-md)" | "var(--radius-lg)" | "var(--radius-xl)";

const DEFAULT_RADIUS: PanelBorderRadius = "var(--radius-lg)";

export function KPI({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  color?: string;
}): React.JSX.Element {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: DEFAULT_RADIUS,
        padding: "20px 24px",
        borderTop: `3px solid ${color || "var(--primary)"}`,
      }}
    >
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 36, color: color || "var(--primary)", fontWeight: 900, lineHeight: 1 }}>{value}</div>
      {sub ? <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{sub}</div> : null}
    </div>
  );
}

export function Mono({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <code
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11.5,
        background: "var(--muted)",
        color: "var(--chart-2)",
        padding: "2px 7px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </code>
  );
}

export function Callout({
  color = "var(--primary)",
  icon,
  children,
}: {
  color?: string;
  icon?: ReactNode;
  children: ReactNode;
}): React.JSX.Element {
  return (
    <div
      style={{
        background: `${color}12`,
        border: `1px solid ${color}40`,
        borderRadius: "var(--radius-lg)",
        padding: "14px 18px",
        marginTop: 16,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      {icon ? <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span> : null}
      <div style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export function AnalysisBlock({ heading, children }: { heading?: string; children: ReactNode }): React.JSX.Element {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--primary)",
        borderRadius: "0 var(--radius-lg) var(--radius-lg) 0",
        padding: "16px 20px",
        marginTop: 16,
      }}
    >
      {heading ? <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--primary)", marginBottom: 8 }}>{heading}</div> : null}
      <div style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

export function ChartCard({
  label,
  note,
  title,
  subtitle,
  children,
}: {
  label?: string;
  note?: ReactNode;
  title?: string;
  subtitle?: ReactNode;
  children: ReactNode;
}): React.JSX.Element {
  const resolvedLabel = label ?? title;
  const resolvedNote = note ?? subtitle;

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: DEFAULT_RADIUS,
        padding: "28px 28px 20px",
      }}
    >
      {resolvedLabel ? <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>{resolvedLabel}</div> : null}
      {resolvedNote ? <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{resolvedNote}</p> : null}
      {children}
    </div>
  );
}
