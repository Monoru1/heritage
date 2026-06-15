import { useMemo, useState } from "react";
import { Edit3, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useAdminTables, useDeleteTable, useUpsertTable, useAdminReservations } from "@/hooks/useAdmin";
import type { TableRestaurant } from "@/types/database";
import { toast } from "@/components/ui/Toast";
import { cn, formatTime } from "@/lib/utils";

type TableLocation = "interieur" | "terrasse";
type ManagedTable  = TableRestaurant & { location?: TableLocation };
type TableForm     = Partial<ManagedTable> & { numero: number; capacite: number; location: TableLocation };

const emptyTable: TableForm = { numero: 1, capacite: 2, active: true, location: "interieur" };
const input = "w-full bg-void border border-pierre/15 px-4 py-3 text-sm text-creme outline-none focus:border-or/60";
const lbl   = "block text-[10px] uppercase tracking-[0.18em] text-pierre/45 mb-2";

export default function AdminTablesManager() {
  const { data, isLoading } = useAdminTables();
  const { data: resas }     = useAdminReservations();
  const save = useUpsertTable();
  const del  = useDeleteTable();

  const [form, setForm]       = useState<TableForm | null>(null);
  const [locFilter, setLocFilter] = useState<"all" | TableLocation>("all");

  // Filter by date+time to show real occupation
  const today    = new Date().toISOString().slice(0, 10);
  const [snapDate, setSnapDate] = useState(today);
  const [snapTime, setSnapTime] = useState(""); // empty = no time filter

  const tables = (data ?? []) as ManagedTable[];

  // Tables occupied at the selected date+time
  const busyTableIds = useMemo(() => {
    if (!snapDate) return new Set<string>();
    return new Set(
      (resas ?? [])
        .filter((r) =>
          r.reservation_date === snapDate
          && (!snapTime || r.reservation_time.slice(0, 5) === snapTime)
          && !["cancelled", "no_show"].includes(r.status)
          && r.table_id
        )
        .map((r) => r.table_id as string)
    );
  }, [resas, snapDate, snapTime]);

  const filtered = useMemo(() =>
    tables.filter((t) => locFilter === "all" || (t.location ?? "interieur") === locFilter),
    [tables, locFilter]
  );

  const stats = useMemo(() => ({
    total:    tables.length,
    capacity: tables.reduce((s, t) => s + Number(t.capacite ?? 0), 0),
    inside:   tables.filter((t) => (t.location ?? "interieur") === "interieur").length,
    terrace:  tables.filter((t) => t.location === "terrasse").length,
  }), [tables]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || Number(form.numero) <= 0 || Number(form.capacite) <= 0)
      return toast("Numéro et capacité requis", "error");
    try {
      await save.mutateAsync({ ...form, position_x: 0, position_y: 0 });
      toast("Table enregistrée", "success");
      setForm(null);
    } catch { toast("Erreur lors de l'enregistrement", "error"); }
  }

  async function remove(t: ManagedTable) {
    if (!confirm(`Supprimer la table ${t.numero} ?`)) return;
    try { await del.mutateAsync(t.id); toast("Table supprimée", "success"); }
    catch { toast("Erreur suppression", "error"); }
  }

  function tableStatus(t: ManagedTable): "inactive" | "busy" | "free" {
    if (t.active === false) return "inactive";
    if (busyTableIds.has(t.id)) return "busy";
    return "free";
  }

  const statusBadge: Record<"inactive" | "busy" | "free", { cls: string; label: string }> = {
    free:     { cls: "border-emerald-500/30 text-emerald-400",   label: "Libre" },
    busy:     { cls: "border-orange-500/40 text-orange-400",     label: "Réservée" },
    inactive: { cls: "border-red-500/20 text-red-400",           label: "Inactive" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="text-or text-[10px] uppercase tracking-[0.28em] mb-2">Tables</p>
          <h2 className="font-display text-4xl text-creme">Gestion des tables</h2>
          <p className="text-pierre/45 text-sm mt-2">
            Gérez les tables, le nombre de personnes, la salle intérieure et la terrasse.
          </p>
        </div>
        <button onClick={() => setForm({ ...emptyTable })}
          className="inline-flex items-center justify-center gap-2 bg-or text-void px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium hover:bg-or-light">
          <Plus size={15} /> Ajouter une table
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([["Tables", stats.total], ["Personnes max", stats.capacity], ["Intérieur", stats.inside], ["Terrasse", stats.terrace]] as const).map(([k, v]) => (
          <div key={k} className="border border-pierre/10 bg-void-light p-4">
            <p className="text-pierre/40 text-[10px] uppercase tracking-[0.18em]">{k}</p>
            <p className="font-display text-3xl mt-2">{v}</p>
          </div>
        ))}
      </div>

      {/* Info banner if all tables have same location (likely not configured) */}
      {stats.terrace === 0 && stats.total > 0 && (
        <div className="border border-or/20 bg-or/5 px-4 py-3 flex items-start gap-3 text-sm">
          <span className="text-or shrink-0 mt-0.5">ℹ</span>
          <span className="text-pierre/70">
            Toutes vos tables sont en <strong className="text-creme">Intérieur</strong>.
            Pour définir des tables en <strong className="text-creme">Terrasse</strong>, cliquez <strong className="text-creme">Modifier</strong> sur une table et changez l'emplacement.
          </span>
        </div>
      )}

      {/* Date+time snapshot filter */}
      <div className="border border-pierre/10 bg-void-light p-4">
        <p className="text-pierre/40 text-[10px] uppercase tracking-[0.18em] mb-1">
          Voir l'occupation à un créneau précis
        </p>
        <p className="text-pierre/30 text-xs mb-3">Sélectionnez une date (et optionnellement une heure) pour voir quelles tables sont réservées.</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className={lbl}>Date</label>
            <input type="date" value={snapDate} onChange={(e) => setSnapDate(e.target.value)}
              className="bg-void border border-pierre/15 px-3 py-2 text-sm text-creme outline-none focus:border-or/60 w-44" />
          </div>
          <div>
            <label className={lbl}>Heure (optionnel)</label>
            <input type="time" value={snapTime} onChange={(e) => setSnapTime(e.target.value)}
              className="bg-void border border-pierre/15 px-3 py-2 text-sm text-creme outline-none focus:border-or/60 w-36" />
          </div>
          {snapTime && (
            <button onClick={() => setSnapTime("")}
              className="text-pierre/40 hover:text-creme text-xs uppercase tracking-wider border border-pierre/15 px-3 py-2">
              Effacer l'heure
            </button>
          )}
          <p className="text-pierre/35 text-xs self-end pb-2">
            {busyTableIds.size > 0
              ? `${busyTableIds.size} table${busyTableIds.size > 1 ? "s" : ""} réservée${busyTableIds.size > 1 ? "s" : ""}`
              : "Aucune réservation sur ce créneau"}
          </p>
        </div>
      </div>

      {/* Location filter */}
      <div className="flex flex-wrap gap-2">
        {([["all", "Toutes"], ["interieur", "Intérieur"], ["terrasse", "Terrasse"]] as const).map(([id, name]) => (
          <button key={id} onClick={() => setLocFilter(id)}
            className={cn("px-4 py-2 border text-xs uppercase tracking-[0.14em]",
              locFilter === id ? "border-or text-or bg-or/5" : "border-pierre/10 text-pierre/45 hover:text-creme")}>
            {name}
          </button>
        ))}
      </div>

      {/* Form */}
      {form && (
        <form onSubmit={submit} className="border border-or/20 bg-or/5 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl">{form.id ? `Modifier table ${form.numero}` : "Nouvelle table"}</h3>
              <p className="text-pierre/45 text-sm">Renseignez uniquement ce dont le restaurant a besoin.</p>
            </div>
            <button type="button" onClick={() => setForm(null)} className="text-pierre/40 hover:text-creme">
              <X size={20} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label className={lbl}>Numéro de table</label>
              <input className={input} type="number" value={form.numero}
                onChange={(e) => setForm({ ...form, numero: Number(e.target.value) })} />
            </div>
            <div>
              <label className={lbl}>Nombre de personnes</label>
              <input className={input} type="number" value={form.capacite}
                onChange={(e) => setForm({ ...form, capacite: Number(e.target.value) })} />
            </div>
            <div>
              <label className={lbl}>Emplacement</label>
              <select className={input} value={form.location ?? "interieur"}
                onChange={(e) => setForm({ ...form, location: e.target.value as TableLocation })}>
                <option value="interieur">Intérieur</option>
                <option value="terrasse">Terrasse</option>
              </select>
            </div>
            <label className="flex items-center gap-3 border border-pierre/10 bg-void px-4 py-3 text-sm text-pierre/70 cursor-pointer">
              <input type="checkbox" checked={form.active !== false}
                onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Table active
            </label>
          </div>
          <button className="w-full bg-or text-void py-3 text-xs uppercase tracking-[0.18em] font-medium flex items-center justify-center gap-2"
            disabled={save.isPending}>
            {save.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Enregistrer la table
          </button>
        </form>
      )}

      {/* Table grid */}
      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-or" /></div>
      ) : filtered.length === 0 ? (
        <div className="border border-pierre/10 bg-void-light p-10 text-center text-pierre/40">
          Aucune table trouvée.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((t) => {
            const status = tableStatus(t);
            const badge  = statusBadge[status];
            return (
              <div key={t.id}
                className={cn("border p-5 bg-void-light transition-colors",
                  status === "inactive" ? "border-red-500/15 opacity-60"
                  : status === "busy"    ? "border-orange-500/20"
                  :                        "border-pierre/10"
                )}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-pierre/35 text-[10px] uppercase tracking-[0.18em]">
                      {(t.location ?? "interieur") === "terrasse" ? "Terrasse" : "Intérieur"}
                    </p>
                    <h3 className="font-display text-3xl mt-1">Table {t.numero}</h3>
                  </div>
                  <span className={cn("text-[10px] uppercase tracking-[0.14em] px-2 py-1 border", badge.cls)}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-pierre/60 mt-4">
                  {t.capacite} personne{Number(t.capacite) > 1 ? "s" : ""}
                </p>
                {status === "busy" && snapTime && (
                  <p className="text-orange-400/70 text-xs mt-2">
                    Réservée à {formatTime(snapTime)}
                  </p>
                )}
                <div className="flex gap-2 mt-5">
                  <button onClick={() => setForm({ ...t, location: t.location ?? "interieur" })}
                    className="flex-1 border border-pierre/10 py-3 text-xs uppercase tracking-[0.14em] text-pierre/70 hover:text-or hover:border-or/40">
                    <Edit3 size={13} className="inline mr-2" />Modifier
                  </button>
                  <button onClick={() => remove(t)}
                    className="px-4 border border-red-500/20 text-red-400 hover:bg-red-500/10">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
