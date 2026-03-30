import TelcoChurnPage, { workPageSections as telcoChurnSections } from "./notebooks/telco-churn.page";
import CropYieldPage, { workPageSections as cropYieldSections } from "./notebooks/crop-yield.page";
import BreastCancerPage, { workPageSections as breastCancerSections } from "./notebooks/breast-cancer.page";
import HousePricesPage, { workPageSections as housePricesSections } from "./notebooks/house-prices.page";
import JobResumePage, { workPageSections as jobResumeSections } from "./notebooks/job-resume.page";
import NeuralScratchPage, { workPageSections as neuralScratchSections } from "./notebooks/neural-scratch.page";
import Sw5Page, { workPageSections as sw5Sections } from "./projects/sw-5.page";
import SwProject1Page, { workPageSections as swProject1Sections } from "./projects/sw-project-1.page";
import Sw2Page, { workPageSections as sw2Sections } from "./projects/sw-2.page";
import Sw3Page, { workPageSections as sw3Sections } from "./projects/sw-3.page";
import Sw4Page, { workPageSections as sw4Sections } from "./projects/sw-4.page";
import type { WorkPageComponent, WorkPageNavItem } from "./workPageTypes";

export type { WorkPageNavItem } from "./workPageTypes";

export type WorkPageEntry = {
  Page: WorkPageComponent;
  sections: readonly WorkPageNavItem[];
  /** Page renders its own full hero; shell skips the catalog title block */
  ownsHero?: boolean;
};

export const workPageRegistry: Record<string, WorkPageEntry> = {
  "telco-churn": { Page: TelcoChurnPage, sections: telcoChurnSections, ownsHero: true },
  "crop-yield": { Page: CropYieldPage, sections: cropYieldSections },
  "breast-cancer": { Page: BreastCancerPage, sections: breastCancerSections },
  "house-prices": { Page: HousePricesPage, sections: housePricesSections, ownsHero: true },
  "job-resume": { Page: JobResumePage, sections: jobResumeSections, ownsHero: true },
  "neural-scratch": { Page: NeuralScratchPage, sections: neuralScratchSections },
  "rl-traffic": { Page: Sw4Page, sections: sw4Sections, ownsHero: true },
  "sw-5": { Page: Sw5Page, sections: sw5Sections, ownsHero: true },
  "sw-project-1": { Page: SwProject1Page, sections: swProject1Sections },
  "sw-2": { Page: Sw2Page, sections: sw2Sections, ownsHero: true },
  "sw-3": { Page: Sw3Page, sections: sw3Sections, ownsHero: true },
  "sw-4": { Page: Sw4Page, sections: sw4Sections, ownsHero: true },
};

export function getWorkPage(slug: string | undefined): WorkPageEntry | undefined {
  if (!slug) return undefined;
  return workPageRegistry[slug];
}
