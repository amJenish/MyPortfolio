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
  Moon,
  Sun,
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

export default function Layout({
  children,
  fullWidth = false,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const THEME_KEY = "theme";
    let initial = false;

    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === "dark") initial = true;
      else if (saved === "light") initial = false;
      else initial = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    } catch {
      initial = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    }

    // Apply immediately to avoid initial flash.
    try {
      document.documentElement.classList.toggle("dark", initial);
    } catch {
      // ignore
    }

    return initial;
  });
  const email = profile.email;
  const reduceMotion = useReducedMotion();
  const navHover = reduceMotion ? undefined : { y: -1 };
  const navTap = reduceMotion ? undefined : { scale: 0.97 };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", isDark);
      window.localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [isDark]);

  return (
    <div className="relative z-[1] min-h-screen bg-background font-sans text-foreground selection:bg-primary/25">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* ── Header ── */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border/80 bg-background/96 shadow-sm backdrop-blur-md"
            : "border-transparent bg-background/80 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex h-14 w-full max-w-[min(100%,88rem)] items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <span className="flex flex-col leading-tight">
              <span className="font-heading text-[0.9375rem] font-bold tracking-tight text-foreground">
                Jenish Paudel
              </span>
              <span className="font-mono text-[10px] font-medium tracking-widest text-primary uppercase opacity-80">
                Portfolio
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="ml-auto hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const isActive = item.match(location);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="focus-visible:outline-none rounded-lg">
                  <motion.span
                    whileHover={navHover}
                    whileTap={navTap}
                    className={cn(
                      "relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-sans text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 opacity-80" aria-hidden />
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop social links */}
          <div className="hidden items-center gap-1 md:flex">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-transparent p-2 text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-transparent p-2 text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${email}`}
              className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/[0.06] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Send email to ${email}`}
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>Email</span>
            </a>
          </div>

          {/* Night mode toggle */}
          <motion.button
            type="button"
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            onClick={() => setIsDark((d) => !d)}
            className="ml-auto rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:ml-0"
            aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
            title={isDark ? "Day mode" : "Night mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>

          {/* Mobile menu toggle */}
          <motion.button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:ml-0 md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </header>

      <ScrollReadingProgress />

      {/* ── Mobile nav drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[3px] md:hidden"
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
              className="fixed right-0 top-0 z-50 h-full w-[min(100%,22rem)] border-l border-border bg-background shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-6 p-6 pt-20">
                <nav className="flex flex-col gap-1.5" aria-label="Mobile primary">
                  {navItems.map((item) => {
                    const isActive = item.match(location);
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href}>
                        <span
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex gap-2 border-t border-border pt-5">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </div>

                <a
                  href={`mailto:${email}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/[0.06] px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      {fullWidth ? (
        <motion.div
          key={location}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      ) : (
        <main
          id="main-content"
          className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[min(100%,88rem)] px-4 py-10 sm:px-6 sm:py-12 lg:px-12 lg:py-14"
        >
          <motion.div
            key={location}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex w-full max-w-[min(100%,88rem)] flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="text-center sm:text-left">
            <p className="font-heading text-sm font-semibold text-foreground">Jenish Paudel</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Computer Science @ Western University</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
