/**
 * @deprecated Import from `@/motion/config` and `@/motion/variants` instead.
 * Thin aliases kept for gradual migration.
 */
import { MOTION_CONFIG } from "@/motion/config";
import { motionTransition } from "@/motion/variants";

export const MOTION_CONFIG_EXPORT = MOTION_CONFIG;
export { MOTION_CONFIG };

export const MOTION_EASE = MOTION_CONFIG.easing;

export const DURATION_MICRO = MOTION_CONFIG.duration.micro;
export const DURATION_STANDARD = MOTION_CONFIG.duration.standard;
export const DURATION_CINEMATIC = MOTION_CONFIG.duration.cinematic;
export const NAVBAR_MOUNT_DURATION = MOTION_CONFIG.duration.navbarMount;

/** Route shell (legacy name — use `MOTION_CONFIG.duration.routeEnter`) */
export const PAGE_ENTER_DURATION = MOTION_CONFIG.duration.routeEnter;
export const PAGE_EXIT_DURATION = MOTION_CONFIG.duration.routeExit;

export const STAGGER_CHILD = MOTION_CONFIG.stagger;

export const VIEWPORT_ONCE = MOTION_CONFIG.revealViewport;

export { motionTransition };
