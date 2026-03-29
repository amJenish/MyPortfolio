import Layout from "@/components/layout";
import { researchPapers } from "@/lib/content/registry";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ScrollRevealStagger } from "@/components/motion/ScrollRevealStagger";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { scrollEase } from "@/components/motion/scrollMotion";

function PlainAbstract({ text }: { text: string }) {
  const blocks = text
    .trim()
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className="space-y-3 text-left text-sm leading-[1.6] text-muted-foreground">
      {blocks.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

export default function PaperworkPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPaper = researchPapers.find((p) => p.id === selectedId);
  const reduceMotion = useReducedMotion();

  return (
    <Layout>
      <div className="space-y-8">
        <ScrollReveal as="header" className="paperwork-hero max-w-2xl space-y-3 rounded-2xl border border-border/80 bg-gradient-to-br from-card via-background to-primary/[0.04] p-6 text-left shadow-sm md:p-8">
          <p className="text-xs font-medium text-primary">Paperwork</p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Papers &amp; PDFs
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            Long-form write-ups. Open a PDF for the full document.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <ScrollRevealStagger
            className="flex flex-col gap-2 lg:col-span-1"
            role="navigation"
            aria-label="Paper list"
            stagger={0.055}
            delayChildren={0.06}
          >
            {researchPapers.map((paper) => {
              const selected = selectedId === paper.id;
              return (
                <button
                  key={paper.id}
                  type="button"
                  onClick={() => setSelectedId(paper.id)}
                  className={cn(
                    "paperwork-list-item w-full rounded-xl border p-4 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-md ring-1 ring-primary/15"
                      : "border-border bg-card hover:border-primary/35 hover:bg-muted/40",
                  )}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                      {paper.date}
                    </Badge>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        selected ? "rotate-90 text-primary" : "",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold leading-snug",
                      selected ? "text-primary" : "text-foreground",
                    )}
                  >
                    {paper.title}
                  </span>
                </button>
              );
            })}
          </ScrollRevealStagger>

          <div className="min-h-[520px] lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedPaper ? (
                <motion.div
                  key={selectedPaper.id}
                  role="region"
                  aria-label="Paper details"
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: scrollEase }}
                  className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">
                      {selectedPaper.title}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-muted-foreground">Published: {selectedPaper.date}</p>
                      <a href={selectedPaper.pdfUrl} download target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>

                  <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <FileText className="h-7 w-7" />
                    </div>
                    <p className="mt-4 font-semibold text-foreground">PDF</p>
                    <a href={selectedPaper.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3">
                      <Button size="sm" className="gap-2 shadow-md">
                        <FileText className="h-4 w-4" />
                        Open in browser
                      </Button>
                    </a>
                  </div>

                  {selectedPaper.abstract ? (
                    <div className="max-w-3xl space-y-3 border-t border-border pt-6">
                      <h3 className="text-xs font-medium text-muted-foreground">Summary</h3>
                      <PlainAbstract text={selectedPaper.abstract} />
                    </div>
                  ) : null}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  role="status"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: scrollEase }}
                  className="flex h-full min-h-[400px] flex-col items-start justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-left leading-[1.6] text-muted-foreground"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                    <FileText className="h-8 w-8 opacity-50" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">Select a paper</h3>
                  <p className="mt-2 max-w-xs text-sm">Choose an item on the left to preview details and open the PDF.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
