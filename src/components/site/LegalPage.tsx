import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Reveal, AnimatedList } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { legalDocs, legalPaths, type LegalDoc } from "@/data/legal";
import { company, mailHref, telHref, whatsappHref } from "@/data/company";
import { heroImages } from "@/data/heroImages";

const LEGAL_HERO_IMAGE: Record<LegalDoc["slug"], (typeof heroImages)[keyof typeof heroImages]> = {
  "privacy-policy": heroImages.privacyPolicy,
  terms: heroImages.terms,
  "shipping-delivery": heroImages.shippingDelivery,
  "cancellation-refund": heroImages.cancellationRefund,
};

/** Shared renderer for the four legal pages — content comes from
 *  `src/data/legal.ts`, transcribed verbatim from the approved document. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Legal"
          title={doc.pageTitle}
          lede={doc.effectiveDateLines.join(" · ")}
          crumbs={[{ label: doc.pageTitle }]}
          image={LEGAL_HERO_IMAGE[doc.slug]}
        />

        <Section>
          <div className="mx-auto max-w-3xl">
            {doc.intro && (
              <div className="space-y-4">
                {doc.intro.map((p, i) => (
                  <Reveal
                    key={i}
                    direction="up"
                    delay={i * 80}
                    distance={100}
                    durationMs={400}
                    easing="ease"
                    replay
                  >
                    <p className="text-[1.05rem] leading-relaxed text-ink">{p}</p>
                  </Reveal>
                ))}
              </div>
            )}

            <ol className="mt-10 space-y-10">
              {doc.sections.map((section) => (
                <li key={section.heading}>
                  <Reveal direction="up" distance={100} durationMs={400} easing="ease" replay>
                    <h2 className="text-lg font-semibold text-ink md:text-xl">{section.heading}</h2>
                  </Reveal>
                  <div className="mt-3 space-y-3">
                    {section.lead && (
                      <Reveal
                        direction="up"
                        delay={60}
                        distance={100}
                        durationMs={400}
                        easing="ease"
                        replay
                      >
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {section.lead}
                        </p>
                      </Reveal>
                    )}
                    {section.bullets && (
                      <AnimatedList
                        as="ul"
                        className="grid gap-2 sm:grid-cols-2"
                        itemClassName="flex items-start gap-2.5 text-sm leading-relaxed text-ink"
                        stagger={80}
                      >
                        {section.bullets.map((b) => (
                          <>
                            <span
                              aria-hidden="true"
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-aqua"
                            />
                            {b}
                          </>
                        ))}
                      </AnimatedList>
                    )}
                    {section.paragraphs?.map((p, pi) => (
                      <Reveal
                        key={pi}
                        direction="up"
                        delay={60 + pi * 40}
                        distance={100}
                        durationMs={400}
                        easing="ease"
                        replay
                      >
                        <p className="text-sm leading-relaxed text-muted-foreground">{p}</p>
                      </Reveal>
                    ))}
                  </div>
                </li>
              ))}

              <Reveal as="li" direction="up" distance={100} durationMs={400} easing="ease" replay>
                <h2 className="text-lg font-semibold text-ink md:text-xl">Contact</h2>
                <div className="mt-3 space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    For questions about this policy, reach {company.legalName} — {company.brand}:
                  </p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    <li>
                      Phone:{" "}
                      <a href={telHref} className="text-primary hover:underline">
                        {company.phone}
                      </a>
                    </li>
                    <li>
                      WhatsApp:{" "}
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-primary hover:underline"
                      >
                        {company.whatsapp}
                      </a>
                    </li>
                    <li>
                      Email:{" "}
                      <a href={mailHref} className="text-primary hover:underline">
                        {company.email}
                      </a>
                    </li>
                  </ul>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {company.locations.map((loc) => (
                      <div key={loc.id}>
                        <p className="text-xs font-semibold tracking-wide text-aqua uppercase">
                          {loc.label}
                        </p>
                        <address className="mt-1 text-sm leading-relaxed text-muted-foreground not-italic">
                          {loc.lines.join(", ")}
                        </address>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </ol>

            <nav
              aria-label="Other legal pages"
              className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8"
            >
              {legalDocs
                .filter((d) => d.slug !== doc.slug)
                .map((d) => (
                  <Link
                    key={d.slug}
                    to={legalPaths[d.slug]}
                    className={cn(
                      "rounded-full border border-border px-4 py-1.5 text-sm text-ink transition-colors",
                      "hover:border-aqua/60 hover:text-primary",
                    )}
                  >
                    {d.navLabel}
                  </Link>
                ))}
            </nav>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
