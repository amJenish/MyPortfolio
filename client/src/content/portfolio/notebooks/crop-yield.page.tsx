import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  WorkChartCard,
  WorkChartTooltip,
  WorkExecutiveSummary,
  WorkFigure,
  WorkFooterLinks,
  WorkFramingQuestion,
  WorkProsCons,
  WorkSectionLabel,
  chartMuted,
  chartPrimary,
} from "../_shared";

export const workPageSections = [
  { id: "summary", label: "Summary" },
  { id: "data", label: "1. Data" },
  { id: "models", label: "2. Models" },
  { id: "per-crop", label: "3. Per-crop" },
] as const;

const modelBars = [
  { name: "Linear", value: 0.835 },
  { name: "GBM", value: 0.824 },
  { name: "Random Forest", value: 0.983 },
];

const tick = { fill: chartMuted, fontSize: 11 };

export default function CropYieldPage() {
  return (
    <div className="work-report-body space-y-10 text-sm leading-relaxed text-foreground sm:text-base">
      <WorkExecutiveSummary
        paragraphs={[
          "Per-crop Random Forest regressors on the Kaggle Agriculture Crop Yield dataset beat linear and gradient boosting baselines on an 80/20 global split (RF R² ≈ 0.98 on that split). Each crop gets its own model so maize-in-Brazil does not average with unrelated geographies; Streamlit app exposes predictions in kg/ha with sensible pesticide defaults per country.",
        ]}
        bullets={[
          "5-fold CV means tracked test closely for most crops—except plantains (only ~556 rows) where variance is wider.",
          "log1p on national pesticide tonnage tames heavy tails before scaling.",
        ]}
      />
      <WorkFramingQuestion>
        Given country, crop, rainfall, temperature (and imputed pesticide exposure), what yield rate (hg/ha) should we expect?
      </WorkFramingQuestion>

      <section className="space-y-4">
        <WorkSectionLabel number={1} title="Data and preprocessing" id="data" />
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Dropped Year / index columns; one-hot Area + Item</li>
          <li>log1p(pesticides_tonnes); StandardScaler on numerics</li>
          <li>Inference defaults pesticide to historical country average</li>
        </ul>
      </section>

      <section className="space-y-4">
        <WorkSectionLabel number={2} title="Model choice" id="models" />
        <WorkChartCard
          title="Global 80/20 comparison (R²)"
          takeaway="Random Forest captures non-linear climate interactions better than linear or GBM on this split."
        >
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelBars} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke="hsl(224 14% 18%)" />
                <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} domain={[0.75, 1]} tickFormatter={(v) => v.toFixed(2)} />
                <Tooltip content={<WorkChartTooltip />} />
                <Bar dataKey="value" name="R²" radius={[6, 6, 0, 0]}>
                  {modelBars.map((e, i) => (
                    <Cell key={i} fill={e.name === "Random Forest" ? chartPrimary : chartMuted} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WorkChartCard>
      </section>

      <section className="space-y-4">
        <WorkSectionLabel number={3} title="Per-crop snapshot" id="per-crop" />
        <p className="text-muted-foreground">
          Examples from the README: Cassava R² 0.962, Wheat 0.957, Maize 0.918, Plantains 0.714 (data-limited). CV means align
          with holdout for most crops.
        </p>
        <WorkProsCons
          pros={[
            "Trained crop-specific models where the data supported them instead of forcing one global fit.",
            "Wrapped inference in Streamlit so results are easy to show without digging through notebooks.",
            "Called out low-N crops explicitly so the metrics read as honest, not oversold.",
          ]}
          cons={[
            "Future work: richer features (soil, irrigation, weather stations) if hyperlocal accuracy matters.",
            "Pesticide signals are national aggregates—field-level data would be the next refinement.",
            "I'd add a small note in the UI that yield × area drives total production for stakeholders who need tonnage.",
          ]}
        />
      </section>

      <WorkFigure
        src="/portfolio/notebooks/crop-yield/ui.png"
        alt="Streamlit UI"
        caption="Add UI screenshot or residual diagnostics to client/public/portfolio/notebooks/crop-yield/."
        placeholder
      />

      <WorkFooterLinks
        github="https://github.com/amJenish/Crop-Yield-Predictor"
        notebook="https://nbviewer.org/github/amJenish/Crop-Yield-Predictor/blob/main/jupyter/build_models.ipynb"
        notebookLabel="build_models.ipynb (nbviewer)"
      />
    </div>
  );
}
