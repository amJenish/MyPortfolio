import { WorkSectionLabel } from "../_shared";
import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

export const workPageSections = [
  { id: "summary", label: "Overview" },
  { id: "pipeline", label: "1. Pipeline" },
  { id: "stack", label: "2. Stack" },
] as const;

export default function SwProject1Page(props: WorkPageProps) {
  return (
    <WorkReportShell {...props}>
      <div className="theme-body work-report-body mx-auto max-w-[min(100%,60rem)] space-y-10 px-4 pb-16 text-left text-sm sm:px-6 sm:text-base">
        <section className="scroll-mt-28 space-y-4">
          <WorkSectionLabel number={1} title="Overview" id="summary" />
          <p className="text-report-body">
            End-to-end hybrid classifier for resume ↔ job-description fit: fine-tuned MiniLM embeddings plus handcrafted semantic
            features, with an MLP classifier reaching about 87% accuracy on my validation split—roughly +4 points absolute vs a
            frozen encoder alone.
          </p>
          <p className="border-l-2 border-primary/50 pl-4 leading-[1.6] text-muted-foreground">
            How do we combine dense embeddings and explicit HR-style signals so fit prediction is not only cosine similarity?
          </p>
        </section>

        <section className="space-y-4">
          <WorkSectionLabel number={2} title="Pipeline" id="pipeline" />
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Labeled pairs from train_JD_resume / test_JD_resume; three-class and binary targets</li>
            <li>Fine-tune all-MiniLM-L12-v2 with CosineSimilarityLoss; extract embedding stats + concat features</li>
            <li>spaCy/regex semantic features: skills Jaccard, experience, education, sentence similarity</li>
            <li>Classifiers: logistic, forests, boosting family, MLP (512, 256) with StandardScaler and class weights</li>
          </ul>
        </section>

        <section className="space-y-6">
          <WorkSectionLabel number={3} title="Stack" id="stack" />
          <p className="text-muted-foreground">
            Python, pandas, scikit-learn, XGBoost/LightGBM/CatBoost, PyTorch/TensorFlow, spaCy, SentenceTransformers.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">What went well</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
                <li>Showed that fusing embeddings, fine-tuned sentence similarity, and hand-crafted signals outperformed any single signal alone.</li>
                <li>Domain fine-tuning on job–resume pairs materially helped on ambiguous matches.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Future improvements</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
                <li>I&apos;d benchmark embedding cost and caching if this were deployed at high query volume.</li>
                <li>Next: test how well engineered features transfer across industries and job families.</li>
                <li>Could extend beyond binary labels to preserve gradations between weak and strong fit.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </WorkReportShell>
  );
}


