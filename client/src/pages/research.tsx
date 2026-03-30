import Layout from "@/components/layout";
import { researchPapers } from "@/lib/content/registry";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, Download, ExternalLink } from "lucide-react";
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
    <div className="space-y-3 text-left text-[0.9375rem] leading-[1.75] text-muted-foreground">
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
      <div className="space-y-10">

        {/* ── Hero header ── */}
        <ScrollReveal
          as="header"
          className="paperwork-hero max-w-2xl space-y-4 rounded-3xl border border-border/70 p-8 text-left shadow-md md:p-10"
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Paperwork
          </p>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Papers &amp; PDFs
          </h1>
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            Long-form write-ups and research documents. Select a paper to preview and download.
          </p>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/20" aria-hidden />
        </ScrollReveal>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

          {/* ── Paper list (left column) ── */}
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
                    "paperwork-list-item group w-full rounded-2xl border p-4 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-md ring-1 ring-primary/15"
                      : "border-border bg-card hover:border-primary/35 hover:bg-muted/30",
                  )}
                >
                  <div className="mb-2.5 flex items-start justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] text-muted-foreground"
                    >
                      {paper.date}
                    </Badge>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        selected ? "rotate-90 text-primary" : "group-hover:translate-x-0.5",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "font-heading text-sm font-semibold leading-snug",
                      selected ? "text-primary" : "text-foreground",
                    )}
                  >
                    {paper.title}
                  </span>
                </button>
              );
            })}
          </ScrollRevealStagger>

          {/* ── Paper detail (right column) ── */}
          <div className="min-h-[540px] lg:col-span-2">
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
                  className="space-y-6 rounded-3xl border border-border bg-card p-7 shadow-md md:p-9"
                >
                  {/* Paper title + download */}
                  <div className="border-b border-border pb-5">
                    <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                      {selectedPaper.title}
                    </h2>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-muted-foreground">
                        Published: <span className="font-medium text-foreground">{selectedPaper.date}</span>
                      </p>
                      <a href={selectedPaper.pdfUrl} download target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2 font-semibold">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* PDF preview placeholder */}
                  <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm">
                      <FileText className="h-8 w-8" />
                    </div>
                    <p className="mt-4 font-heading font-semibold text-foreground">PDF Document</p>
                    <p className="mt-1 text-sm text-muted-foreground">Click below to open in your browser</p>
                    <a href={selectedPaper.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-5">
                      <Button size="sm" className="gap-2 shadow-md">
                        <ExternalLink className="h-4 w-4" />
                        Open in browser
                      </Button>
                    </a>
                  </div>

                  {/* Abstract / summary */}
                  {selectedPaper.abstract ? (
                    <div className="space-y-3 border-t border-border pt-6">
                      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                        Summary
                      </p>
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
                  className="flex h-full min-h-[420px] flex-col items-start justify-center rounded-3xl border border-dashed border-border bg-muted/10 p-10 text-left"
                >
                  <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-muted/60">
                    <FileText className="h-9 w-9 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                    Select a paper
                  </h3>
                  <p className="mt-2 max-w-xs text-[0.9375rem] leading-relaxed text-muted-foreground">
                    Choose an item on the left to preview details and open the PDF.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
