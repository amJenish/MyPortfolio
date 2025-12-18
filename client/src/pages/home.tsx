import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Cpu, Globe } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <Layout>
      <section className="space-y-8">
        <div className="space-y-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-4 border border-primary/20">
              Available for collaborations
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Building efficient systems <br className="hidden md:block"/>
              and scalable software.
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground font-serif leading-relaxed max-w-2xl">
            I am a Computer Science researcher and Fullstack Engineer passionate about distributed systems, compiler design, and artificial intelligence.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/projects">
              <Button size="lg" className="group text-base px-8 h-12">
                View Projects
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/research">
              <Button variant="outline" size="lg" className="text-base px-8 h-12 bg-background">
                Read Research
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-border/50">
          <Card 
            icon={Cpu}
            title="Systems Engineering"
            description="Designing robust architectures for high-load applications and distributed networks."
          />
          <Card 
            icon={Code2}
            title="Fullstack Development"
            description="Building end-to-end web applications with modern frameworks like React and Node.js."
          />
          <Card 
            icon={Globe}
            title="Open Source"
            description="Active contributor to various open-source projects in the developer tools ecosystem."
          />
        </div>
      </section>
    </Layout>
  );
}

function Card({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-lg bg-card border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
