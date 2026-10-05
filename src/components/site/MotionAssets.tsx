import { useEffect, useRef, useState } from "react";
import sourceImg from "@/assets/titas/motion/source-3d.png";
import purificationImg from "@/assets/titas/motion/purification-3d.png";
import qualityImg from "@/assets/titas/motion/quality-3d.png";
import bottleImg from "@/assets/titas/motion/bottle-3d.png";
import deliveryImg from "@/assets/titas/motion/delivery-3d.png";
import networkCenterImg from "@/assets/titas/motion/network-center-splash.png";
import networkHomeImg from "@/assets/titas/motion/network-home.png";
import networkOfficeImg from "@/assets/titas/motion/network-events-bulk.png";
import networkInstitutionalImg from "@/assets/titas/motion/network-institutional.png";
import networkEventsImg from "@/assets/titas/motion/TITAS Water Station Splash Pavilion(1).png";
import networkRegularImg from "@/assets/titas/motion/TiTAS Water Delivery Splash Scene.png";
import networkWholesaleImg from "@/assets/titas/motion/TiTAS Water Warehouse Splash.png";
import networkDistributorImg from "@/assets/titas/motion/TiTAS Distributor Water Showcase.png";
import networkCustomBulkImg from "@/assets/titas/motion/TiTAS Water Facility Splash Cutout.png";
import orderBrowseImg from "@/assets/titas/motion/TiTAS Water Marketplace Splash Showcase.png";
import orderAddToCartImg from "@/assets/titas/motion/TiTAS Water Cart Splash (1).png";
import orderCartReviewImg from "@/assets/titas/motion/TiTAS Water Cart Adventure.png";
import orderConfirmedImg from "@/assets/titas/motion/TiTAS Order Confirmed 3D Scene.png";
import orderDeliveryImg from "@/assets/titas/motion/TiTAS Water Delivery Tracking Graphic.png";
import { RoutePath } from "@/components/site/WaterMotion";
import { usePrefersReducedMotion, useRevealOnce, useScrollProgress } from "@/lib/hooks";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * The three curated 3D motion assets are flattened compositions — the
 * individual glyphs (drop, node buildings, phone screens…) cannot be pulled
 * out as separate layers. Per the brief, motion here is built with
 * camera-like movement over the whole image instead: masked/clip-path
 * reveals, sequential cropping and light sweeps — never generated
 * replacement graphics, never distortion of the source art.
 */

const REVEAL_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/* ------------------------------------------------------------------ */
/* 1. Water Journey — Source → Purification → Quality → Bottle → Delivery */
/* Five genuinely-transparent 3D assets, choreographed as one sequence: */
/* each object rises into place, then a water path draws on to the next. */
/* ------------------------------------------------------------------ */

const JOURNEY_STAGES = [
  { key: "source", label: "Source", img: sourceImg },
  { key: "purification", label: "Purification", img: purificationImg },
  { key: "quality", label: "Quality", img: qualityImg },
  { key: "bottle", label: "Bottle", img: bottleImg },
  { key: "delivery", label: "Delivery", img: deliveryImg },
] as const;

const JOURNEY_ENTER_MS = 650;
const JOURNEY_PATH_MS = 550;
const JOURNEY_GAP_MS = 100;

/** landAt[i]: when stage i finishes rising into place.
 *  pathStartAt[i]: when the path segment INTO stage i starts drawing (i>=1). */
const JOURNEY_PATH_START_AT: number[] = [];
const JOURNEY_LAND_AT: number[] = [0];
for (let i = 1; i < JOURNEY_STAGES.length; i++) {
  const pathStart = JOURNEY_LAND_AT[i - 1]! + JOURNEY_GAP_MS;
  JOURNEY_PATH_START_AT[i] = pathStart;
  JOURNEY_LAND_AT[i] = pathStart + JOURNEY_PATH_MS + JOURNEY_GAP_MS;
}

/** Per-stage entrance transform: everyone rises + settles, with one
 *  distinguishing beat each — quality gets a glass sweep, bottle a subtle
 *  3D tilt, delivery a slightly deeper "forward" arrival. */
function journeyEnterTransform(key: string, active: boolean): string {
  if (!active) {
    switch (key) {
      case "bottle":
        return "translateY(18px) scale(0.94) rotateY(-14deg)";
      case "delivery":
        return "translateY(26px) scale(0.86)";
      default:
        return "translateY(20px) scale(0.93)";
    }
  }
  return "translateY(0) scale(1) rotateY(0deg)";
}

function JourneyStageBox({
  stage,
  index,
  active,
  reducedMotion,
}: {
  stage: (typeof JOURNEY_STAGES)[number];
  index: number;
  active: boolean;
  reducedMotion: boolean;
}) {
  const landDelay = JOURNEY_LAND_AT[index]!;
  const floatDelay = landDelay + JOURNEY_ENTER_MS;

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative flex h-[7.5rem] w-full items-center justify-center sm:h-32 md:h-36 [perspective:900px]"
        style={{
          opacity: active ? 1 : 0,
          transform: journeyEnterTransform(stage.key, active),
          transition: reducedMotion
            ? "none"
            : `opacity ${JOURNEY_ENTER_MS}ms ease-out ${landDelay}ms, transform ${JOURNEY_ENTER_MS}ms ${REVEAL_EASE} ${landDelay}ms`,
        }}
      >
        <div
          className={cn("relative h-full", !reducedMotion && "animate-float-tiny")}
          style={!reducedMotion ? { animationDelay: `${floatDelay}ms` } : undefined}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-[10%] bottom-[2%] h-[14%] rounded-full bg-ink/25 blur-md"
          />
          <img
            src={stage.img}
            alt=""
            aria-hidden="true"
            className="relative h-full w-auto max-w-none select-none drop-shadow-[0_14px_18px_rgba(10,40,70,0.2)]"
            draggable={false}
          />
          {stage.key === "quality" && !reducedMotion && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ animationDelay: `${floatDelay}ms` }}
            >
              <span
                className="animate-sweep-once absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                style={{ animationDelay: `${floatDelay}ms` }}
              />
            </span>
          )}
        </div>
      </div>
      <span
        className="eyebrow mt-3 text-aqua"
        style={{
          opacity: active ? 1 : 0,
          transition: reducedMotion ? "none" : `opacity 500ms ease-out ${landDelay}ms`,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3
        className="mt-0.5 text-sm font-semibold text-ink md:text-base"
        style={{
          opacity: active ? 1 : 0,
          transition: reducedMotion ? "none" : `opacity 500ms ease-out ${landDelay}ms`,
        }}
      >
        {stage.label}
      </h3>
    </div>
  );
}

/** Desktop connector: one SVG spanning the row, one drawn path per gap
 *  between the 10/30/50/70/90% stage centres (matching the 5-col grid). */
function JourneyDesktopConnector({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const xs = [100, 300, 500, 700, 900];
  const dips = [55, 105, 55, 105];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 160"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-[3.75rem] h-16 w-full sm:top-16 md:top-[4.5rem]"
    >
      {xs.slice(0, -1).map((x0, i) => {
        const x1 = xs[i + 1]!;
        const d = `M ${x0} 80 Q ${(x0 + x1) / 2} ${dips[i]} ${x1} 80`;
        const delay = JOURNEY_PATH_START_AT[i + 1]!;
        const style: React.CSSProperties = {
          strokeDasharray: 1200,
          strokeDashoffset: active ? 0 : 1200,
          transition: reducedMotion ? "none" : `stroke-dashoffset ${JOURNEY_PATH_MS}ms linear ${delay}ms`,
        };
        return (
          <g key={i}>
            <path d={d} stroke="currentColor" strokeWidth="7" fill="none" strokeLinecap="round" className="text-aqua/25 blur-[2px]" style={style} />
            <path d={d} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-aqua" style={style} />
          </g>
        );
      })}
    </svg>
  );
}

/** Mobile connector: a short vertical bar between each stacked stage,
 *  revealed by scaling up from the top — the path becomes vertical. */
function JourneyMobileConnector({ index, active, reducedMotion }: { index: number; active: boolean; reducedMotion: boolean }) {
  const delay = JOURNEY_PATH_START_AT[index + 1]!;
  return (
    <div className="flex h-10 items-center justify-center" aria-hidden="true">
      <span
        className="h-full w-[3px] rounded-full bg-gradient-to-b from-aqua/70 to-aqua/40"
        style={{
          transformOrigin: "top",
          transform: active ? "scaleY(1)" : "scaleY(0)",
          transition: reducedMotion ? "none" : `transform ${JOURNEY_PATH_MS}ms linear ${delay}ms`,
        }}
      />
    </div>
  );
}

export function WaterJourneyVisual() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: revealRef, shown } = useRevealOnce<HTMLDivElement>(0.2);
  const { ref: tiltRef, progress } = useScrollProgress<HTMLDivElement>();

  const tilt = reducedMotion ? 0 : (progress - 0.5) * 4;
  const active = shown || reducedMotion;

  return (
    <div ref={revealRef} className="relative mt-16 [perspective:1800px]">
      <div
        ref={tiltRef}
        className="relative transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `rotateX(${tilt}deg)` }}
      >
        {/* Mobile: vertical stack, water path flows downward */}
        <div className="flex flex-col items-center md:hidden">
          {JOURNEY_STAGES.map((stage, i) => (
            <div key={stage.key} className="w-full max-w-[10rem]">
              {i > 0 && <JourneyMobileConnector index={i - 1} active={active} reducedMotion={reducedMotion} />}
              <JourneyStageBox stage={stage} index={i} active={active} reducedMotion={reducedMotion} />
            </div>
          ))}
        </div>

        {/* Desktop: horizontal row, water path flows left to right */}
        <div className="relative hidden md:block">
          <JourneyDesktopConnector active={active} reducedMotion={reducedMotion} />
          <div className="relative grid grid-cols-5 gap-x-6">
            {JOURNEY_STAGES.map((stage, i) => (
              <JourneyStageBox key={stage.key} stage={stage} index={i} active={active} reducedMotion={reducedMotion} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Services Network — TiTAS centre + 8 individually-rendered 3D      */
/* service visuals, connected by curved, animated water streams.        */
/* ------------------------------------------------------------------ */

const NETWORK_SERVICES = [
  { slug: "home-residential", img: networkHomeImg, short: "Home & Residential", angle: -96, radius: 43 },
  { slug: "office-commercial", img: networkOfficeImg, short: "Office & Commercial", angle: -40, radius: 54 },
  { slug: "institutional", img: networkInstitutionalImg, short: "Institutional", angle: 10, radius: 47 },
  { slug: "events-bulk", img: networkEventsImg, short: "Events & Bulk", angle: 53, radius: 55 },
  { slug: "regular-scheduled", img: networkRegularImg, short: "Regular & Scheduled", angle: 100, radius: 44 },
  { slug: "wholesale-retailer", img: networkWholesaleImg, short: "Wholesale & Retailer", angle: 148, radius: 53 },
  { slug: "distributor-dealer", img: networkDistributorImg, short: "Distributor & Dealer", angle: -172, radius: 48 },
  { slug: "custom-bulk", img: networkCustomBulkImg, short: "Custom Bulk", angle: -138, radius: 51 },
] as const;

const NETWORK_CENTER_ENTER_MS = 700;
const NETWORK_STREAM_MS = 550;
const NETWORK_STREAM_STAGGER = 130;
const NETWORK_NODE_ENTER_MS = 600;
/** How far along each curve the drawn stream stops, short of the node —
 *  the clear visual gap before the artwork (≈30–40px at typical section
 *  width, since the viewBox is 0–100 over an ~500–650px composition). */
const NETWORK_GAP_T = 0.78;

/** Rounded to 3dp: trig/float math can differ in its last bit between the
 *  Node SSR pass and the browser, which otherwise trips a hydration
 *  mismatch on these coordinates. Three decimal places is far finer than
 *  visible at this render size, so nothing is lost. */
function r3(n: number) {
  return Math.round(n * 1000) / 1000;
}

function nodePosition(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: r3(50 + Math.cos(rad) * radius), y: r3(50 + Math.sin(rad) * radius * 0.82) };
}

type Pt = { x: number; y: number };

function quadPoint(p0: Pt, pc: Pt, p1: Pt, t: number): Pt {
  const mt = 1 - t;
  return {
    x: r3(mt * mt * p0.x + 2 * mt * t * pc.x + t * t * p1.x),
    y: r3(mt * mt * p0.y + 2 * mt * t * pc.y + t * t * p1.y),
  };
}

function quadTangent(p0: Pt, pc: Pt, p1: Pt, t: number): Pt {
  return {
    x: 2 * (1 - t) * (pc.x - p0.x) + 2 * t * (p1.x - pc.x),
    y: 2 * (1 - t) * (pc.y - p0.y) + 2 * t * (p1.y - pc.y),
  };
}

/** Splits a quadratic Bézier at t (De Casteljau), returning the control
 *  points of the sub-curve from 0..t — so the drawn stream can stop short
 *  of the node while keeping an exact, smoothly-tangent curve. */
function quadSplit(p0: Pt, pc: Pt, p1: Pt, t: number) {
  const a = { x: p0.x + (pc.x - p0.x) * t, y: p0.y + (pc.y - p0.y) * t };
  const b = { x: pc.x + (p1.x - pc.x) * t, y: pc.y + (p1.y - pc.y) * t };
  const end = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  return { control: { x: r3(a.x), y: r3(a.y) }, end: { x: r3(end.x), y: r3(end.y) } };
}

/** Builds a smoothly-tapered ribbon (a filled shape, not a uniform stroke)
 *  along a quadratic curve — thin near the centre, gently widening toward
 *  the destination, with crisp edges (no blur). */
function ribbonPath(p0: Pt, pc: Pt, p1: Pt, widthStart: number, widthEnd: number, samples = 14) {
  const top: Pt[] = [];
  const bottom: Pt[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const pt = quadPoint(p0, pc, p1, t);
    const tan = quadTangent(p0, pc, p1, t);
    const tlen = Math.hypot(tan.x, tan.y) || 1;
    const nx = -tan.y / tlen;
    const ny = tan.x / tlen;
    const w = (widthStart + (widthEnd - widthStart) * t) / 2;
    top.push({ x: r3(pt.x + nx * w), y: r3(pt.y + ny * w) });
    bottom.push({ x: r3(pt.x - nx * w), y: r3(pt.y - ny * w) });
  }
  const topD = top.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const bottomD = bottom
    .slice()
    .reverse()
    .map((p) => `L ${p.x} ${p.y}`)
    .join(" ");
  return `${topD} ${bottomD} Z`;
}

function NetworkStream({
  index,
  active,
  hovered,
  reducedMotion,
}: {
  index: number;
  active: boolean;
  hovered: boolean;
  reducedMotion: boolean;
}) {
  const service = NETWORK_SERVICES[index]!;
  const gradId = `titas-stream-${service.slug}`;
  const center: Pt = { x: 50, y: 50 };
  const fullEnd = nodePosition(service.angle, service.radius);
  const mid = { x: (center.x + fullEnd.x) / 2, y: (center.y + fullEnd.y) / 2 };
  const dx = fullEnd.x - center.x;
  const dy = fullEnd.y - center.y;
  const len = Math.hypot(dx, dy) || 1;
  const curveAmount = index % 2 === 0 ? 5 : -5;
  const control = { x: mid.x + (-dy / len) * curveAmount, y: mid.y + (dx / len) * curveAmount };

  // Stop the drawn curve short of the node, leaving a clear visual gap.
  const { control: gapControl, end } = quadSplit(center, control, fullEnd, NETWORK_GAP_T);
  const centerline = `M ${center.x} ${center.y} Q ${gapControl.x} ${gapControl.y} ${end.x} ${end.y}`;
  const ribbon = ribbonPath(center, gapControl, end, hovered ? 1.4 : 1, hovered ? 3.2 : 2.4);
  const delay = NETWORK_CENTER_ENTER_MS + index * NETWORK_STREAM_STAGGER;

  const revealStyle: React.CSSProperties = {
    strokeDasharray: 200,
    strokeDashoffset: active ? 0 : 200,
    transition: reducedMotion ? "none" : `stroke-dashoffset ${NETWORK_STREAM_MS}ms ${REVEAL_EASE} ${delay}ms`,
  };

  return (
    <g style={{ opacity: active ? 1 : 0, transition: "opacity 400ms ease-out" }}>
      <defs>
        <linearGradient id={gradId} x1={center.x} y1={center.y} x2={end.x} y2={end.y} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-aqua)" stopOpacity={hovered ? 0.35 : 0.22} />
          <stop offset="100%" stopColor="var(--color-aqua)" stopOpacity={hovered ? 0.85 : 0.6} />
        </linearGradient>
      </defs>

      {/* The stream body: a crisp, tapered, translucent ribbon — no blur */}
      <path d={ribbon} fill={`url(#${gradId})`} className="transition-[fill-opacity] duration-300" />

      {/* A restrained highlight along one edge, like light catching moving water */}
      <path
        d={centerline}
        stroke="white"
        strokeWidth={0.35}
        fill="none"
        strokeLinecap="round"
        style={{ ...revealStyle, opacity: active ? (hovered ? 0.55 : 0.3) : 0 }}
      />

      {/* Directional flow — a short travelling highlight, integrated into the stream itself */}
      {active && !reducedMotion && (
        <path
          d={centerline}
          stroke="white"
          strokeWidth={hovered ? 0.9 : 0.6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2.5 11"
          className="animate-flow-dash"
          style={{
            animationDuration: hovered ? "1.1s" : "3.2s",
            opacity: hovered ? 0.75 : 0.4,
            transition: "opacity 300ms ease-out",
          }}
        />
      )}
    </g>
  );
}

function NetworkNode({
  index,
  active,
  hovered,
  reducedMotion,
  onHover,
}: {
  index: number;
  active: boolean;
  hovered: boolean;
  reducedMotion: boolean;
  onHover: (slug: string | null) => void;
}) {
  const service = NETWORK_SERVICES[index]!;
  const pos = nodePosition(service.angle, service.radius);
  const delay = NETWORK_CENTER_ENTER_MS + index * NETWORK_STREAM_STAGGER + NETWORK_STREAM_MS;
  const title = services.find((s) => s.slug === service.slug)?.title ?? service.short;

  return (
    <button
      type="button"
      aria-label={title}
      onMouseEnter={() => onHover(service.slug)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(service.slug)}
      onBlur={() => onHover(null)}
      className="absolute flex flex-col items-center outline-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: "27%",
        opacity: active ? 1 : 0,
        transition: reducedMotion
          ? "none"
          : `opacity 550ms ease-out ${delay}ms, transform ${hovered ? 280 : 550}ms ${REVEAL_EASE} ${active ? (hovered ? 0 : delay) : 0}ms`,
        transform: `translate(-50%, -50%) scale(${active ? 1 : 0.7})`,
      }}
    >
      <div
        style={{
          transform: hovered ? "translateY(-6px) scale(1.06)" : "translateY(0) scale(1)",
          transition: "transform 280ms ease-out",
        }}
      >
        <img
          src={service.img}
          alt=""
          aria-hidden="true"
          className="w-full select-none transition-[filter] duration-300"
          style={{
            filter: hovered
              ? "drop-shadow(0 16px 20px rgba(10,40,70,0.28))"
              : "drop-shadow(0 8px 12px rgba(10,40,70,0.16))",
          }}
          draggable={false}
        />
      </div>
      <span className="mt-1.5 max-w-[7rem] text-center text-[0.68rem] leading-tight font-semibold text-ink md:text-xs">
        {service.short}
      </span>
    </button>
  );
}

/** Mobile: a single vertical chain — centre, then each service in turn —
 *  with a short water connector between every pair, instead of the radial
 *  composition scaled down. */
function ServicesNetworkMobile({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  return (
    <div className="mx-auto flex max-w-[13rem] flex-col items-center md:hidden">
      <div
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "scale(1)" : "scale(0.82)",
          transition: reducedMotion ? "none" : `opacity ${NETWORK_CENTER_ENTER_MS}ms ease-out, transform ${NETWORK_CENTER_ENTER_MS}ms ${REVEAL_EASE}`,
        }}
      >
        <img src={networkCenterImg} alt="TiTAS" className="w-32 select-none drop-shadow-[0_16px_24px_rgba(10,40,70,0.22)]" draggable={false} />
      </div>

      {NETWORK_SERVICES.map((s, i) => {
        const connectorDelay = NETWORK_CENTER_ENTER_MS + i * NETWORK_STREAM_STAGGER;
        const nodeDelay = connectorDelay + NETWORK_STREAM_MS;
        const title = services.find((svc) => svc.slug === s.slug)?.title ?? s.short;
        const ribbon = ribbonPath({ x: 10, y: 0 }, { x: 10, y: 22 }, { x: 10, y: 44 }, 0.8, 2.4, 10);
        return (
          <div key={s.slug} className="flex flex-col items-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 44"
              className="h-11 w-5 text-aqua"
              style={{
                opacity: active ? 1 : 0,
                transition: reducedMotion ? "none" : `opacity 200ms ease-out ${connectorDelay}ms`,
              }}
            >
              <defs>
                <linearGradient id={`titas-mstream-${s.slug}`} x1="10" y1="0" x2="10" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--color-aqua)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-aqua)" stopOpacity="0.65" />
                </linearGradient>
              </defs>
              <path
                d={ribbon}
                fill={`url(#titas-mstream-${s.slug})`}
                style={{
                  transformOrigin: "50% 0%",
                  transform: active ? "scaleY(1)" : "scaleY(0)",
                  transition: reducedMotion ? "none" : `transform ${NETWORK_STREAM_MS}ms linear ${connectorDelay}ms`,
                }}
              />
              {active && !reducedMotion && (
                <path
                  d="M10 2 L10 42"
                  stroke="white"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeDasharray="2 8"
                  className="animate-flow-dash"
                  style={{ opacity: 0.5, animationDuration: "2.6s" }}
                />
              )}
            </svg>
            <div
              className="flex flex-col items-center"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0) scale(1)" : "translateY(14px) scale(0.92)",
                transition: reducedMotion ? "none" : `opacity 500ms ease-out ${nodeDelay}ms, transform 500ms ${REVEAL_EASE} ${nodeDelay}ms`,
              }}
            >
              <img src={s.img} alt="" aria-hidden="true" className="w-28 select-none drop-shadow-[0_10px_16px_rgba(10,40,70,0.18)]" draggable={false} />
              <span className="mt-1 text-center text-xs font-semibold text-ink" title={title}>
                {s.short}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ServicesNetworkVisual() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: revealRef, shown } = useRevealOnce<HTMLDivElement>(0.15);
  const { ref: tiltRef, progress } = useScrollProgress<HTMLDivElement>();
  const [hovered, setHovered] = useState<string | null>(null);

  const active = shown || reducedMotion;
  const tiltX = reducedMotion ? 0 : (progress - 0.5) * 4;
  const tiltY = reducedMotion ? 0 : (progress - 0.5) * -3;

  return (
    <div ref={revealRef} className="relative mt-16">
      <ServicesNetworkMobile active={active} reducedMotion={reducedMotion} />
      <div className="relative mx-auto hidden aspect-square w-full max-w-2xl [perspective:2000px] md:block">
      <div
        ref={tiltRef}
        className="relative size-full transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
      >
        <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {NETWORK_SERVICES.map((s, i) => (
            <NetworkStream key={s.slug} index={i} active={active} hovered={hovered === s.slug} reducedMotion={reducedMotion} />
          ))}
        </svg>

        {NETWORK_SERVICES.map((s, i) => (
          <NetworkNode
            key={s.slug}
            index={i}
            active={active}
            hovered={hovered === s.slug}
            reducedMotion={reducedMotion}
            onHover={setHovered}
          />
        ))}

        {/* TiTAS centre — the dominant anchor, enters first */}
        <div
          className="absolute top-1/2 left-1/2 w-[26%]"
          style={{
            transform: `translate(-50%, -50%) scale(${active ? 1 : 0.8})`,
            opacity: active ? 1 : 0,
            transition: reducedMotion ? "none" : `opacity ${NETWORK_CENTER_ENTER_MS}ms ease-out, transform ${NETWORK_CENTER_ENTER_MS}ms ${REVEAL_EASE}`,
          }}
        >
          <div className={cn("relative", !reducedMotion && "animate-float-tiny")}>
            <img src={networkCenterImg} alt="TiTAS" className="w-full select-none drop-shadow-[0_18px_26px_rgba(10,40,70,0.24)]" draggable={false} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Ordering Flow — six individual phone-state cutouts                */
/* ------------------------------------------------------------------ */

/** Five genuinely transparent individual assets — no dedicated "Payment"
 *  artwork was supplied for this refresh, so that state was dropped rather
 *  than reused from a mismatched image. */
const ORDER_STATES = [
  { label: "Browse", img: orderBrowseImg },
  { label: "Add to Cart", img: orderAddToCartImg },
  { label: "Cart", img: orderCartReviewImg },
  { label: "Confirmed", img: orderConfirmedImg },
  { label: "Delivery", img: orderDeliveryImg },
];

const ORDER_DURATION = 2600;
const ORDER_TRANSITION = 700;
const ORDER_CONFIRMED_INDEX = ORDER_STATES.findIndex((s) => s.label === "Confirmed");
const ORDER_DELIVERY_INDEX = ORDER_STATES.findIndex((s) => s.label === "Delivery");

export function OrderingFlowVisual() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const { ref: revealRef, shown } = useRevealOnce<HTMLDivElement>(0.3);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!shown || reducedMotion) return;
    const t = setInterval(() => setActive((i) => (i + 1) % ORDER_STATES.length), ORDER_DURATION);
    return () => clearInterval(t);
  }, [shown, reducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType !== "mouse") return;
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-y", `${px * 7}deg`);
    el.style.setProperty("--tilt-x", `${py * -7}deg`);
  };

  const resetTilt = () => {
    const el = frameRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-x", "0deg");
  };

  return (
    <div ref={revealRef} className="mx-auto w-full max-w-xs">
      <div
        className="relative [perspective:1600px]"
        style={{
          opacity: shown || reducedMotion ? 1 : 0,
          transform: shown || reducedMotion ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 900ms ease-out, transform 900ms cubic-bezier(0.22,1,0.36,1)",
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <div
          ref={frameRef}
          className="relative aspect-square w-full transition-transform duration-300 ease-out"
          style={{
            transform:
              "rotateX(calc(3deg + var(--tilt-x, 0deg))) rotateY(calc(-6deg + var(--tilt-y, 0deg)))",
          }}
        >
          {ORDER_STATES.map((state, i) => {
            const isActive = i === active;
            const layerStyle: React.CSSProperties = {
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scale(1)" : "scale(0.97)",
              transition: reducedMotion
                ? "none"
                : `opacity ${ORDER_TRANSITION}ms ${REVEAL_EASE}, transform ${ORDER_TRANSITION}ms ${REVEAL_EASE}`,
              pointerEvents: isActive ? "auto" : "none",
            };
            return (
              <img
                key={state.label}
                src={state.img}
                alt={`TiTAS ordering flow — ${state.label} state`}
                className="absolute inset-0 size-full select-none object-contain"
                style={layerStyle}
                draggable={false}
              />
            );
          })}

          {/* Confirmed state: restrained ripple + glow, no confetti */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[30%] left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua/25 transition-opacity duration-500"
            style={{ opacity: active === ORDER_CONFIRMED_INDEX && !reducedMotion ? 1 : 0 }}
          >
            {active === ORDER_CONFIRMED_INDEX && !reducedMotion && (
              <span className="animate-check-ripple absolute inset-0 rounded-full bg-aqua/40" />
            )}
          </span>

          {/* Delivery state: a small route draw-on, independent of the flattened art */}
          <div
            className="pointer-events-none absolute inset-x-4 bottom-4 transition-opacity duration-500"
            style={{ opacity: active === ORDER_DELIVERY_INDEX ? 1 : 0 }}
          >
            <RoutePath reducedMotion={reducedMotion} className="drop-shadow-sm" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Ordering flow state">
          {ORDER_STATES.map((state, i) => (
            <button
              key={state.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={state.label}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === active ? "w-6 bg-primary" : "w-1.5 bg-ink/25 hover:bg-ink/45",
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {String(active + 1).padStart(2, "0")} · {ORDER_STATES[active]!.label}
        </p>
      </div>
    </div>
  );
}
