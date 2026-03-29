import { useState, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend,
} from "recharts";

import { FONT_MONO, FONT_SANS, notebookNeutrals } from "../notebooks/notebookTheme";

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

const rewardFunctions = [
  { name: "WaitTime",        stability: 3, clarity: 6, color: P.rose   },
  { name: "DeltaWaitTime",   stability: 5, clarity: 7, color: P.orange },
  { name: "Throughput",      stability: 6, clarity: 5, color: P.accent },
  { name: "ThroughputQueue", stability: 5, clarity: 6, color: P.teal   },
  { name: "Composite",       stability: 4, clarity: 4, color: P.purple },
];

const stabilityData = [
  { config: "WaitTime + DQN",     stable: 2, diverged: 4 },
  { config: "DeltaWait + DQN",    stable: 3, diverged: 3 },
  { config: "WaitTime + DDQN",    stable: 4, diverged: 2 },
  { config: "DeltaWait + DDQN",   stable: 5, diverged: 1 },
  { config: "ThroughputQ + DDQN", stable: 4, diverged: 2 },
];

const convergenceData = [
  { ep: 0,   dqn: -420, ddqn: -420 },
  { ep: 20,  dqn: -380, ddqn: -370 },
  { ep: 40,  dqn: -410, ddqn: -330 },
  { ep: 60,  dqn: -440, ddqn: -290 },
  { ep: 80,  dqn: -400, ddqn: -270 },
  { ep: 100, dqn: -460, ddqn: -255 },
  { ep: 120, dqn: -420, ddqn: -245 },
  { ep: 140, dqn: -450, ddqn: -240 },
  { ep: 160, dqn: -430, ddqn: -238 },
  { ep: 180, dqn: -460, ddqn: -235 },
];

// ── SHARED UI ─────────────────────────────────────────────────────────────────

type TooltipPayloadItem = {
  name?: string;
  value?: string | number | ReadonlyArray<string | number>;
  color?: string;
};

function Tip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string | number }): React.JSX.Element | null {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: P.card, border: `1px solid ${P.border}`, padding: "10px 14px", borderRadius: 8, fontSize: 13, color: P.text, fontFamily: FONT_MONO }}>
      <div style={{ color: P.accent, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || P.text }}>
          {p.name}:{" "}
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function Section({ n, title }: { n: number; title: string }): React.JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, border: `1px solid ${P.accentDim}`, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
        {String(n).padStart(2, "0")}
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

function ChartCard({ label, note, illustrative, children }: { label?: string; note?: ReactNode; illustrative?: boolean; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ background: P.card, border: `1px solid ${illustrative ? P.muted : P.border}`, borderRadius: 12, padding: "28px 28px 20px", position: "relative" }}>
      {illustrative && (
        <div style={{ position: "absolute", top: 12, right: 14, fontFamily: FONT_MONO, fontSize: 11, color: P.muted, border: `1px solid ${P.muted}40`, padding: "2px 7px", borderRadius: 4 }}>
          Illustrative
        </div>
      )}
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

function ComponentNode({ name, file, color, note }: { name: string; file: string; color: string; note: string }): React.JSX.Element {
  return (
    <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${color}` }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color, marginBottom: 4 }}>{name}</div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.muted, marginBottom: 8 }}>{file}</div>
      <div style={{ fontSize: 12.5, color: P.textDim, lineHeight: 1.6 }}>{note}</div>
    </div>
  );
}

const REWARD_TABS = ["WaitTime", "DeltaWaitTime", "Throughput", "Composite", "ThroughputQueue"] as const;
type RewardTab = (typeof REWARD_TABS)[number];

export const workPageSections = [
  { id: "rl-kpis",     label: "Overview"           },
  { id: "rl-problem",  label: "The problem"        },
  { id: "rl-arch",     label: "Architecture"       },
  { id: "rl-rewards",  label: "Reward engineering" },
  { id: "rl-dqn",      label: "DQN → Double DQN"  },
  { id: "rl-training", label: "Training runs"      },
  { id: "rl-now",      label: "Where I am now"     },
] as const;

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function RLTrafficReport() {
  const [activeReward, setActiveReward] = useState<RewardTab>("DeltaWaitTime");

  const rewardDetail: Record<RewardTab, { formula: string; color: string; body: string; risk: string }> = {
    WaitTime: {
      formula: "r = −Σ wait_i",
      color: P.rose,
      body: "The most direct formulation: penalise by total cumulative waiting time across all vehicles at every decision step. The signal is strong and unambiguous as every unit of delay is directly reflected in the reward. In practice this produces large-magnitude, dense reward values that can cause Q-value scale issues early in training.",
      risk: "High-magnitude rewards compound Q-value overestimation. The signal is also volume-sensitive, so a heavy-traffic episode produces much larger absolute penalties than a light one even if the agent is making equally good decisions.",
    },
    DeltaWaitTime: {
      formula: "r = wait_prev − wait_curr",
      color: P.orange,
      body: "Instead of penalising absolute delay, I reward the reduction in waiting vehicles compared to the previous step. The signal is relative: positive when congestion decreases, negative when it increases, and zero when nothing changes. This makes it less sensitive to traffic volume variance across the 60-day training window, which was a real problem with WaitTime.",
      risk: "Oscillatory policies. An agent can learn to alternate phases in a way that manufactures an artificial decrease-then-increase cycle, producing a net-zero delta without actually improving throughput. Anti-oscillation constraints are on the roadmap for the Composite formulation.",
    },
    Throughput: {
      formula: "r = vehicles_cleared",
      color: P.accent,
      body: "Reward is proportional to the number of vehicles that clear the intersection during the current phase. Intuitive and directly tied to what a good signal policy should achieve. The signal is sparse by design as it only accumulates during active green phases.",
      risk: "Throughput alone ignores queue buildup on non-served approaches. An agent optimising purely for throughput on one direction will happily let perpendicular queues grow if that maximises clearance on the dominant flow.",
    },
    ThroughputQueue: {
      formula: "r = α·throughput − β·queue",
      color: P.teal,
      body: "A two-term reward combining positive throughput signal with a queue-length penalty. This directly patches the failure mode of the pure throughput formulation. The α and β weights control the trade-off between clearing vehicles and preventing buildup. Getting this balance right is non-trivial and likely varies with traffic pattern.",
      risk: "The weighting is fragile. Too much throughput emphasis and the agent ignores queues. Too much queue penalty and the agent becomes overly conservative, switching phases before they've cleared the current wave.",
    },
    Composite: {
      formula: "r = w₁·Δwait + w₂·throughput − w₃·queue",
      color: P.purple,
      body: "My attempt at combining the best parts of each formulation into a single weighted objective. The delta term incentivises improvement, throughput rewards clearance, and the queue term prevents one-directional bias. Anti-oscillation mechanisms are planned here specifically to guard against the gaming behaviour I observed with DeltaWaitTime.",
      risk: "Multi-term rewards are much harder to debug. When training performs poorly, it is not obvious which term is the problem and which is compensating. Per-term logging during training is something I want to add before leaning on this formulation.",
    },
  };

  const rd = rewardDetail[activeReward];

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: FONT_SANS, textAlign: "left" }}>

      {/* ── HERO ── */}
      <div style={{ borderBottom: `1px solid ${P.border}`, padding: "72px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, #1e2d3d 1px, transparent 0)", backgroundSize: "28px 28px", opacity: 0.5 }} />
        <div style={{ position: "absolute", top: "-20%", left: "60%", width: 600, height: 600, background: "radial-gradient(ellipse, #2dd4bf08 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 40px", position: "relative" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent }}>
              Reinforcement learning · traffic control · reward engineering
            </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.orange, background: `${P.orange}18`, border: `1px solid ${P.orange}50`, padding: "2px 10px", borderRadius: 20 }}>
              In progress
            </span>
          </div>
          <h1 style={{ fontFamily: FONT_SANS, fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.15, color: P.text, letterSpacing: -0.02 }}>
            Adaptive traffic signal<br /><span style={{ color: P.teal }}>Control via reinforcement learning</span>
          </h1>
          <p style={{ fontSize: 17, color: P.textDim, maxWidth: 680, lineHeight: 1.8, margin: "0 0 14px", textAlign: "left" }}>
            I&apos;m building a reinforcement learning system that learns adaptive signal timing policies at a single intersection from 60 days of historical traffic data.{" "}
            <span style={{ color: P.text }}>Key question:</span> can a learned policy consistently outperform a fixed-time plan, and which reward formulation gets us there most reliably?
          </p>
          <p style={{ fontSize: 15, color: P.textDim, maxWidth: 680, lineHeight: 1.7, margin: "0 0 36px" }}>
            The system so far is built around a modular components-and-connector architecture that lets me swap reward functions, observation spaces, and agent architectures independently. I've implemented DQN and Double DQN, designed five reward formulations, and have both fixed-time and actuated baselines ready. Right now I'm working through a convergence problem before I can run clean comparisons.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Python", "PyTorch", "SUMO", "Double DQN", "SMDP", "Reward Engineering"].map(t => (
              <span key={t} style={{ fontFamily: FONT_MONO, fontSize: 11, background: P.surface, border: `1px solid ${P.border}`, color: P.teal, padding: "5px 12px", borderRadius: 20 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "60px 40px" }}>

        {/* KPIs */}
        <div id="rl-kpis" className="scroll-mt-28" style={{ display: "flex", gap: 16, marginBottom: 80, flexWrap: "wrap" }}>
          <KPI label="Training data"    value="60d" sub="Days of historical intersection flow driving the simulator"                  color={P.teal}   />
          <KPI label="Reward functions" value="5"   sub="WaitTime, DeltaWaitTime, Throughput, ThroughputQueue, Composite"             color={P.accent} />
          <KPI label="Baselines"        value="2"   sub="Fixed-time and actuated signal plans, both implemented and ready to compare"  color={P.orange} />
          <KPI label="Current blocker"  value="Convergence" sub="Agent is learning but not reliably converging across reward configs"  color={P.rose}   />
        </div>

        {/* ══ 01 THE PROBLEM ══ */}
        <div id="rl-problem" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={1} title="The Problem" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0 }}>
                Fixed-time signal plans are the default at most intersections. They allocate green time according to a preset schedule that never changes, regardless of how traffic actually behaves. The result is wasted green time during low-demand windows and unnecessary queuing when demand spikes. I want to replace that static schedule with a policy that observes intersection state and adapts its timing decisions in real time.
              </p>
              <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85 }}>
                I'm framing this as a Semi-Markov Decision Process (SMDP) rather than a standard MDP because signal phases have variable durations. An MDP assumes fixed time steps between decisions, which doesn't map cleanly onto how intersections work. SMDP handles variable holding times by discounting rewards by the actual elapsed time per decision, making the timing of phase switches part of what the agent learns, not an external parameter.
              </p>
            </div>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${P.border}`, fontFamily: FONT_MONO, fontSize: 11, color: P.textDim }}>Current project snapshot</div>
              {[
                ["Framework",     "Semi-Markov Decision Process (SMDP)" ],
                ["Simulator",     "SUMO, seeded from 60-day traffic data"],
                ["Observation",   "Queue lengths per approach"           ],
                ["Action space",  "Discrete (keep phase or switch to next phase)"  ],
                ["Baselines",     "fixed_time.py + actuated.py (built)"  ],
                ["Current agent", "Double DQN"                          ],
                ["LR Scheduler",  "Cosine Scheduler"                    ],
                ["Replay",        "Uniform experience replay"            ],
              ].map(([k, v]) => <TableRow key={k} label={k} value={v} />)}
            </div>
          </div>
        </div>

        {/* ══ 02 ARCHITECTURE ══ */}
        <div id="rl-arch" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={2} title="How I Built It" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 28 }}>
            The codebase is built around a components-and-connector pattern. Every major piece of the system has an abstract base class and a concrete implementation. The <Mono>agent.py</Mono> and <Mono>trainer.py</Mono> act as the connectors, wiring together whichever combination of components a given experiment requires. This means I can swap a reward function without touching anything else, add a new architecture without rewriting the training loop, and run experiments as pure config changes.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            <ComponentNode name="Environment"    file="sumo_environment.py"  color={P.teal}   note="Wraps SUMO, manages simulation state, handles phase transitions, exposes step/reset to the agent." />
            <ComponentNode name="Observation"    file="queue_observation.py" color={P.teal}   note="Extracts queue length per lane from SUMO and formats it as the state vector fed to the Q-network." />
            <ComponentNode name="Reward"         file="5 implementations"    color={P.accent} note="Pluggable reward functions. Each implements the same base interface so the trainer doesn't care which one is active." />
            <ComponentNode name="Policy"         file="double_dqn.py"        color={P.purple} note="Q-network, target network, and update logic. DQN and Double DQN both live here." />
            <ComponentNode name="Replay Buffer"  file="uniform.py"           color={P.orange} note="Stores (s, a, r, s', done) tuples and samples random minibatches for the Q-network update." />
            <ComponentNode name="Scheduler"      file="cosine.py"            color={P.rose}   note="Cosine learning rate scheduling applied to the Q-network optimizer across training epochs." />
          </div>

          <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 16 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textDim, marginBottom: 16 }}>Connectors</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: P.accent, marginBottom: 8 }}>agent.py</div>
                <p style={{ fontSize: 13.5, color: P.textDim, lineHeight: 1.75, margin: 0 }}>
                  Owns the policy and replay buffer. Exposes <Mono>act(state)</Mono> for epsilon-greedy action selection and <Mono>learn()</Mono> for sampling from the buffer and updating the Q-network. Deliberately knows nothing about the environment or reward function as that's the trainer's job.
                </p>
              </div>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: P.accent, marginBottom: 8 }}>trainer.py</div>
                <p style={{ fontSize: 13.5, color: P.textDim, lineHeight: 1.75, margin: 0 }}>
                  Orchestrates the training loop. Holds environment, reward function, and scheduler, and coordinates the interaction between them. At each step it gets the next state from the environment, computes reward, and passes the transition to the agent. Experiments are driven by <Mono>reward_configuration.json</Mono> and <Mono>policy_configuration.json</Mono> with no code changes between runs.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Callout color={P.teal} icon="✓">
              <strong style={{ color: P.text }}>Baselines are first-class citizens.</strong> <Mono>fixed_time.py</Mono> and <Mono>actuated.py</Mono> live in a dedicated <Mono>baselines/</Mono> module, with <Mono>evaluate_baseline.py</Mono> and <Mono>BASELINES_AND_EVALUATION.md</Mono> at the root. Comparing the RL agent against a fixed-time plan is built into the project, not an afterthought I'll add later.
            </Callout>
            <Callout color={P.orange} icon="→">
              <strong style={{ color: P.text }}>Grid search is already wired up.</strong> The <Mono>experiments/grid_search/</Mono> directory holds sweep configurations for systematic hyperparameter exploration. The infrastructure is ready. I just need stable training runs before a sweep produces meaningful signal.
            </Callout>
          </div>
        </div>

        {/* ══ 03 REWARD ENGINEERING ══ */}
        <div id="rl-rewards" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={3} title="Reward Engineering" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            Reward design has been the majority of the research work so far. The reward function defines what the agent is actually optimising for, and different formulations produce very different agent behaviours even with identical architectures. I built five reward functions, each implementing the same base interface so they're fully interchangeable in the training loop.
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {REWARD_TABS.map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveReward(tab)} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: "8px 18px", borderRadius: 6, cursor: "pointer", background: activeReward === tab ? P.accent : P.surface, color: activeReward === tab ? P.bg : P.textDim, border: `1px solid ${activeReward === tab ? P.accent : P.border}`, transition: "all 0.15s" }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "28px", borderTop: `3px solid ${rd.color}`, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: FONT_SANS, fontSize: 22, color: P.text, margin: 0, fontWeight: 700 }}>{activeReward}</h3>
              <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: P.teal, background: "#0d1926", border: `1px solid ${P.border}`, padding: "10px 18px", borderRadius: 8 }}>
                {rd.formula}
              </div>
            </div>
            <p style={{ fontSize: 14, color: P.textDim, lineHeight: 1.85, margin: "0 0 16px" }}>{rd.body}</p>
            <div style={{ background: `${P.orange}10`, border: `1px solid ${P.orange}30`, borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.orange, flexShrink: 0, marginTop: 1 }}>Risk</span>
              <span style={{ fontSize: 13, color: P.textDim, lineHeight: 1.6 }}>{rd.risk}</span>
            </div>
          </div>

          <ChartCard
            label="Chart 1: Reward design tradeoffs (qualitative assessment from training runs)"
            note="Stability = how consistent the training signal is across runs. Signal clarity = how directly it maps to the real objective. These are my assessments from observing training behaviour, not measured scores."
            illustrative
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rewardFunctions} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke={P.border} />
                <XAxis dataKey="name" tick={{ fill: P.textDim, fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: P.textDim, fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT_MONO, color: P.textDim }} />
                <Bar dataKey="stability" name="Stability"      fill={P.teal}   radius={[3, 3, 0, 0]} />
                <Bar dataKey="clarity"   name="Signal clarity" fill={P.accent} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <AnalysisBlock heading="Where I landed">
            DeltaWaitTime has been the most useful reward so far. It is sensitive enough to guide learning but relative enough not to be dominated by volume variance between episodes. The main thing I still need to handle is the oscillation risk before I can rely on it for clean comparisons. ThroughputQueue is where I want to get to, but the weight sensitivity makes stable training harder to achieve. Composite is the end goal and comes last, once the individual formulations are validated.
          </AnalysisBlock>
        </div>

        {/* ══ 04 DQN → DOUBLE DQN ══ */}
        <div id="rl-dqn" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={4} title="DQN → Double DQN" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            I started with DQN. It did not work well here. Training was unstable, Q-values were inflating without corresponding policy improvement, and learned behaviours were erratic. Moving to Double DQN was the right call and the results are meaningfully better, though convergence is still what I'm actively working through.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px", borderTop: `3px solid ${P.rose}` }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.rose, marginBottom: 12 }}>DQN: what went wrong</div>
              <p style={{ fontSize: 14, color: P.textDim, lineHeight: 1.8, margin: "0 0 12px" }}>
                Standard DQN uses the same network to select and evaluate actions. When computing the TD target it takes the max Q-value from the target network but the network choosing which action is optimal is the same one being trained. In environments with variable, noisy reward signals, this creates a feedback loop: the network systematically overestimates the value of the action it chose, which inflates Q-values, which destabilises the loss.
              </p>
              <p style={{ fontSize: 14, color: P.textDim, lineHeight: 1.8, margin: 0 }}>
                In a traffic environment where rewards vary a lot between episodes depending on traffic volume, this overestimation gets amplified quickly. The agent ends up confidently committing to phases that are not actually better, and the policy oscillates rather than converges.
              </p>
            </div>

            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px", borderTop: `3px solid ${P.accent}` }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, marginBottom: 12 }}>Double DQN — the fix</div>
              <p style={{ fontSize: 14, color: P.textDim, lineHeight: 1.8, margin: "0 0 16px" }}>
                Double DQN decouples action selection from action evaluation. The online network selects which action is greedy; the target network evaluates what that action is actually worth. This breaks the overestimation loop because the two networks are not aligned, the target network will often assign a lower value to the online network's chosen action, pulling estimates back toward reality.
              </p>
              <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 8, padding: "11px 14px", marginBottom: 10 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.muted, marginBottom: 4 }}>DQN target</div>
                <Mono>r + γ · max Q(s′, a; θ⁻)</Mono>
              </div>
              <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 8, padding: "11px 14px" }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, marginBottom: 4 }}>Double DQN target</div>
                <Mono>r + γ · Q(s′, argmax Q(s′,a; θ); θ⁻)</Mono>
              </div>
            </div>
          </div>

          <ChartCard
            label="Chart 2 : DQN vs Double DQN training reward (illustrative shape from observed runs)"
            note="DQN runs showed large variance with no sustained improvement trend. Double DQN runs show more consistent improvement direction. These shapes are derived from observed training behaviour. Exact values will follow once the dtype issue is resolved."
            illustrative
          >
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={convergenceData}>
                <CartesianGrid stroke={P.border} vertical={false} />
                <XAxis dataKey="ep" tick={{ fill: P.textDim, fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} label={{ value: "Episode", position: "insideBottom", offset: -4, fill: P.textDim, fontSize: 11 }} />
                <YAxis tick={{ fill: P.textDim, fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} cursor={{ stroke: P.border }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT_MONO, color: P.textDim }} />
                <Line type="monotone" dataKey="dqn"  name="DQN"        stroke={P.rose}   strokeWidth={2} dot={false} strokeDasharray="5 4" />
                <Line type="monotone" dataKey="ddqn" name="Double DQN" stroke={P.accent} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <Callout color={P.orange} icon="🔧">
            <strong style={{ color: P.text }}>A dtype bug is contaminating some runs.</strong> I found a bug where certain tensor construction paths produce mixed float/int types, causing loss values to diverge partway through training. It looks like a reward function failure when it's actually a numerical precision issue in the backward pass. Resolving this is the first thing on my list before I run any comparative analysis across reward configs.
          </Callout>
        </div>

        {/* ══ 05 TRAINING RUNS ══ */}
        <div id="rl-training" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={5} title="What the Training Runs Show" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 24 }}>
            I've run 22 trials across different reward configurations and agent variants. Below are the patterns I'm seeing across those runs, using training stability as the primary lens since full performance comparisons are blocked pending the dtype fix.
          </p>

          <ChartCard label="Chart 3 : Training stability by configuration (stable runs vs diverged)">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={stabilityData} layout="vertical" barCategoryGap="25%">
                <CartesianGrid horizontal={false} stroke={P.border} />
                <XAxis type="number" tick={{ fill: P.textDim, fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="config" tick={{ fill: P.textDim, fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} width={160} />
                <Tooltip content={<Tip />} cursor={{ fill: "#ffffff06" }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT_MONO, color: P.textDim }} />
                <Bar dataKey="stable"   name="Stable"   fill={P.teal} radius={[0, 4, 4, 0]} />
                <Bar dataKey="diverged" name="Diverged" fill={P.rose} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
            {[
              { icon: "📊", color: P.teal,   title: "Double DQN is clearly more stable",             body: "Across the same reward configs, Double DQN runs diverge less frequently and show more consistent reward trends. The overestimation correction is doing its job even in these early runs before the dtype issue was fully identified." },
              { icon: "🔀", color: P.orange, title: "DeltaWaitTime produces the cleanest signal",     body: "Runs using DeltaWaitTime show the most consistent learning curves. The relative formulation smooths out the per-episode volume variance that was making WaitTime runs swing widely between training windows." },
              { icon: "⚖",  color: P.accent, title: "ThroughputQueue is promising, weight-sensitive", body: "When the α/β balance is right, ThroughputQueue runs improve faster. But the weight sensitivity means small config changes lead to very different training behaviour. A grid search over these weights is next after I get stable baselines." },
              { icon: "🚫", color: P.rose,   title: "Some divergences are implementation, not reward", body: "After finding the dtype bug, I reviewed runs where I assumed a reward config had failed. Some of those were almost certainly the implementation issue. Those runs need to be rerun cleanly before I draw conclusions about the reward functions." },
            ].map(({ icon, color, title, body }) => (
              <div key={title} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "18px", borderTop: `3px solid ${color}` }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <strong style={{ fontSize: 13.5, color: P.text, lineHeight: 1.4 }}>{title}</strong>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: P.textDim, lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 06 WHERE I AM NOW ══ */}
        <div id="rl-now" className="scroll-mt-28" style={{ marginBottom: 80 }}>
          <Section n={6} title="Where I Am Now" />
          <p style={{ fontSize: 15, color: P.textDim, lineHeight: 1.85, marginTop: 0, marginBottom: 28 }}>
            The system is built, the baselines are in place, and Double DQN is training. The thing I'm actively working through is convergence. The agent is learning in the sense that reward trends in the right direction, but it is not reliably converging to a stable policy across runs. There are two main reasons for this.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px", borderTop: `3px solid ${P.rose}` }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.rose, marginBottom: 12 }}>Convergence issue 1 — reward scale variance</div>
              <p style={{ fontSize: 14, color: P.textDim, lineHeight: 1.8, margin: "0 0 12px" }}>
                The magnitude of the reward signal varies significantly between episodes depending on traffic volume in that simulation window. A heavy-traffic episode produces much larger absolute penalties than a light one, even when the agent is making equally good decisions. This means the Q-network is seeing very different loss scales across training, making it hard to find a stable learning direction.
              </p>
              <p style={{ fontSize: 14, color: P.textDim, lineHeight: 1.8, margin: 0 }}>
                Reward normalisation or clipping is the direction I'm looking at. Keeping the signal within a consistent range should let the Q-network converge without its gradient being dominated by outlier episodes.
              </p>
            </div>
            <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px", borderTop: `3px solid ${P.orange}` }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.orange, marginBottom: 12 }}>Convergence issue 2: target network update timing</div>
              <p style={{ fontSize: 14, color: P.textDim, lineHeight: 1.8, margin: "0 0 12px" }}>
                How often the target network syncs to the online network significantly affects convergence. Update too frequently and the target is a moving reference that the online network cannot reliably learn against. Update too infrequently and the TD error diverges because the target becomes stale.
              </p>
              <p style={{ fontSize: 14, color: P.textDim, lineHeight: 1.8, margin: 0 }}>
                I haven't done a systematic sweep over this yet. It's in the grid search config, and running that sweep after the dtype fix is the most direct path to understanding how much it's contributing to the instability I'm seeing.
              </p>
            </div>
          </div>

          <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12, padding: "24px 28px" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.teal, marginBottom: 18 }}>What&apos;s next</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { n: "01", color: P.rose,   title: "Fix dtype bug first", body: "Everything else is blocked until tensor dtypes are consistent. Some of the divergences I attributed to bad reward configs were almost certainly this issue. Fixing it and rerunning those trials is the first step before any comparative analysis is meaningful." },
                { n: "02", color: P.orange, title: "Reward normalisation", body: "Clip or normalise the reward signal to reduce episode-level loss scale variance. DeltaWaitTime is the candidate here since its bounded signal is most amenable to normalisation without distorting the learning objective." },
                { n: "03", color: P.accent, title: "Grid search on target update frequency", body: "Systematic sweep over the update interval using the experiments/grid_search/ setup. This isolates how much update timing is contributing to instability versus reward scale effects." },
                { n: "04", color: P.teal,   title: "First clean baseline comparison", body: "Once training is stable, run Double DQN against the fixed-time baseline on a held-out simulation window. That comparison — average delay, queue length, throughput — is the primary deliverable of this project." },
              ].map(({ n, color, title, body }) => (
                <div key={n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 22, color, flexShrink: 0, lineHeight: 1, fontWeight: 900 }}>{n}</span>
                  <div>
                    <strong style={{ fontSize: 13.5, color: P.text, display: "block", marginBottom: 5 }}>{title}</strong>
                    <p style={{ margin: 0, fontSize: 13, color: P.textDim, lineHeight: 1.7 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Callout color={P.accent} icon="→">
            <strong style={{ color: P.text }}>Rainbow DQN is on the roadmap but I'm not touching it yet.</strong> There's no point benchmarking architectures until Double DQN is converging reliably and I have a clean reward formulation that holds up across seeds. The foundation has to be solid first.
          </Callout>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.muted }}>
            Python · PyTorch · SUMO · Double DQN · SMDP · 5 reward functions · fixed-time + actuated baselines
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="https://github.com/amJenish/RL-Traffic-Light-Optimization" style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, textDecoration: "none" }}>↗ GitHub</a>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textDim }}>Western University · Department of Computer Science</span>
          </div>
        </div>

      </div>
    </div>
  );
}