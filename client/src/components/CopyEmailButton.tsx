import { useEffect, useRef, useState, type ReactNode } from "react";

type CopyEmailButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  email: string;
  children: ReactNode | ((copied: boolean) => ReactNode);
  copiedDurationMs?: number;
};

export function CopyEmailButton({
  email,
  children,
  copiedDurationMs = 1800,
  ...buttonProps
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const markCopied = () => {
    setCopied(true);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), copiedDurationMs);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      markCopied();
      return;
    } catch {
      // fallback below
    }

    const el = document.createElement("textarea");
    el.value = email;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    const copiedWithExecCommand = document.execCommand("copy");
    document.body.removeChild(el);
    if (copiedWithExecCommand) markCopied();
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      {...buttonProps}
    >
      {typeof children === "function" ? children(copied) : children}
    </button>
  );
}
