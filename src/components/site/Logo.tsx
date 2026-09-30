import { Link } from "@tanstack/react-router";
import { brandImages } from "@/data/images";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Official TiTAS logo lockup: the supplied logo seal plus the supplied
 * wordmark. Both are used exactly as provided — never redrawn or recoloured.
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
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center transition-transform duration-500 group-hover:-translate-y-0.5",
          variant === "inverse" && "rounded-full bg-ink-foreground p-1 shadow-lift",
        )}
      >
        <img
          src={brandImages.mark}
          alt=""
          aria-hidden="true"
          className={cn("h-10 w-auto", variant === "inverse" ? "h-8 md:h-9" : "md:h-11")}
        />
      </span>
      <span className="flex flex-col justify-center">
        <span
          className={cn(
            "font-display text-xl leading-none font-bold tracking-tight md:text-2xl",
            variant === "inverse" ? "text-ink-foreground" : "text-primary",
          )}
        >
          {company.brand}
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
