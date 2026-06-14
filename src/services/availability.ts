import { supabase } from "@/lib/supabase";
import type { AvailabilitySlot } from "@/types/database";

export async function fetchAvailableDates(): Promise<string[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("availability_slots")
    .select("slot_date")
    .eq("is_open", true)
    .gt("available_tables", 0)
    .gte("slot_date", today)
    .order("slot_date", { ascending: true });

  if (error) throw error;

  const uniqueDates = [...new Set((data ?? []).map((s) => s.slot_date))];
  return uniqueDates;
}

export async function fetchSlotsForDate(
  date: string
): Promise<AvailabilitySlot[]> {
  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("slot_date", date)
    .eq("is_open", true)
    .gt("available_tables", 0)
    .order("slot_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
