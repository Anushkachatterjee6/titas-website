import { useState } from "react";
import {
  Beaker,
  Building2,
  ChevronDown,
  Container,
  Droplet,
  Filter,
  FlaskConical,
  GlassWater,
  Grid3x3,
  Layers,
  Microscope,
  Orbit,
  Package,
  SunMedium,
  Truck,
  Warehouse,
  Waves,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { processStages, processSteps, type ProcessIcon, type ProcessStep } from "@/data/process";

/**
 * Vertical process journey for the Quality & Process page.
 *
 * Every individual step from the company's Process Flow Chart gets its own
 * card and icon (not just the 3 major stages) — the stages are rendered as
 * section markers along one continuous timeline, alternating left/right on
 * desktop and collapsing to a single rail on mobile. Stage markers sit on an
 * opaque background so they visually interrupt the thin flow-line/node
 * instead of colliding with it — the line still runs continuously behind
 * them, it's just given clear space to breathe above each stage's first card.
 */

const ICONS: Record<ProcessIcon, typeof Droplet> = {
  source: Droplet,
  tank: Container,
  dose: FlaskConical,
  "sand-filter": Layers,
  "carbon-filter": Filter,
  rooftop: Building2,
  membrane: Grid3x3,
  ro: Waves,
  mineral: Beaker,
  uv: SunMedium,
  ozone: Orbit,
  "ss-tank": Container,
  fill: GlassWater,
  package: Package,
  test: Microscope,
  store: Warehouse,
  dispatch: Truck,
};

function StepCard({ step, index, side }: { step: ProcessStep; index: number; side: "left" | "right" }) {
  const Icon = ICONS[step.icon];
  const [open, setOpen] = useState(false);

  return (
    <Reveal
      delay={(index % 6) * 50}
      className={cn("relative md:w-[calc(50%-2.25rem)]", side === "right" ? "md:ml-auto" : "")}
    >
      {/* Node on the central line (desktop) / left rail (mobile) */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-6 left-0 flex size-3 -translate-x-1/2 items-center justify-center rounded-full bg-aqua ring-4 ring-background md:left-auto",
          side === "right" ? "md:-left-9 md:translate-x-0" : "md:-right-9 md:left-auto md:translate-x-1/2",
        )}
      />

      <div className="ml-6 rounded-xl border border-border bg-card p-5 shadow-lift md:ml-0 md:p-6">
        <div className="flex items-center gap-4 md:gap-5">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary md:size-24">
            <Icon className="size-8 md:size-12" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-aqua">{step.ref}</span>
              {step.control && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                  {step.control}
                </span>
              )}
            </div>
            <h4 className="mt-1 text-sm font-semibold text-ink md:text-base">{step.displayTitle}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">{step.title}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{step.description}</p>

        {step.fullDetail && (
          <Collapsible open={open} onOpenChange={setOpen} className="mt-2">
            <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              {open ? "Hide process detail" : "Show process detail"}
              <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 rounded-lg bg-accent/40 p-3 text-xs leading-relaxed text-ink/80">
              {step.fullDetail}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </Reveal>
  );
}

function StageMarker({ index, label, first }: { index: number; label: string; first: boolean }) {
  return (
    <Reveal
      className={cn(
        "relative z-10 flex items-center gap-4 bg-background py-2",
        "md:flex-col md:justify-center md:gap-3 md:py-4 md:text-center",
        !first && "mt-4 md:mt-6",
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-ink-foreground shadow-lift md:size-11 md:text-sm"
      >
        {String(index).padStart(2, "0")}
      </span>
      <p className="eyebrow text-aqua">{label}</p>
    </Reveal>
  );
}

export function ProcessTimeline() {
  let runningIndex = 0;

  return (
    <div className="relative mt-4">
      {/* Central water-flow line: a hairline on mobile's left rail, centred on desktop.
          Stage markers above render on an opaque background and sit in normal
          flow (not on top of the line), so the line visually pauses for each
          stage label instead of colliding with it. */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-aqua/10 via-aqua/40 to-aqua/10 md:left-1/2"
      />

      <div className="space-y-6 md:space-y-10">
        {processStages.map((stage, stageIndex) => {
          const steps = processSteps.filter((s) => s.stage === stage);
          if (steps.length === 0) return null;
          return (
            <div key={stage} className="space-y-6 md:space-y-10">
              <StageMarker index={stageIndex + 1} label={stage} first={stageIndex === 0} />
              <div className="space-y-6 pt-2 md:space-y-10 md:pt-4">
                {steps.map((step) => {
                  const side = runningIndex % 2 === 0 ? "left" : "right";
                  runningIndex += 1;
                  return <StepCard key={step.ref} step={step} index={runningIndex} side={side} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
