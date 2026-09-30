import { createFileRoute } from "@tanstack/react-router";
import { LogOut, MapPin, Package, User } from "lucide-react";
import { RequireAuth } from "@/components/site/RequireAuth";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useAddresses, useOrders, useProfile, type Order } from "@/lib/account";
import { formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

const title = "My Account | TiTAS";
const description = "Manage your TiTAS profile, delivery addresses and orders.";

export const Route = createFileRoute("/account")({
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
  component: () => (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  ),
});

function AccountPage() {
  const { user, signOut } = useAuth();
  const profile = useProfile();
  const addresses = useAddresses();
  const orders = useOrders();

  return (
    <>
      <Navbar />
      <main>
        <Section className="py-16 md:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="My Account"
              title="Welcome back,"
              script={profile.data?.full_name?.split(" ")[0] || "friend"}
            />
            <Button variant="quiet" size="lg" onClick={() => signOut()}>
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </Button>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <Reveal as="article" className="rounded-lg border border-border bg-card p-6">
              <SectionCardHeading icon={User} title="Profile Details" />
              {profile.isLoading ? (
                <LoadingLine />
              ) : profile.isError ? (
                <ErrorLine />
              ) : (
                <dl className="mt-5 grid gap-3 text-sm">
                  <Row label="Full name" value={profile.data?.full_name || "—"} />
                  <Row label="Email" value={profile.data?.email || user?.email || "—"} />
                  <Row label="Mobile number" value={profile.data?.phone || "—"} />
                </dl>
              )}
            </Reveal>

            <Reveal as="article" delay={70} className="rounded-lg border border-border bg-card p-6">
              <SectionCardHeading icon={User} title="Account Information" />
              <dl className="mt-5 grid gap-3 text-sm">
                <Row label="Account email" value={user?.email || "—"} />
                <Row
                  label="Member since"
                  value={
                    user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"
                  }
                />
              </dl>
            </Reveal>
          </div>

          <Reveal as="article" delay={140} className="mt-8 rounded-lg border border-border bg-card p-6">
            <SectionCardHeading icon={MapPin} title="Delivery Addresses" />
            {addresses.isLoading ? (
              <LoadingLine />
            ) : addresses.isError ? (
              <ErrorLine />
            ) : addresses.data && addresses.data.length > 0 ? (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {addresses.data.map((addr) => (
                  <li key={addr.id} className="rounded-md border border-border p-4 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-ink">{addr.full_name || "Delivery address"}</p>
                      {addr.is_default && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-muted-foreground">
                      {addr.address_line}, {addr.city}, {addr.state} {addr.pincode}
                    </p>
                    {addr.phone && <p className="mt-1 text-muted-foreground">{addr.phone}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyLine>No saved delivery addresses yet.</EmptyLine>
            )}
          </Reveal>

          <Reveal as="article" delay={210} className="mt-8 rounded-lg border border-border bg-card p-6">
            <SectionCardHeading icon={Package} title="My Orders" />
            {orders.isLoading ? (
              <LoadingLine />
            ) : orders.isError ? (
              <ErrorLine />
            ) : orders.data && orders.data.length > 0 ? (
              <ul className="mt-5 grid gap-4">
                {orders.data.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </ul>
            ) : (
              <EmptyLine>No orders yet — once you place an order, it'll show up here.</EmptyLine>
            )}
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function SectionCardHeading({ icon: Icon, title }: { icon: typeof User; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function LoadingLine() {
  return <p className="mt-5 text-sm text-muted-foreground">Loading…</p>;
}

function ErrorLine() {
  return (
    <p className="mt-5 text-sm text-destructive">
      Couldn't load this right now. Please refresh the page.
    </p>
  );
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 text-sm text-muted-foreground">{children}</p>;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-accent text-primary",
  confirmed: "bg-accent text-primary",
  delivered: "bg-aqua/20 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

function OrderRow({ order }: { order: Order }) {
  const statusClass = STATUS_STYLES[order.status?.toLowerCase()] || "bg-accent text-primary";
  return (
    <li className="rounded-md border border-border p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-ink">Order #{order.order_number}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-1 text-[0.7rem] font-semibold capitalize", statusClass)}>
            {order.status}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-[0.7rem] font-semibold text-muted-foreground capitalize">
            {order.payment_status}
          </span>
        </div>
      </div>

      {order.order_items && order.order_items.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-border/70 pt-3">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>{formatPrice(item.total_price)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3">
        <span className="text-xs text-muted-foreground">Total</span>
        <span className="font-semibold text-ink">{formatPrice(order.total_amount)}</span>
      </div>
    </li>
  );
}
