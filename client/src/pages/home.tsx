import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Play } from "lucide-react";
import { Link } from "wouter";
import { projects, skills } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <Layout>
      <section className="space-y-12">
        <div className="space-y-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-4 border border-primary/20">
              Available for collaborations
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Building efficient systems <br className="hidden md:block"/>
              and scalable software.
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground font-serif leading-relaxed max-w-2xl">
            I am a Computer Science researcher and Fullstack Engineer passionate about distributed systems, compiler design, and artificial intelligence.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/projects">
              <Button size="lg" className="group text-base px-8 h-12">
                View Projects
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/research">
              <Button variant="outline" size="lg" className="text-base px-8 h-12 bg-background">
                Read Research
              </Button>
            </Link>
          </div>
        </div>

        {/* Highlighted Projects */}
        {featuredProjects.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-border/50">
            {featuredProjects.map((project) => (
              <div 
                key={project.id}
                className="group p-6 border border-border rounded-lg bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors flex-1">
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 font-serif">
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
                    <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
                      <Github className="w-3.5 h-3.5" />
                      Code
                    </Button>
                  </a>
                  {project.videoUrl && (
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="gap-1.5 h-9 text-xs text-primary hover:text-primary/80 hover:bg-primary/10">
                        <Play className="w-3.5 h-3.5" />
                        Demo
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        <div className="space-y-6 pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold">Skills & Expertise</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {skills.frontend.map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {skills.backend.map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tools & Infrastructure</h3>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {skills.specialties.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
