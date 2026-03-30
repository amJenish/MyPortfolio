/**
 * Re-export theme tokens for notebook pages using inline styles.
 * All colors now use the indigo-violet design system from @/lib/theme.
 */
export { C, FONT_MONO, FONT_SANS } from "@/lib/theme";

/**
 * @deprecated — kept for backward compatibility only.
 * Use C from @/lib/theme for all new code.
 * These values now match the indigo-violet design system.
 */
export const notebookNeutrals = {
  bg: "#0d0f1a",
  surface: "#131629",
  card: "#181b2e",
  border: "#ffffff1a",
  text: "#eaecf5",
  textDim: "#6b7299",
  muted: "#4b5280",
} as const;
