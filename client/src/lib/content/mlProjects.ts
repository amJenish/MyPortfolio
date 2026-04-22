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
    id: "data-4",
    legacyIds: ["kaggle-4"],
    title: "Transaction Fraud Anomaly Analysis and Detection",
    date: "2026-04-20",
    summary: "A data analysis project examining PaySim's synthetic financial transaction dataset to identify fraud patterns, engineer predictive signals, and build a realistic detection model constrained to pre-settlement information only.",
    githubUrl: "https://github.com/amJenish/Transaction-Fraud-Detection-Notebook",
    reportSlug: "fraud-anomaly",
    notebookUrl:
      "https://nbviewer.org/github/amJenish/Transaction-Fraud-Detection-Notebook/tree/main/",
    highlights: [],
  },
  {
    id: "data-3",
    legacyIds: ["kaggle-3"],
    title: "Job–Resume Match Classification",
    date: "2025-12-10",
    summary: "A controlled NLP study isolating how much performance gain in resume–job matching comes from better representations versus more expressive classifiers, including a hybrid of semantic and symbolic features, finding that fine-tuning the encoder contributes far more than upgrading the model.",
    githubUrl: "https://github.com/amJenish/Job-Resume-Matching",
    reportSlug: "job-resume",
    notebookUrl: "https://nbviewer.org/github/amJenish/Job-Resume-Matching/blob/main/Main.ipynb",
    highlights: [],
  },
  {
    id: "data-1",
    legacyIds: ["kaggle-1"],
    title: "Telco Customer Churn Analysis & Classification",
    date: "2025-10-24",
    summary: "A machine learning pipeline predicting telecom customer churn, deliberately optimised for recall over accuracy under the assumption that outreach costs are low, catching 90% of real churners using a tuned Hist Gradient Boosting classifier.",
    githubUrl: "https://github.com/amJenish/Telco-Customer-Churn-Prediction",
    reportSlug: "telco-churn",
    notebookUrl:
      "https://nbviewer.org/github/amJenish/Telco-Customer-Churn-Prediction/blob/main/Analysis%20and%20Modeling.ipynb",
    highlights: [],
  },
  {
    id: "data-2",
    legacyIds: ["kaggle-2"],
    title: "Housing Prices Prediction: Analysis & Regression",
    date: "2025-01-10",
    summary: "A regression analysis predicting residential property prices on the Ames Housing dataset, comparing models from linear regression to tuned gradient boosting, with domain-informed feature engineering across 79 variables.",
    githubUrl: "https://github.com/amJenish/House-Prices-Advanced-Regression",
    reportSlug: "house-prices",
    notebookUrl:
      "https://nbviewer.org/github/amJenish/House-Prices-Advanced-Regression/blob/main/House%20Prices%20Advanced%20Regression%20Techniques.ipynb",
    highlights: [],
  },
];
