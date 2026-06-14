import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery } from "@/hooks/useGallery";
import { Section, SectionLabel } from "@/components/ui/Section";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Galerie() {
  const { data: images, isLoading } = useGallery();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const list = images ?? [];

  const prev = useCallback(() => {
    setSelectedIdx((i) => (i === null ? null : i === 0 ? list.length - 1 : i - 1));
  }, [list.length]);

  const next = useCallback(() => {
    setSelectedIdx((i) => (i === null ? null : i === list.length - 1 ? 0 : i + 1));
  }, [list.length]);

  // keyboard nav
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape")     setSelectedIdx(null);
  }, [prev, next]);

  const selectedImg = selectedIdx !== null ? list[selectedIdx] : null;

  return (
    <>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/65 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-10 w-full">
          <SectionLabel>Galerie</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-creme">Atmosphère</h1>
        </div>
      </div>

      <Section className="pt-8 pb-24">
        {isLoading ? (
          /* Skeleton */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`break-inside-avoid bg-pierre/10 animate-pulse ${
                i % 3 === 0 ? "aspect-[4/3]" : i % 3 === 1 ? "aspect-square" : "aspect-[3/4]"
              }`} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 text-pierre/30">
            <p className="font-display text-2xl mb-2">Galerie à venir</p>
            <p className="text-sm">Les photos seront disponibles très prochainement.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
            {list.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setSelectedIdx(i)}
              >
                <div className="overflow-hidden relative">
                  <img
                    src={img.image_url}
                    alt={img.title ?? "Héritage"}
                    loading="lazy"
                    className="w-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-void/0 group-hover:bg-void/25 transition-colors duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-creme text-xs tracking-widest uppercase">
                      Agrandir
                    </span>
                  </div>
                </div>
                {img.title && (
                  <p className="text-pierre/40 text-xs mt-1.5 tracking-wide">{img.title}</p>
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
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-void/97 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedIdx(null)}
            onKeyDown={handleKey}
            tabIndex={0}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-creme/50 hover:text-creme transition-colors p-2 z-10"
            >
              <X size={24} />
            </button>

            {/* Prev */}
            {list.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 sm:left-6 text-creme/50 hover:text-creme transition-colors p-3 z-10"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImg.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                src={selectedImg.image_url}
                alt={selectedImg.title ?? ""}
                className="max-h-[85vh] max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Next */}
            {list.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 sm:right-6 text-creme/50 hover:text-creme transition-colors p-3 z-10"
              >
                <ChevronRight size={28} />
              </button>
            )}

            {/* Caption + counter */}
            {(selectedImg.title || list.length > 1) && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="text-center">
                  {selectedImg.title && (
                    <p className="text-creme/60 text-sm">{selectedImg.title}</p>
                  )}
                  {list.length > 1 && (
                    <p className="text-pierre/30 text-xs mt-1">
                      {(selectedIdx ?? 0) + 1} / {list.length}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
