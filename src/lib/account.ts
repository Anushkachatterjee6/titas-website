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
