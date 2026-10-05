import { cn } from "@/lib/utils";

/**
 * Premium brand ticker — sits directly below the navbar on every page.
 *
 * Seamless marquee technique: the sequence is repeated REPEAT_COUNT times
 * back to back in one flex track, which scrolls left by exactly
 * `100 / REPEAT_COUNT` percent of its own width per loop. Because every
 * copy is identical, shifting left by one copy's width and then snapping
 * back to 0% for the next iteration is visually indistinguishable from
 * continuing — there's no jump.
 *
 * A single copy of six short phrases is narrower than many desktop/ultrawide
 * viewports, though — with only two copies, once both had scrolled past
 * there was genuinely nothing left to show until the loop restarted, which
 * read as a 1–2s blank pause. Repeating the sequence enough times (comfortably
 * wider than any realistic viewport) guarantees the track always has more
 * content ready to enter, on any screen width, without ever measuring the
 * viewport in JS.
 */

const RIBBON_ITEMS = [
  "TiTAS",
  "Sujit Aqua Enterprise",
  "Packaged Drinking Water",
  "Ekti Jaler Naam",
  "Banglar Jal, Banglar Bharsha",
  "Reliable Since 1999",
];

const BENGALI_PATTERN = /[ঀ-৿]/;
const REPEAT_COUNT = 8;

function RibbonSequence() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {RIBBON_ITEMS.map((item, i) => {
        const isBengali = BENGALI_PATTERN.test(item);
        return (
          <span key={i} className="flex shrink-0 items-center">
            <span
              className={cn(
                "px-4 font-semibold tracking-wide whitespace-nowrap text-ink-foreground/90 sm:px-6",
                isBengali
                  ? "font-['Noto_Sans_Bengali'] text-[0.94rem] sm:text-[1.05rem]"
                  : "text-[0.78rem] sm:text-sm",
              )}
            >
              {item}
            </span>
            <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-aqua/70" />
          </span>
        );
      })}
    </div>
  );
}

export function BrandRibbon() {
  return (
    <div
      aria-hidden="true"
      className="surface-deep relative flex items-center overflow-hidden border-b border-ink-foreground/10 py-2"
    >
      <div
        className="flex w-max animate-marquee"
        style={{ ["--marquee-end" as string]: `${-100 / REPEAT_COUNT}%` }}
      >
        {Array.from({ length: REPEAT_COUNT }).map((_, i) => (
          <RibbonSequence key={i} />
        ))}
      </div>
    </div>
  );
}
