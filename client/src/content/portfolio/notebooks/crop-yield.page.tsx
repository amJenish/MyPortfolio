import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  WorkChartCard,
  WorkChartTooltip,
  WorkFigure,
  WorkSectionLabel,
  chartMuted,
  chartPrimary,
} from "../_shared";
import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

export const workPageSections = [
  { id: "summary", label: "Overview" },
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

export default function CropYieldPage(props: WorkPageProps) {
  return (
    <WorkReportShell {...props}>
      <div className="theme-body work-report-body mx-auto max-w-[min(100%,60rem)] space-y-10 px-4 pb-16 text-sm sm:px-6 sm:text-base">
        <section className="scroll-mt-28 space-y-4">
          <WorkSectionLabel number={1} title="Overview" id="summary" />
          <p className="text-report-body">
            Per-crop Random Forest regressors on the Kaggle Agriculture Crop Yield dataset beat linear and gradient boosting baselines on an 80/20 global split (RF R² ≈ 0.98 on that split). Each crop gets its own model so maize-in-Brazil does not average with unrelated geographies; Streamlit app exposes predictions in kg/ha with sensible pesticide defaults per country.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
            <li>5-fold CV means tracked test closely for most crops—except plantains (only ~556 rows) where variance is wider.</li>
            <li>log1p on national pesticide tonnage tames heavy tails before scaling.</li>
          </ul>
          <p className="border-l-2 border-primary/50 pl-4 leading-[1.6] text-muted-foreground">
            Given country, crop, rainfall, temperature (and imputed pesticide exposure), what yield rate (hg/ha) should we expect?
          </p>
        </section>

        <section className="space-y-4">
          <WorkSectionLabel number={2} title="Data and preprocessing" id="data" />
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Dropped Year / index columns; one-hot Area + Item</li>
            <li>log1p(pesticides_tonnes); StandardScaler on numerics</li>
            <li>Inference defaults pesticide to historical country average</li>
          </ul>
        </section>

        <section className="space-y-4">
          <WorkSectionLabel number={3} title="Model choice" id="models" />
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

        <section className="space-y-6">
          <WorkSectionLabel number={4} title="Per-crop snapshot" id="per-crop" />
          <p className="text-muted-foreground">
            Examples from the README: Cassava R² 0.962, Wheat 0.957, Maize 0.918, Plantains 0.714 (data-limited). CV means align
            with holdout for most crops.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">What went well</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
                <li>Trained crop-specific models where the data supported them instead of forcing one global fit.</li>
                <li>Wrapped inference in Streamlit so results are easy to show without digging through notebooks.</li>
                <li>Called out low-N crops explicitly so the metrics read as honest, not oversold.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Future improvements</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
                <li>Future work: richer features (soil, irrigation, weather stations) if hyperlocal accuracy matters.</li>
                <li>Pesticide signals are national aggregates—field-level data would be the next refinement.</li>
                <li>I&apos;d add a small note in the UI that yield × area drives total production for stakeholders who need tonnage.</li>
              </ul>
            </div>
          </div>
        </section>

        <WorkFigure
          src="/portfolio/notebooks/crop-yield/ui.png"
          alt="Streamlit UI"
          caption="Add UI screenshot or residual diagnostics to client/public/portfolio/notebooks/crop-yield/."
          placeholder
        />
      </div>
    </WorkReportShell>
  );
}
