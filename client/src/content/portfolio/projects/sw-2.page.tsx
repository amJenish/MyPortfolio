import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Github, Play } from "lucide-react";
import {
  Body,
  Code,
  CatalogTagPills,
  FONT_MONO as MONO,
  FONT_SANS as SANS,
  Notice,
  SectionLabel,
  TwoCol,
} from "../reportPrimitives";
import type { WorkPageProps } from "@/content/portfolio/workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

// ── TYPES ──────────────────────────────────────────────────────────────────────

type ServiceKey = "AccountService" | "ImageUploadService" | "ImageVerificationService" | "MetadataExtractionService" | "PostService";

const SERVICES: ServiceKey[] = ["AccountService", "ImageUploadService", "ImageVerificationService", "MetadataExtractionService", "PostService"];

type ServiceDetail = {
  accent: string;
  lang: string;
  port: string;
  responsibility: string;
  internals: string;
  noteworthy: string;
};

// ── COLORS (Standard palette) ──────────────────────────────────────────────────

const COLORS = {
  teal: "var(--primary)",
  orange: "rgb(245, 158, 11)",
  purple: "rgb(139, 92, 246)",
  amber: "rgb(245, 158, 11)",
  rose: "rgb(239, 68, 68)",
  muted: "var(--muted-foreground)",
};

const serviceDetails: Record<ServiceKey, ServiceDetail> = {
  AccountService: {
    accent: COLORS.teal,
    lang: "Java · Spring Boot",
    port: "Independent HTTP service",
    responsibility: "Handles user registration and login. Manages the User entity, validates credentials against a MySQL database, and returns a session token on successful authentication. All other services treat the token as the caller's identity.",
    internals: "Structured around a Controller / Service / Repository split. LoginRequest and SignupRequest are dedicated DTO classes so raw HTTP body fields never reach the service layer directly. PasswordHasher hashes credentials before any database write, so plaintext values are never stored. UserRepo extends a Spring Data interface, keeping the service layer free of JDBC concerns.",
    noteworthy: "CorsConfig is declared per-service rather than at a gateway level, which was necessary given the APIGateway was not operational. Each service independently permits the expected origin headers.",
  },
  ImageUploadService: {
    accent: COLORS.orange,
    lang: "Java · Spring Boot",
    port: "Independent HTTP service",
    responsibility: "Accepts image file uploads and writes them to IBM Cloud Object Storage, returning a stable reference URL that other services use to access the image. It is the only service with credentials for the cloud storage bucket.",
    internals: "The ObjectStorage sub-package separates three concerns: CloudUploader handles the actual IBM COS SDK calls, ObjectKeyGenerator produces a deterministic and unique key per upload (avoiding collisions in the bucket), and SecretInfo loads credentials from a separate secretinfo.properties file that is not committed to source control. UploadFailureException is a typed exception that the controller layer maps to an appropriate HTTP error response.",
    noteworthy: "Externalizing credentials to secretinfo.properties rather than application.properties means the main config file can be committed safely. The ObjectKeyGenerator ensures no two uploads collide even under concurrent requests, which would silently overwrite objects in the bucket.",
  },
  ImageVerificationService: {
    accent: COLORS.purple,
    lang: "Python · FastAPI / Flask",
    port: "Independent HTTP service",
    responsibility: "Validates the content of an uploaded image by calling the Roboflow API. Returns a pass or fail verdict that PostService uses to decide whether to proceed with post creation. This is the only Python service in the system.",
    internals: "Implemented as a lightweight Python HTTP service defined in main.py, with dependencies declared in requirements.txt and the runtime pinned in runtime.txt. The service downloads the image from the IBM COS URL, forwards it to the Roboflow model endpoint, parses the inference response, and returns a structured verdict. The temp directory is used for transient image files during processing.",
    noteworthy: "Writing this service in Python rather than Java was a deliberate choice: Roboflow's Python SDK and the broader ML ecosystem have significantly better library support in Python. Keeping it as a separate service means the ML runtime has no dependency on the JVM, and it can be scaled or swapped independently of the Java services.",
  },
  MetadataExtractionService: {
    accent: COLORS.amber,
    lang: "Java · Spring Boot",
    port: "Independent HTTP service",
    responsibility: "Extracts structured location and timestamp data from image EXIF metadata. Returns a Location object with GPS coordinates and a capture timestamp that PostService uses when constructing the post record.",
    internals: "MetaDataExtracter performs the raw EXIF parsing and populates a Location model. Two typed exceptions handle the two ways extraction can fail: MissingGeoMetadataException is thrown when an image has no embedded GPS coordinates, and MissingDateMetadaException is thrown when the capture timestamp is absent. Both bubble up to the controller layer, which maps them to appropriate HTTP error responses rather than returning a generic 500.",
    noteworthy: "Typed exceptions per failure mode, rather than a single generic extraction failure, give PostService the ability to handle missing location and missing timestamp as distinct cases. An image with no GPS data could still be partially processed, whereas the current behaviour rejects it entirely.",
  },
  PostService: {
    accent: COLORS.rose,
    lang: "Java · Spring Boot",
    port: "Orchestrator service",
    responsibility: "Orchestrates the full post creation flow: it calls ImageUploadService, ImageVerificationService, MetadataExtractionService, and persists the resulting Post entity to MySQL. It also serves the aggregated location data that the heatmap visualization consumes.",
    internals: "RestClientConfig configures the HTTP client used to make inter-service calls. PostDto and LocationDto decouple the internal Post entity from what is returned to callers. PostRepo extends Spring Data JPA for persistence. The service layer holds the orchestration logic: it sequences the upstream service calls, handles their responses, and decides whether to abort or continue post creation based on verification and extraction results.",
    noteworthy: "PostService is the only service that depends on other services at runtime, making it the integration point for the system. This means its failure modes are a superset of all the services it calls. A failure in any upstream service propagates to PostService, and without a circuit breaker or retry policy, a slow or unavailable ImageVerificationService would cause post creation to hang indefinitely.",
  },
};

export const workPageSections = [
  { id: "summary", label: "Overview" },
  { id: "built", label: "System Capabilities" },
  { id: "topology", label: "Service Topology" },
  { id: "flow", label: "Post Creation Flow" },
  { id: "services", label: "Service Deep Dives" },
  { id: "choices", label: "Engineering Decisions" },
  { id: "stack", label: "Technical Stack" },
] as const;

// ── COMPONENTS ──────────────────────────────────────────────────────────────────

function PipelineNode({ accent, children, wide }: { accent: string; children: ReactNode; wide?: boolean }) {
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 12,
        fontWeight: 500,
        padding: wide ? "10px 16px" : "8px 12px",
        borderRadius: "var(--radius-md)",
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

function PipelineArrow({ down }: { down?: boolean }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: 14, color: "var(--muted-foreground)", userSelect: "none" }} aria-hidden>
      {down ? "↓" : "→"}
    </span>
  );
}

function ServiceBadge({ name, lang, accent }: { name: string; lang: string; accent: string }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: "var(--radius-md)",
        border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`,
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: accent, marginBottom: 4 }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted-foreground)" }}>{lang}</div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function GeeseMapPage(props: WorkPageProps) {
  const [activeService, setActiveService] = useState<ServiceKey>("PostService");
  const detail = serviceDetails[activeService];
  const reduceMotion = useReducedMotion();

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
              Geese Map<br />
              <span style={{ color: "var(--primary)" }}>A location-aware social heatmap</span>
            </h1>

            <Body style={{ maxWidth: 1280, marginBottom: 12, color: "var(--foreground)" }}>
              A microservices-based backend that powers a location-aware social heatmap. Users upload photos taken at a location; the system verifies the image content, extracts GPS and timestamp metadata from EXIF data, and aggregates the resulting post records into a heatmap dataset. Each concern is handled by a dedicated service.
            </Body>
            <Body style={{ maxWidth: 1280, marginBottom: 36, color: "var(--foreground)" }}>
              The system comprises five domain services (AccountService, ImageUploadService, ImageVerificationService, MetadataExtractionService, PostService) and a ServiceRegistry for service discovery. ImageVerificationService is written in Python to take advantage of Roboflow's ML Model ; the remaining services are Java and Spring Boot.
            </Body>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                padding: "20px 0",
                marginBottom: 24,
              }}
            >
              {[
                { value: "5", label: "Domain Services", sub: "Auth, upload, verify, metadata, orchestration" },
                { value: "1", label: "Python Service", sub: "Image verification via Roboflow" },
                { value: "2", label: "External APIs", sub: "IBM COS and Roboflow" },
                { value: "6", label: "Deployable Units", sub: "Five services plus Eureka" },
              ].map((metric) => (
                <div key={metric.label} style={{ padding: "8px 0" }}>
                  <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800, color: "var(--primary)", lineHeight: 1, marginBottom: 8 }}>
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

          {/* ══ 01 SYSTEM CAPABILITIES ══ */}
          <div id="built" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="System Capabilities" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>User Authentication</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  AccountService handles registration and login. Passwords are hashed before storage. Successful login returns an auth token that gates access to post creation and other write operations downstream.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>Image Ingestion & Storage</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  ImageUploadService accepts image uploads and writes them to IBM Cloud Object Storage, returning a stable URL. Credentials are isolated to this service; no other service has direct bucket access.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>ML Content Verification</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  ImageVerificationService (Python) calls the Roboflow inference API against the uploaded image and returns a verdict. PostService uses this verdict to decide whether to proceed or reject the post.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>EXIF Metadata Extraction</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  MetadataExtractionService parses EXIF data from the image to extract GPS coordinates and capture timestamp. Typed exceptions distinguish between missing location and missing timestamp.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>Post Orchestration</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  PostService sequences calls to all upstream services, assembles the post record from their responses, and persists it to MySQL. It also serves the aggregated location dataset for the heatmap.
                </Body>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>Service Discovery</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  ServiceRegistry (Spring Cloud Eureka) provides service registration and discovery. Each Spring Boot service registers on startup, enabling location-transparent inter-service communication.
                </Body>
              </div>
            </div>
          </div>

          {/* ══ 02 SERVICE TOPOLOGY ══ */}
          <div id="topology" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="Service Topology" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              The system is organized as six deployable units. The APIGateway was intended to be the single entry point for all inbound traffic, routing requests to the appropriate service and handling cross-cutting concerns like authentication and rate limiting at the boundary. It was scaffolded but is not currently operational, so services accept direct HTTP requests and manage their own CORS configuration independently.
            </Body>

            {/* Topology diagram */}
            <div style={{ padding: 20, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 20 }}>Service topology</div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                  <PipelineNode accent={COLORS.muted}>Client</PipelineNode>
                  <PipelineArrow />
                  <div style={{ fontFamily: MONO, fontSize: 11, padding: "8px 12px", borderRadius: "var(--radius-md)", border: `1px solid color-mix(in srgb, ${COLORS.muted} 40%, transparent)`, color: COLORS.muted, textDecoration: "line-through", opacity: 0.4 }}>
                    APIGateway (not operational)
                  </div>
                  <PipelineArrow />
                  <PipelineNode accent={COLORS.teal}>ServiceRegistry (Eureka)</PipelineNode>
                </div>

                <PipelineArrow down />

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, width: "100%" }}>
                  <PipelineNode accent={COLORS.teal}>AccountService</PipelineNode>
                  <PipelineNode accent={COLORS.orange}>ImageUploadService</PipelineNode>
                  <PipelineNode accent={COLORS.purple}>ImageVerificationService</PipelineNode>
                  <PipelineNode accent={COLORS.amber}>MetadataExtractionService</PipelineNode>
                  <PipelineNode accent={COLORS.rose} wide>PostService (Orchestrator)</PipelineNode>
                </div>

                <PipelineArrow down />

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
                  <PipelineNode accent={COLORS.muted}>MySQL (AccountService)</PipelineNode>
                  <PipelineNode accent={COLORS.muted}>IBM Cloud Object Storage</PipelineNode>
                  <PipelineNode accent={COLORS.muted}>Roboflow API</PipelineNode>
                  <PipelineNode accent={COLORS.muted}>MySQL (PostService)</PipelineNode>
                </div>
              </div>

              <Body style={{ fontSize: 12, marginTop: 16, color: "var(--foreground)" }}>
                The strikethrough APIGateway was scaffolded but is not operational. Direct service-to-service calls currently bypass it. ServiceRegistry provides Eureka-based discovery so services resolve each other by name rather than hardcoded address.
              </Body>
            </div>

            {/* Service ownership summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
              <ServiceBadge name="AccountService" lang="Java · Spring Boot · MySQL" accent={COLORS.teal} />
              <ServiceBadge name="ImageUploadService" lang="Java · Spring Boot · IBM COS" accent={COLORS.orange} />
              <ServiceBadge name="ImageVerificationService" lang="Python · Roboflow API" accent={COLORS.purple} />
              <ServiceBadge name="MetadataExtractionService" lang="Java · Spring Boot · EXIF" accent={COLORS.amber} />
              <ServiceBadge name="PostService" lang="Java · Spring Boot · MySQL" accent={COLORS.rose} />
              <ServiceBadge name="ServiceRegistry" lang="Java · Spring Cloud Eureka" accent={COLORS.muted} />
            </div>

            {/* Inter-service communication */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--muted)", fontFamily: MONO, fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)" }}>Inter-service call map</div>
              <div><span style={{ color: COLORS.rose }}>PostService</span> → <span style={{ color: COLORS.orange }}>ImageUploadService</span> (upload image, receive COS URL)</div>
              <div><span style={{ color: COLORS.rose }}>PostService</span> → <span style={{ color: COLORS.purple }}>ImageVerificationService</span> (verify image content via Roboflow)</div>
              <div><span style={{ color: COLORS.rose }}>PostService</span> → <span style={{ color: COLORS.amber }}>MetadataExtractionService</span> (extract GPS + timestamp from EXIF)</div>
              <div><span style={{ color: COLORS.teal }}>AccountService</span> — no upstream service dependencies</div>
              <div><span style={{ color: COLORS.orange }}>ImageUploadService</span> — no upstream service dependencies</div>
              <div><span style={{ color: COLORS.purple }}>ImageVerificationService</span> — no upstream service dependencies</div>
              <div><span style={{ color: COLORS.amber }}>MetadataExtractionService</span> — no upstream service dependencies</div>
            </div>
          </div>

          {/* ══ 03 POST CREATION FLOW ══ */}
          <div id="flow" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Post Creation Flow" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Creating a post is the central operation of the system and the only flow that involves all five services. PostService is the sole orchestrator: it receives the initial request, sequences the upstream calls, and decides at each step whether to proceed or abort. The flow is sequential rather than parallel, meaning a failure at any stage short-circuits the remainder.
            </Body>

            {/* Full post creation pipeline */}
            <div style={{ padding: 20, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>Post creation pipeline</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { step: "1", desc: "Client POST /posts → PostService" },
                  { step: "2", desc: "PostService → ImageVerificationService → Roboflow API → Pass / Fail verdict" },
                  { step: "3", desc: "PostService → ImageUploadService → IBM COS → COS URL returned" },
                  { step: "4", desc: "PostService → MetadataExtractionService → GPS + Timestamp" },
                  { step: "5", desc: "PostService assembles Post entity → MySQL → PostDto returned to client" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted-foreground)", minWidth: 20, marginTop: 2 }}>{item.step}</div>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted-foreground)", flex: 1 }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              <Body style={{ fontSize: 12, marginTop: 16, color: "var(--foreground)" }}>
                Steps 2–4 are sequential. If ImageVerificationService returns a fail verdict at step 2, PostService aborts without calling MetadataExtractionService or writing to MySQL.
              </Body>
            </div>

            {/* Heatmap query flow */}
            <div style={{ padding: 20, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--card)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Heatmap data query flow</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <PipelineNode accent={COLORS.muted}>Client GET /posts/heatmap</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.rose}>PostService</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.muted}>MySQL (location aggregation query)</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.rose}>List&lt;LocationDto&gt;</PipelineNode>
              </div>
              <Body style={{ fontSize: 12, color: "var(--foreground)" }}>
                The heatmap query is entirely within PostService. No upstream service calls are needed since all location data was extracted and stored at post creation time.
              </Body>
            </div>
          </div>

          {/* ══ 04 SERVICE DEEP DIVES ══ */}
          <div id="services" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Service Deep Dives" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              Each service is a self-contained Spring Boot (or Python) application with its own application context, database connection if needed, and Dockerfile. Selecting a service below shows its internal structure and the reasoning behind its design.
            </Body>

            {/* Service selector */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {SERVICES.map((s) => {
                const acc = serviceDetails[s].accent;
                const isActive = activeService === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveService(s)}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: `1px solid ${isActive ? `color-mix(in srgb, ${acc} 60%, transparent)` : "var(--border)"}`,
                      backgroundColor: isActive ? `color-mix(in srgb, ${acc} 18%, transparent)` : "transparent",
                      color: isActive ? acc : "var(--muted-foreground)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Service detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <TwoCol gap={20}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: detail.accent, marginBottom: 8, fontFamily: MONO }}>Responsibility</div>
                    <Body style={{ fontSize: 13, color: "var(--foreground)" }}>{detail.responsibility}</Body>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: detail.accent, marginBottom: 8, fontFamily: MONO }}>Internal Structure</div>
                    <Body style={{ fontSize: 13, color: "var(--foreground)" }}>{detail.internals}</Body>
                  </div>
                </TwoCol>

                <Notice color={detail.accent} icon="★">
                  <strong>{activeService}</strong> — {detail.noteworthy}
                </Notice>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ══ 05 ENGINEERING DECISIONS ══ */}
          <div id="choices" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Engineering Decisions" />

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Separation of Concerns</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Each service owns a single domain responsibility. No service touches another's database, and the only orchestration logic lives in PostService where it belongs. This keeps the codebase modular and makes each service independently testable and deployable.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Credential Isolation</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  IBM COS credentials are isolated to ImageUploadService, meaning a credential leak in any other service cannot expose the storage bucket. Secrets are externalized to <Code>secretinfo.properties</Code> rather than hardcoded in application config.
                </Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Language Fit</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  ImageVerificationService is written in Python based on ecosystem fit rather than language consistency. Roboflow's Python SDK and the broader ML ecosystem have significantly better library support. Runtime isolation is clean since the ML runtime has no dependency on the JVM.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Typed Exceptions</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  MetadataExtractionService uses typed exceptions (MissingGeoMetadataException vs MissingDateMetadaException) so the orchestrator can distinguish failure modes rather than catching a generic error. This gives PostService fine-grained control over error handling.
                </Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Service Discovery</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Services are registered with Eureka so PostService resolves addresses by name through <Code>RestClientConfig</Code> rather than using hardcoded URLs. This enables location-transparent communication and makes the system more resilient to service relocation.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Data Transfer Objects</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  PostDto and LocationDto decouple the internal Post entity from what is returned to callers. This prevents accidental exposure of internal fields and gives the API contract independence from the database schema.
                </Body>
              </div>
            </TwoCol>
          </div>

          {/* ══ 06 TECHNICAL STACK ══ */}
          <div id="stack" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Technical Stack" />

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Backend Services</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  Five services are built with Java and Spring Boot. Each has its own Spring Boot application context, Maven wrapper for reproducible builds, and Dockerfile for containerization. Services can be built and run independently without a shared compose file.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Python Service</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  ImageVerificationService is a lightweight Python HTTP service with dependencies declared in <Code>requirements.txt</Code> and the runtime pinned in <Code>runtime.txt</Code>. It downloads images from COS, forwards them to Roboflow, and returns structured verdicts.
                </Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Persistence</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  AccountService and PostService each maintain their own MySQL database. There is no shared database between services. IBM Cloud Object Storage handles binary image data, keeping binary content out of the relational databases entirely.
                </Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>External APIs</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>
                  The Roboflow API is called by ImageVerificationService to run inference on uploaded images. The IBM COS API (via the IBM COS SDK) is called by ImageUploadService. Both integrations are isolated to their respective services.
                </Body>
              </div>
            </TwoCol>
          </div>

          {/* ══ REFLECTIONS ══ */}
          <div style={{ marginBottom: 88 }}>
            <SectionLabel n={7} title="Reflections" />

            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 16 }}>What went well</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
                {[
                  "Each service keeps a narrow responsibility: no service touches another service's database, and orchestration remains in PostService.",
                  "IBM COS credentials are isolated to ImageUploadService, so a leak in another service cannot expose the bucket.",
                  "Python was chosen for ImageVerificationService based on ecosystem fit, with clean runtime isolation from JVM services.",
                  "Typed exceptions in MetadataExtractionService let the orchestrator distinguish failure modes instead of catching generic errors.",
                  "Secrets are externalized to secretinfo.properties so the primary app config can remain safely commit-ready.",
                  "Services register with Eureka so PostService resolves by name through RestClientConfig rather than hardcoded URLs.",
                ].map((item) => (
                  <div key={item} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--card)", padding: "14px 16px" }}>
                    <Body style={{ fontSize: 13, color: "var(--foreground)" }}>{item}</Body>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 16 }}>Future improvements</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
                {[
                  "Complete the APIGateway so auth validation, CORS policy, and routing are enforced at the boundary instead of duplicated across services.",
                  "Add a circuit breaker around PostService upstream calls so a slow verification service cannot stall post creation.",
                  "Add cleanup for orphaned COS objects when flow fails after upload but before database commit.",
                  "Introduce Docker Compose so the service mesh starts and stops in one command for local integration testing.",
                  "Add end-to-end integration tests that run real services through the full post creation pipeline.",
                  "Version inter-service HTTP contracts so response schema changes cannot silently break downstream parsing.",
                ].map((item) => (
                  <div key={item} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--card)", padding: "14px 16px" }}>
                    <Body style={{ fontSize: 13, color: "var(--foreground)" }}>{item}</Body>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </WorkReportShell>
  );
}


