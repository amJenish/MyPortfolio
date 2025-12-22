import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import { projects, skills, researchPapers, kaggleProjects } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Home() {
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <Layout>
      <div className="space-y-20">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Engineering systems that scale.
            </h1>
            <p className="text-xl text-muted-foreground font-serif max-w-3xl leading-relaxed">
              Computer Science researcher and fullstack engineer building high-performance distributed systems, optimizing compilers, and exploring machine learning applications.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>
            </a>
          </div>
        </section>

        {/* Core Strengths */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Core Strengths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 border border-border rounded-lg bg-card">
              <p className="font-semibold text-sm uppercase tracking-wide text-primary mb-2">Distributed Systems</p>
              <p className="text-sm text-muted-foreground">Consensus algorithms, fault tolerance, large-scale architecture design</p>
            </div>
            <div className="p-5 border border-border rounded-lg bg-card">
              <p className="font-semibold text-sm uppercase tracking-wide text-primary mb-2">Compiler Design</p>
              <p className="text-sm text-muted-foreground">LLVM optimization, memory efficiency, performance tuning</p>
            </div>
            <div className="p-5 border border-border rounded-lg bg-card">
              <p className="font-semibold text-sm uppercase tracking-wide text-primary mb-2">Full Stack Development</p>
              <p className="text-sm text-muted-foreground">React, Node.js, PostgreSQL, system architecture</p>
            </div>
          </div>
        </section>

        {/* Technical Toolkit */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Technical Toolkit</h2>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Frameworks & Tools</p>
              <div className="flex flex-wrap gap-2">
                {[...skills.frontend, ...skills.backend, ...skills.tools].map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Sections */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Work & Research</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Projects */}
            <Link href="/projects" className="group">
              <div className="p-6 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Projects</h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Engineering projects showcasing systems design and technical implementation
                </p>
                <div className="text-2xl font-bold text-primary">{projects.length}</div>
                <p className="text-xs text-muted-foreground mt-1">projects</p>
              </div>
            </Link>

            {/* Research */}
            <Link href="/research" className="group">
              <div className="p-6 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Research</h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Academic papers and technical research in computer systems
                </p>
                <div className="text-2xl font-bold text-primary">{researchPapers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">papers</p>
              </div>
            </Link>

            {/* Kaggle */}
            <Link href="/kaggle" className="group">
              <div className="p-6 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Kaggle</h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Machine learning competition notebooks and data science projects
                </p>
                <div className="text-2xl font-bold text-primary">{kaggleProjects.length}</div>
                <p className="text-xs text-muted-foreground mt-1">competitions</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Project */}
        {featuredProjects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Featured</h2>
            <Link href={`/project/${featuredProjects[0].id}`}>
              <div className="group p-6 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{featuredProjects[0].title}</h3>
                <p className="text-muted-foreground text-sm mb-4 font-serif leading-relaxed">
                  {featuredProjects[0].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredProjects[0].tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
            <div className="flex gap-3 pt-2">
              <a href={featuredProjects[0].githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="w-4 h-4" />
                  View Code
                </Button>
              </a>
              <Link href={`/project/${featuredProjects[0].id}`}>
                <Button size="sm" className="gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
