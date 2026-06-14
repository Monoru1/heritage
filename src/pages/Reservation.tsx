import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvailableDates, useTimeSlots } from "@/hooks/useAvailability";
import { useCreateReservation } from "@/hooks/useReservation";
import { Section, SectionLabel } from "@/components/ui/Section";
import { formatDate, formatTime, cn } from "@/lib/utils";
import {
  Calendar, Clock, Users, User, Check,
  ChevronLeft, Loader2,
} from "lucide-react";
import type { ReservationInsert } from "@/types/database";

type Step = 1 | 2 | 3 | 4 | 5;

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const slide = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: -24 },
};

/* ---- Progress indicator ---- */
function StepBar({ current }: { current: Step }) {
  const steps = [
    { id: 1, icon: Calendar, label: "Date" },
    { id: 2, icon: Clock,    label: "Heure" },
    { id: 3, icon: Users,    label: "Convives" },
    { id: 4, icon: User,     label: "Coordonnées" },
  ] as const;

  return (
    <div className="flex items-center mb-10 md:mb-14">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-9 h-9 flex items-center justify-center border transition-all duration-300",
                done   ? "bg-or border-or text-void"
                : active ? "border-or text-or"
                :          "border-pierre/20 text-pierre/30"
              )}>
                {done ? <Check size={14} /> : <Icon size={14} />}
              </div>
              <span className={cn(
                "text-[10px] tracking-wider uppercase hidden sm:block",
                active ? "text-or" : "text-pierre/30"
              )}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-px mx-2 transition-colors duration-500",
                current > s.id ? "bg-or/40" : "bg-pierre/10"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---- Input ---- */
function Field({
  type = "text", placeholder, value, onChange, required,
}: {
  type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : "off"}
      className="w-full bg-transparent border border-pierre/20 px-4 py-3 text-creme
        placeholder:text-pierre/30 focus:border-or/60 outline-none transition-colors
        text-sm"
    />
  );
}

/* ---- Main page ---- */
export default function ReservationPage() {
  const [step, setStep]       = useState<Step>(1);
  const [date, setDate]       = useState<string | null>(null);
  const [time, setTime]       = useState<string | null>(null);
  const [guests, setGuests]   = useState(2);
  const [contact, setContact] = useState({
    firstName: "", lastName: "", email: "", phone: "", notes: "",
  });
  const submitting = useRef(false);

  const { data: availableDates, isLoading: datesLoading } = useAvailableDates();
  const { data: slots,          isLoading: slotsLoading  } = useTimeSlots(date);
  const mutation = useCreateReservation();

  /* -- group dates by month -- */
  const datesByMonth: Record<string, string[]> = {};
  (availableDates ?? []).forEach((d) => {
    const key = d.slice(0, 7);
    if (!datesByMonth[key]) datesByMonth[key] = [];
    datesByMonth[key].push(d);
  });

  const canSubmit =
    contact.firstName.trim() &&
    contact.lastName.trim() &&
    contact.email.trim() &&
    contact.phone.trim();

  async function handleSubmit() {
    if (!date || !time || !canSubmit || submitting.current) return;
    submitting.current = true;

    const payload: ReservationInsert = {
      first_name:       contact.firstName.trim(),
      last_name:        contact.lastName.trim(),
      email:            contact.email.trim(),
      phone:            contact.phone.trim(),
      reservation_date: date,
      reservation_time: time,
      guests:           Number(guests),
      notes:            contact.notes.trim() || undefined,
    };

    try {
      await mutation.mutateAsync(payload);
      setStep(5);
    } catch {
      // error shown by mutation.isError
    } finally {
      submitting.current = false;
    }
  }

  return (
    <>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-10 w-full">
          <SectionLabel>Réservation</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-creme">
            Votre table
          </h1>
        </div>
      </div>

      <Section className="pt-8 pb-20">
        <div className="max-w-xl mx-auto w-full">

          {step < 5 && <StepBar current={step} />}

          {step > 1 && step < 5 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex items-center gap-1.5 text-pierre/50 text-xs uppercase tracking-wider hover:text-creme transition-colors mb-8"
            >
              <ChevronLeft size={14} /> Retour
            </button>
          )}

          <AnimatePresence mode="wait">

            {/* STEP 1 — Date */}
            {step === 1 && (
              <motion.div key="s1" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="font-display text-2xl sm:text-3xl text-creme mb-2">Choisissez une date</h2>
                <p className="text-pierre/50 text-sm mb-8">Disponibilités sur les 30 prochains jours.</p>

                {datesLoading ? (
                  <div className="flex justify-center py-16"><div className="spinner" /></div>
                ) : Object.keys(datesByMonth).length === 0 ? (
                  <p className="text-pierre/40 text-center py-12">Aucune disponibilité pour le moment.</p>
                ) : (
                  Object.entries(datesByMonth).map(([monthKey, dates]) => {
                    const label = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" })
                      .format(new Date(monthKey + "-02"));
                    return (
                      <div key={monthKey} className="mb-8">
                        <p className="text-or text-xs tracking-[0.15em] uppercase mb-3 capitalize">{label}</p>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-1.5">
                          {dates.map((d) => {
                            const dt = new Date(d + "T12:00:00");
                            const dayNum = dt.toLocaleDateString("fr-FR", { day: "numeric" });
                            const dayName = dt.toLocaleDateString("fr-FR", { weekday: "short" });
                            return (
                              <button
                                key={d}
                                onClick={() => { setDate(d); setTime(null); setStep(2); }}
                                className={cn(
                                  "flex flex-col items-center py-2.5 px-1 border text-center transition-all duration-200 group",
                                  date === d
                                    ? "border-or bg-or/10 text-or"
                                    : "border-pierre/10 text-creme/70 hover:border-or/40 hover:text-creme"
                                )}
                              >
                                <span className="text-[10px] uppercase tracking-wide opacity-60">{dayName}</span>
                                <span className="text-base font-display mt-0.5">{dayNum}</span>
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

            {/* STEP 2 — Heure */}
            {step === 2 && date && (
              <motion.div key="s2" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="font-display text-2xl sm:text-3xl text-creme mb-2">Choisissez l'heure</h2>
                <p className="text-pierre/50 text-sm mb-8 capitalize">{formatDate(date)}</p>

                {slotsLoading ? (
                  <div className="flex justify-center py-16"><div className="spinner" /></div>
                ) : (
                  <>
                    {["12", "19"].map((prefix) => {
                      const label = prefix === "12" ? "Service du midi" : "Service du soir";
                      const group = (slots ?? []).filter((s) => s.slot_time.startsWith(prefix));
                      if (!group.length) return null;
                      return (
                        <div key={prefix} className="mb-8">
                          <p className="text-or text-xs tracking-[0.15em] uppercase mb-3">{label}</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {group.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => { setTime(slot.slot_time); setStep(3); }}
                                className={cn(
                                  "py-3 border text-sm transition-all duration-200 font-display",
                                  time === slot.slot_time
                                    ? "border-or bg-or/10 text-or"
                                    : "border-pierre/10 text-creme/70 hover:border-or/40 hover:text-creme"
                                )}
                              >
                                {formatTime(slot.slot_time)}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {(slots ?? []).length === 0 && (
                      <p className="text-pierre/40 text-center py-12">Aucun créneau disponible ce jour.</p>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 3 — Convives */}
            {step === 3 && (
              <motion.div key="s3" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="font-display text-2xl sm:text-3xl text-creme mb-2">Nombre de convives</h2>
                <p className="text-pierre/50 text-sm mb-8 capitalize">
                  {date && formatDate(date)} · {time && formatTime(time)}
                </p>

                <div className="grid grid-cols-4 gap-2 mb-10">
                  {GUEST_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setGuests(n)}
                      className={cn(
                        "py-4 border font-display text-lg transition-all duration-200",
                        guests === n
                          ? "border-or bg-or/10 text-or"
                          : "border-pierre/10 text-creme/70 hover:border-or/40 hover:text-creme"
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

            {/* STEP 4 — Contact */}
            {step === 4 && (
              <motion.div key="s4" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="font-display text-2xl sm:text-3xl text-creme mb-2">Vos coordonnées</h2>
                <p className="text-pierre/50 text-sm mb-8 capitalize">
                  {date && formatDate(date)} · {time && formatTime(time)} · {guests} {guests > 1 ? "personnes" : "personne"}
                </p>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field placeholder="Prénom *" value={contact.firstName}
                      onChange={(v) => setContact({ ...contact, firstName: v })} required />
                    <Field placeholder="Nom *"    value={contact.lastName}
                      onChange={(v) => setContact({ ...contact, lastName: v })}  required />
                  </div>
                  <Field type="email" placeholder="Email *" value={contact.email}
                    onChange={(v) => setContact({ ...contact, email: v })} required />
                  <Field type="tel"   placeholder="Téléphone *" value={contact.phone}
                    onChange={(v) => setContact({ ...contact, phone: v })} required />
                  <textarea
                    placeholder="Demandes particulières (allergies, occasion spéciale…)"
                    value={contact.notes}
                    onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border border-pierre/20 px-4 py-3 text-creme
                      placeholder:text-pierre/30 focus:border-or/60 outline-none transition-colors
                      resize-none text-sm"
                  />
                </div>

                {mutation.isError && (
                  <div className="mt-4 p-3 border border-error/30 bg-error/5 text-sm text-creme/80">
                    Une erreur est survenue. Vérifiez votre connexion et réessayez.
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || mutation.isPending}
                  className={cn(
                    "w-full mt-6 py-4 text-sm tracking-[0.1em] uppercase font-medium transition-all duration-200 flex items-center justify-center gap-2",
                    canSubmit && !mutation.isPending
                      ? "bg-or text-void hover:bg-or-light cursor-pointer"
                      : "bg-pierre/10 text-pierre/40 cursor-not-allowed"
                  )}
                >
                  {mutation.isPending
                    ? <><div className="spinner w-4 h-4" /> Confirmation en cours…</>
                    : "Confirmer la réservation"
                  }
                </button>
              </motion.div>
            )}

            {/* STEP 5 — Confirmation */}
            {step === 5 && (
              <motion.div
                key="s5"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 border-2 border-or flex items-center justify-center mx-auto mb-8"
                >
                  <Check className="text-or" size={28} />
                </motion.div>

                <h2 className="font-display text-3xl sm:text-4xl text-creme mb-3">
                  Merci, {contact.firstName}
                </h2>
                <p className="text-pierre/70 mb-10">
                  Votre réservation a bien été enregistrée. Nous vous attendons.
                </p>

                <div className="inline-flex flex-col gap-4 text-left bg-void-light border border-pierre/10 px-6 sm:px-8 py-6 w-full sm:w-auto">
                  {[
                    { Icon: Calendar, text: date ? formatDate(date) : "" },
                    { Icon: Clock,    text: time ? formatTime(time)  : "" },
                    { Icon: Users,    text: `${guests} ${guests > 1 ? "personnes" : "personne"}` },
                    { Icon: User,     text: `${contact.firstName} ${contact.lastName}` },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-4 text-sm">
                      <Icon size={15} className="text-or shrink-0" />
                      <span className="text-creme capitalize">{text}</span>
                    </div>
                  ))}
                </div>

                <p className="text-pierre/40 text-xs mt-8">
                  Confirmation envoyée à <span className="text-creme/60">{contact.email}</span>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
