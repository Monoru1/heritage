import { Section, SectionLabel, SectionTitle } from "@/components/ui/Section";
import { Leaf, Sun, Waves } from "lucide-react";

const PILLARS = [
  {
    icon: Leaf,
    title: "Terroir",
    text: "Des producteurs à 50 km, une traçabilité totale, des saisons respectées.",
  },
  {
    icon: Sun,
    title: "Lumière",
    text: "La salle ouvre sur les collines. Le soleil de Provence fait partie du repas.",
  },
  {
    icon: Waves,
    title: "Méditerranée",
    text: "La pêche du jour arrive chaque matin du port de Cassis.",
  },
];

export default function Experience() {
  return (
    <Section>
      <div className="text-center max-w-3xl mx-auto mb-20">
        <SectionLabel>L'expérience</SectionLabel>
        <SectionTitle className="text-center">
          Plus qu'un repas,
          <br />
          <span className="italic text-or">un voyage</span>
        </SectionTitle>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 border border-or/30 mb-6 group-hover:border-or/60 transition-colors duration-500">
              <Icon size={24} className="text-or" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-2xl text-creme mb-3">{title}</h3>
            <p className="text-pierre/70 text-sm leading-relaxed max-w-xs mx-auto">
              {text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
