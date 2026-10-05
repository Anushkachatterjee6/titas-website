import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
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
  align = "left",
  tone = "default",
  className,
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
  align?: "left" | "center";
  tone?: "default" | "inverse";
  className?: string;
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
  return (
    <Reveal
      as="header"
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow mb-4",
            tone === "inverse" ? "text-aqua-soft/80" : "text-aqua",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      )}
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
      {lede && (
        <p
          className={cn(
            "mt-5 text-[1.02rem] leading-relaxed",
            tone === "inverse" ? "text-ink-foreground/75" : "text-muted-foreground",
          )}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
