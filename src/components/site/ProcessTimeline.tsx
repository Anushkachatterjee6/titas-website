import * as AccordionPrimitive from "@radix-ui/react-accordion";
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
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { processStages, processSteps, type ProcessIcon, type ProcessStep } from "@/data/process";

/**
 * Vertical process journey for the Quality & Process page.
 *
 * Every individual step gets its own expandable card — collapsed by
 * default, showing only the stage's verbatim opening sentence (`brief`).
 * Clicking/tapping a card (or focusing it and pressing Enter/Space) expands
 * it to reveal every paragraph from the approved source document, in full,
 * verbatim. Built on Radix's Accordion primitive (`type="single"
 * collapsible`) — the same primitive already used by FAQAccordion
 * elsewhere on the site — so only one stage is open at a time (keeping the
 * page from turning into a 25-stage wall of text), aria-expanded/keyboard
 * behaviour comes for free, and the open/close animation reuses the
 * project's existing `animate-accordion-down`/`-up` utilities rather than
 * introducing a new animation.
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

function StepItem({ step, index, side }: { step: ProcessStep; index: number; side: "left" | "right" }) {
  const Icon = ICONS[step.icon];

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

      <AccordionPrimitive.Item
        value={step.ref}
        className="ml-6 overflow-hidden rounded-xl border border-border bg-card shadow-lift transition-colors duration-300 hover:border-aqua/40 md:ml-0"
      >
        <AccordionPrimitive.Header>
          <AccordionPrimitive.Trigger className="group flex w-full items-center gap-4 p-5 text-left md:gap-5 md:p-6">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary md:size-24">
              <Icon className="size-8 md:size-12" strokeWidth={1.5} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-mono text-xs text-aqua">{step.ref}</span>
              <h4 className="mt-1 text-sm font-semibold text-ink md:text-base">{step.displayTitle}</h4>
              <p className="mt-0.5 text-xs text-muted-foreground">{step.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.brief}</p>
            </div>
            <ChevronDown
              className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="space-y-3 border-t border-border px-5 pt-4 pb-5 text-sm leading-relaxed whitespace-pre-line text-ink/80 md:px-6 md:pb-6">
            {step.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
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
    <AccordionPrimitive.Root type="single" collapsible className="relative mt-4">
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
                  return <StepItem key={step.ref} step={step} index={runningIndex} side={side} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AccordionPrimitive.Root>
  );
}
