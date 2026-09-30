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
      lines: ["8/2/2 UMESH BANERJEE LANE", "Howrah", "711301"],
      mapUrl: "https://maps.app.goo.gl/PVC5DaxDKE2in67c9",
    },
  ],

  /**
   * LinkedIn has not been supplied — leave empty so the icon stays an
   * inactive placeholder rather than linking to a guessed profile.
   */
  social: {
    facebookUrl: "https://www.facebook.com/TiTASPDW/",
    instagramUrl: "https://www.instagram.com/titas.pdw/",
    linkedinUrl: "",
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

export const telHref = `tel:+91${company.phone}`;
export const whatsappHref = `https://wa.me/91${company.whatsapp}`;
export const mailHref = `mailto:${company.email}`;
