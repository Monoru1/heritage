import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionLabel } from "@/components/ui/Section";
import { Link } from "react-router-dom";

export default function WineCellar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1920&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-void/80 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        <SectionLabel>La cave</SectionLabel>
        <h2 className="font-display text-4xl md:text-6xl text-creme mb-6">
          350 références
        </h2>
        <p className="text-pierre/80 text-lg max-w-xl mx-auto mb-10">
          Bandol, Côtes de Provence, Châteauneuf-du-Pape, Cassis. Notre
          sommelier compose chaque accord comme une partition.
        </p>
        <Link
          to="/menu"
          className="inline-flex px-10 py-3.5 border border-or/60 text-or text-sm tracking-[0.1em] uppercase hover:bg-or hover:text-void transition-all duration-300"
        >
          Voir la carte des vins
        </Link>
      </motion.div>
    </section>
  );
}
