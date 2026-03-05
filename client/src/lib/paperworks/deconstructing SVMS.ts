import { ResearchPaper } from "../interfaces"

export const DeconstructingSVM: ResearchPaper = 
  {
    id: "research-1",
    title: "Deconstructing the Support Vector Machine: A Mathematical Analysis",
    date: "2025-12-20",
    pdfUrl: "research_pdfs/Deconstructing SVMs.pdf",
    abstract: `
    This article provides a mathematical deconstruction of the Support Vector Machine (SVM) for classification, progressing systematically from the primal hard-margin formulation to its soft-margin and kernelized extensions. Using Lagrange multipliers, the dual optimization problem is derived, establishing the quadratic programming framework and Karush–Kuhn–Tucker (KKT) conditions that characterize the solution. For pedagogical clarity, a complete computational example is developed: a two-dimensional, non-linearly separable dataset is made separable via an explicit second-degree polynomial feature mapping. The dual problem is solved numerically to obtain the Lagrange multipliers, from which the optimal weight vector, bias, and support vectors are recovered, yielding a decision boundary that corresponds to a circle in the original space. The article concludes by connecting this explicit feature construction to the kernel trick, demonstrating how kernel methods preserve the same mathematical structure while avoiding explicit high-dimensional computations. The treatment unifies theory and implementation, offering a complete picture 
    of the SVM's mathematical foundation.
    `
  }
