/**
 * Software / application projects — add a new entry:
 * 1. Add `client/src/content/portfolio/projects/<slug>.page.tsx` (default export + `workPageSections`) and register in `portfolio/registry.ts`.
 * 2. Append a `Project` with `reportSlug` equal to that slug (detail page comes from the TSX report).
 * 3. Optional: `videoUrl`, `highlights`.
 * 4. Run `npm run check` and open `/project/<id>`.
 */

import type { Project } from "../interfaces";

export const projects: Project[] = [
  {
    id: "5",
    title: "[Full-Stack] RAG + LLM study assistant",
    summary: "A study assistant built with RAG and LLM to help students and researchers explore papers and articles effectively.",
    githubUrl: "https://github.com/amJenish/Study-Assistant-AI-with-RAG-and-LLM",
    tags: ["Python", "ElasticSearch", "FastAPI", "LLM", "RAG", "Docker", "React", "BlueprintUI", "Object-Oriented Programming"],
    reportSlug: "sw-5",
    highlights: [],
  },
  {
    id: "2",
    title: "[Backend] Geese Map",
    summary: "A Microservice architecture application built with Java and Spring Boot that allows users to upload images of geese and get a map of the geese in the area.",
    githubUrl: "https://github.com/amJenish/geese-map",
    tags: ["Java", "Spring Boot", "Python", "MySQL", "Microservices", "IBM COS", "Roboflow", "Object-Oriented Programming"],
    reportSlug: "sw-2",
    highlights: [],
  },
  {
    id: "4",
    title: "[In-progress] Reinforcement Learning for Traffic Signal Optimization",
    summary: "A reinforcement learning model for traffic signal optimization currently in progress, built with Pytorch that allows traffic signals to be optimized for the best traffic flow.",
    githubUrl: "https://github.com/amJenish/RL-Traffic-Light-Optimization",
    tags: [
      "Machine Learning",
      "Experiment",
      "Reinforcement Learning",
      "Traffic Signal Optimization",
      "DoubleDQN",
      "SUMO",
      "TracI",
      "Policy Optimization",
      "PyTorch",
      "Object-Oriented Programming",
    ],
    reportSlug: "ml-exp-1",
    highlights: [],
  }
  ,
  {
    id: "6",
    title: "Reply Radar (Email Followup Agent)",
    summary: "Groq + Llama automation for drafted replies and notification-style workflows.",
    githubUrl: "https://github.com/amJenish/ReplyRadar",
    tags: ["Python", "Groq", "LLM", "Automation", "Llama", "Windows", "imaplib", "CustomTkinter", "PyInstaller"],
    reportSlug: "ai-1",
    highlights: [],
  },
  {
    id: "3",
    title: "[Backend] Student enrollment system",
    summary: "A backend for a student enrollment system built with Java and Servlets that allows students to enroll in courses, admins to manage the enrollment system and professors to manage their courses.",
    githubUrl: "https://github.com/amJenish/StudentEnrollmentSystem",
    tags: ["Java", "SQL", "Servlets", "JDBC", "Database Design", "Object-Oriented Programming"],
    reportSlug: "sw-3",
    highlights: [],
  },
];
