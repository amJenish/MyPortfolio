import { useState, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, ScatterChart, Scatter,
  ReferenceLine,
} from "recharts";

import { FONT_MONO, FONT_SANS, notebookNeutrals } from "./notebookTheme";

const P = {
  ...notebookNeutrals,
  accent: "#f5a623",
  accentDim: "#b8770f",
  teal: "#2dd4bf",
  rose: "#fb7185",
  orange: "#fb923c",
  purple: "#a78bfa",
};

// ── DATA ──────────────────────────────────────────────────────────────────────

// Model comparison: actual results from the notebook
const modelComparison = [
  { model: "Linear Reg.", r2: 87.4, fill: "#fb7185" },
  { model: "Random Forest", r2: 89.5, fill: "#f97316" },
  { model: "CatBoost", r2: 91.4, fill: "#2dd4bf" },
  { model: "XGB Full (73)", r2: 92.2, fill: "#f5a623" },
  { model: "XGB Selected ★", r2: 92.6, fill: "#a78bfa" },
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
  { feature: "Alley",       missing: 1369, pct: 93.8, fill: "#fb7185" },
  { feature: "PoolQC",      missing: 1453, pct: 99.5, fill: "#fb7185" },
  { feature: "MiscFeature", missing: 1406, pct: 96.3, fill: "#f97316" },
  { feature: "Fence",       missing: 1179, pct: 80.8, fill: "#f97316" },
  { feature: "FireplaceQu", missing: 690,  pct: 47.3, fill: "#f5a623" },
  { feature: "MasVnrType",  missing: 872,  pct: 59.7, fill: "#f5a623" },
  { feature: "LotFrontage", missing: 259,  pct: 17.7, fill: "#2dd4bf" },
  { feature: "Garage*",     missing: 81,   pct: 5.5,  fill: "#7a95b0" },
  { feature: "Basement*",   missing: 37,   pct: 2.5,  fill: "#7a95b0" },
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
  { condition: "AdjLand",  mean: 104, fill: "#fb7185" },
  { condition: "Abnorml",  mean: 147, fill: "#f97316" },
  { condition: "Family",   mean: 150, fill: "#f5a623" },
  { condition: "Alloca",   mean: 167, fill: "#2dd4bf" },
  { condition: "Normal",   mean: 175, fill: "#2dd4bf" },
  { condition: "Partial",  mean: 272, fill: "#a78bfa" },
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
    <div style={{ background: P.card, border: `1px solid ${P.border}`, padding: "10px 14px", borderRadius: 8, fontSize: 13, color: P.text, fontFamily: FONT_MONO }}>
      <div style={{ color: P.accent, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || P.text }}>
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
      <div style={{ fontFamily: FONT_SANS, fontSize: 36, color: color || P.accent, fontWeight: 900, lineHeight: 1 }}>{value}</div>
      {sub ? <div style={{ marginTop: 6, fontSize: 12, color: P.textDim, lineHeight: 1.5 }}>{sub}</div> : null}
    </div>
  );
}

function Mono({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <code style={{ fontFamily: FONT_MONO, fontSize: 11.5, background: "#0d1926", color: P.teal, padding: "2px 7px", borderRadius: 4, border: `1px solid ${P.border}` }}>{children}</code>
  );
}

function Callout({ color = P.accent, icon, children }: { color?: string; icon?: ReactNode; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ background: `${color}12`, border: `1px solid ${color}40`, borderRadius: 10, padding: "14px 18px", marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
      {icon ? <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span> : null}
      <div style={{ fontSize: 13.5, color: P.textDim, lineHeight: 1.7 }}>{children}</div>
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
      {note ? <p style={{ margin: "0 0 20px", fontSize: 13.5, color: P.textDim, lineHeight: 1.7 }}>{note}</p> : null}
      {children}
    </div>
  );
}

function TableRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }): React.JSX.Element {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 18px", borderBottom: `1px solid ${P.border}`, fontSize: 13, color: highlight ? P.accent : P.textDim, background: highlight ? `${P.accent}08` : "transparent" }}>
      <span>{label}</span>
      <span style={{ fontFamily: FONT_MONO, color: highlight ? P.accent : P.text }}>{value}</span>
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

export default function HousingPriceReport() {
  const [activeLotTab, setActiveLotTab] = useState<LotTab>("avgPrice");

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: FONT_SANS }}>

      {/* ── HERO ── */}
      <div style={{ borderBottom: `1px solid ${P.border}`, padding: "72px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, #1e2d3d 1px, transparent 0)", backgroundSize: "28px 28px", opacity: 0.5 }} />
        <div style={{ position: "absolute", top: "-20%", left: "60%", width: 600, height: 600, background: "radial-gradient(ellipse, #f5a62308 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 40px", position: "relative" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, marginBottom: 20 }}>
            Machine Learning · Regression · Feature Engineering · Gradient Boosting
          </div>
          <h1 style={{ fontFamily: FONT_SANS, fontSize: "clamp(32px, 4.5vw, 58px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.15, color: P.text, letterSpacing: -0.02 }}>
            Ames Housing:<br /><span style={{ color: P.accent }}>Predicting Sale Price</span>
          </h1>
          <p style={{ fontSize: 17, color: P.textDim, maxWidth: 680, lineHeight: 1.8, margin: "0 0 14px" }}>
            A regression project on the Ames Housing dataset, predicting residential sale prices from 80+ structural, locational, and quality features. The central question: <strong style={{ color: P.text }}>how much predictive power can be extracted from systematic feature engineering versus throwing all raw variables at a gradient booster?</strong>
          </p>
          <p style={{ fontSize: 15, color: P.textDim, maxWidth: 680, lineHeight: 1.7, margin: "0 0 36px" }}>
            A baseline Linear Regression achieved R² of <strong style={{ color: P.text }}>87.4%</strong>. Careful feature selection and engineering on a hand-curated 23-feature subset, combined with XGBoost and hyperparameter tuning, pushed that to <strong style={{ color: P.text }}>92.6%</strong> on the held-out test set.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Python", "XGBoost", "CatBoost", "scikit-learn", "pandas", "seaborn", "RandomizedSearchCV"].map(t => (
              <span key={t} style={{ fontFamily: FONT_MONO, fontSize: 11, background: P.surface, border: `1px solid ${P.border}`, color: P.teal, padding: "5px 12px", borderRadius: 20 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "60px 40px" }}>

        {/* KPIs */}
        <div id="housing-kpis" className="scroll-mt-28" style={{ display: "flex", gap: 16, marginBottom: 80, flexWrap: "wrap" }}>
          <KPI label="Properties analysed" value="1,460" sub="Ames, Iowa residential sales from the Kaggle competition dataset" />
          <KPI label="Best R² Score" value="92.6%" sub="XGBoost on 23 hand-selected and engineered features, post-tuning" color={P.purple} />
          <KPI label="Baseline R²" value="87.4%" sub="Linear Regression on the same ordinal-encoded feature set" color={P.orange} />
          <KPI label="Feature reduction" value="80 → 23" sub="Raw features reduced to a curated subset without performance loss" color={P.teal} />
        </div>

        {/* ══ 01 THE PROBLEM ══ */}
        <div id="housing-problem" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={1} title="The Problem" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0 }}>
                The Ames Housing dataset describes 1,460 residential property sales in Ames, Iowa. With 80 features spanning structural type, lot characteristics, basement configuration, garage details, exterior materials, interior quality ratings, and neighbourhood information, it poses a classic challenge in applied regression: most of the signal is concentrated in a small number of features, and the rest ranges from mildly informative to pure noise.
              </p>
              <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85 }}>
                The goal is to predict <Mono>SalePrice</Mono> as accurately as possible. Two parallel strategies are explored: first, a comprehensive approach using all engineered features (73 after transformation); second, a curated approach that distils the data down to 23 high-signal, carefully constructed features. Understanding which approach performs better, and by how much, is itself an informative finding.
              </p>
            </div>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${P.border}`, fontFamily: FONT_MONO, fontSize: 11, color: P.textDim }}>Dataset at a glance</div>
              {[
                ["Source",              "Kaggle Ames Housing Competition"],
                ["Training rows",       "1,460 properties"],
                ["Raw features",        "80 (35 numeric, 43 categorical, 3 float)"],
                ["Target variable",     "SalePrice — continuous, right-skewed"],
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
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            The most important observation during cleaning is that the vast majority of missing values in this dataset are not missing data at all. They are semantically meaningful absences. A null in <Mono>GarageType</Mono> does not mean the garage type was not recorded; it means the property has no garage. The same logic applies to basements, fireplaces, pools, fences, and alley access. Treating these as missing would introduce a false signal into the model.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Callout color={P.teal} icon="✓">
              <strong style={{ color: P.text }}>Absence-aware imputation.</strong> All null values in feature groups where absence is meaningful (garage, basement, pool, fireplace, fence, alley) were filled with explicit string labels such as <Mono>No Garage</Mono>, <Mono>No Basement</Mono>, and <Mono>No Pool</Mono>. This preserves the real-world information instead of discarding it via zero-fill or median imputation.
            </Callout>
            <Callout color={P.orange} icon="⚠">
              <strong style={{ color: P.text }}>LotFrontage: an imputation limitation.</strong> 259 properties (17.7%) have no recorded <Mono>LotFrontage</Mono>. These were filled with 0. A more rigorous alternative may have been neighbourhood-median imputation, since frontage is highly correlated with lot configuration and zoning. The zero-fill introduces a potential downward bias on this feature for imputed rows.
            </Callout>
            <Callout color={P.purple} icon="①">
              <strong style={{ color: P.text }}>Categorical encoding strategy.</strong> Ordinal features such as <Mono>ExterQual</Mono>, <Mono>BsmtQual</Mono>, <Mono>KitchenQual</Mono>, and garage/basement condition were mapped to integer scales (0 to 5) reflecting their documented quality ladder. Nominal features with many categories were either one-hot encoded or dropped in favour of engineered alternatives.
            </Callout>
            <Callout color={P.teal} icon="②">
              <strong style={{ color: P.text }}>Near-constant features flagged for removal.</strong> Two features were identified as carrying essentially no discriminative signal. <Mono>Utilities</Mono> is <Mono>AllPub</Mono> for 99.9% of properties. <Mono>PoolQC</Mono> is <Mono>No Pool</Mono> for 99.5%. Both were dropped from the curated feature set, as near-zero variance features can add noise without benefit in a gradient boosting context.
            </Callout>
          </div>
        </div>

        {/* ══ 03 MISSING VALUES ══ */}
        <div id="housing-missing" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={3} title="Missing Value Structure" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            Missing values are heavily concentrated in a small number of features, and the distribution pattern is informative. The top four missing features all describe amenities that simply are not present on most properties, not gaps in data collection. This structural missingness is distinct from the more traditional random missing-at-random pattern and demands different treatment.
          </p>

          <ChartCard
            label="Chart 1 — Missing value counts by feature (top 9 affected columns)"
            note={<>The column with the most missing values, <strong style={{ color: P.rose }}>PoolQC</strong>, is missing for 99.5% of the dataset because almost no properties have a pool. <strong style={{ color: P.orange }}>MiscFeature</strong> follows at 96.3%. These are not data quality problems. They are distributional facts about the dataset that should be preserved, not patched.</>}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={missingValues} layout="vertical" barCategoryGap="28%">
                <CartesianGrid horizontal={false} stroke={P.border} />
                <XAxis type="number" tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="feature" tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="missing" name="Missing rows" radius={[0, 5, 5, 0]}>
                  {missingValues.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <AnalysisBlock heading="What the pattern tells us">
              The missingness is not uniformly distributed across features. It clusters around physical amenities (pool, alley, fence, fireplace) and a single structural descriptor (lot frontage). Basement and garage nulls are comparatively small and reliably represent the 5% of properties without those structures. The electrical column has a single null, likely a transcription omission, which was imputed as <Mono>None</Mono>.
            </AnalysisBlock>
          </ChartCard>
        </div>

        {/* ══ 04 EDA ══ */}
        <div id="housing-eda" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={4} title="Exploratory Data Analysis" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 28 }}>
            EDA was used to identify which features deserve careful engineering, which can be used directly, and which appear to be noise. Several patterns emerged that have direct implications for feature design and model interpretation.
          </p>

          {/* Chart 2: Sale Condition */}
          <ChartCard
            label="Chart 2 — Mean sale price by sale condition ($K)"
            note={<>Partial sales, typically new construction sold before completion, average <strong style={{ color: P.purple }}>$272K</strong>, which is $97K above normal arm's-length transactions at $175K. Abnormal sales average <strong style={{ color: P.rose }}>$147K</strong>, considerably below normal. Sale condition may be worth including as a flag in the model given how strongly it stratifies price.</>}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={saleConditionPrices} barCategoryGap="32%">
                <CartesianGrid vertical={false} stroke={P.border} />
                <XAxis dataKey="condition" tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} domain={[0, 310]} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="mean" name="Mean Price ($K)" radius={[5, 5, 0, 0]}>
                  {saleConditionPrices.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <AnalysisBlock heading="A caution on partial sales">
              Partial sales represent new construction and may reflect the builder's asking price rather than the resale market. Including <Mono>SaleCondition</Mono> directly as a feature is potentially risky depending on whether the test set contains partial sales. In the final feature set it was not included, though it may be worth exploring as a flag feature for improved segmentation.
            </AnalysisBlock>
          </ChartCard>

          {/* Chart 3: Foundation comparison */}
          <ChartCard
            label="Chart 3 — PConc vs CBlock foundations across four metrics"
            note={<>Poured concrete foundations (PConc) are associated with substantially higher sale prices than concrete block (CBlock). However, a t-test from the notebook confirms this difference is statistically significant on quality (p less than 0.05), living area, and garage capacity. Foundation type appears to be a proxy for construction era and overall build quality rather than an independent driver.</>}
            >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={foundationComparison} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke={P.border} />
                <XAxis dataKey="metric" tick={{ fill: P.textDim, fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono", color: P.textDim }} />
                <Bar dataKey="PConc"  name="PConc"  fill={P.accent} radius={[4, 4, 0, 0]} />
                <Bar dataKey="CBlock" name="CBlock" fill={P.muted}  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <AnalysisBlock heading="Confounding between foundation and era">
              PConc foundations were overwhelmingly adopted after 1980, as confirmed by the decade-by-decade foundation analysis in the notebook. CBlock was the dominant material in the 1940 to 1980 period. When controlling for <Mono>OverallQual</Mono>, the raw price gap between foundation types narrows considerably. This suggests foundation type is partly a signal for <em>when</em> the house was built rather than independently predicting price. Era-foundation interaction terms were engineered to capture this explicitly.
            </AnalysisBlock>
          </ChartCard>

          {/* Chart 4: Lot shape analysis */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {LOT_TABS.map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveLotTab(tab)} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: "8px 18px", borderRadius: 6, cursor: "pointer", background: activeLotTab === tab ? P.accent : P.surface, color: activeLotTab === tab ? P.bg : P.textDim, border: `1px solid ${activeLotTab === tab ? P.accent : P.border}`, transition: "all 0.15s" }}>
                  {tab === "avgPrice" ? "Price" : tab === "lotArea" ? "Lot Area" : tab === "pricePerSF" ? "Price / sqft" : "Quality"}
                </button>
              ))}
            </div>
            <ChartCard label={`Chart 4 — Lot shape analysis: ${LOT_TAB_LABELS[activeLotTab]}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={lotShapeData} barCategoryGap="40%">
                  <CartesianGrid vertical={false} stroke={P.border} />
                  <XAxis dataKey="shape" tick={{ fill: P.textDim, fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                  <Bar dataKey={activeLotTab} name={LOT_TAB_LABELS[activeLotTab]} radius={[5, 5, 0, 0]}>
                    {lotShapeData.map((d, i) => (
                      <Cell key={i} fill={["#fb7185","#f5a623","#2dd4bf","#a78bfa"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <AnalysisBlock heading="The irregular lot paradox">
                Irregular lots (IR1 through IR3) have higher absolute mean sale prices, but the picture reverses on price per square foot of lot area: regular lots fetch $22.13 per sqft versus $10.71 for IR3 lots. This is consistent with irregular lots tending to be larger, meaning the price premium is partly explained by scale. The analysis also shows that irregular lots are associated with higher average <Mono>OverallQual</Mono>, suggesting they may be disproportionately occupied by newer, higher-end construction. The relationship is not straightforward enough to use lot shape as a direct price predictor without further controls.
              </AnalysisBlock>
            </ChartCard>
          </div>

          {/* Additional EDA findings */}
          <div style={{ marginTop: 20, background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textDim, marginBottom: 18 }}>Additional EDA findings</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: "📅", title: "Garage type strongly tracks construction era", body: "Built-in garages average a construction year of 1995, attached garages 1983, detached garages 1947, and properties with no garage 1942. Garage type appears to function largely as a proxy for age and neighbourhood development period. Using GarageType directly in the model risks encoding temporal effects already captured by HouseAge and foundation-era interactions." },
                { icon: "🏗", title: "Foundation type shifted sharply after 1980", body: "The decade-by-decade foundation breakdown shows CBlock as dominant from the 1930s through 1970s, with PConc adoption accelerating through the 1980s and becoming the majority by the 1990s. This confirmed that PConc in an early-era house is an unusual signal worth flagging separately from PConc in a modern build." },
                { icon: "📐", title: "OverallQual dominates the feature space", body: "The Random Forest importance analysis showed OverallQual capturing 62.2% of mean impurity reduction, with GrLivArea second at 12.7%. The remaining 68 features share roughly 25% of importance. This concentration suggests the dataset is fundamentally asking a simpler question than its 80 columns imply: how big is the house and how well is it built?" },
                { icon: "📊", title: "Functional degeneration does not strongly correlate with quality", body: "The crosstab analysis between Functional and OverallQual showed that 'Typical' functionality dominates at 93.2% across virtually all quality levels, with only slight differences at the extremes. No clear pattern emerged that would make Functional a useful continuous predictor; it was converted to a binary flag for functional issues instead." },
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

        {/* ══ 05 FEATURE ENGINEERING ══ */}
        <div id="housing-features" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={5} title="Feature Engineering" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            Feature engineering was pursued through two parallel workstreams. The first produced a comprehensive 73-feature matrix covering all feature groups (basement, exterior, garage, interior, structure, site, dimensions). The second produced a curated 23-feature set informed by importance analysis and domain reasoning. All engineered features are grounded in EDA findings from the notebook; none are speculative constructions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { name: "BsmtHeight", why: "Rather than ordinal-encoding BsmtQual directly, basement ceiling height was approximated numerically (Ex: 100in, Gd: 95in, TA: 85in, Fa: 75in, Po: 65in, None: 55in). This provides a continuous measure of basement utility rather than a rank.", color: P.teal },
              { name: "HouseAge", why: "YrSold minus YearBuilt. A direct continuous measure of property age at time of sale. This proved more informative than YearBuilt alone because two houses built in the same year but sold 20 years apart are in very different market conditions.", color: P.teal },
              { name: "PorchArea", why: "Sum of OpenPorchSF, EnclosedPorch, 3SsnPorch, and ScreenPorch. Four separate porch columns were collapsed into a single outdoor living space signal, with a binary hasPorch flag to preserve the presence/absence distinction.", color: P.orange },
              { name: "TotalBathrooms", why: "Full bathrooms plus half-weight for half-baths, across both floors. This produces a single continuous measure of bathroom provision rather than four partially correlated columns, reducing multicollinearity.", color: P.orange },
              { name: "PConc_in_Early_Era", why: "Binary flag: poured concrete foundation on a pre-1940s build. Rare combination (fewer than 5% of the dataset) that likely signals renovation or structural upgrade. The foundation-era interaction was motivated by the observed confounding between foundation type and construction decade.", color: P.rose },
              { name: "PConc_in_Modern_Era", why: "Binary flag: poured concrete foundation on a post-1980 build. The expected condition for modern construction. Separating this from the early-era case allows the model to treat them as distinct signals rather than conflating old and new PConc.", color: P.rose },
              { name: "exterior_1_age_score", why: "House age divided by an exterior material durability score (Stone: 1.0, BrkFace: 0.9, VinylSd: 0.6, WdShing: 0.4, AsbShng: 0.3). Higher values indicate more wear relative to the material's expected lifespan. This combines three raw columns into one continuous maintenance-burden signal.", color: P.purple },
              { name: "NeighborhoodAvgPrice", why: "Target-encoded neighbourhood using training-set average sale prices only. Neighbourhood is the strongest locational signal in the dataset, and target encoding converts it into a continuous measure directly aligned with the prediction target. Calculated post-split to prevent leakage.", color: P.accent },
              { name: "is_single_fam_detached", why: "Binary flag for BldgType equal to 1Fam, which accounts for 83.6% of the dataset. Single-family detached homes command different price dynamics from duplexes and townhouses. The flag separates these rather than relying on OHE of a 5-level categorical.", color: P.accent },
            ].map(f => (
              <div key={f.name} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${f.color}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: f.color, marginBottom: 6 }}>{f.name}</div>
                <div style={{ fontSize: 12.5, color: P.textDim, lineHeight: 1.6 }}>{f.why}</div>
              </div>
            ))}
          </div>
          <Callout color={P.orange} icon="⚠">
            <strong style={{ color: P.text }}>On the comprehensive vs curated feature sets:</strong> the 73-feature matrix includes duplicated columns (TotalBsmtSF and GarageArea appear twice due to how the sub-dataframes were concatenated). This was confirmed in cell 125, where the final column list shows these duplicates. The effect on model performance appears minimal given XGBoost's robustness to redundant features, but it is a code artifact that would warrant cleanup before production use.
          </Callout>
        </div>

        {/* ══ 06 MODEL SELECTION ══ */}
        <div id="housing-models" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={6} title="Model Selection & Benchmarking" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            Five model configurations were benchmarked. Linear Regression and Random Forest serve as interpretable reference points. XGBoost is evaluated on both the 73-feature comprehensive set and the 23-feature curated set to test whether exhaustive feature creation is more effective than deliberate selection. CatBoost is included as a second gradient boosting baseline using the curated feature set.
          </p>

          <ChartCard
            label="Chart 5 — R² score by model configuration (test set, 20% holdout)"
            note={<>Linear Regression establishes a baseline at <strong style={{ color: P.rose }}>87.4%</strong>. Random Forest adds 2 points at <strong style={{ color: P.orange }}>89.5%</strong>. The two XGBoost configurations are close, with the curated 23-feature variant edging the 73-feature version by 0.4 points. CatBoost, without hyperparameter tuning, achieves <strong style={{ color: P.teal }}>91.4%</strong>.</>}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={modelComparison} barCategoryGap="32%">
                <CartesianGrid vertical={false} stroke={P.border} />
                <XAxis dataKey="model" tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 95]} tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <ReferenceLine y={87.4} stroke={P.muted} strokeDasharray="4 4" label={{ value: "LR baseline", fill: P.muted, fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="r2" name="R² Score (%)" radius={[5, 5, 0, 0]}>
                  {modelComparison.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Full results table */}
          <div style={{ marginTop: 20, background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", background: P.surface, padding: "11px 18px", fontFamily: FONT_MONO, fontSize: 11, color: P.textDim, borderBottom: `1px solid ${P.border}` }}>
              <span>Model</span><span>Features</span><span>R² (test)</span><span>Notes</span>
            </div>
            {[
              { name: "Linear Regression",         feat: "73 (all)",  r2: "87.4%", note: "OHE + ordinal encoding, StandardScaler", hl: false },
              { name: "Random Forest",             feat: "73 (all)",  r2: "89.5%", note: "Default n_estimators=100, no tuning", hl: false },
              { name: "XGBoost (all features)",    feat: "73 (all)",  r2: "92.2%", note: "n_estimators=500, lr=0.05, depth=4", hl: false },
              { name: "CatBoost",                  feat: "23 selected", r2: "91.4%", note: "Untuned, iterations=500, depth=4", hl: false },
              { name: "XGBoost + target enc. ★",  feat: "23 selected", r2: "92.6%", note: "Post-tuning: n=800, depth=3, lr=0.05", hl: true  },
            ].map(({ name, feat, r2, note, hl }) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", padding: "12px 18px", fontSize: 13, color: hl ? P.accent : P.textDim, background: hl ? `${P.accent}08` : "transparent", borderBottom: `1px solid ${P.border}`, fontFamily: hl ? FONT_MONO : "inherit" }}>
                <span>{name}</span><span>{feat}</span><span>{r2}</span><span style={{ fontSize: 12 }}>{note}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
            <AnalysisBlock heading="Why curated features matched or beat the comprehensive set">
              The 73-feature comprehensive set includes duplicate columns, near-zero-variance features, and several engineered scores of uncertain quality (such as the exterior durability-age interaction, which involves domain assumptions not validated against external benchmarks). The curated 23-feature set discards these and focuses on signals confirmed by importance analysis. XGBoost's built-in regularisation likely compensates for both sets, but the curated set may provide cleaner gradients.
            </AnalysisBlock>
            <AnalysisBlock heading="Why Linear Regression performs reasonably well">
              An R² of 87.4% from a linear model suggests the relationship between the selected features and SalePrice is substantially linear in the transformed feature space. Much of the nonlinearity may already be handled by the ordinal encodings and the engineered features. The 5-point gap between Linear Regression and tuned XGBoost represents the value of capturing interaction effects and local nonlinearities that a linear boundary cannot model.
            </AnalysisBlock>
          </div>
        </div>

        {/* ══ 07 FEATURE IMPORTANCE ══ */}
        <div id="housing-importance" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={7} title="What the Model Learned Matters" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            Feature importances were derived from the Random Forest model (mean decrease in impurity across 100 trees). These importances were computed on the full 73-feature matrix and informed the feature selection for the curated set. Two findings stand out: the extreme dominance of <Mono>OverallQual</Mono>, and the appearance of the engineered <Mono>BsmtHeight</Mono> and <Mono>exterior_1_age_score</Mono> features in the top 10.
          </p>

          <ChartCard label="Chart 6 — Top 10 features by importance % (Random Forest, mean impurity reduction)">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={featureImportance} layout="vertical" barCategoryGap="22%">
                <CartesianGrid horizontal={false} stroke={P.border} />
                <XAxis type="number" tick={{ fill: P.textDim, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="feature" tick={{ fill: P.textDim, fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={155} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Bar dataKey="importance" name="Importance %" radius={[0, 5, 5, 0]}>
                  {featureImportance.map((d, i) => (
                    <Cell key={i} fill={d.importance > 10 ? P.accent : d.importance > 5 ? P.orange : P.teal} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 20 }}>
            {[
              { title: "OverallQual at 62.2% is a concentration risk", color: P.accent, body: "A single feature accounting for nearly two-thirds of model importance is both informative and concerning. It suggests the model is heavily reliant on a single 10-point rating that is itself a human judgment. If that rating is inconsistently applied across appraisers or neighbourhoods, model performance may degrade on out-of-distribution data in ways that R² on the test set would not reveal." },
              { title: "GrLivArea at 12.7% confirms size as the second axis", color: P.orange, body: "Above-grade living area is the strongest purely dimensional predictor, outperforming TotalBsmtSF, 1stFlrSF, and 2ndFlrSF individually. This is consistent with real-estate market intuition: buyers primarily price on usable, above-ground, finished space. The engineered BsmtHeight feature's appearance at rank 10 suggests basement quality adds marginal signal beyond raw area." },
              { title: "BsmtHeight and exterior_1_age_score validate the engineering approach", color: P.teal, body: "Two engineered features appear in the top 10, which validates the hypothesis that domain-informed transformations can extract signal that raw columns alone do not surface. exterior_1_age_score (rank 11 in the full importance table) combines age and material durability into a single wear-burden signal. Its presence suggests the model finds it informative, though the specific durability weights are domain assumptions rather than data-derived values." },
            ].map(({ title, color, body }) => (
              <div key={title} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "16px 18px", borderTop: `3px solid ${color}` }}>
                <strong style={{ fontSize: 13.5, color: P.text, display: "block", marginBottom: 10, lineHeight: 1.4 }}>{title}</strong>
                <p style={{ margin: 0, fontSize: 13, color: P.textDim, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 08 HYPERPARAMETER TUNING ══ */}
        <div id="housing-tuning" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={8} title="Hyperparameter Tuning" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 20 }}>
            Two rounds of <Mono>RandomizedSearchCV</Mono> were run: one on the 73-feature comprehensive set and one on the 23-feature curated set. Each ran 50 random combinations with 5-fold cross-validation (250 total fits per search). The curated-feature search produced the better test score.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div>
              {[
                { param: "n_estimators = 800", why: "More boosting rounds allow the model to continue correcting residuals on a shallow, well-regularised tree. At learning_rate = 0.05, 800 rounds provided better convergence than the default 500 without visible overfitting on the validation folds." },
                { param: "max_depth = 3", why: "Shallow trees keep individual learners weak and the ensemble strong. For this dataset, where two features dominate importance, deep trees would likely overfit to interactions between minor features that have limited generalisability." },
                { param: "learning_rate = 0.05", why: "A moderate rate that balances convergence speed with generalisation. The grid search also tested 0.03 and 0.01; 0.05 with 800 estimators achieved the best CV score in the curated-feature run." },
                { param: "gamma = 0.2", why: "A small minimum loss reduction requirement for further tree splits. This acts as a soft regulariser that prevents trivially small gains from being exploited, which may be particularly helpful given the large number of near-zero-importance features in the full set." },
              ].map(({ param, why }) => (
                <div key={param} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                  <Mono>{param}</Mono>
                  <p style={{ margin: 0, fontSize: 13.5, color: P.textDim, lineHeight: 1.75 }}>{why}</p>
                </div>
              ))}
            </div>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden", alignSelf: "start" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${P.border}`, fontFamily: FONT_MONO, fontSize: 11, color: P.textDim }}>TUNING SUMMARY (CURATED SET)</div>
              <TableRow label="Search strategy"     value="RandomizedSearchCV" />
              <TableRow label="Combinations tried"  value="50" />
              <TableRow label="CV folds"            value="5-fold" />
              <TableRow label="Total model fits"    value="250" />
              <TableRow label="Best CV R²"          value="88.3%" highlight />
              <TableRow label="Final test R²"       value="92.6%" highlight />
              <TableRow label="Gap (CV to test)"    value="+4.3 pts" />
            </div>
          </div>
          <Callout color={P.orange} icon="⚠">
            <strong style={{ color: P.text }}>The CV score (88.3%) is notably lower than the test R² (92.6%).</strong> A positive gap of this magnitude is unusual. Typical cross-validation scores slightly exceed test scores because the full training set is used for the final fit. The inverse here may indicate that the random 80/20 test split captured a particularly "easy" subset of the data, or that the target encoding was computed differently between the CV folds and the final train/test split, creating a mild form of leakage. This warrants further investigation before treating 92.6% as a reliable out-of-sample estimate.
          </Callout>
        </div>

        {/* ══ 09 LIMITATIONS & NEXT STEPS ══ */}
        <div id="housing-next" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={9} title="Limitations & What Comes Next" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.rose, marginBottom: 18 }}>Known limitations</div>
              {[
                { title: "Positive CV to test gap raises leakage concerns", body: "The best CV R² of 88.3% being substantially below the test R² of 92.6% is an atypical result. Neighbourhood target encoding was implemented post-split for the final fit but may not have been applied consistently across all CV folds. If a fold's validation set saw neighbourhood averages computed from data that included those same rows, a mild leakage exists. This should be verified by implementing target encoding strictly within each CV fold." },
                { title: "Duplicate columns in the comprehensive feature matrix", body: "The concat operation that assembled the 73-feature matrix from sub-dataframes resulted in TotalBsmtSF and GarageArea appearing twice. This is confirmed in the column list output in cell 125. While XGBoost is generally tolerant of redundant features, this artifact should be resolved before any production use or further ensemble work." },
                { title: "Exterior durability weights are domain assumptions", body: "The durability_map used to create exterior_1_age_score assigns scores such as Stone: 1.0, VinylSd: 0.6, AsbShng: 0.3 based on domain reasoning alone. These weights were not derived from data. The feature appears in the top 10 importance ranking, so its influence is meaningful. An incorrect durability ordering could introduce systematic error into predictions for specific exterior types." },
                { title: "Single geographic market", body: "The dataset covers Ames, Iowa residential sales from 2006 to 2010. A model trained on this data may not transfer to other markets, time periods, or property types. The 2006 to 2010 window also includes the beginning of the US housing correction, which may mean some price relationships in the data differ from a stable market." },
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
                { title: "Log-transform the target variable", body: "SalePrice has a right-skewed distribution typical of real-estate data. Log-transforming the target before training would make the model optimise on percentage errors rather than absolute errors, which is generally more appropriate for a price prediction task where a $10K error on a $100K property is very different from the same error on a $500K property. RMSLE is the standard metric for Kaggle housing competitions for this reason." },
                { title: "Stacking XGBoost with LightGBM and Ridge", body: "The README notes stacking as a potential +1 to 2% R² improvement. A level-1 stack using out-of-fold predictions from XGBoost, LightGBM, and a Ridge regression meta-learner could capture complementary signal: XGBoost and LightGBM handle nonlinear interactions while Ridge smooths the final prediction surface." },
                { title: "Validate target encoding with proper CV fold isolation", body: "Neighbourhood target encoding should be implemented as a scikit-learn pipeline step, computed only from training fold rows during cross-validation. This ensures the CV score accurately reflects generalisation performance and allows the CV-to-test gap to be correctly interpreted." },
                { title: "SHAP values for prediction-level explainability", body: "With OverallQual dominating at 62.2% global importance, SHAP values would reveal whether individual predictions are also OverallQual-dominated or whether other features take over for specific property types (e.g., high-quality homes where structural details matter more). Per-prediction explanations also make the model auditable and can expose systematic errors by neighbourhood or property class." },
              ].map(({ title, body }) => (
                <div key={title} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${P.border}` }}>
                  <strong style={{ fontSize: 13.5, color: P.text, display: "block", marginBottom: 6 }}>{title}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: P.textDim, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.muted }}>
            Dataset: Kaggle Ames Housing · Stack: Python, XGBoost, CatBoost, scikit-learn, pandas, seaborn, matplotlib
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textDim }}>
              Western University · Department of Computer Science
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}