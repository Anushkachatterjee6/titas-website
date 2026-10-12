import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FAQAccordion } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { faqs } from "@/data/faqs";
import { whatsappHref } from "@/data/company";
import { heroImages } from "@/data/heroImages";

const title = "FAQs | TiTAS";
const description =
  "Frequently asked questions about TiTAS packaged drinking water — products, delivery, bulk orders, payment and more.";

export const Route = createFileRoute("/faqs")({
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
  component: FaqsPage,
});

function FaqsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="FAQs"
          title="Common"
          script="questions"
          lede="Answers to what customers most often ask about TiTAS products, delivery and ordering."
          crumbs={[{ label: "FAQs" }]}
          image={heroImages.faqs}
        />

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <Reveal>
              <FAQAccordion items={faqs} />
            </Reveal>
            <Reveal delay={100} className="rounded-lg border border-border bg-accent/40 p-6">
              <h3 className="text-base font-semibold text-ink">Still have a question?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Reach out to our team directly and we'll help you out.
              </p>
              <Button asChild variant="brand" size="lg" className="mt-5">
                <a href={whatsappHref} target="_blank" rel="noreferrer noopener">
                  <MessageCircle />
                  Chat on WhatsApp
                </a>
              </Button>
              <Link
                to="/contact"
                className="mt-3 block text-center text-sm font-semibold text-primary hover:underline"
              >
                Or visit our Contact page
              </Link>
            </Reveal>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
