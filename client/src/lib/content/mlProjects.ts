/**
 * Data-Science, ML and Notebook entries — add a new row:
 * 1. Add `client/src/content/portfolio/notebooks/<slug>.page.tsx` (default export + `workPageSections`) and register in `portfolio/registry.ts`.
 * 2. Append a `KaggleProject` with `reportSlug` matching that slug, plus `githubUrl`, `date`, `tags`, `summary`, `highlights`, optional `cardMetrics` / `notebookUrl`.
 * 3. Put figures in `client/public/portfolio/notebooks/<slug>/`; use `WorkFigure` with `placeholder` until assets exist.
 * 4. Run `npm run check` and open `/data/<id>` (canonical detail, e.g. data-1). Legacy `/ml/kaggle-*` and `/data/kaggle-*` redirect to `/data/data-*`.
 * 5. Home spotlight IDs live in `lib/content/home/spotlightConfig.ts`; full list is on `/ml` or `/data`.
 */

import type { KaggleProject } from "../interfaces";

export function findMlProjectByRouteId(routeId: string): KaggleProject | undefined {
  return kaggleProjects.find(
    (p) => p.id === routeId || p.legacyIds?.includes(routeId),
  );
}

export const kaggleProjects: KaggleProject[] = [
  {
    id: "data-3",
    legacyIds: ["kaggle-3"],
    title: "Job–Resume Match Classification",
    date: "2025-12-10",
    summary: "",
    githubUrl: "https://github.com/amJenish/Job-Resume-Matching",
    tags: [
      "Python",
      "NLP",
      "scikit-learn",
      "spaCy",
      "pandas",
      "PyTorch",
      "TensorFlow",
      "SentenceTransformers",
      "HuggingFace",
      "MiniLM",
      "XGBoost",
      "LightGBM",
    ],
    reportSlug: "job-resume",
    notebookUrl: "https://nbviewer.org/github/amJenish/Job-Resume-Matching/blob/main/Main.ipynb",
    cardMetrics: [{ label: "Acc (val)", value: "~88%" }],
    highlights: [],
  },
  {
    id: "data-1",
    legacyIds: ["kaggle-1"],
    title: "Telco Customer Churn Analysis & Classification",
    date: "2025-10-24",
    summary: "",
    githubUrl: "https://github.com/amJenish/Telco-Customer-Churn-Prediction",
    tags: ["Python", "scikit-learn", "pandas", "Gradient Boosting", "Classification"],
    reportSlug: "telco-churn",
    notebookUrl:
      "https://nbviewer.org/github/amJenish/Telco-Customer-Churn-Prediction/blob/main/Analysis%20and%20Modeling.ipynb",
    cardMetrics: [
      { label: "Churn Recall", value: "90%" },
    ],
    highlights: [],
  },
  {
    id: "data-2",
    legacyIds: ["kaggle-2"],
    title: "Housing Prices Prediction: Analysis & Regression",
    date: "2025-01-10",
    summary: "",
    githubUrl: "https://github.com/amJenish/House-Prices-Advanced-Regression",
    tags: ["Python", "XGBoost", "CatBoost", "scikit-learn", "pandas", "seaborn", "RandomizedSearchCV", "Feature Engineering"],
    reportSlug: "house-prices",
    notebookUrl:
      "https://nbviewer.org/github/amJenish/House-Prices-Advanced-Regression/blob/main/House%20Prices%20Advanced%20Regression%20Techniques.ipynb",
    cardMetrics: [
      { label: "Test R²", value: "92.6%" },
      { label: "Best CV R²", value: "88.3%" },
    ],
    highlights: [],
  },
];
