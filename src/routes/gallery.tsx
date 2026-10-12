import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Reveal, AnimatedList } from "@/components/site/Reveal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { galleryCategories } from "@/data/images";
import { heroImages } from "@/data/heroImages";

const title = "Gallery | TiTAS";
const description = "A look at TiTAS packaged drinking water — products, packaging and delivery.";

export const Route = createFileRoute("/gallery")({
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
  component: GalleryPage,
});

function GalleryPage() {
  const items = galleryCategories.flatMap((c) =>
    c.available
      ? c.items.map((it) => ({
          src: it.src as string,
          alt: it.alt as string,
          position: it.position as string,
        }))
      : [],
  );
  const comingSoon = galleryCategories.filter((c) => !c.available);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Gallery"
          title="A closer look at"
          script="TiTAS"
          lede="Approved product and packaging imagery. Plant, facility and delivery photography will be added once supplied by the company."
          crumbs={[{ label: "Gallery" }]}
          image={heroImages.gallery}
        />

        <Section>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {items.map((item, i) => (
              <Reveal
                key={item.src}
                delay={(i % 6) * 60}
                className="group relative aspect-square overflow-hidden rounded-lg bg-surface-strong"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="block size-full cursor-zoom-in"
                  aria-label={`Expand image: ${item.alt}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    style={{ objectPosition: item.position }}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100">
                    <Expand className="size-6 text-ink-foreground" aria-hidden="true" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          {comingSoon.length > 0 && (
            <AnimatedList
              as="div"
              itemAs="div"
              className="mt-10 flex flex-wrap gap-2"
              itemClassName="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground"
              stagger={60}
            >
              {comingSoon.map((c) => (
                <>{c.label} — coming soon</>
              ))}
            </AnimatedList>
          )}
        </Section>
      </main>
      <Footer />

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {openIndex !== null ? items[openIndex]?.alt : "Gallery image"}
          </DialogTitle>
          {openIndex !== null && (
            <div className="relative">
              <img
                src={items[openIndex]?.src}
                alt={items[openIndex]?.alt}
                className="max-h-[80vh] w-full rounded-lg object-contain"
              />
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length))
                }
                className={cn(
                  "absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-ink shadow-lift backdrop-blur hover:bg-card",
                )}
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % items.length))}
                className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-ink shadow-lift backdrop-blur hover:bg-card"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
