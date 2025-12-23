import Layout from "@/components/layout";
import { projects } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { MarkdownView } from "@/components/MarkdownView";
import { Button } from "@/components/ui/button";
import { Github, Play, ArrowLeft } from "lucide-react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <Layout>
        <div className="space-y-6">
          <Link href="/projects">
            <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </button>
          </Link>
          <div className="text-center space-y-4 py-12">
            <h1 className="text-3xl font-bold">Project not found</h1>
            <p className="text-muted-foreground">
              The project you're looking for doesn't exist.
            </p>
            <Link href="/projects">
              <Button>View All Projects</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Back Button */}
        <Link href="/projects">
          <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
        </Link>

        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {project.title}
            </h1>
            {project.featured && (
              <Badge variant="secondary" className="w-fit">
                Featured Project
              </Badge>
            )}
          </div>
          
          <p className="text-lg text-muted-foreground font-serif leading-relaxed max-w-3xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-4">
            {project.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Key Details */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-2">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Links
                </h3>
                <div className="flex flex-col gap-2">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button 
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
>
                      <Github className="w-4 h-4" />
                      View Source Code
                    </Button>
                  </a>
                  {project.videoUrl && (
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2">
                        <Play className="w-4 h-4" />
                        Watch Demo Video
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Description */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">About This Project</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed font-serif">
              {<MarkdownView content={project.content} />}
            </p>
          </div>
        </section>

        {/* Skills Demonstrated */}
        <section className="space-y-6 border-t border-border pt-8">
          <h2 className="text-2xl font-bold">Skills Demonstrated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.tags.map((tag, idx) => (
              <div key={idx} className="p-4 border border-border/50 rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">{tag}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Used in implementation and architecture
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="border-t border-border pt-8 flex gap-4">
          <Link href="/projects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to All Projects
            </Button>
          </Link>
        </div>
      </motion.div>
    </Layout>
  );
}
