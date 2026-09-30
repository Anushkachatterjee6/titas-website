import { cn } from "@/lib/utils";

/**
 * Reusable "water in motion" motif: a thin wave divider, a slow-flowing
 * connector line and a handful of soft drifting droplets. CSS/SVG only —
 * no animation library. `animate-float-slow` / reduced-motion handling
 * comes from the global utilities in styles.css.
 */

export function WaveDivider({
  className,
  flip = false,
  tone = "default",
}: {
  className?: string;
  flip?: boolean;
  tone?: "default" | "inverse";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none w-full overflow-hidden", flip && "rotate-180", className)}
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="h-10 w-full md:h-14"
      >
        <path
          d="M0 30 C 200 60, 400 0, 600 28 C 800 56, 1000 4, 1200 30 L1200 60 L0 60 Z"
          fill="currentColor"
          className={tone === "inverse" ? "text-ink" : "text-background"}
        />
      </svg>
    </div>
  );
}

export function FlowingPath({
  className,
  vertical = false,
  glow = false,
}: {
  className?: string;
  vertical?: boolean;
  /** Adds a soft blurred duplicate of the path behind the crisp line, for a lit, dimensional feel. */
  glow?: boolean;
}) {
  const d = vertical
    ? "M12 0 C 4 60, 20 120, 12 180 S 4 300, 12 400"
    : "M0 12 C 60 4, 120 20, 180 12 S 300 4, 400 12";

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none text-aqua/50", className)}
      viewBox={vertical ? "0 0 24 400" : "0 0 400 24"}
      preserveAspectRatio="none"
      fill="none"
    >
      {glow && (
        <path
          d={d}
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="text-aqua/40 blur-[3px]"
        />
      )}
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="10 14"
        className="animate-flow-dash"
      />
    </svg>
  );
}

/**
 * Soft radial glow arch behind a product photo — an elegant "spotlight" rather
 * than a literal frame. No generated artwork, purely gradient + blur.
 */
export function GlowArch({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute inset-[8%] rounded-[999px] bg-[radial-gradient(closest-side,theme(colors.aqua/25%),transparent_75%)] blur-2xl" />
      <div className="absolute inset-[18%] rounded-[999px] border border-aqua/25" />
      <div className="absolute inset-[26%] rounded-[999px] border border-aqua/15" />
    </div>
  );
}

/**
 * Layered translucent waves drifting slowly, used as a subtle backdrop
 * (never a full section takeover). Each layer has a different speed/opacity
 * for a gentle parallax read.
 */
export function FluidWaves({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="absolute -bottom-8 h-full w-[220%]">
        <path
          d="M0 150 C 150 100, 300 200, 450 150 S 750 100, 900 150 S 1150 200, 1200 150 L1200 300 L0 300 Z"
          className="animate-wave-drift-slow fill-aqua/10"
        />
      </svg>
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="absolute -bottom-4 h-full w-[220%]">
        <path
          d="M0 170 C 180 220, 320 120, 500 170 S 780 220, 960 170 S 1180 120, 1200 170 L1200 300 L0 300 Z"
          className="animate-wave-drift fill-aqua/[0.07]"
        />
      </svg>
    </div>
  );
}

/**
 * A short glowing straight connector between two points, expressed as
 * percentages of the parent's box. Used to link floating UI chips to a
 * central element (e.g. the Order TiTAS phone) — the "exploded, connected"
 * composition, without any literal circuitry/tech imagery.
 */
export function Beam({
  from,
  to,
  className,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full overflow-visible text-aqua/45", className)}
      preserveAspectRatio="none"
    >
      <line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="5 7"
        strokeLinecap="round"
        className="animate-flow-dash"
      />
    </svg>
  );
}

/**
 * A small looping route: an origin and destination marker connected by a
 * dashed path, with a dot travelling along it. Meant to sit inside an
 * existing panel (e.g. the delivery CTA), not to become a map.
 */
export function RoutePath({
  className,
  reducedMotion = false,
}: {
  className?: string;
  reducedMotion?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 60"
      className={cn("pointer-events-none w-full text-aqua", className)}
      fill="none"
    >
      <path
        id="titas-route-path"
        d="M12 44 C 80 10, 160 70, 308 20"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2"
        strokeDasharray="1 9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="44" r="5" className="fill-primary" />
      <circle cx="308" cy="20" r="5" className="fill-primary" />
      {reducedMotion ? (
        <circle cx="160" cy="40" r="4" className="fill-aqua" />
      ) : (
        <circle r="4" className="fill-aqua">
          <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
            <mpath href="#titas-route-path" />
          </animateMotion>
        </circle>
      )}
    </svg>
  );
}

export function Droplets({ count = 4, className }: { count?: number; className?: string }) {
  const drops = Array.from({ length: Math.min(count, 6) });
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {drops.map((_, i) => (
        <span
          key={i}
          className="animate-float-slow absolute block rounded-full bg-aqua/25 blur-[1px]"
          style={{
            left: `${12 + i * (76 / Math.max(count - 1, 1))}%`,
            top: `${18 + (i % 3) * 22}%`,
            width: `${8 + (i % 3) * 6}px`,
            height: `${8 + (i % 3) * 6}px`,
            animationDelay: `${i * 900}ms`,
            animationDuration: `${8 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}
