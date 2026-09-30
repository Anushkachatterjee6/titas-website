import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

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
  title,
  script,
  lede,
  align = "left",
  tone = "default",
  className,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  lede?: string;
  align?: "left" | "center";
  tone?: "default" | "inverse";
  className?: string;
}) {
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
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl leading-[1.08] font-semibold md:text-[2.7rem]",
          tone === "inverse" ? "text-ink-foreground" : "text-ink",
        )}
      >
        {title}
        {script && (
          <>
            {" "}
            <span
              className={cn(
                "script-accent font-normal",
                tone === "inverse" ? "text-aqua-soft" : "text-primary",
              )}
            >
              {script}
            </span>
          </>
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
