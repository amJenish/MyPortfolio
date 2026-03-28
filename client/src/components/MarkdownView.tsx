import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

function isExternalHref(href: string | undefined): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}

const markdownComponents: Components = {
  a({ href, children, ...props }) {
    const external = isExternalHref(href);
    return (
      <a
        href={href}
        {...props}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  },
};

export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div
        className={cn(
          "prose prose-neutral w-full max-w-none dark:prose-invert",
          "prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-p:font-serif prose-p:leading-relaxed prose-p:text-muted-foreground",
          "prose-li:marker:text-muted-foreground",
          "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
          "prose-code:rounded prose-code:bg-muted/80 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none",
          "prose-pre:bg-slate-950 prose-pre:border prose-pre:border-border",
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
