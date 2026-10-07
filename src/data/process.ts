import flowAsset from "@/assets/titas/motion/quality-process-flow-hd.png";

/**
 * Purification process — Water Purification Journey.
 *
 * SOURCE OF TRUTH: every `brief` and every entry in `paragraphs` below is
 * transcribed VERBATIM from the client-approved "TiTAS Quality & Process"
 * content document. Nothing is paraphrased, shortened, merged, reordered or
 * invented. `brief` is always the exact first sentence of that stage's own
 * first paragraph (so the collapsed card uses only wording already present
 * in the source) — the full `paragraphs` array is shown in full once a
 * stage is expanded. Where the source document explicitly addresses the
 * client with a recommendation/caveat about what to publish (mineral-dosing
 * concentrations, the ozonation ppm figure), that sentence is preserved
 * verbatim inside the expanded content, exactly as supplied.
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
  /** Short technical name, as used in the source document's own heading. */
  title: string;
  /** The source document's own subtitle for this stage. */
  displayTitle: string;
  /** Verbatim first sentence of the stage's first paragraph — collapsed-card summary. */
  brief: string;
  /** Every paragraph belonging to this stage, verbatim and in source order. */
  paragraphs: string[];
  stage: "Source & Pre-treatment" | "Purification" | "Packaging, Testing & Dispatch";
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
    brief:
      "The TiTAS water-processing journey begins with the receipt of raw water from the designated source.",
    paragraphs: [
      "The TiTAS water-processing journey begins with the receipt of raw water from the designated source. At this initial stage, the water enters the treatment system and is directed through a planned sequence of storage, filtration, purification, disinfection and quality-control processes.",
      "Every subsequent treatment stage has a specific purpose—from reducing suspended particles and undesirable characteristics to advanced membrane treatment and final disinfection. Maintaining an organized process flow from the beginning helps ensure that the water moves systematically through the treatment plant before it reaches the filling and packaging stages.",
    ],
    stage: "Source & Pre-treatment",
    icon: "source",
  },
  {
    ref: "1.1",
    title: "Raw Water Storage Tank",
    displayTitle: "Initial Water Collection & Controlled Storage",
    brief: "The extracted raw water is collected in a dedicated raw-water storage tank.",
    paragraphs: [
      "The extracted raw water is collected in a dedicated raw-water storage tank. This tank serves as the first controlled holding point in the treatment process and helps maintain an adequate and continuous supply of water for further processing.",
      "Controlled storage also allows the downstream treatment equipment to receive water in an organized manner rather than directly from the source. From this tank, the raw water moves forward through the initial treatment and filtration stages according to the established process flow.",
    ],
    stage: "Source & Pre-treatment",
    icon: "tank",
  },
  {
    ref: "CCP-1",
    title: "Chlorine Dosing",
    displayTitle: "Initial Disinfection & Microbial Control",
    brief:
      "At this stage, chlorine is introduced into the raw water at the controlled level specified in the plant's approved process plan.",
    paragraphs: [
      "At this stage, chlorine is introduced into the raw water at the controlled level specified in the plant's approved process plan. Chlorination is used as an initial disinfection measure to help control microbial contamination before the water proceeds through the subsequent treatment stages.",
      "Careful control of dosing is important because the treatment needs to operate according to established operating specifications. After this initial treatment, the water continues through storage and filtration, where additional processes progressively prepare it for advanced purification.",
    ],
    stage: "Source & Pre-treatment",
    icon: "dose",
  },
  {
    ref: "1.2",
    title: "Raw Water Storage Tank",
    displayTitle: "Controlled Holding Before Filtration",
    brief:
      "Following the initial treatment stage, the water is held in a separate raw-water storage tank.",
    paragraphs: [
      "Following the initial treatment stage, the water is held in a separate raw-water storage tank. This provides an intermediate holding point and helps maintain an orderly and continuous flow of water into the filtration system.",
      "Rather than moving directly from one process to another without controlled storage, this stage helps maintain operational continuity and provides a consistent feed for the sand filtration stage that follows.",
    ],
    stage: "Source & Pre-treatment",
    icon: "tank",
  },
  {
    ref: "1.3",
    title: "Sand Filter",
    displayTitle: "Removal of Suspended Particles & Sediment",
    brief:
      "The water is passed through a sand filtration system designed to reduce suspended matter, sediment and other visible particulate impurities present in the water.",
    paragraphs: [
      "The water is passed through a sand filtration system designed to reduce suspended matter, sediment and other visible particulate impurities present in the water.",
      "Sand filtration is an important preliminary treatment stage because reducing larger suspended impurities helps prepare the water for the finer treatment processes that follow. After passing through this filtration stage, the water proceeds to activated carbon treatment for further improvement.",
    ],
    stage: "Source & Pre-treatment",
    icon: "sand-filter",
  },
  {
    ref: "1.4",
    title: "Carbon Filter",
    displayTitle: "Improving Taste, Odour & Water Characteristics",
    brief: "After sand filtration, the water passes through an activated carbon filter.",
    paragraphs: [
      "After sand filtration, the water passes through an activated carbon filter. Activated carbon treatment is used to help reduce residual chlorine, undesirable odour and taste, as well as certain organic substances that may be present in the water.",
      "This stage complements the physical filtration performed by the sand filter. Together, these initial treatment processes prepare the water for intermediate storage and the more extensive filtration and purification stages further along the TiTAS treatment system.",
    ],
    stage: "Source & Pre-treatment",
    icon: "carbon-filter",
  },
  {
    ref: "1.5",
    title: "Ground Floor Storage Tank",
    displayTitle: "Intermediate Process-Water Storage",
    brief:
      "Following the initial sand and carbon filtration stages, the treated water is transferred to a dedicated ground-floor storage tank.",
    paragraphs: [
      "Following the initial sand and carbon filtration stages, the treated water is transferred to a dedicated ground-floor storage tank.",
      "This tank functions as an intermediate holding point between different treatment sections. It helps maintain a controlled water supply for subsequent processing and supports continuity of plant operations. From here, the water is transferred to rooftop storage before undergoing another sequence of filtration.",
    ],
    stage: "Source & Pre-treatment",
    icon: "tank",
  },
  {
    ref: "1.6",
    title: "Roof Top Storage",
    displayTitle: "Maintaining a Continuous Process Supply",
    brief:
      "Water from the ground-floor storage tank is transferred to the rooftop storage system.",
    paragraphs: [
      "Water from the ground-floor storage tank is transferred to the rooftop storage system. This stage provides another controlled holding point and maintains a consistent supply of process water to the downstream filtration equipment.",
      "A stable supply is important for maintaining an organized treatment sequence. From rooftop storage, the water is directed to the larger sand filtration system for additional treatment.",
    ],
    stage: "Source & Pre-treatment",
    icon: "rooftop",
  },
  {
    ref: "1.7",
    title: "Big Sand Filter",
    displayTitle: "Enhanced Filtration of Suspended Matter",
    brief:
      "At this stage, the water undergoes another sand-filtration process using the larger filtration system.",
    paragraphs: [
      "At this stage, the water undergoes another sand-filtration process using the larger filtration system. Its purpose is to provide further reduction of suspended matter and fine particulate impurities remaining after the earlier treatment stages.",
      "This additional filtration provides another level of physical treatment before the water is directed through the larger activated carbon filters and nano-filtration system.",
    ],
    stage: "Source & Pre-treatment",
    icon: "sand-filter",
  },
  {
    ref: "1.8A & 1.8B",
    title: "Big Carbon Filters",
    displayTitle: "Additional Activated Carbon Treatment",
    brief:
      "The treatment process incorporates dedicated large carbon-filtration units.",
    paragraphs: [
      "The treatment process incorporates dedicated large carbon-filtration units. These units provide additional activated carbon treatment after the preceding sand-filtration stage.",
      "Activated carbon helps reduce unwanted taste, odour, residual chlorine and certain organic substances. The use of these carbon-filtration stages provides further conditioning of the water before it enters the finer membrane-based nano-filtration process.",
    ],
    stage: "Source & Pre-treatment",
    icon: "carbon-filter",
  },
  {
    ref: "1.9A & 1.9B",
    title: "Nano Filtration",
    displayTitle: "Fine Membrane-Based Filtration",
    brief: "Following carbon filtration, the water enters the nano-filtration stage.",
    paragraphs: [
      "Following carbon filtration, the water enters the nano-filtration stage. Nano filtration uses membrane technology to provide finer separation than conventional sand and carbon filtration.",
      "This stage helps reduce selected dissolved substances and very fine impurities, further preparing the water for the subsequent treatment sequence. After nano filtration, the processed water is collected in dedicated nano storage before being transferred to the next stages.",
    ],
    stage: "Source & Pre-treatment",
    icon: "membrane",
  },

  // ---------- 02 — PURIFICATION ----------
  {
    ref: "2.0",
    title: "Nano Storage",
    displayTitle: "Controlled Storage After Nano Filtration",
    brief:
      "Water that has completed the nano-filtration stage is collected in a dedicated nano-storage tank.",
    paragraphs: [
      "Water that has completed the nano-filtration stage is collected in a dedicated nano-storage tank. This creates a controlled separation between the earlier filtration sequence and the final purification sequence.",
      "The storage stage helps maintain a continuous supply of nano-filtered water for subsequent processing while keeping the treatment flow organized. The water is then transferred to rooftop storage for the next series of filtration and purification processes.",
    ],
    stage: "Purification",
    icon: "tank",
  },
  {
    ref: "2.1",
    title: "Roof Top Storage Tank",
    displayTitle: "Steady Supply for Final Treatment",
    brief: "The nano-filtered water is transferred to another rooftop storage tank.",
    paragraphs: [
      "The nano-filtered water is transferred to another rooftop storage tank. This tank serves as the feed-water holding point for the final treatment sequence.",
      "From here, water moves progressively through another sand filter, carbon filter, Reverse Osmosis system, mineral dosing, UV treatment and ozonation before reaching final treated-water storage.",
    ],
    stage: "Purification",
    icon: "rooftop",
  },
  {
    ref: "2.2",
    title: "Sand Filter",
    displayTitle: "Additional Particle Filtration",
    brief:
      "The water passes through another sand-filtration stage to help reduce remaining suspended particles before the more advanced purification stages.",
    paragraphs: [
      "The water passes through another sand-filtration stage to help reduce remaining suspended particles before the more advanced purification stages.",
      "This provides additional physical filtration and helps prepare the water for activated carbon treatment and Reverse Osmosis. Each filtration stage performs a defined function within the overall treatment sequence rather than relying on a single purification method.",
    ],
    stage: "Purification",
    icon: "sand-filter",
  },
  {
    ref: "2.3",
    title: "Carbon Filter",
    displayTitle: "Final Activated Carbon Filtration Before RO",
    brief: "After sand filtration, the water is passed through another activated carbon filter.",
    paragraphs: [
      "After sand filtration, the water is passed through another activated carbon filter. This stage provides further treatment to help reduce undesirable taste, odour, residual chlorine and certain organic substances before the water enters the Reverse Osmosis system.",
      "Preparing the water appropriately before RO also forms part of the structured multi-stage treatment process used by TiTAS.",
    ],
    stage: "Purification",
    icon: "carbon-filter",
  },
  {
    ref: "2.4",
    title: "Reverse Osmosis (RO)",
    displayTitle: "Advanced Membrane Purification",
    brief:
      "Reverse Osmosis is one of the major purification stages in the TiTAS treatment process.",
    paragraphs: [
      "Reverse Osmosis is one of the major purification stages in the TiTAS treatment process. In RO treatment, water is passed through a semi-permeable membrane designed to reduce dissolved salts and various dissolved impurities.",
      "Unlike conventional filters that primarily address suspended matter, RO provides membrane-level treatment for dissolved constituents. Following this purification stage, the treated water proceeds to controlled mineral dosing before undergoing additional disinfection treatments.",
    ],
    stage: "Purification",
    icon: "ro",
  },
  {
    ref: "2.5",
    title: "Mineral Dosing",
    displayTitle: "Controlled Addition of Selected Minerals",
    brief:
      "After Reverse Osmosis treatment, selected minerals are added to the purified water according to the established formulation and operating requirements.",
    paragraphs: [
      "After Reverse Osmosis treatment, selected minerals are added to the purified water according to the established formulation and operating requirements.",
      "Your current process diagram specifies:\n• Sodium Bicarbonate — 1 mg/100 ml\n• Magnesium Sulphate — 0.5 mg/100 ml\n• Calcium Chloride — 1 mg/100 ml",
      "The purpose of this stage is to introduce the selected minerals in controlled quantities according to the defined product formulation. Accurate dosing, monitoring and consistency are important elements of this process.",
      "For your public website, I recommend displaying the mineral names while publishing exact concentrations only when they correspond to your current approved formulation, laboratory results and applicable compliance documentation.",
    ],
    stage: "Purification",
    icon: "mineral",
  },
  {
    ref: "2.6",
    title: "UV Treatment",
    displayTitle: "Ultraviolet Disinfection",
    brief: "Following mineral dosing, the water undergoes ultraviolet (UV) treatment as an additional disinfection stage.",
    paragraphs: [
      "Following mineral dosing, the water undergoes ultraviolet (UV) treatment as an additional disinfection stage.",
      "UV treatment uses ultraviolet light to help control microorganisms in the treated water without introducing additional taste or odour. This provides another treatment barrier following the filtration, membrane purification and mineral-dosing stages.",
      "The water then proceeds to ozonation for an additional final-stage treatment before entering the treated-water storage tank.",
    ],
    stage: "Purification",
    icon: "uv",
  },
  {
    ref: "2.7",
    title: "Ozonisation",
    displayTitle: "Additional Final-Stage Disinfection",
    brief: "After UV treatment, the water undergoes ozonation.",
    paragraphs: [
      "After UV treatment, the water undergoes ozonation. Ozone treatment provides an additional disinfection stage before the treated water enters final storage and the filling line.",
      "Your process plan specifies an ozonation level of 0.2 ppm. Because this is a technical operating parameter, it should be displayed publicly only if it accurately reflects your current approved process specification.",
      "This stage forms part of the final treatment sequence before the water is transferred to the stainless-steel treated-water storage tank.",
    ],
    stage: "Purification",
    icon: "ozone",
  },
  {
    ref: "2.8",
    title: "Final Water Storage SS Tank",
    displayTitle: "Hygienic Storage of Treated Water",
    brief:
      "After completing the filtration, Reverse Osmosis, mineral dosing, UV and ozonation stages, the fully treated water is transferred to the final stainless-steel (SS) storage tank.",
    paragraphs: [
      "After completing the filtration, Reverse Osmosis, mineral dosing, UV and ozonation stages, the fully treated water is transferred to the final stainless-steel (SS) storage tank.",
      "This tank serves as the final controlled holding point between water treatment and bottle filling. The treated water remains here until it is supplied to the automatic filling system.",
      "The use of a dedicated final storage stage helps maintain separation between untreated/process water and water that has completed the treatment sequence.",
    ],
    stage: "Purification",
    icon: "ss-tank",
  },

  // ---------- 03 — PACKAGING, TESTING & DISPATCH ----------
  {
    ref: "2.9",
    title: "Bottle Filling Fully Automatic Machine",
    displayTitle: "Controlled & Automated Bottle Filling",
    brief: "From the final SS storage tank, treated water is transferred to the fully automatic bottle-filling machine.",
    paragraphs: [
      "From the final SS storage tank, treated water is transferred to the fully automatic bottle-filling machine.",
      "Automation helps maintain a controlled filling operation while reducing unnecessary manual handling during this critical stage. Bottles are filled through the designated filling system before moving forward to the packaging and finished-product stages.",
      "This represents the transition from the water-treatment process to the finished packaged drinking water production process.",
    ],
    stage: "Packaging, Testing & Dispatch",
    icon: "fill",
  },
  {
    ref: "3.0",
    title: "Packaging",
    displayTitle: "Preparing Every Pack for Handling & Distribution",
    brief:
      "After filling and sealing, the finished TiTAS bottles move to the packaging stage.",
    paragraphs: [
      "After filling and sealing, the finished TiTAS bottles move to the packaging stage. Packaging prepares the product for subsequent testing, storage, transportation and distribution.",
      "Appropriate packaging helps protect finished bottles during handling and transportation and enables them to move efficiently through the supply chain.",
      "Once packaging is completed, the finished product proceeds through the applicable quality-verification process before it can be accepted for storage and dispatch.",
    ],
    stage: "Packaging, Testing & Dispatch",
    icon: "package",
  },
  {
    ref: "3.1",
    title: "Product Testing",
    displayTitle: "Quality Verification Before Product Release",
    brief:
      "Before finished products proceed to regular storage and distribution, applicable product testing and quality verification are carried out according to the established quality-control procedure.",
    paragraphs: [
      "Before finished products proceed to regular storage and distribution, applicable product testing and quality verification are carried out according to the established quality-control procedure.",
      "The purpose of this stage is to verify whether the finished product meets the applicable acceptance requirements. Products meeting the required criteria can proceed through the approved route toward storage and dispatch.",
      "Where a product or material does not meet the applicable acceptance criteria, it is identified as non-conforming and handled separately according to the relevant quality-control procedure.",
      "This creates an important checkpoint between production and market release.",
    ],
    stage: "Packaging, Testing & Dispatch",
    icon: "test",
  },
  {
    ref: "3.2",
    title: "Store",
    displayTitle: "Controlled Finished-Goods Storage",
    brief:
      "After completing the applicable testing and acceptance process, approved TiTAS Packaged Drinking Water is transferred to the finished-goods storage area.",
    paragraphs: [
      "After completing the applicable testing and acceptance process, approved TiTAS Packaged Drinking Water is transferred to the finished-goods storage area.",
      "Products are maintained there under appropriate storage and handling conditions until they are scheduled for distribution. Organized finished-goods storage also supports stock handling, order preparation and efficient movement of products for dispatch.",
      "Only products following the applicable approval process should move forward through the normal distribution route.",
    ],
    stage: "Packaging, Testing & Dispatch",
    icon: "store",
  },
  {
    ref: "3.3",
    title: "Dispatch",
    displayTitle: "From TiTAS to Our Customers",
    brief: "Dispatch is the final stage of the TiTAS production and supply journey.",
    paragraphs: [
      "Dispatch is the final stage of the TiTAS production and supply journey. Approved finished products are prepared and loaded for distribution through the company's supply network.",
      "From the treatment plant, TiTAS Packaged Drinking Water can then move to distributors, retailers, hotels, restaurants, offices, institutions, businesses, events and other customers, according to supply requirements.",
      "From the first stage of raw-water handling through multi-stage treatment, filling, testing, storage and final dispatch, the entire process is designed around an organized production flow.",
    ],
    stage: "Packaging, Testing & Dispatch",
    icon: "dispatch",
  },
];

/** Closing brand lines from the approved content document, shown once below
 *  the full timeline (not a process stage itself). */
export const processClosingLine = "TiTAS – Ekti Jaler Naam. Banglar Jal, Banglar Bharsha. Reliable Since 1999.";
