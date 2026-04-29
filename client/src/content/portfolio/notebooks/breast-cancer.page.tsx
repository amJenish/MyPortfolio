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
  { id: "approach", label: "1. Approach" },
  { id: "results", label: "2. Results" },
] as const;

const f1Bars = [
  { name: "Logistic", value: 0.97 },
  { name: "RF alone", value: 0.985 },
  { name: "Stack+MLP meta", value: 0.992 },
];

const tick = { fill: chartMuted, fontSize: 11 };

export default function BreastCancerPage(props: WorkPageProps) {
  return (
    <WorkReportShell {...props}>
      <div className="theme-body work-report-body mx-auto max-w-[min(100%,60rem)] space-y-10 px-4 pb-16 text-sm sm:px-6 sm:text-base">
        <section className="scroll-mt-28 space-y-4">
          <WorkSectionLabel number={1} title="Overview" id="summary" />
          <p className="text-report-body">
            Starting from a strong logistic baseline (~98% accuracy), I moved to stacked ensembles. The most stable high performer was stacking logistic regression + random forest with an MLP meta-learner—about 99.2% F1 on the held-out test in my final run, with nested CV lining up (unlike earlier feature-split experiments that flirted with 100% in-sample).
          </p>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
            <li>Reported error profile on that split: 0 malignant→benign; 1 benign→malignant.</li>
            <li>Lesson: diverse base models + disciplined CV beat chasing feature subsets alone.</li>
          </ul>
          <p className="border-l-2 border-primary/50 pl-4 leading-[1.6] text-muted-foreground">
            How far can we push Wisconsin-style breast cancer classification without overfitting when some model combos hit perfect
            training scores?
          </p>
        </section>

        <section className="space-y-4">
          <WorkSectionLabel number={2} title="Approach" id="approach" />
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Baseline: L2 logistic on standardized features</li>
            <li>Feature-split experiments: correlated features → logistic, remainder → trees/MLP blends (unstable CV)</li>
            <li>Final: soft-vote logistic + RF, stack with MLP meta-learner (ReLU, Adam)</li>
          </ul>
        </section>

        <section className="space-y-6">
          <WorkSectionLabel number={3} title="Results" id="results" />
          <div className="flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
            <div>
              <div className="text-left text-xs font-medium text-muted-foreground">Stacked F1 (holdout)</div>
              <div className="font-heading text-2xl font-bold text-foreground">~99.2%</div>
            </div>
            <div>
              <div className="text-left text-xs font-medium text-muted-foreground">Baseline acc. (logistic)</div>
              <div className="font-heading text-2xl font-bold text-foreground">~98%</div>
            </div>
          </div>
          <WorkChartCard
            title="F1 trajectory (illustrative)"
            takeaway="Stack + MLP meta beats standalone logistic on F1 while staying CV-stable."
          >
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={f1Bars} barCategoryGap="30%">
                  <CartesianGrid vertical={false} stroke="hsl(224 14% 18%)" />
                  <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
                  <YAxis tick={tick} domain={[0.94, 1]} tickFormatter={(v) => v.toFixed(2)} axisLine={false} tickLine={false} />
                  <Tooltip content={<WorkChartTooltip />} />
                  <Bar dataKey="value" name="F1" radius={[6, 6, 0, 0]}>
                    {f1Bars.map((e, i) => (
                      <Cell key={i} fill={e.name === "Stack+MLP meta" ? chartPrimary : chartMuted} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </WorkChartCard>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">What went well</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
                <li>Documented a clear path from baseline models through to stacking so the narrative matches the notebook.</li>
                <li>Used nested CV to stress-test generalization instead of trusting a single holdout split.</li>
                <li>Highlighted malignant misses explicitly—aligned with how this problem is judged in practice.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Future improvements</h3>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
                <li>I&apos;d rerun sensitivity analysis on splits given the modest sample size.</li>
                <li>Next: a simpler deployment story or explainability layer if I shipped the stacked model beyond the notebook.</li>
              </ul>
            </div>
          </div>
        </section>

        <WorkFigure
          src="/portfolio/notebooks/breast-cancer/confusion.png"
          alt="Confusion matrix"
          caption="Add confusion matrix export to client/public/portfolio/notebooks/breast-cancer/."
          placeholder
        />
      </div>
    </WorkReportShell>
  );
}


