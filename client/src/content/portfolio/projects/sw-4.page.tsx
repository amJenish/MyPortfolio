import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";
import {
  CatalogTagPills,
  Body,
  ChartTip,
  ChartWrap,
  Code,
  FONT_MONO as MONO,
  FONT_SANS as SANS,
  Notice,
  Panel,
  PanelLabel,
  SectionLabel,
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
  const reduceMotion = useReducedMotion();

  const rewardDetail: Record<RewardTab, RewardDetail> = {
    WaitTime: {
      formula: "r = −Σ wait_i",
      color: "rgb(239, 68, 68)",
      body: "The most direct formulation: penalise by total cumulative waiting time across all vehicles at every decision step. The signal is strong and unambiguous — every unit of delay is directly reflected in the reward. In practice this produces large-magnitude, dense reward values that can cause Q-value scale issues early in training.",
      risk: "High-magnitude rewards compound Q-value overestimation. The signal is also volume-sensitive, so a heavy-traffic episode produces much larger absolute penalties than a light one even if the agent is making equally good decisions.",
    },
    DeltaWaitTime: {
      formula: "r = wait_prev − wait_curr",
      color: "rgb(245, 158, 11)",
      body: "Instead of penalising absolute delay, I reward the reduction in waiting vehicles compared to the previous step. The signal is relative: positive when congestion decreases, negative when it increases, zero when nothing changes. This makes it less sensitive to traffic volume variance across the 60-day training window.",
      risk: "Oscillatory policies. An agent can learn to alternate phases in a way that manufactures an artificial decrease-then-increase cycle, producing a net-zero delta without actually improving throughput.",
    },
    Throughput: {
      formula: "r = vehicles_cleared",
      color: "var(--primary)",
      body: "Reward is proportional to the number of vehicles that clear the intersection during the current phase. Intuitive and directly tied to what a good signal policy should achieve. The signal is sparse by design — it only accumulates during active green phases.",
      risk: "Throughput alone ignores queue buildup on non-served approaches. An agent optimising purely for throughput on one direction will let perpendicular queues grow if it maximises clearance on the dominant flow.",
    },
    ThroughputQueue: {
      formula: "r = α·throughput − β·queue",
      color: "var(--primary)",
      body: "A two-term reward combining positive throughput signal with a queue-length penalty. This directly patches the failure mode of the pure throughput formulation. The α and β weights control the trade-off between clearing vehicles and preventing buildup.",
      risk: "The weighting is fragile. Too much throughput emphasis and the agent ignores queues. Too much queue penalty and the agent becomes overly conservative, switching phases before they've cleared the current wave.",
    },
    Composite: {
      formula: "r = w₁·Δwait + w₂·throughput − w₃·queue",
      color: "var(--muted-foreground)",
      body: "My attempt at combining the best parts of each formulation into a single weighted objective. The delta term incentivises improvement, throughput rewards clearance, and the queue term prevents one-directional bias. Anti-oscillation mechanisms are planned here specifically.",
      risk: "Multi-term rewards are much harder to debug. When training performs poorly, it's not obvious which term is the problem. Per-term logging during training is something I want to add before leaning on this formulation.",
    },
  };

  const rd = rewardDetail[activeReward];

  return (
    <WorkReportShell {...props}>
      <div style={{ color: "var(--foreground)", fontFamily: SANS, textAlign: "left" }}>

        {/* ── HERO ── */}
        <div style={{ borderBottom: "1px solid var(--border)", padding: "80px 0 64px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.35,
          }} />
          <div style={{
            position: "absolute",
            top: "-20%",
            right: "5%",
            width: 520,
            height: 520,
            background: "radial-gradient(ellipse, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 62%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-10%",
            left: "10%",
            width: 320,
            height: 320,
            background: "radial-gradient(ellipse, color-mix(in srgb, var(--primary) 5%, transparent) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(1rem, 4vw, 3rem)", position: "relative" }}>
            <h1 style={{
              fontFamily: SANS,
              fontSize: "clamp(30px, 4.5vw, 54px)",
              fontWeight: 800, margin: "0 0 20px",
              lineHeight: 1.12, letterSpacing: -1, color: "var(--foreground)",
            }}>
              Adaptive traffic signal<br />
              <span style={{ color: "var(--primary)" }}>control via reinforcement learning</span>
            </h1>

            <Body style={{ maxWidth: 1280, marginBottom: 12, color: "var(--foreground)" }}>
              I&apos;m building a reinforcement learning system that learns adaptive signal timing policies at
              a single intersection from 60 days of historical traffic data. Key question: can a learned policy consistently outperform a fixed-time plan, and which
              reward formulation gets us there most reliably?
            </Body>
            <Body style={{ maxWidth: 1280, marginBottom: 36, color: "var(--foreground)" }}>
              The system is built around a modular architecture that lets me swap reward functions,
              observation spaces, and agent architectures independently. I&apos;ve implemented DQN and Double DQN,
              designed five reward formulations, and have both fixed-time and actuated baselines ready.
              Right now I&apos;m working through a convergence problem before I can run clean comparisons.
            </Body>

            <CatalogTagPills tags={props.entry.tags} />
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>

          {/* ── STATS STRIP ── */}
          <div id="rl-kpis" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
            marginBottom: 88,
          }}>
            {([
              { value: "60d",         label: "Training data",    sub: "Historical intersection flow",    color: "var(--primary)"  },
              { value: "5",           label: "Reward functions", sub: "From WaitTime to Composite",      color: "var(--primary)"  },
              { value: "2",           label: "Baselines",        sub: "Fixed-time & actuated",           color: "var(--primary)"  },
              { value: "Convergence", label: "Current blocker",  sub: "Not reliably converging yet",     color: "rgb(245, 158, 11)" },
            ] as { value: string; label: string; sub: string; color: string }[]).map((s, i) => (
              <div key={s.label} style={{
                padding: "32px 28px",
                borderRight: i < 3 ? "1px solid var(--border)" : undefined,
              }}>
                <div style={{
                  fontFamily: MONO,
                  fontSize: s.value.length > 5 ? 22 : 38,
                  fontWeight: 800, color: s.color,
                  lineHeight: 1, marginBottom: 10,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{s.sub}</div>
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

              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{
                  padding: "12px 18px", borderBottom: "1px solid var(--border)",
                  fontFamily: MONO, fontSize: 10.5, color: "var(--muted-foreground)", letterSpacing: "0.03em",
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
                    padding: "10px 18px", borderBottom: "1px solid var(--border)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)", gap: 12,
                  }}>
                    <span style={{ fontSize: 12.5, color: "var(--muted-foreground)", flexShrink: 0 }}>{k}</span>
                    <span style={{ fontFamily: MONO, fontSize: 11.5, color: "var(--foreground)", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </TwoCol>
          </div>

          {/* ══ 02 ARCHITECTURE ══ */}
          <div id="rl-arch" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="How I Built It" />
            <Body style={{ marginBottom: 32, color: "var(--foreground)" }}>
              The codebase is built around a components-and-connector pattern. Every major piece has an
              abstract base class and a concrete implementation. <Code>agent.py</Code> and{" "}
              <Code>trainer.py</Code> act as the connectors, wiring together whichever combination of
              components a given experiment requires — swap a reward function without touching anything else,
              add a new architecture without rewriting the training loop.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              {([
                { name: "Environment",   file: "sumo_environment.py",  color: "var(--primary)",    note: "Wraps SUMO, manages simulation state, handles phase transitions, exposes step/reset." },
                { name: "Observation",   file: "queue_observation.py", color: "var(--primary)",    note: "Extracts queue length per lane and formats it as the state vector fed to the Q-network." },
                { name: "Reward",        file: "5 implementations",    color: "rgb(245, 158, 11)",   note: "Pluggable reward functions — each implements the same base interface." },
                { name: "Policy",        file: "double_dqn.py",        color: "var(--muted-foreground)", note: "Q-network, target network, and update logic. DQN and Double DQN both live here." },
                { name: "Replay Buffer", file: "uniform.py",           color: "var(--muted-foreground)", note: "Stores (s, a, r, s′, done) tuples and samples random minibatches." },
                { name: "Scheduler",     file: "cosine.py",            color: "var(--muted-foreground)", note: "Cosine LR scheduling applied to the Q-network optimizer across training epochs." },
              ] as { name: string; file: string; color: string; note: string }[]).map(({ name, file, color, note }) => (
                <div key={name} style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)", padding: "16px", borderLeft: `2px solid ${color}`,
                }}>
                  <div style={{ fontFamily: MONO, fontSize: 11, color, marginBottom: 2 }}>{name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted-foreground)", marginBottom: 10 }}>{file}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", lineHeight: 1.6 }}>{note}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 10.5, color: "var(--muted-foreground)", marginBottom: 18, letterSpacing: "0.03em" }}>
                Connectors
              </div>
              <TwoCol gap={28}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 12, color: "var(--primary)", marginBottom: 8 }}>agent.py</div>
                  <Body style={{ fontSize: 13.5, color: "var(--foreground)" }}>
                    Owns the policy and replay buffer. Exposes <Code>act(state)</Code> for epsilon-greedy
                    action selection and <Code>learn()</Code> for sampling from the buffer and updating the
                    Q-network. Deliberately knows nothing about the environment or reward function.
                  </Body>
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 12, color: "var(--primary)", marginBottom: 8 }}>trainer.py</div>
                  <Body style={{ fontSize: 13.5, color: "var(--foreground)" }}>
                    Orchestrates the training loop. Holds environment, reward function, and scheduler.
                    Experiments are driven by <Code>reward_configuration.json</Code> and{" "}
                    <Code>policy_configuration.json</Code> — no code changes between runs.
                  </Body>
                </div>
              </TwoCol>
            </div>

            <TwoCol gap={10}>
              <Notice color="var(--primary)" icon="✓">
                <strong>Baselines are first-class.</strong>{" "}
                <Code>fixed_time.py</Code> and <Code>actuated.py</Code> live in a dedicated{" "}
                <Code>baselines/</Code> module with an evaluation script. Comparing against fixed-time is
                built into the project, not an afterthought.
              </Notice>
              <Notice color="rgb(245, 158, 11)" icon="→">
                <strong>Grid search is already wired up.</strong>{" "}
                The <Code>experiments/grid_search/</Code> directory holds sweep configurations for
                systematic hyperparameter exploration. I just need stable training runs before a sweep
                produces meaningful signal.
              </Notice>
            </TwoCol>
          </div>

          {/* ══ 03 REWARD ENGINEERING ══ */}
          <div id="rl-rewards" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Reward Engineering" />
            <Body style={{ marginBottom: 28, color: "var(--foreground)" }}>
              Reward design has been the majority of the research work so far. Different formulations produce
              very different agent behaviours even with identical architectures. I built five reward functions,
              each implementing the same base interface so they&apos;re fully interchangeable in the training loop.
            </Body>

            <div style={{
              display: "flex", gap: 0,
              border: "1px solid var(--border)",
              borderRadius: "10px 10px 0 0",
              overflow: "hidden",
            }}>
              {REWARD_TABS.map((tab, i) => {
                const active = activeReward === tab;
                return (
                  <button
                    key={tab} type="button"
                    onClick={() => { setActiveReward(tab); }}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{
                      flex: 1, fontFamily: MONO, fontSize: 11,
                      padding: "12px 8px", cursor: "pointer",
                      background: active ? "var(--card)" : "transparent",
                      color: active ? "var(--primary)" : "var(--muted-foreground)",
                      border: "none",
                      borderRight: i < REWARD_TABS.length - 1 ? "1px solid var(--border)" : "none",
                      borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeReward}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderTop: "none", borderRadius: "0 0 10px 10px",
                  padding: "28px", marginBottom: 20,
                }}
              >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 20, flexWrap: "wrap", gap: 12,
              }}>
                <h3 style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: rd.color, margin: 0 }}>
                  {activeReward}
                </h3>
                <div style={{
                  fontFamily: MONO, fontSize: 13, color: "var(--primary)",
                  background: "var(--muted)", border: "1px solid var(--border)",
                  padding: "9px 16px", borderRadius: 6,
                }}>
                  {rd.formula}
                </div>
              </div>
              <Body style={{ marginBottom: 16 }}>{rd.body}</Body>
              <div style={{ borderLeft: "2px solid rgb(245, 158, 11)", paddingLeft: 14, paddingTop: 2 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgb(245, 158, 11)", display: "block", marginBottom: 4 }}>Risk</span>
                <span style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{rd.risk}</span>
              </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </WorkReportShell>
  );
}


