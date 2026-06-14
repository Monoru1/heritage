import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section, SectionLabel, SectionTitle, SectionText } from "@/components/ui/Section";

function TimelineBlock({
  year,
  title,
  text,
  image,
  flip,
}: {
  year: string;
  title: string;
  text: string;
  image: string;
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
        flip ? "lg:direction-rtl" : ""
      }`}
    >
      <div className={flip ? "lg:order-2" : ""}>
        <span className="text-or text-xs tracking-[0.2em] uppercase">
          {year}
        </span>
        <h3 className="font-display text-3xl text-creme mt-2 mb-4">
          {title}
        </h3>
        <p className="text-pierre/70 leading-relaxed">{text}</p>
      </div>
      <div className={flip ? "lg:order-1" : ""}>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Histoire() {
  return (
    <>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <SectionLabel>Notre histoire</SectionLabel>
          <h1 className="font-display text-5xl md:text-7xl text-creme">
            Depuis trois générations
          </h1>
        </div>
      </div>

      {/* Intro */}
      <Section>
        <div className="max-w-3xl">
          <SectionText className="text-xl">
            HÉRITAGE est né d'une histoire de famille. Celle d'un mas
            provençal, d'un potager centenaire, et d'une table où l'on n'a
            jamais cessé de recevoir.
          </SectionText>
        </div>
      </Section>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto px-6 space-y-24 pb-32">
        <TimelineBlock
          year="1962"
          title="Le mas des Collines"
          text="Marcel Fontaine acquiert le mas et ses 4 hectares de terrasses d'oliviers. La table familiale accueille déjà les amis et les voisins du village."
          image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
        />
        <TimelineBlock
          year="1989"
          title="L'auberge ouvre ses portes"
          text="Catherine, fille de Marcel, transforme le mas en auberge de campagne. 20 couverts, une carte au tableau noir, et un aïoli du vendredi qui fait venir tout le canton."
          image="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80"
          flip
        />
        <TimelineBlock
          year="2018"
          title="La renaissance"
          text="Après une formation dans les plus grandes maisons, la troisième génération revient au mas. La salle est repensée, la cuisine sublimée. Le nom HÉRITAGE s'impose comme une évidence."
          image="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
        />
        <TimelineBlock
          year="Aujourd'hui"
          title="L'âme du Sud"
          text="HÉRITAGE sert 40 couverts dans une salle ouverte sur les collines. La cuisine est guidée par une conviction : le grand goût naît de la simplicité et du respect du terroir."
          image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
          flip
        />
      </div>
    </>
  );
}
