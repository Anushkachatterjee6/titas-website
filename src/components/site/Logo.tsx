import { Link } from "@tanstack/react-router";
import { brandImages } from "@/data/images";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";
import { TiTASWordmark } from "./TiTASWordmark";

/**
 * Official TiTAS logo lockup: the supplied logo seal plus the brand
 * wordmark (TiTASWordmark — the single source of truth, see that
 * component). Both are used exactly as provided — never redrawn or
 * recoloured.
 */
export function Logo({
  className,
  variant = "default",
  withTagline = true,
}: {
  className?: string;
  variant?: "default" | "inverse";
  withTagline?: boolean;
}) {
  return (
    <Link
      to="/"
      aria-label={`${company.brand} — ${company.tagline}, home`}
      className={cn(
        "group flex items-center",
        variant === "inverse" ? "gap-4 sm:gap-5" : "gap-2.5",
        className,
      )}
    >
      <span className="flex shrink-0 items-center justify-center transition-transform duration-500 group-hover:-translate-y-0.5">
        <img
          src={brandImages.mark}
          alt=""
          aria-hidden="true"
          className={cn("h-10 w-auto", variant === "inverse" ? "h-14 md:h-16" : "md:h-11")}
        />
      </span>
      <span className="flex flex-col justify-center">
        <span className="flex items-center">
          <TiTASWordmark
            title={company.brand}
            className={variant === "inverse" ? "h-[1.7rem] md:h-[2.1rem]" : "h-[0.95rem] md:h-[1.1rem]"}
          />
        </span>
        {withTagline && (
          <span
            className={cn(
              "mt-0.5 text-[0.62rem] leading-none tracking-[0.16em] uppercase",
              variant === "inverse"
                ? "text-ink-foreground/70"
                : "text-muted-foreground",
            )}
          >
            {company.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
