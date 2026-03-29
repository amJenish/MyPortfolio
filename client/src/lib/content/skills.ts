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
    items: ["Java", "Python", "C++", "JavaScript", "SQL"],
  },
  {
    id: "core",
    title: "Core CS",
    items: [
      "Data structures & algorithms",
      "Object-oriented programming",
      "System design",
      "Databases",
      "Debugging & problem solving",
      "Unit testing",
      "Git & version control",
      "CI/CD concepts"
    ],
  },
  {
    id: "ml",
    title: "Machine learning",
    items: [
      "Neural networks",
      "Supervised learning",
      "Reinforcement learning",
      "Exploratory data analysis",
      "Feature engineering",
      "Hyperparameter tuning",
      "Model evaluation & validation",
      "NLP",
      "TensorFlow",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    items: [
      "REST API design",
      "Client–server architecture",
      "Authentication & authorization",
      "Concurrency & multithreading",
      "Database design",
      "Microservices",
      "Caching",
    ],
  },
];

/** Legacy shape for any imports expecting `skills.languages` etc. */
export const skills = {
  languages: skillCategories.find((c) => c.id === "languages")!.items,
  coreCS: skillCategories.find((c) => c.id === "core")!.items,
  machineLearning: skillCategories.find((c) => c.id === "ml")!.items,
  backendConcepts: skillCategories.find((c) => c.id === "backend")!.items,
};
