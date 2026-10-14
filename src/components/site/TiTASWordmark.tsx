import wordmarkSrc from "@/assets/titas/motion/titas-wordmark.png";
import { cn } from "@/lib/utils";

/**
 * Single source of truth for the TiTAS brand wordmark.
 *
 * Source: the client-approved reference image. The original file
 * (src/assets/titas/Brand Name.png) turned out to have its "transparent"
 * background baked in as an actual checkerboard texture (flat RGB, no alpha
 * channel) with a lot of empty margin around the letters — invisible on a
 * white canvas, but it meant the image silently painted a grey/white
 * checkerboard behind the logo wherever used, and made any height-based
 * sizing render far smaller than intended because most of the image's
 * height was transparent padding. This asset
 * (src/assets/titas/motion/titas-wordmark.png) is the same artwork — same
 * letterforms, weight, rounded geometry, spacing, blue — regenerated with a
 * genuine alpha channel and cropped tight to the ink, so it composites
 * cleanly on any background and scales predictably.
 *
 * Used wherever the brand NAME itself is the visual element (logo lockups,
 * standalone brand headings) — not for body copy that merely mentions
 * "TiTAS" in a sentence.
 */
export function TiTASWordmark({
  className,
  title = "TiTAS",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <img
      src={wordmarkSrc}
      alt={title}
      // Actual measured intrinsic size (2019x558) — every call site scales
      // this via its own className (h-6, h-10, h-[0.8em]…), so these
      // attributes only give the browser the real aspect ratio up front;
      // they don't change how large the mark renders anywhere.
      width={2019}
      height={558}
      draggable={false}
      className={cn("h-6 w-auto object-contain select-none", className)}
    />
  );
}

/**
 * Renders a "script accent" heading fragment (the cursive flourish used
 * throughout the site, e.g. "your doorstep", "to Seal") — except any literal
 * occurrence of the word "TiTAS" inside it is swapped for the brand
 * wordmark image instead of being set in the cursive font. This is the one
 * place that decides how "TiTAS" looks inside these compound headings, so
 * every heading using it stays in sync automatically.
 *
 * Non-brand words in the same string keep the existing italic script
 * styling and surrounding color/weight (passed via `className`) untouched.
 */
export function ScriptAccent({
  text,
  className,
  inverse = false,
}: {
  text: string;
  className?: string;
  /** True on dark/inverse backgrounds, where the brand blue needs a light
   *  backing to stay legible — the same treatment the header/footer logo
   *  already uses for the same reason. */
  inverse?: boolean;
}) {
  const parts = text.split(/(TiTAS)/g);
  return (
    <span className={cn("script-accent", className)}>
      {parts.map((part, i) =>
        part === "TiTAS" ? (
          <span
            key={i}
            className={cn(
              "not-italic inline-flex items-center align-[-0.08em]",
              inverse && "rounded-md bg-ink-foreground px-1.5 py-0.5",
            )}
          >
            <TiTASWordmark className="h-[0.82em] w-auto" />
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
}
