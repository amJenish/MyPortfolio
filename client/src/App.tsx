import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Research from "@/pages/research";
import Ml from "@/pages/ml";
import MlDetail from "@/pages/ml-detail";
import { useHashLocation } from "wouter/use-hash-location";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <ScrollToTop />
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
    </WouterRouter>
  );
}

function App() {
  return <Router />;
}

export default App;
