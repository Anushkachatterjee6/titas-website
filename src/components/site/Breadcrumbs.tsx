import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({
  items,
  tone = "default",
  className,
}: {
  items: Crumb[];
  tone?: "default" | "inverse";
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            to="/"
            className={cn(
              "transition-colors",
              tone === "inverse"
                ? "text-ink-foreground/60 hover:text-ink-foreground"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight
              aria-hidden="true"
              className={cn(
                "size-3",
                tone === "inverse" ? "text-ink-foreground/35" : "text-border",
              )}
            />
            {item.to && i < items.length - 1 ? (
              <Link
                to={item.to}
                className={cn(
                  "transition-colors",
                  tone === "inverse"
                    ? "text-ink-foreground/60 hover:text-ink-foreground"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={cn(
                  "font-medium",
                  tone === "inverse" ? "text-ink-foreground" : "text-ink",
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
