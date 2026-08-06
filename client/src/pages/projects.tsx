import * as React from "react";
import Layout from "@/components/layout";
import { PageWrapper } from "@/motion/PageWrapper";
import { WorkListCard } from "@/components/work/WorkListCard";
import { projects, kaggleProjects } from "@/lib/content/registry";
import { mlDetailPath } from "@/lib/routes";
import { ScrollRevealStagger } from "@/components/motion/ScrollRevealStagger";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  scrollRevealRouteDelayChildren,
  scrollRevealRouteDuration,
  scrollRevealRouteStagger,
} from "@/components/motion/scrollMotion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MOTION_CONFIG as M } from "@/motion/config";
import { useSafeMotion } from "@/motion/useSafeMotion";

type Category = "swe" | "data";

export default function Projects() {
  const [category, setCategory] = React.useState<Category>("swe");
  const { shouldAnimate, safeTransition } = useSafeMotion();
  const ease = [...M.easing] as [number, number, number, number];

  return (
    <Layout>
      <PageWrapper>
        <div className="space-y-10">
          <Tabs
            value={category}
            onValueChange={(value) => setCategory(value as Category)}
            className="w-full"
          >
            <TabsList
              aria-label="Project category"
              className="mx-auto flex h-auto w-full max-w-md gap-1.5 rounded-2xl border border-border/70 bg-card/80 p-1.5 shadow-sm sm:w-auto"
            >
              <TabsTrigger
                value="swe"
                className={cn(
                  "flex-1 rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold transition-all duration-200 sm:flex-none sm:px-6",
                  "data-[state=active]:border-primary/25 data-[state=active]:bg-primary/[0.09] data-[state=active]:text-primary data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:text-foreground",
                )}
              >
                SWE
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className={cn(
                  "flex-1 rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold transition-all duration-200 sm:flex-none sm:px-6",
                  "data-[state=active]:border-primary/25 data-[state=active]:bg-primary/[0.09] data-[state=active]:text-primary data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:text-foreground",
                )}
              >
                Data Analytics/Science
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={category}
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldAnimate ? { opacity: 0, y: -8 } : undefined}
              transition={{
                duration: M.duration.micro,
                ease,
                ...safeTransition,
              }}
            >
              {category === "swe" ? (
                <ScrollRevealStagger
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                  stagger={scrollRevealRouteStagger}
                  delayChildren={scrollRevealRouteDelayChildren}
                  duration={scrollRevealRouteDuration}
                >
                  {projects.map((project) => (
                    <WorkListCard
                      key={project.id}
                      href={`/project/${project.id}`}
                      title={project.title}
                      summary={project.summary}
                      tags={project.tags}
                      variant="software"
                      ctaLabel="View project"
                    />
                  ))}
                </ScrollRevealStagger>
              ) : (
                <ScrollRevealStagger
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                  stagger={scrollRevealRouteStagger}
                  delayChildren={scrollRevealRouteDelayChildren}
                  duration={scrollRevealRouteDuration}
                >
                  {kaggleProjects.map((p) => (
                    <WorkListCard
                      key={p.id}
                      href={mlDetailPath(p.id)}
                      title={p.title}
                      summary={p.summary}
                      tags={p.tags}
                      date={p.date}
                      metrics={p.cardMetrics}
                      variant="ml"
                      ctaLabel="View report"
                    />
                  ))}
                </ScrollRevealStagger>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </PageWrapper>
    </Layout>
  );
}
