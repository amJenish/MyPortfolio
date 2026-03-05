import { Project } from "../interfaces";

export const AIStudyAssistant: Project = 
  {
    id: "5",
    title: "Rag + LLM Study/Research AI Assistant",
    description: "A full-stack Retrieval-Augmented Generation (RAG) web application that allows users to upload documents and query them in natural language. Uploaded PDFs are processed, chunked, embedded, and stored in a vector database for semantic retrieval. Queries return answers strictly based on the uploaded content, with accurate source citations. The project was developed independently, handling the complete architecture including document ingestion, indexing, retrieval logic, prompt engineering, and frontend integration, resulting in a fully functional end-to-end document Q&A system.",
    githubUrl: "https://github.com/amJenish/StudentEnrollmentSystem",
    tags: ["Python", "ElasticSearch", "FastAPI", "LLM", "RAG", "Docker", "React", "BlueprintUI"],
    featured: false,
    content: `

# Research & Study Assistant -- RAG + LLM Pipeline

An AI-powered research and study assistant that allows users to upload documents, semantically chunk and index them, and interactively query their content through a conversational chat interface. Built on a Retrieval-Augmented Generation (RAG) architecture using Groq's LLaMA 3.2, ElasticSearch, and a React/BlueprintUI frontend — all containerized with Docker.


## Overview

Traditional keyword-based document search fails to capture the semantic meaning behind a user's question. This project addresses that by building a full RAG pipeline that:

1. Accepts user-uploaded documents
2. Splits them into semantically coherent chunks (not arbitrary character splits)
3. Summarizes each chunk using an LLM and embeds the summary for retrieval
4. Stores everything in ElasticSearch
5. Lets users ask natural language questions against their documents via a chat interface
6. Rewrites queries for semantic precision before retrieval, then generates grounded LLM answers from the top retrieved chunks

---

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                         INGESTION PIPELINE                          │
│                                                                     │
│   User Upload ──► Semantic Chunker ──► LLM Summarizer               │
│                         │                      │                    │
│                         ▼                      ▼                    │
│                   Chunk Embedder ◄──── Summary Embedder             │
│                         │                      │                    │
│                         └──────────┬───────────┘                    │
│                                    ▼                                │
│                            ElasticSearch Index                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          QUERY PIPELINE                             │
│                                                                     │
│   User Question ──► LLM Query Rewriter ──► Semantic Search          │
│                                                  │                  │
│                                     Top-N Chunks Returned           │
│                                                  │                  │
│                            ┌─────────────────────┘                  │
│                            ▼                                        │
│                     LLM Answer Generator ──► Response to User       │
│                     (question + sources)                            │
│                                                                     │
│                   [Cache Layer — implemented, pending activation]   │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## Pipeline Breakdown

### 1. Document Ingestion & Semantic Chunking

When a user uploads a document, the system does not split the text naively (e.g., every 500 characters). Instead, it performs **semantic chunking**:

- The document is parsed and broken into candidate segments
- Each chunk is evaluated to ensure **intra-chunk semantic coherence** — meaning all sentences within a chunk should be topically related to one another
- Chunks are sized to stay within a meaningful semantic boundary, preventing context bleed between unrelated topics
- The result is a set of chunks where each one represents a self-contained idea or concept from the original document

**Why this matters:** Naive chunking can split a key idea across two chunks, causing both to be partially useless during retrieval. Semantic chunking ensures each chunk stands on its own.

---

### 2. Chunk Summarization & Embedding

After chunking, each chunk goes through two parallel processes:

**Summarization:**
- Each chunk is passed to the LLM (LLaMA 3.2 via Groq) with a prompt instructing it to produce a concise, information-dense summary of the chunk's content
- This summary captures the core meaning and is used as the primary retrieval signal

**Embedding:**
- The **summary** is embedded (not the raw chunk text) to generate a vector representation
- This ensures the embedding reflects distilled semantic meaning rather than verbose or noisy raw text

Both the raw chunk content and its summary embedding are stored together.

---

### 3. ElasticSearch Indexing

Each document chunk is stored in ElasticSearch as a document with the following structure:

\`\`\`json
{
  "paper_id: "uuid",
  "session_id"L "uuid",
  "chunk_id": "uuid",
  "raw_text": "...original chunk text...",
  "raw_text_embedding": "embedded raw text",
  "summary": "...LLM-generated summary...",
  "summary_embedding": [0.023, -0.418, ...],

}
\`\`\`

ElasticSearch's **dense vector** field type is used to store and query the summary embeddings, enabling approximate nearest-neighbor (ANN) semantic search at retrieval time.

---

### 4. Chat Interface & Query Processing

Once documents are ingested, the user is navigated to the **Chat Interface** — built with React and BlueprintUI. Here the user can ask free-form questions about their uploaded documents.

Before the question is used for retrieval, it is passed through an **LLM Query Rewriter**:

- The raw user question (e.g., *"what did they find out about memory?"*) is often too conversational or vague for effective semantic search
- The LLM rewrites it into a well-structured, information-rich query that is better aligned with how document summaries are phrased
- This bridges the vocabulary and style gap between user questions and indexed content

**Example:**

| Before Rewrite | After Rewrite |
|---|---|
| *"what did they find about memory?"* | *"findings and conclusions related to memory retention, recall mechanisms, or cognitive memory research"* |

---

### 5. Semantic Retrieval

The rewritten query is embedded and used to perform a **vector similarity search** against the summary embeddings stored in ElasticSearch:

- Cosine similarity is computed between the query embedding and all stored summary embeddings
- The **top-N most semantically similar chunks** are returned as sources
- These chunks serve as the grounded context for the LLM's answer

The retrieval operates over **summaries** rather than raw text, which keeps the semantic signal clean and avoids retrieval noise from filler content in the original document.

---

### 6. LLM Response Generation

The retrieved chunks and the original user question are packaged into a prompt and sent to LLaMA 3.2 via Groq:

\`\`\`
System: You are a research assistant. Answer the user's question strictly 
        based on the provided source documents. Cite relevant sections 
        where appropriate.

Sources:
  [1] <chunk summary + raw text>
  [2] <chunk summary + raw text>
  ...

User Question: <original question>
\`\`\`

The LLM synthesizes an answer grounded in the retrieved sources, reducing hallucination by anchoring the response to actual document content.

---

### 7. Caching Layer

A **source caching system** has been implemented to avoid redundant ElasticSearch retrievals for semantically similar or repeated queries:

- Previously retrieved source sets are cached and keyed by a hash or embedding similarity of the query
- On a new query, a cache hit check is performed before triggering a full ElasticSearch retrieval
- If a sufficiently similar query has been answered before, the cached sources are reused directly

> ⚠️ **Note:** The caching layer is currently **implemented but inactive** due to context window limitations in the current model configuration. It will be enabled once a model with a larger context window is integrated.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **LLM** | LLaMA 3.2 (Instant) via [Groq](https://groq.com) |
| **Vector Store / Search** | [ElasticSearch](https://www.elastic.co/) (dense vector ANN) |
| **Frontend** | React + [BlueprintUI](https://blueprintjs.com/) |
| **Containerization** | Docker / Docker Compose |
| **Embeddings** | Sentence-level embedding model (summary-based) |

---


## Design Decisions

**Summarize then embed, not embed raw text**
Raw document chunks are often long, repetitive, and noisy. Embedding a concise LLM-generated summary produces a cleaner, more discriminative vector — improving retrieval precision significantly.

**Semantic chunking over fixed-size chunking**
Fixed character or token splits frequently cut mid-thought. Semantic chunking respects topical boundaries, ensuring each stored chunk is a self-contained unit of meaning that can be retrieved and understood in isolation.

**LLM query rewriting before retrieval**
User queries are informal and often structurally incompatible with how indexed summaries are written. A rewrite step normalizes vocabulary and adds specificity, directly improving recall.

**ElasticSearch over a dedicated vector DB**
ElasticSearch combines traditional keyword search with ANN vector search in a single system, keeping the infrastructure lean while retaining the flexibility to add hybrid retrieval (BM25 + vector) in the future.

---

## Known Limitations

- **Context window constraints** - LLaMA 3.2 Instant's context window limits how many sources can be passed to the LLM simultaneously, which also prevents activating the caching layer at full capacity.
- **Embedding model dependency** - Retrieval quality is sensitive to the choice of embedding model. Mismatches between how summaries and queries are embedded can hurt recall.
- **Single-user document scope** - The current implementation does not enforce strict per-user document isolation at the index level.
- **No re-ranking** — Retrieved chunks are returned by raw similarity score with no cross-encoder re-ranking pass.
- ** Document Support** - Currently, only PDF files are supported. More need to be added.
---

## Future Improvements

- Activate the caching layer with a model supporting a larger context window
- Add hybrid retrieval (BM25 keyword + vector similarity) for improved robustness on exact-match queries
- Cross-encoder re-ranking of top-N results before passing to the LLM
- Per-user document namespacing in ElasticSearch
- Streaming LLM responses to the frontend for a more responsive chat experience
- Support for additional file formats (\`.pptx\`, \`.csv\`, web URLs)

`
}