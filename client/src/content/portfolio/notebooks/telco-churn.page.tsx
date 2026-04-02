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
  { group: "0 to 6 mo",   rate: 53.3, fill: CHART_COLORS.danger },
  { group: "7 to 12 mo",  rate: 35.9, fill: CHART_COLORS.warning },
  { group: "13 to 24 mo", rate: 28.7, fill: CHART_COLORS.warning },
  { group: "25 to 48 mo", rate: 20.4, fill: CHART_COLORS.secondary },
  { group: "49 to 72 mo", rate: 9.5,  fill: CHART_COLORS.secondary },
];

const paymentChurn = [
  { method: "E Check",       rate: 45.3, fill: CHART_COLORS.danger },
  { method: "Mailed check",  rate: 19.2, fill: CHART_COLORS.warning },
  { method: "Bank transfer", rate: 16.7, fill: CHART_COLORS.secondary },
  { method: "Credit card",   rate: 15.3, fill: CHART_COLORS.secondary },
];

const featureImportance = [
  { feature: "Paperless Billing", importance: 1.71 },
  { feature: "Contract 1yr",   importance: 1.79 },
  { feature: "Online Security",   importance: 2.14 },
  { feature: "E Check Payment",  importance: 2.14 },
  { feature: "Contract 2yr",   importance: 2.16 },
  { feature: "Tech Support",      importance: 2.18 },
  { feature: "Fiber Optic",      importance: 2.63 },
  { feature: "Monthly Charges",   importance: 8.33 },
  { feature: "Tenure",           importance: 9.60 },
  { feature: "Total Charges",     importance: 10.24 },
];

const classReport = [
  { label: "Precision", churned: 65, retained: 83 },
  { label: "Recall",    churned: 48, retained: 91 },
  { label: "F1 Score",  churned: 55, retained: 87 },
];

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
  { id: "telco-overview", label: "Overview" },
  { id: "telco-problem", label: "Problem Statement" },
  { id: "telco-insights", label: "Data Insights" },
  { id: "telco-features", label: "Key Drivers" },
  { id: "telco-models", label: "Model Selection" },
  { id: "telco-evaluation", label: "Evaluation Results" },
  { id: "telco-conclusions", label: "Conclusions and Future Work" },
] as const;

export default function TelcoChurnAnalysis(props: WorkPageProps) {
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
                Machine Learning · Customer Analytics · Predictive Modeling
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
              <span style={{ color: CHART_COLORS.primary }}>Churn Prediction Analysis</span>
            </h1>

            <Body style={{ maxWidth: 660, marginBottom: 24, color: "var(--foreground)" }}>
              This study explores the Telco Customer Churn dataset from Kaggle, focusing on identifying patterns and developing predictive models for customer attrition. The analysis encompasses data exploration, feature importance, and model evaluation.
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
          <div id="telco-overview" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="Overview" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              This project utilizes machine learning to predict customer churn within a telecom dataset. By analyzing 19 distinct features, a Gradient Boosting model was developed, achieving an accuracy of 79.4%. The objective was to understand the factors contributing to customer attrition and assess the predictive performance of various models.
            </Body>

            <Notice color={CHART_COLORS.primary} icon="★">
              A key aspect of this study involved balancing precision and recall to effectively characterize the churn phenomenon within the dataset.
            </Notice>
          </div>

          {/* ══ 02 PROBLEM STATEMENT ══ */}
          <div id="telco-problem" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="Problem Statement" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Customer churn presents a significant challenge in competitive markets. This analysis investigates the underlying factors and predictive capabilities of machine learning models to identify patterns associated with customer attrition in the provided dataset.
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
                <div style={{ fontSize: 13, fontWeight: 600, color: CHART_COLORS.primary, marginBottom: 8 }}>Churn Rate Observation</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Approximately 27% of customers in this dataset exhibited churn behavior, representing 1,869 instances available for predictive analysis.</Body>
              </div>

              <div style={{
                padding: 20,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: CHART_COLORS.primary, marginBottom: 8 }}>Predictive Model Utility</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Developing a model capable of identifying customers with a high propensity to churn enables a deeper understanding of the factors involved.</Body>
              </div>

              <div style={{
                padding: 20,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: CHART_COLORS.primary, marginBottom: 8 }}>Evaluation Metric Focus</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>A model with high precision is crucial for ensuring that identified churn risks are genuinely indicative of attrition, thereby maximizing the interpretability of the results.</Body>
              </div>
            </div>
          </div>

          {/* ══ 03 DATA INSIGHTS ══ */}
          <div id="telco-insights" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Data Insights" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Initial data exploration revealed distinct patterns related to customer tenure, payment methods, and monthly charges. These factors emerged as significant indicators within the dataset.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                  Chart 1: Churn Rate by Tenure Group
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={tenureChurn}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="group" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 60]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[4, 4, 0, 0]}>
                      {tenureChurn.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, color: "var(--foreground)", marginTop: 12 }}>
                  Customers in their initial 6 months of service exhibit the highest churn rate at 53%, indicating a strong correlation between early tenure and attrition, while long-term customers demonstrate greater stability.
                </Body>
              </div>

              <div style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: 8,
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                  Chart 2: Churn Rate by Payment Method
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={paymentChurn}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="method" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 50]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[4, 4, 0, 0]}>
                      {paymentChurn.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, color: "var(--foreground)", marginTop: 12 }}>
                  A churn rate of 45% among customers using Electronic Checks suggests a notable association between this payment method and customer attrition.
                </Body>
              </div>
            </div>
          </div>

          {/* ══ 04 KEY DRIVERS ══ */}
          <div id="telco-features" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Key Drivers of Churn" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              The predictive model identified financial metrics and contract terms as the most influential features in determining customer churn. Specifically, total charges and tenure collectively contributed nearly 20% to the model's decision-making process.
            </Body>

            <div style={{
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: 8,
              backgroundColor: "var(--card)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                Chart 3: Top 10 Features by Importance
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={featureImportance} layout="vertical" barCategoryGap="22%">
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="feature" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} width={128} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="importance" name="Importance" radius={[0, 5, 5, 0]}>
                    {featureImportance.map((d, i) => (
                      <Cell key={i} fill={d.importance > 8 ? CHART_COLORS.primary : d.importance > 4 ? CHART_COLORS.warning : CHART_COLORS.secondary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ══ 05 MODEL SELECTION ══ */}
          <div id="telco-models" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Model Selection" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Five different machine learning algorithms were evaluated to determine the most suitable predictive model. Gradient Boosting demonstrated the most balanced performance, achieving an accuracy of 79.4% while maintaining a robust precision, indicating its effectiveness in identifying churn instances.
            </Body>

            <div style={{
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: 8,
              backgroundColor: "var(--card)",
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                Algorithm Performance Comparison
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 0, borderBottom: "1px solid var(--border)" }}>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Model</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Accuracy</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Precision</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Recall</div>
              </div>
              {[
                { name: "KNN", acc: "77.1%", prec: "52%", rec: "61%", hl: false },
                { name: "SVM", acc: "75.6%", prec: "90%", rec: "9%", hl: false },
                { name: "Logistic Regression", acc: "77.0%", prec: "55%", rec: "73%", hl: false },
                { name: "Random Forest", acc: "79.3%", prec: "66%", rec: "44%", hl: false },
                { name: "Gradient Boosting ★", acc: "79.4%", prec: "65%", rec: "48%", hl: true },
              ].map(({ name, acc, prec, rec, hl }) => (
                <div key={name} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  padding: "12px 18px",
                  fontSize: 13,
                  color: hl ? CHART_COLORS.primary : "var(--foreground)",
                  background: hl ? "rgba(99, 102, 241, 0.08)" : "transparent",
                  borderBottom: "1px solid var(--border)",
                  fontFamily: hl ? FONT_MONO : "inherit",
                }}>
                  <span>{name}</span>
                  <span>{acc}</span>
                  <span>{prec}</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ 06 EVALUATION RESULTS ══ */}
          <div id="telco-evaluation" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Evaluation Results" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              The final Gradient Boosting model was evaluated on an independent test set of 2,110 subscribers. It achieved a recall of 48%, successfully identifying nearly half of all churn instances, and maintained a precision of 65%. This indicates that for every 100 predictions of churn, 65 were accurate.
            </Body>

            <div style={{
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: 8,
              backgroundColor: "var(--card)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                Precision and Recall by Class
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={classReport} barCategoryGap="30%">
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="churned" name="Churned" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="retained" name="Retained" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20, fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ══ 07 CONCLUSIONS AND FUTURE WORK ══ */}
          <div id="telco-conclusions" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={7} title="Conclusions and Future Work" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              This analysis provides a comprehensive understanding of subscriber behavior within the Telco Churn dataset. By examining usage patterns and contract terms, valuable insights into factors influencing customer loyalty were obtained.
            </Body>
            <ul style={{ listStyle: "disc", paddingLeft: 20, color: "var(--muted-foreground)", lineHeight: 1.8 }}>
              <li>Further investigation into the characteristics of high-risk subscriber segments.</li>
              <li>Exploration of alternative feature engineering techniques to enhance predictive power.</li>
              <li>Integration of advanced explainability methods to interpret individual predictions.</li>
            </ul>
          </div>
        </div>
      </div>
    </WorkReportShell>
  );
}
