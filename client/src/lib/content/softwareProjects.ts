/**
 * Software / application projects — add a new entry:
 * 1. Add `client/src/content/portfolio/projects/<slug>.page.tsx` (default export + `workPageSections`) and register in `portfolio/registry.ts`.
 * 2. Append a `Project` with `reportSlug` equal to that slug (detail page comes from the TSX report).
 * 3. Optional: `videoUrl`, `highlights`.
 * 4. Run `npm run check` and open `/project/<id>`.
 *
 * Keep `tags` to a single technical label shown on listing cards.
 */

import type { Project } from "../interfaces";

export const projects: Project[] = [
  {
    id: "5",
    title: "[Full-Stack] RAG + LLM study assistant",
    summary: "A full-stack retrieval-augmented generation system for querying uploaded research papers, using semantic chunking, query rewriting, and grounded LLaMA generation to produce cited, hallucination-resistant answers.",
    githubUrl: "https://github.com/amJenish/Study-Assistant-AI-with-RAG-and-LLM",
    reportSlug: "sw-5",
    tags: ["RAG & LLM"],
    highlights: [],
  },
  {
    id: "2",
    title: "[Backend] Geese Map",
    summary: "A microservices backend for a location-aware social heatmap, where uploaded photos are verified with an ML model, parsed for GPS metadata, and aggregated into a heatmap dataset across five dedicated services.",
    githubUrl: "https://github.com/amJenish/geese-map",
    reportSlug: "sw-2",
    tags: ["Microservices"],
    highlights: [],
  },
  {
    id: "4",
    title: "Smart Traffic Light Controller (Reinforcement Learning + SUMO)",
    summary:
      "An end-to-end system that trains an AI to control a traffic light from real intersection count data, compares it against fixed-time and actuated baselines in SUMO, and exports a learned signal schedule through a Streamlit app or the CLI.",
    githubUrl: "https://github.com/amJenish/RL-Traffic-Light-Optimization",
    reportSlug: "ml-exp-1",
    tags: ["Reinforcement Learning"],
    highlights: [],
  },
  {
    id: "6",
    title: "Reply Radar (Email Followup Agent)",
    summary: "A lightweight Windows background agent that monitors Gmail and uses an LLM to distinguish emails that need a response from noise, delivering native toast notifications without interrupting your workflow.",
    githubUrl: "https://github.com/amJenish/ReplyRadar",
    reportSlug: "ai-1",
    tags: ["LLM Agent"],
    highlights: [],
  },
  {
    id: "3",
    title: "[Backend] Student enrollment system",
    summary: "A backend for a student enrollment system built with Java and Servlets that allows students to enroll in courses, admins to manage the enrollment system and professors to manage their courses.",
    githubUrl: "https://github.com/amJenish/StudentEnrollmentSystem",
    reportSlug: "sw-3",
    tags: ["Java Servlets"],
    highlights: [],
  },
];
