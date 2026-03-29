import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  WorkCallout,
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
  { id: "layout", label: "1. Layout" },
  { id: "metrics", label: "2. Metrics" },
] as const;

const bars = [
  { name: "Fixed-time", value: 10 },
  { name: "RL mid", value: 24 },
  { name: "RL late", value: 36 },
];

const tick = { fill: chartMuted, fontSize: 11 };

export default function RlTrafficPage() {
  return (
    <div className="work-report-body space-y-10 text-sm leading-relaxed text-foreground sm:text-base">
      <WorkExecutiveSummary
        paragraphs={[
          "Repository packages preprocessing, modelling, tests, and a main entry point for reinforcement-learning experiments on adaptive traffic-signal timing. Public README detail is still thin—treat this page as a living report while you add metrics, diagrams, and training curves from your runs.",
        ]}
      />
      <WorkFramingQuestion>
        Can a learned signal policy reduce average delay versus fixed-time plans in your simulator environment?
      </WorkFramingQuestion>

      <section className="space-y-4">
        <WorkSectionLabel number={1} title="Repository layout" id="layout" />
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Top-level main.py, config.json, diag.py</li>
          <li>Folders: preprocessing/, modelling/, src/, Testcases/</li>
          <li>Python-only codebase (per GitHub language stats)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <WorkSectionLabel number={2} title="Placeholder metrics" id="metrics" />
        <WorkChartCard
          title="Illustrative reward curve (replace with real logs)"
          takeaway="Swap this synthetic curve once you export episode rewards from training."
        >
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke="hsl(224 14% 18%)" />
                <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} />
                <Tooltip content={<WorkChartTooltip />} />
                <Bar dataKey="value" name="Return" radius={[6, 6, 0, 0]}>
                  {bars.map((e, i) => (
                    <Cell key={i} fill={e.name === "RL late" ? chartPrimary : chartMuted} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WorkChartCard>
        <WorkCallout>
          Add algorithm name (DQN, PPO, etc.), environment (SUMO, custom), state/action definitions, reward formula, and best
          checkpoint metrics from your experiments.
        </WorkCallout>
        <WorkProsCons
          pros={[
            "Organized data prep and modelling into separate modules so experiments stay readable.",
            "Left a tests folder in place for quick regression checks as the env evolves.",
          ]}
          cons={[
            "I'm planning a short write-up on reward design and how I judge success on the simulator.",
            "Next: pin seeds, configs, and dependency versions in the README for one-command repro.",
          ]}
        />
      </section>

      <WorkFigure
        src="/portfolio/notebooks/rl-traffic/training.png"
        alt="Training reward"
        caption="Add simulator screenshots and reward curves to client/public/portfolio/notebooks/rl-traffic/."
        placeholder
      />

      <WorkFooterLinks github="https://github.com/amJenish/RL-Traffic-Light-Optimization" />
    </div>
  );
}
