/**
 * Data-Science, ML and Notebook entries — add a new row:
 * 1. Add `client/src/content/portfolio/notebooks/<slug>.page.tsx` (default export + `workPageSections`) and register in `portfolio/registry.ts`.
 * 2. Append a `KaggleProject` with `reportSlug` matching that slug, plus `githubUrl`, `date`, `tags`, `summary`, `highlights`, optional `cardMetrics` / `notebookUrl`.
 * 3. Put figures in `client/public/portfolio/notebooks/<slug>/`; use `WorkFigure` with `placeholder` until assets exist.
 * 4. Run `npm run check` and open `/ml/<id>` (canonical) or `/data/<id>` (alias).
 * 5. Home spotlight IDs live in `lib/content/home/spotlightConfig.ts`; full list is on `/ml`.
 */

import type { KaggleProject } from "../interfaces";

export const kaggleProjects: KaggleProject[] = [
  {
    id: "kaggle-1",
    title: "Telco customer churn",
    date: "2026-01-24",
    summary: "",
    githubUrl: "https://github.com/amJenish/Telco-Customer-Churn-Prediction",
    tags: ["Python", "pandas", "scikit-learn"],
    reportSlug: "telco-churn",
    notebookUrl:
      "https://nbviewer.org/github/amJenish/Telco-Customer-Churn-Prediction/blob/main/Analysis%20and%20Modeling.ipynb",
    cardMetrics: [
      { label: "AUC", value: "83.6%" },
      { label: "Acc", value: "79.5%" },
    ],
    highlights: [],
  },
  {
    id: "kaggle-2",
    title: "House prices prediction",
    date: "2025-01-10",
    summary: "",
    githubUrl: "https://github.com/amJenish/House-Prices-Advanced-Regression",
    tags: ["Python", "XGBoost", "pandas"],
    reportSlug: "house-prices",
    notebookUrl:
      "https://nbviewer.org/github/amJenish/House-Prices-Advanced-Regression/blob/main/House%20Prices%20Advanced%20Regression%20Techniques.ipynb",
    cardMetrics: [{ label: "Test R²", value: "~92%" }],
    highlights: [],
  },
  {
    id: "kaggle-3",
    title: "Job–Resume Fit Prediction",
    date: "2025-12-10",
    summary: "",
    githubUrl: "https://github.com/amJenish/Job-Resume-Matching",
    tags: ["Python", "NLP", "scikit-learn", "SentenceTransformers", "pandas", "PyTorch","TensorFlow", "NLP", "spaCy", "XGBoost"],
    
    reportSlug: "job-resume",
    notebookUrl: "https://nbviewer.org/github/amJenish/Job-Resume-Matching/blob/main/Main.ipynb",
    cardMetrics: [{ label: "Acc (val)", value: "~87%" }],
    highlights: [],
  }
];
