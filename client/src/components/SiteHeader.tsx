import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Home,
  FolderGit2,
  Menu,
  X,
  Github,
  Linkedin,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { profile } from "@/lib/content/registry";
import "./navItem.css";
import { isProjectsSection } from "@/lib/routes";
import { CosmicToggle } from "./CosmicToggle";
import { CopyEmailButton } from "./CopyEmailButton";
import { MOTION_CONFIG as M } from "@/motion/config";
import { useSafeMotion } from "@/motion/useSafeMotion";
import { useInitialLoad } from "@/motion/useInitialLoad";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    match: (path: string) => path === "/",
  },
  {
    href: "/projects",
    label: "Projects",
    icon: FolderGit2,
    match: (path: string) => isProjectsSection(path),
  },
] as const;

type NavItem = (typeof navItems)[number];

function NavLinkUnderline({ isActive }: { isActive: boolean }) {
  const { safeTransition, shouldAnimate } = useSafeMotion();
  const baseTransition = {
    duration: M.duration.micro,
    ease: [...M.easing] as [number, number, number, number],
  };
  return (
    <motion.span
      aria-hidden
      className="nav-link__underline"
      initial={false}
      animate={{ scaleX: isActive ? 1 : 0 }}
      transition={
        shouldAnimate
          ? { ...baseTransition, ...safeTransition }
          : { duration: 0 }
      }
      style={{ transformOrigin: "left" }}
    />
  );
}

function DesktopNavLink({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn("nav-link", isActive && "active")}
    >
      {item.label}
      <NavLinkUnderline isActive={isActive || hovered} />
    </Link>
  );
}

function DrawerNavLink({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn("nav-link nav-link--drawer", isActive && "active")}
    >
      {item.label}
      <NavLinkUnderline isActive={isActive} />
    </Link>
  );
}

export function SiteHeader() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const email = profile.email;
  const { safeTransition, shouldAnimate } = useSafeMotion();
  const isReady = useInitialLoad();

  const { scrollY } = useScroll();
  const [t0, t1] = M.navScrollThreshold;
  const navElev = useTransform(scrollY, [t0, t1], [0, 1], { clamp: true });
  const navHeight = useTransform(
    scrollY,
    [t0, t1],
    [M.navHeight.expanded, M.navHeight.collapsed],
    { clamp: true },
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const activeItems = useMemo(
    () => navItems.map((item) => ({ item, isActive: item.match(location) })),
    [location],
  );

  const mountTransition = {
    duration: shouldAnimate ? M.duration.navbarMount : 0,
    ease: [...M.easing] as [number, number, number, number],
    ...safeTransition,
  };

  const microTransition = {
    duration: M.duration.micro,
    ease: [...M.easing] as [number, number, number, number],
    ...safeTransition,
  };

  return (
    <>
      <motion.header
        className="app-nav"
        initial={shouldAnimate ? M.navbarMountFrom : false}
        animate={
          shouldAnimate
            ? isReady
              ? { y: 0, opacity: 1 }
              : M.navbarMountFrom
            : { y: 0, opacity: 1 }
        }
        transition={mountTransition}
        style={
          shouldAnimate
            ? ({ ["--nav-elev" as string]: navElev } as React.CSSProperties)
            : undefined
        }
      >
        <motion.div
          className="app-nav__bar"
          style={
            shouldAnimate
              ? { height: navHeight }
              : { height: M.navHeight.expanded }
          }
        >
          <motion.div
            whileHover={shouldAnimate ? { x: M.logoHoverX } : undefined}
            transition={microTransition}
            className="hidden shrink-0 md:block"
          >
            <Link
              href="/"
              className="flex flex-col leading-tight text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
                Jenish Portfolio
              </span>
            </Link>
          </motion.div>

          <nav
            className="hidden flex-1 justify-center md:flex"
            aria-label="Primary"
          >
            <div className="nav-group" role="navigation" aria-label="Primary links">
              {activeItems.map(({ item, isActive }) => (
                <DesktopNavLink
                  key={item.href}
                  item={item}
                  isActive={isActive}
                />
              ))}
            </div>
          </nav>

          <div className="hidden nav-right md:flex">
            <div className="social-links" aria-label="Social links">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" aria-hidden />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" aria-hidden />
              </a>
              <div className="nav-email-chip" aria-label={`Email ${email}`}>
                <span className="nav-email-text">{email}</span>
                <CopyEmailButton
                  email={email}
                  className="nav-email-copy"
                  aria-label="Copy email address"
                  title="Copy email"
                >
                  {(copied) =>
                    copied ? (
                      <Check className="h-3.5 w-3.5 nav-email-copy--done" aria-hidden />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden />
                    )
                  }
                </CopyEmailButton>
              </div>
            </div>
            <CosmicToggle />
          </div>

          <motion.button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            whileHover={shouldAnimate ? { scale: 1.03 } : undefined}
            whileTap={shouldAnimate ? { scale: 0.97 } : undefined}
            transition={microTransition}
            className="ml-auto rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={microTransition}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[3px] md:hidden"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: M.duration.standard,
                ease: [...M.easing] as [number, number, number, number],
                ...safeTransition,
              }}
              className="fixed right-0 top-0 z-50 h-full w-[min(100%,22rem)] border-l border-border bg-background shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-6 p-6 pt-20">
                <nav aria-label="Mobile primary">
                  <div className="nav-group nav-group--drawer">
                    {activeItems.map(({ item, isActive }) => (
                      <DrawerNavLink
                        key={item.href}
                        item={item}
                        isActive={isActive}
                      />
                    ))}
                  </div>
                </nav>

                <div className="flex flex-col gap-3 border-t border-border pt-5">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon social-icon--drawer"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon social-icon--drawer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden />
                  </a>
                  <div className="nav-email-chip nav-email-chip--drawer" aria-label={`Email ${email}`}>
                    <span className="nav-email-text">{email}</span>
                    <CopyEmailButton
                      email={email}
                      className="nav-email-copy"
                      aria-label="Copy email address"
                      title="Copy email"
                    >
                      {(copied) =>
                        copied ? (
                          <Check className="h-3.5 w-3.5 nav-email-copy--done" aria-hidden />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden />
                        )
                      }
                    </CopyEmailButton>
                  </div>
                  <div className="pt-1">
                    <CosmicToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
