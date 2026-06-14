import { supabase } from "@/lib/supabase";
import type { GalleryImage } from "@/types/database";

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
