import { Truck } from "lucide-react";
import { Reveal } from "./Reveal";
import { deliveryCoverage } from "@/data/delivery";
import { cn } from "@/lib/utils";

/** Compact delivery-coverage note, reused on the homepage and at checkout
 *  so the wording never drifts between the two. Deliberately plain —
 *  no claimed delivery times, no "free delivery", no "all areas". */
export function DeliveryCoverageBanner({ className }: { className?: string }) {
  return (
    <Reveal
      direction="up"
      className={cn(
        "mx-auto flex max-w-xl items-center justify-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 text-center shadow-sm",
        className,
      )}
    >
      <Truck className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-ink">{deliveryCoverage.banner}</p>
    </Reveal>
  );
}
