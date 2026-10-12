import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, LogOut, MapPin, Package, Pencil, User } from "lucide-react";
import { RequireAuth } from "@/components/site/RequireAuth";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import {
  useOrders,
  useProfile,
  useUpdateProfile,
  useUpdateAccountEmail,
  useUpdatePermanentAddress,
  useUploadAvatar,
  usePrimaryAddress,
  useSaveDeliveryAddress,
  type Order,
  type Profile,
  type Address,
  type PermanentAddressInput,
  type DeliveryAddressInput,
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
  const primaryAddress = usePrimaryAddress();
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
                <>
                  <AvatarUploader avatarUrl={profile.data?.avatar_url || null} />
                  <div className="mt-6 border-t border-border/70 pt-6">
                    <ProfileEditor
                      fullName={profile.data?.full_name || ""}
                      phone={profile.data?.phone || ""}
                      email={user?.email || profile.data?.email || ""}
                    />
                  </div>
                  <div className="mt-6 border-t border-border/70 pt-6">
                    <PermanentAddressEditor profile={profile.data ?? null} />
                  </div>
                </>
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

          <Reveal
            as="article"
            delay={140}
            className="mt-8 rounded-lg border border-border bg-card p-6"
          >
            <SectionCardHeading icon={MapPin} title="Delivery Address" />
            {primaryAddress.isLoading ? (
              <LoadingLine />
            ) : primaryAddress.isError ? (
              <ErrorLine />
            ) : (
              <DeliveryAddressEditor address={primaryAddress.data ?? null} />
            )}
          </Reveal>

          <Reveal
            as="article"
            delay={210}
            className="mt-8 rounded-lg border border-border bg-card p-6"
          >
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
          <p
            className={cn(
              "mt-4 text-xs",
              status.type === "error" ? "text-destructive" : "text-primary",
            )}
          >
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
        <Button
          type="button"
          variant="quiet"
          size="sm"
          onClick={() => setEditing(false)}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

/** Profile picture — shows the existing avatar (or a default placeholder),
 *  with a small camera-badge button that opens the file picker. Validates
 *  type/size client-side (the storage bucket enforces both again
 *  server-side — see the migration file), shows a local preview the moment
 *  a file is chosen, and uploads immediately; `avatar_url` is what makes
 *  the picture persist across logout/login, since it's read back from
 *  `profiles` on every load. */
function AvatarUploader({ avatarUrl }: { avatarUrl: string | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadAvatar = useUploadAvatar();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    uploadAvatar.mutate(file, {
      onError: (err) => {
        setError(
          err instanceof Error ? err.message : "Couldn't upload this image. Please try again.",
        );
        setPreview(null);
        URL.revokeObjectURL(objectUrl);
      },
      onSuccess: () => {
        URL.revokeObjectURL(objectUrl);
        setPreview(null);
      },
    });
  };

  const shownSrc = preview || avatarUrl;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <span className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-accent text-primary">
          {shownSrc ? (
            <img src={shownSrc} alt="Profile picture" className="size-full object-cover" />
          ) : (
            <User className="size-7" aria-hidden="true" />
          )}
        </span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadAvatar.isPending}
          aria-label="Change profile picture"
          className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-colors hover:bg-ink disabled:opacity-60"
        >
          <Camera className="size-3.5" aria-hidden="true" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-ink">Profile picture</p>
        <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP or GIF, up to 5 MB.</p>
        {uploadAvatar.isPending && <p className="mt-1 text-xs text-primary">Uploading…</p>}
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

const emptyPermanentAddress: PermanentAddressInput = {
  permanent_address_line: "",
  permanent_city: "",
  permanent_state: "",
  permanent_pincode: "",
  permanent_country: "India",
};

/** Permanent Address — lives on `profiles`, separate from the Delivery
 *  Address card's `addresses` row below, so the two never collide. Same
 *  view/edit toggle pattern as `ProfileEditor` above it. */
function PermanentAddressEditor({ profile }: { profile: Profile | null }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PermanentAddressInput>(
    profile
      ? {
          permanent_address_line: profile.permanent_address_line || "",
          permanent_city: profile.permanent_city || "",
          permanent_state: profile.permanent_state || "",
          permanent_pincode: profile.permanent_pincode || "",
          permanent_country: profile.permanent_country || "India",
        }
      : emptyPermanentAddress,
  );
  const [error, setError] = useState<string | null>(null);
  const updateAddress = useUpdatePermanentAddress();
  const set = <K extends keyof PermanentAddressInput>(key: K, value: PermanentAddressInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const hasAddress = !!profile?.permanent_address_line;

  const startEditing = () => {
    setForm({
      permanent_address_line: profile?.permanent_address_line || "",
      permanent_city: profile?.permanent_city || "",
      permanent_state: profile?.permanent_state || "",
      permanent_pincode: profile?.permanent_pincode || "",
      permanent_country: profile?.permanent_country || "India",
    });
    setError(null);
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(form.permanent_pincode.trim())) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }
    try {
      await updateAddress.mutateAsync(form);
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't save your address. Please try again.",
      );
    }
  };

  if (!editing) {
    return (
      <>
        <p className="text-sm font-semibold text-ink">Permanent Address</p>
        {hasAddress ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {profile!.permanent_address_line}, {profile!.permanent_city}, {profile!.permanent_state}{" "}
            {profile!.permanent_pincode}, {profile!.permanent_country}
          </p>
        ) : (
          <EmptyLine>No permanent address saved yet.</EmptyLine>
        )}
        <Button variant="quiet" size="sm" className="mt-4" onClick={startEditing}>
          <Pencil className="size-3.5" aria-hidden="true" />
          {hasAddress ? "Edit address" : "Add address"}
        </Button>
      </>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <p className="text-sm font-semibold text-ink">Permanent Address</p>
      <div className="grid gap-1.5">
        <Label htmlFor="perm-line">Address</Label>
        <Input
          id="perm-line"
          value={form.permanent_address_line}
          onChange={(e) => set("permanent_address_line", e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="perm-city">City / Town</Label>
          <Input
            id="perm-city"
            value={form.permanent_city}
            onChange={(e) => set("permanent_city", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="perm-state">State</Label>
          <Input
            id="perm-state"
            value={form.permanent_state}
            onChange={(e) => set("permanent_state", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="perm-pincode">PIN code</Label>
          <Input
            id="perm-pincode"
            inputMode="numeric"
            maxLength={6}
            value={form.permanent_pincode}
            onChange={(e) => set("permanent_pincode", e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="perm-country">Country</Label>
        <Input
          id="perm-country"
          value={form.permanent_country}
          onChange={(e) => set("permanent_country", e.target.value)}
          required
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" variant="brand" size="sm" disabled={updateAddress.isPending}>
          {updateAddress.isPending ? "Saving…" : "Save address"}
        </Button>
        <Button
          type="button"
          variant="quiet"
          size="sm"
          onClick={() => setEditing(false)}
          disabled={updateAddress.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

const emptyDeliveryAddress: DeliveryAddressInput = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
};

/** Delivery Address card — exactly ONE editable address, not a list. Reads
 *  and writes through `usePrimaryAddress`/`useSaveDeliveryAddress`, which
 *  always targets the single `is_default` row in `addresses` (see
 *  src/lib/account.ts) — no "add another address" affordance here by
 *  design. */
function DeliveryAddressEditor({ address }: { address: Address | null }) {
  const [editing, setEditing] = useState(!address);
  const [form, setForm] = useState<DeliveryAddressInput>(
    address
      ? {
          full_name: address.full_name || "",
          phone: address.phone || "",
          address_line: address.address_line,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        }
      : emptyDeliveryAddress,
  );
  const [error, setError] = useState<string | null>(null);
  const saveAddress = useSaveDeliveryAddress();
  const set = <K extends keyof DeliveryAddressInput>(key: K, value: DeliveryAddressInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const startEditing = () => {
    if (address) {
      setForm({
        full_name: address.full_name || "",
        phone: address.phone || "",
        address_line: address.address_line,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      });
    }
    setError(null);
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await saveAddress.mutateAsync({ ...(address ? { id: address.id } : {}), ...form });
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't save this address. Please try again.",
      );
    }
  };

  if (!editing && address) {
    return (
      <>
        <div className="mt-5 rounded-md border border-border p-4 text-sm">
          <p className="font-medium text-ink">{address.full_name || "Delivery address"}</p>
          <p className="mt-1.5 text-muted-foreground">
            {address.address_line}, {address.city}, {address.state} {address.pincode}
          </p>
          {address.phone && <p className="mt-1 text-muted-foreground">{address.phone}</p>}
        </div>
        <Button variant="quiet" size="sm" className="mt-4" onClick={startEditing}>
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit address
        </Button>
      </>
    );
  }

  return (
    <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="addr-name">Recipient name</Label>
          <Input
            id="addr-name"
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="addr-phone">Phone</Label>
          <Input
            id="addr-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            required
          />
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
          <Input
            id="addr-city"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="addr-state">State</Label>
          <Input
            id="addr-state"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            required
          />
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

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="brand" size="sm" disabled={saveAddress.isPending}>
          {saveAddress.isPending ? "Saving…" : "Save address"}
        </Button>
        {address && (
          <Button
            type="button"
            variant="quiet"
            size="sm"
            onClick={() => setEditing(false)}
            disabled={saveAddress.isPending}
          >
            Cancel
          </Button>
        )}
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
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[0.7rem] font-semibold capitalize",
              statusClass,
            )}
          >
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
            <li
              key={item.id}
              className="flex items-center justify-between text-xs text-muted-foreground"
            >
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
