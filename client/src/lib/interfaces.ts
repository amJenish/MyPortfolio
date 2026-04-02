/** Optional pills on listing cards (e.g. accuracy, R²) */
export type CardMetric = { label: string; value: string };

/** Shared shape for software projects and Data/ML entries */
export interface WorkEntry {
  id: string;
  title: string;
  /** Short plain-text blurb for cards and hero */
  summary: string;
  tags: string[];
  githubUrl: string;
  videoUrl?: string;
  date?: string;
  /** Optional bullets above the body */
  highlights?: string[];
  /** Maps to `client/src/content/portfolio/notebooks|projects/<slug>.page.tsx` via `portfolio/registry.ts` */
  reportSlug?: string;
  /** Optional nbviewer or Colab link */
  notebookUrl?: string;
  /** Shown on listing cards when set */
  cardMetrics?: CardMetric[];
}

export type Project = WorkEntry;

export interface KaggleProject extends WorkEntry {
  /** Shown on Data/ML cards and detail */
  date: string;
  reportSlug: string;
  /** Old URL segments (e.g. kaggle-1) — still accepted; router redirects to canonical `id` */
  legacyIds?: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
  abstract: string;
}
