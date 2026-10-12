/**
 * Single source of truth for company information.
 * Every value here comes from the client-approved information document.
 * Nothing in this file is invented — update here, never inside components.
 */

export const company = {
  legalName: "SUJIT AQUA ENTERPRISE",
  brand: "TiTAS",
  tagline: "Ekti Jaler Naam",
  supportingLine: "Banglar Jal, Banglar Bharsha",
  since: "1999",
  sinceLine: "Reliable since 1999",

  intro:
    "At TiTAS, we provide packaged drinking water solutions for homes, businesses, institutions, events and bulk requirements. With a commitment to dependable service since 1999, we offer multiple pack sizes to suit different customer needs.",

  vision:
    "To make TiTAS a trusted and preferred name in packaged drinking water, recognised for quality, reliability and customer confidence. We aspire to bring TiTAS closer to more homes, businesses and communities while continuing to build on the trust we have earned since 1999.",

  mission: [
    "To provide quality-focused packaged drinking water through responsible water treatment, hygienic processing and packaging, consistent quality practices and dependable distribution.",
    "We are committed to understanding the needs of our customers, continuously improving our processes and providing reliable service to homes, businesses, institutions, retailers and distribution partners.",
    "Our mission is to make every TiTAS pack represent the values our brand stands for — quality, hygiene, reliability and trust.",
  ],

  phone: "9051019995",
  whatsapp: "9830014706",
  email: "titas.pdw@gmail.com",

  hours: {
    weekdays: "9:00 AM – 7:00 PM",
    closed: "Sunday closed",
  },

  locations: [
    {
      id: "plant",
      label: "Plant",
      /** Shown as the map pin's marker name (the embed's `q=` search query
       *  is label-first, so this becomes the pin's title) — not displayed
       *  as the card heading, which stays "Plant". */
      markerName: "SUJIT AQUA ENTERPRISES",
      lines: [
        "Vill – JALA DHULAGORI",
        "P.O. – DHULAGORI",
        "P.S. – SANKRAIL",
        "DIST – HOWRAH",
        "711302",
      ],
      mapUrl: "https://maps.app.goo.gl/5ixQMmj1jHtKgPB5A",
    },
    {
      id: "office",
      label: "Office",
      markerName: "TiTAS Packaged Drinking Water",
      lines: ["8/2/2 UMESH BANERJEE LANE", "Howrah", "711101"],
      mapUrl: "https://maps.app.goo.gl/PVC5DaxDKE2in67c9",
    },
  ],

  social: {
    facebookUrl: "https://www.facebook.com/TiTASPDW/",
    instagramUrl: "https://www.instagram.com/titas.pdw/",
    linkedinUrl: "https://www.linkedin.com/in/sujit-aqua-enterprise-493bb46a/?isSelfProfile=true",
  },

  delivery: {
    summary:
      "Delivery availability and charges depend on the delivery location, product quantity and order size. Bulk and commercial delivery terms can be discussed with our team before confirming an order.",
    reach:
      "Depending on location, order quantity and delivery requirements, supply may be available up to approximately 200 km. Please contact our team to confirm availability for your location.",
    bulkMinimum:
      "For bulk delivery, the proposed minimum order quantity is 100 cases, subject to product size, delivery location and applicable delivery terms.",
    freeDelivery:
      "Delivery charges depend on the order quantity, product type and delivery location. Eligible orders may qualify for free delivery within 10 km, subject to applicable order and delivery conditions.",
  },

  /** Shown alongside bulk/commercial delivery info — the 5 standard packs
   *  have fixed final prices; bulk, institutional and dealer pricing is
   *  agreed separately. */
  priceNotice:
    "Pricing above applies to standard retail packs. Bulk, institutional and dealer/distributor orders are priced separately — contact our team for a quotation.",
} as const;

/** Canonical "Product Information" strip shown on every product detail page
 *  (src/routes/products.$size.tsx) — client-supplied wording, not product-
 *  specific, so it lives here once rather than being duplicated per page. */
export const productInformation = {
  brand: "TiTAS",
  company: "Sujit Aqua Enterprise",
  established: "1999",
  productType: "Packaged Drinking Water with Added Minerals",
} as const;

/** The 12 canonical product benefit/feature points, shown on every product
 *  detail page below the "Product Information" strip. Wording is the
 *  client-supplied canonical copy — kept verbatim, not per-product. */
export const productHighlights = [
  {
    title: "Pure & Safe Water",
    description: "Quality-focused drinking water processed with attention to hygiene and safety.",
  },
  {
    title: "Advanced Purification",
    description:
      "Multi-stage treatment using sand filtration, carbon filtration, nano filtration, RO, UV and ozonation.",
  },
  {
    title: "Added Minerals",
    description: "Controlled mineral dosing to maintain the intended mineral composition.",
  },
  {
    title: "Hygienic Packaging",
    description: "Automatic filling and sealing for hygienic product handling.",
  },
  {
    title: "Quality Assurance",
    description: "Applicable quality testing and verification before distribution.",
  },
  {
    title: "Multiple Pack Sizes",
    description: "Available in 500 ml, 1 L, 2 L, 5 L and 20 L.",
  },
  {
    title: "Affordable Price",
    description: "Competitive pricing with dependable value for customers.",
  },
  {
    title: "Wide Applications",
    description:
      "Suitable for homes, offices, hotels, restaurants, institutions, travel and events.",
  },
  {
    title: "Reliable Supply",
    description: "Flexible delivery solutions for regular and bulk orders.",
  },
  {
    title: "Trusted Since 1999",
    description: "Backed by the experience of TiTAS.",
  },
  {
    title: "Customer Satisfaction",
    description: "Focused on dependable service and long-term customer relationships.",
  },
  {
    title: "Dealer & Distributor Opportunities",
    description:
      "Business partnership opportunities subject to company approval and area availability.",
  },
] as const;

export const telHref = `tel:+91${company.phone}`;
export const whatsappHref = `https://wa.me/91${company.whatsapp}`;
export const mailHref = `mailto:${company.email}`;

/** "Our Commitment" points shown on the About page, directly after Vision & Mission. */
export const commitments = [
  {
    number: "01",
    eyebrow: "Quality Commitment",
    title: "Quality at Every Stage",
    description:
      "We focus on maintaining hygiene, consistency and quality throughout our water treatment, filling, packaging and handling processes.",
  },
  {
    number: "02",
    eyebrow: "Customer Commitment",
    title: "Service You Can Depend On",
    description:
      "We aim to understand customer requirements and provide responsive, professional and dependable service for regular and bulk needs.",
  },
  {
    number: "03",
    eyebrow: "Supply Commitment",
    title: "Reliable Distribution",
    description:
      "Our supply approach is designed to serve retailers, businesses, offices, hotels, restaurants, institutions, events and other customers efficiently.",
  },
  {
    number: "04",
    eyebrow: "Value Commitment",
    title: "Quality with Practical Value",
    description:
      "We work to provide dependable packaged drinking water solutions with competitive pricing and flexible supply options for different customer requirements.",
  },
] as const;
