import flowAsset from "@/assets/titas/motion/quality-process-flow-hd.png";

/**
 * Purification process.
 *
 * Every step below is transcribed from the company's own
 * "Process Flow Chart for Bottle Filling" document. Nothing is invented and
 * nothing beyond that document is claimed. Operating parameters (chlorine
 * dosing figures, mineral-dosing concentrations, ozone ppm) are kept in
 * `fullDetail` only — shown on explicit expand — rather than in the
 * always-visible `description`, since those are internal process-control
 * figures rather than public claims.
 */

export type ProcessIcon =
  | "source"
  | "tank"
  | "dose"
  | "sand-filter"
  | "carbon-filter"
  | "rooftop"
  | "membrane"
  | "ro"
  | "mineral"
  | "uv"
  | "ozone"
  | "ss-tank"
  | "fill"
  | "package"
  | "test"
  | "store"
  | "dispatch";

export type ProcessStep = {
  /** Original process-documentation reference, preserved exactly. */
  ref: string;
  /** Short technical name, as used in the source Process Flow Chart. */
  title: string;
  /** Premium, customer-facing heading for the timeline card. */
  displayTitle: string;
  /** Concise, website-friendly summary shown on the card by default. */
  description: string;
  /** Fuller detail (may include operating parameters), shown on expand. */
  fullDetail?: string;
  stage: "Source & Pre-treatment" | "Purification" | "Packaging, Testing & Dispatch";
  control?: string;
  icon: ProcessIcon;
};

export const processFlowImage = flowAsset;

export const processStages = [
  "Source & Pre-treatment",
  "Purification",
  "Packaging, Testing & Dispatch",
] as const;

export const processSteps: ProcessStep[] = [
  // ---------- 01 — SOURCE & PRE-TREATMENT ----------
  {
    ref: "1.0",
    title: "Raw Material Received",
    displayTitle: "The Journey Begins",
    description:
      "Raw water is received from the designated source, beginning the planned sequence of storage, filtration, purification, disinfection and quality control that every TiTAS pack goes through.",
    stage: "Source & Pre-treatment",
    icon: "source",
  },
  {
    ref: "1.1",
    title: "Raw Water Storage Tank",
    displayTitle: "Initial Water Collection & Controlled Storage",
    description:
      "Extracted raw water is collected in a dedicated storage tank, maintaining a continuous, controlled supply into the treatment process.",
    stage: "Source & Pre-treatment",
    icon: "tank",
  },
  {
    ref: "CCP-1",
    title: "Chlorine Dosing",
    displayTitle: "Initial Disinfection & Microbial Control",
    description:
      "A controlled chlorine dose is applied at this stage for initial disinfection and microbial control, identified as a Critical Control Point in the process.",
    fullDetail:
      "Controlled chlorine dosing (0.7–0.8) is applied at the extraction stage for initial disinfection and microbial control — tracked as Critical Control Point CCP-1.",
    stage: "Source & Pre-treatment",
    control: "CCP-1",
    icon: "dose",
  },
  {
    ref: "1.2",
    title: "Raw Water Storage Tank",
    displayTitle: "Controlled Holding Before Filtration",
    description:
      "Water is held in controlled intermediate storage before moving on to sand filtration.",
    stage: "Source & Pre-treatment",
    icon: "tank",
  },
  {
    ref: "1.3",
    title: "Sand Filter",
    displayTitle: "Removal of Suspended Particles & Sediment",
    description:
      "Sand filtration reduces suspended matter, sediment and visible particulate impurities from the water.",
    stage: "Source & Pre-treatment",
    icon: "sand-filter",
  },
  {
    ref: "1.4",
    title: "Carbon Filter",
    displayTitle: "Improving Taste, Odour & Water Characteristics",
    description:
      "Activated carbon treatment addresses residual chlorine, undesirable odour or taste, and certain organic substances in the water.",
    stage: "Source & Pre-treatment",
    icon: "carbon-filter",
  },
  {
    ref: "1.5",
    title: "Ground Floor Storage Tank",
    displayTitle: "Intermediate Process-Water Storage",
    description:
      "Controlled intermediate storage maintains continuity as water moves through the treatment sequence.",
    stage: "Source & Pre-treatment",
    icon: "tank",
  },
  {
    ref: "1.6",
    title: "Roof Top Storage",
    displayTitle: "Maintaining a Continuous Process Supply",
    description:
      "Controlled rooftop storage maintains a consistent supply of water into the next stage of filtration.",
    stage: "Source & Pre-treatment",
    icon: "rooftop",
  },
  {
    ref: "1.7",
    title: "Big Sand Filter",
    displayTitle: "Enhanced Filtration of Suspended Matter",
    description:
      "A larger-capacity sand filter provides enhanced filtration of suspended matter as water volume moves downstream.",
    stage: "Source & Pre-treatment",
    icon: "sand-filter",
  },
  {
    ref: "1.8A & 1.8B",
    title: "Big Carbon Filters",
    displayTitle: "Additional Activated Carbon Treatment",
    description:
      "Two parallel, larger-capacity activated carbon filters (1.8A and 1.8B) provide additional carbon treatment.",
    stage: "Source & Pre-treatment",
    icon: "carbon-filter",
  },
  {
    ref: "1.9A & 1.9B",
    title: "Nano Filtration",
    displayTitle: "Fine Membrane-Based Filtration",
    description:
      "Two parallel nano-filtration lines (1.9A and 1.9B) use finer membrane-based separation to reduce selected dissolved substances and fine impurities.",
    stage: "Source & Pre-treatment",
    icon: "membrane",
  },

  // ---------- 02 — PURIFICATION ----------
  {
    ref: "2.0",
    title: "Nano Storage",
    displayTitle: "Controlled Storage After Nano Filtration",
    description:
      "Nano-filtered water is held in controlled storage before continuing to the final treatment stages.",
    stage: "Purification",
    icon: "tank",
  },
  {
    ref: "2.1",
    title: "Roof Top Storage Tank",
    displayTitle: "Steady Supply for Final Treatment",
    description:
      "Rooftop storage maintains a steady supply of water for the final treatment stages ahead.",
    stage: "Purification",
    icon: "rooftop",
  },
  {
    ref: "2.2",
    title: "Sand Filter",
    displayTitle: "Additional Particle Filtration",
    description:
      "A further sand-filtration pass provides additional particle filtration before carbon treatment.",
    stage: "Purification",
    icon: "sand-filter",
  },
  {
    ref: "2.3",
    title: "Carbon Filter",
    displayTitle: "Final Activated Carbon Filtration Before RO",
    description:
      "A final activated-carbon filtration pass prepares the water for reverse osmosis.",
    stage: "Purification",
    icon: "carbon-filter",
  },
  {
    ref: "2.4",
    title: "Reverse Osmosis (RO)",
    displayTitle: "Advanced Membrane Purification",
    description:
      "Reverse osmosis uses advanced membrane purification to reduce dissolved constituents in the water.",
    stage: "Purification",
    icon: "ro",
  },
  {
    ref: "2.5",
    title: "Mineral Dosing",
    displayTitle: "Controlled Addition of Selected Minerals",
    description:
      "Selected minerals — sodium bicarbonate, magnesium sulphate and calcium chloride — are added back under controlled conditions, identified as a Critical Control Point.",
    fullDetail:
      "Controlled dosing: Sodium Bicarbonate, Magnesium Sulphate and Calcium Chloride, each added in small, precisely controlled amounts — tracked as Critical Control Point CCP-2.",
    stage: "Purification",
    control: "CCP-2",
    icon: "mineral",
  },
  {
    ref: "2.6",
    title: "UV Treatment",
    displayTitle: "Ultraviolet Disinfection",
    description:
      "Ultraviolet treatment provides an additional stage of disinfection, tracked as an Operational Prerequisite Programme.",
    fullDetail: "Ultraviolet disinfection stage — tracked as Operational Prerequisite Programme OPRP-1.",
    stage: "Purification",
    control: "OPRP-1",
    icon: "uv",
  },
  {
    ref: "2.7",
    title: "Ozonisation",
    displayTitle: "Additional Final-Stage Disinfection",
    description:
      "Ozonisation provides an additional final-stage disinfection step, tracked as an Operational Prerequisite Programme.",
    fullDetail: "Controlled ozone dosing for final-stage disinfection — tracked as Operational Prerequisite Programme OPRP-2.",
    stage: "Purification",
    control: "OPRP-2",
    icon: "ozone",
  },
  {
    ref: "2.8",
    title: "Final Water Storage SS Tank",
    displayTitle: "Hygienic Storage of Treated Water",
    description:
      "Fully treated water is held in a stainless-steel tank for hygienic storage ahead of filling.",
    stage: "Purification",
    icon: "ss-tank",
  },

  // ---------- 03 — PACKAGING, TESTING & DISPATCH ----------
  {
    ref: "2.9",
    title: "Bottle Filling Fully Automatic Machine",
    displayTitle: "Controlled & Automated Bottle Filling",
    description:
      "A fully automatic filling machine fills every bottle under controlled, repeatable conditions.",
    stage: "Packaging, Testing & Dispatch",
    icon: "fill",
  },
  {
    ref: "3.0",
    title: "Packaging",
    displayTitle: "Preparing Every Pack for Handling & Distribution",
    description:
      "Filled bottles are packed, preparing every pack for safe handling and distribution.",
    stage: "Packaging, Testing & Dispatch",
    icon: "package",
  },
  {
    ref: "3.1",
    title: "Product Testing",
    displayTitle: "Quality Verification Before Product Release",
    description:
      "Packed product is tested for quality verification before release. Conforming product moves to store; non-conforming material is handled separately as NC material.",
    stage: "Packaging, Testing & Dispatch",
    icon: "test",
  },
  {
    ref: "3.2",
    title: "Store",
    displayTitle: "Controlled Finished-Goods Storage",
    description:
      "Approved finished goods are held in controlled storage ahead of dispatch.",
    stage: "Packaging, Testing & Dispatch",
    icon: "store",
  },
  {
    ref: "3.3",
    title: "Dispatch",
    displayTitle: "From TiTAS to Our Customers",
    description:
      "Approved finished products are dispatched through the supply network to distributors, retailers, hotels, restaurants, offices, institutions, businesses, events and other customers.",
    stage: "Packaging, Testing & Dispatch",
    icon: "dispatch",
  },
];
