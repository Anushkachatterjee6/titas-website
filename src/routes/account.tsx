import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LogOut, MapPin, Package, Pencil, Plus, Trash2, User, X } from "lucide-react";
import { RequireAuth } from "@/components/site/RequireAuth";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import {
  useAddresses,
  useOrders,
  useProfile,
  useUpdateProfile,
  useUpdateAccountEmail,
  useUpsertAddress,
  useDeleteAddress,
  type Order,
  type Address,
  type AddressInput,
} from "@/lib/account";
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
                <ProfileEditor
                  fullName={profile.data?.full_name || ""}
                  phone={profile.data?.phone || ""}
                  email={user?.email || profile.data?.email || ""}
                />
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
            ) : (
              <AddressManager addresses={addresses.data || []} />
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

/** Profile Details card — read-only display that switches into an editable
 *  form. Name/phone save straight to `profiles`; the email field goes
 *  through Supabase Auth's own email-change flow, which requires the
 *  visitor to confirm the new address before it actually takes effect —
 *  so a successful submit here shows a "check your inbox" message rather
 *  than pretending the email already changed. */
function ProfileEditor({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [emailValue, setEmailValue] = useState(email);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const updateProfile = useUpdateProfile();
  const updateEmail = useUpdateAccountEmail();
  const saving = updateProfile.isPending || updateEmail.isPending;

  const startEditing = () => {
    setName(fullName);
    setPhoneValue(phone);
    setEmailValue(email);
    setStatus(null);
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await updateProfile.mutateAsync({ full_name: name.trim(), phone: phoneValue.trim() });

      const trimmedEmail = emailValue.trim();
      if (trimmedEmail && trimmedEmail !== email) {
        await updateEmail.mutateAsync(trimmedEmail);
        setStatus({
          type: "success",
          text: `Profile updated. A confirmation link was sent to ${trimmedEmail} — your sign-in email will update once you confirm it.`,
        });
      } else {
        setStatus({ type: "success", text: "Profile updated." });
      }
      setEditing(false);
    } catch (err) {
      setStatus({
        type: "error",
        text: err instanceof Error ? err.message : "Couldn't save your changes. Please try again.",
      });
    }
  };

  if (!editing) {
    return (
      <>
        <dl className="mt-5 grid gap-3 text-sm">
          <Row label="Full name" value={fullName || "—"} />
          <Row label="Email" value={email || "—"} />
          <Row label="Mobile number" value={phone || "—"} />
        </dl>
        {status && (
          <p className={cn("mt-4 text-xs", status.type === "error" ? "text-destructive" : "text-primary")}>
            {status.text}
          </p>
        )}
        <Button variant="quiet" size="sm" className="mt-5" onClick={startEditing}>
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit profile
        </Button>
      </>
    );
  }

  return (
    <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-1.5">
        <Label htmlFor="profile-name">Full name</Label>
        <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="profile-email">Email</Label>
        <Input
          id="profile-email"
          type="email"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Changing this sends a confirmation link to the new address before it takes effect.
        </p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="profile-phone">Mobile number</Label>
        <Input
          id="profile-phone"
          type="tel"
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.target.value)}
        />
      </div>
      {status?.type === "error" && <p className="text-xs text-destructive">{status.text}</p>}
      <div className="flex gap-2">
        <Button type="submit" variant="brand" size="sm" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="quiet" size="sm" onClick={() => setEditing(false)} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

const emptyAddressForm: AddressInput = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};

/** Delivery Addresses card — lists saved addresses with per-item Edit/
 *  Delete, plus an "Add address" form. Existing checkout/cart code can
 *  already read from the same `addresses` table this writes to. */
function AddressManager({ addresses }: { addresses: Address[] }) {
  const [formFor, setFormFor] = useState<"new" | string | null>(null);
  const upsertAddress = useUpsertAddress();
  const deleteAddress = useDeleteAddress();

  if (formFor !== null) {
    const editing = formFor !== "new" ? addresses.find((a) => a.id === formFor) : undefined;
    return (
      <AddressForm
        initial={
          editing
            ? {
                id: editing.id,
                full_name: editing.full_name || "",
                phone: editing.phone || "",
                address_line: editing.address_line,
                city: editing.city,
                state: editing.state,
                pincode: editing.pincode,
                is_default: editing.is_default,
              }
            : emptyAddressForm
        }
        saving={upsertAddress.isPending}
        onCancel={() => setFormFor(null)}
        onSubmit={async (input) => {
          await upsertAddress.mutateAsync(input);
          setFormFor(null);
        }}
      />
    );
  }

  return (
    <>
      {addresses.length > 0 ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
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
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormFor(addr.id)}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Pencil className="size-3" aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteAddress.mutate(addr.id)}
                  disabled={deleteAddress.isPending}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyLine>No saved delivery addresses yet.</EmptyLine>
      )}
      <Button variant="quiet" size="sm" className="mt-5" onClick={() => setFormFor("new")}>
        <Plus className="size-3.5" aria-hidden="true" />
        Add address
      </Button>
    </>
  );
}

function AddressForm({
  initial,
  saving,
  onCancel,
  onSubmit,
}: {
  initial: AddressInput;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (input: AddressInput) => Promise<void>;
}) {
  const [form, setForm] = useState<AddressInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof AddressInput>(key: K, value: AddressInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save this address. Please try again.");
    }
  };

  return (
    <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">
          {initial.id ? "Edit address" : "New address"}
        </p>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="text-muted-foreground hover:text-ink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="addr-name">Recipient name</Label>
          <Input id="addr-name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="addr-phone">Phone</Label>
          <Input id="addr-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="addr-line">Address</Label>
        <Input
          id="addr-line"
          value={form.address_line}
          onChange={(e) => set("address_line", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="addr-city">City</Label>
          <Input id="addr-city" value={form.city} onChange={(e) => set("city", e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="addr-state">State</Label>
          <Input id="addr-state" value={form.state} onChange={(e) => set("state", e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="addr-pincode">PIN code</Label>
          <Input
            id="addr-pincode"
            value={form.pincode}
            onChange={(e) => set("pincode", e.target.value)}
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <Checkbox
          checked={!!form.is_default}
          onCheckedChange={(checked) => set("is_default", checked === true)}
        />
        Set as default address
      </label>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="brand" size="sm" disabled={saving}>
          {saving ? "Saving…" : "Save address"}
        </Button>
        <Button type="button" variant="quiet" size="sm" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
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
