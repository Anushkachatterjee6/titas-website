import flowAsset from "@/assets/titas/motion/quality-process-flow-hd.png";

/**
 * Purification process.
 *
 * Every step below is transcribed from the company's own
 * "Process Flow Chart for Bottle Filling" document. Nothing is invented and
 * nothing beyond that document is claimed.
 */

export type ProcessStep = {
  ref: string;
  title: string;
  detail?: string;
  stage: "Source" | "Pre-treatment" | "Purification" | "Bottling";
  control?: string;
};

export const processFlowImage = flowAsset;

export const processSteps: ProcessStep[] = [
  {
    ref: "1.0",
    title: "Raw material received",
    stage: "Source",
  },
  {
    ref: "1.1",
    title: "Raw water extraction from borewell",
    detail: "Chlorine dosing 0.7–0.8 at the extraction stage.",
    stage: "Source",
    control: "CCP-1",
  },
  { ref: "1.2", title: "Raw water storage tank", stage: "Source" },
  { ref: "1.3", title: "Sand filter", stage: "Pre-treatment" },
  { ref: "1.4", title: "Carbon filter", stage: "Pre-treatment" },
  { ref: "1.5", title: "Ground floor storage tank", stage: "Pre-treatment" },
  { ref: "1.6", title: "Roof top storage", stage: "Pre-treatment" },
  { ref: "1.7", title: "Big sand filter", stage: "Pre-treatment" },
  {
    ref: "1.8",
    title: "Big carbon filter",
    detail: "Two parallel lines, 1.8A and 1.8B.",
    stage: "Pre-treatment",
  },
  {
    ref: "1.9",
    title: "Nano filtration",
    detail: "Two parallel lines, 1.9A and 1.9B.",
    stage: "Purification",
  },
  { ref: "2.0", title: "Nano storage", stage: "Purification" },
  { ref: "2.1", title: "Roof top storage tank", stage: "Purification" },
  { ref: "2.2", title: "Sand filter", stage: "Purification" },
  { ref: "2.3", title: "Carbon filter", stage: "Purification" },
  { ref: "2.4", title: "Reverse osmosis", stage: "Purification" },
  {
    ref: "2.5",
    title: "Mineral dosing",
    detail:
      "Sodium bicarbonate 1 mg/100 ml, magnesium sulphate 0.5 mg/100 ml, calcium chloride 1 mg/100 ml.",
    stage: "Purification",
    control: "CCP-2",
  },
  {
    ref: "2.6",
    title: "UV treatment",
    stage: "Purification",
    control: "OPRP-1",
  },
  {
    ref: "2.7",
    title: "Ozonisation",
    detail: "0.2 ppm.",
    stage: "Purification",
    control: "OPRP-2",
  },
  {
    ref: "2.8",
    title: "Final water storage — SS tank",
    stage: "Purification",
  },
  {
    ref: "2.9",
    title: "Bottle filling",
    detail: "Fully automatic filling machine.",
    stage: "Bottling",
  },
  { ref: "3.0", title: "Packaging", stage: "Bottling" },
  {
    ref: "3.1",
    title: "Product testing",
    detail:
      "Conforming product moves to store; non-conforming material is handled separately as NC material.",
    stage: "Bottling",
  },
  { ref: "3.2", title: "Store", stage: "Bottling" },
  { ref: "3.3", title: "Dispatch", stage: "Bottling" },
];

export const processStages = [
  "Source",
  "Pre-treatment",
  "Purification",
  "Bottling",
] as const;
