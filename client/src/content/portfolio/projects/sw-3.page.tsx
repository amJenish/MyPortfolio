import type { ReactNode } from "react";
import { C } from "@/lib/theme";
import { WorkSectionLabel } from "../_shared";
import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

const PIPELINE_ACCENT = C.teal;

function PipelineNode({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <div
      className="shrink-0 whitespace-nowrap rounded-lg border border-transparent px-3 py-2 font-mono text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
        color: accent,
      }}
    >
      {children}
    </div>
  );
}

function PipelineArrow() {
  return (
    <span className="shrink-0 select-none font-mono text-sm text-muted-foreground" aria-hidden>
      →
    </span>
  );
}

const cardTitleAccent = "text-xs font-mono font-medium text-accent";
const cardTitleFg = "text-xs font-mono font-semibold text-foreground";

export const workPageSections = [
  { id: "summary",      label: "Overview" },
  { id: "built",        label: "1. Core Features" },
  { id: "architecture", label: "2. Layered Architecture" },
  { id: "datalayer",    label: "3. Data Layer" },
  { id: "bizlogic",     label: "4. Business Logic" },
  { id: "security",     label: "5. Security & Access Control" },
  { id: "stack",        label: "6. Technical Stack" },
] as const;

export default function StudentEnrollmentPage(props: WorkPageProps) {
  return (
    <WorkReportShell {...props}>
    <div className="theme-body work-report-body mx-auto max-w-[min(100%,60rem)] space-y-10 px-4 pb-16 text-sm sm:px-6 sm:text-base">

      <section className="scroll-mt-28 space-y-4">
        <WorkSectionLabel number={1} title="Overview" id="summary" />
        <p className="text-report-body">
          A servlet-based academic administration platform built in Java that manages the full lifecycle of student enrollment: from program selection and prerequisite validation through schedule conflict detection and course registration. The system supports three distinct user roles (Student, Professor, Administrator), each with scoped permissions and a dedicated service boundary. The architecture follows a strict layered separation between HTTP handling, business logic, and data access.
        </p>
        <p className="text-report-body">
          The backend is structured around a DAO pattern with thirteen dedicated data access objects, nine service classes, and a shared helper layer that handles cross-cutting concerns like data validation and query construction. All database interaction goes through JDBC with prepared statements, and stored procedures handle the more complex multi-table queries. The application is deployed as a Java Servlet application where each servlet maps to a specific domain action, acting as the routing and controller layer above the service tier.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
          <li>Thirteen DAO classes provide a clean separation between business logic and SQL, with no raw queries leaking into the service layer.</li>
          <li>Enrollment validation enforces prerequisite completion and seat availability atomically before any registration is committed.</li>
          <li>Schedule conflict detection runs at registration time to prevent students from booking overlapping course offerings.</li>
          <li>Role-based access control is enforced at the servlet layer so unauthenticated or underprivileged requests cannot reach service or DAO code.</li>
          <li>PasswordHasher handles credential storage so plaintext passwords are never written to the database.</li>
          <li>LoggedUserInformation maintains session state so each request is authorized against the currently authenticated user&apos;s role.</li>
        </ul>
        <p className="border-l-2 border-primary/50 pl-4 text-left leading-[1.6] text-muted-foreground">
          Academic enrollment systems need to enforce complex interdependencies across entities: a student cannot register for a course without its prerequisites, cannot double-book a time slot, and cannot exceed a course&apos;s seat cap. How should these constraints be implemented so they remain enforceable as the system scales, without leaking business logic into the database or the HTTP layer?
        </p>
      </section>

      {/* ── 02 CORE FEATURES ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={2} title="Core Features" id="built" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Student Enrollment</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Students can browse available course offerings, check prerequisite completion status, and register for courses. Enrollment is blocked if prerequisites are unmet, seats are full, or the offering conflicts with an existing schedule entry. Program requirements and academic progress are tracked per student.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Professor Role</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The professor role exposes read access to assigned course offerings and enrolled student rosters. Teaching load tracking is handled by the administrator layer, which prevents over-assignment at the service level. The professor servlet path is explicitly scoped to their assigned courses and does not expose any administrative or enrollment-write operations.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Administrator Control</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Administrators manage the full academic structure: creating programs, defining courses and prerequisites, scheduling offerings, assigning professors, and controlling enrollment periods. User lifecycle management (invitation, approval, removal) for students, professors, and co-administrators is also scoped to this role.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Prerequisite Enforcement</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">PrerequisitesDAO</span> models prerequisite chains per course. Before any enrollment is committed, <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">EnrollmentManagementServices</span> queries the student's completed course history and validates against all required predecessors. Partial completion is treated as a failure.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Schedule & Seat Management</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ScheduleDAO</span> and <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">SeatDAO</span> are queried together during enrollment. A registration attempt fails if the offering's time block overlaps any existing entry in the student's schedule, or if <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">SeatDAO</span> reports no remaining capacity.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Program & Goal Tracking</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ProgramGoalDAO</span> and <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ProgramDAO</span> together support structured academic program definitions with associated completion goals. Students are linked to a program and their enrollment history is evaluated against it to surface progress metrics in the UI.
            </p>
          </div>

        </div>
      </section>

      {/* ── 02 LAYERED ARCHITECTURE ── */}
      <section className="space-y-6">
        <WorkSectionLabel number={2} title="Layered Architecture" id="architecture" />

        <p className="text-muted-foreground">
          The application is structured in four layers with one-directional dependencies: the servlet layer calls into services, services call into DAOs, and DAOs interact with the database. No layer reaches past its immediate neighbor. This means business logic cannot be accidentally expressed in SQL, and HTTP routing concerns cannot bleed into enrollment validation.
        </p>

        {/* Request flow */}
        <div className="border border-border rounded-lg bg-card/30 p-5 space-y-3">
          <div className="text-report-label mb-4">Request flow (all roles)</div>
          <div className="flex flex-wrap items-center gap-2.5">
            <PipelineNode accent={PIPELINE_ACCENT}>HTTP Request</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent={PIPELINE_ACCENT}>Servlet (Controller)</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#f97316">Role Verification</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#f97316">Service Layer</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#2dd4bf">DAO Layer</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#2dd4bf">MySQL (JDBC)</PipelineNode>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            Role verification happens at the servlet boundary before any service method is invoked. An unauthorized request is rejected before it reaches business logic.
          </p>
        </div>

        {/* Enrollment-specific flow */}
        <div className="border border-border rounded-lg bg-card/30 p-5 space-y-3">
          <div className="text-report-label mb-4">Enrollment validation flow (student)</div>
          <div className="flex flex-wrap items-center gap-2.5">
            <PipelineNode accent={PIPELINE_ACCENT}>Enroll Request</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#f97316">EnrollmentManagementServices</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#f97316">PrerequisitesDAO</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#2dd4bf">SeatDAO</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#2dd4bf">ScheduleDAO</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#a78bfa">Commit / Reject</PipelineNode>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            All three checks (prerequisites, seat availability, schedule conflicts) are run before any write is committed. A failure at any step aborts the registration without side effects.
          </p>
        </div>

        {/* Module map */}
        <div className="bg-muted/10 p-4 rounded border border-border font-mono text-xs text-muted-foreground leading-relaxed space-y-1">
          <div><span className="text-foreground/60">servlets/</span>               HTTP routing, role gating, request/response handling. No business logic.</div>
          <div><span className="text-foreground/60">services/</span>               Business logic and validation. Orchestrates one or more DAOs per operation.</div>
          <div><span className="text-foreground/60">DAO/</span>                    One class per entity. All SQL lives here. Returns model objects, not raw ResultSets.</div>
          <div><span className="text-foreground/60">models/</span>                 Plain Java objects. No behavior. Passed between all layers as the shared data contract.</div>
          <div><span className="text-foreground/60">security/</span>               Database connection pooling, session identity, and password hashing utilities.</div>
          <div><span className="text-foreground/60">services/helpers/</span>       Cross-cutting utilities shared across service classes (query builders, validation helpers).</div>
        </div>
      </section>

      {/* ── 03 DATA LAYER ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={4} title="Data Layer" id="datalayer" />

        <p className="text-muted-foreground">
          The DAO layer contains thirteen classes, one per domain entity. Each DAO encapsulates all SQL for its entity: reads, writes, updates, and any joins that are logically owned by that entity. Service classes compose multiple DAOs to execute multi-step operations, but they do not write SQL themselves.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-3">
            <div className={cardTitleFg}>Entity Model Map</div>
            <div className="bg-muted/10 rounded border border-border font-mono text-xs text-muted-foreground p-3 space-y-1 leading-relaxed">
              <div><span className="text-foreground/70">User, Student, Professor, Admin</span>  — identity and role hierarchy</div>
              <div><span className="text-foreground/70">Course, CourseOffering</span>           — course catalogue and scheduled instances</div>
              <div><span className="text-foreground/70">CourseCredit</span>                     — credit weighting per course</div>
              <div><span className="text-foreground/70">Prerequisite</span>                     — directed prerequisite edges between courses</div>
              <div><span className="text-foreground/70">Program, ProgramGoal</span>             — academic program structure and completion criteria</div>
              <div><span className="text-foreground/70">Schedule</span>                         — per-student time block assignments</div>
              <div><span className="text-foreground/70">Seat</span>                             — capacity and occupancy tracking per offering</div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The separation between <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">Course</span> and <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">CourseOffering</span> is an important modelling decision: a Course is a catalogue entry (code, name, credit weight, prerequisites), while a CourseOffering is a schedulable instance of that course in a specific term with a specific professor. This means prerequisite rules live on Course and don't need to be re-declared per offering.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>DAO Design Conventions</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All JDBC interactions use prepared statements rather than string-concatenated queries. This eliminates a class of SQL injection vulnerabilities at the data access boundary rather than relying on input sanitization upstream.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">DataManagementHelper.java</span> is a shared utility within the DAO layer that centralizes common query construction patterns, reducing duplication across the thirteen DAO classes. DAOs return typed model objects rather than exposing raw <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ResultSet</span> handles to callers, so the service layer never deals with JDBC types directly.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complex multi-table reads (such as fetching a student's full enrollment history with course details and credit totals) are handled through MySQL stored procedures called from the relevant DAO, keeping the query logic in one place rather than splitting it across multiple DAO calls in a service method.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>ColumnDataPair and the Searchable Interface</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ColumnDataPair.java</span> is a small utility model that pairs a column name with a value, used to build dynamic WHERE clauses without constructing raw SQL strings in calling code. This pattern makes it possible to express filter conditions programmatically while keeping the actual query construction inside the DAO.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">Searchable.java</span> is an interface implemented by entities that support filtered lookup, providing a consistent contract for DAOs that need to support search operations across different field combinations without exposing raw query strings to callers.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Service Layer Composition</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nine service classes sit between the servlet and DAO layers. Each service owns a specific domain of the application: enrollment, course management, program management, professor operations, student operations, user registration, user authorization, user management, and admin management. Services are the only place where multi-DAO coordination happens.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For example, <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">EnrollmentManagementServices</span> orchestrates calls to <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">PrerequisitesDAO</span>, <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">SeatDAO</span>, <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ScheduleDAO</span>, and <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">CourseOfferingDAO</span> in sequence. None of those DAOs is aware of the others, and the servlet that triggered the enrollment has no visibility into which DAOs were consulted.
            </p>
          </div>

        </div>
      </section>

      {/* ── 04 BUSINESS LOGIC ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={5} title="Business Logic" id="bizlogic" />

        <p className="text-muted-foreground">
          The three most complex business rules in the system are prerequisite enforcement, schedule conflict detection, and seat management. Each is implemented in the service layer rather than the servlet or database layer, which keeps them testable and composable without requiring a live HTTP context or a database trigger.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Prerequisite Enforcement</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prerequisites are modelled as directed edges between Course entities, stored through <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">PrerequisitesDAO</span>. When a student attempts to enroll in a course, <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">EnrollmentManagementServices</span> fetches all required predecessors for the target course and cross-references them against the student's completed enrollment history.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The check is designed to handle chains rather than just direct prerequisites: if Course C requires Course B, and Course B requires Course A, the student must have completed A and B before registering for C. This is resolved by traversing the prerequisite graph before validation, not by checking only one level deep.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Schedule Conflict Detection</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ScheduleDAO</span> retrieves the student's current set of booked time blocks. When a new offering is requested, its time block is compared against all existing schedule entries for overlap. An overlap is defined as any intersection between the requested interval and any existing interval, including cases where one block starts exactly when another ends.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conflict detection runs in the service layer so it can be applied consistently regardless of which servlet path triggered the enrollment. It cannot be bypassed by accessing a different route because the constraint lives above the HTTP boundary.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Seat Availability and Atomicity</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">SeatDAO</span> tracks the enrolled count and maximum capacity per <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">CourseOffering</span>. The seat check is performed as part of the enrollment validation sequence, after prerequisites are confirmed and before the schedule write occurs. If the offering is at capacity, the enrollment is rejected before any schedule row is inserted.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The seat count update and the schedule insert are intended to be executed as a single database transaction. This prevents a race condition where two students concurrently pass the seat check but both complete their schedule inserts, exceeding the course capacity.
            </p>
          </div>

        </div>

        {/* Admin business logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Teaching Load Tracking</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">AdminManagementServices</span> handles professor-to-offering assignment. When an administrator assigns a professor to a course offering, the service checks existing assignments for that professor in the same term against a configurable teaching load limit. Over-assignment is blocked at the service level before the assignment is persisted through <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ProfessorDAO</span>.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>User Lifecycle Management</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">UserRegistrationServices</span> and <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">UserManagementServices</span> handle separate concerns: registration deals with the invitation and approval flow, while management handles modifications and removals. The split keeps the registration path (which is partially unauthenticated) separate from the management path (which requires admin authorization), avoiding a common pattern where a single service class accumulates too many responsibilities.
            </p>
          </div>
        </div>
      </section>

      {/* ── 05 SECURITY & ACCESS CONTROL ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={6} title="Security & Access Control" id="security" />

        <p className="text-muted-foreground">
          The <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">security/</span> package contains three components that collectively handle authentication state, credential safety, and database access. Each addresses a distinct concern rather than bundling them into a single utility class.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>DatabaseConnection.java</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Centralizes JDBC connection management for the application. Rather than each DAO creating its own connection, all data access goes through a single managed connection point. This makes it straightforward to swap connection pooling strategies (for example, moving from a single connection to a pool) without touching any DAO code.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Database credentials are not hardcoded in source: they are read from configuration at startup, keeping sensitive values out of the repository.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>LoggedUserInformation.java</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Holds the identity and role of the currently authenticated user for the duration of a session. Servlets consult this object at the start of each request to determine whether the caller has permission to invoke the requested operation.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Role verification at the servlet boundary means that even if a student-role user constructs a direct HTTP request to an admin servlet path, the role check fails before any service or DAO code is reached. Business logic never needs to re-check authorization internally.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>PasswordHasher.java</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Handles credential hashing before any user password is persisted to the database. Plaintext passwords are never stored or logged. The hashing is applied in <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">UserRegistrationServices</span> before the <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">UserDAO</span> write, so the DAO layer receives only hashed values and has no dependency on the hashing implementation.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Authentication compares the hash of the submitted password against the stored hash, so the original credential is never reconstructed at any point in the request path.
            </p>
          </div>

        </div>

        <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2 mt-2">
          <div className={cardTitleFg}>Role Hierarchy and Servlet Gating</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The application has three roles with a partial hierarchy: Administrators can perform all student and professor operations in addition to their own. Professors have read access to their assigned courses and rosters. Students have write access only to their own enrollment and schedule. This is enforced at the servlet boundary: <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">AdminPanel.java</span> and <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">AdminManagement.java</span> check for the Admin role before any downstream call; the student-facing servlets check for the Student role equivalently. There is no shared route that serves different content based on role; each role has its own servlet path, which makes the access boundaries explicit and auditable.
          </p>
        </div>
      </section>

      {/* ── 06 TECHNICAL STACK ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={7} title="Technical Stack" id="stack" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Servlet Layer</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Java Servlets handle HTTP routing: each servlet maps to a specific domain action (login, enrollment, admin management) rather than using a generic dispatcher, keeping routing explicit and each endpoint's authorization requirements auditable. Servlets are the only layer that handles HTTP concerns; they delegate to service classes for all business logic and do not touch JDBC directly.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Database</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                MySQL serves as the relational database. All reads and writes use JDBC with prepared statements, eliminating a class of SQL injection vulnerabilities at the data access boundary. Complex multi-table operations (enrollment history joins, program completion queries) are implemented as stored procedures called from the relevant DAO, keeping that SQL co-located with the rest of the entity's data access code.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Build & Tooling</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Maven manages dependencies and the build lifecycle. The Maven wrapper (<span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">mvnw</span>) is committed to the repository so the project builds without a system Maven installation. The <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">pom.xml</span> defines the servlet container integration and third-party dependencies for JDBC, password hashing, and testing.
              </p>
            </div>

          </div>

          <div className="space-y-3">

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Package Structure</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The application is organized under <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">com.example.studentenrollmentsystem</span> with five sub-packages: DAO, Interfaces, models, security, and services. Servlets live in a separate <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">servlets/</span> package organized by role (AdminPages, shared login). The package layout mirrors the architectural layering directly, so the structure communicates design intent without requiring separate documentation.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Extensibility Points</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Adding a new entity (for example, an attendance record) requires a new model, a new DAO, and additions to the relevant service class, without touching any servlet. Swapping MySQL for a different JDBC-compatible database would require only changes to <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">DatabaseConnection.java</span> and any stored procedure definitions. Exposing the service tier as a REST API would require adding a JSON serialization step in the servlet layer without restructuring any service or DAO code.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Connection Management</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">DatabaseConnection.java</span> centralizes JDBC connection management so no individual DAO creates its own connection. At present this uses a single managed connection rather than a pool. Under concurrent load this may become a bottleneck, and migrating to a connection pool (HikariCP being the standard choice for servlet-based Java applications) would be the natural next step without requiring changes to any DAO.
              </p>
            </div>

          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="mb-2 text-left text-sm font-semibold text-foreground">What went well</h3>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
              <li>Structured fourteen DAOs so every query lives in the data layer. Nothing leaks into services or servlets.</li>
              <li>Centralized enrollment rules (prerequisites, seats, schedule conflicts) in the service tier before commits.</li>
              <li>Enforced roles at the servlet edge so downstream layers stay focused on domain logic.</li>
              <li>Modeled Course vs CourseOffering so prerequisite rules live once in the catalogue, not per offering.</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-left text-sm font-semibold text-foreground">Future improvements</h3>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
              <li>I&apos;d introduce a front controller or a small MVC layer if the route surface keeps growing. Less servlet boilerplate.</li>
              <li>Next hardening step: swap the single JDBC connection for a pool (e.g. HikariCP) before expecting real concurrency.</li>
              <li>Want to add unit tests around the validation-heavy service methods. They&apos;re a natural fit for JUnit.</li>
              <li>Would pair stored procedures with Flyway/Liquibase-style migrations for safer schema evolution.</li>
              <li>If this became a JSON API, I&apos;d standardize error payloads and versioning before external clients depend on it.</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
    </WorkReportShell>
  );
}