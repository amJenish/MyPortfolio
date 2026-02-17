import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Terminal, BookOpen, User, FolderGit2, Award, Menu, X, Mail, Copy, Github, Linkedin, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/lib/mock-data";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const email = profile.email;

  const navItems = [
    { href: "/", label: "Overview", icon: User },
    { href: "/projects", label: "Projects", icon: FolderGit2 },
    { href: "/research", label: "Research", icon: BookOpen },
    { href: "/data", label: "Data/ML", icon: Award },
  ];

  const socialLinks = [
    { href: "https://github.com/amJenish", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/jenish-paudel-52687b260/", icon: Linkedin, label: "LinkedIn" },
  ];

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-80 border-r border-border bg-gradient-to-b from-background via-background to-card/50 z-50">
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div className="p-8 pb-6">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 group cursor-default"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center backdrop-blur-sm">
                  <Terminal className="w-6 h-6 text-primary" />
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-2 h-2 text-primary-foreground" />
                </motion.div>
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Jenish Paudel
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                  DS & SoftEng
                </p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1">
            {navItems.map((item, index) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/20"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <motion.div
                        className={cn(
                          "absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full",
                          isActive ? "bg-primary" : "bg-transparent"
                        )}
                        initial={false}
                        animate={{ scale: isActive ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-8 pt-6 border-t border-border/50 space-y-8">
            {/* Social Links */}
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Links
              </p>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                    aria-label={link.label}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Contact
              </p>
              <div className="group relative">
                <button
                  onClick={copyEmail}
                  className="w-full p-3 rounded-xl border border-border bg-card/50 hover:bg-card text-left transition-all duration-200 group-hover:border-primary/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">Email</p>
                      <p className="text-sm font-mono text-foreground truncate">{email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Copy className={cn(
                        "w-4 h-4 transition-colors",
                        emailCopied ? "text-green-500" : "text-muted-foreground group-hover:text-primary"
                      )} />
                      {emailCopied && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="text-xs font-medium text-green-500"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-lg z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Jenish Paudel</h1>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 border-l border-border bg-background z-50 md:hidden overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center">
                      <Terminal className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-xl font-bold text-foreground">Jenish Paudel</h1>
                      <p className="text-sm text-muted-foreground font-mono">Data Science/Software Engineering Student</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                    Navigation
                  </p>
                  {navItems.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={cn(
                            "flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Social Links */}
                <div className="space-y-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                    Social
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-12 rounded-lg border border-border bg-card flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        <link.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                    Contact
                  </p>
                  <button
                    onClick={copyEmail}
                    className="w-full p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-mono text-foreground truncate">{email}</p>
                        <Copy className={cn(
                          "w-4 h-4",
                          emailCopied ? "text-green-500" : "text-muted-foreground"
                        )} />
                      </div>
                      {emailCopied && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-green-500 font-medium"
                        >
                          Email copied to clipboard
                        </motion.p>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="md:ml-80 pt-16 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}