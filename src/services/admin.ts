import { supabase } from "@/lib/supabase";
import type {
  Reservation,
  MenuItem,
  TableRestaurant,
  AvailabilitySlot,
  GalleryImage,
} from "@/types/database";

// ---- Reservations ----
export async function fetchAllReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: false })
    .order("reservation_time", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateReservationStatus(
  id: string,
  status: Reservation["status"]
) {
  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ---- Menu CRUD ----
export async function fetchAllMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function upsertMenuItem(
  item: Partial<MenuItem> & { name: string; price: number; category: string }
) {
  const payload = {
    ...item,
    price: Number(item.price),
    sort_order: Number(item.sort_order ?? 0),
    is_specialty: Boolean(item.is_specialty),
    is_available: item.is_available ?? true,
  };

  const { error } = item.id
    ? await supabase.from("menu_items").update(payload).eq("id", item.id)
    : await supabase.from("menu_items").insert(payload);
  if (error) throw error;
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

// ---- Tables CRUD ----
export type ManagedTable = TableRestaurant & { location?: "interieur" | "terrasse" };
export type ManagedTableInput = Partial<ManagedTable> & {
  numero: number;
  capacite: number;
  location?: "interieur" | "terrasse";
};

export async function fetchAllTables(): Promise<ManagedTable[]> {
  const { data, error } = await supabase
    .from("tables_restaurant")
    .select("*")
    .order("numero");
  if (error) throw error;
  return (data ?? []) as ManagedTable[];
}

export async function upsertTable(table: ManagedTableInput) {
  const payload = {
    ...table,
    numero: Number(table.numero),
    capacite: Number(table.capacite),
    position_x: Number(table.position_x ?? 0),
    position_y: Number(table.position_y ?? 0),
    active: table.active ?? true,
    location: table.location ?? "interieur",
  };

  const { error } = table.id
    ? await supabase.from("tables_restaurant").update(payload).eq("id", table.id)
    : await supabase.from("tables_restaurant").insert(payload);
  if (error) throw error;
}

export async function deleteTable(id: string) {
  const { error } = await supabase.from("tables_restaurant").delete().eq("id", id);
  if (error) throw error;
}

// ---- Gallery CRUD ----
export async function fetchAllGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function upsertGalleryImage(
  image: Partial<GalleryImage> & { image_url: string }
) {
  const payload = {
    ...image,
    sort_order: Number(image.sort_order ?? 0),
  };

  const { error } = image.id
    ? await supabase.from("gallery_images").update(payload).eq("id", image.id)
    : await supabase.from("gallery_images").insert(payload);
  if (error) throw error;
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ---- Availability CRUD ----
export async function fetchAllAvailabilitySlots(): Promise<AvailabilitySlot[]> {
  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .order("slot_date", { ascending: true })
    .order("slot_time", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertAvailabilitySlot(
  slot: Partial<AvailabilitySlot> & { slot_date: string; slot_time: string }
) {
  const payload = {
    ...slot,
    available_tables: Number(slot.available_tables ?? 0),
    is_open: slot.is_open ?? true,
    slot_time: normalizeTime(slot.slot_time),
  };

  const { error } = slot.id
    ? await supabase.from("availability_slots").update(payload).eq("id", slot.id)
    : await supabase.from("availability_slots").insert(payload);
  if (error) throw error;
}

export async function deleteAvailabilitySlot(id: string) {
  const { error } = await supabase.from("availability_slots").delete().eq("id", id);
  if (error) throw error;
}

function normalizeTime(value: string) {
  const parts = value.split(":");
  if (parts.length === 2) return `${parts[0]}:${parts[1]}:00`;
  return value;
}

// ---- Stats ----
export async function fetchReservationStats() {
  const { data, error } = await supabase
    .from("reservations")
    .select("reservation_date, reservation_time, status, guests");
  if (error) throw error;
  return data ?? [];
}
