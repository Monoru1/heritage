import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadAdminImage } from "@/services/uploads";
import { toast } from "@/components/ui/Toast";

export default function ImageUploader({ bucket, value, onUploaded }: { bucket: "gallery" | "menu"; value?: string | null; onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Veuillez choisir une image", "error");
    setBusy(true);
    try {
      const url = await uploadAdminImage(file, bucket);
      onUploaded(url);
      toast("Image importée", "success");
    } catch {
      toast("Erreur upload image", "error");
    } finally {
      setBusy(false);
    }
  }
  return <div className="space-y-3"><label className="block border border-dashed border-pierre/20 bg-void p-5 text-center cursor-pointer hover:border-or/60 transition-colors"><input type="file" accept="image/*" className="hidden" onChange={(e)=>handleFile(e.target.files?.[0])}/>{busy ? <Loader2 className="animate-spin text-or mx-auto mb-2"/> : <ImagePlus className="text-or mx-auto mb-2"/>}<span className="block text-xs uppercase tracking-[0.16em] text-pierre/60">Importer une image</span><span className="block text-[11px] text-pierre/35 mt-1">PNG, JPG, WEBP depuis votre ordinateur</span></label>{value && <img src={value} className="h-40 w-full object-cover border border-pierre/10"/>}</div>;
}
