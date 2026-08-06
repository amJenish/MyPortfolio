import { Button } from "@/components/ui/button";
import { FileText, Github } from "lucide-react";
import {
  CatalogTagPills,
  Body,
  FONT_MONO as MONO,
  FONT_SANS as SANS,
  SectionLabel,
} from "../reportPrimitives";
import type { WorkPageProps } from "@/content/portfolio/workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

const REPORT_PDF = "/portfolio/projects/rl-traffic/Final-Project-Report.pdf";

export const workPageSections = [
  { id: "problem", label: "The problem" },
  { id: "built", label: "What we built" },
  { id: "rewards", label: "Reward design" },
  { id: "smdp", label: "Decision timing" },
  { id: "doubledqn", label: "Double DQN" },
  { id: "eval-bug", label: "Evaluation fairness" },
  { id: "testing", label: "Testing" },
  { id: "results", label: "Results" },
  { id: "convergence", label: "Convergence" },
  { id: "stack", label: "Tech stack" },
] as const;

export default function RLTrafficReport(props: WorkPageProps): React.JSX.Element {
  return (
    <WorkReportShell {...props}>
      <div style={{ color: "var(--foreground)", fontFamily: SANS, textAlign: "left" }}>
        <div style={{ borderBottom: "1px solid var(--border)", padding: "88px 0 72px", position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              opacity: 0.35,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "5%",
              width: 520,
              height: 520,
              background:
                "radial-gradient(ellipse, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 62%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(1rem, 4vw, 3rem)", position: "relative" }}>
            <p
              style={{
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--primary)",
                marginBottom: 20,
              }}
            >
              Reinforcement Learning
            </p>

            <h1
              className="gradient-heading"
              style={{
                fontFamily: SANS,
                fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 800,
                margin: "0 0 28px",
                lineHeight: 1.05,
                letterSpacing: -1.5,
                maxWidth: 900,
              }}
            >
              Smart Traffic Light Controller
            </h1>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Button asChild size="lg" variant="default" className="gap-2 font-mono text-xs font-bold">
                <a href={props.entry.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <CatalogTagPills tags={props.entry.tags} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px clamp(1rem, 4vw, 3rem) 8px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              textAlign: "center",
              padding: "28px 32px",
              borderRadius: 16,
              border: "1px solid color-mix(in srgb, var(--primary) 28%, var(--border))",
              background:
                "linear-gradient(160deg, color-mix(in srgb, var(--card) 88%, transparent) 0%, color-mix(in srgb, var(--primary) 10%, var(--card)) 100%)",
              boxShadow:
                "inset 0 1px 0 color-mix(in srgb, var(--foreground) 8%, transparent), 0 12px 32px color-mix(in srgb, var(--primary) 8%, transparent)",
            }}
          >
            <p
              style={{
                margin: "0 0 16px",
                fontFamily: SANS,
                fontSize: 15,
                fontWeight: 600,
                color: "var(--foreground)",
                letterSpacing: "-0.01em",
              }}
            >
              View the final report here:
            </p>
            <Button asChild size="lg" variant="cta" className="h-11 gap-2 px-7 text-sm font-semibold">
              <a href={REPORT_PDF} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" />
                Final project report
              </a>
            </Button>
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px clamp(1rem, 4vw, 3rem)" }}>
          <section id="problem" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="The problem" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              Most traffic lights run on a timer or a simple rule. They turn green and red on a fixed schedule
              that does not look at how much traffic is waiting. That works sometimes, but it wastes time when
              one direction is busier than usual. Cars sit at red lights for no good reason, and queues build up.
            </Body>
            <Body style={{ color: "var(--foreground)" }}>
              We asked a concrete question: given real traffic counts from an intersection, could a learned
              controller beat fixed-time and actuated baselines under the same simulated conditions?
            </Body>
          </section>

          <section id="built" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="What we built" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              We built an end-to-end system, not only a model. It takes traffic count data and an intersection
              layout, generates SUMO simulation inputs, trains a reinforcement learning controller, evaluates
              it against baselines, and exports a readable signal schedule. You can drive the same pipeline from
              a Streamlit app or the command line.
            </Body>
            <Body style={{ color: "var(--foreground)" }}>
              The interesting part was not the final score alone. Getting there meant iterating through rewards,
              decision timing, algorithms, evaluation bugs, and tests that could fail silently if we were not careful.
            </Body>
          </section>

          <section id="rewards" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="Reward design: what we tried first" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              In reinforcement learning, the reward is the score the agent gets after each decision. If that score
              is incomplete, the agent can look good on paper while making the intersection worse in other ways.
            </Body>
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              We started with simpler rewards: total wait time, change in wait time between steps, and
              throughput alone (how many cars cleared). Each one optimized one signal in isolation. A
              throughput-only agent could push cars through one approach while perpendicular queues grew.
              A wait-time-only agent was sensitive to traffic volume and produced large, noisy scores that were
              hard to train on stably.
            </Body>
            <Body style={{ color: "var(--foreground)" }}>
              We settled on a composite reward that combines throughput, average queue length, and how uneven
              those queues are across approaches, with tunable weights (alpha, beta, gamma). In plain terms: get
              cars through, do not let queues explode overall, and do not leave one direction stuck while others
              are fine. That closed the failure modes the single-term rewards left open.
            </Body>
          </section>

          <section id="smdp" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="Why not decide every simulator tick" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              A standard Markov decision process (MDP) assumes the agent acts on a fixed clock, often every
              simulation step. Traffic lights do not work that way. Meaningful choices happen when it is legal
              to hold or advance a phase, and yellow and all-red clearances have to run in between.
            </Body>
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              We modeled the problem as a semi-Markov decision process (SMDP): decisions happen at variable
              intervals, and the time spent in a phase is part of what the agent experiences. Between decisions,
              yellow and all-red transitions are forced rather than left to the network to invent.
            </Body>
            <Body style={{ color: "var(--foreground)" }}>
              That design also forced hard timing constraints: minimum and maximum green, yellow clearance, and
              all-red intervals. Without those rules, an agent could flicker the light in ways that look clever
              in simulation and would be unsafe or illegal in the real world. Constraints made the action space
              smaller and more honest.
            </Body>
          </section>

          <section id="doubledqn" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="Double DQN instead of plain DQN" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              Deep Q-Networks (DQN) learn a score for each action in a given state. Vanilla DQN uses the same
              network both to pick the best next action and to estimate how good that action is. That can
              systematically overestimate values, which made training noisier than we wanted.
            </Body>
            <Body style={{ color: "var(--foreground)" }}>
              Double DQN separates those jobs: the online network selects the next action, and a target network
              evaluates it. That cut overestimation bias and made learning more stable for our discrete hold-or-switch
              action space, which is why we shipped Double DQN as the final policy.
            </Body>
          </section>

          <section id="eval-bug" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="The evaluation fairness bug we caught" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              Early comparison tables looked too good to trust without checking. When we lined up the archived
              baseline runs against the final Double DQN test logs, the day IDs did not fully match. The baseline
              batch and the DQN test batch had been evaluated on partially different held-out days.
            </Body>
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              Publishing a headline average across mismatched days would have been misleading. What tipped us
              off was comparing the split files and run manifests side by side, not the reward numbers alone.
            </Body>
            <Body style={{ color: "var(--foreground)" }}>
              The fix was simple and strict: for the primary baseline comparison, we only report the three
              overlapping test days (0, 1, and 4). Pre-train versus post-train comparisons still use identical
              day sets for the RL agent. That is why the Results numbers below are trustworthy for the claim
              we actually make.
            </Body>
          </section>

          <section id="testing" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="Testing what could silently break" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              Preprocessing bugs are dangerous in this project because SUMO will often run with bad inputs and
              produce nonsense traffic instead of crashing. We wrote unit and integration tests around route and
              network generation for that reason.
            </Body>
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              One concrete worry was overlapping flow intervals on the same route, which could inject impossible
              demand into the simulator. Tests assert that no two flow elements on the same route share overlapping
              begin and end times. Another check verifies that generated signal state strings only use valid SUMO
              characters and consistent lengths, so a malformed phase definition cannot slip through.
            </Body>
            <Body style={{ color: "var(--foreground)" }}>
              We also force a clean failure when <code style={{ fontFamily: MONO, fontSize: 13 }}>netconvert</code> is
              missing, instead of a half-written network directory that looks complete. Full CLI runs are checked for
              the expected artifacts (<code style={{ fontFamily: MONO, fontSize: 13 }}>train_log.json</code>,{" "}
              <code style={{ fontFamily: MONO, fontSize: 13 }}>test_log.json</code>,{" "}
              <code style={{ fontFamily: MONO, fontSize: 13 }}>final_model.pt</code>). Grid search over rewards and
              hyperparameters sat on top of that same logging, so failed experiments stayed comparable.
            </Body>
          </section>

          <section id="results" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="Results" />
            <Body style={{ marginBottom: 20, color: "var(--foreground)" }}>
              We trained Double DQN for 300 epochs on demand derived from City of Toronto turning-movement counts,
              then evaluated on held-out days. Against an untrained random policy on the same five DQN test days,
              mean reward moved from about −1,173 to about +1.61.
            </Body>
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              On the three overlapping days used for fair baseline comparison, mean reward was about −18.5 for the
              learned controller, versus about −1,551 for fixed-time and −1,698 for actuated control.
            </Body>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
                marginBottom: 8,
              }}
            >
              {(
                [
                  { label: "Learned policy", value: "−18.5", note: "Mean reward, days 0, 1, 4" },
                  { label: "Fixed-time", value: "−1,551", note: "Same days, same setup" },
                  { label: "Actuated", value: "−1,698", note: "Same days, same setup" },
                ] as const
              ).map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "18px 16px",
                  }}
                >
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 8, lineHeight: 1.45 }}>
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="convergence" className="scroll-mt-28" style={{ marginBottom: 72 }}>
            <SectionLabel title="Convergence: what we did not oversell" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              After 300 epochs, exploration rate epsilon was still about 0.49. It had not decayed to the low values
              we would expect from a fully trained policy. The agent was still exploring a lot of random actions.
            </Body>
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              We treated that as a real limitation, not a footnote. The learning curve still showed clear improvement
              over the random baseline on identical test days, which is evidence of adaptive behaviour, not proof of a
              finished optimum.
            </Body>
            <Body style={{ color: "var(--foreground)" }}>
              The natural next step is longer training or a faster epsilon decay schedule, then re-running the same
              overlapping-day comparison. Until that happens, these results should be read as a strong partially
              trained controller, not a converged production timing plan.
            </Body>
          </section>

          <section id="stack" className="scroll-mt-28" style={{ marginBottom: 40 }}>
            <SectionLabel title="Tech stack" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                "Python",
                "PyTorch",
                "SUMO",
                "TraCI",
                "Streamlit",
                "Pandas",
                "NumPy",
                "Matplotlib",
              ].map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--primary)",
                    background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
                    padding: "6px 12px",
                    borderRadius: 24,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <Body style={{ marginTop: 28, color: "var(--muted-foreground)", fontSize: 14 }}>
              Team project with Aydan Karmali and Samreet Johal. Equations, full tables, and appendices are in the
              final project report linked above.
            </Body>
          </section>
        </div>
      </div>
    </WorkReportShell>
  );
}
