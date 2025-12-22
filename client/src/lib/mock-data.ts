export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  videoUrl?: string;
  tags: string[];
  featured?: boolean;
}

export interface ResearchPaper {
  id: string;
  title: string;
  date: string;
  summary: string;
  pdfUrl: string;
}

export interface KaggleProject {
  id: string;
  title: string;
  date: string;
  summary: string;
  pdfUrl: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Neural Network Visualization Tool",
    description: "An interactive web-based tool for visualizing the internal state of neural networks in real-time. Built with WebGL and React to handle large-scale matrix operations on the client side.",
    githubUrl: "https://github.com/replit/neural-vis",
    tags: ["TypeScript", "WebGL", "React", "Machine Learning"],
    featured: true,
  },
  {
    id: "2",
    title: "Distributed System Simulator",
    description: "A simulation framework for testing consensus algorithms in distributed systems. Allows users to define network topology and inject failures to observe system resilience.",
    githubUrl: "https://github.com/replit/dist-sim",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["Go", "Distributed Systems", "Algorithm Design"],
    featured: true,
  },
  {
    id: "3",
    title: "Compiler Optimization Research",
    description: "Experimental compiler pass implementation for LLVM that optimizes memory access patterns for graph processing algorithms.",
    githubUrl: "https://github.com/replit/llvm-pass",
    tags: ["C++", "LLVM", "Compilers"],
  }
];

export const researchPapers: ResearchPaper[] = [
  {
    id: "efficient-graph-processing",
    title: "Efficient Graph Processing on Heterogeneous Architectures",
    date: "2024-10-15",
    summary: "Exploring novel techniques for partitioning graph datasets across CPU and GPU memory hierarchies to minimize latency.",
    pdfUrl: "https://arxiv.org/pdf/2401.00000.pdf"
  },
  {
    id: "consensus-in-mesh-networks",
    title: "Consensus Mechanisms in Ad-Hoc Mesh Networks",
    date: "2024-05-22",
    summary: "A comparative analysis of Paxos and Raft variants adapted for high-latency, lossy network environments.",
    pdfUrl: "https://arxiv.org/pdf/2405.00001.pdf"
  }
];

export const kaggleProjects: KaggleProject[] = [
  {
    id: "kaggle-1",
    title: "Time Series Forecasting Competition",
    date: "2024-08-20",
    summary: "Developed ensemble models for predicting stock market volatility using LSTM and gradient boosting techniques.",
    pdfUrl: "https://example.com/kaggle-1-notebook.pdf"
  },
  {
    id: "kaggle-2",
    title: "Image Classification Challenge",
    date: "2024-06-15",
    summary: "Fine-tuned vision transformers on custom dataset achieving top 5% accuracy in competition.",
    pdfUrl: "https://example.com/kaggle-2-notebook.pdf"
  }
];

export const skills = {
  languages: ["TypeScript", "Python", "Go", "C++", "Rust", "Java"],
  frontend: ["React", "Next.js", "Tailwind CSS", "WebGL"],
  backend: ["Node.js", "Express", "PostgreSQL", "Redis"],
  tools: ["Docker", "Kubernetes", "LLVM", "Git", "AWS"],
  specialties: ["Distributed Systems", "Compiler Design", "Machine Learning", "Systems Engineering"]
};
