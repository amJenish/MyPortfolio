/**
 * Design tokens - mirrors CSS variables in index.css for inline styles and Recharts.
 * Updated to match the indigo-violet design system.
 */
export const C = {
  /* Backgrounds */
  bg: "#0d0f1a",
  surface: "#131629",
  card: "#181b2e",
  cardHover: "#1e2235",

  /* Borders */
  border: "#ffffff1a",
  borderMid: "#ffffff22",

  /* Text */
  text: "#eaecf5",
  textSub: "#9ba3c2",
  textDim: "#6b7299",

  /* Primary - indigo-violet (kept as teal for backward compat) */
  teal: "#818cf8",
  tealDim: "#4f46e5",

  /* Accent */
  amber: "#fbbf24",
  red: "#f87171",

  /* Code background */
  codeBg: "#090b14",
} as const;

export type ThemeColor = (typeof C)[keyof typeof C];

export const FONT_SANS = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif';
export const FONT_MONO = '"JetBrains Mono", "Fira Code", ui-monospace, monospace';
