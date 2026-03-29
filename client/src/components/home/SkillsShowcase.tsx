import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { skillCategories } from "@/lib/content/skills";
import { cn } from "@/lib/utils";

export function SkillsShowcase({
  className,
  heading = "Skills",
  description = "Pick a category to see skills in that area.",
}: {
  className?: string;
  heading?: string;
  description?: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const defaultTab = skillCategories[0]?.id ?? "languages";
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const activeCategory = skillCategories.find((c) => c.id === activeTab) ?? skillCategories[0];

  return (
    <div className={cn("space-y-4", className)}>
      <h2 id="skills-heading" className="font-heading text-xl font-bold md:text-2xl">
        {heading}
      </h2>
      {description ? <p className="max-w-xl text-sm text-muted-foreground">{description}</p> : null}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:gap-10">
          <TabsList
            aria-label="Skill categories"
            className="flex h-auto w-full flex-row flex-wrap gap-1 rounded-2xl border border-border/80 bg-card/70 p-2 shadow-sm md:w-52 md:flex-col md:flex-nowrap md:items-stretch"
          >
            {skillCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                id={`skills-tab-${cat.id}`}
                value={cat.id}
                className={cn(
                  "justify-start rounded-xl border border-transparent px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                  "data-[state=active]:border-primary/25 data-[state=active]:bg-primary/[0.08] data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/50",
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
                  initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/[0.04] p-5 shadow-md md:p-6"
                >
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">{activeCategory.title}</p>
                  <ul className="flex flex-wrap gap-2">
                    {activeCategory.items.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          delay: reduceMotion ? 0 : 0.04 + i * 0.03,
                          type: "spring",
                          stiffness: 420,
                          damping: 26,
                        }}
                        className="rounded-full border border-primary/12 bg-background/80 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm"
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
