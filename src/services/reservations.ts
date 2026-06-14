import { supabase } from "@/lib/supabase";
import type { ReservationInsert } from "@/types/database";

export async function createReservation(
  reservation: ReservationInsert
): Promise<void> {
  // Note: no .select() after insert — anon role has INSERT policy but no SELECT policy.
  // Confirmation is shown from local state, not a read-back.
  const payload = {
    first_name: reservation.first_name,
    last_name: reservation.last_name,
    email: reservation.email,
    phone: reservation.phone,
    reservation_date: reservation.reservation_date, // YYYY-MM-DD
    reservation_time: ensureTimeFormat(reservation.reservation_time), // HH:mm:ss
    guests: Number(reservation.guests),
    status: "pending" as const,
    notes: reservation.notes ?? null,
    table_id: null,
  };

  const { error } = await supabase.from("reservations").insert(payload);

  if (error) {
    console.error("[Reservation] Supabase insert error:", error);
    throw error;
  }
}

// Supabase time column expects HH:mm:ss — slot_time comes as "HH:mm:ss" from DB
// but just in case frontend passes "HH:mm", we pad it.
function ensureTimeFormat(t: string): string {
  if (!t) return "00:00:00";
  const parts = t.split(":");
  if (parts.length === 2) return `${parts[0]}:${parts[1]}:00`;
  return t; // already HH:mm:ss
}
