import { supabase } from "@/lib/supabase";
import type { Reservation, MenuItem, TableRestaurant, AvailabilitySlot, GalleryImage } from "@/types/database";

export async function fetchAllReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase.from("reservations").select("*").order("reservation_date", { ascending: false }).order("reservation_time", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateReservationStatus(id: string, status: Reservation["status"]) {
  if (status === "confirmed") return confirmReservationAndAssignTable(id);
  const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
  if (error) throw error;
}

async function confirmReservationAndAssignTable(id: string) {
  const { data: reservation, error: reservationError } = await supabase.from("reservations").select("*").eq("id", id).single();
  if (reservationError) throw reservationError;
  if (!reservation) throw new Error("Réservation introuvable");
  if (reservation.table_id) {
    const { error } = await supabase.from("reservations").update({ status: "confirmed" }).eq("id", id);
    if (error) throw error;
    return;
  }

  const time = normalizeTime(reservation.reservation_time);
  const { data: busyReservations, error: busyError } = await supabase
    .from("reservations")
    .select("table_id")
    .eq("reservation_date", reservation.reservation_date)
    .eq("reservation_time", time)
    .in("status", ["pending", "confirmed", "seated"])
    .not("table_id", "is", null);
  if (busyError) throw busyError;
  const busyTableIds = new Set((busyReservations ?? []).map((r) => r.table_id).filter(Boolean));

  const { data: tables, error: tablesError } = await supabase
    .from("tables_restaurant")
    .select("*")
    .eq("active", true)
    .gte("capacite", Number(reservation.guests))
    .order("capacite", { ascending: true })
    .order("numero", { ascending: true });
  if (tablesError) throw tablesError;

  const available = ((tables ?? []) as TableRestaurant[]).filter((t) => !busyTableIds.has(t.id));
  const preference = reservation.location_preference ?? "indifferent";
  const preferred = preference === "indifferent" ? available : available.filter((t) => t.location === preference);
  const selected = (preferred[0] ?? available[0]) as TableRestaurant | undefined;
  if (!selected) throw new Error("Aucune table disponible pour cette réservation");

  const { error } = await supabase.from("reservations").update({ status: "confirmed", table_id: selected.id }).eq("id", id);
  if (error) throw error;

  // Decrement available_tables so the public page reflects real availability
  const { data: slotData } = await supabase
    .from("availability_slots")
    .select("id, available_tables")
    .eq("slot_date", reservation.reservation_date)
    .eq("slot_time", time)
    .single();
  if (slotData && slotData.available_tables > 0) {
    await supabase
      .from("availability_slots")
      .update({ available_tables: slotData.available_tables - 1 })
      .eq("id", slotData.id);
  }
}

export async function fetchAllMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase.from("menu_items").select("*").order("category").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function upsertMenuItem(item: Partial<MenuItem> & { name: string; price: number; category: string }) {
  const payload = { ...item, price: Number(item.price), sort_order: Number(item.sort_order ?? 0), is_specialty: Boolean(item.is_specialty), is_available: item.is_available ?? true };
  const { error } = item.id ? await supabase.from("menu_items").update(payload).eq("id", item.id) : await supabase.from("menu_items").insert(payload);
  if (error) throw error;
}

export async function deleteMenuItem(id: string) { const { error } = await supabase.from("menu_items").delete().eq("id", id); if (error) throw error; }

export type ManagedTable = TableRestaurant & { location?: "interieur" | "terrasse" };
export type ManagedTableInput = Partial<ManagedTable> & { numero: number; capacite: number; location?: "interieur" | "terrasse" };

export async function fetchAllTables(): Promise<ManagedTable[]> {
  const { data, error } = await supabase.from("tables_restaurant").select("*").order("numero");
  if (error) throw error;
  return (data ?? []) as ManagedTable[];
}

export async function upsertTable(table: ManagedTableInput) {
  const payload = { ...table, numero: Number(table.numero), capacite: Number(table.capacite), position_x: Number(table.position_x ?? 0), position_y: Number(table.position_y ?? 0), active: table.active ?? true, location: table.location ?? "interieur" };
  const { error } = table.id ? await supabase.from("tables_restaurant").update(payload).eq("id", table.id) : await supabase.from("tables_restaurant").insert(payload);
  if (error) throw error;
}

export async function deleteTable(id: string) { const { error } = await supabase.from("tables_restaurant").delete().eq("id", id); if (error) throw error; }

export async function fetchAllGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function upsertGalleryImage(image: Partial<GalleryImage> & { image_url: string }) {
  const payload = { ...image, sort_order: Number(image.sort_order ?? 0) };
  const { error } = image.id ? await supabase.from("gallery_images").update(payload).eq("id", image.id) : await supabase.from("gallery_images").insert(payload);
  if (error) throw error;
}

export async function deleteGalleryImage(id: string) { const { error } = await supabase.from("gallery_images").delete().eq("id", id); if (error) throw error; }

export async function fetchAllAvailabilitySlots(): Promise<AvailabilitySlot[]> {
  const { data, error } = await supabase.from("availability_slots").select("*").order("slot_date", { ascending: true }).order("slot_time", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertAvailabilitySlot(slot: Partial<AvailabilitySlot> & { slot_date: string; slot_time: string }) {
  const payload = { ...slot, available_tables: Number(slot.available_tables ?? 0), is_open: slot.is_open ?? true, slot_time: normalizeTime(slot.slot_time) };
  const { error } = slot.id ? await supabase.from("availability_slots").update(payload).eq("id", slot.id) : await supabase.from("availability_slots").insert(payload);
  if (error) throw error;
}

export async function deleteAvailabilitySlot(id: string) { const { error } = await supabase.from("availability_slots").delete().eq("id", id); if (error) throw error; }

function normalizeTime(value: string) { const parts = value.split(":"); if (parts.length === 2) return `${parts[0]}:${parts[1]}:00`; return value; }

export async function fetchReservationStats() {
  const { data, error } = await supabase.from("reservations").select("reservation_date, reservation_time, status, guests");
  if (error) throw error;
  return data ?? [];
}
