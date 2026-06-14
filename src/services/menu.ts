import { supabase } from "@/lib/supabase";
import type { MenuItem, MenuCategory } from "@/types/database";

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchMenuByCategory(
  category: MenuCategory
): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category", category)
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchSpecialties(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_specialty", true)
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
