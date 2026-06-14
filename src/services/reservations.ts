import { supabase } from "@/lib/supabase";
import type { ReservationInsert } from "@/types/database";

export async function createReservation(
  reservation: ReservationInsert
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      ...reservation,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}
