import { type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Link2 } from "lucide-react";
import { C, FONT_MONO, FONT_SANS } from "@/lib/theme";

export { C, FONT_MONO, FONT_SANS };

/** Primary accent color — uses the CSS variable so it adapts to light/dark mode */
const PRIMARY = "var(--primary)";
const PRIMARY_DIM = "var(--primary)";
const ACCENT = "var(--accent-highlight)";

export function Tag({ children, color = ACCENT }: { children: ReactNode; color?: string }): React.JSX.Element {
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11,
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        padding: "3px 10px",
        borderRadius: 20,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Catalog-style keyword pills (matches `ReportCatalogHero` / `entry.tags` styling).
 * Used by individual project pages so the "keywords" area stays consistent.
 */
export function CatalogTagPills({ tags }: { tags?: readonly string[] }): React.JSX.Element | null {
  if (!tags?.length) return null;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tags.map((tag, index) => (
        <span
          key={tag}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 500,
            color: index === 0 ? ACCENT : PRIMARY,
            background:
              index === 0
                ? "color-mix(in srgb, var(--accent-highlight) 12%, transparent)"
                : "color-mix(in srgb, var(--primary) 10%, transparent)",
            border:
              index === 0
                ? "1px solid color-mix(in srgb, var(--accent-highlight) 28%, transparent)"
                : "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
            padding: "4px 12px",
            borderRadius: 24,
            letterSpacing: "0.04em",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function Code({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <code
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11.5,
        background: "var(--muted)",
        color: PRIMARY,
        padding: "2px 7px",
        borderRadius: 4,
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </code>
  );
}

export function ReportSectionLabel({ n, title, id }: { n: number; title: string; id?: string }): React.JSX.Element {
  const copyAnchor = async (event: MouseEvent<HTMLButtonElement>) => {
    const closestId = event.currentTarget.closest("[id]")?.id;
    const targetId = id ?? closestId;
    if (!targetId) return;

    const base = `${window.location.origin}${window.location.pathname}`;
    const fullAnchor = `${base}#${targetId}`;
    try {
      await navigator.clipboard.writeText(fullAnchor);
    } catch {
      // ignore clipboard failures silently
    }
  };

  return (
    <div className="group" style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: ACCENT,
            letterSpacing: "0.08em",
            opacity: 0.82,
          }}
        >
          {String(n).padStart(2, "0")}
        </span>
        <h2
          style={{
            fontFamily: FONT_SANS,
            fontSize: 25,
            fontWeight: 700,
            color: "var(--foreground)",
            margin: 0,
            letterSpacing: -0.35,
          }}
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={copyAnchor}
          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Copy link to ${title}`}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            background: "var(--card)",
            color: "var(--muted-foreground)",
            padding: "2px 6px",
            lineHeight: 0,
            cursor: "pointer",
          }}
        >
          <Link2 size={13} />
        </button>
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg, var(--accent-highlight), transparent)", marginTop: 12 }} />
    </div>
  );
}

export const SectionLabel = ReportSectionLabel;

export function Body({ children, style }: { children: ReactNode; style?: CSSProperties }): React.JSX.Element {
  return (
    <p
      style={{
        fontFamily: FONT_SANS,
        fontSize: 15,
        color: "var(--muted-foreground)",
        lineHeight: 1.85,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function Notice({
  children,
  variant = "insight",
  color = PRIMARY,
  icon,
}: {
  children: ReactNode;
  variant?: "insight" | "warning" | "critique" | "result";
  color?: string;
  icon?: string;
}): React.JSX.Element {
  const toneByVariant = {
    insight: { color: PRIMARY, icon: "★" },
    warning: { color: "var(--accent-highlight)", icon: "▲" },
    critique: { color: "var(--chart-danger, #dc2626)", icon: "◈" },
    result: { color: "var(--chart-success, #16a34a)", icon: "✓" },
  } as const;

  const resolvedColor = color === PRIMARY ? toneByVariant[variant].color : color;
  const resolvedIcon = icon ?? toneByVariant[variant].icon;

  return (
    <div style={{ borderLeft: `2px solid ${resolvedColor}`, paddingLeft: 16, paddingTop: 2, marginTop: 20 }}>
      <div style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.75 }}>
        {resolvedIcon != null && <span style={{ marginRight: 8 }}>{resolvedIcon}</span>}
        {children}
      </div>
    </div>
  );
}

export type TooltipPayloadItem = { name?: string; value?: string | number; color?: string };

export function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}): React.JSX.Element | null {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        padding: "10px 14px",
        borderRadius: "var(--radius-md)",
        fontSize: 12,
        color: "var(--foreground)",
        fontFamily: FONT_MONO,
      }}
    >
      <div style={{ color: PRIMARY, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color ?? "var(--foreground)" }}>
          {p.name}: <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartWrap({
  children,
  label,
  note,
  illustrative,
}: {
  children: ReactNode;
  label?: string;
  note?: string;
  illustrative?: boolean;
}): React.JSX.Element {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "24px 24px 16px",
        position: "relative",
      }}
    >
      {illustrative === true && (
        <span
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: "var(--muted-foreground)",
            border: "1px solid var(--border)",
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          Illustrative
        </span>
      )}
      {label != null && (
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10.5,
            color: "var(--muted-foreground)",
            marginBottom: 10,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
      )}
      {note != null && (
        <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", lineHeight: 1.65, margin: "0 0 18px" }}>{note}</p>
      )}
      {children}
    </div>
  );
}

export function TwoCol({ children, gap = 24 }: { children: ReactNode; gap?: number }): React.JSX.Element {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap }}>{children}</div>;
}

export function Panel({
  children,
  accentColor,
  style,
}: {
  children: ReactNode;
  accentColor?: string;
  style?: CSSProperties;
}): React.JSX.Element {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "22px 24px",
        borderTop: accentColor != null ? `2px solid ${accentColor}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PanelLabel({ children, color = PRIMARY }: { children: ReactNode; color?: string }): React.JSX.Element {
  return (
    <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color, letterSpacing: "0.04em", marginBottom: 12 }}>
      {children}
    </div>
  );
}


