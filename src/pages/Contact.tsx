import { Section, SectionLabel } from "@/components/ui/Section";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const INFO = [
  {
    icon: MapPin,
    label: "Adresse",
    lines: ["237 Chemin des Collines", "13100 Aix-en-Provence"],
  },
  {
    icon: Phone,
    label: "Téléphone",
    lines: ["+33 4 42 00 00 00"],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["contact@heritage-restaurant.fr"],
  },
  {
    icon: Clock,
    label: "Horaires",
    lines: [
      "Mercredi — Dimanche",
      "Déjeuner : 12h00 — 14h00",
      "Dîner : 19h30 — 22h00",
    ],
  },
];

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[320px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="font-display text-5xl md:text-7xl text-creme">
            Nous trouver
          </h1>
        </div>
      </div>

      <Section className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-10">
            {INFO.map(({ icon: Icon, label, lines }) => (
              <div key={label} className="flex gap-5">
                <div className="w-10 h-10 border border-or/30 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-or" />
                </div>
                <div>
                  <h3 className="text-or text-xs tracking-[0.15em] uppercase mb-2">
                    {label}
                  </h3>
                  {lines.map((line) => (
                    <p key={line} className="text-creme/80 text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="aspect-[4/3] bg-void-light border border-pierre/10 flex items-center justify-center">
            <div className="text-center px-6">
              <MapPin className="text-or mx-auto mb-4" size={32} />
              <p className="text-pierre/50 text-sm">
                Carte interactive
                <br />
                <span className="text-xs">
                  Intégration Google Maps disponible
                </span>
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
