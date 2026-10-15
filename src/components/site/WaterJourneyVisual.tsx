import sourceImg from "@/assets/titas/motion/source-3d-560.webp";
import purificationImg from "@/assets/titas/motion/purification-3d-560.webp";
import qualityImg from "@/assets/titas/motion/quality-3d-560.webp";
import bottleImg from "@/assets/titas/motion/bottle-3d-560.webp";
import deliveryImg from "@/assets/titas/motion/delivery-3d-560.webp";
import { usePrefersReducedMotion, useRevealOnce, useScrollProgress } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Water Journey — Source → Purification → Quality → Bottle → Delivery.
 * Five genuinely-transparent 3D assets, choreographed as one sequence: each
 * object rises into place, then a water path draws on to the next. Split
 * into its own module (alongside ServicesNetworkVisual.tsx and
 * OrderingFlowVisual.tsx, previously all three in one MotionAssets.tsx) so
 * each can be code-split independently — this component's five images are
 * no longer bundled/preloaded together with the other two visuals' images,
 * which previously made the homepage preload ~15 extra below-the-fold
 * images it didn't need yet.
 */

const REVEAL_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// w/h are each asset's actual measured intrinsic size (not guessed) — used
// as the <img> width/height attributes below so the browser can reserve the
// right aspect ratio before the image loads, without affecting the
// CSS-driven display size (h-full w-auto). Downscaled to 560px tall (the
// max CSS render height here is 144px — see JourneyStageBox below — so this
// keeps ~3.9x headroom for high-DPI screens while cutting ~63% of bytes vs.
// the original ~1150-1550px renders) — see TiTAS mobile-performance
// investigation.
const JOURNEY_STAGES = [
  { key: "source", label: "Source", img: sourceImg, w: 662, h: 560 },
  { key: "purification", label: "Purification", img: purificationImg, w: 840, h: 560 },
  { key: "quality", label: "Quality", img: qualityImg, w: 671, h: 560 },
  { key: "bottle", label: "Bottle", img: bottleImg, w: 613, h: 560 },
  { key: "delivery", label: "Delivery", img: deliveryImg, w: 840, h: 560 },
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
            width={stage.w}
            height={stage.h}
            // This component is lazy-loaded (see routes/index.tsx) and
            // genuinely below the fold, but React's SSR renderer still
            // auto-generates a <link rel="preload"> for any <img> it
            // renders unless fetchPriority="low" is set — that happens
            // independently of the JS-level code-splitting. Setting it
            // here only affects preload-hint generation and relative
            // fetch scheduling; it never defers or skips the fetch itself.
            fetchPriority="low"
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
function JourneyDesktopConnector({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
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
          transition: reducedMotion
            ? "none"
            : `stroke-dashoffset ${JOURNEY_PATH_MS}ms linear ${delay}ms`,
        };
        return (
          <g key={i}>
            <path
              d={d}
              stroke="currentColor"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              className="text-aqua/25 blur-[2px]"
              style={style}
            />
            <path
              d={d}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              className="text-aqua"
              style={style}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Mobile connector: a short vertical bar between each stacked stage,
 *  revealed by scaling up from the top — the path becomes vertical. */
function JourneyMobileConnector({
  index,
  active,
  reducedMotion,
}: {
  index: number;
  active: boolean;
  reducedMotion: boolean;
}) {
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

export default function WaterJourneyVisual() {
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
              {i > 0 && (
                <JourneyMobileConnector
                  index={i - 1}
                  active={active}
                  reducedMotion={reducedMotion}
                />
              )}
              <JourneyStageBox
                stage={stage}
                index={i}
                active={active}
                reducedMotion={reducedMotion}
              />
            </div>
          ))}
        </div>

        {/* Desktop: horizontal row, water path flows left to right */}
        <div className="relative hidden md:block">
          <JourneyDesktopConnector active={active} reducedMotion={reducedMotion} />
          <div className="relative grid grid-cols-5 gap-x-6">
            {JOURNEY_STAGES.map((stage, i) => (
              <JourneyStageBox
                key={stage.key}
                stage={stage}
                index={i}
                active={active}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
