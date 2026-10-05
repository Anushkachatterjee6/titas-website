import homeImg from "@/assets/titas/motion/TiTAS Home Delivery Splash.png";
import officeImg from "@/assets/titas/motion/Modern TiTAS® Office Hydration Scene.png";
import institutionalImg from "@/assets/titas/motion/TiTAS® Campus Hydration Campaign.png";
import eventsImg from "@/assets/titas/motion/TiTAS Event Refreshment Showcase.png";
import scheduledImg from "@/assets/titas/motion/TiTAS Scheduled Water Delivery.png";
import wholesaleImg from "@/assets/titas/motion/TiTAS Water Delivery Showcase.png";
import distributorImg from "@/assets/titas/motion/TiTAS Water Distribution Showcase.png";
import bulkImg from "@/assets/titas/motion/TiTAS® Bulk Supply Consultation Scene.png";

/** Approved services list. Wording taken from the approval document. */

export type Service = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

export const services: Service[] = [
  {
    slug: "home-residential",
    title: "Home & Residential Supply",
    description:
      "Packaged drinking water for household and everyday requirements.",
    image: homeImg,
  },
  {
    slug: "office-commercial",
    title: "Office & Commercial Supply",
    description:
      "Regular or bulk supply for offices, hotels, restaurants, shops and other businesses.",
    image: officeImg,
  },
  {
    slug: "institutional",
    title: "Institutional Supply",
    description: "Supply for schools, colleges, hospitals and other organisations.",
    image: institutionalImg,
  },
  {
    slug: "events-bulk",
    title: "Events & Bulk Orders",
    description:
      "Packaged drinking water for weddings, parties, conferences, festivals and large gatherings.",
    image: eventsImg,
  },
  {
    slug: "regular-scheduled",
    title: "Regular & Scheduled Supply",
    description:
      "Recurring supply arrangements for customers with regular requirements.",
    image: scheduledImg,
  },
  {
    slug: "wholesale-retailer",
    title: "Wholesale & Retailer Supply",
    description: "Larger-volume supply for retailers and wholesale customers.",
    image: wholesaleImg,
  },
  {
    slug: "distributor-dealer",
    title: "Distributor & Dealer Supply",
    description:
      "A dedicated business-partner service for distributors and dealers interested in selling TiTAS.",
    image: distributorImg,
  },
  {
    slug: "custom-bulk",
    title: "Custom Bulk Enquiry / Business Supply",
    description:
      "Customers can request a quotation based on pack size, quantity, location and frequency.",
    image: bulkImg,
  },
];

/** Approved "Why Choose TiTAS" points. */
export const whyTitas = [
  {
    title: "Reliable Experience",
    description:
      "Serving customers since 1999, with a strong focus on dependable packaged drinking water supply and consistent service.",
  },
  {
    title: "Quality Focused",
    description:
      "Committed to maintaining quality, hygiene and consistency throughout the water treatment, bottling and packaging process.",
  },
  {
    title: "Wide Delivery Reach",
    description:
      "Reliable delivery solutions across our applicable service areas, based on location and order requirements.",
  },
  {
    title: "Flexible Supply",
    description:
      "Convenient supply solutions for homes, offices, businesses, institutions, events and bulk requirements.",
  },
  {
    title: "Customer-Focused Service",
    description:
      "Dedicated to understanding customer needs and providing responsive, dependable and convenient service.",
  },
  {
    title: "Multiple Pack Sizes",
    description:
      "Available in 500 ml, 1 L, 2 L, 5 L and 20 L packs to meet different everyday, commercial and bulk requirements.",
  },
  {
    title: "Hygienic Processing & Packaging",
    description:
      "Careful attention to hygiene during water processing, bottling, handling and packaging.",
  },
  {
    title: "Bulk & Business Support",
    description:
      "Supply solutions for retailers, wholesalers, dealers, distributors, offices, institutions and event requirements.",
  },
  {
    title: "Pure & Safe Water",
    description:
      "TiTAS is committed to providing quality-focused packaged drinking water through a carefully managed, multi-stage treatment process. From filtration and purification to UV treatment, ozonation, hygienic filling and packaging, attention is given to quality, hygiene and consistency throughout the process.",
  },
  {
    title: "Affordable Price",
    description:
      "TiTAS believes quality packaged drinking water should be available at a practical and competitive price. With different pack sizes and flexible supply options, we aim to provide dependable value for households, retailers, offices, hotels, restaurants, institutions, events and bulk requirements.",
  },
];

export const enquiryTypes = [
  "Product Enquiry",
  "Bulk Order",
  "Home Delivery",
  "Office/Commercial Supply",
  "Institutional Supply",
  "Dealer/Distributor Enquiry",
  "General Enquiry",
] as const;
