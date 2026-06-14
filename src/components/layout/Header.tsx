import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",          label: "Accueil" },
  { href: "/histoire",  label: "Notre histoire" },
  { href: "/menu",      label: "La carte" },
  { href: "/galerie",   label: "Galerie" },
  { href: "/contact",   label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-void/95 backdrop-blur-md border-b border-pierre/10 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-18 md:h-20">

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl sm:text-2xl tracking-[0.15em] text-creme hover:text-or transition-colors shrink-0"
          >
            HÉRITAGE
          </Link>

          {/* Desktop nav — seulement si assez de place */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-xs xl:text-sm tracking-[0.08em] uppercase transition-colors duration-300 whitespace-nowrap",
                  location.pathname === link.href
                    ? "text-or"
                    : "text-creme/70 hover:text-creme"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/reservation"
              className="hidden lg:inline-flex items-center px-5 py-2 border border-or/60 text-or text-xs tracking-[0.1em] uppercase hover:bg-or hover:text-void transition-all duration-300 whitespace-nowrap"
            >
              Réserver
            </Link>

            {/* Mobile: Réserver + hamburger */}
            <Link
              to="/reservation"
              className="lg:hidden text-or text-xs tracking-[0.08em] uppercase border border-or/50 px-3 py-1.5"
            >
              Réserver
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-creme p-1.5 -mr-1"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-void/98 backdrop-blur-xl flex flex-col items-center justify-center px-6"
          >
            <nav className="flex flex-col items-center gap-6 w-full max-w-xs">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="w-full text-center"
                >
                  <Link
                    to={link.href}
                    className={cn(
                      "font-display text-3xl tracking-wide transition-colors block py-1",
                      location.pathname === link.href
                        ? "text-or"
                        : "text-creme/80 hover:text-creme"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.07 }}
                className="w-full mt-4"
              >
                <Link
                  to="/reservation"
                  className="block w-full text-center py-3.5 bg-or text-void font-display text-lg tracking-wider hover:bg-or-light transition-all"
                >
                  Réserver une table
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
