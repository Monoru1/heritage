import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  useAdminReservations, useUpdateReservationStatus,
  useAdminMenu, useDeleteMenuItem,
  useAdminTables, useAdminGallery, useDeleteGalleryImage,
  useReservationStats,
} from "@/hooks/useAdmin";
import { cn, formatDate, formatTime, formatPrice } from "@/lib/utils";
import { MENU_CATEGORY_LABELS, type ReservationStatus } from "@/types/database";
import { toast } from "@/components/ui/Toast";
import {
  CalendarDays, UtensilsCrossed, Image, BarChart3,
  LogOut, Loader2, Check, X, Clock, Users, Search,
  Trash2, LayoutGrid, ChevronRight, AlertCircle,
} from "lucide-react";

/* ---- Consts ---- */
const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  seated:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  no_show:   "bg-pierre/15 text-pierre/50 border-pierre/20",
};
const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending:   "En attente",
  confirmed: "Confirmée",
  seated:    "En salle",
  cancelled: "Annulée",
  no_show:   "Absent",
};

type Tab = "reservations" | "menu" | "gallery" | "tables" | "stats";

/* ---- Login ---- */
function LoginForm({ onLogin }: { onLogin: (e: string, p: string) => Promise<{ error: unknown }> }) {
  const [email, setEmail] = useState("");
  const [pw, setPw]       = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setLoading(true); setErr("");
    const { error } = await onLogin(email, pw);
    if (error) setErr("Identifiants incorrects.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-creme mb-1">HÉRITAGE</h1>
          <p className="text-pierre/40 text-xs tracking-widest uppercase">Administration</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-void-light border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none text-sm"
            required />
          <input type="password" placeholder="Mot de passe" value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full bg-void-light border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none text-sm"
            required />
          {err && (
            <div className="flex items-center gap-2 text-error text-sm py-2">
              <AlertCircle size={14} /> {err}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-or text-void text-sm tracking-[0.1em] uppercase font-medium hover:bg-or-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={14} className="animate-spin" /> Connexion…</> : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---- Sidebar ---- */
const NAV_ITEMS: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: "reservations", label: "Réservations", icon: CalendarDays },
  { id: "menu",         label: "Carte",        icon: UtensilsCrossed },
  { id: "gallery",      label: "Galerie",      icon: Image },
  { id: "tables",       label: "Tables",       icon: LayoutGrid },
  { id: "stats",        label: "Statistiques", icon: BarChart3 },
];

function Sidebar({ tab, setTab, onLogout }: { tab: Tab; setTab: (t: Tab) => void; onLogout: () => void }) {
  return (
    <aside className="hidden lg:flex w-60 xl:w-64 bg-void-light border-r border-pierre/10 flex-col shrink-0 min-h-screen">
      <div className="px-6 py-6 border-b border-pierre/10">
        <h2 className="font-display text-xl tracking-[0.12em] text-creme">HÉRITAGE</h2>
        <p className="text-pierre/30 text-xs mt-0.5 tracking-wider">Dashboard</p>
      </div>
      <nav className="flex-1 py-3">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn(
              "w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all",
              tab === id
                ? "text-or bg-or/5 border-r-2 border-or"
                : "text-pierre/50 hover:text-creme hover:bg-white/3"
            )}>
            <Icon size={16} />
            {label}
            {tab === id && <ChevronRight size={12} className="ml-auto text-or/50" />}
          </button>
        ))}
      </nav>
      <div className="border-t border-pierre/10 p-4">
        <button onClick={onLogout}
          className="flex items-center gap-2 text-pierre/30 text-xs hover:text-red-400 transition-colors">
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-void-light border-t border-pierre/10 z-50 flex">
      {NAV_ITEMS.map(({ id, icon: Icon }) => (
        <button key={id} onClick={() => setTab(id)}
          className={cn("flex-1 py-3 flex justify-center transition-colors", tab === id ? "text-or" : "text-pierre/30")}>
          <Icon size={19} />
        </button>
      ))}
    </div>
  );
}

/* ---- Spinner ---- */
function Spin() {
  return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-or" size={22} /></div>;
}

/* ---- Reservations ---- */
function ReservationsView() {
  const { data, isLoading } = useAdminReservations();
  const update = useUpdateReservationStatus();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReservationStatus | "all">("all");

  const filtered = useMemo(() => (data ?? []).filter((r) => {
    const q = search.toLowerCase();
    const matchQ = !q || `${r.first_name} ${r.last_name} ${r.email}`.toLowerCase().includes(q);
    const matchS = filter === "all" || r.status === filter;
    return matchQ && matchS;
  }), [data, search, filter]);

  async function handleStatus(id: string, status: ReservationStatus, label: string) {
    try {
      await update.mutateAsync({ id, status });
      toast(`Réservation ${label}`, "success");
    } catch {
      toast("Erreur lors de la mise à jour", "error");
    }
  }

  if (isLoading) return <Spin />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-creme">Réservations</h2>
        <span className="text-pierre/30 text-xs">{(data ?? []).length} au total</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pierre/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email…"
            className="w-full bg-void border border-pierre/15 pl-9 pr-4 py-2.5 text-sm text-creme placeholder:text-pierre/25 focus:border-or/40 outline-none" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="bg-void border border-pierre/15 px-3 py-2.5 text-sm text-creme outline-none focus:border-or/40">
          <option value="all">Tous</option>
          {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-pierre/30 text-sm">Aucune réservation trouvée.</div>
      ) : (
        <div className="overflow-x-auto -mx-4 lg:mx-0">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-pierre/10 text-pierre/40 text-[10px] uppercase tracking-widest">
                {["Client", "Date", "Heure", "Cvts", "Statut", "Actions"].map((h) => (
                  <th key={h} className={`py-3 px-3 text-left font-normal ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-pierre/5 hover:bg-white/1 transition-colors">
                  <td className="py-3 px-3">
                    <p className="text-creme text-sm">{r.first_name} {r.last_name}</p>
                    <p className="text-pierre/35 text-xs mt-0.5">{r.email}</p>
                  </td>
                  <td className="py-3 px-3 text-creme/60 text-xs whitespace-nowrap">
                    {new Date(r.reservation_date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 px-3 text-creme/60 text-xs whitespace-nowrap">
                    {formatTime(r.reservation_time)}
                  </td>
                  <td className="py-3 px-3 text-center text-creme/60 text-sm">{r.guests}</td>
                  <td className="py-3 px-3">
                    <span className={cn("inline-block px-2 py-0.5 text-[10px] border rounded-sm tracking-wide", STATUS_COLORS[r.status])}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-1">
                      {r.status === "pending" && (<>
                        <button onClick={() => handleStatus(r.id, "confirmed", "confirmée")}
                          title="Confirmer"
                          className="p-1.5 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors">
                          <Check size={13} />
                        </button>
                        <button onClick={() => handleStatus(r.id, "cancelled", "annulée")}
                          title="Annuler"
                          className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                          <X size={13} />
                        </button>
                      </>)}
                      {r.status === "confirmed" && (
                        <button onClick={() => handleStatus(r.id, "seated", "placée en salle")}
                          title="Placer en salle"
                          className="p-1.5 text-blue-400/70 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors">
                          <Users size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---- Menu ---- */
function MenuView() {
  const { data, isLoading } = useAdminMenu();
  const del = useDeleteMenuItem();

  if (isLoading) return <Spin />;

  const grouped = (data ?? []).reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NonNullable<typeof data>>);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer « ${name} » ?`)) return;
    try {
      await del.mutateAsync(id);
      toast(`« ${name} » supprimé`, "success");
    } catch {
      toast("Erreur lors de la suppression", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-creme">La carte</h2>
        <span className="text-pierre/30 text-xs">{(data ?? []).length} éléments</span>
      </div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-8">
          <p className="text-or text-[10px] tracking-[0.18em] uppercase mb-3">
            {MENU_CATEGORY_LABELS[cat as keyof typeof MENU_CATEGORY_LABELS] ?? cat}
          </p>
          <div className="space-y-1.5">
            {items.map((item) => (
              <div key={item.id}
                className="flex items-center gap-3 p-3 border border-pierre/8 hover:border-pierre/20 transition-colors group">
                {item.image_url && (
                  <img src={item.image_url} alt="" className="w-10 h-10 object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-creme text-sm">{item.name}</span>
                    {item.is_specialty && (
                      <span className="text-or text-[9px] tracking-wider uppercase border border-or/30 px-1.5 py-0.5">Signature</span>
                    )}
                    {!item.is_available && (
                      <span className="text-red-400 text-[9px] tracking-wider uppercase">Indisponible</span>
                    )}
                  </div>
                  <p className="text-pierre/35 text-xs truncate mt-0.5">{item.description}</p>
                </div>
                <span className="text-or text-sm whitespace-nowrap">{formatPrice(item.price)}</span>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1.5 text-pierre/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- Gallery ---- */
function GalleryView() {
  const { data, isLoading } = useAdminGallery();
  const del = useDeleteGalleryImage();

  if (isLoading) return <Spin />;

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette image ?")) return;
    try {
      await del.mutateAsync(id);
      toast("Image supprimée", "success");
    } catch {
      toast("Erreur lors de la suppression", "error");
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-creme mb-6">Galerie</h2>
      {(data ?? []).length === 0 ? (
        <p className="text-pierre/30 text-sm text-center py-12">Aucune image pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {data!.map((img) => (
            <div key={img.id} className="relative group aspect-square overflow-hidden">
              <img src={img.image_url} alt={img.title ?? ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
              {img.title && <p className="absolute bottom-1 left-1 right-1 text-[10px] text-creme/60 truncate">{img.title}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Tables ---- */
function TablesView() {
  const { data: tables, isLoading } = useAdminTables();
  const { data: resas } = useAdminReservations();

  if (isLoading) return <Spin />;

  const today = new Date().toISOString().split("T")[0];
  const todayResas = (resas ?? []).filter((r) => r.reservation_date === today && r.status !== "cancelled");
  const reserved = new Set(todayResas.filter((r) => r.table_id).map((r) => r.table_id));
  const seated   = new Set(todayResas.filter((r) => r.status === "seated" && r.table_id).map((r) => r.table_id));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-creme">Plan des tables</h2>
      </div>
      <p className="text-pierre/40 text-xs mb-6">
        {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
      </p>

      <div className="flex gap-5 mb-8 text-xs text-pierre/50">
        {[
          { color: "bg-emerald-500", label: "Libre" },
          { color: "bg-orange-500", label: "Réservée" },
          { color: "bg-red-500",    label: "Occupée" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-sm ${color}`} /> {label}
          </span>
        ))}
      </div>

      {(tables ?? []).length === 0 ? (
        <p className="text-pierre/30 text-sm text-center py-12">Aucune table configurée.</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-w-lg">
          {tables!.map((t) => {
            const isSeated   = seated.has(t.id);
            const isReserved = reserved.has(t.id);
            return (
              <div key={t.id}
                className={cn(
                  "border-2 rounded-sm py-3 px-2 text-center transition-colors",
                  !t.active   ? "opacity-25 border-pierre/20" :
                  isSeated    ? "border-red-500/70 bg-red-500/10" :
                  isReserved  ? "border-orange-500/70 bg-orange-500/10" :
                                "border-emerald-500/40 bg-emerald-500/5"
                )}>
                <p className="font-display text-lg text-creme">{t.numero}</p>
                <p className="text-pierre/40 text-[10px] mt-0.5">{t.capacite}p</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---- Stats ---- */
function StatsView() {
  const { data: resas, isLoading } = useAdminReservations();
  const { data: rawStats }         = useReservationStats();

  if (isLoading) return <Spin />;

  const list = resas ?? [];
  const kpis = [
    { label: "Total",       value: list.length,                                          icon: CalendarDays },
    { label: "En attente",  value: list.filter((r) => r.status === "pending").length,    icon: Clock },
    { label: "Confirmées",  value: list.filter((r) => r.status === "confirmed").length,  icon: Check },
    { label: "Total cvts",  value: list.reduce((s, r) => s + r.guests, 0),              icon: Users },
  ];

  // Bar chart by hour
  const byHour: Record<string, number> = {};
  (rawStats ?? []).forEach((r) => {
    const h = r.reservation_time?.slice(0, 2) + "h";
    byHour[h] = (byHour[h] ?? 0) + 1;
  });
  const sorted = Object.entries(byHour).sort(([a], [b]) => a.localeCompare(b));
  const maxH = Math.max(...Object.values(byHour), 1);

  return (
    <div>
      <h2 className="font-display text-2xl text-creme mb-6">Statistiques</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-pierre/10 p-4 bg-void-light">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={13} className="text-or" />
              <span className="text-pierre/40 text-[10px] uppercase tracking-wider">{label}</span>
            </div>
            <p className="font-display text-3xl text-creme">{value}</p>
          </div>
        ))}
      </div>

      {sorted.length > 0 && (
        <>
          <p className="text-or text-[10px] tracking-[0.18em] uppercase mb-4">Réservations par créneau</p>
          <div className="flex items-end gap-1.5 h-32">
            {sorted.map(([h, count]) => (
              <div key={h} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full bg-or/25 hover:bg-or/40 transition-colors rounded-t-sm"
                  style={{ height: `${(count / maxH) * 100}%` }}
                />
                <span className="text-pierre/35 text-[9px]">{h}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============ MAIN ============ */
export default function Admin() {
  const { user, loading, isStaff, signIn, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("reservations");

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <Loader2 className="animate-spin text-or" size={26} />
    </div>
  );

  if (!user || !isStaff) return <LoginForm onLogin={signIn} />;

  return (
    <div className="min-h-screen bg-void flex">
      <Sidebar tab={tab} setTab={setTab} onLogout={signOut} />
      <MobileNav tab={tab} setTab={setTab} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden px-4 py-4 border-b border-pierre/10 flex items-center justify-between bg-void-light">
          <h2 className="font-display text-lg text-creme tracking-wider">HÉRITAGE</h2>
          <button onClick={signOut} className="text-pierre/30 hover:text-red-400 transition-colors">
            <LogOut size={17} />
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "reservations" && <ReservationsView />}
              {tab === "menu"         && <MenuView />}
              {tab === "gallery"      && <GalleryView />}
              {tab === "tables"       && <TablesView />}
              {tab === "stats"        && <StatsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
