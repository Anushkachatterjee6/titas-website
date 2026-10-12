import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgePercent,
  Compass,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal, AnimatedHeading, ProgressiveText } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { brandImages } from "@/data/images";
import { company, commitments } from "@/data/company";
import { heroImages } from "@/data/heroImages";

const COMMITMENT_ICONS = [ShieldCheck, HeartHandshake, Truck, BadgePercent];
// One tasteful emoji per commitment card, chosen to match its meaning —
// purely decorative alongside the existing Lucide icon, never replacing it.
const COMMITMENT_EMOJIS = ["💧", "💙", "🚚", "✨"];

const title = "About TiTAS | Ekti Jaler Naam";
const description = `About TiTAS packaged drinking water by ${company.legalName} — ${company.tagline}, ${company.supportingLine}, serving since ${company.since}.`;

export const Route = createFileRoute("/about")({
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
  component: About,
});

function About() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow={company.tagline}
          title="About"
          script="TiTAS"
          lede={company.intro}
          crumbs={[{ label: "About" }]}
          image={heroImages.about}
        />

        <Section>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <SectionHeading
                eyebrow={`${company.legalName} · ${company.sinceLine}`}
                title={company.brand}
                titleBrand
                script={company.tagline}
                lede={company.supportingLine}
              />
              <ProgressiveText
                text={company.intro}
                delay={100}
                className="mt-6 block max-w-xl text-sm leading-relaxed text-muted-foreground"
              />
            </div>
            <Reveal delay={150} className="flex justify-center">
              <div className="relative flex aspect-square w-full max-w-xs items-center justify-center rounded-full bg-accent/50">
                <img
                  src={brandImages.mark}
                  alt="TiTAS logo"
                  className="w-3/5 rounded-full mix-blend-multiply"
                  loading="lazy"
                />
                <span className="absolute -bottom-2 rounded-full bg-card px-5 py-2 text-sm font-semibold text-ink shadow-lift">
                  Since {company.since}
                </span>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section tone="surface">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal
              as="article"
              direction="up"
              className="rounded-lg border border-border bg-card p-8"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                <Eye className="size-5" strokeWidth={1.75} />
              </span>
              <span className="eyebrow mt-4 block text-aqua">
                <AnimatedHeading as="span" trigger="scroll">
                  <span className="text-[0.78rem]">Vision</span>
                </AnimatedHeading>{" "}
                <span className="align-[-2px] text-[1.05rem]">🌱</span>
              </span>
              <ProgressiveText
                text={company.vision}
                delay={150}
                className="mt-4 block text-sm leading-relaxed text-muted-foreground"
              />
            </Reveal>
            <Reveal
              as="article"
              direction="up"
              delay={80}
              className="rounded-lg border border-border bg-card p-8"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                <Compass className="size-5" strokeWidth={1.75} />
              </span>
              <span className="eyebrow mt-4 block text-aqua">
                <AnimatedHeading as="span" trigger="scroll" delay={80}>
                  <span className="text-[0.78rem]">Mission</span>
                </AnimatedHeading>{" "}
                <span className="align-[-2px] text-[1.05rem]">🤝</span>
              </span>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {company.mission.map((paragraph, i) => (
                  <ProgressiveText
                    key={paragraph}
                    text={paragraph}
                    delay={200 + i * 120}
                    wordIntervalMs={20}
                    as="p"
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </Section>

        <Section>
          <SectionHeading eyebrow="What Drives Us" title="Our" script="Commitment" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {commitments.map((item, i) => {
              const Icon = COMMITMENT_ICONS[i]!;
              const emoji = COMMITMENT_EMOJIS[i]!;
              // Rows stagger a little (0/80ms within each row), but the second
              // row starts its own short sequence rather than waiting for
              // every word of row one to finish revealing.
              const rowDelay = (i % 2) * 80;
              return (
                <Reveal
                  as="article"
                  direction="up"
                  key={item.number}
                  delay={rowDelay}
                  className="flex gap-5 rounded-lg border border-border bg-card p-7"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <span className="eyebrow text-aqua">{item.number}</span>
                    <h3 className="mt-2 text-lg font-bold text-ink">
                      <AnimatedHeading as="span" trigger="scroll" delay={rowDelay + 40}>
                        {item.eyebrow}
                      </AnimatedHeading>{" "}
                      <span className="align-[-2px] text-lg">{emoji}</span>
                    </h3>
                    <Reveal
                      direction="left"
                      distance={25}
                      durationMs={500}
                      delay={rowDelay + 120}
                      className="mt-0.5 text-sm text-muted-foreground"
                    >
                      {item.title}
                    </Reveal>
                    <ProgressiveText
                      text={item.description}
                      delay={rowDelay + 200}
                      className="mt-3 block text-sm leading-relaxed text-muted-foreground"
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>

        <Section>
          <Reveal className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-accent/40 p-10 text-center md:p-14">
            <SectionHeading
              align="center"
              eyebrow="Learn more"
              title="See why"
              script="TiTAS is trusted"
              lede={`Serving homes, businesses and institutions since ${company.since}.`}
              className="mx-auto"
            />
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand" size="xl">
                <Link to="/why-titas">
                  Why TiTAS <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="quiet" size="xl">
                <Link to="/quality">Our Quality Approach</Link>
              </Button>
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
