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
    .order("reservation_date", { ascending: false });
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
  const { error } = item.id
    ? await supabase.from("menu_items").update(item).eq("id", item.id)
    : await supabase.from("menu_items").insert(item);
  if (error) throw error;
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

// ---- Tables ----
export async function fetchAllTables(): Promise<TableRestaurant[]> {
  const { data, error } = await supabase
    .from("tables_restaurant")
    .select("*")
    .order("numero");
  if (error) throw error;
  return data ?? [];
}

// ---- Gallery ----
export async function fetchAllGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ---- Stats ----
export async function fetchReservationStats() {
  const { data, error } = await supabase
    .from("reservations")
    .select("reservation_date, reservation_time, status, guests");
  if (error) throw error;
  return data ?? [];
}
