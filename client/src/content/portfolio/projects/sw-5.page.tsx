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

const COLORS = {
  teal: "var(--primary)",
  orange: "rgb(245, 158, 11)",
};

export const workPageSections = [
  { id: "summary", label: "Overview" },
  { id: "capabilities", label: "1. Core Capabilities" },
  { id: "pipelines", label: "2. Dual-Pipeline Architecture" },
  { id: "ingestion", label: "3. Ingestion Pipeline" },
  { id: "retrieval", label: "4. Retrieval & Generation" },
  { id: "stack", label: "5. Technical Stack" },
] as const;

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

export default function RAGStudyAssistantPage(props: WorkPageProps) {
  return (
    <WorkReportShell {...props}>
      <div style={{ color: "var(--foreground)", fontFamily: SANS, textAlign: "left" }}>
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
              RAG + LLM<br />
              <span style={{ color: COLORS.teal }}>Study assistant for papers and articles</span>
            </h1>

            <Body style={{ maxWidth: 1280, marginBottom: 12, color: "var(--foreground)" }}>
              A full-stack retrieval-augmented generation (RAG) system that helps students and researchers explore papers and articles effectively. Users upload PDFs, and the system indexes them using semantic chunking and dense embeddings. Questions are answered by retrieving relevant sections and generating grounded responses via LLaMA 3.2.
            </Body>
            <Body style={{ maxWidth: 1280, marginBottom: 36, color: "var(--foreground)" }}>
              The architecture separates ingestion (asynchronous, compute-heavy) from retrieval (synchronous, latency-sensitive). ElasticSearch provides hybrid keyword + vector search. The FastAPI backend orchestrates the RAG pipeline. React with Blueprint UI provides the frontend. Everything runs in Docker containers.
            </Body>

            <CatalogTagPills tags={props.entry.tags} />
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
          <div id="summary" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={1} title="Overview" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>
              A retrieval-augmented generation system that enables grounded question-answering over uploaded documents. Users upload PDFs, the system indexes them using semantic chunking and dense embeddings, and questions are answered by retrieving relevant sections and generating responses conditioned on the retrieved context via LLaMA 3.2.
            </Body>
            <Notice color={COLORS.teal} icon="★">
              How can we build a system where an LLM answers questions about specific documents without hallucinating, and where every claim can be traced back to the source text?
            </Notice>
          </div>

          <div id="capabilities" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={2} title="Core Capabilities" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Document Ingestion</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Users upload PDF documents. The system extracts text, applies semantic chunking to keep sections topically whole, summarizes each chunk with an LLM, and generates dense embeddings from the summaries for efficient retrieval.</Body>
              </div>
              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Semantic Chunking</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Instead of splitting at arbitrary token boundaries, the system chunks based on semantic coherence. Sections stay topically whole, improving retrieval quality and reducing the need for large context windows during generation.</Body>
              </div>
              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Retrieval Pipeline</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>User questions are rewritten for retrieval precision, embedded, and searched against the indexed summary vectors in ElasticSearch. The top-ranked chunks are returned as context for generation, with their source locations tracked for citation.</Body>
              </div>
              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Grounded Generation</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>LLaMA 3.2 via Groq generates responses conditioned on the retrieved chunks, not on parametric memory. The model is instructed to cite specific document sections, making it possible to trace any claim back to the source text.</Body>
              </div>
              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Session Management</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}><Code>ResearchSession</Code> manages which documents are in scope for a given session and maintains a query history so follow-up questions can reference prior answers without re-embedding context.</Body>
              </div>
              <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, marginBottom: 8, fontFamily: MONO }}>Query Rewriting</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Conversational questions ("what does the paper say about X?") are poor retrieval queries. A preprocessing step uses the LLM to restructure them into declarative, noun-dense queries that match the vocabulary distribution of indexed summaries.</Body>
              </div>
            </div>
          </div>

          <div id="pipelines" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={3} title="Dual-Pipeline Architecture" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>The system separates into two pipelines with no shared runtime state between them. This separation is intentional: ingestion is a slow, asynchronous, compute-heavy process that runs once per document. The query pipeline is synchronous and latency-sensitive. Mixing them would couple the user experience to document processing time.</Body>

            <div style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>Ingestion pipeline (runs once per uploaded document)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <PipelineNode accent={COLORS.teal}>PDF Upload</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.teal}>PDF Parser</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.orange}>SemanticChunker</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.orange}>LLM Summarizer</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.teal}>Embedding Model</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.teal}>ElasticSearch Index</PipelineNode>
              </div>
              <Body style={{ fontSize: 12, color: "var(--foreground)" }}>Raw text is stored alongside each indexed entry. The embedding is generated from the summary, not the raw text. Both are needed at query time: summaries for retrieval, raw text for context generation.</Body>
            </div>

            <div style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--card)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>Query pipeline (runs per user question)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <PipelineNode accent={COLORS.teal}>User Query</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.orange}>Query Rewriter</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.orange}>Embedding Model</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.teal}>ElasticSearch Search</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.orange}>LLM Generation</PipelineNode>
                <PipelineArrow />
                <PipelineNode accent={COLORS.teal}>Cited Response</PipelineNode>
              </div>
              <Body style={{ fontSize: 12, color: "var(--foreground)" }}>The query pipeline is latency-sensitive. Query rewriting happens first to improve retrieval precision. Retrieved chunks are then passed to the LLM with instructions to cite specific sections. The response includes source references so users can trace claims back to the original documents.</Body>
            </div>
          </div>

          <div id="ingestion" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={4} title="Ingestion Pipeline" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>The ingestion pipeline is asynchronous and compute-heavy. It runs once per uploaded document and produces indexed embeddings that power the retrieval pipeline. The pipeline is decoupled from the query pipeline so document processing does not block user interactions.</Body>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>PDF Parsing</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Raw PDF text is extracted using a PDF parsing library. The extracted text is cleaned and normalized to remove artifacts from the PDF format. Document metadata (title, author, page numbers) is preserved for citation purposes.</Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Semantic Chunking</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Text is split into chunks based on semantic coherence rather than fixed token boundaries. The chunker identifies section boundaries and keeps topically related content together. This improves retrieval quality and reduces context fragmentation.</Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>LLM Summarization</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Each chunk is summarized with LLaMA 3.2 via Groq. Summaries are dense, noun-heavy, and optimized for embedding. The summary is used to generate the retrieval embedding; the raw chunk is stored separately for context generation.</Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Embedding & Indexing</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Summary embeddings are generated using a dense embedding model. Each embedding is indexed in ElasticSearch with the raw chunk text, document ID, session ID, and chunk position metadata. Hybrid keyword + vector search is configured for retrieval.</Body>
              </div>
            </TwoCol>
          </div>

          <div id="retrieval" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={5} title="Retrieval & Generation" />
            <Body style={{ marginBottom: 24, color: "var(--foreground)" }}>The retrieval pipeline is synchronous and latency-sensitive. It runs on every user query and returns cited responses grounded in the retrieved document sections.</Body>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Query Rewriting</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>User questions are often conversational ("what does the paper say about X?"). A preprocessing step uses the LLM to rewrite them into declarative, noun-dense queries that better match the vocabulary distribution of indexed summaries. This improves retrieval precision.</Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Retrieval</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>The rewritten query is embedded and searched against ElasticSearch using hybrid keyword + vector search. The top-ranked chunks are retrieved along with their source metadata. Retrieved chunks are ranked by relevance and passed to the generation step.</Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Grounded Generation</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>LLaMA 3.2 via Groq generates a response conditioned on the retrieved chunks. The model is instructed to cite specific document sections and avoid hallucinating information not present in the context. The response includes source references.</Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Session Context</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}><Code>ResearchSession</Code> maintains query history so follow-up questions can reference prior answers. The session tracks which documents are in scope and maintains conversation context without re-embedding or re-indexing.</Body>
              </div>
            </TwoCol>
          </div>

          <div id="stack" className="scroll-mt-28" style={{ marginBottom: 88 }}>
            <SectionLabel n={6} title="Technical Stack" />

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Backend</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>FastAPI provides the HTTP API for document upload and query handling. Pydantic models are used for request validation and session state serialization. The backend is organized into three modules: DataManagement (ingestion), RAG (retrieval orchestration), and core (shared utilities).</Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>LLM Inference</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>LLaMA 3.2 is accessed via the Groq API. Three distinct LLM calls occur: chunk summarization at ingestion time, query rewriting at the start of each query, and answer generation using the retrieved context. Each uses a different prompt structure suited to its task.</Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Vector Storage</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>ElasticSearch stores dense vector embeddings in a <Code>dense_vector</Code> field type with cosine similarity configured for ANN search. Each index entry carries the summary embedding, raw chunk text, document ID, session ID, and chunk position metadata.</Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Frontend</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>React with Blueprint UI provides the document upload flow and conversational query interface. The UI shows retrieved source citations alongside each response, allowing users to trace the model's claims back to specific document sections.</Body>
              </div>
            </TwoCol>

            <TwoCol gap={20}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Infrastructure</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>Docker Compose orchestrates three services: the FastAPI application, the ElasticSearch instance, and the React development server. Service dependencies are declared explicitly so ElasticSearch is healthy before the API starts. Environment variables are injected via a <Code>.env</Code> file.</Body>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>Service Boundaries</div>
                <Body style={{ fontSize: 13, color: "var(--foreground)" }}>The three backend modules (DataManagement, RAG, core) are deliberately separated so ingestion and retrieval logic cannot become entangled. Adding support for a new document type requires only changes to DataManagement. Swapping the embedding model requires only changes to shared utilities.</Body>
              </div>
            </TwoCol>
          </div>

          <div style={{ marginBottom: 88 }}>
            <SectionLabel n={7} title="Reflections" />

            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 16 }}>What went well</div>
              <ul style={{ listStyle: "disc", paddingLeft: 20, color: "var(--muted-foreground)", lineHeight: 1.8 }}>
                <li>Implemented summarize-then-embed so queries in plain language align better with indexed vectors on dense PDFs.</li>
                <li>Used semantic chunking so sections stay topically whole instead of split at arbitrary token boundaries.</li>
                <li>Chose ElasticSearch so hybrid keyword + vector retrieval stays available without a storage migration later.</li>
                <li>Added query rewriting with session context to support follow-ups and pronouns.</li>
                <li>Kept ingestion, RAG orchestration, and session logic in separate modules so each stage can evolve on its own.</li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 16 }}>Future improvements</div>
              <ul style={{ listStyle: "disc", paddingLeft: 20, color: "var(--muted-foreground)", lineHeight: 1.8 }}>
                <li>Profile ingestion cost and batching now that every chunk pays for a summarization call.</li>
                <li>Add parsers beyond PDF (e.g. DOCX/HTML) when the use case needs them.</li>
                <li>Experiment with chunk budgets and re-ranking when queries span very long documents.</li>
                <li>Build a small eval set and metrics for retrieval hit-rate and groundedness.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </WorkReportShell>
  );
}
