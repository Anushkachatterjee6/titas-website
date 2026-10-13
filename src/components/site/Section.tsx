import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Reveal, TextReveal, ProgressiveText } from "./Reveal";
import { ScriptAccent, TiTASWordmark } from "./TiTASWordmark";

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "surface" | "deep" | "aqua";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 md:py-28",
        tone === "surface" && "surface-light",
        tone === "deep" && "surface-deep",
        tone === "aqua" && "bg-accent/45",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  eyebrowClassName,
  title,
  titleBrand = false,
  titleHref,
  script,
  lede,
  ledeAnimation = "aos",
  titleAnimation = "aos",
  align = "left",
  tone = "default",
  className,
  direction = "left",
}: {
  eyebrow?: string;
  /** Extra classes merged onto the eyebrow — for the rare heading that
   *  needs a more prominent eyebrow than the shared default. */
  eyebrowClassName?: string;
  title: string;
  /** When true, renders the TiTAS brand wordmark image instead of `title`
   *  as text — for headings where "TiTAS" itself IS the brand mark, not a
   *  sentence that merely mentions it. `title` is still used for a11y text. */
  titleBrand?: boolean;
  /** When set, the whole heading (title + script, not the eyebrow or lede)
   *  becomes a link to this route — for headings that double as a "read
   *  more" entry point into a dedicated page. */
  titleHref?: string;
  script?: string;
  lede?: string;
  /** "aos" (default) reveals `lede` with a plain translate+opacity entrance
   *  matching the Aqua Diamond reference's AOS config (100px offset, 400ms,
   *  ease, replays every time it re-enters the viewport). "progressive"
   *  reveals it word by word via `ProgressiveText` instead — set explicitly
   *  per call site wherever that was deliberately requested. "fade" keeps
   *  the older masked-slide `TextReveal` treatment, for the rare case that
   *  needs it. */
  ledeAnimation?: "aos" | "fade" | "progressive";
  /** Same choice as `ledeAnimation`, applied to the heading itself. "aos"
   *  (default) swaps the masked `TextReveal` slide for a plain `Reveal`
   *  (AOS has no clip-mask — it's a flat translate+opacity) at the
   *  100px/400ms/ease/replay values. "fade" keeps the older masked slide. */
  titleAnimation?: "aos" | "fade";
  align?: "left" | "center";
  tone?: "default" | "inverse";
  className?: string;
  /** Entrance direction — defaults to a left-to-right reveal; pass "right"
   *  for alternating sections or "up" for centred headings where a
   *  horizontal entrance would look odd. */
  direction?: "up" | "left" | "right";
}) {
  const headingContent = (
    <>
      {titleBrand ? (
        <>
          <TiTASWordmark title={title} className="inline-block h-[0.8em] w-auto align-[-0.12em]" />
          <span className="sr-only">{title}</span>
        </>
      ) : (
        title
      )}
      {script && (
        <>
          {" "}
          <ScriptAccent
            text={script}
            inverse={tone === "inverse"}
            className={cn("font-normal", tone === "inverse" ? "text-aqua-soft" : "text-primary")}
          />
        </>
      )}
    </>
  );
  const centered = align === "center";
  const heading = (
    <h2
      className={cn(
        "text-[2.05rem] leading-[1.08] font-bold md:text-[2.95rem]",
        tone === "inverse" ? "text-ink-foreground" : "text-ink",
      )}
    >
      {titleHref ? (
        <Link
          to={titleHref}
          className="rounded-sm opacity-100 transition-opacity duration-300 hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {headingContent}
        </Link>
      ) : (
        headingContent
      )}
    </h2>
  );
  const ledeClassName = cn(
    "mt-5 text-[1.02rem] leading-relaxed",
    tone === "inverse" ? "text-ink-foreground/75" : "text-muted-foreground",
  );
  const ledeNode =
    lede &&
    (ledeAnimation === "progressive" ? (
      <ProgressiveText text={lede} delay={140} as="p" className={cn("block", ledeClassName)} />
    ) : (
      <p className={ledeClassName}>{lede}</p>
    ));

  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal direction={centered ? "up" : direction}>
          <p
            className={cn(
              "eyebrow mb-4",
              tone === "inverse" ? "text-aqua-soft/80" : "text-aqua",
              eyebrowClassName,
            )}
          >
            {eyebrow}
          </p>
        </Reveal>
      )}
      {/* Centred headings keep the lighter fade+rise — a masked horizontal
          slide looks lopsided once the text is centre-aligned. Left-aligned
          ones get the stronger "Sliding Text Reveal" masked entrance, unless
          `titleAnimation="aos"` asks for the flat (unmasked) AOS-matched
          reveal instead. */}
      {titleAnimation === "aos" ? (
        <Reveal
          direction={centered ? "up" : direction}
          delay={60}
          distance={100}
          durationMs={400}
          easing="ease"
          replay
        >
          {heading}
        </Reveal>
      ) : centered ? (
        <Reveal direction="up" delay={60}>
          {heading}
        </Reveal>
      ) : (
        <TextReveal delay={60}>{heading}</TextReveal>
      )}
      {ledeNode &&
        (ledeAnimation === "progressive" ? (
          ledeNode
        ) : ledeAnimation === "aos" ? (
          <Reveal
            direction={centered ? "up" : direction}
            delay={140}
            distance={100}
            durationMs={400}
            easing="ease"
            replay
          >
            {ledeNode}
          </Reveal>
        ) : centered ? (
          <Reveal direction="up" delay={140}>
            {ledeNode}
          </Reveal>
        ) : (
          <TextReveal delay={140}>{ledeNode}</TextReveal>
        ))}
    </div>
  );
}
