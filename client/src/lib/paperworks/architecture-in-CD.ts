import { ResearchPaper } from "../interfaces"

export const architectureInCD: ResearchPaper = 

    {
    id: "research-2",
    title: "Architecture in the Age of Continuous Delivery",
    date: "2025-11-30",
    pdfUrl: "research_pdfs/Architecture_in_the_Age_of_Continuous_Delivery.pdf",
    abstract: `
    This article provides a systematic analysis of the architectural requirements and patterns necessary for implementing Continuous Delivery (CD). It begins by establishing the core principles of CD and contrasting them with traditional release models, highlighting how frequent, low-risk deployments depend on specific quality attributes: deployability, modifiability, testability, resilience, and observability.

The analysis progresses from monolithic architectures, where tight coupling and team dependencies obstruct CD, toward architectures that enable independent deployment and fast feedback loops. Using the conceptual frameworks of vertical slicing and microservices, the article demonstrates how decomposing systems along business capabilities reduces coordination overhead and aligns with team autonomy, a key enabler of continuous flow.

A complete architectural case study is developed: a monolithic application is decomposed into independently deployable services, each with its own database and deployment pipeline. This transformation is shown to enable rapid, reliable deployments by isolating changes, containing failures, and eliminating shared-state bottlenecks.

The article concludes by connecting these architectural patterns to the operational mindset shift required for CD: from treating operations as a separate phase to designing systems explicitly for deployment and operation from the outset. The treatment unifies architectural theory with practical implementation concerns, offering a complete framework for building systems that support continuous, confident delivery.
    `
  }
