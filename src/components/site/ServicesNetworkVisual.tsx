import { useState } from "react";
import networkCenterImg from "@/assets/titas/motion/network-center-splash.webp";
import networkHomeImg from "@/assets/titas/motion/network-home.webp";
import networkOfficeImg from "@/assets/titas/motion/network-events-bulk.webp";
import networkInstitutionalImg from "@/assets/titas/motion/network-institutional.webp";
import networkEventsImg from "@/assets/titas/motion/TITAS Water Station Splash Pavilion(1).webp";
import networkRegularImg from "@/assets/titas/motion/TiTAS Water Delivery Splash Scene.webp";
import networkWholesaleImg from "@/assets/titas/motion/TiTAS Water Warehouse Splash.webp";
import networkDistributorImg from "@/assets/titas/motion/TiTAS Distributor Water Showcase.webp";
import networkCustomBulkImg from "@/assets/titas/motion/TiTAS Water Facility Splash Cutout.webp";
import { usePrefersReducedMotion, useRevealOnce, useScrollProgress } from "@/lib/hooks";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Services Network — TiTAS centre + 8 individually-rendered 3D service
 * visuals, connected by curved, animated water streams. Split into its own
 * module (see WaterJourneyVisual.tsx's file-level comment for why) so its
 * 9 images are only fetched/bundled when this specific visual is actually
 * needed, not bundled together with the other two homepage visuals.
 */

const REVEAL_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// w/h are each PNG's actual measured intrinsic size (not guessed).
const CENTER_IMG = { src: networkCenterImg, w: 1376, h: 1142 };

const NETWORK_SERVICES = [
  {
    slug: "home-residential",
    img: networkHomeImg,
    w: 1536,
    h: 1024,
    short: "Home & Residential",
    angle: -96,
    radius: 43,
  },
  {
    slug: "office-commercial",
    img: networkOfficeImg,
    w: 1524,
    h: 1024,
    short: "Office & Commercial",
    angle: -40,
    radius: 54,
  },
  {
    slug: "institutional",
    img: networkInstitutionalImg,
    w: 1536,
    h: 1024,
    short: "Institutional",
    angle: 10,
    radius: 47,
  },
  {
    slug: "events-bulk",
    img: networkEventsImg,
    w: 1536,
    h: 1024,
    short: "Events & Bulk",
    angle: 53,
    radius: 55,
  },
  {
    slug: "regular-scheduled",
    img: networkRegularImg,
    w: 1536,
    h: 1024,
    short: "Regular & Scheduled",
    angle: 100,
    radius: 44,
  },
  {
    slug: "wholesale-retailer",
    img: networkWholesaleImg,
    w: 1536,
    h: 1024,
    short: "Wholesale & Retailer",
    angle: 148,
    radius: 53,
  },
  {
    slug: "distributor-dealer",
    img: networkDistributorImg,
    w: 1536,
    h: 1024,
    short: "Distributor & Dealer",
    angle: -172,
    radius: 48,
  },
  {
    slug: "custom-bulk",
    img: networkCustomBulkImg,
    w: 1536,
    h: 1024,
    short: "Custom Bulk",
    angle: -138,
    radius: 51,
  },
] as const;

const NETWORK_CENTER_ENTER_MS = 700;
const NETWORK_STREAM_MS = 550;
const NETWORK_STREAM_STAGGER = 130;
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
    transition: reducedMotion
      ? "none"
      : `stroke-dashoffset ${NETWORK_STREAM_MS}ms ${REVEAL_EASE} ${delay}ms`,
  };

  return (
    <g style={{ opacity: active ? 1 : 0, transition: "opacity 400ms ease-out" }}>
      <defs>
        <linearGradient
          id={gradId}
          x1={center.x}
          y1={center.y}
          x2={end.x}
          y2={end.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--color-aqua)" stopOpacity={hovered ? 0.35 : 0.22} />
          <stop offset="100%" stopColor="var(--color-aqua)" stopOpacity={hovered ? 0.85 : 0.6} />
        </linearGradient>
      </defs>

      {/* The stream body: a crisp, tapered, translucent ribbon — no blur */}
      <path
        d={ribbon}
        fill={`url(#${gradId})`}
        className="transition-[fill-opacity] duration-300"
      />

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
          width={service.w}
          height={service.h}
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
function ServicesNetworkMobile({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-[13rem] flex-col items-center md:hidden">
      <div
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "scale(1)" : "scale(0.82)",
          transition: reducedMotion
            ? "none"
            : `opacity ${NETWORK_CENTER_ENTER_MS}ms ease-out, transform ${NETWORK_CENTER_ENTER_MS}ms ${REVEAL_EASE}`,
        }}
      >
        <img
          src={CENTER_IMG.src}
          alt="TiTAS"
          width={CENTER_IMG.w}
          height={CENTER_IMG.h}
          className="w-32 select-none drop-shadow-[0_16px_24px_rgba(10,40,70,0.22)]"
          draggable={false}
        />
      </div>

      {NETWORK_SERVICES.map((s, i) => {
        const connectorDelay = NETWORK_CENTER_ENTER_MS + i * NETWORK_STREAM_STAGGER;
        const nodeDelay = connectorDelay + NETWORK_STREAM_MS;
        const title = services.find((svc) => svc.slug === s.slug)?.title ?? s.short;
        const ribbon = ribbonPath(
          { x: 10, y: 0 },
          { x: 10, y: 22 },
          { x: 10, y: 44 },
          0.8,
          2.4,
          10,
        );
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
                <linearGradient
                  id={`titas-mstream-${s.slug}`}
                  x1="10"
                  y1="0"
                  x2="10"
                  y2="44"
                  gradientUnits="userSpaceOnUse"
                >
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
                  transition: reducedMotion
                    ? "none"
                    : `transform ${NETWORK_STREAM_MS}ms linear ${connectorDelay}ms`,
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
                transition: reducedMotion
                  ? "none"
                  : `opacity 500ms ease-out ${nodeDelay}ms, transform 500ms ${REVEAL_EASE} ${nodeDelay}ms`,
              }}
            >
              <img
                src={s.img}
                alt=""
                aria-hidden="true"
                width={s.w}
                height={s.h}
                className="w-28 select-none drop-shadow-[0_10px_16px_rgba(10,40,70,0.18)]"
                draggable={false}
              />
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

export default function ServicesNetworkVisual() {
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
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
          >
            {NETWORK_SERVICES.map((s, i) => (
              <NetworkStream
                key={s.slug}
                index={i}
                active={active}
                hovered={hovered === s.slug}
                reducedMotion={reducedMotion}
              />
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
              transition: reducedMotion
                ? "none"
                : `opacity ${NETWORK_CENTER_ENTER_MS}ms ease-out, transform ${NETWORK_CENTER_ENTER_MS}ms ${REVEAL_EASE}`,
            }}
          >
            <div className={cn("relative", !reducedMotion && "animate-float-tiny")}>
              <img
                src={CENTER_IMG.src}
                alt="TiTAS"
                width={CENTER_IMG.w}
                height={CENTER_IMG.h}
                className="w-full select-none drop-shadow-[0_18px_26px_rgba(10,40,70,0.24)]"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
