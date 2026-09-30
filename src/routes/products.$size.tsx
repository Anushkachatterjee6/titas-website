import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle, ShoppingBag } from "lucide-react";
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
import { company, whatsappHref } from "@/data/company";

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
          <h1 className="font-display text-3xl text-ink">Product not found</h1>
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
        <Section>
          <Breadcrumbs
            items={[{ label: "Products", to: "/products" }, { label: product.size }]}
          />
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="flex items-center justify-center rounded-2xl bg-surface-strong p-10">
              <img
                src={product.image}
                alt={`${product.name} packaged drinking water`}
                className="h-72 w-auto object-contain drop-shadow-xl md:h-96"
              />
            </Reveal>
            <Reveal delay={100}>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                {product.size}
              </span>
              <h1 className="mt-4 text-3xl leading-tight font-semibold text-ink md:text-4xl">
                {product.name}
              </h1>
              <p className="script-accent mt-2 text-xl text-primary">{product.headline}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <ul className="mt-6 space-y-2">
                {product.bestFor.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink">
                    <Check className="size-4 text-aqua" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-lg border border-border bg-card p-5">
                <p className="text-lg font-semibold text-ink">
                  {formatPrice(product.pricePerUnit)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sold per {product.priceUnit}.
                </p>
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
                  <a href={`${whatsappHref}?text=${enquiryMessage}`} target="_blank" rel="noreferrer noopener">
                    <MessageCircle />
                    Enquire on WhatsApp
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section tone="surface">
          <NoticeBanner>{company.delivery.summary}</NoticeBanner>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-ink">Explore other pack sizes</h2>
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
      </main>
      <Footer />
    </>
  );
}
