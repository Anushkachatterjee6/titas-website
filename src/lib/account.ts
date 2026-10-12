import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAuth } from "./auth";

/**
 * Data access for the account page — reads and the writes that back the
 * profile/address editing UI. Every query and mutation is scoped to the
 * signed-in user's own id — RLS enforces this at the database level too,
 * so nothing here ever accepts an arbitrary user id from the caller, and
 * only the public anon key (via the existing shared `supabase` client) is
 * ever used — no service-role key, no RLS bypass.
 */

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  permanent_address_line: string | null;
  permanent_city: string | null;
  permanent_state: string | null;
  permanent_pincode: string | null;
  permanent_country: string | null;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  delivery_address: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useAddresses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["addresses", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Address[]> => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user!.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** The account UI now exposes exactly ONE delivery address, not a list —
 *  this reads the single row that single-address UI should show: the
 *  account's `is_default` address if one is flagged, otherwise whichever
 *  row was saved most recently. The underlying `addresses` table is
 *  unchanged (still supports multiple rows per user), so an account that
 *  already had several saved addresses from before this change keeps all
 *  of that data intact in the database — this just stops exposing "add
 *  another address" in the UI and always edits/creates through this one
 *  row going forward. */
export function usePrimaryAddress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["primary-address", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Address | null> => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user!.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export type DeliveryAddressInput = {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
};

/** Creates or updates the single delivery address — pass the existing
 *  row's `id` (from `usePrimaryAddress`) to update it in place, or omit it
 *  to create the first one. Always saved with `is_default: true` since
 *  there is, by design, only ever one. */
export function useSaveDeliveryAddress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: DeliveryAddressInput & { id?: string }) => {
      const { error } = await supabase.from("addresses").upsert({
        ...(id ? { id } : {}),
        user_id: user!.id,
        ...input,
        is_default: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["primary-address", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
    },
  });
}

/** Updates the editable profile fields (name, phone) in `profiles`. The
 *  account email is handled separately via `useUpdateAccountEmail`, since
 *  it's the Supabase Auth identity email, not just a profile column. */
export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: { full_name: string; phone: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: patch.full_name, phone: patch.phone })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
}

export type PermanentAddressInput = {
  permanent_address_line: string;
  permanent_city: string;
  permanent_state: string;
  permanent_pincode: string;
  permanent_country: string;
};

/** Saves the Profile Details "Permanent Address" fields — stored directly
 *  on `profiles`, deliberately separate from the `addresses` table (which
 *  holds the single delivery address below), so the two never get mixed
 *  up. */
export function useUpdatePermanentAddress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PermanentAddressInput) => {
      const { error } = await supabase.from("profiles").update(input).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
}

const AVATAR_MAX_BYTES = 5 * 1024 * 1024; // matches the bucket's own file_size_limit
const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** Uploads a new profile picture to the `avatars` storage bucket (path
 *  "<user-id>/<timestamp>.<ext>", enforced by that bucket's RLS policies —
 *  see supabase/migrations/profile_avatar_and_permanent_address.sql) and
 *  saves the resulting public URL onto `profiles.avatar_url`. Validates
 *  type/size client-side first; the bucket itself also enforces both
 *  server-side, so a tampered client can't bypass either check. */
export function useUploadAvatar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Please choose a JPEG, PNG, WEBP or GIF image.");
      }
      if (file.size > AVATAR_MAX_BYTES) {
        throw new Error("Image is too large — please choose one under 5 MB.");
      }

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user!.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq("id", user!.id);
      if (updateError) throw updateError;

      return publicUrlData.publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
}

/** Changes the account's actual sign-in email via Supabase Auth. Supabase
 *  requires confirming the new address before it takes effect, so this
 *  only ever *requests* the change — the account email shown elsewhere
 *  stays the old one until the visitor clicks the confirmation link and
 *  their session refreshes. */
export function useUpdateAccountEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    },
  });
}

export type AddressInput = {
  id?: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
};

/** Creates a new address, or updates one in place when `id` is supplied. */
export function useUpsertAddress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddressInput) => {
      const { error } = await supabase.from("addresses").upsert({
        ...(input.id ? { id: input.id } : {}),
        user_id: user!.id,
        full_name: input.full_name,
        phone: input.phone,
        address_line: input.address_line,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        is_default: input.is_default ?? false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
    },
  });
}

export function useDeleteAddress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
    },
  });
}

export function useOrders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
