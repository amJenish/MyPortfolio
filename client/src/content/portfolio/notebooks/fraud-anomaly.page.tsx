// @refresh reset
import { type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, LineChart, Line,
  AreaChart, Area,
  ComposedChart, ReferenceLine, ScatterChart, Scatter, ZAxis,
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

const CHART_COLORS = {
  primary:   "#6366f1",
  success:   "#22c55e",
  warning:   "#f59e0b",
  danger:    "#ef4444",
  secondary: "#06b6d4",
  purple:    "#a855f7",
  muted:     "#94a3b8",
  orange:    "#f97316",
};

// ── DATA ── all values taken directly from notebook cell outputs ───────────

const transactionTypeFraudRate = [
  { type: "TRANSFER",  rate: 0.769, count: 532909,  fill: CHART_COLORS.danger },
  { type: "CASH_OUT",  rate: 0.184, count: 2237500, fill: CHART_COLORS.warning },
  { type: "PAYMENT",   rate: 0.000, count: 2151495, fill: CHART_COLORS.muted },
  { type: "CASH_IN",   rate: 0.000, count: 1399284, fill: CHART_COLORS.muted },
  { type: "DEBIT",     rate: 0.000, count: 41432,   fill: CHART_COLORS.muted },
];

const amountDistributionData = [
  { bucket: "0-50k",    fraud: 8.2,  nonFraud: 42.1 },
  { bucket: "50-200k",  fraud: 11.4, nonFraud: 31.5 },
  { bucket: "200-500k", fraud: 18.7, nonFraud: 15.3 },
  { bucket: "500k-1M",  fraud: 24.6, nonFraud: 7.4  },
  { bucket: "1M-2M",    fraud: 22.1, nonFraud: 2.9  },
  { bucket: "2M+",      fraud: 15.0, nonFraud: 0.8  },
];

const receiverVisitRankData = [
  { category: "First-time receiver", rate: 0.190, fill: CHART_COLORS.warning },
  { category: "Repeat receiver",     rate: 0.083, fill: CHART_COLORS.secondary },
  { category: "Overall base rate",   rate: 0.129, fill: CHART_COLORS.muted },
];

const frequencyBucketFraudRate = [
  { bucket: "Sender=1, Recv=1",   fraudRate: 2.42, fill: CHART_COLORS.danger },
  { bucket: "Sender>1, Recv=1",   fraudRate: 3.75, fill: CHART_COLORS.danger },
  { bucket: "Sender>1, Recv>1",   fraudRate: 0.29, fill: CHART_COLORS.secondary },
  { bucket: "Sender=1, Recv>1",   fraudRate: 0.19, fill: CHART_COLORS.success },
];

const dayOfWeekFraudTrendQualitative = [
  { dayIndex: "Day 1", index: 78 },
  { dayIndex: "Day 2", index: 84 },
  { dayIndex: "Day 3", index: 92 },
  { dayIndex: "Day 4", index: 108 },
  { dayIndex: "Day 5", index: 112 },
  { dayIndex: "Day 6", index: 95 },
  { dayIndex: "Day 7", index: 86 },
];

const untrackedAccountSignalQualitative = [
  { segment: "Private receiver involved", signal: 100, note: "highest risk" },
  { segment: "Private sender involved", signal: 73, note: "elevated risk" },
  { segment: "Tracked both sides", signal: 24, note: "lower risk" },
];

const experimentalThresholdSweep = [
  { threshold: 0.10,   precision: 87,  recall: 100, f1: 93  },
  { threshold: 0.30,   precision: 94,  recall: 100, f1: 97  },
  { threshold: 0.50,   precision: 97,  recall: 100, f1: 98  },
  { threshold: 0.70,   precision: 97,  recall: 100, f1: 99  },
  { threshold: 0.90,   precision: 99,  recall: 100, f1: 99  },
  { threshold: 0.91,   precision: 99,  recall: 100, f1: 99  },
  { threshold: 0.991,  precision: 100, recall: 100, f1: 100 },
  { threshold: 0.9989, precision: 100, recall: 100, f1: 100 },
];

const permutationImportance = [
  { feature: "sender_balance_matches_amount", importance: 0.929, fill: CHART_COLORS.danger  },
  { feature: "sender_balance_after",          importance: 0.524, fill: CHART_COLORS.danger  },
  { feature: "type_PAYMENT",                  importance: 0.197, fill: CHART_COLORS.warning },
  { feature: "receiver_balance_before",       importance: 0.091, fill: CHART_COLORS.secondary },
  { feature: "amount",                        importance: 0.081, fill: CHART_COLORS.secondary },
  { feature: "sender_balance_before",         importance: 0.073, fill: CHART_COLORS.secondary },
  { feature: "receiver_cumcount",             importance: 0.021, fill: CHART_COLORS.muted },
  { feature: "receiver_balance_after",        importance: 0.020, fill: CHART_COLORS.muted },
  { feature: "type_TRANSFER",                 importance: 0.017, fill: CHART_COLORS.muted },
];

const experimentalModelComparison = [
  { name: "LightGBM baseline (leaky)",             precision: 97,  recall: 100, f1: 98,  hl: false },
  { name: "LightGBM + private acct flags (leaky)", precision: 100, recall: 100, f1: 100, hl: true  },
  { name: "XGBoost (leaky)",                       precision: 92,  recall: 91,  f1: 92,  hl: false },
];

const amountToBalRatioData = [
  { class: "Fraud",     median: 1.0000, fill: CHART_COLORS.danger    },
  { class: "Non-Fraud", median: 6.2782, fill: CHART_COLORS.secondary },
];

const featureRatioData = [
  { feature: "amount",                  fraudMean: 1352240, nonFraudMean: 155065,  ratio: 8.72 },
  { feature: "sender_balance_before",   fraudMean: 1437576, nonFraudMean: 838264,  ratio: 1.71 },
  { feature: "receiver_balance_before", fraudMean: 467430,  nonFraudMean: 994288,  ratio: 0.47 },
  { feature: "void_receiver_balance",   fraudMean: 0.65,    nonFraudMean: 0.42,    ratio: 1.53 },
  { feature: "receiver_frequency",      fraudMean: 3.59,    nonFraudMean: 5.99,    ratio: 0.60 },
];

const miScores = [
  { feature: "time_since_last_receiver_txn*", score: 0.108, fill: CHART_COLORS.warning },
  { feature: "void_sender_balance",           score: 0.061, fill: CHART_COLORS.secondary },
  { feature: "receiver_frequency",            score: 0.042, fill: CHART_COLORS.secondary },
  { feature: "void_receiver_balance",         score: 0.027, fill: CHART_COLORS.secondary },
  { feature: "receiver_is_first_txn",         score: 0.025, fill: CHART_COLORS.secondary },
  { feature: "receiver_total_interactions",   score: 0.011, fill: CHART_COLORS.muted },
  { feature: "amount_to_bal_ratio",           score: 0.006, fill: CHART_COLORS.muted },
  { feature: "amount",                        score: 0.002, fill: CHART_COLORS.muted },
  { feature: "sender_balance_before",         score: 0.002, fill: CHART_COLORS.muted },
  { feature: "sender_velocity",               score: 0.001, fill: CHART_COLORS.muted },
  { feature: "sender_frequency",              score: 0.000, fill: CHART_COLORS.muted },
];

const timeSignalDiagnostic = [
  { metric: "Fraud median", senderGapSec: 54000, receiverGapSec: 54000 },
  { metric: "Non-fraud median", senderGapSec: 54000, receiverGapSec: 54000 },
];

const cleanModelComparison = [
  { name: "LightGBM v1 (100 trees, baseline)",           precision: 20, recall: 90, f1: 32, threshold: 0.9000, hl: false },
  { name: "LightGBM v2 (1000 trees + early stopping) ★", precision: 57, recall: 90, f1: 70, threshold: 0.3328, hl: true  },
  { name: "XGBoost v1 (same inputs as LightGBM v2)",     precision: 54, recall: 90, f1: 67, threshold: 0.9936, hl: false },
  { name: "LightGBM v3 (+ time gap features)",           precision: 46, recall: 90, f1: 61, threshold: 0.1801, hl: false },
  { name: "XGBoost v2 (same inputs as LightGBM v3)",     precision: 52, recall: 90, f1: 66, threshold: 0.9813, hl: false },
];

const modelProgressionData = [
  { run: "LGBM v1", f1: 32, precision: 20 },
  { run: "LGBM v2", f1: 70, precision: 57 },
  { run: "XGB v1",  f1: 67, precision: 54 },
  { run: "LGBM v3", f1: 61, precision: 46 },
  { run: "XGB v2",  f1: 66, precision: 52 },
];

const confusionBest = [
  { label: "True Positive",  value: 691,     sub: "Fraud correctly flagged",      fill: CHART_COLORS.success },
  { label: "False Negative", value: 77,      sub: "Fraud cases missed",           fill: CHART_COLORS.danger  },
  { label: "False Positive", value: 521,     sub: "Legitimate flagged as fraud",  fill: CHART_COLORS.warning },
  { label: "True Negative",  value: 1271235, sub: "Legitimate correctly cleared", fill: CHART_COLORS.secondary },
];

const shapMissedCaseDrivers = [
  { feature: "Account drain not extreme", score: 88, fill: CHART_COLORS.warning },
  { feature: "Recipient not first-seen", score: 74, fill: CHART_COLORS.secondary },
  { feature: "Recipient frequency near normal", score: 63, fill: CHART_COLORS.secondary },
  { feature: "Zero-balance flags absent", score: 56, fill: CHART_COLORS.muted },
  { feature: "Amount in overlap band", score: 49, fill: CHART_COLORS.muted },
];

// ── TOOLTIP ────────────────────────────────────────────────────────────────

type TooltipPayloadItem = {
  name?: string;
  value?: string | number | ReadonlyArray<string | number>;
  color?: string;
};

function Tip({ active, payload, label }: {
  active?: boolean; payload?: TooltipPayloadItem[]; label?: string | number;
}): React.JSX.Element | null {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: 8, fontSize: 13, color: "var(--foreground)", fontFamily: FONT_MONO }}>
      <div style={{ color: CHART_COLORS.primary, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color ?? "var(--foreground)" }}>
          {p.name}: <span style={{ fontWeight: 600 }}>{String(p.value ?? "")}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>{title}</div>
      {subtitle ? <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 16 }}>{subtitle}</div> : <div style={{ marginBottom: 16 }} />}
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

function TableRow({ cells, highlight, cols }: { cells: (string | number)[]; highlight?: boolean; cols?: string }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols ?? `3fr repeat(${cells.length - 1}, 1fr)`,
      fontSize: 13, padding: "10px 14px",
      color: highlight ? CHART_COLORS.primary : "var(--foreground)",
      background: highlight ? "rgba(99,102,241,0.08)" : "transparent",
      borderBottom: "1px solid var(--border)",
      fontFamily: highlight ? FONT_MONO : "inherit",
    }}>
      {cells.map((c, i) => <span key={i}>{c}</span>)}
    </div>
  );
}

export const workPageSections = [
  { id: "fraud-overview",     label: "Introduction" },
  { id: "fraud-dataset",      label: "Data & EDA" },
  { id: "fraud-experimental", label: "Experimental Analysis" },
  { id: "fraud-features",     label: "Feature Engineering" },
  { id: "fraud-modelling",    label: "Modelling" },
  { id: "fraud-conclusions",  label: "Conclusions" },
  { id: "fraud-appendix",     label: "Appendix" },
] as const;

export default function FraudDetectionAnalysis(props: WorkPageProps) {
  return (
    <WorkReportShell {...props}>
      <div style={{ color: "var(--foreground)", fontFamily: FONT_SANS, textAlign: "left" }}>

        {/* HERO */}
        <div style={{ borderBottom: "1px solid var(--border)", padding: "72px 0 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, backgroundSize: "48px 48px", opacity: 0.3 }} />
          <div style={{ position: "absolute", top: "-20%", left: "60%", width: 600, height: 600, background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>Data Analysis · Fraud Detection · Financial Behaviour</span>
              <Tag color={CHART_COLORS.success}>Complete</Tag>
            </div>
            <h1 style={{ fontFamily: FONT_SANS, fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.15, color: "var(--foreground)", letterSpacing: -0.02 }}>
              Transaction Fraud Anomaly<br /><span style={{ color: CHART_COLORS.primary }}>Analysis and Detection</span>
            </h1>
            <Body style={{ maxWidth: 660, marginBottom: 24 }}>
              This report studies the PaySim synthetic financial dataset to answer three questions:
              what fraudulent transactions look like, which observable patterns make them detectable,
              and how far a realistic detection model can reasonably go. The analysis is organised
              as an introduction, a question-oriented body, conclusions, and an appendix with
              supporting technical detail.
            </Body>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{props.entry.tags?.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>

          {/* 01 OVERVIEW */}
          <div id="fraud-overview" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="Introduction" />
            <Body>
              I worked through the PaySim dataset, a synthetic simulation of mobile money
              transactions, to understand how fraud behaves and what patterns distinguish it from
              legitimate activity. The main conclusion is structural rather than model-specific: a
              large part of the fraud signal in this dataset is only visible after a transaction has
              already settled, and that information would not be available in a real system trying to
              stop fraud before it happens.
            </Body>
            <Body>
              The report therefore separates two questions. First, what does the data show when we
              have access to everything, including what happened to account balances after the fact?
              Second, what remains when we restrict ourselves to only what a real system would
              actually know at the moment of decision? The answer is that the realistic setting still
              works, but the strongest reliable signal is much smaller and comes from a handful of
              observable patterns rather than rich account history.
            </Body>
            <Notice color={CHART_COLORS.danger} icon="▲">
              PaySim is best treated as a study of what a synthetic fraud dataset allows and does
              not allow. The strongest signal requires information that only exists after a
              transaction settles, and the vast majority of senders appear only once, so account
              history contributes very little. The supporting detail behind these conclusions is
              collected in the appendix.
            </Notice>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 24 }}>
              <StatCard label="Total Transactions" value="6.36M" sub="all 5 types, full 31-day simulation" />
              <StatCard label="Total Fraud" value="8,213" sub="0.13% of all transactions" color={CHART_COLORS.danger} />
              <StatCard label="Fraud Types" value="2" sub="only transfers and cash-outs contain any fraud" color={CHART_COLORS.warning} />
              <StatCard label="Account Drain" value="100%" sub="the typical fraud empties the entire sender balance in one move" color={CHART_COLORS.danger} />
              <StatCard label="Best Realistic Recall" value="90%" sub="using only information available before a transaction settles" color={CHART_COLORS.success} />
              <StatCard label="Best Realistic F1" value="0.70" sub="57% of flagged transactions are genuine fraud; 691 of 768 fraud cases caught" color={CHART_COLORS.primary} />
            </div>
          </div>

          {/* 02 DATASET & EDA */}
          <div id="fraud-dataset" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="Data & EDA" />
            <Body>
              The dataset covers 6,362,620 transactions across 31 days of simulated hourly
              activity. Two types of account appear throughout: consumer accounts and merchant
              accounts. All sending accounts are consumer accounts without exception. Merchant
              accounts show zeroed balances throughout the simulation, since business balances are
              not tracked. This makes all payment transactions exclusively consumer-to-merchant and
              means the recipient balance reads as zero for roughly a third of all rows, which is not a
              data error, but a structural feature of the simulation.
            </Body>
            <Body>
              The first structural finding came from tracing who sends to whom. Every sender is a
              consumer. Merchants only appear as recipients. Fraud, as the next chart shows, is
              confined entirely to the two transaction types where money moves between consumer
              accounts or is cashed out, but never in payments to merchants.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 1: Fraud Rate by Transaction Type" subtitle="Fraud concentrates entirely in transfers and cash-outs. The three remaining transaction types record zero fraud across all 6.36M rows.">
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={transactionTypeFraudRate}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="type" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="rate" orientation="left" domain={[0, 1]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis yAxisId="count" orientation="right" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1e6).toFixed(1)}M`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <Bar yAxisId="count" dataKey="count" name="Total Transactions" fill="var(--border)" radius={[4,4,0,0]} opacity={0.4} />
                    <Bar yAxisId="rate"  dataKey="rate"  name="Fraud Rate %" radius={[4,4,0,0]}>
                      {transactionTypeFraudRate.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Transfers carry 0.769% fraud across only 532,909 rows. Cash-outs at 0.184% cover
                  2.24M rows. Volume and fraud rate are inversely related here: the transaction type
                  with the highest fraud rate is the second smallest by volume. Payments, cash-ins,
                  and debits have zero fraud across all 3.59M rows combined.
                </Body>
              </ChartCard>

              <ChartCard title="Chart 2: Transaction Size by Fraud Class" subtitle="Fraud transactions average 1.35M vs 155k for legitimate ones, a ratio of 8.72x. Legitimate activity clusters almost entirely below 200k.">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={amountDistributionData}>
                    <defs>
                      <linearGradient id="gradFraud" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={CHART_COLORS.danger}    stopOpacity={0.4} />
                        <stop offset="95%" stopColor={CHART_COLORS.danger}    stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="gradNonFraud" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={CHART_COLORS.secondary} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="bucket" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="nonFraud" name="Non-Fraud %" stroke={CHART_COLORS.secondary} fill="url(#gradNonFraud)" strokeWidth={2} />
                    <Area type="monotone" dataKey="fraud"    name="Fraud %"     stroke={CHART_COLORS.danger}    fill="url(#gradFraud)"    strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Legitimate transactions pile up at low amounts: 73.6% fall below 200k. Fraud
                  spreads across the 200k to 2M range, which on its own is a strong raw signal. The
                  more interesting signal sits in how that amount compares to what the sender
                  actually had available, which is covered in the feature engineering section.
                </Body>
              </ChartCard>
            </div>

            <Body>
              The pattern of who appears as a recipient adds another dimension. Recipients showing
              up for the first time in the data have a substantially higher fraud rate than accounts
              that have been seen before. This makes intuitive sense in the context of how
              fraudsters operate: a newly seen destination account is more likely to have been
              purpose-built to receive stolen funds than an account with real transaction history
              already behind it.
            </Body>

            <ChartCard title="Chart 3A: Weekly Trend by Inferred Day Index (Qualitative)" subtitle="Based on inferred timestamps from the simulation step counter, not explicit calendar weekdays. Day 1 to Day 7 show relative within-week trend shape only.">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dayOfWeekFraudTrendQualitative}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="dayIndex" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 120]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="index" name="Relative Fraud Index" stroke={CHART_COLORS.orange} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                Fraud activity is not flat across a 7-day cycle. Since the dataset records time as
                simulation steps rather than real calendar dates, Day 1 through Day 7 are positional
                labels only. This chart shows directional trend guidance, not exact calendar
                attribution.
              </Body>
            </ChartCard>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 3: Fraud Rate by Recipient Visit Status" subtitle="First-time recipients have a 2.3x higher fraud rate than those seen before. Both figures shown against the overall dataset rate.">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={receiverVisitRankData} layout="vertical" barCategoryGap="28%">
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 0.25]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toFixed(3)}%`} />
                    <YAxis type="category" dataKey="category" width={175} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <Bar dataKey="rate" name="Fraud Rate %" radius={[0,4,4,0]}>
                      {receiverVisitRankData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                    <ReferenceLine x={0.129} stroke={CHART_COLORS.muted} strokeDasharray="4 4" />
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  First-time recipients at 0.190% sit above the 0.129% base rate. Repeat recipients
                  at 0.083% sit below it. The split is meaningful but not extreme, since most senders
                  also appear only once, which limits how much recipient history can actually
                  accumulate in the first place.
                </Body>
              </ChartCard>

              <ChartCard title="Chart 4: Fraud Rate by Sender and Recipient Activity Level" subtitle="Analysis on 2.77M transfer and cash-out rows. Most volume sits in first-time senders with repeat recipients, at just 0.19% fraud rate.">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={frequencyBucketFraudRate} layout="vertical" barCategoryGap="28%">
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 4.5]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="bucket" width={180} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <Bar dataKey="fraudRate" name="Fraud Rate %" radius={[0,4,4,0]}>
                      {frequencyBucketFraudRate.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Repeat senders sending to a first-time recipient at 3.75% shows the highest fraud
                  concentration, but covers only 160 transactions. The dominant pattern, a
                  first-time sender with a repeat recipient, covers 2.64M rows at just 0.19%. The
                  first-time sender to first-time recipient bucket at 2.42% across 128,171 rows
                  is the only combination with both meaningful volume and a notably elevated rate.
                </Body>
              </ChartCard>
            </div>

            <ChartCard title="Chart 4A: Untracked Account Signal (Qualitative)" subtitle="Relative risk from accounts with no tracked balance history on either side of a transaction. These accounts sharply increase fraud likelihood.">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={untrackedAccountSignalQualitative} layout="vertical" barCategoryGap="28%">
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" domain={[0, 110]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="segment" width={190} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Bar dataKey="signal" name="Relative Risk Index" fill={CHART_COLORS.warning} radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
              <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                This mirrors the experimental finding that accounts with no balance history anywhere
                in the simulation are near-deterministic fraud indicators. It explains why adding
                these flags can push an unrestricted model to a perfect score, while being
                completely unusable in a real-time system that has to decide before a transaction
                settles.
              </Body>
            </ChartCard>

            <Body>
              Balance consistency checks surfaced several patterns worth documenting. Roughly 20%
              of rows showed a recipient balance decreasing after receiving money, explained by
              concurrent transactions running simultaneously in the simulation. Transactions where
              the sender's balance did not move at all despite a non-zero amount had a fraud rate
              of 30.8%, though this covers only 52 transactions with 16 fraud cases. All 16
              zero-amount transactions in the entire dataset are labelled fraud, though they
              represent 0.00025% of rows, too rare to be useful as a detection rule. Counterintuitively,
              transactions where both sender and recipient balances reconciled perfectly to the
              sent amount showed a higher fraud rate than transactions where only one side matched.
              This is because the simulation models fraud with precise accounting, while legitimate
              concurrent transactions introduce natural reconciliation noise on the recipient side.
            </Body>
            <Body>
              The simulation's own built-in fraud flag was benchmarked against the actual labels.
              It catches nothing in the validation window: precision zero, recall zero. It provides
              no useful comparison baseline.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 16 }}>
              {[
                { icon: "▲", color: CHART_COLORS.danger,      text: "Fraud is exclusive to transfers (0.769%) and cash-outs (0.184%). Payments, cash-ins, and debits contain zero fraud across all 6.36M rows. The model keeps all transaction types and lets that boundary speak for itself." },
                { icon: "▲", color: CHART_COLORS.danger,      text: "All transactions with a sent amount of zero are labelled fraud. This covers 16 cases across the full dataset, 0.00025% of rows. The signal is real but far too rare to be useful as a standalone detection rule." },
                { icon: "○", color: "var(--muted-foreground)", text: "All senders are consumer accounts, so there is no variation there. Every sender-recipient pair in the entire dataset appears exactly once, so there is no history of prior interactions between any two accounts to draw on." },
                { icon: "▲", color: CHART_COLORS.warning,     text: "Over 99% of senders appear exactly once. Sender-side history is essentially non-existent. Any pattern built from a sender's past behaviour is dominated by first-time actors with no history to compare against." },
                { icon: "▼", color: CHART_COLORS.success,     text: "Fraud amounts are 8.72x larger on average. At the median, fraud transactions drain the entire sender balance in one move: the typical fraud sends 100% of what's available, while a legitimate user sends roughly one-sixth." },
                { icon: "▲", color: CHART_COLORS.danger,      text: "The simulation's built-in fraud detection catches zero fraud cases in the validation window. It is not a useful benchmark for comparison." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "14px 16px", border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)", display: "flex", gap: 10 }}>
                  <span style={{ color: item.color, fontSize: 16, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <Body style={{ fontSize: 13, margin: 0 }}>{item.text}</Body>
                </div>
              ))}
            </div>
          </div>

          {/* 03 EXPERIMENTAL PHASE */}
          <div id="fraud-experimental" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Experimental Phase" />
            <Body>
              Before building the realistic pipeline, I ran a deliberate experimental phase with
              access to everything, including what happened to account balances after each
              transaction settled. The goal was to understand the dataset's theoretical ceiling and
              identify exactly which pieces of information make fraud detectable at all. The
              experimental split used 70% of data for training, 15% for validation, and 15% held
              out for testing, all divided in chronological order.
            </Body>
            <Body>
              The experimental feature set included post-settlement balance information directly:
              whether the sender's balance dropped by exactly the amount sent, whether the
              recipient's balance rose by a matching amount, and whether either account showed zero
              balance activity throughout the entire simulation. This last flag identifies accounts
              that have no tracked balance at any point, which turns out to be a
              near-deterministic fraud indicator in this dataset.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 5: Feature Importance (Experimental Model)" subtitle="Removing either of the two post-settlement balance checks causes the model to collapse. Everything else contributes relatively little by comparison.">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={permutationImportance} layout="vertical" barCategoryGap="18%">
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="feature" width={230} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <Bar dataKey="importance" name="Feature Importance" radius={[0,4,4,0]}>
                      {permutationImportance.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  The model's ability to detect fraud almost entirely depends on one question: did the
                  sender's balance drop by exactly the amount sent? In PaySim, the answer is almost
                  always yes for fraud and often no for legitimate transactions due to concurrent
                  activity. Knowing the sender's balance after settlement adds further precision.
                  Both answers are only available after the fact.
                </Body>
              </ChartCard>

              <ChartCard title="Chart 6: Precision at Every Sensitivity Level (Experimental Model)" subtitle="Even the most lenient version of this model achieves 87% precision. When the fraud signal is this direct, the model cannot make a meaningful mistake.">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={experimentalThresholdSweep}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="threshold" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 105]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                    <Line type="monotone" dataKey="precision" name="Precision %" stroke={CHART_COLORS.warning} strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="recall"    name="Recall %"    stroke={CHART_COLORS.success} strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="f1"        name="F1 %"        stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ r: 3 }} />
                    <ReferenceLine x={0.9989} stroke={CHART_COLORS.danger} strokeDasharray="4 4" label={{ value: "0.9989 optimal", fill: CHART_COLORS.danger, fontSize: 10 }} />
                  </LineChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Across every sensitivity level tested, precision starts at 87% and climbs to 100%
                  as the model becomes more selective. Recall holds at 100% throughout. This
                  near-perfect flatness is the hallmark of a model that has been handed the answer
                  rather than having to learn it.
                </Body>
              </ChartCard>
            </div>

            <Body>
              Adding flags for accounts with no tracked balance history on either side produced a
              perfect result: all 562 fraud cases caught, zero missed, zero false alarms. This is
              not a detection achievement. It is a demonstration that PaySim encodes fraud
              structurally into account balance states, and a model with access to those states
              trivially reads the answer back out.
            </Body>

            <Body>
              Appendix A contains the full experimental comparison table, including the unrestricted
              configuration and the sensitivity sweep details used to identify the ceiling. The body
              keeps the charts and interpretation, while the appendix carries the model outputs for
              technical review.
            </Body>

            <Notice color={CHART_COLORS.danger} icon="▲">
              These results are not a benchmark. A fraud detection system cannot use information
              about what happened after a transaction settled to decide whether to allow that same
              transaction. The experimental phase exists to answer one question: what makes fraud
              detectable in PaySim at all? The answer is account reconciliation data that only
              exists after the fact. That is what the realistic model has to work without.
            </Notice>
          </div>

          {/* 04 FEATURE ENGINEERING */}
          <div id="fraud-features" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Feature Engineering" />
            <Body>
              The realistic pipeline was built under a strict constraint: no information requiring
              knowledge of what happened after the transaction. Both post-settlement balance columns
              were removed before any calculation was done. The pipeline works on the full
              unfiltered 6.36M row dataset, keeping all five transaction types and training on
              3,817,572 rows containing 3,191 fraud cases.
            </Body>
            <Body>
              Each candidate signal was screened using a measure of how much information it shares
              with the fraud label. Those scores were used as a starting filter, but every signal
              was also validated with a direct comparison of fraud versus legitimate transaction
              patterns before being included in any model run. Features were added in small groups
              so the contribution of each could be isolated.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 7: Average Values by Fraud Class (Training Set)" subtitle="Recipient balance is inverted: fraud recipients average 467k vs 994k for legitimate ones. Lower destination balances suggest purpose-built receiving accounts.">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={featureRatioData} layout="vertical">
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 100000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}`} />
                    <YAxis type="category" dataKey="feature" width={190} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                    <Bar dataKey="fraudMean"    name="Fraud Mean"     fill={CHART_COLORS.danger}    radius={[0,4,4,0]} />
                    <Bar dataKey="nonFraudMean" name="Non-Fraud Mean" fill={CHART_COLORS.secondary} radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  Transaction size ratio: 8.72x (1.35M vs 155k). Fraud senders carry larger balances
                  on average (1.44M vs 838k), meaning larger accounts are specifically targeted.
                  Recipient frequency is inverted: fraud flows to recipients with fewer prior
                  appearances (3.59 vs 5.99).
                </Body>
              </ChartCard>

              <ChartCard title="Chart 8: Account Drain Ratio by Class" subtitle="How much was sent compared to what the sender had available. A ratio of 1.0 means the entire balance was sent. Fraud median: 1.0000. Legitimate median: 6.2782.">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={amountToBalRatioData} layout="vertical" barCategoryGap="35%">
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 8]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}x`} />
                    <YAxis type="category" dataKey="class" width={90} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <ReferenceLine x={1} stroke={CHART_COLORS.danger} strokeDasharray="4 4" label={{ value: "full drain", fill: CHART_COLORS.danger, fontSize: 10, position: "top" }} />
                    <Bar dataKey="median" name="Median Ratio" radius={[0,4,4,0]}>
                      {amountToBalRatioData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                  The fraud median of exactly 1.0000 means the typical fraudulent transaction
                  sends everything the account holds in a single move. Legitimate transactions at
                  6.28 represent users sending roughly one-sixth of their available balance. This
                  single ratio captures the account-drain behaviour more cleanly than raw transaction
                  size alone.
                </Body>
              </ChartCard>
            </div>

            <Body>
              Several signals that appeared promising turned out to be either constant or unlearnable
              once examined. The count of prior interactions between each sender-recipient pair was
              always zero: every sender-recipient combination in the dataset appeared exactly once
              without exception. A flag for zero-amount transactions appeared only three times in
              training data, making it unlearnable. Sender activity history had an information score
              of zero with identical averages for fraud and legitimate cases. These were all confirmed
              as dead signals and dropped before any model run.
            </Body>
            <Body>
              The time-based signals were the most instructive failure. Calculating how long it had
              been since a sender's previous transaction produced a column dominated by placeholder
              fill values. Since over 99% of senders appear exactly once, there is no prior
              transaction to measure a gap from. After excluding first-time senders from the
              comparison, fraud and legitimate distributions overlapped completely. The recipient
              equivalent scored highest of all signals in initial screening, but when both fraud
              and legitimate cases shared identical median values, that score was revealed as an
              artefact of the fill pattern rather than a real difference in behaviour. Adding these
              time-based signals to the model caused precision to drop from 57% to 46%.
            </Body>

            <ChartCard title="Chart 8A: Time Gap Diagnostic: Identical Medians for Both Classes" subtitle="Both fraud and legitimate transactions share the same median time-since-last-visit values, which is why the high screening score turned out to be misleading.">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={timeSignalDiagnostic}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(Number(v)/3600)}h`} />
                  <Tooltip content={<Tip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
                  <Bar dataKey="senderGapSec" name="Sender gap median (sec)" fill={CHART_COLORS.muted} radius={[4,4,0,0]} />
                  <Bar dataKey="receiverGapSec" name="Receiver gap median (sec)" fill={CHART_COLORS.warning} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                Even with the highest initial screening score, the time-since-last-visit signal
                produces identical class medians. This chart explains the precision drop seen
                when those features were added to the model: the signal looked informative in
                aggregate but did not separate fraud and legitimate activity at the distribution
                level.
              </Body>
            </ChartCard>

            <Body>
              The account drain ratio, calculated as the sent amount divided by the sender's
              available balance, was the biggest single improvement. Fraud transactions have a
              median ratio of 1.0, meaning the typical fraud empties the entire account in one
              move. Legitimate transactions have a median of 6.28, meaning users typically send
              about one-sixth of what they have available. Adding this one ratio pushed precision
              from 20% to 57% while holding recall at 90%.
            </Body>

            <ChartCard title="Chart 9: Signal Screening Scores (All Features)" subtitle="* The highest-scoring signal turned out to be artefactual: fraud and legitimate cases share identical median values. The chart above confirms why.">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={miScores} layout="vertical" barCategoryGap="12%">
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" domain={[0, 0.13]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="feature" width={215} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Bar dataKey="score" name="Signal Strength Score" radius={[0,4,4,0]}>
                    {miScores.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                The zero-balance sender flag leads the genuine signals, followed by how often the
                recipient has appeared before. The sender's own activity history scored zero, confirming that sender-side history contributes nothing. The misleading top score
                is entirely driven by how placeholder values were filled, not by any real difference
                in behaviour between fraud and legitimate cases.
              </Body>
            </ChartCard>

            <Body>
              Appendix B lists the full set of signals used in the final model and the short
              rationale for each one retained. That table is moved out of the main body because
              it is useful for technical review but not central to the report's narrative.
            </Body>

            <div style={{ marginTop: 20 }}>
              <Notice color={CHART_COLORS.warning} icon="◈">
                All sender-side behavioural signals were dropped. Sender activity history scored
                zero with identical averages for both classes. Time-since-last-sender-transaction
                and total sender interactions were dominated by placeholder fill artefacts from
                over 99% of senders appearing exactly once. These signals introduced noise rather
                than signal and were confirmed as dead before being included in any model run.
              </Notice>
            </div>
          </div>

          {/* 05 MODELLING */}
          <div id="fraud-modelling" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Modelling" />
            <Body>
              The full 6,362,620 row dataset was split chronologically: 60% for training, 20% for
              validation, and 20% held out as a test set not touched during development. The training
              period covered roughly the first 12 days, validation the next three, and test the
              final two weeks. All tuning used the validation set, with fraud recall constrained to
              a minimum of 90%, meaning the model had to catch at least 9 in 10 fraud cases.
            </Body>
            <Body>
              Five configurations were run in total. After each LightGBM run, XGBoost was run on
              the same inputs as a comparison. The primary metric was how precisely the model could
              flag fraud while meeting the 90% recall requirement. The confidence threshold, the point at which the model commits to calling something fraud, was treated as a
              diagnostic signal throughout. A model forced to use a very high threshold to achieve
              90% recall is one whose confidence scores have collapsed into the top of the range:
              it has to wait until it is almost certain before committing, which means it struggles
              with the ambiguous cases.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Chart 10: Precision and F1 Across Model Variants (90% recall floor)" subtitle="LightGBM v2 is the peak. LightGBM v3 added time-based signals that looked promising in screening but regressed precision from 57% to 46%.">
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={modelProgressionData}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="run" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 80]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
                    <Bar dataKey="precision" name="Precision %" fill={CHART_COLORS.secondary} radius={[4,4,0,0]} />
                    <Bar dataKey="f1"        name="F1 %"        fill={CHART_COLORS.primary}   radius={[4,4,0,0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <Body>
              LightGBM v1 used only 100 decision trees and ran out of useful patterns to learn
              early. As a result, the model was not very confident in most of its fraud predictions
              and had to use a high threshold just to reach the 90% recall floor. Precision at that
              point was 20%: one genuine fraud case caught for every four false alarms.
            </Body>
            <Body>
              LightGBM v2 added the account drain ratio and significantly more learning capacity.
              The model's confidence scores spread naturally across the full range, indicating it
              had genuinely learned to separate fraud from legitimate activity rather than defaulting
              to flagging anything unusual and hoping. Precision jumped from 20% to 57%, the
              largest single improvement across all runs, driven almost entirely by one engineered
              ratio.
            </Body>
            <Body>
              XGBoost on the same inputs as LightGBM v2 pushed its fraud confidence scores into a
              very narrow high-certainty band, requiring an extremely high threshold. Despite
              achieving similar precision at 54%, this pattern suggests the model's outputs are less
              well-calibrated, leaving it with less room to distinguish borderline cases from
              clear-cut ones.
            </Body>
            <Body>
              LightGBM v3 added three time-based signals. Precision dropped from 57% to 46% and
              F1 from 0.70 to 0.61, a direct regression. Despite scoring well in initial
              screening, the time signals did not separate fraud from legitimate activity at the
              distribution level, as confirmed by the identical class medians shown earlier.
              Adding them introduced noise the model could not ignore.
            </Body>

            <ChartCard title="Chart 11: What Missed Fraud Cases Have in Common (Qualitative)" subtitle="Relative contribution ranking from a review of false negatives, meaning fraud cases the model failed to catch.">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={shapMissedCaseDrivers} layout="vertical" barCategoryGap="20%">
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="feature" width={230} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Bar dataKey="score" name="Relative Contribution" radius={[0,4,4,0]}>
                    {shapMissedCaseDrivers.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Body style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                Missed fraud cases sit near the decision boundary: the account drain was not extreme
                enough to flag confidently, the recipient had more prior activity than typical fraud
                targets, and none of the supporting signals were present. These are edge cases with
                genuinely ambiguous behaviour, not blind spots in the model's design.
              </Body>
            </ChartCard>

            <Body>
              Appendix C contains the full model comparison table and the LightGBM v2 confusion
              matrix. The body keeps the interpretation, while the appendix preserves the exact
              figures for technical inspection and reproducibility.
            </Body>

            <Notice color={CHART_COLORS.warning} icon="◈">
              The confidence threshold is more informative than any single accuracy metric.
              Three of the five configurations required a near-certain threshold to hit 90% recall,
              which signals that their confidence scores had all piled up at the top rather than
              spreading naturally. LightGBM v2's much more central threshold is the evidence
              that it learned genuine patterns: it knows which transactions are probably fraud
              rather than just assigning high scores to everything unusual and waiting.
            </Notice>
          </div>

          {/* 06 CONCLUSIONS */}
          <div id="fraud-conclusions" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Conclusions and Lessons Learned" />
            <Body>
              The best realistic result catches 90% of fraud at 57% precision. For every 100
              transactions flagged, 57 are genuine fraud and 43 are false positives. The validation
              set contains roughly 1 fraud case per 1,656 legitimate transactions. Sustaining 90%
              recall above 50% precision under that level of imbalance, using only information
              available before a transaction settles, is a meaningful result given the structural
              constraints of the dataset.
            </Body>
            <Body>
              The more significant finding is about what PaySim actually is. The fraud signal is
              structurally built into post-settlement account states. The simulated population
              prevents meaningful account histories from accumulating. The simulation was not
              designed as a realistic test bed for pre-settlement fraud detection. These are
              constraints on the dataset, not on the approach. Any result reported on PaySim without
              acknowledging the post-settlement leakage issue should be treated with caution.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {[
                {
                  title: "The Account Drain Signal is Real",
                  color: CHART_COLORS.danger,
                  body: "The clearest behavioural finding in the data is that fraudsters consistently empty the account in a single move. A simple ratio comparing the sent amount to the sender's available balance captured this and drove the largest model improvement across all runs, going from 20% to 57% precision.",
                },
                {
                  title: "Check Whether a Signal Actually Separates the Classes",
                  color: CHART_COLORS.warning,
                  body: "A time-based signal scored highest in initial screening but turned out to be misleading: both fraud and legitimate cases had identical median values, and the high score was driven by how placeholder values were filled. Always confirm a signal separates the classes in practice, not just in aggregate.",
                },
                {
                  title: "Adding Signals Can Hurt",
                  color: CHART_COLORS.secondary,
                  body: "Three additional signals that looked promising in screening caused precision to drop from 57% to 46%. Initial scoring alone is not sufficient. The median comparison told a different story, and running that check first would have avoided the regression entirely.",
                },
                {
                  title: "Unrestricted Experiments Have Analytical Value",
                  color: CHART_COLORS.purple,
                  body: "Running the experiment with full post-settlement access confirmed that the fraud signal is real and deterministic in PaySim, identified precisely which information causes the leakage, and set a concrete performance ceiling. Without it, an F1 of 0.70 from the realistic model would have been harder to contextualise and easier to overstate.",
                },
              ].map((card) => (
                <div key={card.title} style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: card.color, marginBottom: 8 }}>{card.title}</div>
                  <Body style={{ fontSize: 13, margin: 0 }}>{card.body}</Body>
                </div>
              ))}
            </div>
          </div>

          {/* 07 APPENDIX */}
          <div id="fraud-appendix" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={7} title="Appendix" />

            <Body>
              The appendix collects supporting material useful for technical review but not central
              to the main report narrative. Appendix A records the experimental comparison,
              Appendix B records the final realistic feature set, and Appendix C records the
              modelling summary and validation-set confusion matrix.
            </Body>

            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>
                Appendix A. Experimental Model Comparison
              </div>
              <div style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", borderBottom: "1px solid var(--border)" }}>
                  {["Model", "Precision", "Recall", "F1"].map(h => (
                    <div key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)" }}>{h}</div>
                  ))}
                </div>
                {experimentalModelComparison.map(({ name, precision, recall, f1, hl }) => (
                  <TableRow key={name} cells={[name, `${precision}%`, `${recall}%`, `${f1}%`]} highlight={hl} cols="3fr 1fr 1fr 1fr" />
                ))}
                <Body style={{ fontSize: 12, marginTop: 14, marginBottom: 0 }}>
                  The experimental rows confirm that the unrestricted configuration reduces detection
                  to a bookkeeping exercise. The perfect-score row is included for completeness, not
                  as a meaningful benchmark.
                </Body>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>
                Appendix B. Realistic Feature Inventory
              </div>
              <div style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>Signal</div>
                  <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>What it captures</div>
                  {[
                    ["Transaction type",              "All 5 types included. The model learns that payments, cash-ins, and debits carry zero fraud."],
                    ["Transaction amount",            "Raw size of the transaction. Fraud average 1.35M vs legitimate 155k, a ratio of 8.72x."],
                    ["Account drain ratio",           "How much was sent relative to what was available. Fraud median 1.00 (entire balance sent) vs 6.28 for legitimate transactions. Most impactful signal."],
                    ["Sender's available balance",    "How much the sender had before the transaction. Fraud senders average 1.44M vs 838k for legitimate, meaning larger accounts are specifically targeted."],
                    ["Recipient's available balance", "How much the recipient had before receiving. Inverted signal: fraud recipients average 467k vs 994k for legitimate, suggesting purpose-built destination accounts."],
                    ["Sender has zero balance",       "Whether the sender's balance is zero. Strongest genuine screening score in the final feature set."],
                    ["Recipient has zero balance",    "Whether the recipient's balance is zero. Fraud recipients show this more often (65% vs 42% for legitimate)."],
                    ["Recipient activity count",      "How many times this recipient has appeared in the data so far. Fraud recipients average 3.59 appearances vs 5.99 for legitimate."],
                    ["Recipient total interactions",  "Cumulative appearances across all transaction roles."],
                    ["First-time recipient",          "Whether this is the first appearance of this recipient ID. First-time recipients show a 2.3x higher fraud rate than those seen before."],
                  ].map(([f, d]) => (
                    <div key={f} style={{ display: "contents" }}>
                      <div style={{ padding: "10px 12px", fontSize: 12, fontFamily: FONT_MONO, color: CHART_COLORS.primary, borderBottom: "1px solid var(--border)" }}>{f}</div>
                      <div style={{ padding: "10px 12px", fontSize: 13, color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>
                Appendix C. Modelling Summary
              </div>
              <div style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid var(--border)" }}>
                  {["Model", "Precision", "Recall", "F1", "Threshold"].map(h => (
                    <div key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)" }}>{h}</div>
                  ))}
                </div>
                {cleanModelComparison.map(({ name, precision, recall, f1, threshold, hl }) => (
                  <TableRow key={name} cells={[name, `${precision}%`, `${recall}%`, `${f1}%`, threshold.toFixed(4)]} highlight={hl} cols="3fr 1fr 1fr 1fr 1fr" />)
                )}
              </div>

              <div style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                  LightGBM v2 Validation Confusion Matrix
                </div>
                <Body style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>
                  At the optimal threshold, precision is 57% and recall is 90% against 768 fraud
                  cases in 1,272,524 validation rows.
                </Body>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {confusionBest.map((cell) => (
                    <div key={cell.label} style={{ padding: "16px 12px", borderRadius: 8, border: `1px solid ${cell.fill}44`, background: `${cell.fill}11`, textAlign: "center" }}>
                      <div style={{ fontSize: cell.value > 10000 ? 20 : 28, fontWeight: 700, fontFamily: FONT_MONO, color: cell.fill, lineHeight: 1.1, marginBottom: 6 }}>
                        {cell.value.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>{cell.label}</div>
                      <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{cell.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </WorkReportShell>
  );
}