import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery } from "@/hooks/useGallery";
import { Section, SectionLabel } from "@/components/ui/Section";
import { X } from "lucide-react";

export default function Galerie() {
  const { data: images, isLoading } = useGallery();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedImg = images?.find((img) => img.id === selected);

  return (
    <>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[320px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <SectionLabel>Galerie</SectionLabel>
          <h1 className="font-display text-5xl md:text-7xl text-creme">
            Atmosphère
          </h1>
        </div>
      </div>

      <Section className="pt-8">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border border-or/30 border-t-or rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images?.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setSelected(img.id)}
              >
                <div className="overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.title ?? ""}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                {img.title && (
                  <p className="text-pierre/50 text-xs mt-2 tracking-wide">
                    {img.title}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-void/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 text-creme/60 hover:text-creme"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImg.image_url}
              alt={selectedImg.title ?? ""}
              className="max-h-[85vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
