import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { whyTitas } from "@/data/services";
import { company } from "@/data/company";

const title = "Why TiTAS | Ekti Jaler Naam";
const description = `Why choose TiTAS packaged drinking water — reliable, quality-focused and trusted since ${company.since}.`;

export const Route = createFileRoute("/why-titas")({
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
  component: WhyTitasPage,
});

function WhyTitasPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Why TiTAS"
          title="Built on trust,"
          script="drop by drop"
          lede={`Serving homes, businesses and institutions since ${company.since}.`}
          crumbs={[{ label: "Why TiTAS" }]}
        />

        <Section>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyTitas.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={(i % 4) * 80}
                className="rounded-lg border border-border bg-card p-6"
              >
                <span className="eyebrow text-aqua">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </Section>

        <Section tone="surface">
          <Reveal className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-accent/40 p-10 text-center md:p-14">
            <SectionHeading
              align="center"
              eyebrow="Ready to order?"
              title="Choose the pack"
              script="that fits you"
              className="mx-auto"
            />
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand" size="xl">
                <Link to="/products">
                  Browse Products <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="quiet" size="xl">
                <Link to="/contact">Contact TiTAS</Link>
              </Button>
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
