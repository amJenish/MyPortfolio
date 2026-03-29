import type { ReactNode } from "react";
import {
  WorkExecutiveSummary,
  WorkFooterLinks,
  WorkFramingQuestion,
  WorkProsCons,
  WorkSectionLabel,
} from "../_shared";

/** Matches @theme accent — pipeline nodes that use “primary” teal */
const PIPELINE_ACCENT = "hsl(165 62% 52%)";

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
  { id: "summary",    label: "Overview" },
  { id: "built",      label: "1. Core Features" },
  { id: "pipelines",  label: "2. Dual-Pipeline Architecture" },
  { id: "ingestion",  label: "3. Ingestion Pipeline" },
  { id: "retrieval",  label: "4. Retrieval Pipeline" },
  { id: "choices",    label: "5. Engineering Decisions" },
  { id: "stack",      label: "6. Technical Stack" },
] as const;

export default function Sw5Page() {
  return (
    <div className="work-report-body space-y-10 text-sm leading-relaxed text-foreground sm:text-base">

      <WorkExecutiveSummary
        paragraphs={[
          "A full-stack Retrieval-Augmented Generation system designed for querying academic documents in natural language. The core challenge it solves is not retrieval itself but retrieval precision: standard RAG pipelines embed raw document text, which may be dense, poorly formatted, or domain-specific in ways that create a mismatch against the clean language of user queries. This system addresses that by embedding LLM-generated summaries rather than raw chunks, narrowing the semantic gap between what is stored and what is searched.",
          "Documents move through a two-stage pipeline: an ingestion pipeline that parses, semantically chunks, summarizes, and indexes each document section; and a query pipeline that rewrites the user's question, retrieves the most relevant chunks, and generates a grounded response via LLaMA 3.2 through the Groq API. Session state is managed through a ResearchSession object that scopes retrieval to the documents uploaded within a given session and maintains query history for follow-up questions. The backend is a FastAPI application with modular service boundaries, containerized with Docker Compose."
        ]}
        bullets={[
          "Summarize-then-embed produces cleaner vector representations than embedding raw document text.",
          "SemanticChunker splits by topical coherence rather than fixed token count, preserving contextual boundaries.",
          "Query rewriting translates conversational questions into retrieval-optimized queries before embedding.",
          "ResearchSession scopes retrieval to the active document set and maintains context across follow-up questions.",
          "ElasticSearch dense vector index preserves the option for hybrid keyword and vector retrieval in future iterations."
        ]}
      />

      <WorkFramingQuestion>
        Standard RAG pipelines embed raw document text, which often produces a semantic mismatch against the clean, concise language of user queries. How can the ingestion and retrieval steps be designed together to minimize that gap, while keeping responses strictly grounded in source material?
      </WorkFramingQuestion>

      {/* ── 01 CORE FEATURES ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={1} title="Core Features" id="built" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Document Ingestion</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Uploaded PDFs are parsed, split into semantically coherent sections by <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">SemanticChunker</span>, and each chunk is summarized by the LLM before its embedding is stored. Ingestion is fully decoupled from the query path.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Retrieval Pipeline</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              User questions are rewritten for retrieval precision, embedded, and searched against the indexed summary vectors in ElasticSearch. The top-ranked chunks are returned as context for generation, with their source locations tracked for citation.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Grounded Generation</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LLaMA 3.2 via Groq generates responses conditioned on the retrieved chunks, not on parametric memory. The model is instructed to cite specific document sections, making it possible to trace any claim back to the source text.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Session Management</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ResearchSession</span> manages which documents are in scope for a given session and maintains a query history so follow-up questions can reference prior answers without re-embedding context.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Query Rewriting</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conversational questions ("what does the paper say about X?") are poor retrieval queries. A preprocessing step uses the LLM to restructure them into declarative, noun-dense queries that match the vocabulary distribution of indexed summary embeddings.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleAccent}>Containerized Deployment</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              FastAPI backend, ElasticSearch, and the React frontend each run in isolated Docker containers orchestrated via Docker Compose. Service boundaries are clearly defined, and the full stack can be started from a single command locally.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 DUAL-PIPELINE ARCHITECTURE ── */}
      <section className="space-y-6">
        <WorkSectionLabel number={2} title="Dual-Pipeline Architecture" id="pipelines" />

        <p className="text-muted-foreground">
          The system separates into two pipelines with no shared runtime state between them. This separation is intentional: ingestion is a slow, asynchronous, compute-heavy process that runs once per document. The query pipeline is synchronous and latency-sensitive. Mixing them into a single flow would couple the user experience to document processing time.
        </p>

        {/* Ingestion pipeline visual */}
        <div className="border border-border rounded-lg bg-card/30 p-5 space-y-3">
          <div className="text-report-label mb-4">Ingestion pipeline (runs once per uploaded document)</div>
          <div className="flex flex-wrap items-center gap-2.5">
            <PipelineNode accent={PIPELINE_ACCENT}>PDF Upload</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent={PIPELINE_ACCENT}>PDF Parser</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#f97316">SemanticChunker</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#f97316">LLM Summarizer</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#2dd4bf">Embedding Model</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#2dd4bf">ElasticSearch Index</PipelineNode>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            Raw text is stored alongside each indexed entry. The embedding is generated from the summary, not the raw text. Both are needed at query time.
          </p>
        </div>

        {/* Query pipeline visual */}
        <div className="border border-border rounded-lg bg-card/30 p-5 space-y-3">
          <div className="text-report-label mb-4">Query pipeline (runs per user question)</div>
          <div className="flex flex-wrap items-center gap-2.5">
            <PipelineNode accent={PIPELINE_ACCENT}>User Query</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#f97316">Query Rewriter</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#f97316">Embedding Model</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#2dd4bf">Vector Search (ES)</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#2dd4bf">Chunk Retrieval</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#a78bfa">LLaMA 3.2 (Groq)</PipelineNode>
            <PipelineArrow />
            <PipelineNode accent="#a78bfa">Grounded Response</PipelineNode>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            The retrieval step returns raw chunk text (not summaries) as context for generation. Summaries exist only in the vector index.
          </p>
        </div>

        <div className="bg-muted/10 p-4 rounded border border-border font-mono text-xs text-muted-foreground leading-relaxed space-y-1">
          <div><span className="text-foreground/60">backend/app/DataManagement/</span>  PDF parsing, SemanticChunker, ElasticSearch indexing, embedding utilities</div>
          <div><span className="text-foreground/60">backend/app/RAG/</span>             Query rewriting, vector retrieval orchestration, LLM generation, citation assembly</div>
          <div><span className="text-foreground/60">backend/app/core/</span>            ResearchSession state, document scope tracking, query history management</div>
          <div><span className="text-foreground/60">frontend/src/</span>                React + Blueprint UI, document uploader, chat interface, source citation display</div>
        </div>
      </section>

      {/* ── 03 INGESTION PIPELINE ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={3} title="Ingestion Pipeline" id="ingestion" />

        <p className="text-muted-foreground">
          The ingestion pipeline has three meaningful stages after initial PDF parsing, each of which involves a design choice that affects downstream retrieval quality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Stage 1: Semantic Chunking</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">SemanticChunker.py</span> splits document text based on topical coherence rather than fixed token counts. The chunker tracks semantic drift between consecutive sentences and introduces a boundary when the topic shifts beyond a threshold. This means a methods section and a results section will not be merged into the same chunk, even if a fixed-size splitter would have combined them.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The practical consequence is variable chunk sizes. A short, dense definition section may become a small chunk while a sprawling discussion section may remain large. Downstream retrieval benefits from this because retrieved chunks are more likely to be topically focused.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Stage 2: Summarize-then-Embed</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each chunk is passed to the LLM with a prompt asking for a concise summary of its core claims and topics. The embedding model then encodes the summary, not the raw chunk text. Both the summary embedding and the raw chunk text are stored in ElasticSearch: the embedding is used for retrieval, the raw text is what gets passed to the generation model.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The motivation is that raw academic text may be dense with citations, passive constructions, and hedging language that may degrade the quality of its vector representation. A clean, active-voice summary may produce a vector that sits closer to the kinds of natural language queries users actually ask.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Stage 3: ElasticSearch Indexing</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each indexed document entry stores the summary embedding as a dense vector field, the raw chunk text, the source document identifier, and the chunk position within the document. The dense vector field enables approximate nearest neighbor search using dot product similarity.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Session identifiers are stored alongside each entry so that at query time the vector search can be filtered to only the documents belonging to the active session, preventing cross-session contamination without needing separate indexes per user.
            </p>
          </div>
        </div>
      </section>

      {/* ── 04 RETRIEVAL PIPELINE ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={4} title="Retrieval Pipeline" id="retrieval" />

        <p className="text-muted-foreground">
          The query pipeline has two non-trivial stages before the LLM call: query rewriting and vector retrieval. Both are worth examining because they reflect specific assumptions about where retrieval tends to fail.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Query Rewriting</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A user asking "can you explain the methodology they used?" is making a reasonable conversational request, but it is a poor retrieval query. It contains no domain vocabulary, no noun phrases specific to the document, and the word "methodology" may not appear verbatim in the indexed summaries.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The rewriting step prompts the LLM with both the user's question and the session's prior query history, asking it to produce a retrieval-optimized version. The rewritten query tends to be noun-dense, declarative, and stripped of conversational scaffolding. This query is what gets embedded and searched, not the original.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Session-Scoped Retrieval</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vector search runs against the full ElasticSearch index but is filtered by session ID, so only chunks from documents the user has uploaded in the current session are eligible for retrieval. This avoids needing a separate index per user while still providing clean isolation between sessions.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">ResearchSession</span> also tracks which document IDs are active, allowing the user to optionally narrow retrieval to a specific uploaded document if they are querying across multiple papers in the same session.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Chunk Retrieval and Context Assembly</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The top-k chunks returned by ElasticSearch are retrieved by their raw text, not their summaries. Summaries served their purpose at indexing time by producing better vectors; at generation time, the model needs the full original context to answer accurately.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Retrieved chunks are assembled into a context window alongside their source document identifiers and chunk positions. The generation prompt instructs the model to only use the provided context and to cite the specific source section for each claim it makes.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Grounded Generation via Groq</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                LLaMA 3.2 is accessed through Groq rather than a self-hosted inference server. Groq's custom inference hardware provides substantially lower latency than standard GPU-based serving, which matters for an interactive research workflow where the user is waiting for an answer.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The generation prompt is structured to prevent the model from drawing on parametric memory: it is given the retrieved chunks as the sole context and instructed that any claim not present in those chunks should be flagged as outside the scope of the uploaded documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 ENGINEERING DECISIONS ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={5} title="Engineering Decisions" id="choices" />

        <p className="text-muted-foreground">
          Each of the four major design choices below had alternatives that were considered. The decisions are worth explaining not just as choices made, but as tradeoffs within specific constraints.
        </p>

        <div className="space-y-3">

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Semantic Chunking vs Fixed-Size Chunking</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fixed-size chunking (splitting every N tokens with an overlap window) is simpler and produces predictable chunk sizes, which makes embedding batch sizes uniform. The problem is that a 512-token boundary has no relationship to where the text's meaning changes. A methods section that spans 600 tokens gets split in the middle; the retrieved chunk may answer half of a user's question about methodology while the other half is in the next chunk and may not rank highly enough to be retrieved.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Semantic chunking produces variable-length chunks but may preserve the completeness of a topical unit. The tradeoff is additional complexity in the chunking logic and variable memory footprint per chunk. For academic research documents where sections have relatively clear topical boundaries, this tradeoff appears worthwhile.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Summarize-then-Embed vs Direct Embedding</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Direct embedding (encoding raw chunk text) is faster, requires no LLM call at ingestion time, and avoids any information loss introduced by summarization. It is also the standard approach in most open-source RAG tutorials and frameworks.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The concern with direct embedding for academic text is the vocabulary mismatch problem: a user querying in plain language and a document section written in dense academic prose may occupy very different regions of the embedding space even when they are semantically related. Embedding a summary may reduce this gap because the summary is itself written in plainer language. The cost is an LLM call per chunk at ingestion, which makes ingestion slower and more expensive. For a research tool where documents are uploaded once and queried many times, this cost may be justifiable.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>ElasticSearch vs Dedicated Vector Database</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pinecone, Chroma, Weaviate, and Qdrant are all purpose-built for vector retrieval and may offer simpler setup and higher indexing throughput for purely vector-based workloads. ElasticSearch is a heavier dependency and requires more configuration.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The reason for choosing ElasticSearch is its support for hybrid retrieval: a single index can serve both dense vector ANN search and BM25 keyword search, and the two can be combined with a reciprocal rank fusion step. At present the system uses only vector search, but future iterations could layer in keyword matching (for exact technical terms, author names, or dataset identifiers) without re-indexing any documents. This optionality is built into the choice of storage layer from the start.
            </p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
            <div className={cardTitleFg}>Query Rewriting vs Direct Query Embedding</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Embedding the user's raw question directly is simpler and avoids an additional LLM call on every query. For short, well-formed factual questions this likely works adequately. The problem surfaces with conversational phrasing, pronouns referencing prior context ("what about the approach they took in section two?"), or vague questions that require domain grounding to retrieve anything useful.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The query rewriting step is also where session history is incorporated: the rewriter has access to the previous questions and responses in the session and can resolve ambiguous pronouns or inject context before the query is embedded. This makes the retrieval pipeline stateful in a lightweight way without requiring a full conversational memory architecture.
            </p>
          </div>

        </div>
      </section>

      {/* ── 06 TECHNICAL STACK ── */}
      <section className="space-y-4">
        <WorkSectionLabel number={6} title="Technical Stack" id="stack" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Backend</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                FastAPI serves the backend with async endpoint support, which matters for the ingestion route where PDF processing and multiple LLM summarization calls can take several seconds. Background tasks handle chunk indexing so the upload endpoint can respond to the client before indexing completes. Pydantic models are used throughout for request validation and session state serialization.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>LLM Inference</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                LLaMA 3.2 is accessed via the Groq API. Three distinct LLM calls occur in the system: chunk summarization at ingestion time, query rewriting at the start of each query, and answer generation using the retrieved context. Each uses a different prompt structure suited to its task.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Vector Storage</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ElasticSearch stores dense vector embeddings in a <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">dense_vector</span> field type with cosine similarity configured for ANN search. Each index entry carries the summary embedding, raw chunk text, document ID, session ID, and chunk position metadata.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Frontend</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                React with Blueprint UI provides the document upload flow and conversational query interface. The UI shows retrieved source citations alongside each response, allowing users to trace the model's claims back to specific document sections. Session state is maintained client-side and passed with each query request.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Infrastructure</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Docker Compose orchestrates three services: the FastAPI application, the ElasticSearch instance, and the React development server. Service dependencies are declared explicitly so ElasticSearch is healthy before the API starts. Environment variables for the Groq API key and ElasticSearch credentials are injected via a <span className="font-mono text-xs text-foreground/80 bg-muted/30 px-1 rounded">.env</span> file, not hardcoded.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card/50 space-y-2">
              <div className={cardTitleFg}>Service Boundaries</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The three backend modules (DataManagement, RAG, core) are deliberately separated so the ingestion and retrieval logic cannot become entangled over time. Adding support for a new document type (DOCX, HTML) requires only changes to DataManagement; swapping the embedding model requires only changes to the embedding utilities used by both pipelines.
              </p>
            </div>
          </div>
        </div>

        <WorkProsCons
          pros={[
            "Implemented summarize-then-embed so queries in plain language align better with indexed vectors on dense PDFs.",
            "Used semantic chunking so sections stay topically whole instead of split at arbitrary token boundaries.",
            "Chose ElasticSearch so hybrid keyword + vector retrieval stays available without a storage migration later.",
            "Added query rewriting with session context to support follow-ups and pronouns.",
            "Kept ingestion, RAG orchestration, and session logic in separate modules so each stage can evolve on its own.",
          ]}
          cons={[
            "I'd profile ingestion cost and batching now that every chunk pays for a summarization call.",
            "Planning to add parsers beyond PDF (e.g. DOCX/HTML) when the use case needs them.",
            "Want to experiment with chunk budgets and re-ranking when queries span very long documents.",
            "Next: a small eval set and metrics for retrieval hit-rate and groundedness.",
          ]}
        />
      </section>

      <WorkFooterLinks github="https://github.com/amJenish/Study-Assistant-AI-with-RAG-and-LLM" />
    </div>
  );
}