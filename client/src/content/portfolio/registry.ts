import type { ComponentType } from "react";
import TelcoChurnPage, { workPageSections as telcoChurnSections } from "./notebooks/telco-churn.page";
import CropYieldPage, { workPageSections as cropYieldSections } from "./notebooks/crop-yield.page";
import BreastCancerPage, { workPageSections as breastCancerSections } from "./notebooks/breast-cancer.page";
import HousePricesPage, { workPageSections as housePricesSections } from "./notebooks/house-prices.page";
import JobResumePage, { workPageSections as jobResumeSections } from "./notebooks/job-resume.page";
import NeuralScratchPage, { workPageSections as neuralScratchSections } from "./notebooks/neural-scratch.page";
import RlTrafficPage, { workPageSections as rlTrafficSections } from "./notebooks/rl-traffic.page";
import Sw5Page, { workPageSections as sw5Sections } from "./projects/sw-5.page";
import SwProject1Page, { workPageSections as swProject1Sections } from "./projects/sw-project-1.page";
import Sw2Page, { workPageSections as sw2Sections } from "./projects/sw-2.page";
import Sw3Page, { workPageSections as sw3Sections } from "./projects/sw-3.page";
import Sw4Page, { workPageSections as sw4Sections } from "./projects/sw-4.page";

export type WorkPageNavItem = { id: string; label: string };

export type WorkPageEntry = {
  Page: ComponentType;
  sections: readonly WorkPageNavItem[];
};

export const workPageRegistry: Record<string, WorkPageEntry> = {
  "telco-churn": { Page: TelcoChurnPage, sections: telcoChurnSections },
  "crop-yield": { Page: CropYieldPage, sections: cropYieldSections },
  "breast-cancer": { Page: BreastCancerPage, sections: breastCancerSections },
  "house-prices": { Page: HousePricesPage, sections: housePricesSections },
  "job-resume": { Page: JobResumePage, sections: jobResumeSections },
  "neural-scratch": { Page: NeuralScratchPage, sections: neuralScratchSections },
  "rl-traffic": { Page: RlTrafficPage, sections: rlTrafficSections },
  "sw-5": { Page: Sw5Page, sections: sw5Sections },
  "sw-project-1": { Page: SwProject1Page, sections: swProject1Sections },
  "sw-2": { Page: Sw2Page, sections: sw2Sections },
  "sw-3": { Page: Sw3Page, sections: sw3Sections },
  "sw-4": { Page: Sw4Page, sections: sw4Sections },
};

export function getWorkPage(slug: string | undefined): WorkPageEntry | undefined {
  if (!slug) return undefined;
  return workPageRegistry[slug];
}
