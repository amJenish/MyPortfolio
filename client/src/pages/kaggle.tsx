import Layout from "@/components/layout";
import { kaggleProjects } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MarkdownView } from "@/components/MarkdownView";
import { ChevronRight, FileText, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Kaggle() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = kaggleProjects.find(p => p.id === selectedId);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">ML, DS & Analytical Projects</h1>
          <p className="text-muted-foreground font-serif text-lg">
            my personal data-science/ML-focued projects. 
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {kaggleProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedId(project.id)}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative",
                  selectedId === project.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                    {project.date}
                  </Badge>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      selectedId === project.id ? "rotate-90 text-primary" : "group-hover:translate-x-1"
                    )}
                  />
                </div>
                <h3
                  className={cn(
                    "font-bold text-sm mb-2",
                    selectedId === project.id ? "text-primary" : "text-foreground"
                  )}
                >
                  {project.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2 min-h-[600px]">
            {selectedProject ? (
              <div className="space-y-8 w-full"> {/* Added w-full here */}
                {/* GitHub Button Section - Centered & Prominent */}
                {selectedProject.githubUrl && (
                  <div className="flex flex-col items-center justify-center space-y-4 p-8 border border-border rounded-lg bg-muted/50">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Github className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <a 
                        href={selectedProject.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button size="lg" className="gap-3 px-8">
                          <Github className="w-5 h-5" />
                          Open GitHub Repository
                        </Button>
                      </a>
                    </div>
                  </div>
                )}

                {/* Title & Description Section */}
                <div className="space-y-6 w-full"> {/* Added w-full here */}
                  <div className="border-b border-border pb-4">
                    <h2 className="text-2xl font-bold mb-4">{selectedProject.title}</h2>
                    <div className="flex items-center">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {selectedProject.date}
                      </Badge>
                    </div>
                  </div>

                  {selectedProject.description && (
  <div className="space-y-4 w-full">
    <h3 className="font-semibold text-lg">Project Report</h3>
    {/* Custom container without prose constraints */}
    <div className="w-full [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2">
      <MarkdownView content={selectedProject.description}/>
    </div>
  </div>
)}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-muted/10 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a project to view</h3>
                <p className="text-sm max-w-xs text-center">
                  Click on a project from the list to view it's details and GitHub repository.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}