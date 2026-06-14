import { supabase } from "@/lib/supabase";

export async function uploadAdminImage(file: File, bucket: "gallery" | "menu") {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = file.name.replace(/[^a-z0-9.]+/gi, "-").toLowerCase();
  const path = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || `image/${ext}`,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
