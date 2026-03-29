/**
 * Dark-teal design tokens — mirrors @theme in index.css for inline styles and Recharts.
 * @see inspirations/THEME_REDESIGN_GUIDE.md
 */
export const C = {
  bg: "#0e1816",
  surface: "#132220",
  card: "#172a26",
  cardHover: "#1c322d",
  border: "#243832",
  borderMid: "#2d443d",
  text: "#f0faf7",
  textSub: "#9ebfb0",
  textDim: "#6d9084",
  teal: "#3fe0c8",
  tealDim: "#1f8f7d",
  amber: "#e8a030",
  red: "#e05555",
  codeBg: "#0a1412",
} as const;

export type ThemeColor = (typeof C)[keyof typeof C];

export const FONT_SANS = '"Inter", system-ui, sans-serif';
export const FONT_MONO = '"JetBrains Mono", "Fira Code", ui-monospace, monospace';
