import { type ReactNode } from "react";
import {
  CatalogTagPills,
  Body,
  Code,
  FONT_MONO as MONO,
  FONT_SANS as SANS,
  Notice,
  SectionLabel,
  TwoCol,
} from "../reportPrimitives";
import type { WorkPageProps } from "@/content/portfolio/workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

// ── COLORS ──────────────────────────────────────────────────────────────────────

const COLORS = {
  teal: "var(--primary)",
};

export const workPageSections = [
  { id: "summary", label: "Overview" },
  { id: "built", label: "1. Core Features" },
  { id: "architecture", label: "2. Layered Architecture" },
  { id: "datalayer", label: "3. Data Layer" },
  { id: "bizlogic", label: "4. Business Logic" },
  { id: "security", label: "5. Security & Access Control" },
  { id: "stack", label: "6. Technical Stack" },
] as const;

// ── COMPONENTS ──────────────────────────────────────────────────────────────────

function PipelineNode({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 12,
        fontWeight: 500,
        padding: "8px 12px",
        borderRadius: 8,
        border: `1px solid color-mix(in srgb, ${accent} 40%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        color: accent,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

function PipelineArrow() {
  return (
    <span style={{ fontFamily: MONO, fontSize: 14, color: "var(--muted-foreground)", userSelect: "none" }} aria-hidden>
      →
    </span>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function StudentEnrollmentPage(props: WorkPageProps) {
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

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative" }}>
            <h1 style={{
              fontFamily: SANS,
              fontSize: "clamp(30px, 4.5vw, 54px)",
              fontWeight: 800, margin: "0 0 20px",
              lineHeight: 1.12, letterSpacing: -1, color: "var(--foreground)",
            }}>
              Student Enrollment<br />
              <span style={{ color: COLORS.teal }}>Academic administration system</span>
            </h1>

            <Body style={{ maxWidth: 1280, marginBottom: 12, color: "var(--foreground)" }}>
              A servlet-based academic administration platform built in Java that manages the full lifecycle of student enrollment: from program selection and prerequisite validation through schedule conflict detection and course registration. The system supports three distinct user roles (Student, Professor, Administrator), each with scoped permissions and a dedicated service boundary.
            </Body>
            <Body style={{ maxWidth: 1280, marginBottom: 36, color: "var(--foreground)" }}>
              The architecture follows a strict layered separation between HTTP handling, business logic, and data access. Thirteen dedicated data access objects, nine service classes, and a shared helper layer handle cross-cutting concerns like data validation and query construction. All database interaction goes through JDBC with prepared statements.
            </Body>

            <CatalogTagPills tags={props.entry.tags} />
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>

          {/* ══ 01 OVERVIEW ══ */}
          <div id="summary" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="Overview" />
            <Body style={{ marginBottom: 16, color: "var(--foreground)" }}>
              The system manages the full lifecycle of student enrollment: from program selection and prerequisite validation through schedule conflict detection and course registration. The architecture follows a strict layered separation between HTTP handling, business logic, and data access.
            </Body>
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Key architectural principles:
            </Body>
            <ul style={{ listStyle: "disc", paddingLeft: 20, marginBottom: 24, color: "var(--muted-foreground)", lineHeight: 1.8 }}>
              <li>Thirteen DAO classes provide clean separation between business logic and SQL, with no raw queries leaking into the service layer.</li>
              <li>Enrollment validation enforces prerequisite completion and seat availability atomically before any registration is committed.</li>
              <li>Schedule conflict detection runs at registration time to prevent students from booking overlapping course offerings.</li>
              <li>Role-based access control is enforced at the servlet layer so unauthenticated or underprivileged requests cannot reach service or DAO code.</li>
              <li>PasswordHasher handles credential storage so plaintext passwords are never written to the database.</li>
              <li>LoggedUserInformation maintains session state so each request is authorized against the currently authenticated user's role.</li>
            </ul>

            <Notice color={COLORS.teal} icon="★">
              Academic enrollment systems need to enforce complex interdependencies across entities: a student cannot register for a course without its prerequisites, cannot double-book a time slot, and cannot exceed a course's seat cap. How should these constraints be implemented so they remain enforceable as the system scales?
            </Notice>
          </div>

          {/* ══ 02 CORE FEATURES ══ */}
          <div id="built" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="Core Features" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Student Enrollment</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Students can browse available course offerings, check prerequisite completion status, and register for courses. Enrollment is blocked if prerequisites are unmet, seats are full, or the offering conflicts with an existing schedule entry.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Professor Role</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  The professor role exposes read access to assigned course offerings and enrolled student rosters. Teaching load tracking is handled by the administrator layer. The professor servlet path is explicitly scoped to their assigned courses.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Administrator Control</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Administrators manage the full academic structure: creating programs, defining courses and prerequisites, scheduling offerings, assigning professors, and controlling enrollment periods. User lifecycle management is also scoped to this role.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Prerequisite Enforcement</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  The <Code>PrerequisitesDAO</Code> models prerequisite chains per course. Before any enrollment is committed, <Code>EnrollmentManagementServices</Code> queries the student's completed course history and validates against all required predecessors.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Schedule Conflict Detection</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  <Code>ScheduleConflictValidator</Code> runs at registration time to prevent students from booking overlapping course offerings. Conflicts are detected by querying the student's existing enrollments and checking for time slot overlap.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Seat Management</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Each course offering has a fixed seat capacity. <Code>EnrollmentManagementServices</Code> queries the current enrollment count before accepting a new registration. Seat availability is checked atomically with the enrollment commit.
                </Body>
              </div>
            </div>
          </div>

          {/* ══ 03 LAYERED ARCHITECTURE ══ */}
          <div id="architecture" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Layered Architecture" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              The system is organized into three distinct layers: the HTTP/Servlet layer, the business logic layer, and the data access layer. Each layer has a single responsibility and communicates through well-defined interfaces.
            </Body>

            {/* Architecture diagram */}
            <div style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 20 }}>Layered architecture</div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <PipelineNode accent={COLORS.teal}>HTTP Request</PipelineNode>
                <div style={{ fontFamily: MONO, fontSize: 14, color: "var(--muted-foreground)" }}>↓</div>
                <PipelineNode accent={COLORS.teal}>Servlet Layer (Controller)</PipelineNode>
                <div style={{ fontFamily: MONO, fontSize: 14, color: "var(--muted-foreground)" }}>↓</div>
                <PipelineNode accent={COLORS.teal}>Service Layer (Business Logic)</PipelineNode>
                <div style={{ fontFamily: MONO, fontSize: 14, color: "var(--muted-foreground)" }}>↓</div>
                <PipelineNode accent={COLORS.teal}>DAO Layer (Data Access)</PipelineNode>
                <div style={{ fontFamily: MONO, fontSize: 14, color: "var(--muted-foreground)" }}>↓</div>
                <PipelineNode accent={COLORS.teal}>MySQL Database</PipelineNode>
              </div>

              <Body style={{ fontSize: 12, marginTop: 16, color: "var(--foreground)" }}>
                Each layer is independently testable. Servlets handle HTTP concerns (routing, authentication, serialization). Services handle business logic (validation, orchestration). DAOs handle SQL and persistence. This separation keeps concerns isolated and makes the codebase maintainable.
              </Body>
            </div>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Servlet Layer</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Each servlet maps to a specific domain action. Servlets handle HTTP routing, authentication checks, and parameter extraction. They delegate all business logic to the service layer and serialize responses back to JSON or HTML. Role-based access control is enforced at this boundary.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Service Layer</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Nine service classes encapsulate business logic: enrollment validation, prerequisite checking, schedule conflict detection, and seat management. Services orchestrate calls to multiple DAOs and enforce invariants before committing changes. All complex queries and validations live here.
                </Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Data Access Layer</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Thirteen DAO classes provide a clean separation between business logic and SQL. Each DAO owns a specific entity's persistence logic. No raw queries leak into the service layer. Prepared statements prevent SQL injection. Stored procedures handle complex multi-table queries.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Helper Layer</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Shared utilities handle cross-cutting concerns: data validation, query construction, password hashing, and session management. <Code>DatabaseConnection</Code> centralizes JDBC connection management. <Code>LoggedUserInformation</Code> maintains session state across requests.
                </Body>
              </div>
            </TwoCol>
          </div>

          {/* ══ 04 DATA LAYER ══ */}
          <div id="datalayer" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Data Layer" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              The data layer is built around the DAO pattern with thirteen dedicated data access objects. Each DAO owns the persistence logic for a specific entity. All database interaction goes through JDBC with prepared statements to prevent SQL injection. Stored procedures handle the more complex multi-table queries.
            </Body>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                { name: "UserDAO", desc: "User registration, login, role assignment" },
                { name: "StudentDAO", desc: "Student profile, program enrollment, academic progress" },
                { name: "ProfessorDAO", desc: "Professor profile, course assignments, roster queries" },
                { name: "CourseDAO", desc: "Course definitions, metadata, prerequisites" },
                { name: "CourseOfferingDAO", desc: "Specific course instances, schedule, seat capacity" },
                { name: "EnrollmentDAO", desc: "Student enrollments, status tracking, history" },
                { name: "PrerequisitesDAO", desc: "Prerequisite chains, completion tracking" },
                { name: "ScheduleDAO", desc: "Time slot queries, conflict detection" },
                { name: "ProgramDAO", desc: "Academic programs, requirements, structure" },
                { name: "AdminDAO", desc: "Administrative operations, user lifecycle" },
                { name: "SessionDAO", desc: "Session management, token validation" },
                { name: "AuditDAO", desc: "Audit logging, enrollment history" },
                { name: "ReportDAO", desc: "Analytics, enrollment statistics, dashboards" },
              ].map((dao, i) => (
                <div key={i} style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--muted)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 6, fontFamily: MONO }}>{dao.name}</div>
                  <Body style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{dao.desc}</Body>
                </div>
              ))}
            </div>
          </div>

          {/* ══ 05 BUSINESS LOGIC ══ */}
          <div id="bizlogic" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Business Logic" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Nine service classes encapsulate the core business logic. Each service orchestrates calls to multiple DAOs and enforces domain invariants before committing changes. Complex validations and multi-step workflows live in the service layer.
            </Body>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Enrollment Validation</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  <Code>EnrollmentManagementServices</Code> enforces three constraints before accepting any enrollment: prerequisites must be met, seats must be available, and schedule conflicts must not exist. All three checks run atomically before the database commit.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Schedule Conflict Detection</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  <Code>ScheduleConflictValidator</Code> queries the student's existing enrollments and checks for time slot overlap. Conflicts are detected by comparing start/end times across all enrolled offerings. The check runs before the enrollment is committed.
                </Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Prerequisite Checking</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  <Code>PrerequisiteValidator</Code> queries the student's completed course history and validates against all required predecessors. Partial completion is treated as a failure. The validator handles chains of prerequisites (A requires B, B requires C).
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Seat Management</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  <Code>SeatAvailabilityValidator</Code> queries the current enrollment count for a course offering and checks against its fixed capacity. Seat availability is checked atomically with the enrollment commit to prevent race conditions.
                </Body>
              </div>
            </TwoCol>
          </div>

          {/* ══ 06 SECURITY & ACCESS CONTROL ══ */}
          <div id="security" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Security & Access Control" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Role-based access control is enforced at the servlet layer. Each servlet checks the authenticated user's role before allowing access to protected operations. Passwords are hashed before storage. Session state is maintained securely across requests.
            </Body>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Authentication</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Users log in with email and password. <Code>PasswordHasher</Code> hashes credentials before any database write, so plaintext values are never stored. Successful login returns a session token that gates access to protected operations.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Authorization</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  <Code>LoggedUserInformation</Code> maintains session state so each request is authorized against the currently authenticated user's role. Servlets check role membership before delegating to service methods. Unauthenticated or underprivileged requests are rejected at the servlet boundary.
                </Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>SQL Injection Prevention</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  All database interaction uses JDBC prepared statements. User input is never concatenated directly into SQL strings. Stored procedures handle complex multi-table queries, further isolating SQL logic from application code.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Data Isolation</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Students can only view and modify their own enrollments. Professors can only view their assigned courses and rosters. Administrators have full access. Data isolation is enforced at the service layer through role-aware queries.
                </Body>
              </div>
            </TwoCol>
          </div>

          {/* ══ 07 TECHNICAL STACK ══ */}
          <div id="stack" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={7} title="Technical Stack" />

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Build & Tooling</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Maven manages dependencies and the build lifecycle. The Maven wrapper (<Code>mvnw</Code>) is committed to the repository so the project builds without a system Maven installation. The <Code>pom.xml</Code> defines the servlet container integration and third-party dependencies.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Package Structure</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  The application is organized under <Code>com.example.studentenrollmentsystem</Code> with five sub-packages: DAO, Interfaces, models, security, and services. Servlets live in a separate <Code>servlets/</Code> package. The package layout mirrors the architectural layering directly.
                </Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Persistence</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  MySQL stores all application data. <Code>DatabaseConnection.java</Code> centralizes JDBC connection management so no individual DAO creates its own connection. At present this uses a single managed connection rather than a pool.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Extensibility</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Adding a new entity requires a new model, a new DAO, and additions to the relevant service class, without touching any servlet. Swapping MySQL for a different JDBC-compatible database would require only changes to <Code>DatabaseConnection.java</Code>.
                </Body>
              </div>
            </TwoCol>
          </div>

          {/* ══ REFLECTIONS ══ */}
          <div style={{ marginBottom: 88 }}>
            <SectionLabel n={8} title="Reflections" />

            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 16 }}>What went well</div>
              <ul style={{ listStyle: "disc", paddingLeft: 20, color: "var(--muted-foreground)", lineHeight: 1.8 }}>
                <li>Structured fourteen DAOs so every query lives in the data layer. Nothing leaks into services or servlets.</li>
                <li>Centralized enrollment rules (prerequisites, seats, schedule conflicts) in the service tier before commits.</li>
                <li>Enforced roles at the servlet edge so downstream layers stay focused on domain logic.</li>
                <li>Modeled Course vs CourseOffering so prerequisite rules live once in the catalogue, not per offering.</li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 16 }}>Future improvements</div>
              <ul style={{ listStyle: "disc", paddingLeft: 20, color: "var(--muted-foreground)", lineHeight: 1.8 }}>
                <li>Introduce a front controller or a small MVC layer if the route surface keeps growing. Less servlet boilerplate.</li>
                <li>Swap the single JDBC connection for a pool (e.g. HikariCP) before expecting real concurrency.</li>
                <li>Add unit tests around the validation-heavy service methods. They're a natural fit for JUnit.</li>
                <li>Pair stored procedures with Flyway/Liquibase-style migrations for safer schema evolution.</li>
                <li>If this became a JSON API, standardize error payloads and versioning before external clients depend on it.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </WorkReportShell>
  );
}
