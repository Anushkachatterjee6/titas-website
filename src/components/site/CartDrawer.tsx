import { Link } from "@tanstack/react-router";
import { Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityInput } from "./QuantityInput";
import { useCart } from "@/lib/cart";
import { company } from "@/data/company";
import { formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, setQty, remove, count } = useCart();

  return (
    <div
      className={cn("fixed inset-0 z-[60]", isOpen ? "" : "pointer-events-none")}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={cn(
          "absolute inset-0 bg-ink/50 transition-opacity duration-400",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        aria-label="Shopping cart"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-float transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-ink">Your Cart</h2>
            <p className="text-xs text-muted-foreground">
              {count} item{count === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex size-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-accent"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </span>
            <p className="text-sm text-muted-foreground">
              Your cart is empty. Choose a TiTAS pack size to get started.
            </p>
            <Button asChild variant="brand" size="lg" onClick={closeCart}>
              <Link to="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map(({ product, qty, lineTotal }) => (
                <li key={product.slug} className="flex gap-4 py-5">
                  <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md bg-surface-strong">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(product.pricePerUnit)} / {product.priceUnit}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityInput
                        qty={qty}
                        label={product.name}
                        onChange={(next) => setQty(product.slug, next)}
                      />
                      <span className="text-sm font-semibold text-ink">
                        {formatPrice(lineTotal)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        aria-label={`Remove ${product.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-border px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-semibold text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Delivery is calculated separately. {company.delivery.summary}
              </p>
              <div className="mt-5 grid gap-2">
                <Button asChild variant="brand" size="xl" onClick={closeCart}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="quiet" onClick={closeCart}>
                  <Link to="/products">
                    <Plus className="size-4" aria-hidden="true" />
                    Add New Product
                  </Link>
                </Button>
                <Button asChild variant="quiet" onClick={closeCart}>
                  <Link to="/cart">View full cart</Link>
                </Button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
