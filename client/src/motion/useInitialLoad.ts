import { useEffect, useState } from "react";

/**
 * Waits for the first paint before flipping ready — fixes animations skipped on cold load/refresh.
 * Use only in PageWrapper and navbar mount path (per motion system rules).
 */
export function useInitialLoad() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return isReady;
}
