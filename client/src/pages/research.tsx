import Layout from "@/components/layout";
import { researchPapers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Research() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPaper = researchPapers.find(p => p.id === selectedId);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Research</h1>
          <p className="text-muted-foreground font-serif text-lg">
            Academic papers and personal research.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {researchPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => setSelectedId(paper.id)}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative",
                  selectedId === paper.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                    {paper.date}
                  </Badge>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      selectedId === paper.id ? "rotate-90 text-primary" : "group-hover:translate-x-1"
                    )}
                  />
                </div>
                <h3
                  className={cn(
                    "font-bold text-sm mb-2",
                    selectedId === paper.id ? "text-primary" : "text-foreground"
                  )}
                >
                  {paper.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{paper.summary}</p>
              </div>
            ))}
          </div>

          {/* PDF Viewer */}
          <div className="lg:col-span-2 min-h-[600px]">
            {selectedPaper ? (
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold mb-2">{selectedPaper.title}</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Published: {selectedPaper.date}
                    </p>
                    <a href={selectedPaper.pdfUrl} download target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="border border-border rounded-lg bg-muted/50 p-6 flex flex-col items-center justify-center min-h-[500px]">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">PDF Document</h3>
                      <a href={selectedPaper.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2">
                          <FileText className="w-4 h-4" />
                          Open in Browser
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>

                                {/* Abstract Section */}
                {"abstract" in selectedPaper && selectedPaper.abstract && (
                  <div className="space-y-4 pt-4">
                    <h3 className="font-semibold text-lg">Abstract</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {selectedPaper.abstract} 
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-muted/10 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a paper to view</h3>
                <p className="text-sm max-w-xs text-center">
                  Click on any research paper from the list to view the PDF document.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
