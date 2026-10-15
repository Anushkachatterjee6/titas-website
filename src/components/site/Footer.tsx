import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { company, mailHref, telHref, whatsappHref } from "@/data/company";
import pageSurfaceImg from "@/assets/titas/motion/page-surface-water-blue-v2.webp";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Our Services", to: "/services" },
  { label: "Quality & Process", to: "/quality" },
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
    <footer
      className="relative overflow-hidden bg-cover bg-bottom bg-no-repeat text-ink-foreground"
      style={{ backgroundImage: `url(${pageSurfaceImg})` }}
    >
      <div className="container-page relative pt-16 pb-24 md:pt-20 md:pb-28">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Logo variant="inverse" withTagline={false} />
            <p className="script-accent mt-7 text-xl text-aqua-soft">
              {company.tagline}
            </p>
            <p className="mt-2 text-sm font-medium text-ink-foreground/85">
              {company.supportingLine}
            </p>
            <p className="mt-1 text-sm font-medium text-ink-foreground/70">
              Serving Since {company.since}
            </p>
            <p className="mt-8 max-w-sm text-sm leading-relaxed font-medium text-ink-foreground/80">
              {company.legalName} — packaged drinking water for homes,
              businesses, institutions, events and bulk requirements.
            </p>
            <SocialLinks className="mt-8" tone="inverse" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn title="Quick Links" links={quickLinks} />
            <FooterColumn title="Business" links={businessLinks} />
            <FooterColumn title="Legal" links={legalLinks} />

            <div>
              <h3 className="eyebrow text-ink-foreground/90">Contact</h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href={telHref}
                    className="flex items-center gap-2.5 font-medium text-ink-foreground/85 transition-colors hover:text-ink-foreground"
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
                    className="flex items-center gap-2.5 font-medium text-ink-foreground/85 transition-colors hover:text-ink-foreground"
                  >
                    <MessageCircle className="size-3.5 shrink-0" aria-hidden="true" />
                    {company.whatsapp}
                  </a>
                </li>
                <li>
                  <a
                    href={mailHref}
                    className="flex items-start gap-2.5 break-words font-medium text-ink-foreground/85 transition-colors hover:text-ink-foreground"
                  >
                    <Mail className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    {company.email}
                  </a>
                </li>
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-ink-foreground/65">
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
              <h3 className="eyebrow text-ink-foreground/90">{loc.label}</h3>
              <address className="mt-4 text-sm leading-relaxed font-medium text-ink-foreground/80 not-italic">
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

        <div className="mt-12 border-t border-ink-foreground/12 pt-7 text-xs font-medium text-ink-foreground/80">
          <p className="[text-shadow:0_1px_4px_rgba(4,18,46,0.55)]">
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
      <h3 className="eyebrow text-ink-foreground/90">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              to={link.to}
              className="font-medium text-ink-foreground/85 transition-colors hover:text-ink-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
