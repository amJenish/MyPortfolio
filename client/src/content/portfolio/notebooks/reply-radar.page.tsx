import { useState, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { BookOpen, Github, Play } from "lucide-react";
import {
  Body,
  Code,
  FONT_MONO,
  FONT_SANS,
  CatalogTagPills,
  Notice,
  SectionLabel,
} from "../reportPrimitives";
import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

// ── STANDARD COLORS ────────────────────────────────────────────────────────

const COLORS = {
  primary: "var(--primary)",
  success: "var(--chart-success, #16a34a)",
  warning: "var(--accent-highlight)",
  danger: "var(--chart-danger, #dc2626)",
  secondary: "var(--chart-2)",
};

const workflowSteps = [
  { step: "1. Fetch", activity: "IMAP Retrieval", value: 100, fill: COLORS.secondary },
  { step: "2. Analyze", activity: "LLM Classification", value: 100, fill: COLORS.primary },
  { step: "3. Track", activity: "State Sync", value: 100, fill: COLORS.success },
  { step: "4. Notify", activity: "Windows Toast", value: 100, fill: COLORS.warning },
];

const architectureFiles = [
  { file: "agent.py", role: "Orchestrator", desc: "The main brain that manages timing and scheduling." },
  { file: "email_fetcher.py", role: "Collector", desc: "Connects to Gmail to pull in recent messages." },
  { file: "groq_analyzer.py", role: "Analyst", desc: "Uses Llama 3 to decide if an email needs a human." },
  { file: "notifier.py", role: "Messenger", desc: "Triggers the native Windows toast notifications." },
  { file: "state.py", role: "Memory", desc: "Saves tracked emails so nothing is lost on restart." },
];

export const workPageSections = [
  { id: "radar-overview", label: "Overview" },
  { id: "radar-workflow", label: "The Workflow" },
  { id: "radar-setup", label: "Prerequisites" },
  { id: "radar-usage", label: "Installation" },
  { id: "radar-removal", label: "Removing" },
  { id: "radar-arch", label: "Architecture" },
] as const;

export default function ReplyRadarReport(props: WorkPageProps) {
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
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "var(--muted-foreground)" }}>
                AI Automation · Windows Utility · Productivity Tool
              </span>
            </div>

            <h1 style={{
              fontFamily: FONT_SANS,
              fontSize: "clamp(30px, 4.5vw, 54px)",
              fontWeight: 800,
              margin: "0 0 20px",
              lineHeight: 1.12,
              color: "var(--foreground)",
              letterSpacing: -1,
            }}>
              ReplyRadar:<br />
              <span style={{ color: COLORS.primary }}>Your Silent Inbox Guardian</span>
            </h1>

            <Body style={{ maxWidth: 660, marginBottom: 24, color: "var(--foreground)" }}>
              Professionals often spend hours sifting through noise like newsletters and automated updates. I built ReplyRadar to act as a digital filter: a background agent that uses Llama 3 to find the emails that actually need a human touch.
            </Body>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: 12,
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                padding: "20px 0",
                marginBottom: 24,
              }}
            >
              {[
                { value: "60s", label: "Cycle", sub: "Wakes every minute" },
                { value: "5", label: "Core Modules", sub: "Agent plus four services" },
                { value: "3d", label: "Default Stop Window", sub: "Stop reminding after N days" },
                { value: "8h", label: "Default Reminder", sub: "Follow-up cadence" },
              ].map((metric) => (
                <div key={metric.label} style={{ padding: "8px 0" }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 30, fontWeight: 800, color: COLORS.primary, lineHeight: 1, marginBottom: 8 }}>
                    {metric.value}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 2 }}>{metric.label}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{metric.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 24 }}>
              <Button asChild size="lg" variant="default" className="gap-2 font-mono text-xs font-bold">
                <a href={props.entry.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              {props.entry.notebookUrl ? (
                <Button variant="outline" size="lg" asChild className="gap-2 font-mono text-xs font-medium">
                  <a href={props.entry.notebookUrl} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="h-4 w-4" />
                    Notebook
                  </a>
                </Button>
              ) : null}
              {props.entry.videoUrl ? (
                <Button variant="outline" size="lg" asChild className="gap-2 font-mono text-xs font-medium">
                  <a href={props.entry.videoUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4" />
                    Demo video
                  </a>
                </Button>
              ) : null}
            </div>

            <CatalogTagPills tags={props.entry.tags} />
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
          {/* ══ 01 OVERVIEW ══ */}
          <div id="radar-overview" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="Overview" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              ReplyRadar is a lightweight Windows application designed for zero friction productivity. It monitors your Gmail inbox in the background, analyzing every new message with an LLM to determine if a response is required. Unlike traditional filters, it understands context by distinguishing between a shipping notification and a genuine request for a meeting.
            </Body>

            <Notice color={COLORS.primary} icon="★">
              The goal was to build a silent companion. By integrating directly with Windows Task Scheduler and native toast notifications, ReplyRadar stays completely invisible until it has something important to tell you.
            </Notice>
          </div>

          {/* ══ 02 THE WORKFLOW ══ */}
          <div id="radar-workflow" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="The Automation Workflow" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              The agent follows a simple and efficient cycle every 60 seconds. It wakes up, performs a quick check, and goes back to sleep. Most of the heavy lifting happens behind the scenes through the Groq API.
            </Body>

            <div style={{
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--card)",
              marginBottom: 32,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 20 }}>
                Automation Pipeline
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {workflowSteps.map((s, i) => (
                  <div key={i} style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid var(--border)`,
                    background: "rgba(255,255,255,0.02)",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: s.fill, marginBottom: 4 }}>{s.step}</div>
                    <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{s.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ 03 PREREQUISITES ══ */}
          <div id="radar-setup" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Prerequisites" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Before running the agent, you need two essential keys to ensure secure access and high performance classification.
            </Body>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 20 }}>
              <div style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, marginBottom: 8 }}>Gmail App Password</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Google requires an app specific password for third party access. You can generate this 16 character key in your Google Account security settings.</Body>
              </div>
              <div style={{
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--card)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.secondary, marginBottom: 8 }}>Groq API Key</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Powers the Llama 3 classification. You can create a free account and generate a key at console.groq.com.</Body>
              </div>
            </div>
          </div>

          {/* ══ 04 INSTALLATION ══ */}
          <div id="radar-usage" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Installation" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              ReplyRadar ships as a single Windows executable. Download it from the repo&apos;s <strong>dist</strong> folder, run
              the setup app once to enter credentials and preferences, then inject the background agent. No Python install and no
              dependency management—everything is bundled in <strong>setup.exe</strong>.
            </Body>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                gap: 32,
                marginBottom: 28,
                alignItems: "start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, marginBottom: 10 }}>1. Download</div>
                  <Body style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0 }}>
                    Download <strong>setup.exe</strong> from the <strong>dist</strong> folder in this repository. That is the only
                    file you need—nothing else to install, no Python required, no dependencies to manage.
                  </Body>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, marginBottom: 10 }}>2. Run the setup app</div>
                  <Body style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0 }}>
                    Double-click <strong>setup.exe</strong>. If Windows shows a SmartScreen warning, choose{" "}
                    <strong>More info</strong> and then <strong>Run anyway</strong>. That prompt appears because the executable is
                    not code-signed.
                  </Body>
                </div>

                <div
                  style={{
                    padding: "18px 20px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--card)",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>
                    3. Fill in the form
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      listStyle: "disc",
                      color: "var(--muted-foreground)",
                      fontSize: 13,
                      lineHeight: 1.65,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <li>
                      <strong style={{ color: "var(--foreground)" }}>Gmail address</strong> — your full Gmail address.
                    </li>
                    <li>
                      <strong style={{ color: "var(--foreground)" }}>Gmail app password</strong> — the 16-character app password
                      from Google Account security (see Prerequisites above), not your normal Gmail password.
                    </li>
                    <li>
                      <strong style={{ color: "var(--foreground)" }}>Groq API key</strong> — create one at{" "}
                      <span style={{ fontFamily: FONT_MONO, fontSize: 12 }}>console.groq.com</span>.
                    </li>
                    <li>
                      <strong style={{ color: "var(--foreground)" }}>Stop reminding after N days</strong> — how many days before
                      the agent stops chasing an email you never answered (default <strong>3</strong>).
                    </li>
                    <li>
                      <strong style={{ color: "var(--foreground)" }}>Remind every N hours</strong> — how often you get nudged about
                      a thread you still haven&apos;t replied to (default <strong>8</strong>).
                    </li>
                    <li>
                      <strong style={{ color: "var(--foreground)" }}>New email notifications</strong> — turn off if you only want
                      follow-up reminders, not toasts for every brand-new message.
                    </li>
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, marginBottom: 10 }}>4. Inject</div>
                  <Body style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0 }}>
                    Click <strong>Inject</strong>. The agent starts immediately. You can close or delete the setup app afterward;
                    the scheduled task keeps the agent running across reboots.
                  </Body>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <img
                  src="/portfolio/notebooks/reply-radar/reply_radar_img.PNG"
                  alt="ReplyRadar Setup App Interface"
                  style={{
                    width: "100%",
                    maxWidth: 420,
                    height: "auto",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 8, fontFamily: FONT_MONO }}>
                  ReplyRadar Setup App Interface
                </div>
              </div>
            </div>

            <Notice color={COLORS.success} icon="✅">
              After <strong>Inject</strong>, you can discard <strong>setup.exe</strong> if you like—the running agent does not
              depend on it. To uninstall everything later, use the removal flow below.
            </Notice>
          </div>

          {/* ══ 05 REMOVING ══ */}
          <div id="radar-removal" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Removing" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              Open <strong>setup.exe</strong> again. The app detects that an agent is already installed and disables{" "}
              <strong>Inject</strong>. Click <strong>Remove</strong>: it stops the agent, deletes its data under AppData, and
              removes the scheduled task—clean uninstall with nothing left behind.
            </Body>
          </div>

          {/* ══ 06 ARCHITECTURE ══ */}
          <div id="radar-arch" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Architecture" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              The project is built with Python and compiled into a single executable for reliability and ease of maintenance.
            </Body>

            <div style={{
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--card)",
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>
                Project Components
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr", gap: 0, borderBottom: "1px solid var(--border)" }}>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Module</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Role</div>
                <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)" }}>Description</div>
              </div>
              {architectureFiles.map(({ file, role, desc }) => (
                <div key={file} style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 2fr",
                  padding: "12px 18px",
                  fontSize: 13,
                  color: "var(--foreground)",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <span style={{ fontFamily: FONT_MONO, color: COLORS.primary }}>{file}</span>
                  <span style={{ fontWeight: 500 }}>{role}</span>
                  <span style={{ color: "var(--muted-foreground)" }}>{desc}</span>
                </div>
              ))}
            </div>

            <Body style={{ color: "var(--foreground)", marginBottom: 12 }}>
              <strong>Tech Stack:</strong> Python, CustomTkinter (GUI), imaplib (Gmail), Groq (LLM), and PyInstaller (Distribution).
            </Body>
          </div>
        </div>
      </div>
    </WorkReportShell>
  );
}


