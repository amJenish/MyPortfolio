import type { ReactNode } from "react";
import { useState } from "react";
import { C } from "@/lib/theme";
import { WorkSectionLabel } from "../_shared";
import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

const TEAL = C.teal;
const ORANGE = C.amber;
const AMBER = C.amber;
const PURPLE = C.teal;
const ROSE = C.red;
const MUTED = C.textDim;

function PipelineNode({ accent, children, wide }: { accent: string; children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={`shrink-0 whitespace-nowrap rounded-lg border border-transparent font-mono text-xs font-medium ${wide ? "px-4 py-2.5" : "px-3 py-2"}`}
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

function PipelineArrow({ down }: { down?: boolean }) {
  return (
    <span className="shrink-0 select-none font-mono text-sm text-muted-foreground" aria-hidden>
      {down ? "↓" : "→"}
    </span>
  );
}

function ServiceBadge({ name, lang, accent }: { name: string; lang: string; accent: string }) {
  return (
    <div
      className="rounded-lg border p-3 space-y-1"
      style={{
        backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`,
        borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
      }}
    >
      <div className="text-left font-mono text-xs font-semibold" style={{ color: accent }}>{name}</div>
      <div className="text-left font-mono text-xs text-muted-foreground">{lang}</div>
    </div>
  );
}

const cardTitleFg     = "text-xs font-mono font-semibold text-foreground";
const cardTitleAccent = "text-xs font-mono font-medium text-accent";

const SERVICES = ["AccountService", "ImageUploadService", "ImageVerificationService", "MetadataExtractionService", "PostService"] as const;
type ServiceKey = (typeof SERVICES)[number];

const serviceDetails: Record<ServiceKey, {
  accent: string;
  lang: string;
  port: string;
  responsibility: string;
  internals: string;
  noteworthy: string;
}> = {
  AccountService: {
    accent: TEAL,
    lang: "Java · Spring Boot",
    port: "Independent HTTP service",
    responsibility: "Handles user registration and login. Manages the User entity, validates credentials against a MySQL database, and returns a session token on successful authentication. All other services treat the token as the caller's identity.",
    internals: "Structured around a Controller / Service / Repository split. LoginRequest and SignupRequest are dedicated DTO classes so raw HTTP body fields never reach the service layer directly. PasswordHasher hashes credentials before any database write, so plaintext values are never stored. UserRepo extends a Spring Data interface, keeping the service layer free of JDBC concerns.",
    noteworthy: "CorsConfig is declared per-service rather than at a gateway level, which was necessary given the APIGateway was not operational. Each service independently permits the expected origin headers.",
  },
  ImageUploadService: {
    accent: ORANGE,
    lang: "Java · Spring Boot",
    port: "Independent HTTP service",
    responsibility: "Accepts image file uploads and writes them to IBM Cloud Object Storage, returning a stable reference URL that other services use to access the image. It is the only service with credentials for the cloud storage bucket.",
    internals: "The ObjectStorage sub-package separates three concerns: CloudUploader handles the actual IBM COS SDK calls, ObjectKeyGenerator produces a deterministic and unique key per upload (avoiding collisions in the bucket), and SecretInfo loads credentials from a separate secretinfo.properties file that is not committed to source control. UploadFailureException is a typed exception that the controller layer maps to an appropriate HTTP error response.",
    noteworthy: "Externalizing credentials to secretinfo.properties rather than application.properties means the main config file can be committed safely. The ObjectKeyGenerator ensures no two uploads collide even under concurrent requests, which would silently overwrite objects in the bucket.",
  },
  ImageVerificationService: {
    accent: PURPLE,
    lang: "Python · FastAPI / Flask",
    port: "Independent HTTP service",
    responsibility: "Validates the content of an uploaded image by calling the Roboflow API. Returns a pass or fail verdict that PostService uses to decide whether to proceed with post creation. This is the only Python service in the system.",
    internals: "Implemented as a lightweight Python HTTP service defined in main.py, with dependencies declared in requirements.txt and the runtime pinned in runtime.txt. The service downloads the image from the IBM COS URL, forwards it to the Roboflow model endpoint, parses the inference response, and returns a structured verdict. The temp directory is used for transient image files during processing.",
    noteworthy: "Writing this service in Python rather than Java was a deliberate choice: Roboflow's Python SDK and the broader ML ecosystem have significantly better library support in Python. Keeping it as a separate service means the ML runtime has no dependency on the JVM, and it can be scaled or swapped independently of the Java services.",
  },
  MetadataExtractionService: {
    accent: AMBER,
    lang: "Java · Spring Boot",
    port: "Independent HTTP service",
    responsibility: "Extracts structured location and timestamp data from image EXIF metadata. Returns a Location object with GPS coordinates and a capture timestamp that PostService uses when constructing the post record.",
    internals: "MetaDataExtracter performs the raw EXIF parsing and populates a Location model. Two typed exceptions handle the two ways extraction can fail: MissingGeoMetadataException is thrown when an image has no embedded GPS coordinates, and MissingDateMetadaException is thrown when the capture timestamp is absent. Both bubble up to the controller layer, which maps them to appropriate HTTP error responses rather than returning a generic 500.",
    noteworthy: "Typed exceptions per failure mode, rather than a single generic extraction failure, give PostService the ability to handle missing location and missing timestamp as distinct cases. An image with no GPS data could still be partially processed, whereas the current behaviour rejects it entirely.",
  },
  PostService: {
    accent: ROSE,
    lang: "Java · Spring Boot",
    port: "Orchestrator service",
    responsibility: "Orchestrates the full post creation flow: it calls ImageUploadService, ImageVerificationService, MetadataExtractionService, and persists the resulting Post entity to MySQL. It also serves the aggregated location data that the heatmap visualization consumes.",
    internals: "RestClientConfig configures the HTTP client used to make inter-service calls. PostDto and LocationDto decouple the internal Post entity from what is returned to callers. PostRepo extends Spring Data JPA for persistence. The service layer holds the orchestration logic: it sequences the upstream service calls, handles their responses, and decides whether to abort or continue post creation based on verification and extraction results.",
    noteworthy: "PostService is the only service that depends on other services at runtime, making it the integration point for the system. This means its failure modes are a superset of all the services it calls. A failure in any upstream service propagates to PostService, and without a circuit breaker or retry policy, a slow or unavailable ImageVerificationService would cause post creation to hang indefinitely.",
  },
};

export const workPageSections = [
  { id: "summary",      label: "Overview" },
  { id: "built",        label: "1. System Capabilities" },
  { id: "topology",     label: "2. Service Topology" },
  { id: "flow",         label: "3. Post Creation Flow" },
  { id: "services",     label: "4. Service Deep Dives" },
  { id: "choices",      label: "5. Engineering Decisions" },
  { id: "stack",        label: "6. Technical Stack" },
] as const;

export default function GeeseMapPage(props: WorkPageProps) {
  const [activeService, setActiveService] = useState<ServiceKey>("PostService");
  const detail = serviceDetails[activeService];

  return (
    <WorkReportShell {...props}>
    <div className="theme-body work-report-body mx-auto max-w-[min(100%,80rem)] space-y-10 px-4 pb-16 text-sm sm:px-6 sm:text-base">

      <section className="scroll-mt-28 space-y-4">
        <WorkSectionLabel number={1} title="Overview" id="summary" />
        <p className="text-report-body">
          A microservices-based backend that powers a location-aware social heatmap. Users upload photos taken at a location; the system verifies the image content, extracts GPS and timestamp metadata from EXIF data, and aggregates the resulting post records into a heatmap dataset. Each of these concerns is handled by a dedicated service, with PostService acting as the orchestrator that sequences the upstream calls and persists the final record.
        </p>
        <p className="text-report-body">
          The system comprises six deployable units: five domain services (AccountService, ImageUploadService, ImageVerificationService, MetadataExtractionService, PostService) and a ServiceRegistry for service discovery. A sixth unit, APIGateway, was scaffolded but is not operational. Each service has its own Dockerfile and Spring Boot application context, communicates over HTTP, and is independently deployable. ImageVerificationService is written in Python to take advantage of the Roboflow ML ecosystem; the remaining services are Java and Spring Boot.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
          <li>Five independently deployable services, each owning a single domain responsibility.</li>
          <li>ImageVerificationService uses the Roboflow API to validate image content before a post is accepted.</li>
          <li>MetadataExtractionService reads EXIF GPS and timestamp data from uploaded images, producing the location signal for the heatmap.</li>
          <li>IBM Cloud Object Storage is used for image persistence; ImageUploadService is the only service with bucket credentials.</li>
          <li>PostService orchestrates the full post creation pipeline via inter-service HTTP calls configured through RestClientConfig.</li>
          <li>ServiceRegistry (Eureka) provides service discovery; the non-operational APIGateway was intended as the unified entry point.</li>
        </ul>
        <p className="border-l-2 border-primary/50 pl-4 text-left leading-[1.6] text-muted-foreground">
          A single-service backend for this system would couple image storage, ML verification, metadata extraction, and post persistence into one deployment. How should these concerns be separated so that each can be developed, scaled, and replaced independently, without turning the orchestration layer into a tangle of cross-cutting logic?
        </p>
      </section>

      {/* ── 02 SYSTEM CAPABILITIES ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={2} title="System Capabilities" id="built" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>User Authentication</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AccountService handles registration and login. Passwords are hashed before storage. Successful login returns an auth token that gates access to post creation and other write operations downstream.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Image Ingestion & Storage</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ImageUploadService accepts image uploads and writes them to IBM Cloud Object Storage, returning a stable URL. Credentials are isolated to this service; no other service has direct bucket access.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>ML Content Verification</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ImageVerificationService (Python) calls the Roboflow inference API against the uploaded image and returns a verdict. PostService uses this verdict to decide whether to proceed or reject the post, preventing unrelated content from entering the heatmap.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>EXIF Metadata Extraction</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MetadataExtractionService parses EXIF data from the image to extract GPS coordinates and capture timestamp. Typed exceptions distinguish between a missing location and a missing timestamp, giving the caller control over how each failure case is handled.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Post Orchestration</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              PostService sequences calls to all upstream services, assembles the post record from their responses, and persists it to MySQL. It also serves the aggregated location dataset that the heatmap visualization queries.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Service Discovery</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ServiceRegistry (Spring Cloud Eureka) provides service registration and discovery. Each Spring Boot service registers with the registry on startup, enabling location-transparent inter-service communication without hardcoded addresses.
            </p>
          </div>

        </div>
      </section>

      {/* ── 02 SERVICE TOPOLOGY ── */}
      <section className="space-y-6">
        <WorkSectionLabel number={2} title="Service Topology" id="topology" />

        <p className="text-muted-foreground">
          The system is organized as six deployable units. The APIGateway was intended to be the single entry point for all inbound traffic, routing requests to the appropriate service and handling cross-cutting concerns like authentication and rate limiting at the boundary. It was scaffolded but is not currently operational, so services accept direct HTTP requests and manage their own CORS configuration independently.
        </p>

        {/* Topology diagram */}
        <div className="border border-border rounded-lg bg-card/30 p-5 space-y-5">
          <div className="text-report-label">Service topology</div>

          {/* Top row: client and gateway */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <PipelineNode accent={MUTED}>Client</PipelineNode>
              <PipelineArrow />
              <div
                className="shrink-0 whitespace-nowrap rounded-lg border px-3 py-2 font-mono text-xs font-medium line-through opacity-40"
                style={{ borderColor: `color-mix(in srgb, ${MUTED} 40%, transparent)`, color: MUTED }}
              >
                APIGateway (not operational)
              </div>
              <PipelineArrow />
              <PipelineNode accent={TEAL}>ServiceRegistry (Eureka)</PipelineNode>
            </div>

            <PipelineArrow down />

            {/* Service row */}
            <div className="flex flex-wrap justify-center gap-3 w-full">
              <PipelineNode accent={TEAL}>AccountService</PipelineNode>
              <PipelineNode accent={ORANGE}>ImageUploadService</PipelineNode>
              <PipelineNode accent={PURPLE}>ImageVerificationService</PipelineNode>
              <PipelineNode accent={AMBER}>MetadataExtractionService</PipelineNode>
              <PipelineNode accent={ROSE} wide>PostService (Orchestrator)</PipelineNode>
            </div>

            <PipelineArrow down />

            {/* Data stores */}
            <div className="flex flex-wrap justify-center gap-3">
              <PipelineNode accent={MUTED}>MySQL (AccountService)</PipelineNode>
              <PipelineNode accent={MUTED}>IBM Cloud Object Storage</PipelineNode>
              <PipelineNode accent={MUTED}>Roboflow API</PipelineNode>
              <PipelineNode accent={MUTED}>MySQL (PostService)</PipelineNode>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            The strikethrough APIGateway was scaffolded but is not operational. Direct service-to-service calls currently bypass it. ServiceRegistry provides Eureka-based discovery so services resolve each other by name rather than hardcoded address.
          </p>
        </div>

        {/* Service ownership summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ServiceBadge name="AccountService"             lang="Java · Spring Boot · MySQL"          accent={TEAL}   />
          <ServiceBadge name="ImageUploadService"         lang="Java · Spring Boot · IBM COS"        accent={ORANGE} />
          <ServiceBadge name="ImageVerificationService"   lang="Python · Roboflow API"               accent={PURPLE} />
          <ServiceBadge name="MetadataExtractionService"  lang="Java · Spring Boot · EXIF"           accent={AMBER}  />
          <ServiceBadge name="PostService"                lang="Java · Spring Boot · MySQL"          accent={ROSE}   />
          <ServiceBadge name="ServiceRegistry"            lang="Java · Spring Cloud Eureka"          accent={MUTED}  />
        </div>

        {/* Inter-service communication */}
        <div className="bg-muted/10 p-4 rounded border border-border font-mono text-xs text-muted-foreground leading-relaxed space-y-1">
          <div className="mb-2 text-left text-xs font-medium text-muted-foreground">Inter-service call map</div>
          <div><span style={{ color: ROSE }}>PostService</span>  →  <span style={{ color: ORANGE }}>ImageUploadService</span>      (upload image, receive COS URL)</div>
          <div><span style={{ color: ROSE }}>PostService</span>  →  <span style={{ color: PURPLE }}>ImageVerificationService</span>  (verify image content via Roboflow)</div>
          <div><span style={{ color: ROSE }}>PostService</span>  →  <span style={{ color: AMBER }}>MetadataExtractionService</span>  (extract GPS + timestamp from EXIF)</div>
          <div><span style={{ color: TEAL }}>AccountService</span>  — no upstream service dependencies</div>
          <div><span style={{ color: ORANGE }}>ImageUploadService</span>  — no upstream service dependencies</div>
          <div><span style={{ color: PURPLE }}>ImageVerificationService</span>  — no upstream service dependencies</div>
          <div><span style={{ color: AMBER }}>MetadataExtractionService</span>  — no upstream service dependencies</div>
        </div>
      </section>

      {/* ── 03 POST CREATION FLOW ── */}
      <section className="space-y-6">
        <WorkSectionLabel number={4} title="Post Creation Flow" id="flow" />

        <p className="text-muted-foreground">
          Creating a post is the central operation of the system and the only flow that involves all five services. PostService is the sole orchestrator: it receives the initial request, sequences the upstream calls, and decides at each step whether to proceed or abort. The flow is sequential rather than parallel, meaning a failure at any stage short-circuits the remainder.
        </p>

        {/* Full post creation pipeline */}
        <div className="border border-border rounded-lg bg-card/30 p-5 space-y-4">
          <div className="text-report-label">Post creation pipeline</div>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="font-mono text-xs text-muted-foreground mt-2.5 w-6 shrink-0 text-left">①</div>
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <PipelineNode accent={MUTED}>Client POST /posts</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={ROSE}>PostService</PipelineNode>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="font-mono text-xs text-muted-foreground mt-2.5 w-6 shrink-0 text-left">②</div>
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <PipelineNode accent={ROSE}>PostService</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={ORANGE}>ImageUploadService</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={MUTED}>IBM COS</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={ORANGE}>COS URL returned</PipelineNode>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="font-mono text-xs text-muted-foreground mt-2.5 w-6 shrink-0 text-left">③</div>
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <PipelineNode accent={ROSE}>PostService</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={PURPLE}>ImageVerificationService</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={MUTED}>Roboflow API</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={PURPLE}>Pass / Fail verdict</PipelineNode>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex items-start gap-3">
              <div className="font-mono text-xs text-muted-foreground mt-2.5 w-6 shrink-0 text-left">④</div>
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <PipelineNode accent={ROSE}>PostService</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={AMBER}>MetadataExtractionService</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={AMBER}>GPS + Timestamp</PipelineNode>
              </div>
            </div>
            {/* Step 5 */}
            <div className="flex items-start gap-3">
              <div className="font-mono text-xs text-muted-foreground mt-2.5 w-6 shrink-0 text-left">⑤</div>
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <PipelineNode accent={ROSE}>PostService assembles Post entity</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={MUTED}>MySQL</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={ROSE}>PostDto returned to client</PipelineNode>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed pt-2">
            Steps ②–④ are sequential. If ImageVerificationService returns a fail verdict at step ③, PostService aborts without calling MetadataExtractionService or writing to MySQL. The image uploaded to COS in step ② persists regardless of whether the post is ultimately created.
          </p>
        </div>

        {/* Heatmap query flow */}
        <div className="border border-border rounded-lg bg-card/30 p-5 space-y-3">
          <div className="text-report-label">Heatmap data query flow</div>
          <div className="flex flex-wrap items-center gap-2.5">
            <PipelineNode accent={MUTED}>Client GET /posts/heatmap</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent={ROSE}>PostService</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent={MUTED}>MySQL (location aggregation query)</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent={ROSE}>List&lt;LocationDto&gt;</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent={MUTED}>Client renders heatmap</PipelineNode>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            The heatmap query is entirely within PostService. No upstream service calls are needed since all location data was extracted and stored at post creation time.
          </p>
        </div>
      </section>

      {/* ── 04 SERVICE DEEP DIVES ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={5} title="Service Deep Dives" id="services" />

        <p className="text-muted-foreground">
          Each service is a self-contained Spring Boot (or Python) application with its own application context, database connection if needed, and Dockerfile. Selecting a service below shows its internal structure and the reasoning behind its design.
        </p>

        {/* Service selector */}
        <div className="flex flex-wrap gap-2 mb-2">
          {SERVICES.map((s) => {
            const acc = serviceDetails[s].accent;
            const isActive = activeService === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setActiveService(s)}
                className="font-mono text-xs px-3 py-1.5 rounded-md border transition-all"
                style={{
                  background: isActive ? `color-mix(in srgb, ${acc} 18%, transparent)` : "transparent",
                  borderColor: isActive ? `color-mix(in srgb, ${acc} 60%, transparent)` : "var(--border)",
                  color: isActive ? acc : "var(--muted-foreground)",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Service detail card */}
        <div
          className="border rounded-lg p-5 space-y-4"
          style={{ borderColor: `color-mix(in srgb, ${detail.accent} 35%, transparent)`, background: `color-mix(in srgb, ${detail.accent} 5%, transparent)` }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="mb-1 text-left font-mono text-xs font-medium text-muted-foreground">{detail.port}</div>
              <h3 className="font-mono text-base font-semibold" style={{ color: detail.accent }}>{activeService}</h3>
            </div>
            <div className="font-mono text-xs px-3 py-1.5 rounded border"
              style={{ borderColor: `color-mix(in srgb, ${detail.accent} 40%, transparent)`, color: detail.accent, background: `color-mix(in srgb, ${detail.accent} 10%, transparent)` }}>
              {detail.lang}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className={cardTitleFg}>Responsibility</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{detail.responsibility}</p>
            </div>
            <div className="space-y-1">
              <div className={cardTitleFg}>Internal Structure</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{detail.internals}</p>
            </div>
            <div className="space-y-1">
              <div className={cardTitleFg}>Notable Design Points</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{detail.noteworthy}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 ENGINEERING DECISIONS ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={6} title="Engineering Decisions" id="choices" />

        <p className="text-muted-foreground">
          Several architectural decisions shaped how the system was structured. Each one had a concrete alternative and a reason for the choice made.
        </p>

        <div className="space-y-3">

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Why Microservices Rather Than a Monolith</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A monolithic Spring Boot application could have handled all five domains in a single deployment. The reason for separating them is that each domain has a different runtime profile: ImageVerificationService is a Python process that calls an external ML API, ImageUploadService is I/O-bound on a cloud storage upload, and AccountService is a straightforward database read/write. Coupling them into one process would mean they share a single thread pool and JVM heap, making it harder to tune any one of them without affecting the others.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The more immediate practical benefit was team separation: ImageVerificationService could be developed and deployed independently by whoever was working on the ML integration without requiring a full backend rebuild.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Python for ImageVerificationService</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All other services are Java and Spring Boot. ImageVerificationService is Python. This was a deliberate choice based on the Roboflow ecosystem: the Roboflow Python SDK is more mature and better documented than any JVM equivalent, and the broader ML tooling (image preprocessing, inference client libraries) has significantly better Python support. Writing it in Java would have required more boilerplate for the same outcome.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Keeping it as a separate HTTP service means the Python runtime is completely isolated from the JVM services. The contract between PostService and ImageVerificationService is just an HTTP request and a structured JSON response; neither side needs to know what language the other is written in.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>PostService as the Sole Orchestrator</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An alternative design would have the client call each service directly in sequence: first ImageUploadService, then ImageVerificationService, then MetadataExtractionService, and finally PostService. This distributes the orchestration logic to the client and removes the need for inter-service HTTP calls in the backend.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Centralizing orchestration in PostService keeps the validation and sequencing logic server-side where it can be enforced consistently. A client-side orchestration pattern would allow a malicious or buggy client to skip the verification step and create posts with unverified images. With PostService as the orchestrator, the sequence is enforced regardless of how the request originates.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>IBM Cloud Object Storage for Image Persistence</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Storing images as blobs in MySQL was the simpler alternative. IBM COS was chosen because object storage is a more appropriate fit for binary file data: it avoids inflating the database with large binary columns, produces a stable URL per object that any service can reference without a database query, and separates the lifecycle of the image file from the lifecycle of the post record.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              One consequence of this choice is that when a post creation fails after the upload step, the uploaded image remains in the bucket with no associated post record. A cleanup mechanism (a scheduled job or a delete call on failure) would be needed to prevent orphaned objects accumulating in the bucket.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>The APIGateway Gap</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The APIGateway was scaffolded as a Spring Cloud Gateway application and registered with the ServiceRegistry, but was not brought to an operational state. In its absence, each service independently declares its own <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">CorsConfig</span>, and clients address services directly rather than through a unified entry point.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A functional gateway would centralize authentication token validation, CORS policy, and request routing in one place. Without it, any cross-cutting enforcement that should logically belong at the boundary (rate limiting, auth header validation) needs to be duplicated per service or omitted entirely. This is the most significant architectural gap in the current system.
            </p>
          </div>

        </div>
      </section>

      {/* ── 06 TECHNICAL STACK ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={7} title="Technical Stack" id="stack" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Java Services (×4)</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AccountService, ImageUploadService, MetadataExtractionService, and PostService are all Spring Boot applications. Each follows the same internal layering: Controller receives HTTP, Service holds business logic, Repository extends Spring Data JPA for MySQL access (where applicable). DTOs decouple the HTTP contract from the internal entity model. Each service has its own <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">application.properties</span> and registers with ServiceRegistry on startup.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Python Service (×1)</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ImageVerificationService is a Python HTTP service defined in <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">main.py</span>. The runtime is pinned via <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">runtime.txt</span> and dependencies declared in <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">requirements.txt</span>. It does not use Spring or any JVM tooling; its contract with PostService is a plain HTTP request and a JSON response.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Service Discovery</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Spring Cloud Netflix Eureka provides the ServiceRegistry. Each Spring Boot service registers its host and port on startup. RestClientConfig in PostService uses the registry to resolve service addresses by name, avoiding hardcoded URLs in inter-service call configuration.
              </p>
            </div>

          </div>

          <div className="space-y-3">

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Persistence</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AccountService and PostService each maintain their own MySQL database. There is no shared database between services; PostService has no visibility into the user table, and AccountService has no visibility into the post table. IBM Cloud Object Storage handles binary image data, keeping binary content out of the relational databases entirely.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>External APIs</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Two external APIs are integrated. The Roboflow API is called by ImageVerificationService to run inference on uploaded images. The IBM Cloud Object Storage API (via the IBM COS SDK) is called by ImageUploadService to write and retrieve image objects. Both integrations are isolated to their respective services.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Containerization</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every service has a <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">Dockerfile</span> at its root. Each Java service uses the Maven wrapper so the image build does not depend on a system Maven installation. Services can be built and run independently without a shared compose file, though a Docker Compose configuration would be the natural next step for local multi-service startup.
              </p>
            </div>

          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="mb-2 text-left text-sm font-semibold text-foreground">What went well</h3>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
              <li>I kept each service&apos;s responsibility genuinely narrow: no service touches another&apos;s database, and the only orchestration logic lives in PostService where it belongs.</li>
              <li>I isolated IBM COS credentials to ImageUploadService, meaning a credential leak in any other service cannot expose the storage bucket.</li>
              <li>I chose Python for ImageVerificationService based on ecosystem fit rather than language consistency, and structured it as a separate HTTP service so the runtime isolation is clean.</li>
              <li>I used typed exceptions in MetadataExtractionService (MissingGeoMetadataException vs MissingDateMetadaException) so the orchestrator can distinguish failure modes rather than catching a generic error.</li>
              <li>I separated secrets into secretinfo.properties in ImageUploadService so the main application config can be committed to source control safely.</li>
              <li>I registered services with Eureka so PostService resolves addresses by name through RestClientConfig rather than using hardcoded URLs.</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-left text-sm font-semibold text-foreground">Future improvements</h3>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground leading-[1.6]">
              <li>I would complete the APIGateway so that auth validation, CORS policy, and routing are enforced at the boundary rather than duplicated across every service&apos;s CorsConfig.</li>
              <li>I would add a circuit breaker (Resilience4j) around PostService&apos;s upstream calls so a slow or unavailable ImageVerificationService does not cause post creation to hang indefinitely.</li>
              <li>I would add a cleanup mechanism for orphaned COS objects when post creation fails after the upload step but before the database write.</li>
              <li>I would introduce a Docker Compose file so the full service mesh can be started and torn down in a single command for local development and integration testing.</li>
              <li>I would add integration tests that spin up real service instances and exercise the full post creation pipeline end to end, rather than relying solely on unit-level coverage.</li>
              <li>I would version the inter-service HTTP contracts so a breaking change in ImageVerificationService&apos;s response schema does not silently corrupt PostService&apos;s parsing logic.</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
    </WorkReportShell>
  );
}