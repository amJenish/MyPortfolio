/** Canonical paths (hash router: no # prefix here). */
export const ML_LIST_PATH = "/ml";
export const PAPERWORK_LIST_PATH = "/paperwork";

export function mlDetailPath(id: string): string {
  return `${ML_LIST_PATH}/${id}`;
}

export function isMlSection(path: string): boolean {
  return path === ML_LIST_PATH || path.startsWith(`${ML_LIST_PATH}/`);
}

/** Legacy GitHub Pages / bookmarks */
export function isMlSectionLegacy(path: string): boolean {
  return path === "/data" || path.startsWith("/data/");
}

export function isProjectsSection(path: string): boolean {
  return path === "/projects" || path.startsWith("/project/");
}

export function isPaperworkSection(path: string): boolean {
  return path === PAPERWORK_LIST_PATH || path === "/research";
}
