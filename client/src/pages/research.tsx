import Layout from "@/components/layout";
import { researchPapers, kaggleProjects } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type ContentType = "research" | "kaggle";

interface ResearchItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  pdfUrl: string;
}

export default function Research() {
  const [activeTab, setActiveTab] = useState<ContentType>("research");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const allItems = activeTab === "research" ? researchPapers : kaggleProjects;
  const selectedItem = allItems.find(item => item.id === selectedId);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Research & Projects</h1>
          <p className="text-muted-foreground font-serif text-lg">
            Academic papers and Kaggle competition notebooks.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => {
              setActiveTab("research");
              setSelectedId(null);
            }}
            className={cn(
              "pb-3 font-medium text-sm transition-colors border-b-2 border-transparent",
              activeTab === "research"
                ? "text-primary border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Research
          </button>
          <button
            onClick={() => {
              setActiveTab("kaggle");
              setSelectedId(null);
            }}
            className={cn(
              "pb-3 font-medium text-sm transition-colors border-b-2 border-transparent",
              activeTab === "kaggle"
                ? "text-primary border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Kaggle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {allItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative",
                  selectedId === item.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                    {item.date}
                  </Badge>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      selectedId === item.id ? "rotate-90 text-primary" : "group-hover:translate-x-1"
                    )}
                  />
                </div>
                <h3
                  className={cn(
                    "font-bold text-sm mb-2",
                    selectedId === item.id ? "text-primary" : "text-foreground"
                  )}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
              </div>
            ))}
          </div>

          {/* PDF Viewer */}
          <div className="lg:col-span-2 min-h-[600px]">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Published: {selectedItem.date}
                    </p>
                    <a href={selectedItem.pdfUrl} download target="_blank" rel="noopener noreferrer">
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
                      <p className="text-sm text-muted-foreground mb-4">
                        Click the download button above to view the full PDF
                      </p>
                      <a href={selectedItem.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2">
                          <FileText className="w-4 h-4" />
                          Open in Browser
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-muted/10 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Select a {activeTab === "research" ? "paper" : "notebook"} to view
                </h3>
                <p className="text-sm max-w-xs text-center">
                  Click on any item from the list to view the PDF document.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
