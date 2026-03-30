import { useState, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, ReferenceLine,
} from "recharts";

import { FONT_MONO, FONT_SANS } from "./notebookTheme";
import { Body, Tag } from "../reportPrimitives";

// ── STANDARD CHART COLORS ──────────────────────────────────────────────────

const CHART_COLORS = {
  primary: "#6366f1",    // Indigo (primary)
  primaryDim: "#4f46e5", // Darker indigo for borders
  success: "#22c55e",    // Green
  warning: "#f59e0b",    // Amber/Orange
  danger: "#ef4444",     // Red
  secondary: "#06b6d4",  // Cyan
};

const P = {
  purple: "#a855f7",
  bg: "var(--background)",
} as const;


import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";



// ── DATA ──────────────────────────────────────────────────────────────────────

const f1Progression = [
  { exp: "Exp 1", label: "Handcrafted\n10-D (LR)", f1: 60, fill: CHART_COLORS.danger },
  { exp: "Exp 2", label: "Frozen MiniLM\n1536-D (LR)", f1: 69, fill: CHART_COLORS.warning },
  { exp: "Exp 3", label: "Fine-tuned\nMiniLM (LR)", f1: 84, fill: CHART_COLORS.warning },
  { exp: "Exp 4", label: "28-D Features\n(LR)", f1: 84, fill: CHART_COLORS.secondary },
  { exp: "Exp 5", label: "28-D Features\n+ MLP ★", f1: 88, fill: CHART_COLORS.secondary },
];

const classifierComparison = [
  { model: "MLP ★",               f1: 88, fill: CHART_COLORS.secondary },
  { model: "XGBoost",             f1: 86, fill: CHART_COLORS.warning },
  { model: "LightGBM",            f1: 86, fill: CHART_COLORS.warning },
  { model: "GradBoost",           f1: 84, fill: CHART_COLORS.secondary },
  { model: "HistGradBoost",       f1: 84, fill: CHART_COLORS.secondary },
  { model: "RandomForest",        f1: 83, fill: "var(--muted-foreground)" },
  { model: "CatBoost",            f1: 83, fill: "var(--muted-foreground)" },
];

const featureDimensions = [
  { exp: "Exp 1", dims: 10,   type: "Handcrafted" },
  { exp: "Exp 2", dims: 1536, type: "Frozen Embeddings" },
  { exp: "Exp 3", dims: 1536, type: "Fine-tuned Embeddings" },
  { exp: "Exp 4", dims: 28,   type: "Structured Compatibility" },
  { exp: "Exp 5", dims: 28,   type: "Structured + Nonlinear" },
];

const gainBreakdown = [
  { source: "Frozen MiniLM (Exp 2 vs 1)", gain: 9, fill: CHART_COLORS.warning },
  { source: "Fine-tuning (Exp 3 vs 2)",   gain: 15, fill: CHART_COLORS.warning },
  { source: "Structured features",        gain: 0, fill: "var(--muted-foreground)" },
  { source: "Nonlinear classifier",       gain: 4, fill: CHART_COLORS.secondary },
];

// ── SHARED UI ─────────────────────────────────────────────────────────────────

type TooltipPayloadItem = {
  name?: string;
  value?: string | number | ReadonlyArray<string | number>;
  color?: string;
};

function Tip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}): React.JSX.Element | null {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, padding: "10px 14px", borderRadius: 8, fontSize: 13, color: "var(--foreground)", fontFamily: FONT_MONO }}>
      <div style={{ color: CHART_COLORS.primary, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--foreground)" }}>
          {p.name}:{" "}
          <span style={{ fontWeight: 600 }}>{typeof p.value === "number" ? `${p.value}%` : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function Section({ n, title }: { n: number; title: string }): React.JSX.Element {
  const num = String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: CHART_COLORS.primary, border: `1px solid ${CHART_COLORS.primaryDim}`, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
        {num}
      </span>
      <h2 style={{ fontFamily: FONT_SANS, fontSize: 24, color: "var(--foreground)", margin: 0, fontWeight: 700, letterSpacing: -0.5, whiteSpace: "nowrap" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}

function KPI({ label, value, sub, color }: { label: string; value: ReactNode; sub?: string; color?: string }): React.JSX.Element {
  return (
    <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, padding: "20px 24px", flex: 1, borderTop: `3px solid ${color || CHART_COLORS.primary}` }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 36, color: color || CHART_COLORS.primary, fontWeight: 900, lineHeight: 1 }}>{value}</div>
      {sub ? <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{sub}</div> : null}
    </div>
  );
}

function Mono({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <code style={{ fontFamily: FONT_MONO, fontSize: 11.5, background: "var(--muted)", color: CHART_COLORS.secondary, padding: "2px 7px", borderRadius: 4, border: `1px solid ${"var(--border)"}` }}>{children}</code>
  );
}

function Callout({ color = CHART_COLORS.primary, icon, children }: { color?: string; icon?: ReactNode; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ background: `${color}12`, border: `1px solid ${color}40`, borderRadius: 10, padding: "14px 18px", marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
      {icon ? <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span> : null}
      <div style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function AnalysisBlock({ heading, children }: { heading?: string; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderLeft: `3px solid ${CHART_COLORS.primary}`, borderRadius: "0 10px 10px 0", padding: "16px 20px", marginTop: 16 }}>
      {heading ? <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: CHART_COLORS.primary, marginBottom: 8 }}>{heading}</div> : null}
      <div style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function ChartCard({ label, note, children }: { label?: string; note?: ReactNode; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, padding: "28px 28px 20px" }}>
      {label ? <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>{label}</div> : null}
      {note ? <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{note}</p> : null}
      {children}
    </div>
  );
}

function TableRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }): React.JSX.Element {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 18px", borderBottom: `1px solid ${"var(--border)"}`, fontSize: 13, color: highlight ? CHART_COLORS.primary : "var(--muted-foreground)", background: highlight ? `${CHART_COLORS.primary}08` : "transparent" }}>
      <span>{label}</span>
      <span style={{ fontFamily: FONT_MONO, color: highlight ? CHART_COLORS.primary : "var(--foreground)" }}>{value}</span>
    </div>
  );
}

const EXP_TABS = ["1", "2", "3", "4", "5"] as const;
type ExpTab = (typeof EXP_TABS)[number];

export const workPageSections = [
  { id: "rjm-kpis",       label: "Overview" },
  { id: "rjm-question",   label: "Research question" },
  { id: "rjm-data",       label: "Data & preprocessing" },
  { id: "rjm-design",     label: "Experimental design" },
  { id: "rjm-results",    label: "Results" },
  { id: "rjm-classifiers",label: "Classifier comparison" },
  { id: "rjm-findings",   label: "Key findings" },
  { id: "rjm-next",       label: "Next steps" },
] as const;

// ── EXPERIMENT DETAIL CONTENT ──────────────────────────────────────────────────

const expDetails: Record<ExpTab, { title: string; dim: string; f1: string; color: string; body: string; why: string }> = {
  "1": {
    title: "Handcrafted 10-D Baseline",
    dim: "10 features",
    f1: "60%",
    color: CHART_COLORS.danger,
    body: "I built a shallow feature vector from basic text statistics and coarse semantic similarity: cosine similarity between generic sentence embeddings, embedding norms, mean and variance of embedding components, and token counts for both resume and job description. No task-specific learning was involved.",
    why: "This experiment establishes a performance floor. An F1 of 60% tells me that basic structural properties of text carry some compatibility signal, but they're far too coarse to capture what actually makes a candidate a good fit for a role.",
  },
  "2": {
    title: "Frozen MiniLM + 1536-D Interactions",
    dim: "1536 features",
    f1: "69%",
    color: CHART_COLORS.warning,
    body: "I used a pretrained MiniLM encoder to produce 384-dimensional embeddings for both the resume and the job description. These were combined into a 1536-dimensional interaction vector by concatenating the raw embeddings, their absolute difference, and their elementwise product. The encoder was frozen throughout.",
    why: "The jump from 60% to 69% told me that general-purpose transformer embeddings encode meaningfully richer semantic structure than surface text statistics. The absolute difference component may capture mismatches between skills and requirements, while the elementwise product highlights dimensions where both texts strongly agree.",
  },
  "3": {
    title: "Fine-Tuned MiniLM Bi-Encoder",
    dim: "1536 features",
    f1: "84%",
    color: CHART_COLORS.primary,
    body: "I fine-tuned the MiniLM encoder on compatibility labels using a cosine similarity objective. Compatible pairs are encouraged to have embeddings close together; incompatible pairs are pushed apart with a margin-based loss. The downstream interaction features remained identical to Experiment 2, isolating the effect of the reshaped embedding space.",
    why: "The F1 jump from 69% to 84% under a fixed classifier and fixed feature construction is the largest single gain across my entire study. It strongly suggests that the embedding space, once reshaped around compatibility rather than general language understanding, becomes dramatically more informative. The representation was the primary bottleneck, not the classifier.",
  },
  "4": {
    title: "Structured 28-D Compatibility Features",
    dim: "28 features",
    f1: "≈84%",
    color: CHART_COLORS.secondary,
    body: "Using spaCy noun-chunk extraction and regular expressions, I derived structured compatibility signals: skill overlap, Jaccard similarity between skill sets, the gap between required and observed years of experience, education-level alignment, and sentence-level similarity scores from the fine-tuned bi-encoder. These were condensed into a 28-dimensional, human-interpretable feature vector.",
    why: "Adding structured features under the same linear classifier produced no significant gain. My read is that the information is largely already captured by the fine-tuned embeddings, or that the relationships between these structured features are inherently nonlinear in ways a logistic regression boundary can't exploit.",
  },
  "5": {
    title: "Nonlinear Classifiers on 28-D Features",
    dim: "28 features",
    f1: "88% (MLP)",
    color: P.purple,
    body: "I held the 28-dimensional representation fixed and varied the classifier architecture across seven nonlinear models: MLP, Random Forest, XGBoost, LightGBM, GradientBoosting, HistGradientBoosting, and CatBoost. The MLP achieved the best F1 of 88%, with XGBoost and LightGBM close behind at 86%.",
    why: "The improvement from 84% (LR) to 88% (MLP) on the same feature set suggests that the structured compatibility features contain nonlinear interactions a linear classifier can't access. High semantic similarity combined with a missing critical skill may still signal poor fit, and a nonlinear boundary appears better suited to capture that logic.",
  },
};

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function ResumeJobMatchingReport(props: WorkPageProps) {
  const [activeExp, setActiveExp] = useState<ExpTab>("3");

  return (
    <WorkReportShell {...props}>
    <div style={{ color: "var(--foreground)", fontFamily: FONT_SANS }}>
      {/* ── HERO ── */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "72px 0 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            opacity: 0.3,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "60%",
            width: 600,
            height: 600,
            background: `radial-gradient(ellipse, ${CHART_COLORS.secondary}08 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 40px", position: "relative" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>
              NLP · Representation Learning · Binary Classification · ATS
            </span>
            <Tag color={CHART_COLORS.success}>Complete</Tag>
          </div>

          <h1
            style={{
              fontFamily: FONT_SANS,
              fontSize: "clamp(36px, 5vw, 62px)",
              fontWeight: 700,
              margin: "0 0 16px",
              lineHeight: 1.15,
              color: "var(--foreground)",
              letterSpacing: -0.02,
            }}
          >
            Resume–Job Matching:
            <br />
            <span style={{ color: CHART_COLORS.primary }}>Representation vs. Classifier</span>
          </h1>

          <Body style={{ maxWidth: 660, marginBottom: 24, color: "var(--foreground)" }}>
            When an ML system improves, it's often unclear whether credit belongs to a better representation or a more expressive classifier. I built a controlled framework to answer that question in the context of Applicant Tracking Systems:{" "}
            <strong style={{ color: "var(--foreground)" }}>
              how much of the gain comes from learning better embeddings, and how much from choosing a more powerful model?
            </strong>
          </Body>

          <Body style={{ maxWidth: 660, marginBottom: 36, color: "var(--foreground)" }}>
            Across five staged experiments, I found that representation learning alone lifted F1 from{" "}
            <strong style={{ color: "var(--foreground)" }}>60% to 84%</strong> under a fixed linear classifier. Switching to a nonlinear MLP then pushed it further to{" "}
            <strong style={{ color: "var(--foreground)" }}>88%</strong>, suggesting the two contributions are sequential rather than interchangeable.
          </Body>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {props.entry.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "60px 40px" }}>

        {/* KPIs */}
        <div id="rjm-kpis" className="scroll-mt-28" style={{ display: "flex", gap: 16, marginBottom: 80, flexWrap: "wrap" }}>
          <KPI label="Dataset" value="HF" sub="resume-jd-match dataset from Hugging Face, binarized to fit / no-fit labels" />
          <KPI label="Best F1-score" value="88%" sub="MLP on 28-D structured compatibility features in Experiment 5" color={P.purple} />
          <KPI label="Representation gain" value="+24%" sub="F1 improvement from Exp 1 to Exp 3 under a fixed Logistic Regression" color={CHART_COLORS.primary} />
          <KPI label="Classifier gain" value="+4%" sub="Additional F1 improvement from switching LR to MLP on the same features" color={CHART_COLORS.secondary} />
        </div>

        {/* ══ 01 RESEARCH QUESTION ══ */}
        <div id="rjm-question" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={1} title="The Research Question" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0 }}>
                Applicant Tracking Systems are under growing pressure to automate the compatibility screening between candidate resumes and job descriptions. Recent transformer-based approaches have improved performance substantially, but the attribution is typically muddied: systems improve their representation and their classifier simultaneously, making it hard to say which change is responsible for which gain.
              </p>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85 }}>
                I designed this project to separate those two axes cleanly. In my first four experiments, I held the classifier constant as a Logistic Regression while the representation changed. Only in the fifth experiment did I vary the classifier, on a fixed representation. The goal was to isolate each contribution and understand the order in which they matter.
              </p>
            </div>
            <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${"var(--border)"}`, fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>Study at a glance</div>
              {[
                ["Task", "Binary compatibility classification"],
                ["Positive class", "Potential fit or good fit"],
                ["Negative class", "No fit"],
                ["Evaluation metric", "F1-score (balances precision & recall)"],
                ["Fixed classifier (Exp 1–4)", "Logistic Regression (lbfgs, balanced)"],
                ["Varying classifiers (Exp 5)", "MLP, RF, XGBoost, LGBM, CatBoost + 2 more"],
                ["Number of experiments", "5 (staged, controlled)"],
                ["Best configuration", "28-D structured features + MLP"],
              ].map(([k, v]) => <TableRow key={k} label={k} value={v} />)}
            </div>
          </div>
        </div>

        {/* ══ 02 DATASET & PREPROCESSING ══ */}
        <div id="rjm-data" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={2} title="Dataset & Preprocessing" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            I used <Mono>facehuggerapoorv/resume-jd-match</Mono> from Hugging Face. Each row contains a single packed text field with both a job description and a resume enclosed in <Mono>{"<<...>>"}</Mono> delimiters, alongside a three-way compatibility label. My preprocessing pipeline unpacks, cleans, and standardizes these fields before any feature extraction takes place.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0 }}>
                A notable quality issue I found in the raw data is that many resumes lack punctuation entirely, which may interfere with sentence-level embedding models that rely on syntactic boundaries. Rather than ignoring this, I applied a pretrained punctuation restoration model (<Mono>oliverguhr/fullstop-punctuation-multilang-large</Mono>) to both resumes and job descriptions in batches, re-inserting periods, commas, and question marks based on predicted token boundaries.
              </p>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85 }}>
                I then applied a custom spacing normalizer to handle compounded text artifacts: camelCase boundaries are split, spacing after punctuation is enforced, and symbols like <Mono>&</Mono>, <Mono>/</Mono>, and parentheses are padded correctly. The goal was to produce clean, natural-reading text before handing it to downstream encoders.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Callout color={CHART_COLORS.secondary} icon="①">
                <strong style={{ color: "var(--foreground)" }}>Label binarization.</strong> I collapsed the original three-way labels ("no fit", "potential fit", "good fit") to binary: anything other than "no fit" is treated as a positive match. This reflects the practical ATS decision of whether to shortlist a candidate.
              </Callout>
              <Callout color={CHART_COLORS.warning} icon="②">
                <strong style={{ color: "var(--foreground)" }}>Punctuation restoration.</strong> Resumes in the dataset frequently lack punctuation, which may degrade sentence-embedding quality. I applied the <Mono>fullstop</Mono> model to restore these boundaries before any encoding takes place.
              </Callout>
              <Callout color={P.purple} icon="③">
                <strong style={{ color: "var(--foreground)" }}>Feature standardization.</strong> I scaled all numeric feature vectors (handcrafted stats, interaction vectors, structured compatibility features) using <Mono>StandardScaler</Mono> before passing them to any classifier. I didn't apply stemming or lemmatization, as transformer-based encoders handle lexical variation internally.
              </Callout>
            </div>
          </div>
        </div>

        {/* ══ 03 EXPERIMENTAL DESIGN ══ */}
        <div id="rjm-design" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={3} title="Experimental Design" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 28 }}>
            I organised the study around two phases. In phase one (Experiments 1–4), I held the classifier fixed as a Logistic Regression and varied only the representation, so that performance differences could be attributed to the feature space rather than the model. In phase two (Experiment 5), I held the representation fixed and varied the classifier, testing whether nonlinear decision boundaries could recover signal that a linear model couldn't access.
          </p>

          {/* Experiment selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {EXP_TABS.map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveExp(tab)} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: "8px 18px", borderRadius: 6, cursor: "pointer", background: activeExp === tab ? CHART_COLORS.primary : "var(--card)", color: activeExp === tab ? P.bg : "var(--muted-foreground)", border: `1px solid ${activeExp === tab ? CHART_COLORS.primary : "var(--border)"}`, transition: "all 0.15s" }}>
                Exp {tab}
              </button>
            ))}
          </div>

          {/* Dynamic experiment card */}
          {(() => {
            const d = expDetails[activeExp];
            return (
              <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, padding: "28px", borderTop: `3px solid ${d.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6 }}>Experiment {activeExp}</div>
                    <h3 style={{ fontFamily: FONT_SANS, fontSize: 22, color: "var(--foreground)", margin: 0, fontWeight: 700 }}>{d.title}</h3>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 8, padding: "12px 20px", textAlign: "center" }}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>Dimensions</div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 18, color: d.color, fontWeight: 700 }}>{d.dim}</div>
                    </div>
                    <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 8, padding: "12px 20px", textAlign: "center" }}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>F1-Score</div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: 28, color: d.color, fontWeight: 900, lineHeight: 1 }}>{d.f1}</div>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.8, margin: "0 0 16px" }}>{d.body}</p>
                <AnalysisBlock heading="My interpretation">
                  {d.why}
                </AnalysisBlock>
              </div>
            );
          })()}

          <Callout color={CHART_COLORS.primary} icon="→">
            <strong style={{ color: "var(--foreground)" }}>Why I used Logistic Regression as the fixed classifier.</strong> A linear model can't implicitly learn complex nonlinear interactions between features. Any performance improvement I observed across Experiments 1–4 was therefore more cleanly attributable to the quality of the representation rather than to the classifier's ability to compensate for a poor feature space.
          </Callout>
        </div>

        {/* ══ 04 RESULTS ══ */}
        <div id="rjm-results" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={4} title="Results Across All Experiments" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            The F1 trajectory across my experiments tells a clear story: representation learning does most of the work, fine-tuning is the single largest lever, and structured symbolic features add interpretability without necessarily adding performance under a linear model. Nonlinear classifiers then unlock the remaining latent signal once the representation is sufficiently rich.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <ChartCard
              label="Chart 1 : F1-score progression across experiments"
              note={<>The sharpest jump I observed occurs between Experiment 2 and Experiment 3, where fine-tuning lifts F1 from <strong style={{ color: CHART_COLORS.warning }}>69%</strong> to <strong style={{ color: CHART_COLORS.primary }}>84%</strong> under the same classifier and feature construction. The final MLP closes at <strong style={{ color: P.purple }}>88%</strong>.</>}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={f1Progression} barCategoryGap="35%">
                  <CartesianGrid vertical={false} stroke={"var(--border)"} />
                  <XAxis dataKey="exp" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[55, 92]} tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                  <ReferenceLine y={84} stroke={"var(--muted-foreground)"} strokeDasharray="4 4" />
                  <Bar dataKey="f1" name="F1-Score" radius={[5, 5, 0, 0]}>
                    {f1Progression.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <AnalysisBlock heading="What the plateau told me">
                Experiment 4 matches Experiment 3's F1 of 84% despite richer, more interpretable features. My interpretation is that the structured signals are largely already encoded in the fine-tuned embedding space, or that the linear classifier can't exploit their nonlinear interactions. That plateau is what motivated me to run Experiment 5.
              </AnalysisBlock>
            </ChartCard>

            <ChartCard
              label="Chart 2 : Marginal gain by source of improvement"
              note={<>Fine-tuning the encoder accounts for roughly <strong style={{ color: CHART_COLORS.primary }}>15%</strong> of F1 improvement, the largest single contribution I found. Using frozen embeddings adds <strong style={{ color: CHART_COLORS.warning }}>9%</strong>, while the final nonlinear classifier contributes <strong style={{ color: P.purple }}>4%</strong>. Structured features alone add zero under a linear model.</>}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gainBreakdown} layout="vertical" barCategoryGap="28%">
                  <CartesianGrid horizontal={false} stroke={"var(--border)"} />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `+${v}%`} />
                  <YAxis type="category" dataKey="source" tick={{ fill: "var(--muted-foreground)", fontSize: 10.5, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={160} />
                  <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                  <Bar dataKey="gain" name="F1 Gain" radius={[0, 5, 5, 0]}>
                    {gainBreakdown.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <AnalysisBlock heading="The sequential nature of the gains">
                The ordering matters here: trying a nonlinear classifier on the Experiment 1 features would likely have yielded little benefit, since the feature space itself would still have been too impoverished. I found I needed to address representation quality first, and classifier expressiveness only became useful once the feature space was sufficiently rich.
              </AnalysisBlock>
            </ChartCard>
          </div>

          {/* Full results table */}
          <div style={{ marginTop: 20, background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", background: "var(--card)", padding: "11px 18px", fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", borderBottom: `1px solid ${"var(--border)"}` }}>
              <span>Experiment</span><span>Representation</span><span>Classifier</span><span>F1-Score</span>
            </div>
            {[
              { name: "1: Handcrafted 10-D baseline",          rep: "10-D handcrafted",   clf: "Logistic Reg.", f1: "60%",  hl: false },
              { name: "2: Frozen MiniLM + 1536-D interactions", rep: "1536-D frozen",      clf: "Logistic Reg.", f1: "69%",  hl: false },
              { name: "3: Fine-tuned MiniLM bi-encoder",        rep: "1536-D fine-tuned", clf: "Logistic Reg.", f1: "84%",  hl: false },
              { name: "4: 28-D structured compatibility",       rep: "28-D structured",   clf: "Logistic Reg.", f1: "≈84%", hl: false },
              { name: "5: 28-D structured + MLP ★",            rep: "28-D structured",   clf: "MLP",           f1: "88%",  hl: true  },
              { name: "5: 28-D structured + XGBoost",          rep: "28-D structured",   clf: "XGBoost",       f1: "86%",  hl: false },
              { name: "5: 28-D structured + LightGBM",         rep: "28-D structured",   clf: "LightGBM",      f1: "86%",  hl: false },
              { name: "5: 28-D structured + GradBoost",        rep: "28-D structured",   clf: "GradientBoost", f1: "84%",  hl: false },
              { name: "5: 28-D structured + RandomForest",     rep: "28-D structured",   clf: "RandomForest",  f1: "83%",  hl: false },
              { name: "5: 28-D structured + CatBoost",         rep: "28-D structured",   clf: "CatBoost",      f1: "83%",  hl: false },
            ].map(({ name, rep, clf, f1, hl }) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", padding: "12px 18px", fontSize: 13, color: hl ? CHART_COLORS.primary : "var(--muted-foreground)", background: hl ? `${CHART_COLORS.primary}08` : "transparent", borderBottom: `1px solid ${"var(--border)"}`, fontFamily: hl ? FONT_MONO : "inherit" }}>
                <span>{name}</span><span>{rep}</span><span>{clf}</span><span>{f1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 05 CLASSIFIER COMPARISON ══ */}
        <div id="rjm-classifiers" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={5} title="Classifier Comparison in Experiment 5" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            With the 28-dimensional structured representation fixed, I evaluated seven nonlinear classifiers. I deliberately chose the compact 28-dimensional space over the 1536-dimensional embeddings to avoid the confounding effects of very high-dimensional inputs and make the classifier comparison cleaner and more interpretable.
          </p>

          <ChartCard
            label="Chart 3 : F1-score by classifier (Experiment 5, fixed 28-D representation)"
            note={<>The MLP leads at <strong style={{ color: P.purple }}>88%</strong>, followed by XGBoost and LightGBM at 86%. Tree-based ensembles cluster around 83–84%. Logistic regression on the same features achieves 84%, showing that even relatively straightforward nonlinear models outperform the linear baseline by a meaningful margin.</>}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={classifierComparison} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke={"var(--border)"} />
                <XAxis dataKey="model" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 91]} tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <ReferenceLine y={84} stroke={"var(--muted-foreground)"} strokeDasharray="4 4" label={{ value: "LR baseline", fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="f1" name="F1-Score" radius={[5, 5, 0, 0]}>
                  {classifierComparison.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
            <AnalysisBlock heading="Why I think the MLP leads the tree ensembles">
              The 28-dimensional structured features include skill overlap, experience gaps, and semantic similarity scores that may interact in smooth, continuous ways rather than along sharp thresholds. MLPs are well-suited to capturing such smooth nonlinear interactions, while tree-based methods tend to partition feature space along axis-aligned boundaries. The gap is modest (88% vs 86%), so I treat this as a directional observation rather than a definitive conclusion.
            </AnalysisBlock>
            <AnalysisBlock heading="Why I preferred compact 28-D over 1536-D for Exp 5">
              Experiments 3 and 4 achieve similar F1 under Logistic Regression. Rather than running Experiment 5 on the 1536-dimensional embeddings which would have confounded classifier comparisons with very high-dimensional input effects, I chose the more compact 28-D representation. It's also far more interpretable, which aligned with my goal of understanding what each classifier is actually doing with the features it receives.
            </AnalysisBlock>
          </div>
        </div>

        {/* ══ 06 KEY FINDINGS ══ */}
        <div id="rjm-findings" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={6} title="Key Findings" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            My five experiments across two phases produce a coherent picture of how representation learning and classifier complexity interact in a text-matching task.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { icon: "📐", color: CHART_COLORS.primary, title: "Representation learning is the dominant driver", body: "Fine-tuning the MiniLM bi-encoder on compatibility labels accounts for 15% of F1 improvement under a fixed linear classifier. That is roughly three times the gain I achieved by switching to the best nonlinear classifier later. The quality of the feature space mattered far more than the sophistication of the classifier, at least up to a point." },
              { icon: "🔧", color: CHART_COLORS.warning, title: "Fine-tuning, not frozen embeddings, was the key step", body: "Frozen MiniLM embeddings improved over my handcrafted baseline (69% vs 60%), but the representation isn't yet shaped around compatibility. Fine-tuning explicitly reshapes the embedding space so that compatible pairs cluster together and incompatible pairs are pushed apart. Which is why I saw such a much larger improvement in Experiment 3 than Experiment 2 under the same classifier." },
              { icon: "📊", color: CHART_COLORS.secondary, title: "Structured features added interpretability, not performance", body: "The 28-D structured compatibility features I built (skill overlap, experience gap, Jaccard similarity, education alignment) added human-readable signal without improving F1 under a linear classifier. When I looked at the pairplot and PCA projection of the feature space, I could see heavily overlapping, nonlinearly separable class boundaries which helps explain why logistic regression couldn't exploit these features despite them seeming intuitively informative." },
              { icon: "🧠", color: P.purple, title: "Classifier complexity is useful, but only once the representation is ready", body: "Applying the MLP to a rich representation yielded 88% F1. Applied to the Experiment 1 feature space, a nonlinear classifier would likely have given much smaller gains. The order matters: I found that investing in representation quality first, then introducing classifier complexity, was the more efficient path in this text matching task." },
            ].map(({ icon, color, title, body }) => (
              <div key={title} style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 10, padding: "20px", borderTop: `3px solid ${color}` }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <strong style={{ fontSize: 14, color: "var(--foreground)", lineHeight: 1.4 }}>{title}</strong>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
          <Callout color={CHART_COLORS.primary} icon="★">
            <strong style={{ color: "var(--foreground)" }}>My central takeaway:</strong> in a resume–job matching setting, the choice of representation appears to matter far more than the choice of classifier, at least until representational capacity is no longer the bottleneck. This may have practical implications for ATS system design: optimising the encoder for the task is likely to yield larger returns than trying more powerful classifiers on a poorly suited feature space.
          </Callout>
        </div>

        {/* ══ 07 LIMITATIONS & NEXT STEPS ══ */}
        <div id="rjm-next" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={7} title="Limitations & What Comes Next" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, padding: "24px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: CHART_COLORS.danger, marginBottom: 18 }}>Known limitations</div>
              {[
                { title: "Single dataset with binary labels", body: "All my experiments use one dataset binarized to a fit / no-fit decision. The real hiring process involves more nuanced degrees of fit, and I'm not confident the same findings would hold on other datasets with different label distributions or domain characteristics." },
                { title: "No fairness-aware evaluation", body: "I evaluated only predictive performance. ATS systems operating in real hiring contexts would also need to assess whether the model's predictions are systematically skewed by demographic signals that may be present in resume text which is something my framework doesn't address." },
                { title: "Margin hyperparameter for fine-tuning is fixed", body: "The margin hyperparameter in the contrastive loss for Experiment 3 is set to a single value. Sweeping this hyperparameter might reveal a better-calibrated embedding space and could potentially push the fine-tuned representation further." },
                { title: "MLP architecture not fully ablated", body: "I evaluated the MLP as a single configuration. The number of layers, hidden dimensions, learning rate, and regularisation strength aren't swept, so it's possible that a more carefully tuned MLP would outperform the reported 88% figure by a larger margin than is currently visible." },
              ].map(({ title, body }) => (
                <div key={title} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                  <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>{title}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, padding: "24px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: CHART_COLORS.secondary, marginBottom: 18 }}>High-value next steps</div>
              {[
                { title: "Multi-level compatibility scoring", body: "Restoring the original three-way label (no fit / potential fit / good fit) as an ordinal prediction task could make the system more useful in practice, where recruiters benefit from ranked shortlists rather than binary gates." },
                { title: "Cross-domain generalization", body: "Testing the same experimental framework on resumes and job descriptions from different industries could reveal whether the fine-tuned representation generalises or overfits to domain-specific vocabulary patterns present in my training data." },
                { title: "SHAP for per-prediction explainability", body: "The 28-D structured features are interpretable in isolation, but a recruiter would benefit from knowing which features drove a specific prediction. Adding SHAP values to the MLP output would bridge that gap and could increase trust in automated shortlisting." },
                { title: "Fairness-aware training objectives", body: "Incorporating a fairness constraint into the fine-tuning objective such as ensuring predictions are conditionally independent of demographic proxies present in resume text would be a natural extension of my framework and would make the system closer to production-deployable." },
              ].map(({ title, body }) => (
                <div key={title} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                  <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>{title}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${"var(--border)"}`, paddingTop: 32 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>
            Dataset: facehuggerapoorv/resume-jd-match · Stack: Python, PyTorch, HuggingFace Transformers, spaCy, scikit-learn, XGBoost, LightGBM, CatBoost · Western University · Department of Computer Science
          </div>
        </div>

      </div>
    </div>
    </WorkReportShell>
  );
}