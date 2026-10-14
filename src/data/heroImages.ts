import crownSplash from "@/assets/titas/hero/crown-splash.png";
import ringSplash from "@/assets/titas/hero/ring-splash.png";
import glassPourIce from "@/assets/titas/hero/glass-pour-ice.png";
import verticalVignette from "@/assets/titas/hero/vertical-vignette.png";
import diagonalWave from "@/assets/titas/hero/diagonal-wave.png";
import pourGlassVignette from "@/assets/titas/hero/pour-glass-vignette.png";
import spiral1l from "@/assets/titas/hero/spiral-1l-transparent.png";
import spiralVignette from "@/assets/titas/hero/spiral-vignette.png";

export type HeroImage = { src: string; alt: string; width: number; height: number };

// Each PNG's actual measured intrinsic size (not guessed) — PageHero.tsx
// passes these through as the <img> width/height attributes. The visible
// size is still fully governed by PageHero's own responsive container
// (fixed px height per breakpoint, object-contain), so this doesn't change
// how any of the 8 images actually display; it only gives the browser the
// real aspect ratio up front.
const DIMS = {
  crownSplash: { width: 1466, height: 1073 },
  ringSplash: { width: 1246, height: 1262 },
  glassPourIce: { width: 1351, height: 1164 },
  verticalVignette: { width: 1024, height: 1536 },
  diagonalWave: { width: 1295, height: 1215 },
  pourGlassVignette: { width: 1536, height: 1024 },
  spiral1l: { width: 1353, height: 1162 },
  spiralVignette: { width: 1536, height: 1024 },
} as const;

/**
 * Centralized, deliberate mapping of each PageHero banner's right-side
 * artwork — eight TiTAS bottle renders supplied directly by the client
 * (src/assets/titas/hero), assigned by actually inspecting each image's
 * composition rather than its filename:
 *
 * - crown-splash: bottle centred in a tall, symmetric upward "crown" burst —
 *   a grand, singular brand-identity shot.
 * - ring-splash: a full circular ring/wreath of water encircling the
 *   bottle — reads as a closed loop/cycle.
 * - glass-pour-ice: bottle beside a glass mid-splash with ice — an
 *   everyday "about to drink it" product moment.
 * - vertical-vignette: a tall portrait bottle alone on a dark blue-glow
 *   vignette — premium, singular, trust-forward.
 * - diagonal-wave: the bottle tilted, riding through a horizontal flowing
 *   wave — motion/transit energy.
 * - pour-glass-vignette: the bottle actively pouring into a glass on a
 *   dark vignette — a serving/hospitality gesture.
 * - spiral-1l-transparent: the 1 L bottle wrapped in a swirling water
 *   ribbon, fully transparent — dynamic, outward-reaching motion.
 * - spiral-vignette: the same swirl composition on a dark vignette — a
 *   more dramatic showcase variant.
 *
 * Ordered to match the site's page flow (nav + footer order) so reused
 * images never land on consecutive pages — see the per-entry comments.
 */
export const heroImages = {
  // 1 About — the grand, symmetric brand-identity shot
  about: {
    src: crownSplash,
    alt: "TiTAS bottle in a symmetric crown water splash",
    ...DIMS.crownSplash,
  },
  // 2 Why TiTAS — premium, singular, trust-forward portrait
  whyTitas: {
    src: verticalVignette,
    alt: "TiTAS bottle in a dramatic vertical spotlight",
    ...DIMS.verticalVignette,
  },
  // 3 Quality & Process — the closed ring reads as a purification cycle (reused from #6)
  quality: {
    src: ringSplash,
    alt: "TiTAS bottle encircled by a ring of water",
    ...DIMS.ringSplash,
  },
  // 4 Products — the everyday "about to drink it" product moment
  products: {
    src: glassPourIce,
    alt: "TiTAS bottle beside a splashing glass of ice water",
    ...DIMS.glassPourIce,
  },
  // 5 Services — flowing, in-transit motion
  services: {
    src: diagonalWave,
    alt: "TiTAS bottle riding a flowing water wave",
    ...DIMS.diagonalWave,
  },
  // 6 Journey — the closed ring/cycle, matching "every drop has a journey"
  journey: {
    src: ringSplash,
    alt: "TiTAS bottle encircled by a ring of water",
    ...DIMS.ringSplash,
  },
  // 7 Dealer / Distributor — outward-reaching spiral motion, like a network
  dealerDistributor: {
    src: spiral1l,
    alt: "TiTAS 1 L bottle wrapped in a swirling water ribbon",
    ...DIMS.spiral1l,
  },
  // 8 Gallery — the dramatic showcase variant
  gallery: {
    src: spiralVignette,
    alt: "TiTAS bottle in a swirling water ribbon, dramatic lighting",
    ...DIMS.spiralVignette,
  },
  // 9 FAQs — approachable, neutral product moment (reused from #4)
  faqs: {
    src: glassPourIce,
    alt: "TiTAS bottle beside a splashing glass of ice water",
    ...DIMS.glassPourIce,
  },
  // 10 Contact — pouring/serving reads as "let's talk, let's serve you"
  contact: {
    src: pourGlassVignette,
    alt: "TiTAS bottle pouring water into a glass",
    ...DIMS.pourGlassVignette,
  },
  // 11 Privacy Policy — the dignified brand-identity shot (reused from #1)
  privacyPolicy: {
    src: crownSplash,
    alt: "TiTAS bottle in a symmetric crown water splash",
    ...DIMS.crownSplash,
  },
  // 12 Terms & Conditions — premium, formal portrait (reused from #2)
  terms: {
    src: verticalVignette,
    alt: "TiTAS bottle in a dramatic vertical spotlight",
    ...DIMS.verticalVignette,
  },
  // 13 Shipping & Delivery — motion/transit, matching the page's subject (reused from #5)
  shippingDelivery: {
    src: diagonalWave,
    alt: "TiTAS bottle riding a flowing water wave",
    ...DIMS.diagonalWave,
  },
  // 14 Cancellation & Refund — outward spiral motion (reused from #7)
  cancellationRefund: {
    src: spiral1l,
    alt: "TiTAS 1 L bottle wrapped in a swirling water ribbon",
    ...DIMS.spiral1l,
  },
} as const satisfies Record<string, HeroImage>;
