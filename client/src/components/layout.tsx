import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Home,
  FolderGit2,
  NotebookText,
  Menu,
  X,
  Mail,
  Github,
  Linkedin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ScrollReadingProgress } from "@/components/motion/ScrollReadingProgress";
import { profile } from "@/lib/content/registry";
import {
  ML_LIST_PATH,
  PAPERWORK_LIST_PATH,
  isMlSection,
  isMlSectionLegacy,
  isPaperworkSection,
  isProjectsSection,
} from "@/lib/routes";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    match: (path: string) => path === "/",
  },
  {
    href: "/projects",
    label: "Projects",
    icon: FolderGit2,
    match: (path: string) => isProjectsSection(path),
  },
  {
    href: ML_LIST_PATH,
    label: "Data & ML",
    icon: NotebookText,
    match: (path: string) => isMlSection(path) || isMlSectionLegacy(path),
  },
  {
    href: PAPERWORK_LIST_PATH,
    label: "Paperwork",
    icon: BookOpen,
    match: (path: string) => isPaperworkSection(path),
  },
] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const email = profile.email;
  const reduceMotion = useReducedMotion();
  const navHover = reduceMotion ? undefined : { y: -1 };
  const navTap = reduceMotion ? undefined : { scale: 0.98 };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="relative z-[1] min-h-screen bg-background font-sans text-foreground selection:bg-primary/25">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md shadow-[0_1px_0_hsl(165_90%_50%_/_0.06)_inset]">
        <div className="mx-auto flex h-[3.25rem] w-full max-w-[min(100%,88rem)] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Jenish Paudel
              </span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Portfolio
              </span>
            </span>
          </Link>

          <nav
            className="ml-auto hidden items-center gap-0.5 md:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const isActive = item.match(location);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="focus-visible:outline-none rounded-md">
                  <motion.span
                    whileHover={navHover}
                    whileTap={navTap}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 opacity-85" aria-hidden />
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary"
                        aria-hidden
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-1.5 md:flex">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-transparent p-2 text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-transparent p-2 text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/70 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Send email to ${email}`}
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Email</span>
            </a>
          </div>

          <motion.button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            className="ml-auto rounded-md border border-border p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:ml-0 md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </header>

      <ScrollReadingProgress />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-50 h-full w-[min(100%,20rem)] border-l border-border bg-background shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-6 p-6 pt-20">
                <nav className="flex flex-col gap-1" aria-label="Mobile primary">
                  {navItems.map((item) => {
                    const isActive = item.match(location);
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href}>
                        <span
                          className={cn(
                            "flex items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-sm font-medium",
                            isActive
                              ? "border-primary/25 bg-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted/50",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="flex gap-2 border-t border-border pt-4">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </div>
                <a
                  href={`mailto:${email}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main
        id="main-content"
        className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[min(100%,88rem)] px-4 py-8 sm:px-6 sm:py-10 lg:px-12"
      >
        <motion.div
          key={location}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.48,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-border/80 py-8">
        <div className="mx-auto flex w-full max-w-[min(100%,88rem)] flex-col items-center justify-between gap-4 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p>Jenish Paudel — Computer Science @ Western University</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={profile.github}
              className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${email}`}
              className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
