import {
  WorkExecutiveSummary,
  WorkFooterLinks,
  WorkFramingQuestion,
  WorkProsCons,
  WorkSectionLabel,
} from "../_shared";

export const workPageSections = [
  { id: "summary", label: "Summary" },
  { id: "pipeline", label: "1. Pipeline" },
  { id: "stack", label: "2. Stack" },
] as const;

export default function SwProject1Page() {
  return (
    <div className="work-report-body space-y-10 text-left text-sm leading-[1.6] text-foreground sm:text-base">
      <WorkExecutiveSummary
        paragraphs={[
          "End-to-end hybrid classifier for resume ↔ job-description fit: fine-tuned MiniLM embeddings plus handcrafted semantic features, with an MLP classifier reaching about 87% accuracy on my validation split—roughly +4 points absolute vs a frozen encoder alone.",
        ]}
      />
      <WorkFramingQuestion>
        How do we combine dense embeddings and explicit HR-style signals so fit prediction is not only cosine similarity?
      </WorkFramingQuestion>

      <section className="space-y-4">
        <WorkSectionLabel number={1} title="Pipeline" id="pipeline" />
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Labeled pairs from train_JD_resume / test_JD_resume; three-class and binary targets</li>
          <li>Fine-tune all-MiniLM-L12-v2 with CosineSimilarityLoss; extract embedding stats + concat features</li>
          <li>spaCy/regex semantic features: skills Jaccard, experience, education, sentence similarity</li>
          <li>Classifiers: logistic, forests, boosting family, MLP (512, 256) with StandardScaler and class weights</li>
        </ul>
      </section>

      <section className="space-y-4">
        <WorkSectionLabel number={2} title="Stack" id="stack" />
        <p className="text-muted-foreground">
          Python, pandas, scikit-learn, XGBoost/LightGBM/CatBoost, PyTorch/TensorFlow, spaCy, SentenceTransformers.
        </p>
        <WorkProsCons
          pros={[
            "Showed that fusing embeddings, fine-tuned sentence similarity, and hand-crafted signals outperformed any single signal alone.",
            "Domain fine-tuning on job–resume pairs materially helped on ambiguous matches.",
          ]}
          cons={[
            "I'd benchmark embedding cost and caching if this were deployed at high query volume.",
            "Next: test how well engineered features transfer across industries and job families.",
            "Could extend beyond binary labels to preserve gradations between weak and strong fit.",
          ]}
        />
      </section>

      <WorkFooterLinks
        github="https://github.com/amJenish/Job-Resume-Matching"
        notebook="https://nbviewer.org/github/amJenish/Job-Resume-Matching/blob/main/Main.ipynb"
        notebookLabel="Main notebook (nbviewer)"
      />
    </div>
  );
}
