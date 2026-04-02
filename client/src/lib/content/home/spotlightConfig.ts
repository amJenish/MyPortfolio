/**
 * Home spotlight: exactly three software projects and three notebooks.
 * Edit IDs to match `softwareProjects.ts` / `mlProjects.ts`. Order = display order.
 */

export const HOME_SPOTLIGHT_PROJECT_IDS = ["5", "2", "4"] as const;

// Job–Resume first, then House, then Telco.
export const HOME_SPOTLIGHT_NOTEBOOK_IDS = ["data-3", "data-2", "data-1"] as const;

export function resolveSpotlightByIds<T extends { id: string }>(
  all: T[],
  ids: readonly string[],
): T[] {
  const map = new Map(all.map((x) => [x.id, x]));
  return ids.map((id) => map.get(id)).filter((x): x is T => x != null);
}
