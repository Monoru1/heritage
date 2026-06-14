import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY  = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen min-h-[600px] overflow-hidden">
      {/* BG image */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <div className="absolute inset-0 scale-110 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-void/55 via-void/20 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/30 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, y: textY }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-14 h-px bg-or mb-8 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-or text-xs tracking-[0.25em] uppercase mb-6"
        >
          Restaurant Gastronomique · Aix-en-Provence
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] tracking-[0.1em] text-creme leading-none"
        >
          HÉRITAGE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-6 font-display text-lg sm:text-xl md:text-2xl text-pierre/80 italic"
        >
          L'âme du Sud de la France dans chaque assiette
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <Link to="/reservation"
            className="px-8 sm:px-10 py-3.5 bg-or text-void text-xs sm:text-sm tracking-[0.12em] uppercase font-medium hover:bg-or-light transition-colors duration-300">
            Réserver une table
          </Link>
          <Link to="/menu"
            className="px-8 sm:px-10 py-3.5 border border-creme/30 text-creme text-xs sm:text-sm tracking-[0.12em] uppercase hover:border-creme/60 hover:bg-creme/5 transition-all duration-300">
            Découvrir la carte
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-pierre/30 text-[10px] tracking-[0.25em] uppercase">Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-or/50 to-transparent"
        />
      </motion.div>
    </div>
  );
}
