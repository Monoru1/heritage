import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let listeners: Array<(t: ToastItem) => void> = [];

export function toast(message: string, type: ToastType = "success") {
  const item: ToastItem = { id: Date.now().toString(), message, type };
  listeners.forEach((fn) => fn(item));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const fn = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3500);
    };
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: 8,  scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm pointer-events-auto shadow-xl",
              "border backdrop-blur-sm min-w-[240px] max-w-[340px]",
              t.type === "success" && "bg-void border-success/40 text-creme",
              t.type === "error"   && "bg-void border-error/40 text-creme",
              t.type === "info"    && "bg-void border-pierre/30 text-creme",
            )}
          >
            {t.type === "success" && <Check   size={15} className="text-success shrink-0" />}
            {t.type === "error"   && <AlertCircle size={15} className="text-error shrink-0" />}
            {t.type === "info"    && <AlertCircle size={15} className="text-pierre shrink-0" />}
            <span className="leading-snug">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
