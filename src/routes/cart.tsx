import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Droplet, Plus, Trash2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Reveal } from "@/components/site/Reveal";
import { QuantityInput } from "@/components/site/QuantityInput";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart | TiTAS" },
      { name: "description", content: "Cart — TiTAS packaged drinking water by SUJIT AQUA ENTERPRISE." },
      { property: "og:title", content: "Cart | TiTAS" },
      { property: "og:description", content: "Cart — TiTAS packaged drinking water." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main>
        <Section className="py-16 md:py-20">
          <Breadcrumbs items={[{ label: "Cart" }]} />

          <Reveal className="mt-6">
            <h1 className="text-[2rem] leading-tight font-bold text-ink md:text-[2.5rem]">Your Cart</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Review your selected TiTAS products before checkout.
            </p>
          </Reveal>

          {items.length === 0 ? (
            <Reveal delay={80} className="mt-14 flex flex-col items-center gap-5 py-10 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
                <Droplet className="size-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-semibold text-ink">Your cart is empty</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Add your TiTAS essentials and they'll appear here.
                </p>
              </div>
              <Button asChild variant="brand" size="xl">
                <Link to="/products">
                  Explore Products <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
              {/* Cart items */}
              <Reveal>
                <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
                  {items.map(({ product, qty, lineTotal }) => (
                    <li
                      key={product.slug}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6"
                    >
                      <div className="flex items-center gap-4 sm:flex-1">
                        <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-strong">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(product.pricePerUnit)} / {product.priceUnit}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                        <QuantityInput
                          qty={qty}
                          label={product.name}
                          onChange={(next) => setQty(product.slug, next)}
                        />

                        <span className="w-20 text-right text-sm font-semibold text-ink">
                          {formatPrice(lineTotal)}
                        </span>

                        <button
                          type="button"
                          onClick={() => remove(product.slug)}
                          aria-label={`Remove ${product.name} from cart`}
                          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <Button asChild variant="quiet">
                    <Link to="/products">
                      <Plus className="size-4" aria-hidden="true" />
                      Add New Product
                    </Link>
                  </Button>
                  <button
                    type="button"
                    onClick={clear}
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline"
                  >
                    Empty cart
                  </button>
                </div>
              </Reveal>

              {/* Order summary */}
              <Reveal delay={100}>
                <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-ink">Order Summary</h2>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Delivery</dt>
                      <dd className="text-ink">Calculated at checkout</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                    <span className="text-sm font-semibold text-ink">Total</span>
                    <span className="text-xl font-semibold text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Delivery charges calculated based on location and order details.
                  </p>

                  <div className="mt-6 grid gap-2.5">
                    <Button asChild variant="brand" size="xl">
                      {user ? (
                        <Link to="/checkout">Proceed to Checkout</Link>
                      ) : (
                        <Link to="/login" search={{ redirect: "/checkout" }}>
                          Proceed to Checkout
                        </Link>
                      )}
                    </Button>
                    <Button asChild variant="quiet" size="lg">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
