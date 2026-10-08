import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Home,
  Mail,
  MessageCircle,
  Phone,
  ShoppingCart,
  Truck,
  Expand,
} from "lucide-react";
import bottleImpactVideo from "@/assets/titas/motion/bottle-impact.mp4";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import {
  WaveDivider,
  FlowingPath,
  Droplets,
  GlowArch,
  FluidWaves,
  RoutePath,
} from "@/components/site/WaterMotion";
import {
  WaterJourneyVisual,
  ServicesNetworkVisual,
  OrderingFlowVisual,
} from "@/components/site/MotionAssets";
import { FAQAccordion } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { products, formatPrice, type Product } from "@/data/products";
import { whyTitas } from "@/data/services";
import { faqs } from "@/data/faqs";
import { brandImages, galleryCategories, heroSlides } from "@/data/images";
import { company, mailHref, telHref, whatsappHref } from "@/data/company";

const title = "TiTAS Packaged Drinking Water — Ekti Jaler Naam";
const description =
  "TiTAS packaged drinking water by SUJIT AQUA ENTERPRISE. Banglar Jal, Banglar Bharsha — reliable since 1999, in 500 ml, 1 L, 2 L, 5 L and 20 L packs.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSlideshow />
        <BrandIntro />
        <JourneySection />
        <ProductShowcase />
        <OrderTitasSection />
        <WhyTitas />
        <ServicesPreview />
        <QualityPreview />
        <GalleryPreview />
        <FinalCta />
        <FaqPreview />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}

function BrandIntro() {
  return (
    <Section className="relative overflow-hidden py-14 md:py-20">
      {/* Kept left, well clear of the video column on the right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-0 hidden select-none font-display text-[9rem] leading-none font-bold text-primary/[0.05] md:-top-16 md:block md:text-[16rem]"
      >
        {company.since}
      </span>
      <Droplets count={4} className="hidden lg:block" />
      <div className="relative grid items-center gap-12 lg:grid-cols-[auto_1.15fr_1fr] lg:gap-14">
        {/* Left: the actual TiTAS mark */}
        <Reveal className="flex flex-col items-center gap-2.5 lg:items-start">
          <img
            src={brandImages.mark}
            alt="TiTAS logo"
            className="w-16 rounded-full md:w-20"
            loading="lazy"
          />
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">
            Since {company.since}
          </span>
        </Reveal>

        {/* Centre: approved brand copy, unchanged */}
        <div className="text-center lg:text-left">
          <SectionHeading
            eyebrow={`${company.legalName} · ${company.sinceLine}`}
            title={company.brand}
            titleBrand
            script={company.tagline}
            lede={company.intro}
            className="mx-auto lg:mx-0"
          />
          <Reveal delay={200} className="mt-3">
            <p className="script-accent text-2xl text-primary">{company.supportingLine}</p>
          </Reveal>
          <Reveal delay={320} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            <Button asChild variant="brand" size="xl">
              <Link to="/about">
                Discover TiTAS <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* Right: cinematic bottle-impact moment — feathered so it reads as
            the bottle floating in the page, not a video box */}
        <Reveal delay={150} className="flex justify-center lg:justify-self-end">
          <video
            src={bottleImpactVideo}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="h-auto w-full max-w-[15rem] object-contain md:max-w-xs"
            style={{
              maskImage:
                "radial-gradient(ellipse 78% 82% at 50% 48%, black 58%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 78% 82% at 50% 48%, black 58%, transparent 100%)",
            }}
          />
        </Reveal>
      </div>
    </Section>
  );
}

function JourneySection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <WaveDivider className="absolute inset-x-0 top-0 -translate-y-full text-background" />
      <div className="container-page relative">
        <SectionHeading
          align="center"
          eyebrow="Our Story in Motion"
          title="Every Drop Has"
          titleHref="/journey"
          script="a Journey"
          lede="From source to your doorstep, every TiTAS pack follows the same careful path."
          className="mx-auto"
        />
        <WaterJourneyVisual />
        <Reveal delay={100} className="mt-10 flex justify-center">
          <Button asChild variant="quiet" size="lg">
            <Link to="/journey">
              Click Here <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function ProductStage({
  product,
  active,
}: {
  product: Product;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (reducedMotion || e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--ry", `${px * 12}deg`);
        el.style.setProperty("--rx", `${py * -12}deg`);
        el.style.setProperty("--shadow-x", `${px * -20}px`);
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--shadow-x", "0px");
      }}
      className={cn(
        "relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-surface-strong [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-300 ease-out",
        !active && "hidden",
      )}
    >
      <GlowArch />
      <span
        aria-hidden="true"
        className="absolute inset-x-8 bottom-8 h-1/2 rounded-full bg-aqua/20 blur-2xl [transform:translateX(var(--shadow-x,0px))] transition-transform duration-300 ease-out"
      />
      <img
        key={product.slug}
        src={product.image}
        alt={`${product.name} packaged drinking water`}
        loading="lazy"
        className="animate-in fade-in zoom-in-95 duration-500 animate-float-slow relative h-[82%] w-auto object-contain drop-shadow-xl"
      />
    </div>
  );
}

function ProductShowcase() {
  const [active, setActive] = useState(products[0]!.slug);
  const activeProduct = products.find((p) => p.slug === active) ?? products[0]!;

  return (
    <Section tone="surface">
      <SectionHeading
        align="center"
        eyebrow="Our Range"
        title="One trusted name,"
        script="five pack sizes"
        lede="From a bottle on the go to regular 20 L supply — choose the TiTAS pack that fits your need."
        className="mx-auto"
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="order-2 flex flex-col items-center lg:order-1">
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Product size">
            {products.map((p) => (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={p.slug === active}
                onClick={() => setActive(p.slug)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                  p.slug === active
                    ? "border-primary bg-primary text-primary-foreground shadow-lift"
                    : "border-border bg-card text-ink hover:border-aqua/60",
                )}
              >
                {p.size}
              </button>
            ))}
          </div>

          <div key={activeProduct.slug} className="animate-in fade-in slide-in-from-bottom-2 mt-8 max-w-md text-center duration-400 lg:text-left">
            <h3 className="text-2xl font-semibold text-ink">{activeProduct.name}</h3>
            <p className="script-accent mt-1 text-lg text-primary">{activeProduct.headline}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {activeProduct.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <p className="text-lg font-semibold text-ink">
                {formatPrice(activeProduct.pricePerUnit)}
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  per {activeProduct.priceUnit}
                </span>
              </p>
              <Link
                to="/products/$size"
                params={{ size: activeProduct.slug }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
              >
                View Product <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="order-1 flex justify-center lg:order-2">
          {products.map((p) => (
            <ProductStage key={p.slug} product={p} active={p.slug === active} />
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

function OrderTitasSection() {
  return (
    <Section tone="aqua" className="overflow-hidden">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
        <SectionHeading
          eyebrow="Order TiTAS"
          title="From tap to"
          script="your doorstep"
          lede="Pick a pack, confirm your order and TiTAS takes care of the rest — the same simple flow whether you order online or over WhatsApp."
        />

        <Reveal delay={100}>
          <OrderingFlowVisual />
        </Reveal>
      </div>
    </Section>
  );
}

function WhyTitas() {
  return (
    <Section className="relative overflow-hidden">
      <SectionHeading
        align="center"
        eyebrow="Why TiTAS"
        eyebrowClassName="text-[0.8rem] font-extrabold tracking-[0.22em]"
        title="Built on trust,"
        script="drop by drop"
        lede={`Serving homes, businesses and institutions since ${company.since}.`}
        className="mx-auto"
      />
      <div className="relative mx-auto mt-16 max-w-3xl">
        <FlowingPath
          vertical
          className="absolute top-0 bottom-0 left-1/2 hidden h-full w-6 -translate-x-1/2 sm:block"
        />
        <ol className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {whyTitas.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={(i % 2) * 90}
              className={cn(
                "relative border-t border-border pt-6",
                i % 2 === 0 ? "sm:pr-6 sm:text-right" : "sm:pl-6 sm:translate-y-10",
              )}
            >
              <span className="eyebrow text-aqua">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function ServicesPreview() {
  return (
    <Section tone="aqua">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Services"
          title="Supply for every"
          script="requirement"
          lede="From a single household to dealers and distributors, TiTAS supplies to suit how you need water."
        />
        <Button asChild variant="brand" size="xl" className="self-start md:self-auto">
          <Link to="/services">
            Explore Our Services <ArrowRight />
          </Link>
        </Button>
      </div>

      {/* The real TiTAS services network artwork — radial on desktop,
          recomposed as a vertical flowing chain on mobile (handled inside). */}
      <ServicesNetworkVisual />
    </Section>
  );
}

function QualityPreview() {
  return (
    <section className="surface-deep relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-24 size-[30rem] rounded-full bg-aqua/15 blur-3xl"
      />
      <FluidWaves className="opacity-60" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2">
        <SectionHeading
          tone="inverse"
          eyebrow="Quality & Purification"
          title="From Source"
          script="to Seal"
          lede="A careful, quality-focused process carries every TiTAS pack from raw water to the sealed bottle in your hands."
        />
        <Reveal delay={120} className="flex lg:justify-end">
          <Button asChild variant="aqua" size="xl">
            <Link to="/quality">
              Explore Our Quality <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function GalleryPreview() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const items = galleryCategories.flatMap((c) =>
    c.available
      ? c.items.map((it) => ({ src: it.src as string, alt: it.alt as string, position: it.position as string }))
      : [],
  );

  return (
    <Section tone="surface">
      <SectionHeading
        align="center"
        eyebrow="Gallery"
        title="A closer look at"
        script="TiTAS"
        className="mx-auto"
      />
      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {items.map((item, i) => (
          <Reveal
            key={item.src}
            delay={(i % 6) * 60}
            className={cn(
              "group relative overflow-hidden rounded-lg bg-surface-strong",
              i === 0 && "col-span-2 row-span-2 sm:col-span-1 sm:row-span-2",
            )}
          >
            <button
              type="button"
              onClick={() => setLightbox(item)}
              className="block size-full cursor-zoom-in"
              aria-label={`Expand image: ${item.alt}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                style={{ objectPosition: item.position }}
                className={cn(
                  "size-full object-cover transition-transform duration-700 group-hover:scale-105",
                  i === 0 ? "aspect-[3/4] sm:aspect-auto sm:h-full" : "aspect-square",
                )}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100">
                <Expand className="size-6 text-ink-foreground" aria-hidden="true" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{lightbox?.alt}</DialogTitle>
          {lightbox && (
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}

const deliveryPoints = [
  { icon: ShoppingCart, label: "Order Online" },
  { icon: Home, label: "Home & Family Supply" },
  { icon: Building2, label: "Office & Institutional Supply" },
  { icon: Truck, label: "Reliable Delivery" },
];

function FinalCta() {
  const doorstep = heroSlides.find((s) => s.id === "doorstep");
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Section>
      <Reveal className="relative overflow-hidden rounded-2xl border border-border bg-accent/40">
        <Droplets count={3} className="hidden md:block" />

        {doorstep && (
          <div className="relative aspect-[21/9] w-full overflow-hidden">
            <img
              src={doorstep.src}
              alt={doorstep.alt}
              loading="lazy"
              className="size-full object-cover object-center"
            />
          </div>
        )}

        <div className="relative grid items-center gap-10 p-8 md:p-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow mb-4 text-aqua">Delivery</p>
            <h2 className="text-3xl leading-tight font-semibold text-ink md:text-[2.7rem]">
              Pure Water.{" "}
              <span className="script-accent font-normal text-primary">Delivered.</span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="xl">
                <Link to="/products">
                  Order Now <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="quiet" size="xl">
                <Link to="/contact">Contact TiTAS</Link>
              </Button>
            </div>
            <div className="mt-8 max-w-xs">
              <RoutePath reducedMotion={reducedMotion} />
              <div className="mt-1 flex justify-between text-[0.68rem] font-medium tracking-wide text-muted-foreground uppercase">
                <span>TiTAS</span>
                <span>Your door</span>
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-4">
            {deliveryPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="rounded-lg bg-card p-5">
                <Icon className="size-6 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

function FaqPreview() {
  return (
    <Section tone="surface" className="py-14 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading eyebrow="FAQs" title="Common" script="questions" />
          <Reveal delay={100} className="mt-8">
            <Button asChild variant="quiet" size="xl">
              <Link to="/faqs">
                View All FAQs <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <FAQAccordion items={faqs.slice(0, 4)} />
        </Reveal>
      </div>
    </Section>
  );
}

function ContactCta() {
  const topics = ["Orders", "Bulk enquiries", "Dealer / distributor enquiries", "Regular supply requirements"];
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk"
            script="water"
            lede="Get in touch with TiTAS for:"
          />
          <ul className="mt-5 flex flex-wrap gap-2">
            {topics.map((t) => (
              <li key={t} className="rounded-full border border-border px-4 py-1.5 text-sm text-ink">
                {t}
              </li>
            ))}
          </ul>
          <Button asChild variant="brand" size="xl" className="mt-8">
            <Link to="/contact">
              Contact Us <ArrowRight />
            </Link>
          </Button>
        </div>
        <Reveal delay={120} className="grid gap-3 self-start">
          <ContactRow icon={Phone} label="Call" value={`+91 ${company.phone}`} href={telHref} />
          <ContactRow icon={MessageCircle} label="WhatsApp" value={`+91 ${company.whatsapp}`} href={whatsappHref} />
          <ContactRow icon={Mail} label="Email" value={company.email} href={mailHref} />
          <p className="px-1 text-xs text-muted-foreground">
            {company.hours.weekdays} · {company.hours.closed}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-aqua/60"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block font-semibold text-ink">{value}</span>
      </span>
    </a>
  );
}
