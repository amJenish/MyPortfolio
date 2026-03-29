import type { ResearchPaper } from "../interfaces";

export { projects } from "./softwareProjects";
export { kaggleProjects } from "./mlProjects";

const PROFILE_BIO =
  "I’m a Computer Science student at Western University with an interest in backend systems, machine learning, and data-driven applications. I enjoy designing reliable software architectures and building systems that solve real-world problems using clean engineering practices and scalable technologies. My projects focus on combining solid software engineering with practical applications of data and machine learning.";

const SVM_ABSTRACT = `This paper walks through the support vector machine from geometry and optimization: margins, the kernel trick, and why soft margins matter in practice. The goal is learn the intuition tied to the math behind SVMs.`;

const ARCH_CD_ABSTRACT = `This is a presentation about CI/CD (focus on CD), converted into a paperwork. It talks about how software architecture has changed in the current age of Continuous Delivery.`;

export const profile = {
  name: "Jenish Paudel",
  role: "Computer Science @ Western University",
  bio: PROFILE_BIO,
  email: "jeni.paudel@gmail.com",
  github: "https://github.com/amJenish",
  linkedin: "https://www.linkedin.com/in/jenish-paudel-52687b260/",
};

export { skillCategories, skills } from "./skills";

export const researchPapers: ResearchPaper[] = [
  {
    id: "research-1",
    title: "Deconstructing the Support Vector Machine: A Mathematical Analysis",
    date: "2025-12-20",
    pdfUrl: "/portfolio/research/Deconstructing SVMs.pdf",
    abstract: SVM_ABSTRACT,
  },
  {
    id: "research-2",
    title: "Architecture in the Age of Continuous Delivery",
    date: "2025-11-30",
    pdfUrl: "/portfolio/research/Architecture_in_the_Age_of_Continuous_Delivery.pdf",
    abstract: ARCH_CD_ABSTRACT,
  },
];
