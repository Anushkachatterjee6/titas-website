import { useEffect, useRef, useState } from "react";
import orderBrowseImg from "@/assets/titas/motion/TiTAS Water Marketplace Splash Showcase.png";
import orderAddToCartImg from "@/assets/titas/motion/TiTAS Water Cart Splash (1).png";
import orderCartReviewImg from "@/assets/titas/motion/TiTAS Water Cart Adventure.png";
import orderConfirmedImg from "@/assets/titas/motion/TiTAS Order Confirmed 3D Scene.png";
import orderDeliveryImg from "@/assets/titas/motion/TiTAS Water Delivery Tracking Graphic.png";
import { RoutePath } from "@/components/site/WaterMotion";
import { usePrefersReducedMotion, useRevealOnce } from "@/lib/hooks";

/**
 * Ordering Flow — five individual phone-state cutouts. Split into its own
 * module (see WaterJourneyVisual.tsx's file-level comment for why) so its
 * 5 images are only fetched/bundled when this specific visual is actually
 * needed.
 *
 * No dedicated "Payment" artwork was supplied for this refresh, so that
 * state was dropped rather than reused from a mismatched image.
 */

const REVEAL_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// w/h are each PNG's actual measured intrinsic size (not guessed).
const ORDER_STATES = [
  { label: "Browse", img: orderBrowseImg, w: 1024, h: 1536 },
  { label: "Add to Cart", img: orderAddToCartImg, w: 1024, h: 1536 },
  { label: "Cart", img: orderCartReviewImg, w: 1024, h: 1536 },
  { label: "Confirmed", img: orderConfirmedImg, w: 1024, h: 1536 },
  { label: "Delivery", img: orderDeliveryImg, w: 1024, h: 1536 },
];

const ORDER_DURATION = 2600;
const ORDER_TRANSITION = 700;
const ORDER_CONFIRMED_INDEX = ORDER_STATES.findIndex((s) => s.label === "Confirmed");
const ORDER_DELIVERY_INDEX = ORDER_STATES.findIndex((s) => s.label === "Delivery");

export default function OrderingFlowVisual() {
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
                width={state.w}
                height={state.h}
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

        <div
          className="mt-5 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Ordering flow state"
        >
          {ORDER_STATES.map((state, i) => (
            <button
              key={state.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={state.label}
              onClick={() => setActive(i)}
              className={
                i === active
                  ? "h-1.5 w-6 rounded-full bg-primary transition-all duration-500"
                  : "h-1.5 w-1.5 rounded-full bg-ink/25 transition-all duration-500 hover:bg-ink/45"
              }
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
