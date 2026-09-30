import range from "@/assets/titas/1000156792.jpg";
import everyDrop from "@/assets/titas/1000156793.jpg";
import studio from "@/assets/titas/1000156794.jpg";
import lifestyle from "@/assets/titas/1000156796.jpg";
import doorstep from "@/assets/titas/ChatGPT Image Sep 28, 2026, 01_28_42 PM.png";
import mark from "@/assets/titas/Logo (1).jpeg";
import brandName from "@/assets/titas-brand-name.png.asset.json";
import wordmark from "@/assets/titas-wordmark.png.asset.json";
import bottle from "@/assets/titas/Demo TiTAS 1 L Bottle.png";
import s1 from "@/assets/titas/titas-slide-1.jpg";
import s2 from "@/assets/titas/titas-slide-2.jpg";
import s3 from "@/assets/titas/titas-slide-3.jpg";
import s4 from "@/assets/titas/titas-slide-4.jpg";
import s5 from "@/assets/titas/titas-slide-5.png";

export const brandImages = {
  mark,
  wordmark: wordmark.url,
  bottle,
  /** Official brand-name file (supplied with a baked-in checkerboard background). */
  brandName: brandName.url,
};

/** The five APPROVED homepage slideshow images — use unmodified, full 16:9-style frame. */
export const approvedSlides = [s1, s2, s3, s4, s5].map((src, i) => ({
  id: `slide-${i + 1}`,
  src,
  alt: `TiTAS packaged drinking water — promotional image ${i + 1}`,
}));

/** The five supplied TiTAS promotional images, used for the hero slideshow. */
export const heroSlides = [
  {
    id: "range",
    src: range,
    alt: "TiTAS packaged drinking water range — 500 ml, 1 L, 2 L, 5 L and 20 L packs beside a lake",
    position: "50% 50%",
    mobilePosition: "72% 50%",
  },
  {
    id: "doorstep",
    src: doorstep,
    alt: "A TiTAS delivery representative handing a pack of TiTAS 1 L bottles to a customer at her door",
    position: "50% 50%",
    mobilePosition: "62% 50%",
  },
  {
    id: "every-drop",
    src: everyDrop,
    alt: "TiTAS 1 L bottle with a water splash and the line Every Drop Has a Journey",
    position: "50% 50%",
    mobilePosition: "78% 50%",
  },
  {
    id: "lifestyle",
    src: lifestyle,
    alt: "A traveller drinking TiTAS packaged drinking water on a hilltop, with the full TiTAS pack range",
    position: "50% 45%",
    mobilePosition: "30% 45%",
  },
  {
    id: "studio",
    src: studio,
    alt: "Studio photograph of the TiTAS 1 L bottle with the Ekti Jaler Naam wordmark",
    position: "50% 50%",
    mobilePosition: "70% 50%",
  },
] as const;

/**
 * Gallery.
 * Only supplied product/demo imagery is used. Facility, laboratory, delivery
 * and operations photographs are not available yet — those categories are
 * marked as coming soon rather than filled with stock or generated photos.
 */
export const galleryCategories = [
  {
    id: "products",
    label: "Products",
    available: true,
    items: [
      { src: range, alt: "The full TiTAS pack range from 500 ml to 20 L" },
      { src: studio, alt: "TiTAS 1 L bottle, studio photograph" },
      { src: everyDrop, alt: "TiTAS 1 L bottle with water splash" },
    ],
  },
  {
    id: "packaging",
    label: "Packaging",
    available: true,
    items: [
      { src: bottle, alt: "TiTAS 1 L bottle showing the pack label" },
      {
        src: lifestyle,
        alt: "TiTAS packs photographed together with a traveller",
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    available: true,
    items: [
      {
        src: doorstep,
        alt: "TiTAS pack being handed over at a customer's door",
      },
    ],
  },
  { id: "plant", label: "Plant", available: false, items: [] },
  { id: "quality", label: "Quality & Testing", available: false, items: [] },
  { id: "operations", label: "Operations", available: false, items: [] },
] as const;
