import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Building2,
  Droplet,
  FlaskConical,
  Filter,
  Handshake,
  Heart,
  Layers,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Reveal } from "@/components/site/Reveal";
import { NoticeBanner } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { getProduct, products, formatPrice } from "@/data/products";
import { company, productInformation, productHighlights, whatsappHref } from "@/data/company";

const HIGHLIGHT_ICONS = [
  Droplet,
  Filter,
  FlaskConical,
  PackageCheck,
  ShieldCheck,
  Layers,
  Tag,
  Building2,
  Truck,
  Award,
  Heart,
  Handshake,
];

export const Route = createFileRoute("/products/$size")({
  head: ({ params }) => {
    const product = getProduct(params.size);
    const title = product ? `${product.name} | TiTAS` : "Product | TiTAS";
    const description = product
      ? `${product.name} — ${product.description}`
      : "TiTAS packaged drinking water.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { size } = Route.useParams();
  const product = getProduct(size);
  const { add } = useCart();

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="container-page py-24 text-center">
          <h1 className="font-display text-[2rem] font-bold text-ink md:text-[2.5rem]">
            Product not found
          </h1>
          <p className="mt-4 text-muted-foreground">
            We couldn't find that pack size. Browse our full range instead.
          </p>
          <Button asChild variant="brand" size="xl" className="mt-8">
            <Link to="/products">
              View All Products <ArrowRight />
            </Link>
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  const enquiryMessage = encodeURIComponent(
    `Hi TiTAS, I'd like to enquire about the ${product.name} pack (${product.priceUnit}).`,
  );

  return (
    <>
      <Navbar />
      <main>
        <Section className="pb-8 md:pb-10">
          <Breadcrumbs items={[{ label: "Products", to: "/products" }, { label: product.size }]} />
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
            <Reveal
              direction="left"
              distance={100}
              durationMs={400}
              easing="ease"
              replay
              className="flex items-center justify-center rounded-2xl bg-surface-strong p-10"
            >
              <img
                src={product.image}
                alt={`${product.name} packaged drinking water`}
                className="h-72 w-auto object-contain drop-shadow-xl md:h-96"
              />
            </Reveal>
            <Reveal direction="right" distance={100} durationMs={400} easing="ease" replay>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                {product.size}
              </span>
              <h1 className="mt-4 text-[2rem] leading-tight font-bold text-ink md:text-[2.5rem]">
                {product.name}
              </h1>
              <p className="script-accent mt-2 text-xl text-primary">{product.headline}</p>

              <div className="mt-8 rounded-lg border border-border bg-card p-5">
                <p className="text-lg font-semibold text-ink">
                  {formatPrice(product.pricePerUnit)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Sold per {product.priceUnit}.</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="brand"
                  size="xl"
                  onClick={() => {
                    add(product.slug, 1);
                    toast.success(`${product.name} added to cart`);
                  }}
                >
                  <ShoppingBag />
                  Add to Cart
                </Button>
                <Button asChild variant="quiet" size="xl">
                  <a
                    href={`${whatsappHref}?text=${enquiryMessage}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <MessageCircle />
                    Enquire on WhatsApp
                  </a>
                </Button>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <Button asChild variant="brand" size="xl" className="w-full sm:w-auto">
                  <Link to="/dealer-distributor">
                    <Handshake />
                    Become a Distributor
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section>
          <NoticeBanner>{company.delivery.summary}</NoticeBanner>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-ink">
              Explore other pack sizes
            </h2>
            <Button asChild variant="quiet" size="lg">
              <Link to="/products">
                View All Products <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {products
              .filter((p) => p.slug !== product.slug)
              .map((p) => (
                <Link
                  key={p.slug}
                  to="/products/$size"
                  params={{ size: p.slug }}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-aqua/60 hover:text-primary"
                >
                  {p.size}
                </Link>
              ))}
          </div>
        </Section>

        <Section tone="surface" className="pt-8 md:pt-10">
          <div className="mx-auto max-w-3xl">
            <Reveal className="rounded-lg border border-border bg-card p-6">
              <p className="eyebrow text-aqua">Product Information</p>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Brand
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-ink">
                    {productInformation.brand}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Company
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-ink">
                    {productInformation.company}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Established
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-ink">
                    {productInformation.established}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Product Type
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-ink">
                    {productInformation.productType}
                  </dd>
                </div>
              </dl>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {productHighlights.map((item, i) => {
                const Icon = HIGHLIGHT_ICONS[i]!;
                return (
                  <Reveal
                    key={item.title}
                    as="article"
                    direction="up"
                    delay={Math.min(i * 50, 300)}
                    className="rounded-lg border border-border bg-card p-5"
                  >
                    <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </Reveal>
                );
              })}
            </div>

            <Reveal direction="up" className="mt-12 text-center">
              <p className="script-accent text-2xl text-primary">
                {company.brand} — {company.tagline}
              </p>
              <p className="mt-2 text-base font-semibold text-ink">{company.supportingLine}</p>
              <p className="mt-1 text-sm text-muted-foreground">Reliable Since {company.since}</p>
            </Reveal>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
