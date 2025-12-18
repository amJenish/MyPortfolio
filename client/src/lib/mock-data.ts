export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  videoUrl?: string;
  tags: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Neural Network Visualization Tool",
    description: "An interactive web-based tool for visualizing the internal state of neural networks in real-time. Built with WebGL and React to handle large-scale matrix operations on the client side.",
    githubUrl: "https://github.com/replit/neural-vis",
    tags: ["TypeScript", "WebGL", "React", "Machine Learning"],
  },
  {
    id: "2",
    title: "Distributed System Simulator",
    description: "A simulation framework for testing consensus algorithms in distributed systems. Allows users to define network topology and inject failures to observe system resilience.",
    githubUrl: "https://github.com/replit/dist-sim",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["Go", "Distributed Systems", "Algorithm Design"],
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
    content: `
# Efficient Graph Processing on Heterogeneous Architectures

## Abstract
This paper explores novel techniques for partitioning graph datasets across CPU and GPU memory hierarchies. As graph datasets grow exponentially, traditional single-node processing becomes a bottleneck. We propose a hybrid approach...

## Introduction
Graph processing is fundamental to social network analysis, recommendation systems, and bioinformatics. The challenge lies in the irregular memory access patterns typical of graph traversal algorithms like BFS and PageRank.

### The Memory Wall
The primary bottleneck in modern graph processing is not compute, but memory bandwidth. Our analysis shows that...

\`\`\`cpp
// Example of optimized edge traversal
void traverse(Graph& g, Node start) {
    for (auto& edge : g.edges(start)) {
        prefetch(edge.target);
        process(edge);
    }
}
\`\`\`

## Methodology
We implemented a custom allocator that groups graph nodes based on connectivity density. High-degree nodes are placed in GPU memory, while the long tail of low-degree nodes resides in host RAM.

## Results
Our benchmarks indicate a **3.5x speedup** over standard CSR (Compressed Sparse Row) implementations on the Graph500 dataset.

## Conclusion
Heterogeneous architectures offer a promising path forward for large-scale graph analytics, provided that data placement is managed intelligently.
    `
  },
  {
    id: "consensus-in-mesh-networks",
    title: "Consensus Mechanisms in Ad-Hoc Mesh Networks",
    date: "2024-05-22",
    summary: "A comparative analysis of Paxos and Raft variants adapted for high-latency, lossy network environments.",
    content: `
# Consensus Mechanisms in Ad-Hoc Mesh Networks

## Overview
Distributed consensus is difficult enough in reliable networks. In ad-hoc mesh networks, where nodes can disappear at any moment and latency is unpredictable, traditional algorithms fail.

## The Problem with Raft
Raft assumes a stable leader. In a mesh network, the "leader" might move out of range or run out of battery. This leads to constant re-elections and system stagnation.

## Proposed Modifications
We introduce a *probabilistic leader heartbeat* mechanism that accounts for signal strength, not just connectivity.

1.  **Signal Strength Weighting**: Votes are weighted by the node's connectivity stability.
2.  **Adaptive Timeouts**: Election timeouts scale dynamically based on observed network jitter.

## Future Work
We plan to simulate this on a physical testbed of 50 Raspberry Pi nodes deployed in an office environment.
    `
  }
];
