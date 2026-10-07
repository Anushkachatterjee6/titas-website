import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, MessageCircle, Phone, FileText } from "lucide-react";
import { faqs, type Faq } from "@/data/faqs";
import { company, mailHref, telHref, whatsappHref } from "@/data/company";
import type { Service } from "@/data/services";
import type { Certification } from "@/data/quality";
import { Reveal } from "./Reveal";
import { ScriptAccent } from "./TiTASWordmark";
import { cn } from "@/lib/utils";

export function ServiceCard({
  service,
  index,
  delay = 0,
}: {
  service: Service;
  index: number;
  delay?: number;
}) {
  return (
    <Reveal as="article" delay={delay} className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-aqua/60 hover:shadow-lift">
        <div className="aspect-[5/4] w-full overflow-hidden bg-surface">
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="flex flex-1 flex-col p-7">
          <span className="eyebrow text-aqua">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 text-lg font-semibold text-ink">{service.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function FAQAccordion({ items = faqs }: { items?: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((faq, i) => (
        <AccordionItem key={faq.question} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-base font-medium text-ink hover:text-primary hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function CertificationCard({ item }: { item: Certification }) {
  const tone =
    item.status === "Obtained"
      ? "bg-aqua/15 text-primary"
      : "bg-muted text-muted-foreground";

  return (
    <Reveal as="article" className="h-full">
      <div className="flex h-full flex-col rounded-lg border border-border bg-card p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-ink">{item.name}</h3>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide whitespace-nowrap",
              tone,
            )}
          >
            {item.status}
          </span>
        </div>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.note}
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
          <div>
            <dt className="text-muted-foreground">Issue date</dt>
            <dd className="mt-0.5 font-medium text-ink">{item.issueDate ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Expiry date</dt>
            <dd className="mt-0.5 font-medium text-ink">{item.expiryDate ?? "—"}</dd>
          </div>
        </dl>
        {item.documentUrl && (
          <Button asChild variant="quiet" size="sm" className="mt-5 self-start">
            <a href={item.documentUrl} target="_blank" rel="noreferrer noopener">
              <FileText />
              {item.documentLabel ?? "View document"}
            </a>
          </Button>
        )}
      </div>
    </Reveal>
  );
}

export function LocationCard({
  location,
}: {
  location: (typeof company.locations)[number];
}) {
  // No API key required: Google's legacy /maps?...&output=embed endpoint
  // renders a real, live Maps tile preview from the existing approved
  // address text — not a fabricated or hardcoded image. `t=m`/`t=k` switches
  // roadmap vs. satellite imagery for the same query/zoom, so the marker,
  // position and zoom stay put across the toggle below. A single-result
  // `q=` search always drops Google's standard red pin at that address —
  // no custom marker/mapping library needed — and leading the query with
  // `markerName` makes that pin's own label read as the approved business
  // name rather than a generic address.
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const previewQuery = encodeURIComponent(
    [location.markerName, ...location.lines].join(", "),
  );
  const previewSrc = `https://maps.google.com/maps?q=${previewQuery}&z=15&t=${mapType === "satellite" ? "k" : "m"}&output=embed`;

  return (
    <Reveal as="article" className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
        <a
          href={location.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Open ${location.label} location in Google Maps`}
          className="group relative block aspect-[16/9] w-full shrink-0 overflow-hidden bg-surface"
        >
          <iframe
            key={mapType}
            src={previewSrc}
            title={`${location.label} map preview`}
            aria-hidden="true"
            tabIndex={-1}
            loading="lazy"
            className="pointer-events-none h-full w-full"
          />
          <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />

          {/* In-page Map/Satellite toggle — intercepts its own clicks so it
              never triggers the surrounding anchor's external navigation. */}
          <div
            className="absolute bottom-2 left-2 z-10 flex overflow-hidden rounded-md border border-white/30 bg-ink/80 text-[0.65rem] font-semibold shadow-lift backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              aria-pressed={mapType === "roadmap"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMapType("roadmap");
              }}
              className={cn(
                "px-2.5 py-1 transition-colors",
                mapType === "roadmap" ? "bg-aqua text-ink" : "text-ink-foreground hover:bg-white/10",
              )}
            >
              Map
            </button>
            <button
              type="button"
              aria-pressed={mapType === "satellite"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMapType("satellite");
              }}
              className={cn(
                "px-2.5 py-1 transition-colors",
                mapType === "satellite" ? "bg-aqua text-ink" : "text-ink-foreground hover:bg-white/10",
              )}
            >
              Satellite
            </button>
          </div>
        </a>

        <div className="flex flex-1 flex-col p-7">
          <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary">
            <MapPin className="size-4" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-base font-semibold text-ink">{location.label}</h3>
          <address className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground not-italic">
            {location.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <Button asChild variant="quiet" size="sm" className="mt-5 self-start">
            <a href={location.mapUrl} target="_blank" rel="noreferrer noopener">
              <MapPin />
              Open in Google Maps
            </a>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export function ContactActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      <Button asChild variant="brand" size="lg">
        <a href={telHref}>
          <Phone />
          Call {company.phone}
        </a>
      </Button>
      <Button asChild variant="aqua" size="lg">
        <a href={whatsappHref} target="_blank" rel="noreferrer noopener">
          <MessageCircle />
          WhatsApp
        </a>
      </Button>
      <Button asChild variant="quiet" size="lg">
        <a href={mailHref}>
          <Mail />
          Email us
        </a>
      </Button>
    </div>
  );
}

export function CTASection({
  eyebrow,
  title,
  script,
  body,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  body: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="surface-deep relative overflow-hidden py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 size-[28rem] rounded-full bg-aqua/15 blur-3xl"
      />
      <div className="container-page relative">
        <Reveal className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-4 text-aqua-soft/80">{eyebrow}</p>}
          <h2 className="text-3xl leading-tight font-semibold text-ink-foreground md:text-[2.6rem]">
            {title}
            {script && (
              <>
                {" "}
                <ScriptAccent text={script} inverse className="font-normal text-aqua-soft" />
              </>
            )}
          </h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-foreground/75">
            {body}
          </p>
          <div className="mt-9 flex flex-wrap gap-2.5">
            <Button asChild variant="aqua" size="xl">
              <Link to={primary.to}>{primary.label}</Link>
            </Button>
            {secondary && (
              <Button asChild variant="onDark" size="xl">
                <Link to={secondary.to}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function NoticeBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-aqua/35 bg-accent/50 px-4 py-3 text-xs leading-relaxed text-ink">
      {children}
    </p>
  );
}
