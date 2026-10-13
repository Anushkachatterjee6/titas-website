import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardList,
  FileCheck2,
  Handshake,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Truck,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { TiTASWordmark, ScriptAccent } from "@/components/site/TiTASWordmark";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactActions } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { heroImages } from "@/data/heroImages";
import { company, whatsappHref } from "@/data/company";

const title = "Become a Distributor / Dealer | TiTAS";
const description =
  "Enquire about becoming a TiTAS distributor or dealer — a dedicated business-partner service for distributors and dealers interested in selling TiTAS.";

const APPLY_STEPS = [
  {
    number: "01",
    icon: Phone,
    title: "Contact Us",
    description: "Reach out to the TiTAS team through phone, WhatsApp or our website.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Share Your Details",
    description:
      "Provide your name, business location, contact number and preferred dealership or distributorship area.",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Discuss Business Opportunities",
    description:
      "Learn about available products, pricing, order quantities, delivery arrangements and potential margins.",
  },
  {
    number: "04",
    icon: FileCheck2,
    title: "Complete Registration",
    description:
      "Submit the required business documents and complete the necessary formalities after approval.",
  },
  {
    number: "05",
    icon: Truck,
    title: "Start Your Business",
    description:
      "Place your first order and begin supplying TiTAS Packaged Drinking Water in your approved area.",
  },
] as const;

export const Route = createFileRoute("/dealer-distributor")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DealerDistributorPage,
});

function DealerDistributorPage() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    phone: "",
    email: "",
    location: "",
    message: "",
  });

  const message = encodeURIComponent(
    [
      "Hi TiTAS, I'd like to enquire about becoming a distributor/dealer.",
      `Name: ${form.name}`,
      form.business && `Business name: ${form.business}`,
      form.phone && `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      form.location && `Location: ${form.location}`,
      form.message && `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Distributor & Dealer Supply"
          title={
            <>
              <span className="block">
                Become a{" "}
                <TiTASWordmark className="inline-block h-[0.82em] w-auto align-[-0.08em]" />
              </span>
              <ScriptAccent
                text="Distributor / Dealer"
                className="mt-2 block font-normal text-aqua-soft"
              />
            </>
          }
          lede="A dedicated business-partner service for distributors and dealers interested in selling TiTAS. Tell us about your business and we'll get in touch to discuss available opportunities."
          crumbs={[{ label: "Dealer / Distributor" }]}
          image={heroImages.dealerDistributor}
        />

        <Section tone="surface">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal direction="up" distance={100} durationMs={400} easing="ease" replay>
              <h2 className="text-[2.05rem] leading-[1.08] font-bold text-ink md:text-[2.95rem]">
                Partner with TiTAS Packaged Drinking Water — Reliable Since 1999
              </h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-muted-foreground">
                Join the growing TiTAS distribution network and explore business opportunities with
                Sujit Aqua Enterprise.
              </p>
            </Reveal>
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal direction="up" distance={100} durationMs={400} easing="ease" replay>
              <h2 className="text-[2.05rem] leading-[1.08] font-bold text-ink md:text-[2.95rem]">
                How to apply
              </h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-muted-foreground">
                Follow 5 Easy Simple Steps
              </p>
            </Reveal>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {APPLY_STEPS.map((step, i) => {
              const Icon = step.icon;
              const cardDelay = Math.min(i * 70, 280);
              return (
                <Reveal
                  key={step.number}
                  as="article"
                  direction="up"
                  delay={cardDelay}
                  distance={100}
                  durationMs={400}
                  easing="ease"
                  replay
                  className="flex w-full flex-col items-center rounded-lg border border-border bg-card p-7 text-center transition-colors hover:border-aqua/50 sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <span className="eyebrow text-aqua">{step.number}</span>
                  <span className="mt-3 flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Section>

        <Section tone="surface">
          <Reveal
            direction="up"
            distance={100}
            durationMs={400}
            easing="ease"
            replay
            className="mx-auto max-w-xl text-center"
          >
            <p className="script-accent text-2xl text-primary">TiTAS — Ekti Jaler Naam</p>
            <p className="mt-2 text-xl font-bold text-ink">Grow Your Business with TiTAS!</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Dealership and distributorship opportunities are subject to area availability, company
              approval and agreed commercial terms.
            </p>
          </Reveal>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <SectionHeading eyebrow="Enquiry Form" title="Tell us about" script="your business" />
              <form
                className="mt-8 grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.open(`${whatsappHref}?text=${message}`, "_blank", "noreferrer noopener");
                }}
              >
                <Field label="Name" required>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="Business name">
                  <Input
                    value={form.business}
                    onChange={(e) => setForm((f) => ({ ...f, business: e.target.value }))}
                    placeholder="Your business name"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" required>
                    <Input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>
                <Field label="Location" required>
                  <Input
                    required
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="City / area"
                  />
                </Field>
                <Field label="Message">
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your business and requirements"
                    rows={4}
                  />
                </Field>
                <p className="text-xs text-muted-foreground">
                  Submitting opens WhatsApp with your details pre-filled, so our team can respond
                  directly.
                </p>
                <Button type="submit" variant="brand" size="xl" className="justify-self-start">
                  <Send />
                  Send Enquiry
                </Button>
              </form>
            </Reveal>

            <Reveal
              delay={100}
              direction="right"
              distance={100}
              durationMs={400}
              easing="ease"
              replay
              className="rounded-lg border border-border bg-accent/40 p-6"
            >
              <h3 className="text-base font-semibold text-ink">Prefer to talk directly?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Contact our team with your business details and location to discuss available
                opportunities.
              </p>
              <ContactActions className="mt-5" />
              <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <MessageCircle className="size-3.5" aria-hidden="true" />
                {company.hours.weekdays} · {company.hours.closed}
              </p>
              <OfficeMap />
            </Reveal>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      {children}
    </div>
  );
}

/** Interactive office-location map, shown below the Call/WhatsApp/Email
 *  actions on this page. Uses the verified office address already approved
 *  in `company.locations` (same source Footer, Contact and the About page's
 *  location cards read from — see src/components/site/Blocks.tsx's
 *  `LocationCard` for the same embed approach) — no API key, no invented
 *  coordinates. Unlike `LocationCard`'s click-through preview, the embed
 *  here stays fully interactive (pannable/zoomable) since this page asked
 *  for a genuinely usable map, not just a thumbnail. */
function OfficeMap() {
  const office = company.locations.find((l) => l.id === "office");
  if (!office) return null;

  const query = encodeURIComponent([office.markerName, ...office.lines].join(", "));
  const src = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-primary/25">
      <iframe
        src={src}
        title={`${office.label} location map — SUJIT AQUA ENTERPRISE`}
        loading="lazy"
        className="h-56 w-full sm:h-64"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/15 bg-accent/30 px-4 py-3">
        <address className="text-xs leading-relaxed text-muted-foreground not-italic">
          {office.lines.join(", ")}
        </address>
        <Button asChild variant="quiet" size="sm" className="shrink-0">
          <a href={office.mapUrl} target="_blank" rel="noreferrer noopener">
            <MapPin />
            Directions
          </a>
        </Button>
      </div>
    </div>
  );
}
