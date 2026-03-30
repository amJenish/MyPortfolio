import { useState, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, ScatterChart, Scatter,
  ReferenceLine,
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

// Model comparison: actual results from the notebook
const modelComparison = [
  { model: "Linear Reg.", r2: 87.4, fill: CHART_COLORS.danger },
  { model: "Random Forest", r2: 89.5, fill: CHART_COLORS.warning },
  { model: "CatBoost", r2: 91.4, fill: CHART_COLORS.secondary },
  { model: "XGB Full (73)", r2: 92.2, fill: CHART_COLORS.warning },
  { model: "XGB Selected ★", r2: 92.6, fill: CHART_COLORS.secondary },
];

// Feature importance from RF (cell 137), capped at top 10, deduplicated
const featureImportance = [
  { feature: "OverallQual",          importance: 62.2 },
  { feature: "GrLivArea",            importance: 12.7 },
  { feature: "2ndFlrSF",             importance: 3.9  },
  { feature: "BsmtFinSF1",           importance: 2.5  },
  { feature: "1stFlrSF",             importance: 2.4  },
  { feature: "TotalBsmtSF",          importance: 1.6  },
  { feature: "GarageCars",           importance: 1.3  },
  { feature: "LotArea",              importance: 1.2  },
  { feature: "BsmtHeight",           importance: 1.0  },
  { feature: "exterior_1_age_score", importance: 0.8  },
];

// Missing value counts from df.isnull().sum() output
const missingValues = [
  { feature: "Alley",       missing: 1369, pct: 93.8, fill: CHART_COLORS.danger },
  { feature: "PoolQC",      missing: 1453, pct: 99.5, fill: CHART_COLORS.danger },
  { feature: "MiscFeature", missing: 1406, pct: 96.3, fill: CHART_COLORS.warning },
  { feature: "Fence",       missing: 1179, pct: 80.8, fill: CHART_COLORS.warning },
  { feature: "FireplaceQu", missing: 690,  pct: 47.3, fill: CHART_COLORS.warning },
  { feature: "MasVnrType",  missing: 872,  pct: 59.7, fill: CHART_COLORS.warning },
  { feature: "LotFrontage", missing: 259,  pct: 17.7, fill: CHART_COLORS.secondary },
  { feature: "Garage*",     missing: 81,   pct: 5.5,  fill: "var(--muted-foreground)" },
  { feature: "Basement*",   missing: 37,   pct: 2.5,  fill: "var(--muted-foreground)" },
];

// PConc vs CBlock from cell 152 output
const foundationComparison = [
  { metric: "Mean Price ($K)",  PConc: 225, CBlock: 150 },
  { metric: "OverallQual (avg)", PConc: 6.98, CBlock: 5.42 },
  { metric: "GrLivArea (100sf)", PConc: 16.9, CBlock: 13.6 },
  { metric: "GarageCars (avg)", PConc: 2.15, CBlock: 1.50 },
];

// SaleCondition from cell 172 output
const saleConditionPrices = [
  { condition: "AdjLand",  mean: 104, fill: CHART_COLORS.danger },
  { condition: "Abnorml",  mean: 147, fill: CHART_COLORS.warning },
  { condition: "Family",   mean: 150, fill: CHART_COLORS.warning },
  { condition: "Alloca",   mean: 167, fill: CHART_COLORS.secondary },
  { condition: "Normal",   mean: 175, fill: CHART_COLORS.secondary },
  { condition: "Partial",  mean: 272, fill: CHART_COLORS.secondary },
];

// Lot shape analysis from cell 167 output
const lotShapeData = [
  { shape: "Reg",  avgPrice: 165, lotArea: 8877,  pricePerSF: 22.1, quality: 5.89 },
  { shape: "IR1",  avgPrice: 206, lotArea: 11895, pricePerSF: 19.6, quality: 6.43 },
  { shape: "IR2",  avgPrice: 240, lotArea: 23734, pricePerSF: 16.5, quality: 6.73 },
  { shape: "IR3",  avgPrice: 216, lotArea: 41338, pricePerSF: 10.7, quality: 6.80 },
];

// ── SHARED UI ─────────────────────────────────────────────────────────────────

type TooltipPayloadItem = {
  name?: string;
  value?: string | number | ReadonlyArray<string | number>;
  color?: string;
};

function Tip({
  active, payload, label,
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
          <span style={{ fontWeight: 600 }}>{typeof p.value === "number" ? p.value : p.value}</span>
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

const LOT_TABS = ["avgPrice", "lotArea", "pricePerSF", "quality"] as const;
type LotTab = (typeof LOT_TABS)[number];

const LOT_TAB_LABELS: Record<LotTab, string> = {
  avgPrice: "Avg Price ($K)",
  lotArea: "Avg Lot Area (sqft)",
  pricePerSF: "Price per Lot sqft ($)",
  quality: "Avg Overall Quality",
};

export const workPageSections = [
  { id: "housing-kpis",       label: "Overview"         },
  { id: "housing-problem",    label: "Problem"          },
  { id: "housing-cleaning",   label: "Data cleaning"    },
  { id: "housing-missing",    label: "Missing values"   },
  { id: "housing-eda",        label: "EDA"              },
  { id: "housing-features",   label: "Feature engineering" },
  { id: "housing-models",     label: "Models"           },
  { id: "housing-importance", label: "Importance"       },
  { id: "housing-tuning",     label: "Tuning"           },
  { id: "housing-next",       label: "Next steps"       },
] as const;

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function HousingPriceReport(props: WorkPageProps) {
  const [activeLotTab, setActiveLotTab] = useState<LotTab>("avgPrice");

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
            background: `radial-gradient(ellipse, ${CHART_COLORS.warning}08 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 40px", position: "relative" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>
              Machine Learning · Regression · Feature Engineering · Gradient Boosting
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
            Ames Housing:
            <br />
            <span style={{ color: CHART_COLORS.primary }}>Predicting Sale Price</span>
          </h1>

          <Body style={{ maxWidth: 660, marginBottom: 24, color: "var(--foreground)" }}>
            A regression project on the Ames Housing dataset, predicting residential sale prices from 80+ structural, locational, and quality features. The central question I set out to answer:{" "}
            <strong style={{ color: "var(--foreground)" }}>
              how much predictive power can be extracted from systematic feature engineering versus throwing all raw variables at a gradient booster?
            </strong>
          </Body>

          <Body style={{ maxWidth: 660, marginBottom: 36, color: "var(--foreground)" }}>
            My baseline Linear Regression achieved R² of <strong style={{ color: "var(--foreground)" }}>87.4%</strong>. Careful feature selection and engineering on a hand-curated 23-feature subset, combined with XGBoost and hyperparameter tuning, pushed that to{" "}
            <strong style={{ color: "var(--foreground)" }}>92.6%</strong> on the held-out test set.
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
        <div id="housing-kpis" className="scroll-mt-28" style={{ display: "flex", gap: 16, marginBottom: 80, flexWrap: "wrap" }}>
          <KPI label="Properties analysed" value="1,460" sub="Ames, Iowa residential sales from the Kaggle competition dataset" />
          <KPI label="Best R² Score" value="92.6%" sub="XGBoost on 23 hand-selected and engineered features, post-tuning" color={P.purple} />
          <KPI label="Baseline R²" value="87.4%" sub="Linear Regression on the same ordinal-encoded feature set" color={CHART_COLORS.warning} />
          <KPI label="Feature reduction" value="80 → 23" sub="Raw features reduced to a curated subset without performance loss" color={CHART_COLORS.secondary} />
        </div>

        {/* ══ 01 THE PROBLEM ══ */}
        <div id="housing-problem" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={1} title="The Problem" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0 }}>
                The Ames Housing dataset describes 1,460 residential property sales in Ames, Iowa. With 80 features spanning structural type, lot characteristics, basement configuration, garage details, exterior materials, interior quality ratings, and neighbourhood information, it poses a classic challenge in applied regression: most of the signal is concentrated in a small number of features, and the rest ranges from mildly informative to pure noise.
              </p>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85 }}>
                My goal was to predict <Mono>SalePrice</Mono> as accurately as possible. I explored two parallel strategies: first, a comprehensive approach using all engineered features (73 after transformation); second, a curated approach that distils the data down to 23 high-signal, carefully constructed features. Understanding which approach performed better, and by how much, was itself an informative finding.
              </p>
            </div>
            <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${"var(--border)"}`, fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>Dataset at a glance</div>
              {[
                ["Source",              "Kaggle Ames Housing Competition"],
                ["Training rows",       "1,460 properties"],
                ["Raw features",        "80 (35 numeric, 43 categorical, 3 float)"],
                ["Target variable",     "SalePrice - continuous, right-skewed"],
                ["Price range",         "$34,900 to $755,000"],
                ["Train / test split",  "80% / 20%, random state 42"],
                ["Numeric dtypes",      "int64 (35 cols), float64 (3 cols)"],
                ["Categorical dtypes",  "object (43 cols)"],
              ].map(([k, v]) => <TableRow key={k} label={k} value={v} />)}
            </div>
          </div>
        </div>

        {/* ══ 02 DATA CLEANING ══ */}
        <div id="housing-cleaning" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={2} title="Data Cleaning & Quality Decisions" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            The most important thing I noticed during cleaning is that the vast majority of missing values in this dataset are not missing data at all. They are semantically meaningful absences. A null in <Mono>GarageType</Mono> does not mean the garage type was not recorded; it means the property has no garage. The same logic applies to basements, fireplaces, pools, fences, and alley access. Treating these as missing would introduce a false signal into the model.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Callout color={CHART_COLORS.secondary} icon="✓">
              <strong style={{ color: "var(--foreground)" }}>Absence-aware imputation.</strong> I filled all null values in feature groups where absence is meaningful (garage, basement, pool, fireplace, fence, alley) with explicit string labels such as <Mono>No Garage</Mono>, <Mono>No Basement</Mono>, and <Mono>No Pool</Mono>. This preserves the real-world information instead of discarding it via zero-fill or median imputation.
            </Callout>
            <Callout color={CHART_COLORS.warning} icon="⚠">
              <strong style={{ color: "var(--foreground)" }}>LotFrontage: an imputation limitation.</strong> 259 properties (17.7%) have no recorded <Mono>LotFrontage</Mono>. I filled these with 0. A more rigorous alternative would have been neighbourhood-median imputation, since frontage is highly correlated with lot configuration and zoning. The zero-fill likely introduces a potential downward bias on this feature for imputed rows.
            </Callout>
            <Callout color={P.purple} icon="①">
              <strong style={{ color: "var(--foreground)" }}>Categorical encoding strategy.</strong> I mapped ordinal features such as <Mono>ExterQual</Mono>, <Mono>BsmtQual</Mono>, <Mono>KitchenQual</Mono>, and garage/basement condition to integer scales (0 to 5) reflecting their documented quality ladder. Nominal features with many categories were either one-hot encoded or dropped in favour of engineered alternatives.
            </Callout>
            <Callout color={CHART_COLORS.secondary} icon="②">
              <strong style={{ color: "var(--foreground)" }}>Near-constant features flagged for removal.</strong> I identified two features as carrying essentially no discriminative signal. <Mono>Utilities</Mono> is <Mono>AllPub</Mono> for 99.9% of properties. <Mono>PoolQC</Mono> is <Mono>No Pool</Mono> for 99.5%. I dropped both from the curated feature set, as near-zero variance features can add noise without benefit in a gradient boosting context.
            </Callout>
          </div>
        </div>

        {/* ══ 03 MISSING VALUES ══ */}
        <div id="housing-missing" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={3} title="Missing Value Structure" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            Missing values are heavily concentrated in a small number of features, and the distribution pattern is informative. The top four missing features all describe amenities that simply are not present on most properties which <area shape="rect" coords="" href="" alt="" /> not gaps in data collection. This structural missingness is distinct from the more traditional random missing-at-random pattern and demands different treatment.
          </p>

          <ChartCard
            label="Chart 1 : Missing value counts by feature (top 9 affected columns)"
            note={<>The column with the most missing values, <strong style={{ color: CHART_COLORS.danger }}>PoolQC</strong>, is missing for 99.5% of the dataset because almost no properties have a pool. <strong style={{ color: CHART_COLORS.warning }}>MiscFeature</strong> follows at 96.3%. These aren't data quality problems, they're distributional facts about the dataset which I chose to preserve rather than patch.</>}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={missingValues} layout="vertical" barCategoryGap="28%">
                <CartesianGrid horizontal={false} stroke={"var(--border)"} />
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="feature" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="missing" name="Missing rows" radius={[0, 5, 5, 0]}>
                  {missingValues.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <AnalysisBlock heading="What the pattern told me">
              The missingness isn't uniformly distributed across features. It clusters around physical amenities (pool, alley, fence, fireplace) and a single structural descriptor (lot frontage). Basement and garage nulls are comparatively small and reliably represent the 5% of properties without those structures. The electrical column has a single null which is likely a transcription omission which I imputed as <Mono>None</Mono>.
            </AnalysisBlock>
          </ChartCard>
        </div>

        {/* ══ 04 EDA ══ */}
        <div id="housing-eda" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={4} title="Exploratory Data Analysis" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 28 }}>
            I used EDA to identify which features deserve careful engineering, which can be used directly, and which appear to be noise. Several patterns emerged that have direct implications for feature design and model interpretation.
          </p>

          {/* Chart 2: Sale Condition */}
          <ChartCard
            label="Chart 2 : Mean sale price by sale condition ($K)"
            note={<>Partial sales, typically new construction sold before completion average <strong style={{ color: P.purple }}>$272K</strong>, which is $97K above normal arm's-length transactions at $175K. Abnormal sales average <strong style={{ color: CHART_COLORS.danger }}>$147K</strong>, considerably below normal. I found sale condition worth flagging in the model given how strongly it stratifies price.</>}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={saleConditionPrices} barCategoryGap="32%">
                <CartesianGrid vertical={false} stroke={"var(--border)"} />
                <XAxis dataKey="condition" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} domain={[0, 310]} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="mean" name="Mean Price ($K)" radius={[5, 5, 0, 0]}>
                  {saleConditionPrices.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <AnalysisBlock heading="A caution I noted on partial sales">
              Partial sales represent new construction and may reflect the builder's asking price rather than the resale market. Including <Mono>SaleCondition</Mono> directly as a feature is potentially risky depending on whether the test set contains partial sales. I ultimately didn't include it in the final feature set, though it may be worth exploring as a flag feature for improved segmentation.
            </AnalysisBlock>
          </ChartCard>

          {/* Chart 3: Foundation comparison */}
          <ChartCard
            label="Chart 3 : PConc vs CBlock foundations across four metrics"
            note={<>Poured concrete foundations (PConc) are associated with substantially higher sale prices than concrete block (CBlock). However, a t-test I ran confirmed this difference is statistically significant on quality (p less than 0.05), living area, and garage capacity. Foundation type looks to me more like a proxy for construction era and overall build quality than an independent driver.</>}
            >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={foundationComparison} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke={"var(--border)"} />
                <XAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "var(--muted-foreground)" }} />
                <Bar dataKey="PConc"  name="PConc"  fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="CBlock" name="CBlock" fill={"var(--muted-foreground)"}  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <AnalysisBlock heading="Confounding between foundation and era that I identified">
              PConc foundations were overwhelmingly adopted after 1980, as I confirmed through a decade-by-decade foundation analysis. CBlock was the dominant material in the 1940 to 1980 period. When I controlled for <Mono>OverallQual</Mono>, the raw price gap between foundation types narrowed considerably which suggests foundation type is partly a signal for <em>when</em> the house was built rather than independently predicting price. I engineered era-foundation interaction terms to capture this explicitly.
            </AnalysisBlock>
          </ChartCard>

          {/* Chart 4: Lot shape analysis */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {LOT_TABS.map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveLotTab(tab)} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: "8px 18px", borderRadius: 6, cursor: "pointer", background: activeLotTab === tab ? CHART_COLORS.primary : "var(--card)", color: activeLotTab === tab ? P.bg : "var(--muted-foreground)", border: `1px solid ${activeLotTab === tab ? CHART_COLORS.primary : "var(--border)"}`, transition: "all 0.15s" }}>
                  {tab === "avgPrice" ? "Price" : tab === "lotArea" ? "Lot Area" : tab === "pricePerSF" ? "Price / sqft" : "Quality"}
                </button>
              ))}
            </div>
            <ChartCard label={`Chart 4 : Lot shape analysis: ${LOT_TAB_LABELS[activeLotTab]}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={lotShapeData} barCategoryGap="40%">
                  <CartesianGrid vertical={false} stroke={"var(--border)"} />
                  <XAxis dataKey="shape" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                  <Bar dataKey={activeLotTab} name={LOT_TAB_LABELS[activeLotTab]} radius={[5, 5, 0, 0]}>
                    {lotShapeData.map((d, i) => (
                      <Cell key={i} fill={[CHART_COLORS.danger, CHART_COLORS.warning, CHART_COLORS.secondary, CHART_COLORS.secondary][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <AnalysisBlock heading="The irregular lot paradox I found">
                Irregular lots (IR1 through IR3) have higher absolute mean sale prices, but the picture reverses on price per square foot of lot area: regular lots fetch $22.13 per sqft versus $10.71 for IR3 lots. This is consistent with irregular lots tending to be larger, meaning the price premium is partly explained by scale. I also noticed that irregular lots are associated with higher average <Mono>OverallQual</Mono>, suggesting they may be disproportionately occupied by newer, higher-end construction. The relationship was not straightforward enough for me to use lot shape as a direct price predictor without further controls.
              </AnalysisBlock>
            </ChartCard>
          </div>

          {/* Additional EDA findings */}
          <div style={{ marginTop: 20, background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", marginBottom: 18 }}>Additional EDA findings</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: "📅", title: "Garage type strongly tracks construction era", body: "I found that built-in garages average a construction year of 1995, attached garages 1983, detached garages 1947, and properties with no garage 1942. Garage type appears to function largely as a proxy for age and neighbourhood development period. Using GarageType directly in the model risks encoding temporal effects already captured by HouseAge and my foundation-era interactions." },
                { icon: "🏗", title: "Foundation type shifted sharply after 1980", body: "My decade-by-decade foundation breakdown shows CBlock as dominant from the 1930s through 1970s, with PConc adoption accelerating through the 1980s and becoming the majority by the 1990s. This confirmed for me that PConc in an early-era house is an unusual signal worth flagging separately from PConc in a modern build." },
                { icon: "📐", title: "OverallQual dominates the feature space", body: "My Random Forest importance analysis showed OverallQual capturing 62.2% of mean impurity reduction, with GrLivArea second at 12.7%. The remaining 68 features share roughly 25% of importance. This concentration told me the dataset is fundamentally asking a simpler question than its 80 columns imply: how big is the house and how well is it built?" },
                { icon: "📊", title: "Functional degeneration doesn't strongly correlate with quality", body: "My crosstab analysis between Functional and OverallQual showed that 'Typical' functionality dominates at 93.2% across virtually all quality levels, with only slight differences at the extremes. No clear pattern emerged that would make Functional a useful continuous predictor, so I converted it to a binary flag for functional issues instead." },
              ].map(({ icon, title, body }) => (
                <div key={title} style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <strong style={{ fontSize: 13.5, color: "var(--foreground)", lineHeight: 1.4 }}>{title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ 05 FEATURE ENGINEERING ══ */}
        <div id="housing-features" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={5} title="Feature Engineering" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            I pursued feature engineering through two parallel workstreams. The first produced a comprehensive 73-feature matrix covering all feature groups (basement, exterior, garage, interior, structure, site, dimensions). The second produced a curated 23-feature set informed by importance analysis and domain reasoning. Every feature I engineered is grounded in my EDA findings which none are speculative constructions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { name: "BsmtHeight", why: "Rather than ordinal-encoding BsmtQual directly, I approximated basement ceiling height numerically (Ex: 100in, Gd: 95in, TA: 85in, Fa: 75in, Po: 65in, None: 55in). This provides a continuous measure of basement utility rather than a rank.", color: CHART_COLORS.secondary },
              { name: "HouseAge", why: "YrSold minus YearBuilt. A direct continuous measure of property age at time of sale. I found this more informative than YearBuilt alone because two houses built in the same year but sold 20 years apart are in very different market conditions.", color: CHART_COLORS.secondary },
              { name: "PorchArea", why: "Sum of OpenPorchSF, EnclosedPorch, 3SsnPorch, and ScreenPorch. I collapsed four separate porch columns into a single outdoor living space signal, with a binary hasPorch flag to preserve the presence/absence distinction.", color: CHART_COLORS.warning },
              { name: "TotalBathrooms", why: "Full bathrooms plus half-weight for half-baths, across both floors. This produces a single continuous measure of bathroom provision rather than four partially correlated columns, reducing multicollinearity.", color: CHART_COLORS.warning },
              { name: "PConc_in_Early_Era", why: "Binary flag: poured concrete foundation on a pre-1940s build. Rare combination (fewer than 5% of the dataset) that likely signals renovation or structural upgrade. I was motivated to engineer this by the confounding I observed between foundation type and construction decade.", color: CHART_COLORS.danger },
              { name: "PConc_in_Modern_Era", why: "Binary flag: poured concrete foundation on a post-1980 build which is the expected condition for modern construction. Separating this from the early-era case allows the model to treat them as distinct signals rather than conflating old and new PConc.", color: CHART_COLORS.danger },
              { name: "exterior_1_age_score", why: "House age divided by an exterior material durability score (Stone: 1.0, BrkFace: 0.9, VinylSd: 0.6, WdShing: 0.4, AsbShng: 0.3). Higher values indicate more wear relative to the material's expected lifespan. I combined three raw columns into one continuous maintenance-burden signal.", color: P.purple },
              { name: "NeighborhoodAvgPrice", why: "Target-encoded neighbourhood using training-set average sale prices only. Neighbourhood is the strongest locational signal in the dataset, and I computed this post-split to prevent leakage, converting it into a continuous measure directly aligned with the prediction target.", color: CHART_COLORS.primary },
              { name: "is_single_fam_detached", why: "Binary flag for BldgType equal to 1Fam, which accounts for 83.6% of the dataset. I found single-family detached homes command different price dynamics from duplexes and townhouses. The flag separates these rather than relying on OHE of a 5-level categorical.", color: CHART_COLORS.primary },
            ].map(f => (
              <div key={f.name} style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${f.color}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: f.color, marginBottom: 6 }}>{f.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", lineHeight: 1.6 }}>{f.why}</div>
              </div>
            ))}
          </div>
          <Callout color={CHART_COLORS.warning} icon="⚠">
            <strong style={{ color: "var(--foreground)" }}>On the comprehensive vs curated feature sets:</strong> the 73-feature matrix includes duplicated columns (TotalBsmtSF and GarageArea appear twice due to how I concatenated the sub-dataframes). I confirmed this in cell 125, where the final column list shows these duplicates. The effect on model performance appears minimal given XGBoost's robustness to redundant features, but it's a code artifact I'd clean up before any production use.
          </Callout>
        </div>

        {/* ══ 06 MODEL SELECTION ══ */}
        <div id="housing-models" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={6} title="Model Selection & Benchmarking" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            I benchmarked five model configurations. Linear Regression and Random Forest serve as interpretable reference points. I evaluated XGBoost on both the 73-feature comprehensive set and the 23-feature curated set to test whether exhaustive feature creation is more effective than deliberate selection. CatBoost is included as a second gradient boosting baseline using the curated feature set.
          </p>

          <ChartCard
            label="Chart 5 : R² score by model configuration (test set, 20% holdout)"
            note={<>Linear Regression establishes my baseline at <strong style={{ color: CHART_COLORS.danger }}>87.4%</strong>. Random Forest adds 2 points at <strong style={{ color: CHART_COLORS.warning }}>89.5%</strong>. The two XGBoost configurations are close, with the curated 23-feature variant edging the 73-feature version by 0.4 points. CatBoost, without hyperparameter tuning, achieves <strong style={{ color: CHART_COLORS.secondary }}>91.4%</strong>.</>}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={modelComparison} barCategoryGap="32%">
                <CartesianGrid vertical={false} stroke={"var(--border)"} />
                <XAxis dataKey="model" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 95]} tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <ReferenceLine y={87.4} stroke={"var(--muted-foreground)"} strokeDasharray="4 4" label={{ value: "LR baseline", fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="r2" name="R² Score (%)" radius={[5, 5, 0, 0]}>
                  {modelComparison.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Full results table */}
          <div style={{ marginTop: 20, background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", background: "var(--card)", padding: "11px 18px", fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", borderBottom: `1px solid ${"var(--border)"}` }}>
              <span>Model</span><span>Features</span><span>R² (test)</span><span>Notes</span>
            </div>
            {[
              { name: "Linear Regression",         feat: "73 (all)",  r2: "87.4%", note: "OHE + ordinal encoding, StandardScaler", hl: false },
              { name: "Random Forest",             feat: "73 (all)",  r2: "89.5%", note: "Default n_estimators=100, no tuning", hl: false },
              { name: "XGBoost (all features)",    feat: "73 (all)",  r2: "92.2%", note: "n_estimators=500, lr=0.05, depth=4", hl: false },
              { name: "CatBoost",                  feat: "23 selected", r2: "91.4%", note: "Untuned, iterations=500, depth=4", hl: false },
              { name: "XGBoost + target enc. ★",  feat: "23 selected", r2: "92.6%", note: "Post-tuning: n=800, depth=3, lr=0.05", hl: true  },
            ].map(({ name, feat, r2, note, hl }) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", padding: "12px 18px", fontSize: 13, color: hl ? CHART_COLORS.primary : "var(--muted-foreground)", background: hl ? `${CHART_COLORS.primary}08` : "transparent", borderBottom: `1px solid ${"var(--border)"}`, fontFamily: hl ? FONT_MONO : "inherit" }}>
                <span>{name}</span><span>{feat}</span><span>{r2}</span><span style={{ fontSize: 12 }}>{note}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
            <AnalysisBlock heading="Why my curated features matched or beat the comprehensive set">
              The 73-feature comprehensive set includes duplicate columns, near-zero-variance features, and several engineered scores of uncertain quality (such as the exterior durability-age interaction, which involves domain assumptions I couldn't validate against external benchmarks). My curated 23-feature set discards these and focuses on signals I confirmed through importance analysis. XGBoost's built-in regularisation likely compensates for both sets, but the curated set may provide cleaner gradients.
            </AnalysisBlock>
            <AnalysisBlock heading="Why Linear Regression performed reasonably well">
              An R² of 87.4% from a linear model suggests the relationship between the features I selected and SalePrice is substantially linear in the transformed feature space. Much of the nonlinearity may already be handled by the ordinal encodings and the engineered features. The 5-point gap between Linear Regression and tuned XGBoost represents the value of capturing interaction effects and local nonlinearities that a linear boundary cannot model.
            </AnalysisBlock>
          </div>
        </div>

        {/* ══ 07 FEATURE IMPORTANCE ══ */}
        <div id="housing-importance" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={7} title="What the Model Learned Matters" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            I derived feature importances from the Random Forest model (mean decrease in impurity across 100 trees), computed on the full 73-feature matrix. These importances informed my feature selection for the curated set. Two things stood out immediately: the extreme dominance of <Mono>OverallQual</Mono>, and the appearance of my engineered <Mono>BsmtHeight</Mono> and <Mono>exterior_1_age_score</Mono> features in the top 10.
          </p>

          <ChartCard label="Chart 6 : Top 10 features by importance % (Random Forest, mean impurity reduction)">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={featureImportance} layout="vertical" barCategoryGap="22%">
                <CartesianGrid horizontal={false} stroke={"var(--border)"} />
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="feature" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={155} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="importance" name="Importance %" radius={[0, 5, 5, 0]}>
                  {featureImportance.map((d, i) => (
                    <Cell key={i} fill={d.importance > 10 ? CHART_COLORS.primary : d.importance > 5 ? CHART_COLORS.warning : CHART_COLORS.secondary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 20 }}>
            {[
              { title: "OverallQual at 62.2% is a concentration risk I need to flag", color: CHART_COLORS.primary, body: "A single feature accounting for nearly two-thirds of model importance is both informative and concerning. It tells me the model is heavily reliant on a single 10-point rating that is itself a human judgment. If that rating is inconsistently applied across appraisers or neighbourhoods, model performance may degrade on out-of-distribution data in ways that R² on the test set would not reveal." },
              { title: "GrLivArea at 12.7% confirms size as the second axis", color: CHART_COLORS.warning, body: "Above-grade living area is the strongest purely dimensional predictor I found, outperforming TotalBsmtSF, 1stFlrSF, and 2ndFlrSF individually. This is consistent with real-estate market intuition: buyers primarily price on usable, above-ground, finished space. My engineered BsmtHeight feature's appearance at rank 10 suggests basement quality adds marginal signal beyond raw area." },
              { title: "BsmtHeight and exterior_1_age_score validate my engineering approach", color: CHART_COLORS.secondary, body: "Two features I engineered appear in the top 10, which validates my hypothesis that domain-informed transformations can extract signal that raw columns alone don't surface. exterior_1_age_score (rank 11 in the full importance table) combines age and material durability into a single wear-burden signal. Its presence tells me the model found it informative, though the specific durability weights are domain assumptions rather than data-derived values." },
            ].map(({ title, color, body }) => (
              <div key={title} style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 10, padding: "16px 18px", borderTop: `3px solid ${color}` }}>
                <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 10, lineHeight: 1.4 }}>{title}</strong>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 08 HYPERPARAMETER TUNING ══ */}
        <div id="housing-tuning" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={8} title="Hyperparameter Tuning" />
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            I ran two rounds of <Mono>RandomizedSearchCV</Mono>: one on the 73-feature comprehensive set and one on the 23-feature curated set. Each ran 50 random combinations with 5-fold cross-validation (250 total fits per search). The curated-feature search produced the better test score.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div>
              {[
                { param: "n_estimators = 800", why: "More boosting rounds allow the model to continue correcting residuals on a shallow, well-regularised tree. At learning_rate = 0.05, 800 rounds provided better convergence than the default 500 without visible overfitting on the validation folds." },
                { param: "max_depth = 3", why: "Shallow trees keep individual learners weak and the ensemble strong. For this dataset, where two features dominate importance, deep trees would likely overfit to interactions between minor features that have limited generalisability." },
                { param: "learning_rate = 0.05", why: "A moderate rate that balances convergence speed with generalisation. I also tested 0.03 and 0.01; 0.05 with 800 estimators achieved the best CV score in the curated-feature run." },
                { param: "gamma = 0.2", why: "A small minimum loss reduction requirement for further tree splits. This acts as a soft regulariser that prevents trivially small gains from being exploited, which I found particularly helpful given the large number of near-zero-importance features in the full set." },
              ].map(({ param, why }) => (
                <div key={param} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                  <Mono>{param}</Mono>
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.75 }}>{why}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, overflow: "hidden", alignSelf: "start" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${"var(--border)"}`, fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>TUNING SUMMARY (CURATED SET)</div>
              <TableRow label="Search strategy"     value="RandomizedSearchCV" />
              <TableRow label="Combinations tried"  value="50" />
              <TableRow label="CV folds"            value="5-fold" />
              <TableRow label="Total model fits"    value="250" />
              <TableRow label="Best CV R²"          value="88.3%" highlight />
              <TableRow label="Final test R²"       value="92.6%" highlight />
              <TableRow label="Gap (CV to test)"    value="+4.3 pts" />
            </div>
          </div>
          <Callout color={CHART_COLORS.warning} icon="⚠">
            <strong style={{ color: "var(--foreground)" }}>The CV score (88.3%) is notably lower than the test R² (92.6%).</strong> A positive gap of this magnitude is unusual, and I want to flag it honestly. Typical cross-validation scores slightly exceed test scores because the full training set is used for the final fit. The inverse here may indicate that the random 80/20 test split captured a particularly "easy" subset of the data, or that my target encoding was computed differently between the CV folds and the final train/test split, creating a mild form of leakage. This warrants further investigation before treating 92.6% as a reliable out-of-sample estimate.
          </Callout>
        </div>

        {/* ══ 09 LIMITATIONS & NEXT STEPS ══ */}
        <div id="housing-next" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={9} title="Limitations & What Comes Next" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 12, padding: "24px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: CHART_COLORS.danger, marginBottom: 18 }}>Known limitations</div>
              {[
                { title: "Positive CV to test gap raises leakage concerns", body: "The best CV R² of 88.3% being substantially below the test R² of 92.6% is an atypical result that I can't fully explain. My neighbourhood target encoding was implemented post-split for the final fit but may not have been applied consistently across all CV folds. If a fold's validation set saw neighbourhood averages computed from data that included those same rows, a mild leakage exists. I'd want to verify this by implementing target encoding strictly within each CV fold." },
                { title: "Duplicate columns in the comprehensive feature matrix", body: "The concat operation I used to assemble the 73-feature matrix from sub-dataframes resulted in TotalBsmtSF and GarageArea appearing twice. I confirmed this in the column list output in cell 125. While XGBoost is generally tolerant of redundant features, I'd resolve this before any production use or further ensemble work." },
                { title: "Exterior durability weights are domain assumptions", body: "The durability_map I used to create exterior_1_age_score assigns scores such as Stone: 1.0, VinylSd: 0.6, AsbShng: 0.3 based on my domain reasoning alone which is not from the data. The feature appears in the top 10 importance ranking, so its influence is meaningful. If my durability ordering is wrong for some materials, it could introduce systematic error into predictions for specific exterior types." },
                { title: "Single geographic market", body: "The dataset covers Ames, Iowa residential sales from 2006 to 2010. A model I trained on this data may not transfer to other markets, time periods, or property types. The 2006 to 2010 window also includes the beginning of the US housing correction, which may mean some price relationships differ from a stable market." },
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
                { title: "Log-transform the target variable", body: "SalePrice has a right-skewed distribution typical of real-estate data. Log-transforming the target before training would make the model optimise on percentage errors rather than absolute errors, which is generally more appropriate for a price prediction task where a $10K error on a $100K property is very different from the same error on a $500K property. RMSLE is the standard metric for Kaggle housing competitions for this reason." },
                { title: "Stacking XGBoost with LightGBM and Ridge", body: "A level-1 stack using out-of-fold predictions from XGBoost, LightGBM, and a Ridge regression meta-learner could capture complementary signal: XGBoost and LightGBM handle nonlinear interactions while Ridge smooths the final prediction surface. I'd expect a +1 to 2% R² improvement from this." },
                { title: "Validate target encoding with proper CV fold isolation", body: "I'd want to implement neighbourhood target encoding as a scikit-learn pipeline step, computed only from training fold rows during cross-validation. This would ensure the CV score accurately reflects generalisation performance and let me correctly interpret the CV-to-test gap I observed." },
                { title: "SHAP values for prediction-level explainability", body: "With OverallQual dominating at 62.2% global importance, SHAP values would reveal whether individual predictions are also OverallQual-dominated or whether other features take over for specific property types. Per-prediction explanations also make the model auditable and can expose systematic errors by neighbourhood or property class that aggregate metrics would hide." },
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
            Dataset: Kaggle Ames Housing · Stack: Python, XGBoost, CatBoost, scikit-learn, pandas, seaborn, matplotlib · Western University · Department of Computer Science
          </div>
        </div>

      </div>
    </div>
    </WorkReportShell>
  );
}