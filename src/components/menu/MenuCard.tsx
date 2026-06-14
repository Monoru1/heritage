import { motion } from "framer-motion";
import type { MenuItem } from "@/types/database";
import { formatPrice } from "@/lib/utils";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export default function MenuCard({ item, index }: MenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      {/* Image */}
      {item.image_url && (
        <div className="aspect-[16/10] overflow-hidden mb-4">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl text-creme">
              {item.name}
            </h3>
            {item.is_specialty && (
              <span className="text-[10px] tracking-[0.15em] uppercase text-or border border-or/30 px-2 py-0.5">
                Spécialité
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-pierre/60 text-sm mt-1.5 leading-relaxed">
              {item.description}
            </p>
          )}
          {item.region && (
            <p className="text-olive text-xs mt-1.5 tracking-[0.1em] uppercase">
              {item.region}
            </p>
          )}
        </div>
        <span className="font-display text-or text-lg whitespace-nowrap mt-1">
          {formatPrice(item.price)}
        </span>
      </div>
    </motion.div>
  );
}
