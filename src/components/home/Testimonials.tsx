import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionLabel } from "@/components/ui/Section";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    text: "Un moment suspendu. La bouillabaisse est la plus authentique que j'ai goûtée hors de Marseille.",
    author: "Marie-Claire D.",
    origin: "Guide Michelin, 2025",
  },
  {
    text: "On sent la Provence dans chaque bouchée. Le service est d'une élégance rare, sans ostentation.",
    author: "Laurent P.",
    origin: "Lyon",
  },
  {
    text: "La vue sur les collines au coucher du soleil, les saveurs du terroir… Un souvenir impérissable.",
    author: "Sofia & Marco R.",
    origin: "Milano",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);
  const prev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const t = TESTIMONIALS[index];

  return (
    <Section className="bg-void-light">
      <div className="max-w-3xl mx-auto text-center">
        <SectionLabel>Témoignages</SectionLabel>

        <div className="min-h-[200px] flex items-center justify-center mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="font-display text-2xl md:text-3xl text-creme italic leading-relaxed mb-8">
                «&nbsp;{t.text}&nbsp;»
              </blockquote>
              <p className="text-or text-sm tracking-[0.1em]">{t.author}</p>
              <p className="text-pierre/50 text-xs mt-1">{t.origin}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="p-2 text-pierre/40 hover:text-or transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === index ? "bg-or" : "bg-pierre/20"
                }`}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-2 text-pierre/40 hover:text-or transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </Section>
  );
}
