import { Section, SectionLabel, SectionTitle, SectionText } from "@/components/ui/Section";

const TERROIR_ITEMS = [
  {
    title: "Huile d'olive AOP",
    origin: "Vallée des Baux-de-Provence",
    description: "Pressée à froid dans les 4h suivant la cueillette.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  },
  {
    title: "Sel de Camargue",
    origin: "Salin-de-Giraud",
    description: "Fleur de sel récoltée à la main, chaque matin d'été.",
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&q=80",
  },
  {
    title: "Safran du Ventoux",
    origin: "Sault, Vaucluse",
    description: "Récolte d'octobre, séché lentement au mistral.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
  },
];

export default function Terroir() {
  return (
    <Section className="bg-void-light">
      <SectionLabel>Le terroir</SectionLabel>
      <SectionTitle>Nos producteurs</SectionTitle>
      <SectionText>
        Chaque plat commence par un producteur. Nous travaillons avec des
        artisans qui partagent notre exigence et notre amour du Sud.
      </SectionText>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {TERROIR_ITEMS.map((item) => (
          <div key={item.title} className="group">
            <div className="aspect-[4/3] overflow-hidden mb-6">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <h3 className="font-display text-xl text-creme mb-1">
              {item.title}
            </h3>
            <p className="text-or text-xs tracking-[0.15em] uppercase mb-3">
              {item.origin}
            </p>
            <p className="text-pierre/70 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
