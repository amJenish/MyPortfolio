import type { ComponentType } from "react";
import type { WorkEntry } from "@/lib/interfaces";

export type WorkPageNavItem = { id: string; label: string };

export type WorkPageProps = {
  entry: WorkEntry;
  backHref: string;
  backLabel: string;
  categoryLabel: string;
  sections: readonly WorkPageNavItem[];
  ownsHero: boolean;
};

export type WorkPageComponent = ComponentType<WorkPageProps>;
