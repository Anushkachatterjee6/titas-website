import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/site/RequireAuth";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | TiTAS" },
      { name: "description", content: "Checkout — TiTAS packaged drinking water by SUJIT AQUA ENTERPRISE." },
      { property: "og:title", content: "Checkout | TiTAS" },
      { property: "og:description", content: "Checkout — TiTAS packaged drinking water." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
});

function CheckoutPage() {
  const { items, subtotal } = useCart();

  return (
    <>
      <Navbar />
      <main>
        <Section className="py-24">
          <h1 className="font-display text-[2rem] font-bold text-ink md:text-[2.5rem]">Checkout</h1>
          <p className="mt-4 text-muted-foreground">
            You're logged in — delivery address, order review and payment are coming in the next
            milestone.
          </p>

          {items.length > 0 ? (
            <div className="mt-8 max-w-md rounded-lg border border-border bg-card p-5">
              <p className="text-sm font-semibold text-ink">Your cart, ready to go</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {items.map(({ product, qty, lineTotal }) => (
                  <li key={product.slug} className="flex items-center justify-between">
                    <span>
                      {product.name} × {qty}
                    </span>
                    <span className="text-ink">{formatPrice(lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-semibold text-ink">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">Your cart is empty.</p>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
