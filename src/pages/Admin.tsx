import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  useAdminReservations,
  useUpdateReservationStatus,
  useAdminMenu,
  useDeleteMenuItem,
  useAdminTables,
  useAdminGallery,
  useDeleteGalleryImage,
  useReservationStats,
} from "@/hooks/useAdmin";
import { cn, formatDate, formatTime, formatPrice } from "@/lib/utils";
import {
  MENU_CATEGORY_LABELS,
  type ReservationStatus,
} from "@/types/database";
import {
  CalendarDays,
  UtensilsCrossed,
  Image,
  BarChart3,
  LogOut,
  Loader2,
  Check,
  X,
  Clock,
  Users,
  Search,
  Trash2,
  LayoutGrid,
} from "lucide-react";

type Tab = "reservations" | "menu" | "gallery" | "tables" | "stats";

const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  seated: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  no_show: "bg-pierre/20 text-pierre/60 border-pierre/30",
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  seated: "En salle",
  cancelled: "Annulée",
  no_show: "Absent",
};

// ============ LOGIN ============
function LoginForm({ onLogin }: { onLogin: (e: string, p: string) => Promise<{ error: unknown }> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await onLogin(email, password);
    if (err) setError("Identifiants incorrects.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-creme text-center mb-2">
          HÉRITAGE
        </h1>
        <p className="text-pierre/50 text-sm text-center mb-10">
          Administration
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-void-light border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-void-light border border-pierre/20 px-4 py-3 text-creme placeholder:text-pierre/30 focus:border-or/60 outline-none"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-or text-void text-sm tracking-[0.1em] uppercase font-medium hover:bg-or-light transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Connexion"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============ SIDEBAR ============
function Sidebar({
  tab,
  setTab,
  onLogout,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  onLogout: () => void;
}) {
  const items: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
    { id: "reservations", label: "Réservations", icon: CalendarDays },
    { id: "menu", label: "Carte", icon: UtensilsCrossed },
    { id: "gallery", label: "Galerie", icon: Image },
    { id: "tables", label: "Tables", icon: LayoutGrid },
    { id: "stats", label: "Statistiques", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-void-light border-r border-pierre/10 min-h-screen flex flex-col shrink-0 hidden lg:flex">
      <div className="px-6 py-6 border-b border-pierre/10">
        <h2 className="font-display text-xl tracking-[0.12em] text-creme">
          HÉRITAGE
        </h2>
        <p className="text-pierre/40 text-xs mt-1">Dashboard</p>
      </div>
      <nav className="flex-1 py-4">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors",
              tab === id
                ? "text-or bg-or/5 border-r-2 border-or"
                : "text-pierre/60 hover:text-creme hover:bg-creme/5"
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <div className="border-t border-pierre/10 p-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-pierre/40 text-sm hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

// ============ MOBILE NAV ============
function MobileNav({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  const items: { id: Tab; icon: typeof CalendarDays }[] = [
    { id: "reservations", icon: CalendarDays },
    { id: "menu", icon: UtensilsCrossed },
    { id: "gallery", icon: Image },
    { id: "tables", icon: LayoutGrid },
    { id: "stats", icon: BarChart3 },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-void-light border-t border-pierre/10 z-50 flex">
      {items.map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTab(id)}
          className={cn(
            "flex-1 py-3 flex justify-center",
            tab === id ? "text-or" : "text-pierre/40"
          )}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}

// ============ RESERVATIONS VIEW ============
function ReservationsView() {
  const { data, isLoading } = useAdminReservations();
  const updateStatus = useUpdateReservationStatus();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | "all">("all");

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((r) => {
      const matchesSearch =
        !search ||
        `${r.first_name} ${r.last_name} ${r.email}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || r.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, filterStatus]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl text-creme mb-6">Réservations</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-pierre/30"
          />
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-void border border-pierre/15 pl-10 pr-4 py-2.5 text-sm text-creme placeholder:text-pierre/30 focus:border-or/40 outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | "all")}
          className="bg-void border border-pierre/15 px-4 py-2.5 text-sm text-creme outline-none focus:border-or/40"
        >
          <option value="all">Tous les statuts</option>
          {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-pierre/40 text-xs mb-4">
        {filtered.length} réservation{filtered.length > 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pierre/10 text-pierre/50 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-3">Client</th>
              <th className="text-left py-3 px-3">Date</th>
              <th className="text-left py-3 px-3">Heure</th>
              <th className="text-center py-3 px-3">Cvts</th>
              <th className="text-left py-3 px-3">Statut</th>
              <th className="text-right py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-pierre/5 hover:bg-creme/2"
              >
                <td className="py-3 px-3">
                  <p className="text-creme">
                    {r.first_name} {r.last_name}
                  </p>
                  <p className="text-pierre/40 text-xs">{r.email}</p>
                </td>
                <td className="py-3 px-3 text-creme/70">
                  {new Date(r.reservation_date).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-3 px-3 text-creme/70">
                  {formatTime(r.reservation_time)}
                </td>
                <td className="py-3 px-3 text-center text-creme/70">
                  {r.guests}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 text-xs border rounded-sm",
                      STATUS_COLORS[r.status]
                    )}
                  >
                    {STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-1">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus.mutate({
                              id: r.id,
                              status: "confirmed",
                            })
                          }
                          className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded"
                          title="Confirmer"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() =>
                            updateStatus.mutate({
                              id: r.id,
                              status: "cancelled",
                            })
                          }
                          className="p-1.5 text-red-400 hover:bg-red-400/10 rounded"
                          title="Annuler"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                    {r.status === "confirmed" && (
                      <button
                        onClick={() =>
                          updateStatus.mutate({ id: r.id, status: "seated" })
                        }
                        className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded"
                        title="Placer en salle"
                      >
                        <Users size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ MENU VIEW ============
function MenuView() {
  const { data, isLoading } = useAdminMenu();
  const deleteMutation = useDeleteMenuItem();

  if (isLoading) return <LoadingSpinner />;

  const grouped = (data ?? []).reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-creme">La carte</h2>
        <span className="text-pierre/40 text-xs">
          {data?.length ?? 0} éléments
        </span>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-10">
          <h3 className="text-or text-xs tracking-[0.15em] uppercase mb-4">
            {MENU_CATEGORY_LABELS[cat as keyof typeof MENU_CATEGORY_LABELS] ?? cat}
          </h3>
          <div className="space-y-2">
            {items!.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 border border-pierre/8 hover:border-pierre/20 transition-colors group"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt=""
                    className="w-12 h-12 object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-creme text-sm">{item.name}</span>
                    {item.is_specialty && (
                      <span className="text-or text-[9px] tracking-wider uppercase">
                        Spécialité
                      </span>
                    )}
                    {!item.is_available && (
                      <span className="text-red-400 text-[9px] tracking-wider uppercase">
                        Indisponible
                      </span>
                    )}
                  </div>
                  <p className="text-pierre/40 text-xs truncate">
                    {item.description}
                  </p>
                </div>
                <span className="text-or text-sm whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer « ${item.name} » ?`))
                      deleteMutation.mutate(item.id);
                  }}
                  className="p-1.5 text-pierre/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ GALLERY VIEW ============
function GalleryView() {
  const { data, isLoading } = useAdminGallery();
  const deleteMutation = useDeleteGalleryImage();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl text-creme mb-6">Galerie</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data?.map((img) => (
          <div key={img.id} className="relative group">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={img.image_url}
                alt={img.title ?? ""}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (confirm("Supprimer cette image ?"))
                    deleteMutation.mutate(img.id);
                }}
                className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {img.title && (
              <p className="text-pierre/50 text-xs mt-1">{img.title}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ TABLES VIEW ============
function TablesView() {
  const { data, isLoading } = useAdminTables();
  const { data: reservations } = useAdminReservations();

  if (isLoading) return <LoadingSpinner />;

  // Today's reservations by table
  const today = new Date().toISOString().split("T")[0];
  const todayResas = reservations?.filter(
    (r) => r.reservation_date === today && r.status !== "cancelled"
  );
  const reservedTableIds = new Set(
    todayResas?.filter((r) => r.table_id).map((r) => r.table_id)
  );
  const seatedTableIds = new Set(
    todayResas
      ?.filter((r) => r.status === "seated" && r.table_id)
      .map((r) => r.table_id)
  );

  return (
    <div>
      <h2 className="font-display text-2xl text-creme mb-2">
        Plan des tables
      </h2>
      <p className="text-pierre/40 text-xs mb-6">
        Aujourd'hui ·{" "}
        {new Date().toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>

      {/* Legend */}
      <div className="flex gap-6 mb-8 text-xs">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-sm" /> Libre
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-500 rounded-sm" /> Réservée
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-sm" /> Occupée
        </span>
      </div>

      {/* Grid plan */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl">
        {data?.map((table) => {
          const isSeated = seatedTableIds.has(table.id);
          const isReserved = reservedTableIds.has(table.id);
          const color = isSeated
            ? "border-red-500 bg-red-500/10"
            : isReserved
              ? "border-orange-500 bg-orange-500/10"
              : "border-emerald-500/40 bg-emerald-500/5";

          return (
            <div
              key={table.id}
              className={cn(
                "border-2 rounded-sm p-4 text-center transition-colors",
                color,
                !table.active && "opacity-30"
              )}
            >
              <p className="font-display text-xl text-creme">
                {table.numero}
              </p>
              <p className="text-pierre/50 text-xs mt-1">
                {table.capacite} cvts
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ STATS VIEW ============
function StatsView() {
  const { data, isLoading } = useReservationStats();
  const { data: reservations } = useAdminReservations();

  if (isLoading) return <LoadingSpinner />;

  const total = reservations?.length ?? 0;
  const pending = reservations?.filter((r) => r.status === "pending").length ?? 0;
  const confirmed = reservations?.filter((r) => r.status === "confirmed").length ?? 0;
  const totalGuests = reservations?.reduce((s, r) => s + r.guests, 0) ?? 0;

  // Reservations by hour
  const byHour: Record<string, number> = {};
  (data ?? []).forEach((r) => {
    const h = r.reservation_time.slice(0, 2) + "h";
    byHour[h] = (byHour[h] ?? 0) + 1;
  });
  const maxByHour = Math.max(...Object.values(byHour), 1);

  return (
    <div>
      <h2 className="font-display text-2xl text-creme mb-6">Statistiques</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total réservations", value: total, icon: CalendarDays },
          { label: "En attente", value: pending, icon: Clock },
          { label: "Confirmées", value: confirmed, icon: Check },
          { label: "Total convives", value: totalGuests, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="border border-pierre/10 p-5 bg-void-light"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} className="text-or" />
              <span className="text-pierre/50 text-xs uppercase tracking-wider">
                {label}
              </span>
            </div>
            <p className="font-display text-3xl text-creme">{value}</p>
          </div>
        ))}
      </div>

      {/* Hourly distribution bar chart */}
      <h3 className="text-or text-xs tracking-[0.15em] uppercase mb-4">
        Réservations par créneau
      </h3>
      <div className="flex items-end gap-2 h-40">
        {Object.entries(byHour)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([hour, count]) => (
            <div key={hour} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-or/30 hover:bg-or/50 transition-colors rounded-t-sm"
                style={{ height: `${(count / maxByHour) * 100}%` }}
              />
              <span className="text-pierre/40 text-[10px]">{hour}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ============ LOADING ============
function LoadingSpinner() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-or" size={24} />
    </div>
  );
}

// ============ MAIN ADMIN ============
export default function Admin() {
  const { user, loading, isStaff, signIn, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("reservations");

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="animate-spin text-or" size={28} />
      </div>
    );
  }

  if (!user || !isStaff) {
    return <LoginForm onLogin={signIn} />;
  }

  return (
    <div className="min-h-screen bg-void flex">
      <Sidebar tab={tab} setTab={setTab} onLogout={signOut} />
      <MobileNav tab={tab} setTab={setTab} />

      <div className="flex-1 min-w-0">
        {/* Top bar mobile */}
        <div className="lg:hidden px-6 py-4 border-b border-pierre/10 flex items-center justify-between">
          <h2 className="font-display text-lg text-creme tracking-wider">
            HÉRITAGE
          </h2>
          <button
            onClick={signOut}
            className="text-pierre/40 hover:text-red-400"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="p-6 lg:p-10 pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "reservations" && <ReservationsView />}
              {tab === "menu" && <MenuView />}
              {tab === "gallery" && <GalleryView />}
              {tab === "tables" && <TablesView />}
              {tab === "stats" && <StatsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
