import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { skillCategories } from "@/lib/content/skills";
import { cn } from "@/lib/utils";
import { MOTION_CONFIG as M } from "@/motion/config";
import { useSafeMotion } from "@/motion/useSafeMotion";

export function SkillsShowcase({
  className,
  heading = "Skills",
  description,
}: {
  className?: string;
  heading?: string;
  description?: string | null;
}) {
  const { shouldAnimate, safeTransition } = useSafeMotion();
  const defaultTab = skillCategories[0]?.id ?? "languages";
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const activeCategory = skillCategories.find((c) => c.id === activeTab) ?? skillCategories[0];
  const ease = [...M.easing] as [number, number, number, number];

  return (
    <div className={cn("space-y-5", className)}>
      <div className="space-y-1">
        <h2 id="skills-heading" className="font-heading text-2xl font-bold md:text-3xl">
          {heading}
        </h2>
      </div>
      {description ? (
        <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">{description}</p>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-8">
          <TabsList
            aria-label="Skill categories"
            className="flex h-auto w-full flex-row flex-wrap gap-1.5 rounded-2xl border border-border/70 bg-card/80 p-2.5 shadow-sm md:w-52 md:flex-col md:flex-nowrap md:items-stretch"
          >
            {skillCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                id={`skills-tab-${cat.id}`}
                value={cat.id}
                className={cn(
                  "justify-start rounded-xl border border-transparent px-4 py-2.5 text-left text-sm font-medium transition-all duration-200",
                  "data-[state=active]:border-primary/25 data-[state=active]:bg-primary/[0.09] data-[state=active]:text-primary data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:text-foreground",
                )}
              >
                {cat.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative min-h-[22rem] min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {activeCategory ? (
                <motion.div
                  key={activeCategory.id}
                  role="tabpanel"
                  id={`skills-panel-${activeCategory.id}`}
                  aria-labelledby={`skills-tab-${activeCategory.id}`}
                  initial={shouldAnimate ? { opacity: 0, x: 18 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldAnimate ? { opacity: 0, x: -14 } : undefined}
                  transition={{
                    duration: M.duration.micro,
                    ease,
                    ...safeTransition,
                  }}
                  className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 shadow-md md:p-7"
                >
                  <p className="mb-5 font-mono text-xs font-bold uppercase tracking-widest text-primary">
                    {activeCategory.title}
                  </p>

                  <ul className="flex flex-wrap gap-2.5">
                    {activeCategory.items.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: shouldAnimate ? i * M.skillChipStagger : 0,
                          duration: M.duration.standard,
                          ease,
                          ...safeTransition,
                        }}
                        className="rounded-full border border-border bg-background/90 px-4 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-primary"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
