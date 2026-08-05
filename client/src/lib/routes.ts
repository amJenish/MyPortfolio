/** Canonical paths (hash router: no # prefix here). */
export const PROJECTS_LIST_PATH = "/projects";
export const ML_LIST_PATH = "/ml";
/** Listing alias; detail pages use this base for canonical URLs (`/data/data-1`, …). */
export const DATA_LIST_PATH = "/data";

export function mlDetailPath(id: string): string {
  return `${DATA_LIST_PATH}/${id}`;
}

export function isMlSection(path: string): boolean {
  return path === ML_LIST_PATH || path.startsWith(`${ML_LIST_PATH}/`);
}

/** Legacy GitHub Pages / bookmarks */
export function isMlSectionLegacy(path: string): boolean {
  return path === "/data" || path.startsWith("/data/");
}

export function isProjectsSection(path: string): boolean {
  return (
    path === PROJECTS_LIST_PATH ||
    path.startsWith("/project/") ||
    isMlSection(path) ||
    isMlSectionLegacy(path)
  );
}
