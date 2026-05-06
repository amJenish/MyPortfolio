import { useEffect, type ReactNode } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  motion,
} from "framer-motion";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Research from "@/pages/research";
import Ml from "@/pages/ml";
import MlDetail from "@/pages/ml-detail";
import { useHashLocation } from "wouter/use-hash-location";
import { SiteHeader } from "@/components/SiteHeader";
import { MOTION_CONFIG as M } from "@/motion/config";
import { useSafeMotion } from "@/motion/useSafeMotion";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

const easeTuple = [...M.easing] as [number, number, number, number];

function RouteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { safeTransition, shouldAnimate } = useSafeMotion();

  if (!shouldAnimate) {
    return (
      <div key={location} style={{ minHeight: "100%" }}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{
          opacity: M.routeEnter.opacity,
          y: M.routeEnter.y,
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: M.duration.routeEnter,
            ease: easeTuple,
            ...safeTransition,
          },
        }}
        exit={{
          opacity: M.routeExit.opacity,
          y: M.routeExit.y,
          transition: {
            duration: M.duration.routeExit,
            ease: easeTuple,
            ...safeTransition,
          },
        }}
        style={{ minHeight: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  return (
    <div className="relative z-[1] min-h-screen bg-background font-sans text-foreground selection:bg-primary/25">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <RouteShell>
        <Switch>
          <Route path="/projects" component={Projects} />
          <Route path="/project/:id" component={ProjectDetail} />
          <Route path="/paperwork" component={Research} />
          <Route path="/research" component={Research} />
          <Route path="/ml/:id" component={MlDetail} />
          <Route path="/ml" component={Ml} />
          <Route path="/data/:id" component={MlDetail} />
          <Route path="/data" component={Ml} />
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </RouteShell>
    </div>
  );
}

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <ScrollToTop />
      <AppShell />
    </WouterRouter>
  );
}

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <Router />
    </LazyMotion>
  );
}

export default App;
