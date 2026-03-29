import { useState, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts";
import { C, FONT_MONO, FONT_SANS } from "./notebookTheme";
import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

const P = {
  ...C,
  accent: C.amber,
  accentDim: "#b8770f",
  teal: C.teal,
  rose: C.red,
  orange: C.amber,
  purple: C.teal,
  muted: C.textDim,
};

// ── DATA ──────────────────────────────────────────────────────────────────────

const tenureChurn = [
  { group: "0–6 mo",   rate: 53.3, fill: C.red },
  { group: "7–12 mo",  rate: 35.9, fill: C.amber },
  { group: "13–24 mo", rate: 28.7, fill: C.amber },
  { group: "25–48 mo", rate: 20.4, fill: C.teal },
  { group: "49–72 mo", rate: 9.5,  fill: C.teal },
];

const paymentChurn = [
  { method: "E-Check",       rate: 45.3, fill: C.red },
  { method: "Mailed check",  rate: 19.2, fill: C.amber },
  { method: "Bank transfer", rate: 16.7, fill: C.teal },
  { method: "Credit card",   rate: 15.3, fill: C.teal },
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

// Confusion matrix derived from classification report on 2,110-row test set.
// Retained (class 0): 1,549 actual. Recall 91% → TN ≈ 1,410, FP ≈ 139.
// Churned  (class 1):   561 actual. Recall 48% → TP ≈   269, FN ≈ 292.
const CM = { TN: 1410, FP: 139, FN: 292, TP: 269 };

// ── SHARED UI ─────────────────────────────────────────────────────────────────

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
    <div style={{ background: P.card, border: `1px solid ${P.border}`, padding: "10px 14px", borderRadius: 8, fontSize: 13, color: P.text, fontFamily: FONT_MONO }}>
      <div style={{ color: P.accent, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || P.text }}>
          {p.name}:{" "}
          <span style={{ fontWeight: 600 }}>{formatTooltipDisplay(p.name, p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function Section({ n, title }: { n: number; title: string }): React.JSX.Element {
  const num = String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, border: `1px solid ${P.accentDim}`, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
        {num}
      </span>
      <h2 style={{ fontFamily: FONT_SANS, fontSize: 24, color: P.text, margin: 0, fontWeight: 700, letterSpacing: -0.5, whiteSpace: "nowrap" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: P.border }} />
    </div>
  );
}

function KPI({ label, value, sub, color }: { label: string; value: ReactNode; sub?: string; color?: string }): React.JSX.Element {
  return (
    <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "20px 24px", flex: 1, borderTop: `3px solid ${color || P.accent}` }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textDim, marginBottom: 8 }}>{label}</div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 36,
          color: color || P.accent,
          fontWeight: 800,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      {sub ? <div style={{ marginTop: 6, fontSize: 12, color: P.textDim, lineHeight: 1.5 }}>{sub}</div> : null}
    </div>
  );
}

function Mono({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <code style={{ fontFamily: FONT_MONO, fontSize: 11.5, background: C.codeBg, color: P.teal, padding: "2px 7px", borderRadius: 4, border: `1px solid ${P.border}` }}>{children}</code>
  );
}

function Callout({ color = P.accent, icon, children }: { color?: string; icon?: ReactNode; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ background: `${color}12`, border: `1px solid ${color}40`, borderRadius: 10, padding: "14px 18px", marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
      {icon ? <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span> : null}
      <div style={{ fontSize: 14, color: P.textDim, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function AnalysisBlock({ heading, children }: { heading?: string; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderLeft: `3px solid ${P.accent}`, borderRadius: "0 10px 10px 0", padding: "16px 20px", marginTop: 16 }}>
      {heading ? <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, marginBottom: 8 }}>{heading}</div> : null}
      <div style={{ fontSize: 14, color: P.textDim, lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function ChartCard({ label, note, children }: { label?: string; note?: ReactNode; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "28px 28px 20px" }}>
      {label ? <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textDim, marginBottom: 6 }}>{label}</div> : null}
      {note ? <p style={{ margin: "0 0 20px", fontSize: 14, color: P.textDim, lineHeight: 1.7 }}>{note}</p> : null}
      {children}
    </div>
  );
}

function TableRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }): React.JSX.Element {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 18px", borderBottom: `1px solid ${P.border}`, fontSize: 13, color: highlight ? P.accent : P.textDim, background: highlight ? `${P.accent}08` : "transparent" }}>
      <span>{label}</span>
      <span style={{ fontFamily: FONT_MONO, fontVariantNumeric: "tabular-nums", color: highlight ? P.accent : P.text }}>{value}</span>
    </div>
  );
}

const MODEL_METRIC_TABS = ["accuracy", "auc"] as const;
type ModelMetricTab = (typeof MODEL_METRIC_TABS)[number];

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

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function TelcoChurnReport(props: WorkPageProps) {
  const [activeTab, setActiveTab] = useState<ModelMetricTab>("accuracy");

  return (
    <WorkReportShell {...props}>
    <div style={{ color: P.text, fontFamily: FONT_SANS }}>
      {/* ── HERO ── */}
      <div style={{ borderBottom: `1px solid ${P.border}`, padding: "72px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, ${P.border} 1px, transparent 0)`, backgroundSize: "28px 28px", opacity: 0.5 }} />
        <div style={{ position: "absolute", top: "-20%", left: "60%", width: 600, height: 600, background: `radial-gradient(ellipse, ${C.amber}08 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 40px", position: "relative" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, marginBottom: 20 }}>
            Machine Learning · Customer Analytics · Binary Classification
          </div>
          <h1 style={{ fontFamily: FONT_SANS, fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.15, color: P.text, letterSpacing: -0.02 }}>
            Telco Customer<br /><span style={{ color: P.accent }}>Churn Prediction</span>
          </h1>
          <p style={{ fontSize: 17, color: P.textDim, maxWidth: 660, lineHeight: 1.8, margin: "0 0 14px" }}>
            A telecom company's most expensive problem isn't acquiring customers. It's silently losing them. This project builds a churn prediction system across 7,032 subscribers, answering: <strong style={{ color: P.text }}>who is at risk, why they're leaving, and which levers retention teams should pull first.</strong>
          </p>
          <p style={{ fontSize: 15, color: P.textDim, maxWidth: 660, lineHeight: 1.7, margin: "0 0 36px" }}>
            The final Gradient Boosting model achieves <strong style={{ color: P.text }}>79.4% accuracy</strong> and <strong style={{ color: P.text }}>83.6% ROC-AUC</strong>. More importantly, it surfaces five concrete, business-actionable drivers that appear to explain the majority of churn risk.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Python", "scikit-learn", "pandas", "GBM", "GridSearchCV", "EDA", "Feature Engineering"].map(t => (
              <span key={t} style={{ fontFamily: FONT_MONO, fontSize: 11, background: P.surface, border: `1px solid ${P.border}`, color: P.teal, padding: "5px 12px", borderRadius: 20 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "60px 40px" }}>

        {/* KPIs */}
        <div id="telco-kpis" className="scroll-mt-28" style={{ display: "flex", gap: 16, marginBottom: 80, flexWrap: "wrap" }}>
          <KPI label="Subscribers analysed" value="7,032" sub="After removing 11 new-customer rows with no billing history" />
          <KPI label="Churn rate" value="26.6%" sub="1,869 churners - a significant minority driving outsized revenue loss" color={P.rose} />
          <KPI label="Model accuracy" value="79.4%" sub="Gradient Boosting, best across 5 algorithms benchmarked" color={P.teal} />
          <KPI label="ROC-AUC" value="83.6%" sub="Strong discrimination between churners and retained customers" color={P.purple} />
        </div>

        {/* ══ 01 THE BUSINESS PROBLEM ══ */}
        <div id="telco-business" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={1} title="The Business Problem" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0 }}>
                Customer churn in telecom is structurally expensive. Acquiring a new subscriber typically costs 5–7× more than retaining an existing one, yet most companies only discover a customer has left after it's already happened. The goal here is to flip that dynamic: <strong style={{ color: P.text }}>predict churn before it occurs</strong> so retention teams can intervene with targeted offers, outreach, or service fixes.
              </p>
              <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85 }}>
                With 26.6% of the subscriber base churning, roughly 1 in 4 customers, even a modest improvement in early identification could translate directly to recoverable revenue. The question isn't just <em>who</em> will churn, but <em>why</em>: which contract terms, service bundles, and payment experiences create the friction that pushes customers out?
              </p>
            </div>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${P.border}`, fontFamily: FONT_MONO, fontSize: 11, color: P.textDim }}>Dataset at a glance</div>
              {[
                ["Raw rows", "7,043 × 21 columns"],
                ["Rows dropped", "11 (tenure = 0, no billing history)"],
                ["Final dataset", "7,032 rows × 20 features"],
                ["Churn (positive class)", "1,869 customers — 26.6%"],
                ["Retained (negative class)", "5,163 customers — 73.4%"],
                ["Numeric features", "tenure, MonthlyCharges, TotalCharges"],
                ["Categorical features", "17"],
                ["Train / Test split", "70% / 30%, stratified"],
              ].map(([k, v]) => <TableRow key={k} label={k} value={v} />)}
            </div>
          </div>
        </div>

        {/* ══ 02 DATA CLEANING ══ */}
        <div id="telco-cleaning" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={2} title="Data Cleaning & Quality Decisions" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            The dataset had a subtle but impactful flaw: <Mono>TotalCharges</Mono> was 
            typed as a string column rather than numeric. Eleven rows contained blank strings, 
            which pandas couldn't convert to float. These would have silently introduced NaNs into the model,
             producing either a runtime crash or corrupted predictions.
          </p>
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginBottom: 20 }}>
            The key decision was what to <em>do</em> with those 11 rows.
             Imputing them would have been misleading as every single one had <Mono>tenure = 0</Mono> and <Mono>Churn = No</Mono>. 
             These are brand-new subscribers with zero billing history. 
             <strong style={{ color: P.text }}>There is nothing about their behaviour yet to learn from.
              </strong> Keeping them would have injected noise into a model trying to predict based on behavioural patterns.
               Dropping them is the more sound analytical decision.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Callout color={P.teal} icon="✓">
              <strong style={{ color: P.text }}>All consistency checks passed.
                </strong> Every row where <Mono>InternetService = "No"</Mono> correctly showed <Mono>
                  "No internet service"</Mono> across all six dependent columns: 
                  OnlineSecurity, OnlineBackup, DeviceProtection, TechSupport, StreamingTV, StreamingMovies. Zero violations. 
                  The dataset appears internally consistent and safe to model.
            </Callout>
            <Callout color={P.orange} icon="⚠">
              <strong style={{ color: P.text }}>TotalCharges ≠ tenure × MonthlyCharges</strong> for roughly 33% of rows. 
              This isn't necessarily an error. It likely reflects real mid-cycle events: plan upgrades, promotional credits, and prorated billing.
               It may mean TotalCharges encodes <em>richer</em> behavioural signal than a simple formula would produce, 
               which could partly explain why it ranks as the model's most important feature.
            </Callout>
          </div>
        </div>

        {/* ══ 03 EDA ══ */}
        <div id="telco-eda" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={3} title="Exploratory Data Analysis" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 28 }}>
            Before training anything, EDA was used to stress-test intuitions and find which features carry genuine predictive signal and which are noise. 
            Four patterns emerged as dominant, each translating into a retention action that a team could take tomorrow.
          </p>

          {/* Chart 1: Tenure */}
          <ChartCard
            label="Chart 1 : Churn rate by tenure group"
            note={<>The relationship between customer longevity and churn probability 
            is the clearest pattern in the entire dataset. 
            Customers in their first 6 months churn at <strong style={{ color: P.rose }}>53.3%</strong>. 
            By the 4-6 year mark, that rate collapses to <strong style={{ color: P.teal }}>9.5%</strong>. 
            That's a <strong style={{ color: P.text }}>5.6× difference</strong> observed across tenure groups.</>}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tenureChurn} barCategoryGap="35%">
                <CartesianGrid vertical={false} stroke={P.border} />
                <XAxis dataKey="group" tick={{ fill: P.textDim, fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 65]} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="rate" name="Churn rate" radius={[5, 5, 0, 0]}>
                  {tenureChurn.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <AnalysisBlock heading="Why this may happen and what it could suggest">
              New subscribers may not yet have built the switching inertia that comes from years of integrated service.
              They're also the most likely to have joined on a promotional rate that expires, making their first full-price bill a potential shock. 
              Customers who stay past 24 months have likely already absorbed the switching cost mentally and made their peace with the relationship.
              The implication: <strong style={{ color: P.text }}>the first 12 months may be the highest-leverage window for retention investment</strong>.
              Early onboarding check-ins, proactive value demonstrations, and lock-in incentives targeted at month 3–6 subscribers could have 
              the highest expected return.
            </AnalysisBlock>
          </ChartCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
            {/* Chart 2: Payment */}
            <ChartCard
              label="Chart 2 : Churn rate by payment method"
              note={<>Electronic check payers churn at <strong style={{ color: P.rose }}>45.3%</strong>, nearly <strong style={{ color: P.text }}>3× the rate</strong> of credit card subscribers (15.3%).
               This gap is too large to be coincidental.</>}
            >
              <ResponsiveContainer width="100%" height={185}>
                <BarChart data={paymentChurn} layout="vertical" barCategoryGap="28%">
                  <CartesianGrid horizontal={false} stroke={P.border} />
                  <XAxis type="number" tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="method" tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={82} />
                  <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                  <Bar dataKey="rate" name="Churn rate" radius={[0, 5, 5, 0]}>
                    {paymentChurn.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <AnalysisBlock heading="Why this may matter">
                Electronic check is the only manual, non-automatic payment method with substantial usage (33.6% of customers). 
                It requires monthly active effort, which may mean it self-selects for people who haven't <em>fully committed</em> to the relationship. 
                Automatic payment methods (bank transfer, credit card) tend to correlate with customers who have implicitly decided to stay. <strong style={{ color: P.text }}>
                  Payment method may not be causing churn directly. It could be a behavioural signal of commitment level.</strong> Migrating 
                  at-risk subscribers to automatic payment is a concrete, low-friction retention lever worth exploring.
              </AnalysisBlock>
            </ChartCard>

            {/* Chart 3: Monthly charges */}
            <ChartCard
              label="Chart 3 : Monthly charges vs churn"
              note={<>Churned customers average <strong style={{ color: P.rose }}>$74.44/month</strong> vs <strong style={{ color: P.teal }}>$61.31/month</strong> 
              for retained, a <strong style={{ color: P.text }}>$13.13/month gap</strong>. The high-charge tiers skew heavily toward churners.</>}
            >
              <ResponsiveContainer width="100%" height={185}>
                <BarChart data={monthlyChargeData} barCategoryGap="22%">
                  <CartesianGrid vertical={false} stroke={P.border} />
                  <XAxis dataKey="range" tick={{ fill: P.textDim, fontSize: 9.5, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", color: P.textDim }} />
                  <Bar dataKey="churned"  name="Churned (count)"  fill={P.rose}  radius={[3, 3, 0, 0]} />
                  <Bar dataKey="retained" name="Retained (count)" fill={P.teal}  radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <AnalysisBlock heading="Why this may matter">
                Higher charges may not directly <em>cause</em> churn, but they raise the stakes for the customer. 
                Someone paying $100+/month has a strong financial incentive to compare alternatives. 
                Without bundled security or support services justifying the cost, that price could become a vulnerability. 
                This may help explain why <strong style={{ color: P.text }}>fiber optic subscribers churn noticeably more than DSL users</strong>:
                 they're paying more, often without the add-ons that might anchor them to the provider.
              </AnalysisBlock>
            </ChartCard>
          </div>

          {/* Additional EDA findings */}
          <div style={{ marginTop: 20, background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textDim, marginBottom: 18 }}>Additional EDA findings</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: "📋", title: "Contract type is the strongest categorical separator", body: "55% of customers are month-to-month, yet this group overwhelmingly dominates the churn population. Two-year contract holders almost never leave, possibly because the switching cost (early termination fees, re-setup friction) exceeds the motivation to leave. Long-term contracts may function as a structural retention mechanism, not just a pricing strategy." },
                { icon: "🔒", title: "Security & support add-ons may act as anchors", body: "Customers without OnlineSecurity or TechSupport churn at higher rates. These services may deepen the customer's dependence on the provider and give them a contact point when problems arise. Customers who regularly interact with TechSupport tend to stay longer; those who never do appear more likely to leave quietly after a bad experience." },
                { icon: "👨‍👩‍👧", title: "Dependents may signal long-term commitment", body: "Customers with dependents are significantly less likely to churn. Families sharing a plan face collective switching costs, with one person's decision to leave affecting everyone. The inertia to stay is proportionally higher. This demographic may represent a natural low-risk segment to preserve, rather than one that needs heavy retention spend." },
                { icon: "⚥", title: "Gender has near-zero predictive power and was deliberately excluded", body: "Male and female customers churn at virtually identical rates (~26.7% vs ~26.5%). This was supported both visually and statistically. Gender was excluded from the final feature set. Knowing what does NOT matter is as analytically valuable as knowing what does; adding noise to a model can hurt its calibration on the signals that actually count." },
              ].map(({ icon, title, body }) => (
                <div key={title} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <strong style={{ fontSize: 13.5, color: P.text, lineHeight: 1.4 }}>{title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: P.textDim, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ 04 FEATURE ENGINEERING ══ */}
        <div id="telco-features" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={4} title="Feature Engineering" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            Raw features alone don't fully capture churn risk; they need to be translated into signals a model can learn from cleanly. Nine domain-driven binary flags were engineered from EDA findings, plus a composite <Mono>risk_score</Mono> summing them into a single segment-priority metric. The logic behind each flag isn't arbitrary: every one encodes a specific hypothesis about <em>why</em> a customer may be at risk, grounded in observed data.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { name: "short_tenure", why: "Customers in their first 12 months sit in the highest-risk window (36–53% churn). This flag isolates that cohort explicitly so the model can weight it directly.", color: P.rose },
              { name: "month_to_month", why: "The strongest categorical predictor from EDA. No termination fee, no commitment: this group has maximum structural freedom to leave at any billing cycle.", color: P.rose },
              { name: "fiber_no_security", why: "Fiber subscribers already pay more. Without OnlineSecurity bundled, they have a high bill with nothing additional anchoring them, a potentially concerning value-perception combination.", color: P.orange },
              { name: "no_support_services", why: "Customers with no TechSupport or DeviceProtection never interact proactively with the provider. Silence tends to precede churn.", color: P.orange },
              { name: "electronic_check_payment", why: "Manual payment correlates with lower commitment (45.3% churn rate). This flag lets the model weight that behavioural signal directly rather than treating it as a raw category.", color: P.accent },
              { name: "high_monthly", why: "Charges above the dataset median ($70/month) may compound risk when not justified by bundled services, which could be particularly significant for newer customers still evaluating value.", color: P.accent },
              { name: "hasOnlineSecurity / hasTechSupport", why: "Protective services may act as retention anchors. Their presence is a negative churn signal; their absence is a risk flag. The model benefits from both directions being encoded.", color: P.teal },
              { name: "hasStreamingTV / hasStreamingMovies", why: "Entertainment add-ons increase the value extracted from the plan and may raise the cost of switching to a competitor who doesn't offer the same bundle.", color: P.teal },
              { name: "risk_score (composite)", why: "Sums all boolean risk flags into a 0–9 score. Independently useful as a segment-priority metric for retention teams, with high scorers serving as the first call list regardless of model output.", color: P.purple },
            ].map(f => (
              <div key={f.name} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${f.color}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: f.color, marginBottom: 6 }}>{f.name}</div>
                <div style={{ fontSize: 12.5, color: P.textDim, lineHeight: 1.6 }}>{f.why}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 05 MODEL SELECTION ══ */}
        <div id="telco-models" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={5} title="Model Selection & Benchmarking" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            Five classifiers were benchmarked on the same 70/30 stratified split. Overall accuracy is the headline metric, but for a churn use case, the more critical question is <em>how well does the model identify the 26.6% of customers who will leave?</em> Predicting the majority class (retained) well is trivially easy. The hard, valuable problem is catching churners before they go.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {MODEL_METRIC_TABS.map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: "8px 20px", borderRadius: 6, cursor: "pointer", background: activeTab === tab ? P.accent : P.surface, color: activeTab === tab ? P.bg : P.textDim, border: `1px solid ${activeTab === tab ? P.accent : P.border}`, transition: "all 0.15s" }}>
                {tab === "accuracy" ? "Accuracy" : "ROC-AUC"}
              </button>
            ))}
          </div>

          <ChartCard label={`Chart 4 — Model comparison: ${activeTab === "accuracy" ? "accuracy %" : "ROC-AUC %"} (highlighted = selected model)`}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={modelComparison} barCategoryGap="35%">
                <CartesianGrid vertical={false} stroke={P.border} />
                <XAxis dataKey="model" tick={{ fill: P.textDim, fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis domain={activeTab === "accuracy" ? [73, 82] : [68, 87]} tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey={activeTab} name={activeTab === "accuracy" ? "Accuracy %" : "ROC-AUC %"} radius={[5, 5, 0, 0]}>
                  {modelComparison.map((d, i) => <Cell key={i} fill={d.model === "GBM ★" ? P.accent : P.muted} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Full model table */}
          <div style={{ marginTop: 20, background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", background: P.surface, padding: "11px 18px", fontFamily: FONT_MONO, fontSize: 11, color: P.textDim, borderBottom: `1px solid ${P.border}` }}>
              <span>Model</span><span>Accuracy</span><span>ROC-AUC</span><span>Precision</span><span>Recall</span><span>F1 (churn)</span>
            </div>
            {[
              { name: "KNN (k=11)",                 acc: "77.1%", auc: "75.1%", prec: "61%", rec: "37%", f1: "46%", hl: false },
              { name: "SVM (rbf, C=0.1)",           acc: "75.6%", auc: "70.5%", prec: "90%", rec: "9%",  f1: "17%", hl: false },
              { name: "Logistic Regression (C=10)", acc: "77.0%", auc: "83.6%", prec: "55%", rec: "73%", f1: "63%", hl: false },
              { name: "Random Forest (500 trees)",  acc: "79.3%", auc: "83.5%", prec: "66%", rec: "44%", f1: "53%", hl: false },
              { name: "Gradient Boosting ★",        acc: "79.4%", auc: "83.6%", prec: "65%", rec: "48%", f1: "55%", hl: true  },
            ].map(({ name, acc, auc, prec, rec, f1, hl }) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", padding: "12px 18px", fontSize: 13, color: hl ? P.accent : P.textDim, background: hl ? `${P.accent}08` : "transparent", borderBottom: `1px solid ${P.border}`, fontFamily: hl ? FONT_MONO : "inherit" }}>
                <span>{name}</span><span>{acc}</span><span>{auc}</span><span>{prec}</span><span>{rec}</span><span>{f1}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
            <AnalysisBlock heading="Why GBM over Logistic Regression?">
              Logistic Regression actually achieves <em>higher</em> churn recall (73% vs 48%) because it was explicitly class-weighted to penalise missing churners. But that comes at a cost: its churn precision drops to 55%, meaning roughly half of its positive predictions are false alarms. <strong style={{ color: P.text }}>For a retention team with limited outreach capacity, false alarms are expensive;</strong> every wasted contact consumes budget and risks annoying a customer who wasn't leaving. GBM's 65% precision means fewer misfires. Its superior overall accuracy (79.4% vs 77.0%) and identical ROC-AUC (83.6%) support it as the stronger generaliser.
            </AnalysisBlock>
            <AnalysisBlock heading="Why SVM was disqualified immediately">
              SVM achieved 90% precision on churners, the highest of any model. But its recall was just 9%, meaning it classified nearly every customer as retained and caught only roughly 50 of the 561 actual churners. Its 75.6% overall accuracy is almost entirely explained by correctly predicting the 73.4% majority class. <strong style={{ color: P.text }}>A model that misses 91% of churners has no operational value</strong>, regardless of how precise it is on the ones it does identify. High precision with near-zero recall is worse than useless for a proactive retention programme.
            </AnalysisBlock>
          </div>
        </div>

        {/* ══ 06 FEATURE IMPORTANCE ══ */}
        <div id="telco-importance" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={6} title="What the Model Learned Matters" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            Feature importances from the Random Forest model measure how much each variable reduces prediction uncertainty across all 500 decision trees (mean decrease in impurity). This is where the model either validates or challenges the intuitions built during EDA, and in this case, it validates them strongly.
          </p>

          <ChartCard label="Chart 5 — Top 10 features by importance % (Random Forest, mean impurity reduction)">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={featureImportance} layout="vertical" barCategoryGap="22%">
                <CartesianGrid horizontal={false} stroke={P.border} />
                <XAxis type="number" tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="feature" tick={{ fill: P.textDim, fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={128} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="importance" name="Importance %" radius={[0, 5, 5, 0]}>
                  {featureImportance.map((d, i) => (
                    <Cell key={i} fill={d.importance > 8 ? P.accent : d.importance > 4 ? P.orange : P.teal} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 20 }}>
            {[
              { title: "TotalCharges leads at 10.2% and here's a possible reason", color: P.accent, body: "TotalCharges may simultaneously encode two things: how long a customer has been a subscriber and their cumulative spend trajectory. A customer with high TotalCharges and low MonthlyCharges could be a long-tenured downgrader, a different risk profile from a short-tenure, high-charge new subscriber. That dual encoding may make it richer than either tenure or MonthlyCharges alone, which could help explain why it ranks first even though the other two also appear." },
              { title: "Three financial features account for 28% of signal", color: P.orange, body: "TotalCharges (10.2%), tenure (9.6%), and MonthlyCharges (8.3%) together account for over 28% of the model's predictive power. This concentration may suggest churn is fundamentally tied to the financial dimension of the relationship. Age, gender, and household composition barely register. The model seems to point toward understanding the financial dynamic of the relationship as a key part of understanding churn risk." },
              { title: "Contract & payment confirm EDA and enable action", color: P.teal, body: "Contract type (2yr: 2.2%, 1yr: 1.8%) and electronic check payment (2.1%) appear in the top 10, lending further weight to the EDA findings. Crucially, unlike TotalCharges, these features are directly actionable: a retention team can offer a contract-length incentive or assist with payment method migration, which are concrete interventions with potentially measurable outcomes." },
            ].map(({ title, color, body }) => (
              <div key={title} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "16px 18px", borderTop: `3px solid ${color}` }}>
                <strong style={{ fontSize: 13.5, color: P.text, display: "block", marginBottom: 10, lineHeight: 1.4 }}>{title}</strong>
                <p style={{ margin: 0, fontSize: 13, color: P.textDim, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 07 HYPERPARAMETER TUNING ══ */}
        <div id="telco-tuning" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={7} title="Hyperparameter Tuning" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            Default GBM settings are designed for balanced, medium-scale datasets. This dataset is neither: it has a 73/27 class imbalance and structured categorical patterns that respond differently to learning rate and tree depth. A <Mono>GridSearchCV</Mono> with 3-fold cross-validation across 32 parameter combinations was run to find settings that generalise well, not just fit the training data.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div>
              {[
                { param: "learning_rate = 0.05", why: "A slower learning rate forces the model to take smaller, more considered steps at each boosting round, which may reduce the risk of overfitting the minority churn class. At the default 0.1, the model converged faster but showed slightly worse generalisation on the validation folds." },
                { param: "max_depth = 3", why: "Shallow trees are the principled choice for gradient boosting. Each tree only needs to correct the residual errors of the previous one; it doesn't need to be a complete model in itself. Depth 3 (maximum 8 leaf nodes per tree) keeps individual learners deliberately weak so the ensemble can be strong without memorising training noise." },
                { param: "n_estimators = 100", why: "100 boosting rounds at learning_rate=0.05 provides sufficient convergence. Testing 200 estimators showed diminishing returns on the CV score, adding computation time without improving generalisation, which may be a signal that the model has reached its learning plateau." },
                { param: "subsample = 1.0", why: "Stochastic subsampling (e.g. 0.8, using 80% of rows per round) is sometimes beneficial because it introduces variance-reducing randomness. Here it consistently reduced CV performance, suggesting the dataset's structure may be regular enough that using all rows per round is more informative than sampling." },
              ].map(({ param, why }) => (
                <div key={param} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                  <Mono>{param}</Mono>
                  <p style={{ margin: 0, fontSize: 13.5, color: P.textDim, lineHeight: 1.75 }}>{why}</p>
                </div>
              ))}
            </div>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden", alignSelf: "start" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${P.border}`, fontFamily: FONT_MONO, fontSize: 11, color: P.textDim }}>TUNING SUMMARY</div>
              <TableRow label="Grid combinations" value="32" />
              <TableRow label="CV folds" value="3-fold" />
              <TableRow label="Total model fits" value="96" />
              <TableRow label="Best CV score" value="80.1%" highlight />
              <TableRow label="Final test accuracy" value="79.4%" highlight />
              <TableRow label="Generalisation gap" value="0.7% — healthy" />
            </div>
          </div>
          <Callout color={P.teal} icon="✓">
            <strong style={{ color: P.text }}>A 0.7% gap between CV score (80.1%) and test accuracy (79.4%) is a healthy result.</strong> It suggests the model generalises well to unseen data and hasn't memorised the training set. Gaps above 3–5% would flag overfitting; gaps of zero would suggest the CV setup was leaking data. This sits in the right zone.
          </Callout>
        </div>

        {/* ══ 08 FINAL EVALUATION ══ */}
        <div id="telco-evaluation" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={8} title="Final Model Evaluation" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            The tuned GBM was evaluated on the held-out 30% test set, comprising 2,110 subscribers the model had never seen: 1,549 retained and 561 churners. The results reflect a model that is confident and accurate on the majority class, and appropriately conservative about flagging churners at the default threshold.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <ChartCard label="Chart 6 — Per-class precision, recall & F1-score (%)">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={classReport} barCategoryGap="30%">
                  <CartesianGrid vertical={false} stroke={P.border} />
                  <XAxis dataKey="label" tick={{ fill: P.textDim, fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", color: P.textDim }} />
                  <Bar dataKey="churned"  name="Churned (class 1)"  fill={P.rose} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="retained" name="Retained (class 0)" fill={P.teal} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textDim, marginBottom: 16 }}>Chart 7 — Confusion matrix (test set, n=2,110)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                  { label: "True Negatives",  value: CM.TN, sub: "91% of retained correctly predicted as staying", color: P.teal },
                  { label: "False Positives", value: CM.FP, sub: "Retained customers incorrectly flagged as churners", color: P.muted },
                  { label: "False Negatives", value: CM.FN, sub: "Churners the model missed, representing the core recall gap", color: P.orange },
                  { label: "True Positives",  value: CM.TP, sub: "48% of churners correctly identified before leaving", color: P.rose },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} style={{ background: P.surface, borderRadius: 8, padding: "14px 16px", border: `1px solid ${P.border}`, borderTop: `2px solid ${color}` }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 24, color, fontWeight: 700 }}>{value.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: P.text, marginTop: 4 }}>{label}</div>
                    <div style={{ fontSize: 11.5, color: P.textDim, marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
                  </div>
                ))}
              </div>
              <Callout color={P.orange} icon="⚡">
                <strong style={{ color: P.text }}>292 churners missed</strong> at the 50% threshold. Lowering it to roughly 35% could catch significantly more, at the cost of more false alarms. Whether that tradeoff is worthwhile depends on the cost of a wasted retention call vs the revenue recovered per churner saved.
              </Callout>
            </div>
          </div>

          <AnalysisBlock heading="Reading the results honestly - what does 79.4% accuracy mean?">
            A 79.4% accuracy headline looks strong. But in a 73/27 imbalanced dataset, a model that simply predicted "retained" for <em>every</em> customer would score 73.4% accuracy with zero practical value. The more meaningful number is the <strong style={{ color: P.text }}>48% churn recall</strong>: the model catches roughly half of actual churners at the default threshold. The other half (292 customers) are predicted to stay but will leave. This may be a consequence of class imbalance; the model has been exposed to 2.7× more "stay" examples than "leave" examples, so it's naturally conservative about predicting churn. The ROC-AUC of 83.6% is the more honest performance indicator; it measures how well the model <em>ranks</em> customers by churn probability across all possible thresholds, and 83.6% reflects genuinely strong ranking ability. The binary threshold is a dial that can be tuned; the underlying discriminative power is what matters.
          </AnalysisBlock>
        </div>

        {/* ══ 09 LIMITATIONS & NEXT STEPS ══ */}
        <div id="telco-next" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={9} title="Limitations & What Comes Next" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.rose, marginBottom: 18 }}>Known limitations</div>
              {[
                { title: "Class imbalance is unaddressed in the final model", body: "The 73/27 split wasn't corrected with SMOTE or explicit class weighting in the final GBM, which may be why churn recall sits at 48%. This was a deliberate tradeoff: oversampling can cause the model to learn synthetic patterns rather than real-world structure. The more appropriate fix is likely sweeping the classification threshold against a business cost function, rather than blindly applying SMOTE." },
                { title: "Snapshot data with no behavioural trajectory", body: "The dataset is a single point-in-time cross-section. There's no usage trajectory: a customer whose usage doubled last month looks identical to one whose usage halved. Longitudinal features (charge trend over time, support ticket frequency, usage deltas) would likely strengthen the model's early-warning capability." },
                { title: "No per-customer explainability (SHAP)", body: "Feature importances describe what matters globally across all customers. They don't tell a retention agent <em>why this specific customer</em> was flagged. Without SHAP values, the model is an output without a story, which is critical for agent trust and for crafting personalised, credible retention offers rather than generic discounts." },
                { title: "TotalCharges complexity is partially opaque", body: "About 33% of rows show TotalCharges differing from tenure × MonthlyCharges by more than $50, implying mid-cycle plan changes, credits, or prorated billing that the model treats as a black box. Decomposing this delta into an engineered feature could potentially capture upgrade/downgrade behaviour as a direct churn signal." },
              ].map(({ title, body }) => (
                <div key={title} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${P.border}` }}>
                  <strong style={{ fontSize: 13.5, color: P.text, display: "block", marginBottom: 6 }}>{title}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: P.textDim, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.teal, marginBottom: 18 }}>High-value next steps</div>
              {[
                { title: "Threshold optimisation with a business cost function", body: "Define the cost of a missed churner (lost customer LTV) and the cost of a false alarm (wasted outreach spend). Sweep the classification threshold from 30% to 70% and plot expected net ROI at each point. This converts an ML probability score into a direct, defensible business recommendation, and could make the model deployable by a non-technical retention team." },
                { title: "SHAP for individual-level explanations", body: "Adding SHAP would let the model explain each prediction: 'This customer is high-risk primarily because of their month-to-month contract and fiber subscription without security add-ons.' That specificity enables personalised retention offers and builds trust with agents who currently have no reason to rely on a black-box score." },
                { title: "LTV-weighted customer prioritisation", body: "Not all at-risk customers are equally worth retaining. A customer spending $110/month for 5 years is far more valuable than one spending $20/month in month 2. Multiplying the model's churn probability score by estimated LTV creates a ranked contact list that could maximise revenue recovery per dollar of outreach, rather than spending it uniformly." },
                { title: "Longitudinal features from usage data", body: "If usage logs or billing history over time are accessible, features like charge_delta_3m (change in monthly charges over 3 months), support_calls_6m, or plan_downgrades_12m could capture the behavioural trajectory that snapshot data entirely misses, and may push model performance significantly past the current ceiling." },
              ].map(({ title, body }) => (
                <div key={title} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${P.border}` }}>
                  <strong style={{ fontSize: 13.5, color: P.text, display: "block", marginBottom: 6 }}>{title}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: P.textDim, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 32 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.muted }}>
            Dataset: IBM Watson Telco Churn · Stack: Python, scikit-learn, pandas, NumPy, seaborn, matplotlib
          </div>
        </div>

      </div>
    </div>
    </WorkReportShell>
  );
}