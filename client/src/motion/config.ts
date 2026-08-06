/**
 * Single source of truth for all motion timing and spatial tokens.
 * Every animation value in the app should derive from MOTION_CONFIG.
 */
export const MOTION_CONFIG = {
  easing: [0.25, 0.1, 0.25, 1] as const,
  duration: {
    micro: 0.15,
    standard: 0.45,
    cinematic: 0.65,
    /** Route shell enter/exit (AnimatePresence child) */
    routeEnter: 0.45,
    routeExit: 0.2,
    /** Navbar first paint mount */
    navbarMount: 0.5,
    /** Interactive card hover lift */
    hoverLift: 0.2,
  },
  stagger: 0.08,
  delayChildren: 0.15,
  /** Hero headline: stagger between words (explicit exception to global stagger) */
  heroWordStagger: 0.06,
  heroDelayChildren: 0,
  revealDistance: 20,
  revealViewport: { once: true as const, margin: "-80px" as const },
  navScrollThreshold: [0, 80] as const,
  navHeight: { expanded: 64, collapsed: 52 },
  /** Route transition motion offsets (y in px) */
  routeEnter: { opacity: 0, y: 16 },
  routeExit: { opacity: 0, y: -8 },
  /** Navbar mount from above */
  navbarMountFrom: { y: -80, opacity: 0 },
  /** Logo nudge on hover (px) */
  logoHoverX: 2,
  /** Section heading motion (whileInView blocks below the fold) */
  sectionEyebrowOffset: 12,
  sectionTitleOffset: 30,
  sectionAccentDelay: 0.15,
  /** Home hero orchestration delays (seconds) */
  heroGraphicDelay: 0.2,
  heroCtaDelay: 0.75,
  /** Availability badge cursor blink */
  heroCursorBlinkDuration: 1.1,
  heroCursorRepeat: 5,
  /** Skills tab chip stagger */
  skillChipStagger: 0.02,
} as const;

export type MotionConfig = typeof MOTION_CONFIG;
