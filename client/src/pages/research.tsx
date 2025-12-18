import Layout from "@/components/layout";
import { researchPapers } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText } from "lucide-react";

export default function Research() {
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  const selectedPaper = researchPapers.find(p => p.id === selectedPaperId);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Research & Notes</h1>
          <p className="text-muted-foreground font-serif text-lg">
            Papers, technical notes, and exploration logs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* List of papers */}
          <div className="lg:col-span-1 space-y-4">
            {researchPapers.map((paper) => (
              <div 
                key={paper.id}
                onClick={() => setSelectedPaperId(paper.id)}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative",
                  selectedPaperId === paper.id 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                    {paper.date}
                  </Badge>
                  <ChevronRight className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    selectedPaperId === paper.id ? "rotate-90 text-primary" : "group-hover:translate-x-1"
                  )} />
                </div>
                <h3 className={cn(
                  "font-bold text-sm mb-2",
                  selectedPaperId === paper.id ? "text-primary" : "text-foreground"
                )}>
                  {paper.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {paper.summary}
                </p>
              </div>
            ))}
            
            <div className="p-4 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
               <FileText className="w-8 h-8 mb-2 opacity-50" />
               <p className="text-sm">More research coming soon...</p>
            </div>
          </div>

          {/* Paper Reader */}
          <div className="lg:col-span-2 min-h-[500px]">
             {selectedPaper ? (
               <Card className="border-border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <CardHeader className="border-b border-border/50 bg-muted/10 pb-8">
                   <div className="mb-4">
                     <Badge variant="secondary" className="mb-2">Research Paper</Badge>
                     <h2 className="text-2xl md:text-3xl font-bold text-foreground">{selectedPaper.title}</h2>
                   </div>
                   <div className="flex items-center text-sm text-muted-foreground font-mono">
                     <span>Published: {selectedPaper.date}</span>
                     <span className="mx-2">•</span>
                     <span>Replit Research Lab</span>
                   </div>
                 </CardHeader>
                 <CardContent className="pt-8">
                   <article className="prose prose-slate max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-primary">
                     <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                       {selectedPaper.content}
                     </ReactMarkdown>
                   </article>
                 </CardContent>
               </Card>
             ) : (
               <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-muted/10 text-muted-foreground">
                 <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                   <BookOpen className="w-8 h-8 opacity-50" />
                 </div>
                 <h3 className="text-lg font-medium mb-2">Select a paper to read</h3>
                 <p className="text-sm max-w-xs text-center">
                   Click on any research item from the list on the left to view the full markdown content.
                 </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { BookOpen } from "lucide-react";
