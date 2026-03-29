import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";
import {
  Body,
  ChartTip,
  ChartWrap,
  Code,
  C,
  FONT_MONO as MONO,
  FONT_SANS as SANS,
  Notice,
  Panel,
  PanelLabel,
  SectionLabel,
  Tag,
  TwoCol,
} from "../reportPrimitives";
import type { WorkPageProps } from "@/content/portfolio/workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

// ── DATA ──────────────────────────────────────────────────────────────────────

const rewardFunctions = [
  { name: "WaitTime",        stability: 3, clarity: 6 },
  { name: "DeltaWaitTime",   stability: 5, clarity: 7 },
  { name: "Throughput",      stability: 6, clarity: 5 },
  { name: "ThroughputQueue", stability: 5, clarity: 6 },
  { name: "Composite",       stability: 4, clarity: 4 },
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

// ── TYPES ──────────────────────────────────────────────────────────────────────

type RewardTab = "WaitTime" | "DeltaWaitTime" | "Throughput" | "Composite" | "ThroughputQueue";

const REWARD_TABS: RewardTab[] = ["WaitTime", "DeltaWaitTime", "Throughput", "Composite", "ThroughputQueue"];

type RewardDetail = { formula: string; color: string; body: string; risk: string };

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

export default function RLTrafficReport(props: WorkPageProps): React.JSX.Element {
  const [activeReward, setActiveReward] = useState<RewardTab>("DeltaWaitTime");

  const rewardDetail: Record<RewardTab, RewardDetail> = {
    WaitTime: {
      formula: "r = −Σ wait_i",
      color: C.red,
      body: "The most direct formulation: penalise by total cumulative waiting time across all vehicles at every decision step. The signal is strong and unambiguous — every unit of delay is directly reflected in the reward. In practice this produces large-magnitude, dense reward values that can cause Q-value scale issues early in training.",
      risk: "High-magnitude rewards compound Q-value overestimation. The signal is also volume-sensitive, so a heavy-traffic episode produces much larger absolute penalties than a light one even if the agent is making equally good decisions.",
    },
    DeltaWaitTime: {
      formula: "r = wait_prev − wait_curr",
      color: C.amber,
      body: "Instead of penalising absolute delay, I reward the reduction in waiting vehicles compared to the previous step. The signal is relative: positive when congestion decreases, negative when it increases, zero when nothing changes. This makes it less sensitive to traffic volume variance across the 60-day training window.",
      risk: "Oscillatory policies. An agent can learn to alternate phases in a way that manufactures an artificial decrease-then-increase cycle, producing a net-zero delta without actually improving throughput.",
    },
    Throughput: {
      formula: "r = vehicles_cleared",
      color: C.teal,
      body: "Reward is proportional to the number of vehicles that clear the intersection during the current phase. Intuitive and directly tied to what a good signal policy should achieve. The signal is sparse by design — it only accumulates during active green phases.",
      risk: "Throughput alone ignores queue buildup on non-served approaches. An agent optimising purely for throughput on one direction will let perpendicular queues grow if it maximises clearance on the dominant flow.",
    },
    ThroughputQueue: {
      formula: "r = α·throughput − β·queue",
      color: C.teal,
      body: "A two-term reward combining positive throughput signal with a queue-length penalty. This directly patches the failure mode of the pure throughput formulation. The α and β weights control the trade-off between clearing vehicles and preventing buildup.",
      risk: "The weighting is fragile. Too much throughput emphasis and the agent ignores queues. Too much queue penalty and the agent becomes overly conservative, switching phases before they've cleared the current wave.",
    },
    Composite: {
      formula: "r = w₁·Δwait + w₂·throughput − w₃·queue",
      color: C.textSub,
      body: "My attempt at combining the best parts of each formulation into a single weighted objective. The delta term incentivises improvement, throughput rewards clearance, and the queue term prevents one-directional bias. Anti-oscillation mechanisms are planned here specifically.",
      risk: "Multi-term rewards are much harder to debug. When training performs poorly, it's not obvious which term is the problem. Per-term logging during training is something I want to add before leaning on this formulation.",
    },
  };

  const rd = rewardDetail[activeReward];

  return (
    <WorkReportShell {...props}>
    <div style={{ color: C.text, fontFamily: SANS, textAlign: "left" }}>

      {/* ── HERO ── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "80px 0 64px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "48px 48px", opacity: 0.3,
        }} />
        <div style={{
          position: "absolute", top: "-30%", right: "10%",
          width: 560, height: 560,
          background: `radial-gradient(ellipse, ${C.teal}08 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.textDim }}>
              Reinforcement learning · traffic control · reward engineering
            </span>
            <Tag color={C.amber}>In progress</Tag>
          </div>

          <h1 style={{
            fontFamily: SANS,
            fontSize: "clamp(30px, 4.5vw, 54px)",
            fontWeight: 800, margin: "0 0 20px",
            lineHeight: 1.12, letterSpacing: -1, color: C.text,
          }}>
            Adaptive traffic signal<br />
            <span style={{ color: C.teal }}>control via reinforcement learning</span>
          </h1>

          <Body style={{ maxWidth: 1280, marginBottom: 12 }}>
            I&apos;m building a reinforcement learning system that learns adaptive signal timing policies at
            a single intersection from 60 days of historical traffic data.{" "}
            <span style={{ color: C.text }}>
              Key question: can a learned policy consistently outperform a fixed-time plan, and which
              reward formulation gets us there most reliably?
            </span>
          </Body>
          <Body style={{ maxWidth: 1280, marginBottom: 36 }}>
            The system is built around a modular architecture that lets me swap reward functions,
            observation spaces, and agent architectures independently. I&apos;ve implemented DQN and Double DQN,
            designed five reward formulations, and have both fixed-time and actuated baselines ready.
            Right now I&apos;m working through a convergence problem before I can run clean comparisons.
          </Body>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Python", "PyTorch", "SUMO", "Double DQN", "SMDP", "Reward Engineering"].map(t => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>

        {/* ── STATS STRIP ── */}
        <div id="rl-kpis" style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
          marginBottom: 88,
        }}>
          {([
            { value: "60d",         label: "Training data",    sub: "Historical intersection flow",    color: C.teal  },
            { value: "5",           label: "Reward functions", sub: "From WaitTime to Composite",      color: C.teal  },
            { value: "2",           label: "Baselines",        sub: "Fixed-time & actuated",           color: C.teal  },
            { value: "Convergence", label: "Current blocker",  sub: "Not reliably converging yet",     color: C.amber },
          ] as { value: string; label: string; sub: string; color: string }[]).map((s, i) => (
            <div key={s.label} style={{
              padding: "32px 28px",
              borderRight: i < 3 ? `1px solid ${C.border}` : undefined,
            }}>
              <div style={{
                fontFamily: MONO,
                fontSize: s.value.length > 5 ? 22 : 38,
                fontWeight: 800, color: s.color,
                lineHeight: 1, marginBottom: 10,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ══ 01 THE PROBLEM ══ */}
        <div id="rl-problem" className="scroll-mt-28" style={{ marginBottom: 88 }}>
          <SectionLabel n={1} title="The Problem" />
          <TwoCol>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Body>
                Fixed-time signal plans are the default at most intersections. They allocate green time
                according to a preset schedule that never changes, regardless of how traffic actually behaves.
                The result is wasted green time during low-demand windows and unnecessary queuing when demand
                spikes. I want to replace that static schedule with a policy that observes intersection state
                and adapts its timing decisions in real time.
              </Body>
              <Body>
                I&apos;m framing this as a Semi-Markov Decision Process (SMDP) rather than a standard MDP because
                signal phases have variable durations. SMDP handles variable holding times by discounting
                rewards by the actual elapsed time per decision, making the timing of phase switches part of
                what the agent learns, not an external parameter.
              </Body>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                padding: "12px 18px", borderBottom: `1px solid ${C.border}`,
                fontFamily: MONO, fontSize: 10.5, color: C.textDim, letterSpacing: "0.03em",
              }}>
                Current project snapshot
              </div>
              {([
                ["Framework",     "Semi-Markov Decision Process (SMDP)" ],
                ["Simulator",     "SUMO, seeded from 60-day traffic data"],
                ["Observation",   "Queue lengths per approach"           ],
                ["Action space",  "Discrete — keep phase or switch"      ],
                ["Baselines",     "fixed_time.py + actuated.py"          ],
                ["Current agent", "Double DQN"                           ],
                ["LR Scheduler",  "Cosine Scheduler"                     ],
                ["Replay",        "Uniform experience replay"            ],
              ] as [string, string][]).map(([k, v], i) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 18px", borderBottom: `1px solid ${C.border}`,
                  background: i % 2 === 0 ? "transparent" : "#ffffff03", gap: 12,
                }}>
                  <span style={{ fontSize: 12.5, color: C.textDim, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11.5, color: C.text, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </TwoCol>
        </div>

        {/* ══ 02 ARCHITECTURE ══ */}
        <div id="rl-arch" className="scroll-mt-28" style={{ marginBottom: 88 }}>
          <SectionLabel n={2} title="How I Built It" />
          <Body style={{ marginBottom: 32 }}>
            The codebase is built around a components-and-connector pattern. Every major piece has an
            abstract base class and a concrete implementation. <Code>agent.py</Code> and{" "}
            <Code>trainer.py</Code> act as the connectors, wiring together whichever combination of
            components a given experiment requires — swap a reward function without touching anything else,
            add a new architecture without rewriting the training loop.
          </Body>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            {([
              { name: "Environment",   file: "sumo_environment.py",  color: C.teal,    note: "Wraps SUMO, manages simulation state, handles phase transitions, exposes step/reset." },
              { name: "Observation",   file: "queue_observation.py", color: C.teal,    note: "Extracts queue length per lane and formats it as the state vector fed to the Q-network." },
              { name: "Reward",        file: "5 implementations",    color: C.amber,   note: "Pluggable reward functions — each implements the same base interface." },
              { name: "Policy",        file: "double_dqn.py",        color: C.textSub, note: "Q-network, target network, and update logic. DQN and Double DQN both live here." },
              { name: "Replay Buffer", file: "uniform.py",           color: C.textSub, note: "Stores (s, a, r, s′, done) tuples and samples random minibatches." },
              { name: "Scheduler",     file: "cosine.py",            color: C.textSub, note: "Cosine LR scheduling applied to the Q-network optimizer across training epochs." },
            ] as { name: string; file: string; color: string; note: string }[]).map(({ name, file, color, note }) => (
              <div key={name} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: "16px", borderLeft: `2px solid ${color}`,
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color, marginBottom: 2 }}>{name}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, marginBottom: 10 }}>{file}</div>
                <div style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.6 }}>{note}</div>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.textDim, marginBottom: 18, letterSpacing: "0.03em" }}>
              Connectors
            </div>
            <TwoCol gap={28}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: C.teal, marginBottom: 8 }}>agent.py</div>
                <Body style={{ fontSize: 13.5 }}>
                  Owns the policy and replay buffer. Exposes <Code>act(state)</Code> for epsilon-greedy
                  action selection and <Code>learn()</Code> for sampling from the buffer and updating the
                  Q-network. Deliberately knows nothing about the environment or reward function.
                </Body>
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: C.teal, marginBottom: 8 }}>trainer.py</div>
                <Body style={{ fontSize: 13.5 }}>
                  Orchestrates the training loop. Holds environment, reward function, and scheduler.
                  Experiments are driven by <Code>reward_configuration.json</Code> and{" "}
                  <Code>policy_configuration.json</Code> — no code changes between runs.
                </Body>
              </div>
            </TwoCol>
          </div>

          <TwoCol gap={10}>
            <Notice color={C.teal} icon="✓">
              <strong style={{ color: C.text }}>Baselines are first-class.</strong>{" "}
              <Code>fixed_time.py</Code> and <Code>actuated.py</Code> live in a dedicated{" "}
              <Code>baselines/</Code> module with an evaluation script. Comparing against fixed-time is
              built into the project, not an afterthought.
            </Notice>
            <Notice color={C.amber} icon="→">
              <strong style={{ color: C.text }}>Grid search is already wired up.</strong>{" "}
              The <Code>experiments/grid_search/</Code> directory holds sweep configurations for
              systematic hyperparameter exploration. I just need stable training runs before a sweep
              produces meaningful signal.
            </Notice>
          </TwoCol>
        </div>

        {/* ══ 03 REWARD ENGINEERING ══ */}
        <div id="rl-rewards" className="scroll-mt-28" style={{ marginBottom: 88 }}>
          <SectionLabel n={3} title="Reward Engineering" />
          <Body style={{ marginBottom: 28 }}>
            Reward design has been the majority of the research work so far. Different formulations produce
            very different agent behaviours even with identical architectures. I built five reward functions,
            each implementing the same base interface so they&apos;re fully interchangeable in the training loop.
          </Body>

          <div style={{
            display: "flex", gap: 0,
            border: `1px solid ${C.border}`,
            borderRadius: "10px 10px 0 0",
            overflow: "hidden",
          }}>
            {REWARD_TABS.map((tab, i) => {
              const active = activeReward === tab;
              return (
                <button
                  key={tab} type="button"
                  onClick={() => { setActiveReward(tab); }}
                  style={{
                    flex: 1, fontFamily: MONO, fontSize: 11,
                    padding: "12px 8px", cursor: "pointer",
                    background: active ? C.card : "transparent",
                    color: active ? C.teal : C.textDim,
                    border: "none",
                    borderRight: i < REWARD_TABS.length - 1 ? `1px solid ${C.border}` : "none",
                    borderBottom: active ? `2px solid ${C.teal}` : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderTop: "none", borderRadius: "0 0 10px 10px",
            padding: "28px", marginBottom: 20,
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 20, flexWrap: "wrap", gap: 12,
            }}>
              <h3 style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: rd.color, margin: 0 }}>
                {activeReward}
              </h3>
              <div style={{
                fontFamily: MONO, fontSize: 13, color: C.teal,
                background: C.codeBg, border: `1px solid ${C.border}`,
                padding: "9px 16px", borderRadius: 6,
              }}>
                {rd.formula}
              </div>
            </div>
            <Body style={{ marginBottom: 16 }}>{rd.body}</Body>
            <div style={{ borderLeft: `2px solid ${C.amber}`, paddingLeft: 14, paddingTop: 2 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.amber, display: "block", marginBottom: 4 }}>Risk</span>
              <span style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>{rd.risk}</span>
            </div>
          </div>

          <ChartWrap
            label="Chart 1 — Reward design tradeoffs (qualitative assessment from training runs)"
            note="Stability = how consistent the training signal is across runs. Signal clarity = how directly it maps to the real objective. These are assessments from observing training behaviour, not measured scores."
            illustrative
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rewardFunctions} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke={C.border} />
                <XAxis dataKey="name" tick={{ fill: C.textDim, fontSize: 11, fontFamily: MONO }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: C.textDim, fontSize: 11, fontFamily: MONO }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "#ffffff04" }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: MONO, color: C.textDim }} />
                <Bar dataKey="stability" name="Stability"      fill={C.teal}  radius={[3, 3, 0, 0]} />
                <Bar dataKey="clarity"   name="Signal clarity" fill={C.amber} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrap>

          <Notice color={C.teal}>
            <strong style={{ color: C.text }}>Where I landed: </strong>
            DeltaWaitTime has been the most useful reward so far — sensitive enough to guide learning but
            relative enough not to be dominated by volume variance. ThroughputQueue is where I want to get
            to, but the weight sensitivity makes stable training harder. Composite comes last, once the
            individual formulations are validated.
          </Notice>
        </div>

        {/* ══ 04 DQN → DOUBLE DQN ══ */}
        <div id="rl-dqn" className="scroll-mt-28" style={{ marginBottom: 88 }}>
          <SectionLabel n={4} title="DQN → Double DQN" />
          <Body style={{ marginBottom: 28 }}>
            I started with DQN. It did not work well here. Training was unstable, Q-values were inflating
            without corresponding policy improvement, and learned behaviours were erratic. Moving to
            Double DQN was the right call and the results are meaningfully better, though convergence is
            still what I&apos;m actively working through.
          </Body>

          <TwoCol gap={16}>
            <Panel accentColor={C.red}>
              <PanelLabel color={C.red}>DQN — what went wrong</PanelLabel>
              <Body style={{ fontSize: 14, marginBottom: 14 }}>
                Standard DQN uses the same network to select and evaluate actions. When computing the TD
                target it takes the max Q-value from the target network — but the network choosing which
                action is optimal is the same one being trained. In environments with variable, noisy reward
                signals, this creates a feedback loop: the network systematically overestimates the value of
                the action it chose, inflating Q-values and destabilising the loss.
              </Body>
              <Body style={{ fontSize: 14 }}>
                In a traffic environment where rewards vary significantly between episodes, this
                overestimation gets amplified quickly. The agent ends up confidently committing to phases
                that aren&apos;t actually better, and the policy oscillates rather than converges.
              </Body>
            </Panel>

            <Panel accentColor={C.teal}>
              <PanelLabel>Double DQN — the fix</PanelLabel>
              <Body style={{ fontSize: 14, marginBottom: 18 }}>
                Double DQN decouples action selection from action evaluation. The online network selects
                which action is greedy; the target network evaluates what that action is actually worth.
                This breaks the overestimation loop — the target network will often assign a lower value
                to the online network&apos;s chosen action, pulling estimates back toward reality.
              </Body>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {([
                  { label: "DQN target",       expr: "r + γ · max Q(s′, a; θ⁻)",              color: C.textDim },
                  { label: "Double DQN target", expr: "r + γ · Q(s′, argmax Q(s′,a; θ); θ⁻)", color: C.teal   },
                ] as { label: string; expr: string; color: string }[]).map(({ label, expr, color }) => (
                  <div key={label} style={{
                    background: C.codeBg, border: `1px solid ${C.border}`,
                    borderRadius: 6, padding: "10px 14px",
                  }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: C.textDim, marginBottom: 5 }}>{label}</div>
                    <code style={{ fontFamily: MONO, fontSize: 12, color }}>{expr}</code>
                  </div>
                ))}
              </div>
            </Panel>
          </TwoCol>

          <div style={{ marginTop: 20 }}>
            <ChartWrap
              label="Chart 2 — DQN vs Double DQN training reward (illustrative shape from observed runs)"
              note="DQN runs showed large variance with no sustained improvement trend. Double DQN shows more consistent improvement direction. Exact values follow once the dtype issue is resolved."
              illustrative
            >
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={convergenceData}>
                  <CartesianGrid stroke={C.border} vertical={false} />
                  <XAxis dataKey="ep" tick={{ fill: C.textDim, fontSize: 11, fontFamily: MONO }} axisLine={false} tickLine={false}
                    label={{ value: "Episode", position: "insideBottom", offset: -4, fill: C.textDim, fontSize: 11 }} />
                  <YAxis tick={{ fill: C.textDim, fontSize: 11, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ stroke: C.border }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: MONO, color: C.textDim }} />
                  <Line type="monotone" dataKey="dqn"  name="DQN"        stroke={C.red}  strokeWidth={2} dot={false} strokeDasharray="5 4" />
                  <Line type="monotone" dataKey="ddqn" name="Double DQN" stroke={C.teal} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrap>
          </div>

          <Notice color={C.amber} icon="🔧">
            <strong style={{ color: C.text }}>A dtype bug is contaminating some runs.</strong>{" "}
            I found a bug where certain tensor construction paths produce mixed float/int types, causing
            loss values to diverge partway through training. It looks like a reward function failure when
            it&apos;s actually a numerical precision issue in the backward pass. Resolving this is the first
            thing on my list before any comparative analysis.
          </Notice>
        </div>

        {/* ══ 05 TRAINING RUNS ══ */}
        <div id="rl-training" className="scroll-mt-28" style={{ marginBottom: 88 }}>
          <SectionLabel n={5} title="What the Training Runs Show" />
          <Body style={{ marginBottom: 28 }}>
            I&apos;ve run 22 trials across different reward configurations and agent variants. Below are the
            patterns I&apos;m seeing, using training stability as the primary lens since full performance
            comparisons are blocked pending the dtype fix.
          </Body>

          <ChartWrap label="Chart 3 — Training stability by configuration (stable runs vs diverged)">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={stabilityData} layout="vertical" barCategoryGap="25%">
                <CartesianGrid horizontal={false} stroke={C.border} />
                <XAxis type="number" tick={{ fill: C.textDim, fontSize: 11, fontFamily: MONO }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="config" tick={{ fill: C.textDim, fontSize: 11, fontFamily: MONO }} axisLine={false} tickLine={false} width={155} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "#ffffff04" }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: MONO, color: C.textDim }} />
                <Bar dataKey="stable"   name="Stable"   fill={C.teal} radius={[0, 4, 4, 0]} />
                <Bar dataKey="diverged" name="Diverged" fill={C.red}  radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrap>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {([
              { icon: "📊", color: C.teal,  title: "Double DQN is clearly more stable",               body: "Across the same reward configs, Double DQN runs diverge less frequently and show more consistent reward trends. The overestimation correction is doing its job even in these early runs." },
              { icon: "🔀", color: C.teal,  title: "DeltaWaitTime produces the cleanest signal",      body: "Runs using DeltaWaitTime show the most consistent learning curves. The relative formulation smooths out the per-episode volume variance that was making WaitTime runs swing widely." },
              { icon: "⚖",  color: C.amber, title: "ThroughputQueue is promising but weight-sensitive", body: "When the α/β balance is right, ThroughputQueue runs improve faster. But small config changes lead to very different training behaviour. A grid search over these weights is next." },
              { icon: "🚫", color: C.red,   title: "Some divergences are implementation, not reward",  body: "After finding the dtype bug, I reviewed runs where I assumed a reward config had failed. Some were almost certainly the implementation issue and need to be rerun cleanly." },
            ] as { icon: string; color: string; title: string; body: string }[]).map(({ icon, color, title, body }) => (
              <div key={title} style={{
                padding: "18px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 8, borderLeft: `2px solid ${color}`,
              }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 15 }}>{icon}</span>
                  <strong style={{ fontSize: 13.5, color: C.text, lineHeight: 1.4 }}>{title}</strong>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: C.textSub, lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 06 WHERE I AM NOW ══ */}
        <div id="rl-now" className="scroll-mt-28" style={{ marginBottom: 88 }}>
          <SectionLabel n={6} title="Where I Am Now" />
          <Body style={{ marginBottom: 32 }}>
            The system is built, baselines are in place, and Double DQN is training. The agent is learning —
            reward trends in the right direction — but it&apos;s not reliably converging to a stable policy
            across runs. There are two main reasons for this.
          </Body>

          <TwoCol gap={16}>
            <Panel accentColor={C.red}>
              <PanelLabel color={C.red}>Convergence issue 1 — reward scale variance</PanelLabel>
              <Body style={{ fontSize: 14, marginBottom: 14 }}>
                The magnitude of the reward signal varies significantly between episodes depending on traffic
                volume. A heavy-traffic episode produces much larger absolute penalties than a light one, even
                when the agent is making equally good decisions. The Q-network sees very different loss scales
                across training, making it hard to find a stable learning direction.
              </Body>
              <Body style={{ fontSize: 14 }}>
                Reward normalisation or clipping is the direction I&apos;m looking at. Keeping the signal within
                a consistent range should let the Q-network converge without gradients being dominated by
                outlier episodes.
              </Body>
            </Panel>

            <Panel accentColor={C.amber}>
              <PanelLabel color={C.amber}>Convergence issue 2 — target network update timing</PanelLabel>
              <Body style={{ fontSize: 14, marginBottom: 14 }}>
                How often the target network syncs to the online network significantly affects convergence.
                Update too frequently and the target is a moving reference the online network cannot reliably
                learn against. Update too infrequently and the TD error diverges because the target becomes
                stale.
              </Body>
              <Body style={{ fontSize: 14 }}>
                I haven&apos;t done a systematic sweep over this yet — it&apos;s in the grid search config, and
                running that sweep after the dtype fix is the most direct path to understanding how much it&apos;s
                contributing to the instability.
              </Body>
            </Panel>
          </TwoCol>

          <div style={{
            marginTop: 20,
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "28px",
          }}>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.teal, marginBottom: 24, letterSpacing: "0.04em" }}>
              What&apos;s next
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {([
                { n: "01", color: C.red,   title: "Fix dtype bug first",                    body: "Everything else is blocked until tensor dtypes are consistent. Some divergences I attributed to bad reward configs were almost certainly this issue." },
                { n: "02", color: C.amber, title: "Reward normalisation",                   body: "Clip or normalise the reward signal to reduce episode-level loss scale variance. DeltaWaitTime is the candidate since its bounded signal is most amenable." },
                { n: "03", color: C.teal,  title: "Grid search on target update frequency", body: "Systematic sweep over the update interval using the existing grid search setup. Isolates how much update timing is contributing to instability." },
                { n: "04", color: C.teal,  title: "First clean baseline comparison",        body: "Once training is stable, run Double DQN against the fixed-time baseline on a held-out window. Average delay, queue length, throughput." },
              ] as { n: string; color: string; title: string; body: string }[]).map(({ n, color, title, body }) => (
                <div key={n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: MONO, fontSize: 28, color, flexShrink: 0, lineHeight: 1, fontWeight: 900, opacity: 0.6 }}>
                    {n}
                  </span>
                  <div>
                    <strong style={{ fontSize: 13.5, color: C.text, display: "block", marginBottom: 6 }}>{title}</strong>
                    <p style={{ margin: 0, fontSize: 13, color: C.textSub, lineHeight: 1.75 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Notice color={C.tealDim} icon="→">
            <strong style={{ color: C.text }}>Rainbow DQN is on the roadmap but I&apos;m not touching it yet.</strong>{" "}
            There&apos;s no point benchmarking architectures until Double DQN is converging reliably and I have
            a clean reward formulation that holds up across seeds. The foundation has to be solid first.
          </Notice>
        </div>
      </div>
    </div>
    </WorkReportShell>
  );
}