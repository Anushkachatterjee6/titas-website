import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { legalDocs, legalPaths, type LegalDoc } from "@/data/legal";
import { company, mailHref, telHref, whatsappHref } from "@/data/company";

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
        />

        <Section>
          <div className="mx-auto max-w-3xl">
            {doc.intro && (
              <Reveal className="space-y-4">
                {doc.intro.map((p, i) => (
                  <p key={i} className="text-[1.05rem] leading-relaxed text-ink">
                    {p}
                  </p>
                ))}
              </Reveal>
            )}

            <ol className="mt-10 space-y-10">
              {doc.sections.map((section, i) => (
                <Reveal as="li" key={section.heading} delay={Math.min(i * 40, 320)}>
                  <h2 className="text-lg font-semibold text-ink md:text-xl">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.lead && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {section.lead}
                      </p>
                    )}
                    {section.bullets && (
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {section.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-ink"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-aqua"
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.paragraphs?.map((p, pi) => (
                      <p key={pi} className="text-sm leading-relaxed text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                </Reveal>
              ))}

              <Reveal as="li">
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
