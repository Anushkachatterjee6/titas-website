import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { company, mailHref, telHref, whatsappHref } from "@/data/company";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Quality", to: "/quality" },
  { label: "FAQs", to: "/faqs" },
  { label: "Contact", to: "/contact" },
];

const businessLinks = [
  { label: "Dealer / Distributor", to: "/dealer-distributor" },
  { label: "Bulk Orders", to: "/services" },
  { label: "Online Ordering", to: "/products" },
  { label: "Water Quality", to: "/quality" },
  { label: "Gallery", to: "/gallery" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Shipping & Delivery", to: "/shipping-delivery" },
  { label: "Cancellation & Refund", to: "/cancellation-refund" },
];

export function Footer() {
  return (
    <footer className="surface-deep relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 left-1/3 size-[32rem] rounded-full bg-aqua/12 blur-3xl"
      />
      <div className="container-page relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Logo variant="inverse" withTagline={false} />
            <p className="script-accent mt-5 text-2xl text-aqua-soft">
              {company.tagline}
            </p>
            <p className="mt-2 text-sm text-ink-foreground/70">
              {company.supportingLine}
            </p>
            <p className="mt-1 text-sm text-ink-foreground/55">
              Serving Since {company.since}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-foreground/60">
              {company.legalName} — packaged drinking water for homes,
              businesses, institutions, events and bulk requirements.
            </p>
            <SocialLinks className="mt-7" tone="inverse" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn title="Quick Links" links={quickLinks} />
            <FooterColumn title="Business" links={businessLinks} />
            <FooterColumn title="Legal" links={legalLinks} />

            <div>
              <h3 className="eyebrow text-aqua-soft/70">Contact</h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href={telHref}
                    className="flex items-center gap-2.5 text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                  >
                    <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                    {company.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2.5 text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                  >
                    <MessageCircle className="size-3.5 shrink-0" aria-hidden="true" />
                    {company.whatsapp}
                  </a>
                </li>
                <li>
                  <a
                    href={mailHref}
                    className="flex items-start gap-2.5 break-words text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                  >
                    <Mail className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    {company.email}
                  </a>
                </li>
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-ink-foreground/45">
                {company.hours.weekdays}
                <br />
                {company.hours.closed}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-ink-foreground/12 pt-10 sm:grid-cols-2">
          {company.locations.map((loc) => (
            <div key={loc.id}>
              <h3 className="eyebrow text-aqua-soft/70">{loc.label}</h3>
              <address className="mt-4 text-sm leading-relaxed text-ink-foreground/65 not-italic">
                {loc.lines.join(", ")}
              </address>
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-aqua-soft transition-colors hover:text-ink-foreground"
              >
                <MapPin className="size-3.5" aria-hidden="true" />
                View on Google Maps
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-ink-foreground/12 pt-7 text-xs text-ink-foreground/45">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; to: string }>;
}) {
  return (
    <div>
      <h3 className="eyebrow text-aqua-soft/70">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              to={link.to}
              className="text-ink-foreground/70 transition-colors hover:text-ink-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
