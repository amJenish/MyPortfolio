import { Switch, Route, Router as WouterRouter} from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Research from "@/pages/research";
import Kaggle from "@/pages/kaggle";
import { useHashLocation } from "wouter/use-hash-location";

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/projects" component={Projects} />
        <Route path="/project/:id" component={ProjectDetail} />
        <Route path="/research" component={Research} />
        <Route path="/data" component={Kaggle} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
