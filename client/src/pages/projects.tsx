import Layout from "@/components/layout";
import { projects } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Play, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Projects() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground font-serif text-lg">
            A selection of engineering projects and experiments.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="group p-6 lg:p-8 border border-border rounded-xl bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/project/${project.id}`}>
                <div className="space-y-4 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {project.title}
                    </h2>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed font-serif">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
              
              <div className="flex gap-4 mt-6 pt-4 border-t border-border/50">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Github className="w-4 h-4" />
                    View Code
                  </Button>
                </a>
                {project.videoUrl && (
                  <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                      <Play className="w-4 h-4" />
                      Watch Demo
                    </Button>
                  </a>
                )}
                <Link href={`/project/${project.id}`}>

                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
