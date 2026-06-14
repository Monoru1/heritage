import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionLabel } from "@/components/ui/Section";

export default function ChefSignature() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"
                alt="Le Chef en cuisine"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Accent frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-or/20 -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <SectionLabel>Le chef</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl text-creme mb-8">
              Une cuisine
              <br />
              <span className="italic text-or">d'instinct</span>
            </h2>
            <div className="space-y-6 text-pierre/80 leading-relaxed">
              <p>
                Formé dans les cuisines du Mirazur et du Louis XV, notre chef
                revient à ses racines provençales avec une conviction : la
                grande cuisine naît du respect absolu du produit.
              </p>
              <p>
                Chaque assiette raconte le marché du matin, les saisons, les
                rencontres avec les producteurs. Pas de carte figée — le menu
                évolue avec ce que la terre et la mer offrent, jour après jour.
              </p>
            </div>

            {/* Signature quote */}
            <blockquote className="mt-10 pl-6 border-l border-or/40">
              <p className="font-display text-xl italic text-creme/90">
                «&nbsp;Cuisiner, c'est écouter le produit avant de lui
                imposer quoi que ce soit.&nbsp;»
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
