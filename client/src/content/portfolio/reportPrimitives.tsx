import { type CSSProperties, type ReactNode } from "react";
import { C, FONT_MONO, FONT_SANS } from "@/lib/theme";

export { C, FONT_MONO, FONT_SANS };

export function Tag({ children, color = C.teal }: { children: ReactNode; color?: string }): React.JSX.Element {
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11,
        color,
        background: `${color}14`,
        border: `1px solid ${color}30`,
        padding: "3px 10px",
        borderRadius: 20,
      }}
    >
      {children}
    </span>
  );
}

export function Code({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <code
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11.5,
        background: C.codeBg,
        color: C.teal,
        padding: "2px 7px",
        borderRadius: 4,
        border: `1px solid ${C.border}`,
      }}
    >
      {children}
    </code>
  );
}

export function SectionLabel({ n, title }: { n: number; title: string }): React.JSX.Element {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.tealDim, letterSpacing: "0.05em" }}>
          {String(n).padStart(2, "0")}
        </span>
        <h2
          style={{
            fontFamily: FONT_SANS,
            fontSize: 26,
            fontWeight: 700,
            color: C.text,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ height: 1, background: C.border, marginTop: 14 }} />
    </div>
  );
}

export function Body({ children, style }: { children: ReactNode; style?: CSSProperties }): React.JSX.Element {
  return (
    <p
      style={{
        fontFamily: FONT_SANS,
        fontSize: 15,
        color: C.textSub,
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
  color = C.teal,
  icon,
}: {
  children: ReactNode;
  color?: string;
  icon?: string;
}): React.JSX.Element {
  return (
    <div style={{ borderLeft: `2px solid ${color}`, paddingLeft: 16, paddingTop: 2, marginTop: 20 }}>
      <div style={{ fontSize: 13.5, color: C.textSub, lineHeight: 1.75 }}>
        {icon != null && <span style={{ marginRight: 8 }}>{icon}</span>}
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
        background: C.surface,
        border: `1px solid ${C.border}`,
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 12,
        color: C.text,
        fontFamily: FONT_MONO,
      }}
    >
      <div style={{ color: C.teal, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color ?? C.text }}>
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
        background: C.card,
        border: `1px solid ${C.border}`,
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
            color: C.textDim,
            border: `1px solid ${C.border}`,
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
            color: C.textDim,
            marginBottom: 10,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
      )}
      {note != null && (
        <p style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.65, margin: "0 0 18px" }}>{note}</p>
      )}
      {children}
    </div>
  );
}

export function TwoCol({ children, gap = 24 }: { children: ReactNode; gap?: number }): React.JSX.Element {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>{children}</div>;
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
        background: C.card,
        border: `1px solid ${C.border}`,
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

export function PanelLabel({ children, color = C.teal }: { children: ReactNode; color?: string }): React.JSX.Element {
  return (
    <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color, letterSpacing: "0.04em", marginBottom: 12 }}>
      {children}
    </div>
  );
}
