import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Send } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactActions } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { company, whatsappHref } from "@/data/company";

const title = "Become a Distributor / Dealer | TiTAS";
const description =
  "Enquire about becoming a TiTAS distributor or dealer — a dedicated business-partner service for distributors and dealers interested in selling TiTAS.";

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
          title="Become a TiTAS"
          script="Distributor / Dealer"
          lede="A dedicated business-partner service for distributors and dealers interested in selling TiTAS. Tell us about your business and we'll get in touch to discuss available opportunities."
          crumbs={[{ label: "Dealer / Distributor" }]}
        />

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <SectionHeading
                eyebrow="Enquiry Form"
                title="Tell us about"
                script="your business"
              />
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
                  Submitting opens WhatsApp with your details pre-filled, so our team can respond directly.
                </p>
                <Button type="submit" variant="brand" size="xl" className="justify-self-start">
                  <Send />
                  Send Enquiry
                </Button>
              </form>
            </Reveal>

            <Reveal delay={100} className="rounded-lg border border-border bg-accent/40 p-6">
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
