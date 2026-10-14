import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { approvedSlides } from "@/data/images";
import { cn } from "@/lib/utils";

const DURATION = 3500;
const TRANSITION_MS = 600;
const RESUME_AFTER = 8000;
// Backstop for the clone->real-slide snap below — guarantees the loop
// corrects itself even if the browser ever fails to fire the CSS
// `transitionend` event (observed after long idle periods: throttled
// background tabs / dropped frames can silently drop that event, and
// without this, the track index would keep marching past the last
// rendered slide and the hero would go permanently blank).
const SNAP_FALLBACK_MS = TRANSITION_MS + 150;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Full-width hero slideshow using the five APPROVED TiTAS images, shown
 * unmodified. The images carry their own typography, so nothing is layered
 * over them. The frame matches the images' ~2.5:1 ratio so branding is never
 * cropped, on desktop or mobile.
 *
 * True horizontal carousel track (no opacity/crossfade): all slides sit
 * side by side and the track's transform slides left/right. A clone of the
 * last slide is prepended and a clone of the first is appended so autoplay
 * (and manual nav) can loop seamlessly — after the transition lands on a
 * clone, the track snaps back to the matching real slide with transitions
 * off for that one frame, so the loop is invisible.
 */
export function HeroSlideshow() {
  const n = approvedSlides.length;
  const extended = useMemo(
    () => [approvedSlides[n - 1]!, ...approvedSlides, approvedSlides[0]!],
    [n],
  );
  // trackIndex 0 = clone of last, 1..n = real slides, n+1 = clone of first
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionsOn, setTransitionsOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const realIndex = (((trackIndex - 1) % n) + n) % n;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Autoplay (and its transition bookkeeping) only runs while the hero is
  // actually on screen. Without this, scrolling away lets the interval keep
  // firing — and since browsers can skip/merge transitions on an
  // off-screen, GPU-decomposited layer, the track can drift out of sync
  // with its own transitionend bookkeeping and come back not visibly
  // updating until the next manual interaction.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const interact = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_AFTER);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setTransitionsOn(true);
      setTrackIndex((i) => {
        const next = i + delta;
        // Hard safety clamp: trackIndex must never land more than one
        // position past either clone slot. Normal operation never needs
        // this (the snap-back below keeps it in [0, n+1] on its own), but
        // it guarantees the track can never be pushed into empty space
        // beyond the last rendered slide, even in a pathological case
        // where a snap was somehow missed entirely.
        if (next < 0) return n;
        if (next > n + 1) return 1;
        return next;
      });
    },
    [n],
  );

  const go = useCallback(
    (targetRealIndex: number) => {
      interact();
      const target = ((targetRealIndex % n) + n) % n;
      let delta = target - realIndex;
      // shortest path around the loop
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      step(delta === 0 ? 0 : delta);
    },
    [interact, n, realIndex, step],
  );

  useEffect(() => {
    if (paused || reducedMotion || !inView) return;
    const t = setInterval(() => step(1), DURATION);
    return () => clearInterval(t);
  }, [paused, reducedMotion, inView, step]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  // Land on a clone -> snap (no transition) to the matching real slide.
  // This is the fast path, fired by the browser as soon as the slide
  // transition visually finishes.
  const handleTransitionEnd = useCallback(() => {
    if (trackIndex === 0) {
      setTransitionsOn(false);
      setTrackIndex(n);
    } else if (trackIndex === n + 1) {
      setTransitionsOn(false);
      setTrackIndex(1);
    }
  }, [trackIndex, n]);

  // Guaranteed backstop for the same snap, independent of the DOM event.
  // Whenever trackIndex sits on a clone slot, this schedules a correction
  // a little after the transition should have finished. If the fast path
  // above already ran, trackIndex has moved off the clone slot by then, so
  // this effect's own cleanup (which re-runs on every trackIndex change)
  // cancels the pending timer before it ever fires — it's a no-op in the
  // normal case, and the only thing that actually fires it is a missed
  // transitionend event, which is exactly the bug this exists to catch.
  useEffect(() => {
    if (trackIndex !== 0 && trackIndex !== n + 1) return;
    const target = trackIndex === 0 ? n : 1;
    const id = setTimeout(() => {
      setTransitionsOn(false);
      setTrackIndex(target);
    }, SNAP_FALLBACK_MS);
    return () => clearTimeout(id);
  }, [trackIndex, n]);

  // Re-enable transitions on the next frame after a snap.
  useEffect(() => {
    if (transitionsOn) return;
    const id = requestAnimationFrame(() => setTransitionsOn(true));
    return () => cancelAnimationFrame(id);
  }, [transitionsOn]);

  return (
    <section
      ref={sectionRef}
      aria-label="TiTAS highlights"
      aria-roledescription="carousel"
      tabIndex={-1}
      className="relative bg-accent/40 outline-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(realIndex + 1);
        if (e.key === "ArrowLeft") go(realIndex - 1);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
        interact();
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
        if (Math.abs(dx) > 40) go(realIndex + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="relative aspect-[1600/639] w-full overflow-hidden">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={cn(
            "flex size-full",
            transitionsOn && !reducedMotion
              ? "transition-transform ease-[var(--hero-ease)]"
              : "transition-none",
          )}
          style={{
            transform: `translateX(${-trackIndex * 100}%)`,
            transitionDuration: `${TRANSITION_MS}ms`,
            willChange: "transform",
            ["--hero-ease" as string]: EASE,
          }}
        >
          {extended.map((slide, i) => (
            <figure
              key={`${slide.id}-${i}`}
              aria-hidden={i !== trackIndex}
              className="relative aspect-[1600/639] w-full shrink-0 grow-0 basis-full"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                // All slides stay eager — these carousel slides sit just
                // outside the viewport via the track's transform (not
                // display:none), with no scroll-proximity signal like a
                // true below-the-fold element has, so loading="lazy" here
                // can't be verified not to show a blank frame on a slow
                // connection before autoplay reaches that slide. Priority
                // (not fetch timing) is what keeps them from competing
                // with the visible LCP slide.
                //
                // The first visible slide also gets a sizes hint so the
                // browser's preload scanner can estimate the correct
                // rendered width (100 vw) rather than falling back to
                // the image's intrinsic width as the fetch-size guess.
                loading="eager"
                fetchPriority={i === 1 ? "high" : "low"}
                decoding={i === 1 ? "sync" : "async"}
                {...(i === 1 ? { sizes: "100vw" } : {})}
                className="size-full object-cover object-center"
                onError={() => {
                  // Never leave the hero showing a broken image — if the
                  // slide currently on screen fails to load, move straight
                  // past it instead of sitting on an invalid frame.
                  if (i === trackIndex) step(1);
                }}
              />
            </figure>
          ))}
        </div>

        <HeroControl
          label="Previous slide"
          onClick={() => go(realIndex - 1)}
          className="left-2 md:left-5"
        >
          <ChevronLeft className="size-4 md:size-5" aria-hidden="true" />
        </HeroControl>
        <HeroControl
          label="Next slide"
          onClick={() => go(realIndex + 1)}
          className="right-2 md:right-5"
        >
          <ChevronRight className="size-4 md:size-5" aria-hidden="true" />
        </HeroControl>
      </div>

      <div className="flex justify-center gap-2 py-3 md:py-4" role="tablist" aria-label="Slides">
        {approvedSlides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === realIndex}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => go(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === realIndex ? "w-7 bg-primary" : "w-1.5 bg-ink/25 hover:bg-ink/45",
            )}
          />
        ))}
      </div>
    </section>
  );
}

function HeroControl({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-ink shadow-lift backdrop-blur transition-colors hover:bg-card md:size-11",
        className,
      )}
    >
      {children}
    </button>
  );
}
