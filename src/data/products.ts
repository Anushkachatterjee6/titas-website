import bottleAsset from "@/assets/titas/Demo TiTAS 1 L Bottle.png";
import rangeAsset from "@/assets/titas/1000156792.jpg";
import bottle500mlAsset from "@/assets/titas/motion/product-500ml.png";
import bottle2lAsset from "@/assets/titas/motion/product-2l-v2.png";
import bottle5lAsset from "@/assets/titas/motion/product-5l-v2.png";
import bottle20lAsset from "@/assets/titas/motion/product-20l-new.png";

/**
 * Product catalogue.
 *
 * Prices below are the client's FINAL approved pricing — not placeholders.
 * `pricePerUnit` is what's charged for one `priceUnit` (e.g. one case of 24
 * for 500 ml, or one jar for 20 L). Update here only; no component
 * hardcodes a price.
 */

export type Product = {
  slug: string;
  size: string;
  name: string;
  headline: string;
  description: string;
  /** Units contained in one case (1 where sold individually, e.g. 5 L/20 L). */
  caseQty: number;
  /** Final price for one `priceUnit`, in INR. */
  pricePerUnit: number;
  priceUnit: string;
  image: string;
  bestFor: string[];
};

export const products: Product[] = [
  {
    slug: "500ml",
    size: "500 ml",
    name: "TiTAS 500 ml",
    headline: "Refreshment on the Go",
    description:
      "Compact and convenient for travel, meetings, events, restaurants and everyday refreshment.",
    caseQty: 24,
    pricePerUnit: 160,
    priceUnit: "case of 24 pieces",
    image: bottle500mlAsset,
    bestFor: ["Travel & commuting", "Meetings & events", "Restaurants & cafés"],
  },
  {
    slug: "1l",
    size: "1 L",
    name: "TiTAS 1 L",
    headline: "Your Everyday Companion",
    description:
      "A practical everyday choice for home, work, travel and individual consumption.",
    caseQty: 24,
    pricePerUnit: 135,
    priceUnit: "case of 24 pieces",
    /** The supplied studio photo is specifically the 1 L bottle. */
    image: bottleAsset,
    bestFor: ["Home & family use", "Workplace desks", "Day trips"],
  },
  {
    slug: "2l",
    size: "2 L",
    name: "TiTAS 2 L",
    headline: "More Water, More Convenience",
    description:
      "Designed for families, shared consumption, journeys and occasions when a larger bottle is more convenient.",
    caseQty: 24,
    pricePerUnit: 155,
    priceUnit: "case of 24 pieces",
    image: bottle2lAsset,
    bestFor: ["Family dining", "Shared consumption", "Long journeys"],
  },
  {
    slug: "5l",
    size: "5 L",
    name: "TiTAS 5 L",
    headline: "Made for Bigger Needs",
    description:
      "A convenient larger-volume solution for homes, workplaces, small gatherings and travel requirements.",
    caseQty: 1,
    pricePerUnit: 45,
    priceUnit: "jar",
    image: bottle5lAsset,
    bestFor: ["Homes & kitchens", "Small gatherings", "Workplaces"],
  },
  {
    slug: "20l",
    size: "20 L",
    name: "TiTAS 20 L",
    headline: "Dependable Supply for Everyday Requirements",
    description:
      "Suitable for offices, institutions, commercial establishments and customers requiring regular higher-volume drinking-water supply.",
    caseQty: 1,
    pricePerUnit: 80,
    priceUnit: "jar",
    image: bottle20lAsset,
    bestFor: ["Offices & institutions", "Commercial premises", "Scheduled supply"],
  },
];

export const rangeImage = rangeAsset;

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug.toLowerCase());

export const formatPrice = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;
