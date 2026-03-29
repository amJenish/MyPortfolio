import Layout from "@/components/layout";
import { WorkDetailLayout } from "@/components/work/WorkDetailLayout";
import { kaggleProjects } from "@/lib/content/registry";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { ML_LIST_PATH } from "@/lib/routes";

export default function MlDetail() {
  const params = useParams();
  const id = params.id as string;
  const entry = kaggleProjects.find((p) => p.id === id);

  if (!entry) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg space-y-6 py-16 text-left">
          <Link
            href={ML_LIST_PATH}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Data-Science, ML and Notebook
          </Link>
          <h1 className="text-2xl font-bold font-heading">Entry not found</h1>
          <p className="text-sm text-muted-foreground">That ID is not in the list.</p>
          <Link href={ML_LIST_PATH}>
            <Button>All entries</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <WorkDetailLayout
      entry={entry}
      backHref={ML_LIST_PATH}
      backLabel="Back to Data-Science, ML and Notebook"
      categoryLabel="Data-Science, ML and Notebook"
    />
  );
}
