import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export function BackToList({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ChevronLeft className="h-4 w-4" />
        {label}
      </span>
    </Link>
  );
}
