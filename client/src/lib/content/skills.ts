/**
 * Skills shown on the home page (`SkillsShowcase`).
 * Add a category or extend `items` as needed; keep `id` stable (used as tab value).
 */
export type SkillCategory = {
  id: string;
  title: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    items: ["Python", "Java", "SQL", "JavaScript"],
  },
  {
    id: "core",
    title: "Core CS",
    items: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "System Design",
      "Database Design",
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks",
    items: ["React", "FastAPI", "Spring Boot"],
  },
  {
    id: "libraries",
    title: "Libraries",
    items: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "BeautifulSoup"],
  },
  {
    id: "tools",
    title: "Tools & Technologies",
    items: ["Power BI", "Git", "GitHub", "Docker", "REST APIs", "CI/CD", "Elasticsearch"],
  },
  {
    id: "aiml",
    title: "AI/ML",
    items: [
      "Natural Language Processing (NLP)",
      "Retrieval-Augmented Generation (RAG)",
      "Large Language Model (LLM) APIs",
      "Groq API",
      "Reinforcement Learning",
    ],
  },
];

/** Legacy shape for any imports expecting `skills.languages` etc. */
export const skills = {
  languages: skillCategories.find((c) => c.id === "languages")!.items,
  coreCS: skillCategories.find((c) => c.id === "core")!.items,
  frameworks: skillCategories.find((c) => c.id === "frameworks")!.items,
  libraries: skillCategories.find((c) => c.id === "libraries")!.items,
  tools: skillCategories.find((c) => c.id === "tools")!.items,
  aiml: skillCategories.find((c) => c.id === "aiml")!.items,
};
