import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCrud from "@/pages/AdminCrud";
import { useAuth } from "@/hooks/useAuth";
import { useAdminReservations, useAdminTables, useReservationStats, useUpdateReservationStatus } from "@/hooks/useAdmin";
import { cn, formatTime } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import type { ReservationStatus } from "@/types/database";
import {
  BarChart3, CalendarDays, Check, ChefHat, Clock, Image,
  LayoutGrid, Loader2, LogOut, MapPin, Search, Users, X,
} from "lucide-react";

type AdminSection = "reservations" | "menu" | "gallery" | "tables" | "availability" | "stats";
type CrudSection  = "menu" | "gallery" | "tables" | "availability";

const VALID_SECTIONS: AdminSection[] = ["reservations", "menu", "gallery", "tables", "availability", "stats"];

const statusLabels: Record<ReservationStatus, string> = {
  pending: "En attente", confirmed: "Confirmée", seated: "En salle",
  cancelled: "Annulée", no_show: "Absent",
};
const statusClass: Record<ReservationStatus, string> = {
  pending:   "border-yellow-500/30 text-yellow-300 bg-yellow-500/10",
  confirmed: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
  seated:    "border-blue-500/30 text-blue-300 bg-blue-500/10",
  cancelled: "border-red-500/30 text-red-300 bg-red-500/10",
  no_show:   "border-pierre/20 text-pierre/50 bg-pierre/10",
};
const locationLabels: Record<string, string> = {
  interieur: "Intérieur", terrasse: "Terrasse", indifferent: "Peu importe",
};

const sections = [
  { id: "reservations", label: "Réservations",   icon: CalendarDays },
  { id: "menu",         label: "Carte",           icon: ChefHat },
  { id: "gallery",      label: "Galerie",         icon: Image },
  { id: "tables",       label: "Tables",          icon: LayoutGrid },
  { id: "availability", label: "Disponibilités",  icon: Clock },
  { id: "stats",        label: "Statistiques",    icon: BarChart3 },
] as const;

/* ── Login ── */
function LoginBox({ onLogin }: { onLogin: (email: string, password: string) => Promise<{ error: unknown }> }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    const r = await onLogin(String(f.get("email") ?? ""), String(f.get("password") ?? ""));
    if (r.error) setError("Identifiants incorrects.");
    setBusy(false);
  }

  return (
    <div className="min-h-screen bg-void text-creme flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md border border-pierre/10 bg-void-light p-8 shadow-2xl shadow-black/40">
        <p className="text-or text-[10px] uppercase tracking-[0.32em] mb-3">Héritage</p>
        <h1 className="font-display text-4xl mb-2">Administration</h1>
        <p className="text-pierre/45 text-sm mb-8 leading-relaxed">
          Connectez-vous pour gérer le restaurant depuis une seule interface.
        </p>
        <input name="email" type="email" placeholder="Email"
          className="w-full bg-void border border-pierre/15 px-4 py-3 mb-3 text-sm outline-none focus:border-or" required />
        <input name="password" type="password" placeholder="Mot de passe"
          className="w-full bg-void border border-pierre/15 px-4 py-3 mb-4 text-sm outline-none focus:border-or" required />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button disabled={busy}
          className="w-full bg-or text-void py-3 text-xs uppercase tracking-[0.18em] font-medium disabled:opacity-60 flex items-center justify-center gap-2">
          {busy && <Loader2 size={14} className="animate-spin" />} Se connecter
        </button>
      </form>
    </div>
  );
}

/* ── Reservations ── */
function ReservationsVisual() {
  const { data, isLoading }  = useAdminReservations();
  const { data: tables }     = useAdminTables();
  const update               = useUpdateReservationStatus();
  const [q, setQ]            = useState("");
  const [filter, setFilter]  = useState<ReservationStatus | "all">("all");

  const tableById = useMemo(() => new Map((tables ?? []).map((t) => [t.id, t])), [tables]);

  const rows = useMemo(() =>
    (data ?? []).filter((r) =>
      (!q || `${r.first_name} ${r.last_name} ${r.email} ${r.phone}`.toLowerCase().includes(q.toLowerCase()))
      && (filter === "all" || r.status === filter)
    ),
    [data, q, filter]
  );

  const today = new Date().toISOString().slice(0, 10);
  const stats = {
    total:   (data ?? []).length,
    today:   (data ?? []).filter((r) => r.reservation_date === today).length,
    pending: (data ?? []).filter((r) => r.status === "pending").length,
    guests:  (data ?? []).reduce((s, r) => s + Number(r.guests ?? 0), 0),
  };

  async function change(id: string, status: ReservationStatus) {
    try {
      await update.mutateAsync({ id, status });
      toast(
        status === "confirmed" ? "Réservation confirmée — table assignée automatiquement"
        : status === "seated"  ? "Client installé en salle"
        : status === "cancelled" ? "Réservation annulée"
        : "Réservation mise à jour",
        "success"
      );
    } catch (e) {
      toast(e instanceof Error ? e.message : "Erreur réservation", "error");
    }
  }

  if (isLoading) return <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-or" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-or text-[10px] uppercase tracking-[0.28em] mb-2">Accueil admin</p>
        <h2 className="font-display text-4xl">Réservations</h2>
        <p className="text-pierre/45 text-sm mt-2">
          Confirmez une réservation pour attribuer automatiquement une table selon la préférence du client.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {([["Total", stats.total], ["Aujourd'hui", stats.today], ["En attente", stats.pending], ["Personnes", stats.guests]] as const).map(([k, v]) => (
          <div key={k} className="border border-pierre/10 bg-void-light p-4">
            <p className="text-pierre/40 text-[10px] uppercase tracking-[0.18em]">{k}</p>
            <p className="font-display text-3xl mt-2">{v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-[1fr_220px] gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pierre/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un client, email, téléphone..."
            className="w-full bg-void border border-pierre/15 pl-11 pr-4 py-3 text-sm outline-none focus:border-or/60" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as ReservationStatus | "all")}
          className="bg-void border border-pierre/15 px-4 py-3 text-sm outline-none focus:border-or/60">
          <option value="all">Tous les statuts</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="grid xl:grid-cols-2 gap-4">
        {rows.map((r) => {
          const table = r.table_id ? tableById.get(r.table_id) : null;
          const isPending   = r.status === "pending";
          const isConfirmed = r.status === "confirmed";
          const isActive    = isPending || isConfirmed || r.status === "seated";

          return (
            <div key={r.id} className="border border-pierre/10 bg-void-light p-5">
              {/* Header */}
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl">{r.first_name} {r.last_name}</h3>
                  <p className="text-pierre/45 text-sm">{r.email}</p>
                  <p className="text-pierre/35 text-xs">{r.phone}</p>
                </div>
                <span className={cn("h-fit border px-2 py-1 text-[10px] uppercase tracking-[0.14em]", statusClass[r.status])}>
                  {statusLabels[r.status]}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-sm">
                <div>
                  <p className="text-pierre/35 text-[10px] uppercase">Date</p>
                  <p>{new Date(r.reservation_date).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <p className="text-pierre/35 text-[10px] uppercase">Heure</p>
                  <p>{formatTime(r.reservation_time)}</p>
                </div>
                <div>
                  <p className="text-pierre/35 text-[10px] uppercase">Personnes</p>
                  <p>{r.guests}</p>
                </div>
                <div>
                  <p className="text-pierre/35 text-[10px] uppercase">Préférence</p>
                  <p>{locationLabels[r.location_preference ?? "indifferent"]}</p>
                </div>
              </div>

              {/* Table assignée */}
              <div className="mt-4 border border-pierre/10 bg-void/60 p-3 flex items-center gap-2 text-sm">
                <MapPin size={15} className="text-or shrink-0" />
                <span className="text-pierre/45">Table assignée :</span>
                <span className="text-creme">
                  {table
                    ? `Table ${table.numero} · ${table.location === "terrasse" ? "Terrasse" : "Intérieur"} · ${table.capacite} personnes`
                    : "Aucune table assignée"}
                </span>
              </div>

              {/* Notes */}
              {r.notes && (
                <p className="mt-4 border-l border-or/30 pl-3 text-pierre/50 text-sm">{r.notes}</p>
              )}

              {/* Actions */}
              {isActive && (
                <div className="flex gap-2 mt-5">
                  {isPending && (
                    <button onClick={() => change(r.id, "confirmed")}
                      disabled={update.isPending}
                      className="flex-1 border border-emerald-500/20 text-emerald-300 py-2 text-xs uppercase tracking-wider hover:bg-emerald-500/10 disabled:opacity-40 flex items-center justify-center gap-1">
                      <Check size={13} />Confirmer &amp; assigner table
                    </button>
                  )}
                  {isConfirmed && (
                    <button onClick={() => change(r.id, "seated")}
                      disabled={update.isPending}
                      className="flex-1 border border-blue-500/20 text-blue-300 py-2 text-xs uppercase tracking-wider hover:bg-blue-500/10 disabled:opacity-40 flex items-center justify-center gap-1">
                      <Users size={13} />Installer en salle
                    </button>
                  )}
                  {(isPending || isConfirmed) && (
                    <button onClick={() => change(r.id, "cancelled")}
                      disabled={update.isPending}
                      className="px-4 border border-red-500/20 text-red-300 hover:bg-red-500/10 disabled:opacity-40">
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <div className="border border-pierre/10 bg-void-light p-10 text-center text-pierre/40">
          Aucune réservation trouvée.
        </div>
      )}
    </div>
  );
}

/* ── Stats ── */
function StatsPanel() {
  const { data } = useReservationStats();
  const total  = (data ?? []).length;
  const guests = (data ?? []).reduce((s, r) => s + Number(r.guests ?? 0), 0);
  const byStatus = (data ?? []).reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <p className="text-or text-[10px] uppercase tracking-[0.28em] mb-2">Pilotage</p>
      <h2 className="font-display text-4xl mb-6">Statistiques</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border border-pierre/10 bg-void-light p-5">
          <p className="text-pierre/40 text-xs uppercase">Total réservations</p>
          <p className="font-display text-4xl mt-3">{total}</p>
        </div>
        <div className="border border-pierre/10 bg-void-light p-5">
          <p className="text-pierre/40 text-xs uppercase">Total personnes</p>
          <p className="font-display text-4xl mt-3">{guests}</p>
        </div>
        {Object.entries(statusLabels).map(([k, label]) => (
          <div key={k} className="border border-pierre/10 bg-void-light p-5">
            <p className="text-pierre/40 text-xs uppercase">{label}</p>
            <p className="font-display text-4xl mt-3">{byStatus[k] ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AdminManage() {
  const { user, loading, signIn, signOut } = useAuth();
  const { section: urlSection } = useParams<{ section?: string }>();
  const navigate = useNavigate();

  // Derive active section from URL, default to "reservations"
  const section: AdminSection =
    urlSection && VALID_SECTIONS.includes(urlSection as AdminSection)
      ? (urlSection as AdminSection)
      : "reservations";

  function goTo(s: AdminSection) {
    navigate(`/admin/${s}`, { replace: false });
  }

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <Loader2 className="animate-spin text-or" />
    </div>
  );

  if (!user) return <LoginBox onLogin={signIn} />;

  const isCrud = (["menu", "gallery", "tables", "availability"] as const).includes(section as CrudSection);

  return (
    <div className="min-h-screen bg-void text-creme">
      {/* Header */}
      <header className="border-b border-pierre/10 bg-void-light/95 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-or text-[10px] uppercase tracking-[0.28em]">Administration privée</p>
            <h1 className="font-display text-2xl sm:text-3xl">Héritage — Gestion restaurant</h1>
          </div>
          <button onClick={signOut}
            className="flex items-center gap-2 text-pierre/50 hover:text-red-400 text-sm shrink-0">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>

        {/* Nav — tabs reliées à l'URL */}
        <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-4 flex gap-2 overflow-x-auto">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => goTo(id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 border text-[10px] uppercase tracking-[0.15em] whitespace-nowrap transition-colors",
                section === id
                  ? "border-or text-or bg-or/5"
                  : "border-pierre/10 text-pierre/45 hover:text-creme hover:border-pierre/30"
              )}>
              <Icon size={14} />{label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        <section className="min-w-0 overflow-hidden border border-pierre/10 bg-black/15 p-4 sm:p-6">
          {section === "reservations" && <ReservationsVisual />}
          {isCrud && (
            <AdminCrud
              initialTab={section as CrudSection}
              externalTab={section as CrudSection}
              onTabChange={(t) => goTo(t)}
            />
          )}
          {section === "stats" && <StatsPanel />}
        </section>
      </main>
    </div>
  );
}
