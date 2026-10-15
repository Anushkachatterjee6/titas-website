import range from "@/assets/titas/1000156792.webp";
import everyDrop from "@/assets/titas/1000156793.webp";
import studio from "@/assets/titas/1000156794.webp";
import lifestyle from "@/assets/titas/1000156796.webp";
import doorstep from "@/assets/titas/titas-slide-5-v2.webp";
// The original Logo (1).jpeg has a plain white square background baked in
// (JPEGs can't carry transparency) — this is the same artwork, keyed and
// cropped to a genuinely transparent image so it sits cleanly on any
// background without a white box or square corners behind the circular mark.
// Served as a lossless WebP (titas-mark-transparent.png is the untouched
// source, kept alongside it) — pixel-identical at every visible pixel,
// verified directly against the PNG rather than assumed from "lossless".
import mark from "@/assets/titas/motion/titas-mark-transparent.webp";
import brandName from "@/assets/titas-brand-name.png.asset.json";
import wordmark from "@/assets/titas-wordmark.png.asset.json";
import bottle from "@/assets/titas/Demo TiTAS 1 L Bottle.webp";
import s1 from "@/assets/titas/titas-slide-1.webp";
import s2 from "@/assets/titas/titas-slide-2.webp";
import s3 from "@/assets/titas/titas-slide-3.webp";
import s4 from "@/assets/titas/titas-slide-4.webp";
import s5 from "@/assets/titas/titas-slide-5-v2.webp";
// 1200px-wide variants of the same crop/content, same encoder settings as
// the full-size originals — used as the smaller `srcset` candidate so
// narrow mobile viewports don't download the full 1600/1983px image. Same
// visual framing, just fewer pixels; verified visually equivalent at
// actual mobile render size before adding.
import s1Mobile from "@/assets/titas/titas-slide-1-mobile.webp";
import s2Mobile from "@/assets/titas/titas-slide-2-mobile.webp";
import s3Mobile from "@/assets/titas/titas-slide-3-mobile.webp";
import s4Mobile from "@/assets/titas/titas-slide-4-mobile.webp";
import s5Mobile from "@/assets/titas/titas-slide-5-v2-mobile.webp";

export const brandImages = {
  mark,
  wordmark: wordmark.url,
  bottle,
  /** Official brand-name file (supplied with a baked-in checkerboard background). */
  brandName: brandName.url,
};

// Each slide's actual measured intrinsic size (not guessed) — slides 1-4
// are 1600x639, slide 5 is 1983x793; both ratios round to the same
// aspect-[1600/639] the slideshow's frame already uses, so passing each
// slide's own real width/height as <img> attributes lets the browser
// reserve the correct box before the image loads without affecting the
// displayed size (still governed by the frame's CSS + object-cover).
const APPROVED_SLIDE_DIMENSIONS = [
  { width: 1600, height: 639 },
  { width: 1600, height: 639 },
  { width: 1600, height: 639 },
  { width: 1600, height: 639 },
  { width: 1983, height: 793 },
];

const APPROVED_SLIDE_MOBILE = [s1Mobile, s2Mobile, s3Mobile, s4Mobile, s5Mobile];

/** The five APPROVED homepage slideshow images — use unmodified, full 16:9-style frame. */
export const approvedSlides = [s1, s2, s3, s4, s5].map((src, i) => ({
  id: `slide-${i + 1}`,
  src,
  // 1200w mobile candidate + the full-size original, same content/crop at
  // both resolutions — lets narrow viewports fetch the smaller file
  // instead of always downloading the ~1600-1983px original.
  srcSet: `${APPROVED_SLIDE_MOBILE[i]} 1200w, ${src} ${APPROVED_SLIDE_DIMENSIONS[i]!.width}w`,
  alt: `TiTAS packaged drinking water — promotional image ${i + 1}`,
  ...APPROVED_SLIDE_DIMENSIONS[i]!,
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
    width: 1983,
    height: 793,
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
      // Wide banner — the TiTAS wordmark sits in the upper-left third, not
      // the centre, so a centred square crop would cut it off.
      {
        src: range,
        alt: "The full TiTAS pack range from 500 ml to 20 L",
        position: "22% 38%",
        width: 1600,
        height: 639,
      },
      // Portrait product shot, label already sits in the vertical middle —
      // the default centred crop already frames it correctly.
      {
        src: studio,
        alt: "TiTAS 1 L bottle, studio photograph",
        position: "center",
        width: 1600,
        height: 639,
      },
      // Wide banner — wordmark sits right-of-centre, upper half.
      {
        src: everyDrop,
        alt: "TiTAS 1 L bottle with water splash",
        position: "58% 38%",
        width: 1600,
        height: 639,
      },
    ],
  },
  {
    id: "packaging",
    label: "Packaging",
    available: true,
    items: [
      // Tall bottle photo, label already centred — default crop is fine.
      {
        src: bottle,
        alt: "TiTAS 1 L bottle showing the pack label",
        position: "center",
        width: 1024,
        height: 1536,
      },
      // Wide banner — wordmark sits centred, upper third.
      {
        src: lifestyle,
        alt: "TiTAS packs photographed together with a traveller",
        position: "55% 32%",
        width: 1600,
        height: 639,
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    available: true,
    items: [
      // Wide banner — the TiTAS logo and headline sit in the upper-left
      // corner, well outside a centred square crop.
      {
        src: doorstep,
        alt: "TiTAS pack being handed over at a customer's door",
        position: "16% 22%",
        width: 1983,
        height: 793,
      },
    ],
  },
  { id: "plant", label: "Plant", available: false, items: [] },
  { id: "quality", label: "Quality & Testing", available: false, items: [] },
  { id: "operations", label: "Operations", available: false, items: [] },
] as const;
