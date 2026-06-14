import { Section, SectionLabel, SectionTitle } from "@/components/ui/Section";
import { useGallery } from "@/hooks/useGallery";
import { Link } from "react-router-dom";

export default function GalleryPreview() {
  const { data: images } = useGallery();
  const preview = images?.slice(0, 4) ?? [];

  if (preview.length === 0) return null;

  return (
    <Section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <SectionLabel>Galerie</SectionLabel>
          <SectionTitle>Atmosphère</SectionTitle>
        </div>
        <Link
          to="/galerie"
          className="text-or text-sm tracking-[0.08em] uppercase hover:text-or-light transition-colors"
        >
          Voir tout →
        </Link>
      </div>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {preview.map((img, i) => (
          <div
            key={img.id}
            className={`overflow-hidden group ${
              i === 0 ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <div className={`${i === 0 ? "aspect-square" : "aspect-[4/3]"} relative`}>
              <img
                src={img.image_url}
                alt={img.title ?? ""}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {img.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <span className="text-creme text-sm">{img.title}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
