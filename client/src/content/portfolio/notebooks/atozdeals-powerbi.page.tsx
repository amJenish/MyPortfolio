import type { WorkPageProps } from "../workPageTypes";
import { WorkReportShell } from "@/components/work/WorkReportShell";

export const workPageSections = [
  { id: "dashboard", label: "Dashboard" },
] as const;

const POWER_BI_EMBED_URL =
  "https://app.fabric.microsoft.com/view?r=eyJrIjoiMGM1NDUzOTUtNWUxZi00MzYzLTlhOTktMzJiOGJiNThhYjgxIiwidCI6IjZhNTIxNDI3LTI3NDYtNGZmMC1iNjRlLWQ5NWM0NzUyZmY4YyJ9";

export default function AtozDealsPowerBiPage(props: WorkPageProps) {
  return (
    <WorkReportShell {...props}>
      <div className="theme-body work-report-body mx-auto max-w-[min(100%,72rem)] space-y-8 px-4 pb-16 pt-8 text-sm sm:px-6 sm:text-base">
        <aside
          className="rounded-xl border border-primary/25 bg-primary/[0.06] px-5 py-4 text-[0.9375rem] leading-relaxed text-muted-foreground"
          role="note"
        >
          <p className="m-0">
            <span className="font-semibold text-foreground">Note: </span>
            This dashboard uses anonymized data and is shared publicly with AtoZDeals&apos; permission. No confidential or personally identifiable information is included.
          </p>
        </aside>

        <section id="dashboard" className="scroll-mt-28 space-y-4" aria-label="Power BI dashboard">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <iframe
              title="AtoZDeals Sales Records Power BI Dashboard"
              src={POWER_BI_EMBED_URL}
              className="block w-full border-0"
              style={{ height: "min(85vh, 900px)", minHeight: 560 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            If the dashboard does not load,{" "}
            <a
              href={POWER_BI_EMBED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              open it in Microsoft Fabric
            </a>
            .
          </p>
        </section>
      </div>
    </WorkReportShell>
  );
}
