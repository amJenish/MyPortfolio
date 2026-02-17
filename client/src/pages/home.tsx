import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Mail, Copy } from "lucide-react";
import { profile, projects, skills, researchPapers, kaggleProjects } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const featuredProjects = projects.filter(p => p.featured);
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Show the email on screen
    setShowEmail(true);
    
    // Also copy to clipboard
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    
    // Hide after 3 seconds
    setTimeout(() => {
      setShowEmail(false);
      setCopied(false);
    }, 3000);
  };

  // Add click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.email-container')) {
        setShowEmail(false);
      }
    };

    if (showEmail) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showEmail]);

  return (
    <Layout>
      <div className="space-y-12"> {/* Reduced from space-y-20 */}
        {/* Hero Section - Reduced height */}
        <section className="space-y-6">
          <div className="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden"> {/* Reduced from 90vh */}
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={profile.heroImage}
                alt="Background"
                className="w-full h-full object-cover opacity-30 dark:opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" /> {/* Adjusted gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-secondary text-secondary-foreground text-sm font-mono mb-4 border border-border"> {/* Reduced mb-6 to mb-4 */}
                  {profile.role}
                </span>
                <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-4 text-foreground"> {/* Reduced text size and mb-6 to mb-4 */}
                  <span className="text-muted-foreground">Jenish Paudel</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"> {/* Reduced mb-10 to mb-8 */}
                  {profile.bio}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                  <Link href="/projects">
                    <Button size="lg" className="h-12 px-8 text-base">
                      View Projects <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <div className="flex gap-4 email-container">
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleEmailClick}
                      className="relative"
                    >
                      {copied ? <Copy className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                      
                      {/* Email Popup */}
                      {showEmail && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64"
                        >
                          <div className="bg-popover text-popover-foreground rounded-lg border shadow-lg p-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Mail className="w-4 h-4" />
                                <span className="font-medium">Email {copied ? "Copied!" : ""}</span>
                              </div>
                              <div className="bg-secondary rounded-md p-3 font-mono text-sm break-all select-all">
                                {profile.email}
                              </div>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-popover border-b border-r transform rotate-45" />
                          </div>
                        </motion.div>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technical Toolkit - Added negative margin to pull it closer */}
        <section className="space-y-6 -mt-8 md:-mt-12"> {/* Negative margin to pull it up */}
          <h2 className="text-2xl font-bold">Technical Toolkit</h2>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Core CS</p>
              <div className="flex flex-wrap gap-2">
                {[...skills.coreCS].map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                ))}
              </div>  
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Machine Learning</p>
              <div className="flex flex-wrap gap-2">
                {[...skills.machineLearning].map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Backend Concepts</p>
              <div className="flex flex-wrap gap-2">
                {[...skills.backendConcepts].map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Sections */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Work & Research</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Projects */}
            <Link href="/projects" className="group">
              <div className="p-6 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Projects</h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Engineering projects showcasing systems design and technical implementation
                </p>
                <div className="text-2xl font-bold text-primary">{projects.length}</div>
                <p className="text-xs text-muted-foreground mt-1">projects</p>
              </div>
            </Link>

            {/* Research */}
            <Link href="/research" className="group">
              <div className="p-6 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Research</h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Academic papers and technical research in computer systems
                </p>
                <div className="text-2xl font-bold text-primary">{researchPapers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">papers</p>
              </div>
            </Link>

            {/* Data */}
            <Link href="/data" className="group">
              <div className="p-6 border border-border rounded-lg bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Data and ML</h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Analytical + Machine learning/data science projects
                </p>
                <div className="text-2xl font-bold text-primary">{kaggleProjects.length}</div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}