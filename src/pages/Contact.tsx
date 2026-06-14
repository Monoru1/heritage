import { Section, SectionLabel } from "@/components/ui/Section";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Users } from "lucide-react";

const INFO = [
  {
    icon: MapPin,
    label: "Adresse",
    lines: ["237 Chemin des Collines", "13100 Aix-en-Provence"],
    link: "https://maps.google.com/?q=Aix-en-Provence+Chemin+des+Collines",
  },
  {
    icon: Phone,
    label: "Téléphone",
    lines: ["+33 4 42 00 00 00"],
    link: "tel:+33442000000",
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["contact@heritage-restaurant.fr"],
    link: "mailto:contact@heritage-restaurant.fr",
  },
  {
    icon: Clock,
    label: "Horaires",
    lines: [
      "Mercredi — Dimanche",
      "Déjeuner : 12h00 – 14h00",
      "Dîner : 19h30 – 22h00",
      "Fermé lundi & mardi",
    ],
  },
];

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/65 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-10 w-full">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-creme">Nous trouver</h1>
        </div>
      </div>

      <Section className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Info blocks */}
          <div className="space-y-8">
            {INFO.map(({ icon: Icon, label, lines, link }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-5"
              >
                <div className="w-10 h-10 border border-or/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} className="text-or" />
                </div>
                <div>
                  <p className="text-or text-xs tracking-[0.15em] uppercase mb-2">{label}</p>
                  {lines.map((line, j) => (
                    <p key={j} className="text-creme/75 text-sm leading-relaxed">{line}</p>
                  ))}
                  {link && (
                    <a href={link}
                      target={link.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-or/60 text-xs hover:text-or transition-colors mt-1.5 inline-block tracking-wide"
                    >
                      {link.startsWith("https://maps") ? "Voir sur la carte →" : ""}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="aspect-[4/3] bg-void-light border border-pierre/10 flex flex-col items-center justify-center gap-4">
              <MapPin className="text-or/40" size={36} strokeWidth={1} />
              <div className="text-center px-4">
                <p className="text-pierre/50 text-sm">Aix-en-Provence, Provence</p>
                <p className="text-pierre/30 text-xs mt-1">13100 France</p>
              </div>
              <a
                href="https://maps.google.com/?q=Aix-en-Provence"
                target="_blank"
                rel="noopener noreferrer"
                className="text-or text-xs tracking-[0.1em] uppercase border border-or/40 px-4 py-2 hover:bg-or hover:text-void transition-all"
              >
                Ouvrir dans Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Privatisation section */}
      <section className="relative py-24 overflow-hidden mt-8">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-void/80" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <Users size={20} className="text-or mr-3" strokeWidth={1.5} />
            <span className="text-or text-xs tracking-[0.2em] uppercase">Événements privés</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-creme mb-6">
            Privatisation & événements
          </h2>
          <p className="text-pierre/70 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Le restaurant HÉRITAGE se privatise pour vos dîners d'affaires, anniversaires,
            mariages et célébrations. Jusqu'à 80 convives en salle, menus sur-mesure,
            accord mets et vins personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:evenements@heritage-restaurant.fr"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-or text-void text-sm tracking-[0.1em] uppercase hover:bg-or-light transition-colors"
            >
              Demander un devis
            </a>
            <a
              href="tel:+33442000000"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-creme/30 text-creme text-sm tracking-[0.1em] uppercase hover:border-creme/60 transition-colors"
            >
              +33 4 42 00 00 00
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
