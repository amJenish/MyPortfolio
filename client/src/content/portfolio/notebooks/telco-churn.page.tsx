import { useState, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts";
import {
  Body,
  Code,
  FONT_MONO,
  FONT_SANS,
  Notice,
  SectionLabel,
  Tag,
} from "../reportPrimitives";
import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

// ── STANDARD CHART COLORS ──────────────────────────────────────────────────

const CHART_COLORS = {
  primary: "#6366f1",    // Indigo (primary)
  success: "#22c55e",    // Green
  warning: "#f59e0b",    // Amber/Orange
  danger: "#ef4444",     // Red
  secondary: "#06b6d4",  // Cyan
};

const tenureChurn = [
  { group: "0–6 mo",   rate: 53.3, fill: CHART_COLORS.danger },
  { group: "7–12 mo",  rate: 35.9, fill: CHART_COLORS.warning },
  { group: "13–24 mo", rate: 28.7, fill: CHART_COLORS.warning },
  { group: "25–48 mo", rate: 20.4, fill: CHART_COLORS.secondary },
  { group: "49–72 mo", rate: 9.5,  fill: CHART_COLORS.secondary },
];

const paymentChurn = [
  { method: "E-Check",       rate: 45.3, fill: CHART_COLORS.danger },
  { method: "Mailed check",  rate: 19.2, fill: CHART_COLORS.warning },
  { method: "Bank transfer", rate: 16.7, fill: CHART_COLORS.secondary },
  { method: "Credit card",   rate: 15.3, fill: CHART_COLORS.secondary },
];

const monthlyChargeData = [
  { range: "$18–30",   churned: 8,  retained: 24 },
  { range: "$30–45",   churned: 5,  retained: 14 },
  { range: "$45–60",   churned: 9,  retained: 12 },
  { range: "$60–75",   churned: 13, retained: 11 },
  { range: "$75–90",   churned: 22, retained: 18 },
  { range: "$90–105",  churned: 28, retained: 12 },
  { range: "$105–119", churned: 15, retained: 9  },
];

const modelComparison = [
  { model: "KNN",    accuracy: 77.1, auc: 75.1 },
  { model: "SVM",    accuracy: 75.6, auc: 70.5 },
  { model: "LogReg", accuracy: 77.0, auc: 83.6 },
  { model: "RF",     accuracy: 79.3, auc: 83.5 },
  { model: "GBM ★",  accuracy: 79.4, auc: 83.6 },
];

const featureImportance = [
  { feature: "PaperlessBilling", importance: 1.71 },
  { feature: "Contract (1yr)",   importance: 1.79 },
  { feature: "OnlineSecurity",   importance: 2.14 },
  { feature: "E-Check Payment",  importance: 2.14 },
  { feature: "Contract (2yr)",   importance: 2.16 },
  { feature: "TechSupport",      importance: 2.18 },
  { feature: "Fiber Optic",      importance: 2.63 },
  { feature: "MonthlyCharges",   importance: 8.33 },
  { feature: "Tenure",           importance: 9.60 },
  { feature: "TotalCharges",     importance: 10.24 },
];

const classReport = [
  { label: "Precision", churned: 65, retained: 83 },
  { label: "Recall",    churned: 48, retained: 91 },
  { label: "F1-Score",  churned: 55, retained: 87 },
];

const CM = { TN: 1410, FP: 139, FN: 292, TP: 269 };

type TooltipPayloadItem = {
  name?: string;
  value?: string | number | ReadonlyArray<string | number>;
  color?: string;
};

function formatTooltipDisplay(name: string | undefined, value: unknown): string {
  if (typeof value !== "number") return String(value ?? "");
  const n = (name ?? "").toLowerCase();
  const asPercent =
    n.includes("rate") ||
    n.includes("accuracy") ||
    n.includes("auc") ||
    n.includes("importance") ||
    n.includes("precision") ||
    n.includes("recall") ||
    n.includes("f1") ||
    n.includes("(class");
  return asPercent ? `${value}%` : String(value);
}

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
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      padding: "10px 14px",
      borderRadius: 8,
      fontSize: 13,
      color: "var(--foreground)",
      fontFamily: FONT_MONO,
    }}>
      <div style={{ color: CHART_COLORS.primary, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--foreground)" }}>
          {p.name}: <span style={{ fontWeight: 600 }}>{formatTooltipDisplay(p.name, p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export const workPageSections = [
  { id: "telco-kpis", label: "Overview" },
  { id: "telco-business", label: "Business problem" },
  { id: "telco-cleaning", label: "Data cleaning" },
  { id: "telco-eda", label: "EDA" },
  { id: "telco-features", label: "Features" },
  { id: "telco-models", label: "Models" },
  { id: "telco-importance", label: "Importance" },
  { id: "telco-tuning", label: "Tuning" },
  { id: "telco-evaluation", label: "Evaluation" },
  { id: "telco-next", label: "Next steps" },
] as const;

export default function TelcoChurnReport(props: WorkPageProps) {
  const [activeTab, setActiveTab] = useState<"accuracy" | "auc">("accuracy");

  return (
    <WorkReportShell {...props}>
      <div style={{ color: "var(--foreground)", fontFamily: FONT_SANS, textAlign: "left" }}>
        {/* ── HERO ── */}
        <div style={{
          borderBottom: "1px solid var(--border)",
          padding: "72px 0 56px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: 0.3,
          }} />
          <div style={{
            position: "absolute",
            top: "-20%",
            left: "60%",
            width: 600,
            height: 600,
            background: "radial-gradient(ellipse, rgb(245, 158, 11 / 0.08) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>
                Machine Learning · Customer Analytics · Binary Classification
              </span>
              <Tag color={CHART_COLORS.success}>Complete</Tag>
            </div>

            <h1 style={{
              fontFamily: FONT_SANS,
              fontSize: "clamp(36px, 5vw, 62px)",
              fontWeight: 700,
              margin: "0 0 16px",
              lineHeight: 1.15,
              color: "var(--foreground)",
              letterSpacing: -0.02,
            }}>
              Telco Customer<br />
              <span style={{ color: CHART_COLORS.primary }}>Churn Prediction</span>
            </h1>

            <Body style={{ maxWidth: 660, marginBottom: 24, color: "var(--foreground)" }}>
              A telecom company's most expensive problem isn't acquiring customers. It's silently losing them. I built a churn prediction system across 7,032 subscribers to answer: who is at risk, why they're leaving, and which levers retain them.
            </Body>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {props.entry.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
          {/* ══ 01 OVERVIEW ══ */}
          <div id="telco-kpis" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="Overview" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              A binary classification model trained on 7,032 telecom subscribers to predict which customers are at risk of churning. The dataset includes 19 features spanning demographics, service usage, billing, and contract details. The final Gradient Boosting model achieves 79.4% accuracy and 83.6% ROC-AUC on the held-out test set.
            </Body>

            <Notice color={CHART_COLORS.primary} icon="★">
              The core challenge: balancing precision and recall. High recall catches more churners but generates false alarms. High precision reduces wasted outreach but misses at-risk customers. The tuned model targets 65% precision and 48% recall—a practical trade-off for a retention team with limited capacity.
            </Notice>
          </div>

          {/* ══ 02 BUSINESS PROBLEM ══ */}
          <div id="telco-business" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="Business Problem" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Telecom companies operate on thin margins. Customer acquisition cost is high; retention is far cheaper. But retention teams have limited outreach capacity. They can't contact every customer. So the question becomes: which customers should they prioritize?
            </Body>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
              marginBottom: 32,
            }}>
              <div style={{
                padding: 20,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: CHART_COLORS.primary, marginBottom: 8 }}>Baseline churn rate</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>27% of the 7,032 customers in the dataset churned within the observation window. That's 1,869 lost customers. The company needs to know who's likely to leave.</Body>
              </div>

              <div style={{
                padding: 20,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: CHART_COLORS.primary, marginBottom: 8 }}>Limited retention budget</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>The retention team can realistically contact 500–600 customers per month. That's 7–8% of the customer base. They need a ranked list of who to prioritize.</Body>
              </div>

              <div style={{
                padding: 20,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: CHART_COLORS.primary, marginBottom: 8 }}>False alarms are expensive</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Contacting a customer who wasn't leaving wastes budget and risks annoying them. A model with high precision (few false positives) is more operationally useful than one with high recall.</Body>
              </div>
            </div>
          </div>

          {/* ══ 03 EDA ══ */}
          <div id="telco-eda" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Exploratory Data Analysis" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Before building any model, I explored the data to understand which features correlate with churn. Three patterns emerged immediately: tenure, monthly charges, and payment method.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                  Chart 1: Churn rate by tenure
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={tenureChurn}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="group" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 60]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn rate %" radius={[4, 4, 0, 0]}>
                      {tenureChurn.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, color: "var(--foreground)", marginTop: 12 }}>
                  New customers (0–6 months) churn at 53%. By 2 years, the rate drops to 9%. Tenure is the strongest single predictor.
                </Body>
              </div>

              <div style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                  Chart 2: Churn rate by payment method
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={paymentChurn}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="method" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 50]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn rate %" radius={[4, 4, 0, 0]}>
                      {paymentChurn.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, color: "var(--foreground)", marginTop: 12 }}>
                  E-Check payment method shows 45% churn vs 15% for credit card. Suggests friction in the payment experience.
                </Body>
              </div>
            </div>
          </div>

          {/* ══ 04 FEATURES ══ */}
          <div id="telco-features" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Feature Engineering" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              I used 19 features spanning demographics, service adoption, billing, and contract terms. Key engineered features include contract type (categorical), payment method (categorical), and binary flags for internet services.
            </Body>
          </div>

          {/* ══ 05 MODELS ══ */}
          <div id="telco-models" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Model Comparison & Selection" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              I trained five models and evaluated them on a held-out test set. Gradient Boosting emerged as the strongest, balancing precision and recall without overfitting.
            </Body>

            <div style={{
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: 8,
              backgroundColor: "var(--card)",
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                Model comparison (test set)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 0, borderBottom: "1px solid var(--border)" }}>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Model</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Accuracy</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>ROC-AUC</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Precision</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Recall</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>F1-Score</div>
              </div>
              {[
                { name: "KNN", acc: "77.1%", auc: "75.1%", prec: "52%", rec: "61%", f1: "56%", hl: false },
                { name: "SVM", acc: "75.6%", auc: "70.5%", prec: "90%", rec: "9%", f1: "16%", hl: false },
                { name: "Logistic Regression (C=10)", acc: "77.0%", auc: "83.6%", prec: "55%", rec: "73%", f1: "63%", hl: false },
                { name: "Random Forest (500 trees)", acc: "79.3%", auc: "83.5%", prec: "66%", rec: "44%", f1: "53%", hl: false },
                { name: "Gradient Boosting ★", acc: "79.4%", auc: "83.6%", prec: "65%", rec: "48%", f1: "55%", hl: true },
              ].map(({ name, acc, auc, prec, rec, f1, hl }) => (
                <div key={name} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                  padding: "12px 18px",
                  fontSize: 13,
                  color: hl ? CHART_COLORS.primary : "var(--foreground)",
                  background: hl ? "rgba(59, 130, 246, 0.08)" : "transparent",
                  borderBottom: "1px solid var(--border)",
                  fontFamily: hl ? FONT_MONO : "inherit",
                }}>
                  <span>{name}</span>
                  <span>{acc}</span>
                  <span>{auc}</span>
                  <span>{prec}</span>
                  <span>{rec}</span>
                  <span>{f1}</span>
                </div>
              ))}
            </div>

            <Body style={{ color: "var(--foreground)", marginBottom: 12 }}>
              <strong>Why Gradient Boosting:</strong> It achieves the highest accuracy (79.4%) and matches LogReg's ROC-AUC (83.6%). More importantly, its 65% precision means fewer false alarms for the retention team. SVM's 90% precision is misleading—it only catches 9% of churners, making it operationally useless.
            </Body>
          </div>

          {/* ══ 06 FEATURE IMPORTANCE ══ */}
          <div id="telco-importance" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Feature Importance" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              The model learned that financial features dominate: TotalCharges (10.2%), Tenure (9.6%), and MonthlyCharges (8.3%) account for 28% of predictive signal. Contract type and payment method also rank highly, offering actionable levers for retention.
            </Body>

            <div style={{
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: 8,
              backgroundColor: "var(--card)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                Chart 3: Top 10 features by importance %
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={featureImportance} layout="vertical" barCategoryGap="22%">
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="feature" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} width={128} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="importance" name="Importance %" radius={[0, 5, 5, 0]}>
                    {featureImportance.map((d, i) => (
                      <Cell key={i} fill={d.importance > 8 ? CHART_COLORS.primary : d.importance > 4 ? CHART_COLORS.warning : CHART_COLORS.secondary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ══ 07 TUNING ══ */}
          <div id="telco-tuning" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={7} title="Hyperparameter Tuning" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              I ran GridSearchCV with 3-fold cross-validation across 32 parameter combinations. The tuned model achieved 80.1% CV accuracy and 79.4% test accuracy—a 0.7% generalization gap indicating healthy performance without overfitting.
            </Body>
          </div>

          {/* ══ 08 EVALUATION ══ */}
          <div id="telco-evaluation" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={8} title="Final Evaluation" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              On the held-out test set (2,110 subscribers: 1,549 retained, 561 churners), the model achieves 65% precision and 48% recall on churners. This means: of the customers flagged as at-risk, 65% actually churn. Of the customers who actually churn, the model catches 48%.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                  Chart 4: Precision, Recall & F1-Score by class
                </div>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={classReport} barCategoryGap="30%">
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
                    <Bar dataKey="churned" name="Churned (class 1)" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="retained" name="Retained (class 0)" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                  Confusion Matrix (test set, n=2,110)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "True Negatives", value: CM.TN, color: CHART_COLORS.secondary },
                    { label: "False Positives", value: CM.FP, color: CHART_COLORS.warning },
                    { label: "False Negatives", value: CM.FN, color: CHART_COLORS.warning },
                    { label: "True Positives", value: CM.TP, color: CHART_COLORS.danger },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{
                      background: "var(--muted)",
                      borderRadius: 8,
                      padding: "12px 16px",
                      borderTop: `2px solid ${color}`,
                    }}>
                      <div style={{ fontSize: 20, color, fontWeight: 700 }}>{value.toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: "var(--foreground)", marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══ 09 NEXT STEPS ══ */}
          <div id="telco-next" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={9} title="Next Steps" />
            <Body style={{ color: "var(--foreground)", marginBottom: 24 }}>
              The model is production-ready. Immediate next steps:
            </Body>
            <ul style={{ listStyle: "disc", paddingLeft: 20, color: "var(--muted-foreground)", lineHeight: 1.8 }}>
              <li>Deploy the model as a scoring service to rank customers by churn risk.</li>
              <li>Integrate with the retention team's CRM to surface at-risk customers automatically.</li>
              <li>A/B test retention interventions (contract incentives, payment method migration) on flagged customers.</li>
              <li>Monitor model performance monthly and retrain quarterly as customer behavior evolves.</li>
            </ul>
          </div>
        </div>
      </div>
    </WorkReportShell>
  );
}
