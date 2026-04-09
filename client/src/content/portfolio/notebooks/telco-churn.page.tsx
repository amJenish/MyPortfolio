// @refresh reset
import { type ReactNode } from "react";
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

// ── CHART COLORS ───────────────────────────────────────────────────────────

const CHART_COLORS = {
  primary:   "#6366f1",
  success:   "#22c55e",
  warning:   "#f59e0b",
  danger:    "#ef4444",
  secondary: "#06b6d4",
  purple:    "#a855f7",
};

// ── DATA ───────────────────────────────────────────────────────────────────

const tenureChurn = [
  { group: "0 to 6 mo",   rate: 53.3, fill: CHART_COLORS.danger },
  { group: "7 to 12 mo",  rate: 35.9, fill: CHART_COLORS.warning },
  { group: "13 to 24 mo", rate: 28.7, fill: CHART_COLORS.warning },
  { group: "25 to 48 mo", rate: 20.4, fill: CHART_COLORS.secondary },
  { group: "49 to 72 mo", rate: 9.5,  fill: CHART_COLORS.secondary },
];

const paymentChurn = [
  { method: "E Check",        rate: 45.3, fill: CHART_COLORS.danger },
  { method: "Mailed check",   rate: 19.2, fill: CHART_COLORS.warning },
  { method: "Bank transfer",  rate: 16.7, fill: CHART_COLORS.secondary },
  { method: "Credit card",    rate: 15.3, fill: CHART_COLORS.secondary },
];

const contractChurn = [
  { type: "Month to month", rate: 42.7, fill: CHART_COLORS.danger },
  { type: "One year",       rate: 11.3, fill: CHART_COLORS.warning },
  { type: "Two year",       rate: 2.8,  fill: CHART_COLORS.secondary },
];

const internetChurn = [
  { type: "Fiber optic", rate: 41.9, fill: CHART_COLORS.danger },
  { type: "DSL",         rate: 19.0, fill: CHART_COLORS.warning },
  { type: "No service",  rate: 7.4,  fill: CHART_COLORS.secondary },
];

const demographicChurn = [
  { segment: "Senior citizen",  rate: 41.7, fill: CHART_COLORS.danger },
  { segment: "No partner",      rate: 33.0, fill: CHART_COLORS.warning },
  { segment: "No dependents",   rate: 31.3, fill: CHART_COLORS.warning },
  { segment: "Non senior",      rate: 23.6, fill: CHART_COLORS.secondary },
  { segment: "Has partner",     rate: 19.7, fill: CHART_COLORS.secondary },
  { segment: "Has dependents",  rate: 15.5, fill: CHART_COLORS.secondary },
];

const serviceChurn = [
  { service: "No online security",  rate: 41.8, fill: CHART_COLORS.danger },
  { service: "No tech support",     rate: 41.7, fill: CHART_COLORS.danger },
  { service: "Paperless billing",   rate: 33.6, fill: CHART_COLORS.warning },
  { service: "Has tech support",    rate: 15.2, fill: CHART_COLORS.secondary },
  { service: "Has online security", rate: 14.6, fill: CHART_COLORS.secondary },
  { service: "Paper billing",       rate: 16.4, fill: CHART_COLORS.secondary },
];

const monthlyChargesData = [
  { group: "< $35",      churned: 9.2,  retained: 90.8 },
  { group: "$35 to $55", churned: 16.4, retained: 83.6 },
  { group: "$55 to $75", churned: 28.1, retained: 71.9 },
  { group: "$75 to $95", churned: 34.7, retained: 65.3 },
  { group: "> $95",      churned: 38.5, retained: 61.5 },
];

const featureImportance = [
  { feature: "Paperless Billing", importance: 1.71 },
  { feature: "Contract 1yr",      importance: 1.79 },
  { feature: "Online Security",   importance: 2.14 },
  { feature: "E Check Payment",   importance: 2.14 },
  { feature: "Contract 2yr",      importance: 2.16 },
  { feature: "Tech Support",      importance: 2.18 },
  { feature: "Fiber Optic",       importance: 2.63 },
  { feature: "Monthly Charges",   importance: 8.33 },
  { feature: "Tenure",            importance: 9.60 },
  { feature: "Total Charges",     importance: 10.24 },
];

const modelComparison = [
  { name: "SVM",                acc: "75.6%", prec: "90%", rec: "9%",  f1: "17%", hl: false },
  { name: "KNN",                acc: "76.9%", prec: "61%", rec: "37%", f1: "46%", hl: false },
  { name: "Logistic Reg.",      acc: "77.0%", prec: "55%", rec: "73%", f1: "63%", hl: false },
  { name: "XGBoost",            acc: "77.0%", prec: "59%", rec: "50%", f1: "54%", hl: false },
  { name: "Random Forest",      acc: "79.3%", prec: "66%", rec: "44%", f1: "53%", hl: false },
  { name: "Grad. Boosting",     acc: "80.3%", prec: "67%", rec: "51%", f1: "58%", hl: false },
  { name: "Hist GBM t=0.35 ★", acc: "66.0%", prec: "44%", rec: "90%", f1: "59%", hl: true  },
];

const modelRecallData = [
  { model: "SVM",               recall: 9,  fill: "#94a3b8" },
  { model: "Log. Regression",   recall: 73, fill: "#94a3b8" },
  { model: "KNN",               recall: 37, fill: "#94a3b8" },
  { model: "XGBoost",           recall: 50, fill: "#94a3b8" },
  { model: "Random Forest",     recall: 44, fill: "#94a3b8" },
  { model: "Grad. Boosting",    recall: 51, fill: CHART_COLORS.warning },
  { model: "Hist GBM (t=0.35)", recall: 90, fill: CHART_COLORS.primary },
];

const confusionMatrix = [
  { label: "True Positive",  value: 504, sub: "Correctly predicted churn",    fill: CHART_COLORS.success },
  { label: "False Positive", value: 653, sub: "Incorrectly flagged as churn", fill: CHART_COLORS.warning },
  { label: "False Negative", value: 57,  sub: "Missed churn cases",           fill: CHART_COLORS.danger },
  { label: "True Negative",  value: 896, sub: "Correctly predicted retained", fill: CHART_COLORS.secondary },
];

const classReport = [
  { label: "Precision", churned: 44, retained: 94 },
  { label: "Recall",    churned: 90, retained: 58 },
  { label: "F1 Score",  churned: 59, retained: 72 },
];

const hyperparamResults = [
  { params: "lr=0.05, depth=3", cv: 61.2, test: 59.8 },
  { params: "lr=0.05, depth=5", cv: 60.8, test: 59.1 },
  { params: "lr=0.10, depth=3", cv: 60.5, test: 58.7 },
  { params: "lr=0.10, depth=5", cv: 60.1, test: 58.3 },
];

const engineeredFeatures = [
  { name: "charge_ratio",            desc: "TotalCharges / (MonthlyCharges + 1), normalized lifetime value" },
  { name: "AvgAmtPaidOverall",       desc: "TotalCharges / tenure, average monthly spend over customer lifetime" },
  { name: "short_tenure",            desc: "Binary flag: tenure < 12 months" },
  { name: "fiber_no_security",       desc: "Fiber optic subscriber with no online security" },
  { name: "no_support_services",     desc: "No tech support AND no online security" },
  { name: "risk_score",              desc: "Sum of 9 independent risk indicators" },
  { name: "senior_month_to_month",   desc: "Senior citizen on a month to month contract" },
  { name: "high_charge_no_contract", desc: "Top quartile monthly charges on month to month" },
];

// ── TOOLTIP ────────────────────────────────────────────────────────────────

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
      {payload.map((p, i) => {
        const val = typeof p.value === "number" ? `${p.value}%` : String(p.value ?? "");
        return (
          <div key={i} style={{ color: p.color ?? "var(--foreground)" }}>
            {p.name}: <span style={{ fontWeight: 600 }}>{val}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── LOCAL PRIMITIVES ───────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>{title}</div>
      {subtitle
        ? <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 16 }}>{subtitle}</div>
        : <div style={{ marginBottom: 16 }} />
      }
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: "20px 24px", border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
      <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: FONT_MONO, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color ?? CHART_COLORS.primary, fontFamily: FONT_MONO, lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{sub}</div>}
    </div>
  );
}

// ── PAGE SECTIONS ──────────────────────────────────────────────────────────

export const workPageSections = [
  { id: "telco-overview",    label: "Overview" },
  { id: "telco-dataset",     label: "Dataset & Cleaning" },
  { id: "telco-eda",         label: "Exploratory Analysis" },
  { id: "telco-notes",       label: "Analytical Notes" },
  { id: "telco-features",    label: "Feature Engineering" },
  { id: "telco-models",      label: "Model Selection" },
  { id: "telco-tuning",      label: "Hyperparameter Tuning" },
  { id: "telco-evaluation",  label: "Evaluation Results" },
  { id: "telco-conclusions", label: "Conclusions" },
] as const;

// ── PAGE ───────────────────────────────────────────────────────────────────

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
            position: "absolute", inset: 0,
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "48px 48px", opacity: 0.3,
          }} />
          <div style={{
            position: "absolute", top: "-20%", left: "60%",
            width: 600, height: 600,
            background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 65%)",
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

            <Body style={{ maxWidth: 660, marginBottom: 24 }}>
              In this project I explore the Telco Customer Churn dataset from Kaggle, working through
              the full analytical pipeline: data cleaning, exploratory analysis, feature engineering,
              model selection, hyperparameter tuning, and final evaluation.
            </Body>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {props.entry.tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>

          {/* ══ 01 OVERVIEW ══ */}
          <div id="telco-overview" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="Overview" />
            <Body>
              In this project I built a machine learning pipeline to predict customer churn
              within a telecommunications dataset. I worked under the assumption that the cost
              of reaching out to flagged customers would be low — something along the lines of
              an email or a small discount offer. Given that framing, catching as many real
              churners as possible mattered more than raw accuracy, since missing a churner
              carries more cost than unnecessarily contacting a loyal customer.
            </Body>
            <Body>
              Working across 7,032 cleaned records and 21 original features, I settled on a
              Hist Gradient Boosting classifier with class balancing and a tuned decision
              threshold of 0.35 as the final model. It catches 90% of real churners, which
              under those assumptions is the metric that matters most.
            </Body>
            <Notice color={CHART_COLORS.primary} icon="★">
              I intentionally optimised for recall over precision, based on the assumption
              that the cost of outreach is low. The final model flags more customers than
              will actually churn, but when the downside of a false positive is just an
              unnecessary email, that is an acceptable tradeoff to catch 9 out of 10
              genuine churn cases.
            </Notice>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              <StatCard label="Total Records" value="7,032" sub="after cleaning" />
              <StatCard label="Features" value="21" sub="original columns" color={CHART_COLORS.secondary} />
              <StatCard label="Churn Rate" value="26.5%" sub="1,869 churned customers" color={CHART_COLORS.danger} />
              <StatCard label="Churn Recall" value="90%" sub="Hist GBM, threshold 0.35" color={CHART_COLORS.success} />
              <StatCard label="Models Tested" value="7" sub="including XGBoost" color={CHART_COLORS.warning} />
            </div>
          </div>

          {/* ══ 02 DATASET & CLEANING ══ */}
          <div id="telco-dataset" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="Dataset Structure and Cleaning" />
            <Body>
              The raw dataset contains 7,043 records with 21 columns spanning demographic
              attributes, service subscriptions, contract terms, billing details, and a binary
              churn label. A data quality check revealed that <Code>TotalCharges</Code> was ingested
              as an object column rather than a numeric type. Eleven records with blank strings were
              dropped — each had zero tenure and no churn, making them uninformative. A consistency
              audit confirmed that all internet dependent service flags resolve
              to <Code>"No internet service"</Code> whenever <Code>InternetService</Code> is set to
              No, with no contradictions across fields.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                {
                  title: "Null Handling",
                  body: "Eleven rows with blank TotalCharges values were identified using a regex replacement pass before casting to float. All had zero tenure and no churn.",
                },
                {
                  title: "TotalCharges Discrepancy",
                  body: "2,323 mismatches exceeding a $50 tolerance between TotalCharges and tenure × MonthlyCharges — likely mid-cycle plan changes or promotions recorded in billing history.",
                },
                {
                  title: "Consistency Checks",
                  body: "All six internet dependent feature columns were verified against the parent InternetService column. No inconsistencies surfaced across the audit.",
                },
              ].map((card) => (
                <div key={card.title} style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: CHART_COLORS.primary, marginBottom: 8 }}>{card.title}</div>
                  <Body style={{ fontSize: 13 }}>{card.body}</Body>
                </div>
              ))}
            </div>
          </div>

          {/* ══ 03 EDA ══ */}
          <div id="telco-eda" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Exploratory Data Analysis" />
            <Body>
              Several categorical variables showed strong associations with churn, while continuous
              features like monthly charges and tenure displayed meaningful distributional shifts
              between the two groups.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 1: Churn Rate by Tenure Group" subtitle="New customers churn at a dramatically elevated rate">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={tenureChurn}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="group" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 60]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[4, 4, 0, 0]}>
                      {tenureChurn.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Customers in their first six months churn at 53.3%, more than five times the rate of customers beyond four years. Retention risk decays sharply after the first year.
                </Body>
              </ChartCard>

              <ChartCard title="Chart 2: Churn Rate by Payment Method" subtitle="Electronic check users churn at nearly triple the rate of card payers">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={paymentChurn}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="method" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 50]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[4, 4, 0, 0]}>
                      {paymentChurn.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Electronic check payers churn at 45.3%, roughly 2.4× higher than automatic payment options. They are also disproportionately represented among senior citizens.
                </Body>
              </ChartCard>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 3: Churn Rate by Contract Type" subtitle="Commitment level is inversely proportional to attrition">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={contractChurn}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="type" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 50]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[4, 4, 0, 0]}>
                      {contractChurn.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Month to month customers churn at 42.7% vs 2.8% on two year contracts. Over half the dataset (55%) is on month to month plans, making contract type one of the most actionable levers.
                </Body>
              </ChartCard>

              <ChartCard title="Chart 4: Churn Rate by Internet Service Type" subtitle="Fiber optic subscribers display a notably elevated churn signal">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={internetChurn}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="type" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 50]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[4, 4, 0, 0]}>
                      {internetChurn.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Fiber optic customers churn at 41.9%, more than double the DSL rate. The pattern likely reflects a competitive fiber market and higher price points attracting customers who are price sensitive.
                </Body>
              </ChartCard>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 5: Churn Rate by Demographic Segment" subtitle="Household structure and age carry measurable retention implications">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={demographicChurn} layout="vertical">
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 50]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="segment" width={140} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[0, 4, 4, 0]}>
                      {demographicChurn.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Senior citizens churn at 41.7% despite representing only 16.2% of the dataset. Customers without a partner or dependents churn at rates above 30%.
                </Body>
              </ChartCard>

              <ChartCard title="Chart 6: Churn Rate by Service Addons" subtitle="Security and support subscriptions are strongly associated with retention">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={serviceChurn} layout="vertical">
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 50]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="service" width={160} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[0, 4, 4, 0]}>
                      {serviceChurn.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Customers lacking online security or tech support churn at rates near 42%. Subscribers to these additional services churn at roughly one third that rate.
                </Body>
              </ChartCard>
            </div>

            <ChartCard title="Chart 7: Churn Composition by Monthly Charge Band" subtitle="Higher spend customers defect at elevated rates, compounding revenue impact">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyChargesData}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="group" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="retained" name="Retained %" stackId="a" fill={CHART_COLORS.success} />
                  <Bar dataKey="churned" name="Churned %" stackId="a" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
              <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                Churn rises monotonically with monthly spend. The mean monthly charge for churned customers ($74.44) is $13.14 higher than for retained customers ($61.31).
              </Body>
            </ChartCard>
          </div>

          {/* ══ 04 ANALYTICAL NOTES ══ */}
          <div id="telco-notes" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Analytical Notes" />
            <Body>
              Several patterns are orthogonal and reinforce each other. Fiber optic internet, high
              monthly charges, and month to month contracts frequently co-occur among churned customers.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {[
                { icon: "○", color: "var(--muted-foreground)", text: "Gender shows no meaningful difference in churn rate across the dataset." },
                { icon: "▲", color: CHART_COLORS.danger,       text: "New customers under 12 months are the highest risk segment for early churn." },
                { icon: "▲", color: CHART_COLORS.danger,       text: "Higher monthly charges are consistently associated with greater attrition." },
                { icon: "▲", color: CHART_COLORS.danger,       text: "Month to month contract holders represent the majority of churned customers." },
                { icon: "▲", color: CHART_COLORS.danger,       text: "Electronic check payment is strongly linked to churn, partially confounded by senior citizen demographics." },
                { icon: "▲", color: CHART_COLORS.danger,       text: "Fiber optic subscribers churn noticeably more often than DSL or no internet customers." },
                { icon: "▼", color: CHART_COLORS.success,      text: "Customers with dependents are substantially less likely to churn." },
                { icon: "▼", color: CHART_COLORS.success,      text: "Having a partner correlates with higher retention rates." },
                { icon: "▲", color: CHART_COLORS.warning,      text: "Senior citizens churn at disproportionately high rates relative to their share of the customer base." },
                { icon: "▼", color: CHART_COLORS.success,      text: "Online security subscribers exhibit roughly one third the churn rate of those without it." },
                { icon: "▲", color: CHART_COLORS.warning,      text: "Paperless billing customers are more likely to churn, possibly a proxy for users who actively compare prices." },
                { icon: "▼", color: CHART_COLORS.success,      text: "Technical support subscribers display substantially better retention, similar to online security." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "14px 16px", border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)", display: "flex", gap: 10 }}>
                  <span style={{ color: item.color, fontSize: 16, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <Body style={{ fontSize: 13, margin: 0 }}>{item.text}</Body>
                </div>
              ))}
            </div>
          </div>

          {/* ══ 05 FEATURE ENGINEERING ══ */}
          <div id="telco-features" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Feature Engineering" />
            <Body>
              Categorical variables were binary encoded, ordinal contract terms were mapped to integers,
              and eight composite features were derived to capture interaction effects identified during exploration.
            </Body>

            <div style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>Engineered Features</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>Feature Name</div>
                <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>Description</div>
                {engineeredFeatures.map((f) => (
                  <div key={f.name} style={{ display: "contents" }}>
                    <div style={{ padding: "10px 12px", fontSize: 12, fontFamily: FONT_MONO, color: CHART_COLORS.primary, borderBottom: "1px solid var(--border)" }}>{f.name}</div>
                    <div style={{ padding: "10px 12px", fontSize: 13, color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <Notice color={CHART_COLORS.warning} icon="◈">
              The <Code>risk_score</Code> feature aggregates nine binary risk indicators
              (senior citizen status, high monthly charges, short tenure, month to month contract,
              fiber without security, no support services, paperless billing, electronic check,
              and extra internet addons) into a single composite score.
            </Notice>

            <ChartCard title="Chart 8: Top 10 Features by Importance (Random Forest Baseline)" subtitle="Financial history and tenure dominate; contract and security add meaningful signal">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={featureImportance} layout="vertical" barCategoryGap="22%">
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="feature" width={128} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="importance" name="Importance" radius={[0, 5, 5, 0]}>
                    {featureImportance.map((d, i) => (
                      <Cell key={i} fill={d.importance > 8 ? CHART_COLORS.primary : d.importance > 4 ? CHART_COLORS.warning : CHART_COLORS.secondary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                Total charges, tenure, and monthly charges collectively account for nearly 28% of model importance. A three feature ablation using only these variables achieved 75.6% accuracy.
              </Body>
            </ChartCard>
          </div>

          {/* ══ 06 MODEL SELECTION ══ */}
          <div id="telco-models" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Model Selection" />
            <Body>
              Seven algorithm configurations were evaluated on a consistent 70/30 train test split.
              Standard Gradient Boosting produced the highest raw accuracy at 80.3% but only caught
              51% of actual churners. Hist Gradient Boosting with class balancing and a 0.35 decision
              threshold pushed churn recall to 90%.
            </Body>

            <ChartCard title="Chart 9: Churn Recall Comparison Across Models" subtitle="The shift from accuracy to recall optimisation is visible in the final model">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={modelRecallData} barCategoryGap="30%">
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="model" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="recall" name="Churn Recall" radius={[4, 4, 0, 0]}>
                    {modelRecallData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <div style={{ marginTop: 20, padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>Full Algorithm Comparison</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid var(--border)" }}>
                {["Model", "Accuracy", "Precision", "Recall", "F1 (Churn)"].map(h => (
                  <div key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)" }}>{h}</div>
                ))}
              </div>
              {modelComparison.map(({ name, acc, prec, rec, f1, hl }) => (
                <div key={name} style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                  fontSize: 13, padding: "10px 14px",
                  color: hl ? CHART_COLORS.primary : "var(--foreground)",
                  background: hl ? "rgba(99,102,241,0.08)" : "transparent",
                  borderBottom: "1px solid var(--border)",
                  fontFamily: hl ? FONT_MONO : "inherit",
                }}>
                  <span>{name}</span><span>{acc}</span><span>{prec}</span><span>{rec}</span><span>{f1}</span>
                </div>
              ))}
            </div>

            <Notice color={CHART_COLORS.warning} icon="◈">
              The accuracy drop from 80% to 66% is a product of the model flagging customers more
              aggressively. A model that scores 80% accuracy by missing half the churners would be
              less useful given the design decisions made here.
            </Notice>
          </div>

          {/* ══ 07 HYPERPARAMETER TUNING ══ */}
          <div id="telco-tuning" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={7} title="Hyperparameter Tuning" />
            <Body>
              GridSearchCV with 3 fold cross validation was run across 32 parameter combinations,
              scored on churn F1 rather than accuracy. The search space covered learning rate, tree
              depth, minimum samples per leaf, number of iterations, and L2 regularisation.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <ChartCard title="Chart 10: CV vs Test Churn F1 by Config" subtitle="Top 4 configurations, scored on churn F1 not accuracy">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={hyperparamResults} barCategoryGap="25%">
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="params" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[55, 65]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="cv" name="CV Churn F1" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="test" name="Test Churn F1" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 11 }} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <div style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>Selected Hyperparameters</div>
                {([
                  ["learning_rate",     "0.05"],
                  ["max_depth",         "5"],
                  ["min_samples_leaf",  "10"],
                  ["max_iter",          "100"],
                  ["l2_regularization", "0.1"],
                  ["class_weight",      "balanced"],
                  ["threshold",         "0.35"],
                  ["CV Churn F1",       "61.2%"],
                  ["Test Churn F1",     "59.8%"],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                    <Code>{k}</Code>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: CHART_COLORS.primary }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ 08 EVALUATION ══ */}
          <div id="telco-evaluation" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={8} title="Evaluation Results" />
            <Body>
              The final model was evaluated on a held out test set of 2,110 subscribers. Among 561
              actual churners, the model caught 504, giving a recall of 90%. It missed 57 and
              unnecessarily flagged 653 loyal customers — an acceptable cost for the recall it
              produces given the assumptions baked into the design.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 11: Confusion Matrix (2,110 test records)" subtitle="57 missed churners vs 653 unnecessarily flagged loyal customers">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                  {confusionMatrix.map((cell) => (
                    <div key={cell.label} style={{ padding: "20px 16px", borderRadius: 8, border: `1px solid ${cell.fill}44`, background: `${cell.fill}11`, textAlign: "center" }}>
                      <div style={{ fontSize: 32, fontWeight: 700, fontFamily: FONT_MONO, color: cell.fill, lineHeight: 1.1, marginBottom: 6 }}>
                        {cell.value.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>{cell.label}</div>
                      <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{cell.sub}</div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Chart 12: Classification Report by Class" subtitle="Precision, recall, and F1 across both outcome classes">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={classReport} barCategoryGap="30%">
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="churned" name="Churned" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="retained" name="Retained" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <Notice color={CHART_COLORS.warning} icon="◈">
              The wide gap between churned and retained class metrics is intentional. If the
              assumed outreach cost were high, a different threshold or scoring objective
              would have been the right call.
            </Notice>
          </div>

          {/* ══ 09 CONCLUSIONS ══ */}
          <div id="telco-conclusions" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={9} title="Conclusions and Future Work" />
            <Body>
              The final model catches 90% of real churners while missing only 57 out of 561 in the
              test set. Financial engagement metrics like total charges, tenure, and monthly spend
              carried the strongest predictive signal. The shift to Hist Gradient Boosting with class
              balancing and threshold tuning was what ultimately moved recall to a usable level.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {[
                { title: "Threshold Monitoring",      color: CHART_COLORS.primary,   body: "The 0.35 threshold could be re-tested across multiple folds and time splits, which may improve confidence in recall stability and reduce sensitivity to a single test sample." },
                { title: "Advanced Explainability",   color: CHART_COLORS.secondary, body: "SHAP-based explanation layers could be added for prediction level attribution, which would improve trust, auditability, and decision quality in any downstream retention workflow." },
                { title: "Interaction Feature Depth", color: CHART_COLORS.warning,   body: "A broader sweep of two way and three way interaction features could surface compound churn signals missed by individual feature effects." },
                { title: "Segment Level Modeling",    color: CHART_COLORS.purple,    body: "Separate models trained on concentrated risk groups — such as fiber users on month to month contracts — could improve segment level precision while preserving strong recall." },
              ].map((card) => (
                <div key={card.title} style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: card.color, marginBottom: 8 }}>{card.title}</div>
                  <Body style={{ fontSize: 13, margin: 0 }}>{card.body}</Body>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </WorkReportShell>
  );
}