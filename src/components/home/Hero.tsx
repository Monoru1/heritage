import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80)",
          }}
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/30 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity, y: textY }}
      >
        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-16 h-px bg-or mb-8 origin-center"
        />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.12em] text-creme"
        >
          HÉRITAGE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-6 font-display text-xl md:text-2xl text-pierre italic"
        >
          L'âme du Sud de la France dans chaque assiette
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/reservation"
            className="px-10 py-3.5 bg-or text-void text-sm tracking-[0.1em] uppercase font-medium hover:bg-or-light transition-colors duration-300"
          >
            Réserver une table
          </Link>
          <Link
            to="/menu"
            className="px-10 py-3.5 border border-creme/30 text-creme text-sm tracking-[0.1em] uppercase hover:border-creme/60 hover:bg-creme/5 transition-all duration-300"
          >
            Découvrir la carte
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-pierre/40 text-xs tracking-[0.2em] uppercase">
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-or/60 to-transparent"
        />
      </motion.div>
    </div>
  );
}
