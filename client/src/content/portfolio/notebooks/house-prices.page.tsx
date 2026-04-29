import { useState, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, ScatterChart, Scatter,
  ReferenceLine,
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
import { AnalysisBlock, ChartCard } from "@/components/work/reportWidgets";

// ── STANDARD CHART COLORS ──────────────────────────────────────────────────

const CHART_COLORS = {
  primary: "var(--primary)",
  success: "var(--chart-success, #16a34a)",
  warning: "var(--accent-highlight)",
  danger: "var(--chart-danger, #dc2626)",
  secondary: "var(--chart-2)",
};

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

const LOT_TABS = ["avgPrice", "lotArea", "pricePerSF", "quality"] as const;
type LotTab = (typeof LOT_TABS)[number];

const LOT_TAB_LABELS: Record<LotTab, string> = {
  avgPrice: "Avg Price ($K)",
  lotArea: "Avg Lot Area (sqft)",
  pricePerSF: "Price per Lot sqft ($)",
  quality: "Avg Overall Quality",
};

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
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--foreground)", fontFamily: FONT_MONO }}>
      <div style={{ color: CHART_COLORS.primary, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--foreground)" }}>
          {p.name}: <span style={{ fontWeight: 600 }}>{typeof p.value === "number" ? p.value : p.value}</span>
        </div>
      ))}
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

export const workPageSections = [
  { id: "housing-overview",   label: "Overview" },
  { id: "housing-cleaning",   label: "Data Preparation" },
  { id: "housing-eda",        label: "Exploration" },
  { id: "housing-modeling",   label: "Modeling" },
  { id: "housing-importance", label: "Key Drivers" },
  { id: "housing-tuning",     label: "Hyperparameter Tuning" },
  { id: "housing-critique",   label: "Critical Review" },
  { id: "housing-next",       label: "Future Steps" },
] as const;

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function HousingPriceAnalysis(props: WorkPageProps) {
  const [activeLotTab, setActiveLotTab] = useState<LotTab>("avgPrice");

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
            backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.4,
          }} />
          <div style={{
            position: "absolute",
            top: "-20%",
            left: "60%",
            width: 600,
            height: 600,
            background: "radial-gradient(ellipse, rgb(99, 102, 241 / 0.08) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(1rem, 4vw, 3rem)", position: "relative" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>
                Regression Analysis · Machine Learning · Ames Housing Dataset
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
              Ames Residential<br />
              <span style={{ color: CHART_COLORS.primary }}>Price Prediction Analysis</span>
            </h1>

            <Body style={{ maxWidth: 660, marginBottom: 24, color: "var(--foreground)" }}>
              I explored the Ames Housing dataset to understand the factors that influence residential property values. This analysis focuses on data cleaning, feature engineering, and evaluating various regression models to predict sale prices.
            </Body>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {props.entry.tags?.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
          
          {/* ══ 01 OVERVIEW ══ */}
          <div id="housing-overview" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="Overview" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              This project analyzes the Ames Housing dataset, which contains 79 explanatory variables describing residential homes in Ames, Iowa. The goal was to perform a comprehensive data science workflow—from handling missing values to tuning high-performance gradient boosting models—to understand the underlying patterns in housing prices.
            </Body>
            <Notice color={CHART_COLORS.primary} icon="★">
              The focus was on identifying which property characteristics carry the most weight in determining value and how different modeling techniques handle the complexity of real estate data.
            </Notice>
          </div>

          {/* ══ 02 DATA PREPARATION ══ */}
          <div id="housing-cleaning" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="Data Preparation" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Before modeling, I addressed significant missing data and performed feature engineering. I focused on creating domain-informed features like an exterior age score and basement height ratings to capture signals that raw columns might miss.
            </Body>

            <div style={{
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--card)",
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                Chart 1: Missing Value Distribution
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={missingValues} layout="vertical">
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="feature" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="pct" name="Missing %" radius={[0, 4, 4, 0]}>
                    {missingValues.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Body style={{ fontSize: 12, color: "var(--foreground)", marginTop: 12 }}>
                Several features like PoolQC and Alley had over 90% missing values, requiring careful removal or imputation strategies during the cleaning phase.
              </Body>
            </div>
          </div>

          {/* ══ 03 EXPLORATION ══ */}
          <div id="housing-eda" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Exploration" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              I explored the relationship between property characteristics and sale prices. For instance, I looked at how different lot shapes and foundation types correlated with the final price and overall quality ratings.
            </Body>
            <Notice color={CHART_COLORS.secondary} icon="ℹ">
              The exploratory phase revealed that while dimensional features like living area are important, subjective ratings like overall quality often show the strongest correlation with price.
            </Notice>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 20, marginBottom: 24 }}>
              <ChartCard
                label="Chart 2: Foundation Type vs. Key Metrics"
                note={<>Properties with <Code>PConc</Code> (Poured Concrete) foundations consistently show higher average prices and quality ratings compared to <Code>CBlock</Code> (Cinder Block) foundations.</>}
              >
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={foundationComparison} barCategoryGap="32%">
                    <CartesianGrid vertical={false} stroke={"var(--border)"} />
                    <XAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 20, fontSize: 12 }} />
                    <Bar dataKey="PConc" name="Poured Concrete" fill={CHART_COLORS.primary} radius={[5, 5, 0, 0]} />
                    <Bar dataKey="CBlock" name="Cinder Block" fill={CHART_COLORS.secondary} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                label="Chart 3: Sale Condition vs. Mean Price ($K)"
                note={<>Properties sold under <Code>Partial</Code> conditions (often new construction) command significantly higher average prices, while <Code>AdjLand</Code> (adjacent land purchase) sales are the lowest.</>}
              >
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={saleConditionPrices} layout="vertical" barCategoryGap="22%">
                    <CartesianGrid horizontal={false} stroke={"var(--border)"} />
                    <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                    <YAxis type="category" dataKey="condition" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                    <Bar dataKey="mean" name="Mean Price ($K)" radius={[0, 5, 5, 0]}>
                      {saleConditionPrices.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", background: "var(--card)", padding: "11px 18px", fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)", borderBottom: `1px solid ${"var(--border)"}` }}>
                <span>Shape</span><span>Avg Price ($K)</span><span>Avg Lot Area (sqft)</span><span>Price per SF ($)</span><span>Avg Quality</span>
              </div>
              {lotShapeData.map((d, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "12px 18px", fontSize: 13, color: "var(--muted-foreground)", borderBottom: `1px solid ${"var(--border)"}`, fontFamily: FONT_MONO }}>
                  <span>{d.shape}</span>
                  <span>{d.avgPrice}</span>
                  <span>{d.lotArea}</span>
                  <span>{d.pricePerSF}</span>
                  <span>{d.quality}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ 04 MODELING ══ */}
          <div id="housing-modeling" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Modeling Approach" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              I benchmarked several models, ranging from simple Linear Regression to advanced Gradient Boosting. I tested both a comprehensive feature set and a curated set to see if deliberate selection improved generalization.
            </Body>

            <ChartCard
              label="Chart 4 : R² score by model configuration (test set, 20% holdout)"
              note={<>Linear Regression establishes my baseline at <strong style={{ color: CHART_COLORS.danger }}>87.4%</strong>. Random Forest adds 2 points at <strong style={{ color: CHART_COLORS.warning }}>89.5%</strong>. The two XGBoost configurations are close, with the curated 23-feature variant edging the 73-feature version by 0.4 points. CatBoost, without hyperparameter tuning, achieves <strong style={{ color: CHART_COLORS.secondary }}>91.4%</strong>.</>}
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={modelComparison} barCategoryGap="32%">
                  <CartesianGrid vertical={false} stroke={"var(--border)"} />
                  <XAxis dataKey="model" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
                  <YAxis domain={[85, 95]} tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <ReferenceLine y={87.4} stroke={"var(--muted-foreground)"} strokeDasharray="4 4" label={{ value: "LR baseline", fill: "var(--muted-foreground)", fontSize: 10, fontFamily: FONT_MONO }} />
                  <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                  <Bar dataKey="r2" name="R² Score (%)" radius={[5, 5, 0, 0]}>
                    {modelComparison.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Full results table */}
            <div style={{ marginTop: 20, background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 16, marginTop: 20 }}>
              <AnalysisBlock heading="Why my curated features matched or beat the comprehensive set">
                The 73-feature comprehensive set includes near-zero-variance features, and several engineered scores of uncertain quality (such as the exterior durability-age interaction, which involves domain assumptions I couldn't validate against external benchmarks). My curated 23-feature set discards these and focuses on signals I confirmed through importance analysis. XGBoost's built-in regularisation likely compensates for both sets, but the curated set may provide cleaner gradients.
              </AnalysisBlock>
              <AnalysisBlock heading="Why Linear Regression performed reasonably well">
                An R² of 87.4% from a linear model suggests the relationship between the features I selected and SalePrice is substantially linear in the transformed feature space. Much of the nonlinearity may already be handled by the ordinal encodings and the engineered features. The 5-point gap between Linear Regression and tuned XGBoost represents the value of capturing interaction effects and local nonlinearities that a linear boundary cannot model.
              </AnalysisBlock>
            </div>
          </div>

          {/* ══ 05 KEY DRIVERS ══ */}
          <div id="housing-importance" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Key Drivers" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              I derived feature importances from the Random Forest model (mean decrease in impurity across 100 trees), computed on the full 73-feature matrix. These importances informed my feature selection for the curated set. Two things stood out immediately: the extreme dominance of <Code>OverallQual</Code>, and the appearance of my engineered <Code>BsmtHeight</Code> and <Code>exterior_1_age_score</Code> features in the top 10.
            </Body>

            <ChartCard label="Chart 5 : Top 10 features by importance % (Random Forest, mean impurity reduction)">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={featureImportance} layout="vertical" barCategoryGap="22%">
                  <CartesianGrid horizontal={false} stroke={"var(--border)"} />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="feature" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} width={155} />
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
              <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 10, padding: "16px 18px", borderTop: `3px solid ${CHART_COLORS.primary}` }}>
                <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 10, lineHeight: 1.4 }}>OverallQual at 62.2% is a concentration risk I need to flag</strong>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>A single feature accounting for nearly two-thirds of model importance is both informative and concerning. It tells me the model is heavily reliant on a single 10-point rating that is itself a human judgment. If that rating is inconsistently applied across appraisers or neighbourhoods, model performance may degrade on out-of-distribution data in ways that R² on the test set would not reveal.</p>
              </div>
              <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 10, padding: "16px 18px", borderTop: `3px solid ${CHART_COLORS.warning}` }}>
                <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 10, lineHeight: 1.4 }}>GrLivArea at 12.7% confirms size as the second axis</strong>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>Above-grade living area is the strongest purely dimensional predictor I found, outperforming TotalBsmtSF, 1stFlrSF, and 2ndFlrSF individually. This is consistent with real-estate market intuition: buyers primarily price on usable, above-ground, finished space. My engineered BsmtHeight feature's appearance at rank 10 suggests basement quality adds marginal signal beyond raw area.</p>
              </div>
              <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: 10, padding: "16px 18px", borderTop: `3px solid ${CHART_COLORS.secondary}` }}>
                <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 10, lineHeight: 1.4 }}>BsmtHeight and exterior_1_age_score validate my engineering approach</strong>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>Two features I engineered appear in the top 10, which validates my hypothesis that domain-informed transformations can extract signal that raw columns alone don't surface. exterior_1_age_score (rank 11 in the full importance table) combines age and material durability into a single wear-burden signal. Its presence tells me the model found it informative, though the specific durability weights are domain assumptions rather than data-derived values.</p>
              </div>
            </div>
          </div>

          {/* ══ 06 HYPERPARAMETER TUNING ══ */}
          <div id="housing-tuning" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Hyperparameter Tuning" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              I ran two rounds of <Code>RandomizedSearchCV</Code>: one on the 73-feature comprehensive set and one on the 23-feature curated set. Each ran 50 random combinations with 5-fold cross-validation (250 total fits per search). The curated-feature search produced the better test score.
            </Body>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
              <div>
                {[
                  { param: "n_estimators = 800", why: "More boosting rounds allow the model to continue correcting residuals on a shallow, well-regularised tree. At learning_rate = 0.05, 800 rounds provided better convergence than the default 500 without visible overfitting on the validation folds." },
                  { param: "max_depth = 3", why: "Shallow trees keep individual learners weak and the ensemble strong. For this dataset, where two features dominate importance, deep trees would likely overfit to interactions between minor features that have limited generalisability." },
                  { param: "learning_rate = 0.05", why: "A moderate rate that balances convergence speed with generalisation. I also tested 0.03 and 0.01; 0.05 with 800 estimators achieved the best CV score in the curated-feature run." },
                  { param: "gamma = 0.2", why: "A small minimum loss reduction requirement for further tree splits. This acts as a soft regulariser that prevents trivially small gains from being exploited, which I found particularly helpful given the large number of near-zero-importance features in the full set." },
                ].map(({ param, why }) => (
                  <div key={param} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                    <Code>{param}</Code>
                    <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.75 }}>{why}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: "var(--radius-lg)", overflow: "hidden", alignSelf: "start" }}>
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${"var(--border)"}`, fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>TUNING SUMMARY (CURATED SET)</div>
                <TableRow label="Search strategy"     value="RandomizedSearchCV" />
                <TableRow label="Combinations tried"  value="50" />
                <TableRow label="CV folds"            value="5-fold" />
                <TableRow label="Total model fits"    value="250" />
                <TableRow label="Best CV R²"          value="88.3%" highlight />
                <TableRow label="Test R²"             value="92.6%" highlight />
                <TableRow label="Gap (CV to test)"    value="+4.3 pts" />
              </div>
            </div>
            <Notice color={CHART_COLORS.warning} icon="⚠">
              <strong style={{ color: "var(--foreground)" }}>The CV score (88.3%) is notably lower than the test R² (92.6%).</strong> A positive gap of this magnitude is unusual, and I want to flag it honestly. Typical cross-validation scores slightly exceed test scores because the full training set is used for the final fit. The inverse here may indicate that the random 80/20 test split captured a particularly "easy" subset of the data, or that my target encoding was computed differently between the CV folds and the final train/test split, creating a mild form of leakage. This warrants further investigation before treating 92.6% as a reliable out-of-sample estimate.
            </Notice>
          </div>

          {/* ══ 07 CRITICAL REVIEW ══ */}
          <div id="housing-critique" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={7} title="Critical Review" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Reflecting on the analysis, there are several limitations to the current approach. The dataset is a snapshot in time, which makes it difficult to capture the true evolution of property values. Additionally, the heavy reliance on a single subjective rating (Overall Quality) presents a potential risk for generalization.
            </Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
              <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: "var(--radius-lg)", padding: "24px" }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: CHART_COLORS.danger, marginBottom: 18 }}>Known limitations</div>
                <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                  <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>Positive CV to test gap raises leakage concerns</strong>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>The best CV R² of 88.3% being substantially below the test R² of 92.6% is an atypical result that I can't fully explain. My neighbourhood target encoding was implemented post-split for the final fit but may not have been applied consistently across all CV folds. If a fold's validation set saw neighbourhood averages computed from data that included those same rows, a mild leakage exists. I'd want to verify this by implementing target encoding strictly within each CV fold.</p>
                </div>
                <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                  <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>Exterior durability weights are domain assumptions</strong>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>The durability_map I used to create exterior_1_age_score assigns scores such as Stone: 1.0, VinylSd: 0.6, AsbShng: 0.3 based on my domain reasoning alone which is not from the data. The feature appears in the top 10 importance ranking, so its influence is meaningful. If my durability ordering is wrong for some materials, it could introduce systematic error into predictions for specific exterior types.</p>
                </div>
                <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                  <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>Single geographic market</strong>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>The dataset covers Ames, Iowa residential sales from 2006 to 2010. A model I trained on this data may not transfer to other markets, time periods, or property types. The 2006 to 2010 window also includes the beginning of the US housing correction, which may mean some price relationships differ from a stable market.</p>
                </div>
              </div>
              <Notice color={CHART_COLORS.warning} icon="💡">
                The extreme dominance of the Overall Quality feature tells us the model is heavily reliant on a human judgment that may be inconsistently applied across different neighborhoods.
              </Notice>
            </div>
          </div>

          {/* ══ 08 FUTURE STEPS ══ */}
          <div id="housing-next" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={8} title="Future Steps" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              To further refine the analysis, I would focus on several key areas to improve the model's robustness and the depth of the insights.
            </Body>
            <div style={{ background: "var(--card)", border: `1px solid ${"var(--border)"}`, borderRadius: "var(--radius-lg)", padding: "24px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: CHART_COLORS.secondary, marginBottom: 18 }}>High-value next steps</div>
              <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>Log-transform the target variable</strong>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>SalePrice has a right-skewed distribution typical of real-estate data. Log-transforming the target before training would make the model optimise on percentage errors rather than absolute errors, which is generally more appropriate for a price prediction task where a $10K error on a $100K property is very different from the same error on a $500K property. RMSLE is the standard metric for Kaggle housing competitions for this reason.</p>
              </div>
              <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>Stacking XGBoost with LightGBM and Ridge</strong>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>A level-1 stack using out-of-fold predictions from XGBoost, LightGBM, and a Ridge regression meta-learner could capture complementary signal: XGBoost and LightGBM handle nonlinear interactions while Ridge smooths the final prediction surface. I'd expect a +1 to 2% R² improvement from this.</p>
              </div>
              <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>Validate target encoding with proper CV fold isolation</strong>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>I'd want to implement neighbourhood target encoding as a scikit-learn pipeline step, computed only from training fold rows during cross-validation. This would ensure the CV score accurately reflects generalisation performance and let me correctly interpret the CV-to-test gap I observed.</p>
              </div>
              <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${"var(--border)"}` }}>
                <strong style={{ fontSize: 13.5, color: "var(--foreground)", display: "block", marginBottom: 6 }}>SHAP values for prediction-level explainability</strong>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>With OverallQual dominating at 62.2% global importance, SHAP values would reveal whether individual predictions are also OverallQual-dominated or whether other features take over for specific property types. Per-prediction explanations also make the model auditable and can expose systematic errors by neighbourhood or property class that aggregate metrics would hide.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </WorkReportShell>
  );
}



