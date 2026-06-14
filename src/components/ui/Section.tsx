import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn("py-24 md:py-32 px-6", className)}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </motion.section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="w-8 h-px bg-or" />
      <span className="text-or text-xs tracking-[0.2em] uppercase">
        {children}
      </span>
    </div>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-4xl md:text-5xl lg:text-6xl text-creme mb-6",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function SectionText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-pierre/80 text-lg leading-relaxed max-w-2xl",
        className
      )}
    >
      {children}
    </p>
  );
}
