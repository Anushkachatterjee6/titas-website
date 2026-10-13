import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealDirection = "up" | "left" | "right";
export type RevealTrigger = "scroll" | "mount";

const HIDDEN_TRANSFORM: Record<RevealDirection, string> = {
  // ~32px — within the 25–45px "clearly visible" vertical range.
  up: "translate-y-8",
  // ~64px — within the 40–70px "clearly visible" horizontal range.
  left: "-translate-x-16",
  right: "translate-x-16",
};

/**
 * Shared visibility hook behind every entrance primitive below. Always
 * starts VISIBLE (so content is never stuck hidden if scripting fails),
 * then — only once this effect runs, confirming JS is actually live —
 * flips to the hidden pre-reveal state and arms the real trigger:
 *
 * - `trigger: "scroll"` (the default, for below-the-fold content): watches
 *   via IntersectionObserver and reveals once the element first enters the
 *   viewport. Does not replay on every scroll up/down.
 * - `trigger: "mount"` (for page-entry content — hero titles, breadcrumb,
 *   eyebrow, lede, CTAs): reveals a moment after mount via two chained
 *   `requestAnimationFrame`s (so the hidden state actually paints first,
 *   otherwise the browser can coalesce both states into one frame and the
 *   transition never visibly plays). This deliberately does NOT depend on
 *   viewport intersection — a hero element that's already in view, or one
 *   the user has scrolled past via scroll restoration, both still animate,
 *   because both scenarios are literally "entering the page", not "entering
 *   the viewport by scrolling".
 *
 * Route re-entry: TanStack Router unmounts/remounts each route's component
 * tree on navigation (including navigating back to an already-visited
 * route), so this hook's `useEffect` — and therefore the whole reveal
 * sequence — naturally reruns from scratch every time a route is entered.
 * Nothing here needs to inspect the router directly; remounting is what
 * resets the animation, and `trigger: "mount"` is what guarantees the hero
 * specifically always fires regardless of scroll position.
 */
function useReveal<T extends HTMLElement>(trigger: RevealTrigger, replay = false) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (trigger === "mount") {
      setShown(false);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    setShown(false);

    // Defer arming the observer by two frames before calling `observe()`.
    // Without this, a mid-navigation remount can start observing while the
    // viewport is still at the PREVIOUS route's scroll position (scroll-to-
    // top on route change isn't guaranteed to have committed yet) — if the
    // element's position in the new layout happens to already overlap that
    // stale scroll position, the observer's first check reports it as
    // already-intersecting and reveals it instantly, before the real
    // (post scroll-reset) viewport settles. That reads as "the animation
    // didn't play" even though a reveal technically fired. Waiting two
    // frames lets the browser's scroll-to-top commit first, so the
    // observer's first real check reflects where the element actually ends
    // up, not a transient mid-navigation position — the same reasoning as
    // the double-rAF used for `trigger: "mount"` above.
    let io: IntersectionObserver | undefined;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (replay) {
                // Mirrors AOS's default `once: false` — the reveal replays
                // every time the element re-enters the viewport (scrolling
                // back up and down again), rather than firing once and
                // staying revealed. Opt-in only (default false) so every
                // other existing Reveal/TextReveal/etc. call site keeps its
                // current "reveal once" behaviour unchanged.
                setShown(entry.isIntersecting);
              } else if (entry.isIntersecting) {
                setShown(true);
                io?.disconnect();
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );
        io.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      io?.disconnect();
    };
  }, [trigger, replay]);

  return { ref, shown };
}

/**
 * Directional entrance reveal. Defaults to "left" — a clearly visible
 * left-to-right slide-plus-fade — since that's the primary motion language
 * requested across the site; pass "up" for centred content (a horizontal
 * slide looks lopsided when centred) or "right" for a deliberate alternate
 * direction. Movement is real (64px horizontal / 32px vertical) but settles
 * without bounce.
 *
 * `trigger="scroll"` (default) reveals once as the element first enters the
 * viewport, and does not replay on repeated scrolling. `trigger="mount"`
 * reveals shortly after the component mounts regardless of scroll position
 * — use this for above-the-fold, page-entry content (see `useReveal`'s
 * doc comment) so it reliably replays every time the route is (re-)entered.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  style,
  direction = "left",
  trigger = "scroll",
  distance,
  durationMs = 700,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  replay = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span" | "section" | "li" | "article" | "header";
  style?: CSSProperties;
  direction?: RevealDirection;
  trigger?: RevealTrigger;
  /** Overrides the default ~64px/32px travel distance with an exact pixel
   *  value — e.g. a lighter ~25px nudge for small secondary text, vs. a
   *  deliberate ~60px main-title slide. Applied via inline transform so it
   *  can't be fought by Tailwind's class-merge ordering. */
  distance?: number;
  /** Overrides the default 700ms transition duration. */
  durationMs?: number;
  /** Overrides the default easing curve. */
  easing?: string;
  /** When true, the reveal replays every time the element re-enters the
   *  viewport (scrolling away and back triggers it again), instead of the
   *  default "reveal once and stay revealed". Off by default — only pass
   *  this where replay-on-reentry is the specifically desired behaviour. */
  replay?: boolean;
}) {
  const { ref, shown } = useReveal<HTMLElement>(trigger, replay);

  const customTransform =
    distance === undefined
      ? undefined
      : shown
        ? "translate(0, 0)"
        : direction === "up"
          ? `translateY(${distance}px)`
          : `translateX(${direction === "left" ? -distance : distance}px)`;

  return (
    <Tag
      ref={ref as never}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: easing,
        ...(customTransform ? { transform: customTransform } : {}),
      }}
      className={cn(
        "transition-[opacity,transform]",
        distance !== undefined
          ? shown
            ? "opacity-100"
            : "opacity-0"
          : shown
            ? "translate-x-0 translate-y-0 opacity-100"
            : cn(HIDDEN_TRANSFORM[direction], "opacity-0"),
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * "Animated Heading" — the site's standard left-to-right heading slide:
 * `translateX(-48px) -> 0` with opacity as a secondary effect. A thin,
 * named wrapper over `Reveal` with the exact numbers requested for
 * headings specifically (as distinct from the lighter default `Reveal`
 * distance used for general body content), so every heading across the
 * site shares one literal source of truth instead of each call site
 * re-specifying `distance`/`durationMs`/`easing`.
 */
export function AnimatedHeading({
  children,
  delay = 0,
  className,
  as = "div",
  trigger = "scroll",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "header";
  trigger?: RevealTrigger;
}) {
  return (
    <Reveal
      as={as}
      direction="left"
      distance={48}
      durationMs={700}
      easing="cubic-bezier(0.22, 1, 0.36, 1)"
      delay={delay}
      trigger={trigger}
      {...(className ? { className } : {})}
    >
      {children}
    </Reveal>
  );
}

/**
 * "Sliding Title Reveal" — a premium, Apple-keynote-style title entrance:
 * the heading slides up from behind a clipping mask (an overflow-hidden
 * wrapper), rather than just fading or translating in open space. Reserved
 * for the one or two major headings per page (hero titles) — everything
 * else uses `Reveal` or `TextReveal`.
 *
 * Defaults to `trigger="mount"` since a hero title is page-entry content —
 * it must replay every time the route is entered, including navigating
 * back to a page already visited this session, not just the first time it
 * scrolls into view.
 */
export function TitleReveal({
  children,
  delay = 0,
  className,
  as: Tag = "span",
  trigger = "mount",
  durationMs = 750,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "span" | "div";
  trigger?: RevealTrigger;
  /** 650–850ms per spec; defaults to 750ms. */
  durationMs?: number;
}) {
  const { ref, shown } = useReveal<HTMLElement>(trigger);

  return (
    <Tag ref={ref as never} className={cn("inline-block overflow-hidden align-top", className)}>
      <Tag
        style={{
          transitionDelay: `${delay}ms`,
          transitionDuration: `${durationMs}ms`,
        }}
        className={cn(
          "inline-block transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          shown ? "translate-y-0" : "translate-y-full",
        )}
      >
        {children}
      </Tag>
    </Tag>
  );
}

/**
 * "Sliding Text Reveal" — the masked, horizontal counterpart to
 * `TitleReveal`: the text sits behind an overflow-hidden clipping mask and
 * slides in from the left as it's revealed, rather than translating in open
 * space. Reserved for a page's primary supporting copy (hero lede, section
 * intro paragraphs) — reaching for this on every paragraph/card sitewide
 * would mean wrapping a lot of unrelated content (badges, shadows, absolute
 * decoration) in `overflow-hidden`, risking visual clipping elsewhere, so
 * general-purpose text uses the lighter `Reveal direction="left"` instead.
 *
 * Block-level (not inline), so multi-line text wraps and clips naturally —
 * the whole paragraph block slides together rather than per character/word.
 */
export function TextReveal({
  children,
  delay = 0,
  className,
  trigger = "scroll",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  trigger?: RevealTrigger;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>(trigger);

  return (
    <div ref={ref as never} className="overflow-hidden">
      <div
        style={{ transitionDelay: `${delay}ms` }}
        className={cn(
          "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          shown ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * "Scale-Bounce Reveal" — a subtitle/secondary-emphasis entrance: starts
 * slightly undersized and invisible, quickly overshoots past its final size,
 * then settles back — a restrained "pop into place" rather than a slide.
 * Reserved for ONE designated secondary element per hero (the supporting
 * line right after the main title), not applied broadly — stacking a bounce
 * onto every paragraph would read as a cheap template rather than a premium
 * site. The overshoot shape is baked into the `animate-scale-bounce-in`
 * keyframes (styles.css); this component only handles the hidden pre-state
 * and the mount/scroll trigger.
 */
export function ScaleBounceReveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  trigger = "mount",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "span";
  trigger?: RevealTrigger;
}) {
  const { ref, shown } = useReveal<HTMLElement>(trigger);

  return (
    <Tag
      ref={ref as never}
      style={shown ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(
        "will-change-transform",
        shown ? "animate-scale-bounce-in" : "scale-[0.85] opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * "Zoom Reveal" — a plain scale+fade entrance with no bounce/overshoot:
 * starts very slightly undersized and invisible, settles to full size as it
 * fades in. Distinct from `ScaleBounceReveal` (which overshoots past 100%
 * before settling and is reserved for hero secondary text) — this is for a
 * single accent image or icon block within a content section, mirroring a
 * restrained "zoom-in" entrance rather than a "pop".
 */
export function ZoomReveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  trigger = "scroll",
  durationMs = 500,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "figure";
  trigger?: RevealTrigger;
  durationMs?: number;
}) {
  const { ref, shown } = useReveal<HTMLElement>(trigger);

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${durationMs}ms` }}
      className={cn(
        "transition-[opacity,transform] ease-out",
        shown ? "scale-100 opacity-100" : "scale-[0.94] opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * "Progressive Text" — a ChatGPT-style word-by-word reveal: every word of
 * `text` fades + nudges in, in reading order, each slightly after the last.
 * One shared trigger (not one IntersectionObserver per word) drives every
 * word via a plain CSS `transition-delay`, so the whole paragraph is a
 * single DOM subtree with per-word timing, not N independently-observed
 * elements.
 *
 * Accessibility: the word-span version is `aria-hidden` and a visually
 * hidden (`sr-only`) sibling carries the real, complete paragraph text as
 * one normal text node — so a screen reader reads it naturally as a single
 * paragraph, never as dozens of separately-announced words, and nothing is
 * read twice (only one of the two copies is ever exposed to assistive
 * tech).
 *
 * Long-paragraph handling: the per-word interval auto-tightens so the
 * whole paragraph finishes revealing within roughly `maxTotalMs`,
 * regardless of word count — a 12-word intro gets the full, readable
 * interval; a 120-word block speeds up rather than making the reader wait
 * several seconds for the last sentence to appear.
 */
export function ProgressiveText({
  text,
  as = "p",
  className,
  delay = 0,
  wordIntervalMs = 32,
  maxTotalMs = 900,
  trigger = "scroll",
}: {
  text: string;
  as?: "p" | "span" | "div";
  className?: string;
  /** Delay before the FIRST word starts — e.g. ~100–250ms after its
   *  heading begins, per the brief. */
  delay?: number;
  /** Base per-word stagger — 25–45ms per the brief's spec. */
  wordIntervalMs?: number;
  /** Caps the total reveal duration for long paragraphs by shrinking the
   *  effective per-word interval, so a long block never takes "several
   *  seconds" to finish appearing. */
  maxTotalMs?: number;
  trigger?: RevealTrigger;
}) {
  const { ref, shown } = useReveal<HTMLElement>(trigger);
  const Tag = as;
  const words = text.split(" ").filter(Boolean);
  const interval = words.length > 1 ? Math.min(wordIntervalMs, maxTotalMs / words.length) : 0;

  return (
    <Tag ref={ref as never} className={className}>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            <span
              style={{
                transitionDelay: `${delay + i * interval}ms`,
                transitionDuration: "150ms",
              }}
              className={cn(
                "inline-block transition-[opacity,transform] ease-out",
                shown ? "translate-y-0 opacity-100" : "translate-y-[4px] opacity-0",
              )}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

/**
 * "Cascading Text" — staggers each child in with a short, visible
 * directional entrance. A thin convenience wrapper over `Reveal` so pages
 * don't hand-roll `delay={i * N}` on every list; pass the items as
 * children (one Reveal per child) with a shared `as`/`direction`/`stagger`.
 */
export function AnimatedList({
  children,
  as = "div",
  itemAs = "li",
  direction = "left",
  stagger = 90,
  maxDelay = 500,
  className,
  itemClassName,
}: {
  children: ReactNode[];
  as?: "div" | "ul" | "ol";
  itemAs?: "li" | "div" | "article";
  direction?: RevealDirection;
  /** ms between each item's entrance — 80–120ms per the brief's spec. */
  stagger?: number;
  /** caps the stagger so a long list doesn't make the tail wait forever. */
  maxDelay?: number;
  className?: string;
  itemClassName?: string;
}) {
  const Wrapper = as;
  return (
    <Wrapper className={className}>
      {children.map((child, i) => (
        <Reveal
          key={i}
          as={itemAs}
          direction={direction}
          delay={Math.min(i * stagger, maxDelay)}
          {...(itemClassName ? { className: itemClassName } : {})}
        >
          {child}
        </Reveal>
      ))}
    </Wrapper>
  );
}
