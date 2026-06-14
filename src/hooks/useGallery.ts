import { useQuery } from "@tanstack/react-query";
import { fetchGalleryImages } from "@/services/gallery";

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGalleryImages,
    staleTime: 5 * 60 * 1000,
  });
}
