import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvailableDates, useTimeSlots } from "@/hooks/useAvailability";
import { useCreateReservation } from "@/hooks/useReservation";
import { Section, SectionLabel } from "@/components/ui/Section";
import { formatDate, formatTime, cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Users,
  User,
  Check,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import type { ReservationInsert } from "@/types/database";

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS: Record<Step, string> = {
  1: "Date",
  2: "Heure",
  3: "Convives",
  4: "Coordonnées",
  5: "Confirmé",
};

const STEP_ICONS: Record<Step, typeof Calendar> = {
  1: Calendar,
  2: Clock,
  3: Users,
  4: User,
  5: Check,
};

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ReservationPage() {
  const [step, setStep] = useState<Step>(1);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(2);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const { data: availableDates, isLoading: datesLoading } = useAvailableDates();
  const { data: slots, isLoading: slotsLoading } = useTimeSlots(date);
  const mutation = useCreateReservation();

  // Group available dates by month for display
  const datesByMonth = useMemo(() => {
    if (!availableDates) return {};
    const groups: Record<string, string[]> = {};
    for (const d of availableDates) {
      const monthKey = d.slice(0, 7); // YYYY-MM
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(d);
    }
    return groups;
  }, [availableDates]);

  const canSubmit =
    contact.firstName.trim() &&
    contact.lastName.trim() &&
    contact.email.trim() &&
    contact.phone.trim();

  async function handleSubmit() {
    if (!date || !time || !canSubmit) return;

    const payload: ReservationInsert = {
      first_name: contact.firstName.trim(),
      last_name: contact.lastName.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      reservation_date: date,
      reservation_time: time,
      guests,
      notes: contact.notes.trim() || undefined,
    };

    try {
      await mutation.mutateAsync(payload);
      setStep(5);
    } catch {
      // Error handled by mutation state
    }
  }

  const slideVariant = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[320px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <SectionLabel>Réservation</SectionLabel>
          <h1 className="font-display text-5xl md:text-7xl text-creme">
            Votre table
          </h1>
        </div>
      </div>

      <Section className="pt-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          {step < 5 && (
            <div className="flex items-center justify-between mb-16">
              {([1, 2, 3, 4] as Step[]).map((s) => {
                const Icon = STEP_ICONS[s];
                const done = step > s;
                const current = step === s;
                return (
                  <div key={s} className="flex items-center gap-3 flex-1">
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center border transition-colors duration-300",
                        done
                          ? "bg-or border-or text-void"
                          : current
                            ? "border-or text-or"
                            : "border-pierre/20 text-pierre/30"
                      )}
                    >
                      {done ? (
                        <Check size={16} />
                      ) : (
                        <Icon size={16} />
                      )}
                    </div>
                    {s < 4 && (
                      <div
                        className={cn(
                          "flex-1 h-px transition-colors duration-300",
                          done ? "bg-or/40" : "bg-pierre/10"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Back button */}
          {step > 1 && step < 5 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex items-center gap-2 text-pierre/50 text-sm hover:text-creme transition-colors mb-8"
            >
              <ChevronLeft size={16} />
              Retour
            </button>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {/* Step 1 — Date */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariant}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-3xl text-creme mb-2">
                  Choisissez une date
                </h2>
                <p className="text-pierre/60 text-sm mb-8">
                  Créneaux disponibles pour les 30 prochains jours.
                </p>

                {datesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-or" size={24} />
                  </div>
                ) : (
                  Object.entries(datesByMonth).map(([monthKey, dates]) => {
                    const monthLabel = new Intl.DateTimeFormat("fr-FR", {
                      month: "long",
                      year: "numeric",
                    }).format(new Date(monthKey + "-01"));

                    return (
                      <div key={monthKey} className="mb-8">
                        <h3 className="text-or text-xs tracking-[0.15em] uppercase mb-4">
                          {monthLabel}
                        </h3>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                          {dates.map((d) => {
                            const dayLabel = new Intl.DateTimeFormat("fr-FR", {
                              weekday: "short",
                              day: "numeric",
                            }).format(new Date(d));
                            return (
                              <button
                                key={d}
                                onClick={() => {
                                  setDate(d);
                                  setTime(null);
                                  setStep(2);
                                }}
                                className={cn(
                                  "py-3 px-2 border text-sm text-center transition-all duration-200",
                                  date === d
                                    ? "border-or bg-or/10 text-or"
                                    : "border-pierre/10 text-creme/70 hover:border-or/40 hover:text-creme"
                                )}
                              >
                                {dayLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* Step 2 — Time */}
            {step === 2 && date && (
              <motion.div
                key="step2"
                variants={slideVariant}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-3xl text-creme mb-2">
                  Choisissez l'heure
                </h2>
                <p className="text-pierre/60 text-sm mb-8">
                  {formatDate(date)}
                </p>

                {slotsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-or" size={24} />
                  </div>
                ) : (
                  <>
                    {/* Group by service */}
                    {["midi", "soir"].map((service) => {
                      const serviceSlots = slots?.filter((s) => {
                        const hour = parseInt(s.slot_time.split(":")[0]);
                        return service === "midi"
                          ? hour < 15
                          : hour >= 15;
                      });

                      if (!serviceSlots?.length) return null;

                      return (
                        <div key={service} className="mb-8">
                          <h3 className="text-or text-xs tracking-[0.15em] uppercase mb-4">
                            {service === "midi" ? "Service du midi" : "Service du soir"}
                          </h3>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {serviceSlots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => {
                                  setTime(slot.slot_time);
                                  setStep(3);
                                }}
                                className={cn(
                                  "py-3 border text-sm transition-all duration-200",
                                  time === slot.slot_time
                                    ? "border-or bg-or/10 text-or"
                                    : "border-pierre/10 text-creme/70 hover:border-or/40"
                                )}
                              >
                                {formatTime(slot.slot_time)}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </motion.div>
            )}

            {/* Step 3 — Guests */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariant}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-3xl text-creme mb-2">
                  Nombre de convives
                </h2>
                <p className="text-pierre/60 text-sm mb-8">
                  {formatDate(date!)} · {formatTime(time!)}
                </p>

                <div className="grid grid-cols-4 gap-3 mb-10">
                  {GUEST_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setGuests(n)}
                      className={cn(
                        "py-4 border text-lg font-display transition-all duration-200",
                        guests === n
                          ? "border-or bg-or/10 text-or"
                          : "border-pierre/10 text-creme/70 hover:border-or/40"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full py-3.5 bg-or text-void text-sm tracking-[0.1em] uppercase font-medium hover:bg-or-light transition-colors"
                >
                  Continuer
                </button>
              </motion.div>
            )}

            {/* Step 4 — Contact */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideVariant}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-3xl text-creme mb-2">
                  Vos coordonnées
                </h2>
                <p className="text-pierre/60 text-sm mb-8">
                  {formatDate(date!)} · {formatTime(time!)} · {guests}{" "}
                  {guests > 1 ? "personnes" : "personne"}
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={contact.firstName}
                      onChange={(e) =>
                        setContact({ ...contact, firstName: e.target.value })
                      }
                      className="w-full bg-transparent border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Nom"
                      value={contact.lastName}
                      onChange={(e) =>
                        setContact({ ...contact, lastName: e.target.value })
                      }
                      className="w-full bg-transparent border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none transition-colors"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                    className="w-full bg-transparent border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact({ ...contact, phone: e.target.value })
                    }
                    className="w-full bg-transparent border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none transition-colors"
                  />
                  <textarea
                    placeholder="Demandes particulières (allergies, occasion…)"
                    value={contact.notes}
                    onChange={(e) =>
                      setContact({ ...contact, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-transparent border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none transition-colors resize-none"
                  />
                </div>

                {mutation.isError && (
                  <p className="text-error text-sm mt-4">
                    Une erreur est survenue. Veuillez réessayer.
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || mutation.isPending}
                  className={cn(
                    "w-full mt-8 py-3.5 text-sm tracking-[0.1em] uppercase font-medium transition-colors",
                    canSubmit
                      ? "bg-or text-void hover:bg-or-light"
                      : "bg-pierre/20 text-pierre/40 cursor-not-allowed"
                  )}
                >
                  {mutation.isPending ? (
                    <Loader2 className="animate-spin mx-auto" size={18} />
                  ) : (
                    "Confirmer la réservation"
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 5 — Confirmation */}
            {step === 5 && (
              <motion.div
                key="step5"
                variants={slideVariant}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 border-2 border-or flex items-center justify-center mx-auto mb-8">
                  <Check className="text-or" size={28} />
                </div>
                <h2 className="font-display text-4xl text-creme mb-4">
                  Merci, {contact.firstName}
                </h2>
                <p className="text-pierre/70 text-lg mb-8">
                  Votre réservation a été enregistrée.
                </p>

                <div className="inline-flex flex-col gap-3 text-left bg-void-light border border-pierre/10 px-8 py-6">
                  <div className="flex gap-4 text-sm">
                    <Calendar size={16} className="text-or mt-0.5" />
                    <span className="text-creme">{formatDate(date!)}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <Clock size={16} className="text-or mt-0.5" />
                    <span className="text-creme">{formatTime(time!)}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <Users size={16} className="text-or mt-0.5" />
                    <span className="text-creme">
                      {guests} {guests > 1 ? "personnes" : "personne"}
                    </span>
                  </div>
                </div>

                <p className="text-pierre/50 text-sm mt-8">
                  Un email de confirmation sera envoyé à{" "}
                  <span className="text-creme">{contact.email}</span>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
