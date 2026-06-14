import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-pierre/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl tracking-[0.15em] text-creme mb-4">
              HÉRITAGE
            </h3>
            <p className="text-pierre/80 text-sm leading-relaxed max-w-xs">
              L'âme du Sud de la France dans chaque assiette. Cuisine
              gastronomique provençale, produits du terroir, vue sur les
              collines.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm tracking-[0.12em] uppercase text-or mb-6">
              Explorer
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/histoire", label: "Notre histoire" },
                { href: "/menu", label: "La carte" },
                { href: "/galerie", label: "Galerie" },
                { href: "/reservation", label: "Réserver" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-pierre/70 hover:text-creme transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-[0.12em] uppercase text-or mb-6">
              Nous trouver
            </h4>
            <div className="flex flex-col gap-4 text-sm text-pierre/70">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-or mt-0.5 shrink-0" />
                <span>
                  237 Chemin des Collines
                  <br />
                  13100 Aix-en-Provence
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-or shrink-0" />
                <span>+33 4 42 00 00 00</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-or shrink-0" />
                <span>contact@heritage-restaurant.fr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-pierre/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-pierre/40">
            © {new Date().getFullYear()} HÉRITAGE — Tous droits réservés
          </p>
          <p className="text-xs text-pierre/40">
            Ouvert du mercredi au dimanche · Midi & Soir
          </p>
        </div>
      </div>
    </footer>
  );
}
