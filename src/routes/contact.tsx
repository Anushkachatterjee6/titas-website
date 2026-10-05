import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactActions, LocationCard } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { company, mailHref } from "@/data/company";

const title = "Contact | TiTAS";
const description = `Contact ${company.legalName} for TiTAS packaged drinking water orders, bulk enquiries, delivery information and business enquiries.`;

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });

  const subject = encodeURIComponent(`TiTAS enquiry${form.topic ? ` — ${form.topic}` : ""}`);
  const body = encodeURIComponent(
    [
      `Name: ${form.name}`,
      form.phone && `Phone: ${form.phone}`,
      form.topic && `Topic: ${form.topic}`,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Contact"
          title="Let's talk"
          script="water"
          lede="Get in touch with TiTAS for orders, bulk enquiries, dealer/distributor enquiries and regular supply requirements."
          crumbs={[{ label: "Contact" }]}
        />

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <SectionHeading eyebrow="Send a message" title="We'll get" script="back to you" />
              <form
                className="mt-8 grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `${mailHref}?subject=${subject}&body=${body}`;
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
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email" required>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                    />
                  </Field>
                  <Field label="Phone">
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </Field>
                </div>
                <Field label="Topic">
                  <Input
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                    placeholder="Dealer / Distributor, Bulk Order, Delivery, Product, Career Enquiry, Feedback, Complaint"
                  />
                </Field>
                <Field label="Message" required>
                  <Textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="How can we help?"
                    rows={5}
                  />
                </Field>
                <p className="text-xs text-muted-foreground">
                  Submitting opens your email app with this message pre-filled, addressed to{" "}
                  {company.email}.
                </p>
                <Button type="submit" variant="brand" size="xl" className="justify-self-start">
                  <Send />
                  Send Message
                </Button>
              </form>
            </Reveal>

            <Reveal delay={100} className="grid gap-6 self-start">
              <div>
                <h3 className="text-base font-semibold text-ink">Direct contact</h3>
                <ContactActions className="mt-4" />
                <p className="mt-5 text-xs text-muted-foreground">
                  {company.hours.weekdays} · {company.hours.closed}
                </p>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section tone="surface">
          <SectionHeading eyebrow="Locations" title="Find us" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {company.locations.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
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
