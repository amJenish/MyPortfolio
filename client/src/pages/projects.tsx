import Layout from "@/components/layout";
import { projects } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Play } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative h-64 lg:h-full min-h-[300px] overflow-hidden bg-muted">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60" />
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2">
                   {project.tags.map(tag => (
                     <Badge key={tag} variant="secondary" className="bg-background/90 backdrop-blur text-xs">
                       {tag}
                     </Badge>
                   ))}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 font-serif">
                  {project.description}
                </p>
                
                <div className="flex gap-4 mt-auto">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
