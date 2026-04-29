import * as React from "react";

export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="my-12 h-px w-full"
      style={{
        background: "linear-gradient(90deg, transparent 0%, var(--border) 30%, var(--border) 70%, transparent 100%)",
      }}
    />
  );
}
