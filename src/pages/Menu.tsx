import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "@/hooks/useMenu";
import { Section, SectionLabel, SectionText } from "@/components/ui/Section";
import { MENU_CATEGORIES, MENU_CATEGORY_LABELS, type MenuCategory } from "@/types/database";
import { formatPrice, cn } from "@/lib/utils";

/* ---- Skeleton ---- */
function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[16/10] bg-pierre/10 mb-4" />
          <div className="h-4 bg-pierre/10 rounded w-2/3 mb-2" />
          <div className="h-3 bg-pierre/5 rounded w-full mb-1" />
          <div className="h-3 bg-pierre/5 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

/* ---- Card ---- */
function MenuCard({ item, index }: { item: ReturnType<typeof useMenu>["data"] extends (infer T)[] | undefined ? T : never; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group"
    >
      {item.image_url && (
        <div className="aspect-[16/10] overflow-hidden mb-4">
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            <h3 className="font-display text-lg sm:text-xl text-creme leading-tight">
              {item.name}
            </h3>
            {item.is_specialty && (
              <span className="text-[9px] tracking-[0.18em] uppercase text-or border border-or/40 px-1.5 py-0.5 shrink-0">
                Signature
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-pierre/60 text-sm leading-relaxed line-clamp-3">
              {item.description}
            </p>
          )}
          {item.region && (
            <p className="text-olive-light text-xs mt-1.5 tracking-[0.1em] uppercase">
              {item.region}
            </p>
          )}
        </div>
        <span className="font-display text-or text-base sm:text-lg whitespace-nowrap mt-0.5 shrink-0">
          {formatPrice(item.price)}
        </span>
      </div>
    </motion.article>
  );
}

/* ---- Page ---- */
export default function MenuPage() {
  const { data: items, isLoading, error } = useMenu();
  const [active, setActive] = useState<MenuCategory>("entrees");

  const filtered = (items ?? []).filter((i) => i.category === active);

  return (
    <>
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[300px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/65 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-10 w-full">
          <SectionLabel>La carte</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-creme">Notre carte</h1>
        </div>
      </div>

      <Section className="pt-8 pb-24">
        <SectionText className="mb-10">
          Chaque plat raconte le marché du matin. La carte évolue avec les saisons et l'inspiration du chef.
        </SectionText>

        {/* Tabs — scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 mb-12">
          <div className="flex gap-0 border-b border-pierre/10 min-w-max sm:min-w-0">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "relative px-4 sm:px-6 py-3 text-xs sm:text-sm tracking-[0.1em] uppercase transition-colors duration-200 whitespace-nowrap",
                  active === cat ? "text-or" : "text-pierre/50 hover:text-creme"
                )}
              >
                {MENU_CATEGORY_LABELS[cat]}
                {active === cat && (
                  <motion.div layoutId="tab-line"
                    className="absolute bottom-0 left-0 right-0 h-px bg-or"
                    transition={{ duration: 0.25 }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading && <MenuSkeleton />}

        {error && (
          <div className="text-center py-16 text-pierre/40">
            <p className="mb-2">Impossible de charger la carte.</p>
            <p className="text-xs">Vérifiez votre connexion et rechargez la page.</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isLoading && !error && (
            <motion.div
              key={active}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-pierre/30">
                  <p className="font-display text-2xl mb-2">Bientôt disponible</p>
                  <p className="text-sm">Cette catégorie sera disponible très prochainement.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {filtered.map((item, i) => (
                    <MenuCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
    </>
  );
}
