import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Github, Play } from "lucide-react";
import { projects, skills } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <Layout>
      <div className="space-y-16">
        {/* Intro */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Computer Science researcher and fullstack engineer.
          </h1>
          <p className="text-lg text-muted-foreground font-serif">
            Passionate about distributed systems, compiler design, and artificial intelligence.
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Languages: </span>
              <span className="text-foreground">{skills.languages.join(", ")}</span>
            </div>
            <div>
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Frontend: </span>
              <span className="text-foreground">{skills.frontend.join(", ")}</span>
            </div>
            <div>
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Backend: </span>
              <span className="text-foreground">{skills.backend.join(", ")}</span>
            </div>
            <div>
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Tools: </span>
              <span className="text-foreground">{skills.tools.join(", ")}</span>
            </div>
            <div className="pt-2">
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Specializations: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.specialties.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Projects */}
        {featuredProjects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Highlighted Projects</h2>
            <div className="space-y-4">
              {featuredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="p-6 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                >
                  <h3 className="text-lg font-bold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 font-serif leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 h-9">
                        <Github className="w-4 h-4" />
                        Code
                      </Button>
                    </a>
                    {project.videoUrl && (
                      <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="gap-2 h-9 text-primary hover:bg-primary/10">
                          <Play className="w-4 h-4" />
                          Demo
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
