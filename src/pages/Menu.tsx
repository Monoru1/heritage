import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "@/hooks/useMenu";
import { Section, SectionLabel, SectionTitle, SectionText } from "@/components/ui/Section";
import MenuCard from "@/components/menu/MenuCard";
import {
  MENU_CATEGORIES,
  MENU_CATEGORY_LABELS,
  type MenuCategory,
} from "@/types/database";
import { cn } from "@/lib/utils";

export default function MenuPage() {
  const { data: items, isLoading, error } = useMenu();
  const [active, setActive] = useState<MenuCategory>("entrees");

  const filtered = items?.filter((item) => item.category === active) ?? [];

  return (
    <>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <SectionLabel>La carte</SectionLabel>
          <h1 className="font-display text-5xl md:text-7xl text-creme">
            Notre carte
          </h1>
        </div>
      </div>

      <Section className="pt-8">
        <SectionText className="mb-12">
          Chaque plat raconte le marché du matin. La carte évolue avec les
          saisons et l'inspiration du chef.
        </SectionText>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-16 border-b border-pierre/10 pb-4">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "relative px-5 py-2 text-sm tracking-[0.08em] uppercase transition-colors duration-300",
                active === cat
                  ? "text-or"
                  : "text-pierre/50 hover:text-creme"
              )}
            >
              {MENU_CATEGORY_LABELS[cat]}
              {active === cat && (
                <motion.div
                  layoutId="menu-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-or"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border border-or/30 border-t-or rounded-full animate-spin mx-auto" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 text-pierre/50">
            Impossible de charger le menu. Veuillez réessayer.
          </div>
        )}

        {/* Items grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          >
            {filtered.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-pierre/40 py-16">
            Aucun élément dans cette catégorie.
          </p>
        )}
      </Section>
    </>
  );
}
