import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Home, NotebookText } from "lucide-react";
import { ML_LIST_PATH } from "@/lib/routes";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export default function NotFound() {
  return (
    <Layout>
      <ScrollReveal className="mx-auto flex max-w-lg flex-col items-start gap-6 py-20 text-left">
        <p className="text-xs font-medium text-muted-foreground">404</p>
        <h1 className="text-3xl font-bold font-heading">Page not found</h1>
        <p className="text-sm leading-[1.6] text-muted-foreground">
          That route is not in the app. Check the URL or head back home.
        </p>
        <div className="flex flex-wrap justify-start gap-3">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Projects
            </Button>
          </Link>
          <Link href={ML_LIST_PATH} aria-label="Data-Science, ML and Notebook">
            <Button variant="outline" className="gap-2">
              <NotebookText className="h-4 w-4" />
              Data-Science, ML
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </Layout>
  );
}
