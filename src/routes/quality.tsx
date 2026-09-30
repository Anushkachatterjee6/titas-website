import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CertificationCard, NoticeBanner } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { processSteps, processStages, processFlowImage } from "@/data/process";
import { labReport, labCategories, certifications } from "@/data/quality";

const title = "Water Quality | TiTAS";
const description =
  "TiTAS purification process, quality-control approach and the laboratory test report for our packaged drinking water.";

export const Route = createFileRoute("/quality")({
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
  component: QualityPage,
});

function QualityPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Quality & Purification"
          title="From Source"
          script="to Seal"
          lede="A careful, quality-focused process — transcribed from the company's own process documentation — carries every TiTAS pack from raw water to the sealed bottle in your hands."
          crumbs={[{ label: "Quality" }]}
        />

        <Section>
          <SectionHeading
            eyebrow="Purification Process"
            title="Every stage,"
            script="in order"
            lede="Each step below is transcribed from TiTAS's own Process Flow Chart for Bottle Filling. Nothing is invented and nothing beyond that document is claimed."
          />

          <Reveal delay={100} className="mt-10 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <img
              src={processFlowImage}
              alt="TiTAS process flow chart for bottle filling, supplied by SUJIT AQUA ENTERPRISE"
              className="h-auto w-full min-w-[1100px] max-w-[1774px] object-contain"
              loading="lazy"
            />
          </Reveal>
          <p className="mt-2 text-xs text-muted-foreground sm:hidden">
            Scroll sideways to see the full process flow.
          </p>

          <div className="mt-14 space-y-10">
            {processStages.map((stage, stageIndex) => {
              const steps = processSteps.filter((s) => s.stage === stage);
              if (steps.length === 0) return null;
              return (
                <Reveal key={stage} delay={stageIndex * 60}>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-ink">
                    <span className="eyebrow flex size-8 items-center justify-center rounded-full bg-accent text-primary">
                      {stageIndex + 1}
                    </span>
                    {stage}
                  </h3>
                  <ol className="mt-4 grid gap-3 border-l border-border pl-6 sm:grid-cols-2">
                    {steps.map((step) => (
                      <li key={step.ref} className="text-sm">
                        <span className="font-mono text-xs text-aqua">{step.ref}</span>{" "}
                        <span className="text-ink">{step.title}</span>
                        {step.control && (
                          <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                            {step.control}
                          </span>
                        )}
                        {step.detail && (
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {step.detail}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </Reveal>
              );
            })}
          </div>
        </Section>

        <Section tone="surface">
          <SectionHeading
            eyebrow="Laboratory Report"
            title="Independently"
            script="tested"
            lede="Water quality testing is carried out through an external laboratory. Details below are from the specific sample and report supplied by the company."
          />

          <Reveal delay={100} className="mt-10 grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Laboratory" value={labReport.laboratory} />
            <Field label="Report code" value={labReport.reportCode} />
            <Field label="Issue date" value={labReport.issueDate} />
            <Field label="Issued to" value={labReport.issuedTo} />
            <Field label="Sample" value={labReport.sampleDescription} />
            <Field label="Source of water" value={labReport.sourceOfWater} />
            <Field label="Sample drawn on" value={labReport.sampleDrawnOn} />
            <Field label="Sample quantity" value={labReport.sampleQuantity} />
            <Field label="Analysis duration" value={labReport.analysisDuration} />
            <Field label="Specification" value={labReport.specification} />
            <Field label="Sampling procedure" value={labReport.samplingProcedure} />
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labCategories.map((cat, i) => (
              <Reveal
                as="article"
                key={cat.title}
                delay={i * 70}
                className="rounded-lg border border-border bg-card p-6"
              >
                <h4 className="text-sm font-semibold text-ink">{cat.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{cat.detail}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="mt-8">
            <NoticeBanner>{labReport.disclaimer}</NoticeBanner>
            <Button asChild variant="brand" size="xl" className="mt-5">
              <a href={labReport.pdfUrl} target="_blank" rel="noreferrer noopener">
                <FileText />
                View Full Laboratory Report (PDF)
              </a>
            </Button>
          </Reveal>
        </Section>

        <Section>
          <SectionHeading
            eyebrow="Licences & Certifications"
            title="Where we"
            script="stand today"
            lede="Status of TiTAS's licences and certifications, updated as documentation is finalised."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((item) => (
              <CertificationCard key={item.name} item={item} />
            ))}
          </div>
        </Section>

        <Section tone="surface">
          <Reveal className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-accent/40 p-10 text-center md:p-14">
            <SectionHeading
              align="center"
              eyebrow="Questions?"
              title="Talk to us about"
              script="water quality"
              className="mx-auto"
            />
            <Button asChild variant="brand" size="xl">
              <Link to="/contact">
                Contact TiTAS <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
