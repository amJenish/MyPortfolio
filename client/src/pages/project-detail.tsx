import Layout from "@/components/layout";
import { WorkDetailLayout } from "@/components/work/WorkDetailLayout";
import { projects } from "@/lib/content/registry";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, Link } from "wouter";

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg space-y-6 py-16 text-left">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
          <h1 className="text-2xl font-bold">Project not found</h1>
          <p className="text-muted-foreground text-sm">
            That ID is not in the list.
          </p>
          <Link href="/projects">
            <Button>All projects</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <WorkDetailLayout
      entry={project}
      backHref="/projects"
      backLabel="Back to projects"
      categoryLabel="Software"
    />
  );
}
