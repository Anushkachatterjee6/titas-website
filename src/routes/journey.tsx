import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import sourceImg from "@/assets/titas/motion/source-3d.png";
import purificationImg from "@/assets/titas/motion/purification-3d.png";
import qualityImg from "@/assets/titas/motion/quality-3d.png";
import bottleImg from "@/assets/titas/motion/bottle-3d.png";
import deliveryImg from "@/assets/titas/motion/delivery-3d.png";

const title = "Every Drop Has a Journey | TiTAS";
const description =
  "From source to your doorstep, every TiTAS pack follows the same careful path — source, purification, quality, bottling and delivery.";

export const Route = createFileRoute("/journey")({
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
  component: JourneyPage,
});

/** Exact client-approved copy — transcribed verbatim, nothing rewritten,
 *  shortened, expanded or added to. Images reuse the same approved 3D
 *  motion assets already used for the homepage's Water Journey visual. */
const JOURNEY_STAGES = [
  {
    key: "source",
    number: "01",
    label: "Source",
    title: "Where Purity Begins",
    body: "Every bottle of TiTAS Packaged Drinking Water begins with carefully sourced water. From the very first stage, we focus on responsible handling and controlled processing to create a strong foundation for quality. The source water is collected and prepared for a systematic purification journey designed to deliver clean, refreshing packaged drinking water.",
    img: sourceImg,
  },
  {
    key: "purification",
    number: "02",
    label: "Purification",
    title: "Advanced Treatment. Carefully Controlled.",
    body: "The water moves through a multi-stage purification process designed to remove unwanted impurities and maintain consistent water quality. The treatment process can include sand filtration, activated carbon filtration, micron filtration, Reverse Osmosis (RO), UV treatment and ozonation before the treated water is transferred to a hygienic storage system. Each stage plays an important role in preparing TiTAS water for safe and hygienic packaging.",
    img: purificationImg,
  },
  {
    key: "quality",
    number: "03",
    label: "Quality",
    title: "Quality at Every Step",
    body: "Quality is at the heart of the TiTAS journey. From water treatment to filling and packaging, hygiene and process controls are maintained throughout production. Relevant quality parameters are monitored to help ensure consistency and compliance with applicable standards. Our focus is simple: every TiTAS pack should represent the quality and trust our customers expect from our brand.",
    img: qualityImg,
  },
  {
    key: "bottle",
    number: "04",
    label: "Bottle",
    title: "Hygienically Packed. Carefully Sealed.",
    body: "After purification and quality checks, treated water moves to the packaging stage. Bottles and containers are properly prepared before filling, and the water is hygienically filled and securely capped to help protect it from external contamination. From 500 ml and 1 L bottles to 2 L, 5 L and 20 L packs, TiTAS offers convenient options for different drinking-water needs.",
    img: bottleImg,
  },
  {
    key: "delivery",
    number: "05",
    label: "Delivery",
    title: "From Our Facility to Your Doorstep",
    body: "Our responsibility continues beyond production. Finished TiTAS packs are carefully handled, stored and distributed through our delivery and distribution network. Whether supplying homes, shops, offices, restaurants, hotels, institutions, events or businesses, our aim is dependable availability and timely service while maintaining appropriate handling throughout the distribution journey.",
    img: deliveryImg,
  },
] as const;

function JourneyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Story in Motion"
          title="Every Drop Has"
          script="a Journey"
          lede="From source to your doorstep, every TiTAS pack follows the same careful path."
          crumbs={[{ label: "Journey" }]}
        />

        <Section>
          <SectionHeading
            align="center"
            eyebrow="The Journey"
            title="Five stages,"
            script="one careful path"
            className="mx-auto"
          />

          <div className="relative mt-16 md:mt-20">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-7 w-px bg-gradient-to-b from-aqua/50 via-aqua/25 to-transparent md:left-1/2"
            />

            <div className="space-y-16 md:space-y-24">
              {JOURNEY_STAGES.map((stage, i) => {
                const reversed = i % 2 === 1;
                return (
                  <Reveal key={stage.key} delay={i * 60} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-7 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border border-aqua/30 bg-card font-display text-sm font-semibold text-primary shadow-lift md:left-1/2"
                    >
                      {stage.number}
                    </span>

                    <div className="grid items-center gap-8 pl-20 md:grid-cols-2 md:gap-16 md:pl-0">
                      <div className={cn("flex justify-center", reversed && "md:order-2")}>
                        <div className="flex h-44 w-44 items-center justify-center rounded-full bg-accent/40 sm:h-52 sm:w-52">
                          <img
                            src={stage.img}
                            alt=""
                            aria-hidden="true"
                            className="h-32 w-auto max-w-none drop-shadow-[0_14px_18px_rgba(10,40,70,0.18)] sm:h-40"
                            loading="lazy"
                            draggable={false}
                          />
                        </div>
                      </div>

                      <div className={cn(reversed && "md:order-1 md:text-right")}>
                        <p className="eyebrow text-aqua">{stage.label}</p>
                        <h3 className="mt-3 text-2xl leading-tight font-semibold text-ink md:text-[1.75rem]">
                          {stage.title}
                        </h3>
                        <p className="mt-4 text-[1.02rem] leading-relaxed text-muted-foreground">
                          {stage.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Section>

        <Section tone="surface">
          <Reveal className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-accent/40 p-10 text-center md:p-14">
            <SectionHeading
              align="center"
              eyebrow="Ready to order?"
              title="Bring the journey"
              script="to your door"
              className="mx-auto"
            />
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand" size="xl">
                <Link to="/products">
                  Browse Products <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="quiet" size="xl">
                <Link to="/quality">See Our Quality Process</Link>
              </Button>
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
