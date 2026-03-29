/**
 * Re-export theme tokens for notebook pages using inline styles.
 * Prefer importing `C` / fonts from `@/lib/theme` in new code.
 */
export { C, FONT_MONO, FONT_SANS } from "@/lib/theme";

/** @deprecated use C from @/lib/theme */
export const notebookNeutrals = {
  bg: "#09100f",
  surface: "#0f1a18",
  card: "#132019",
  border: "#1e2e2a",
  text: "#e8f0ee",
  textDim: "#8fa89f",
  muted: "#5a746d",
} as const;
