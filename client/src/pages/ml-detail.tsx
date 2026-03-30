import { kaggleProjects } from "@/lib/content/registry";
import { getWorkPage } from "../content/portfolio/registry.ts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, Link } from "wouter";
import Layout from "@/components/layout";

export default function MlDetail() {
  const params = useParams();
  const notebookId = params.id as string;
  const notebook = kaggleProjects.find((n) => n.id === notebookId);

  // Error state: notebook not found
  if (!notebook) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg space-y-6 py-16 text-left">
          <Link
            href="/data-ml"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Data & ML
          </Link>
          <h1 className="text-2xl font-bold">Notebook not found</h1>
          <p className="text-muted-foreground text-sm">
            That ID is not in the list.
          </p>
          <Link href="/data-ml">
            <Button>All notebooks</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const entry = getWorkPage(notebook.reportSlug);

  // Error state: no report page found
  if (!entry) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg space-y-6 py-16 text-left">
          <Link
            href="/data-ml"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Data & ML
          </Link>
          <h1 className="text-2xl font-bold">No report page found</h1>
          <p className="text-muted-foreground text-sm">
            This notebook does not have a registered report page yet.
          </p>
          <Link href="/data-ml">
            <Button>All notebooks</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const { Page, sections, ownsHero } = entry;

  // Render the work page full-width with navbar and footer preserved
  return (
    <Layout fullWidth>
      <Page
        entry={notebook}
        backHref="/data-ml"
        backLabel="Back to Data & ML"
        categoryLabel="Data & ML"
        sections={sections}
        ownsHero={ownsHero ?? false}
      />
    </Layout>
  );
}
