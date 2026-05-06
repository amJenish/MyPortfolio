import { profile } from "@/lib/content/registry";
import { Check, Copy, Github, Linkedin } from "lucide-react";
import { CopyEmailButton } from "./CopyEmailButton";

export default function Layout({
  children,
  fullWidth = false,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  const email = profile.email;

  return (
    <>
      {fullWidth ? (
        <>{children}</>
      ) : (
        <main
          id="main-content"
          className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[min(100%,88rem)] px-4 py-10 sm:px-6 sm:py-12 lg:px-12 lg:py-14"
        >
          {children}
        </main>
      )}

      <footer className="bg-background">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--border) 30%, var(--border) 70%, transparent 100%)",
          }}
        />
        <div className="mx-auto w-full max-w-[min(100%,88rem)] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground sm:justify-between">
            <div className="flex flex-wrap justify-center gap-5 sm:justify-start">
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
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5">
                <span className="font-mono text-[11px] text-muted-foreground">{email}</span>
                <CopyEmailButton
                  email={email}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted text-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.08] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Copy email address"
                  title="Copy email"
                >
                  {(copied) =>
                    copied ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )
                  }
                </CopyEmailButton>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
