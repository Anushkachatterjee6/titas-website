import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ServiceCard, NoticeBanner } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { company } from "@/data/company";
import { heroImages } from "@/data/heroImages";

const title = "Our Services | TiTAS Packaged Drinking Water";
const description =
  "TiTAS supply for homes, offices, institutions, events, bulk requirements, wholesalers, retailers, dealers and distributors.";

export const Route = createFileRoute("/services")({
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
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Services"
          title="Supply for every"
          script="requirement"
          lede="From a single household to dealers and distributors, TiTAS supplies to suit how you need water."
          crumbs={[{ label: "Our Services" }]}
          image={heroImages.services}
        />

        <Section>
          <Reveal className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-accent/40 p-10 text-center md:p-14">
            <SectionHeading
              align="center"
              eyebrow="Distributor & Dealer Supply"
              title="Become a"
              script="TiTAS partner"
              lede="A dedicated business-partner service for distributors and dealers interested in selling TiTAS."
              className="mx-auto"
            />
            <Button asChild variant="brand" size="xl">
              <Link to="/dealer-distributor">
                Become a Distributor <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </Section>

        <Section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} delay={(i % 4) * 70} />
            ))}
          </div>
        </Section>

        <Section tone="surface">
          <SectionHeading eyebrow="Delivery" title="How delivery" script="works" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Reveal as="article" className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {company.delivery.summary}
              </p>
            </Reveal>
            <Reveal as="article" delay={70} className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {company.delivery.reach}
              </p>
            </Reveal>
            <Reveal
              as="article"
              delay={140}
              className="rounded-lg border border-border bg-card p-6"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {company.delivery.bulkMinimum}
              </p>
            </Reveal>
            <Reveal
              as="article"
              delay={210}
              className="rounded-lg border border-border bg-card p-6"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {company.delivery.freeDelivery}
              </p>
            </Reveal>
          </div>
          <NoticeBanner>{company.priceNotice}</NoticeBanner>
        </Section>
      </main>
      <Footer />
    </>
  );
}
