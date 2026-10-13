import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { Reveal } from "./Reveal";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <Reveal
      as="article"
      direction="up"
      distance={100}
      durationMs={500}
      easing="ease"
      replay
      className="group h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-aqua/60 hover:shadow-float">
        <Link
          to="/products/$size"
          params={{ size: product.slug }}
          className="relative flex h-56 items-center justify-center overflow-hidden bg-surface-strong"
          aria-label={`View ${product.name}`}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-aqua/18 to-transparent"
          />
          <img
            src={product.image}
            alt={`${product.name} packaged drinking water bottle`}
            loading="lazy"
            className="relative h-44 w-auto object-contain transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 rounded-full bg-card/85 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-ink">
            {product.size}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
          <p className="script-accent mt-1 text-lg text-primary">{product.headline}</p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6 flex items-end justify-between gap-3 border-t border-border pt-5">
            <div>
              <p className="text-lg font-semibold text-ink">{formatPrice(product.pricePerUnit)}</p>
              <p className="text-[0.7rem] text-muted-foreground">per {product.priceUnit}</p>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="quiet"
                size="icon"
                aria-label={`Add ${product.name} to cart`}
                onClick={() => {
                  add(product.slug, 1);
                  toast.success(`${product.name} added to cart`);
                }}
              >
                <ShoppingBag />
              </Button>
              <Button asChild variant="brand" size="sm">
                <Link
                  to="/products/$size"
                  params={{ size: product.slug }}
                  aria-label={`View ${product.name} details`}
                >
                  For Details
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
