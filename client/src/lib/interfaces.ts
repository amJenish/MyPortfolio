export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  videoUrl?: string;
  tags: string[];
  featured?: boolean;
  content: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
  abstract: string;
}

export interface KaggleProject {
  id: string;
  title: string;
  date: string;
  description: string;
  githubUrl: string;
}