import { useState, useMemo } from "react";
import { Plus, Save, Trash2, Edit3, X, Loader2 } from "lucide-react";
import {
  useAdminMenu,
  useUpsertMenuItem,
  useDeleteMenuItem,
  useAdminGallery,
  useUpsertGalleryImage,
  useDeleteGalleryImage,
  useAdminTables,
  useUpsertTable,
  useDeleteTable,
  useAdminAvailability,
  useUpsertAvailabilitySlot,
  useDeleteAvailabilitySlot,
} from "@/hooks/useAdmin";
import { MENU_CATEGORY_LABELS } from "@/types/database";
import type { MenuItem, GalleryImage, TableRestaurant, AvailabilitySlot } from "@/types/database";
import { formatPrice, formatTime } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

type CrudTab = "menu" | "gallery" | "tables" | "availability";

const input = "w-full bg-void border border-pierre/15 px-3 py-2 text-sm text-creme placeholder:text-pierre/30 outline-none focus:border-or/50";
const label = "block text-[10px] uppercase tracking-[0.18em] text-pierre/40 mb-1.5";
const panel = "border border-pierre/10 bg-void-light/70 p-4";

const emptyMenu: Partial<MenuItem> & { name: string; price: number; category: string } = {
  name: "",
  description: "",
  price: 0,
  category: "plats",
  image_url: "",
  is_specialty: false,
  region: "",
  sort_order: 0,
  is_available: true,
};

const emptyGallery: Partial<GalleryImage> & { image_url: string } = {
  title: "",
  image_url: "",
  category: "ambiance",
  sort_order: 0,
};

const emptyTable: Partial<TableRestaurant> & { numero: number; capacite: number } = {
  numero: 1,
  capacite: 2,
  position_x: 0,
  position_y: 0,
  active: true,
};

const emptySlot: Partial<AvailabilitySlot> & { slot_date: string; slot_time: string } = {
  slot_date: new Date().toISOString().slice(0, 10),
  slot_time: "19:30",
  available_tables: 12,
  is_open: true,
};

function SectionHeader({ title, subtitle, onNew }: { title: string; subtitle: string; onNew: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="font-display text-2xl text-creme">{title}</h2>
        <p className="text-pierre/40 text-sm mt-1">{subtitle}</p>
      </div>
      <button onClick={onNew} className="inline-flex items-center justify-center gap-2 bg-or text-void px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium hover:bg-or-light transition-colors">
        <Plus size={14} /> Ajouter
      </button>
    </div>
  );
}

function Loading() {
  return <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-or" /></div>;
}

function AdminFormShell({ title, onCancel, children }: { title: string; onCancel: () => void; children: React.ReactNode }) {
  return (
    <div className={`${panel} mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-creme">{title}</h3>
        <button onClick={onCancel} className="text-pierre/40 hover:text-creme"><X size={18} /></button>
      </div>
      {children}
    </div>
  );
}

export default function AdminCrud({ initialTab = "menu" }: { initialTab?: CrudTab }) {
  const [tab, setTab] = useState<CrudTab>(initialTab);
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {[
          ["menu", "Carte"], ["gallery", "Galerie"], ["tables", "Tables"], ["availability", "Disponibilités"],
        ].map(([id, name]) => (
          <button key={id} onClick={() => setTab(id as CrudTab)} className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border whitespace-nowrap ${tab === id ? "border-or text-or bg-or/5" : "border-pierre/10 text-pierre/40 hover:text-creme"}`}>
            {name}
          </button>
        ))}
      </div>
      {tab === "menu" && <MenuCrud />}
      {tab === "gallery" && <GalleryCrud />}
      {tab === "tables" && <TablesCrud />}
      {tab === "availability" && <AvailabilityCrud />}
    </div>
  );
}

function MenuCrud() {
  const { data, isLoading } = useAdminMenu();
  const save = useUpsertMenuItem();
  const del = useDeleteMenuItem();
  const [form, setForm] = useState<typeof emptyMenu | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form?.name || Number(form.price) < 0) return toast("Nom et prix valides requis", "error");
    try { await save.mutateAsync(form); toast("Plat enregistré", "success"); setForm(null); } catch { toast("Erreur enregistrement plat", "error"); }
  }
  async function remove(item: MenuItem) {
    if (!confirm(`Supprimer ${item.name} ?`)) return;
    try { await del.mutateAsync(item.id); toast("Plat supprimé", "success"); } catch { toast("Erreur suppression", "error"); }
  }

  return <div>
    <SectionHeader title="Carte" subtitle="Ajoutez, modifiez ou retirez les plats du restaurant." onNew={() => setForm({ ...emptyMenu })} />
    {form && <AdminFormShell title={form.id ? "Modifier un plat" : "Nouveau plat"} onCancel={() => setForm(null)}>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
        <div><label className={label}>Nom</label><input className={input} value={form.name ?? ""} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className={label}>Prix</label><input className={input} type="number" step="0.01" value={form.price ?? 0} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></div>
        <div><label className={label}>Catégorie</label><select className={input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{Object.entries(MENU_CATEGORY_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className={label}>Région</label><input className={input} value={form.region ?? ""} onChange={e => setForm({ ...form, region: e.target.value })} /></div>
        <div className="md:col-span-2"><label className={label}>Image URL</label><input className={input} value={form.image_url ?? ""} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
        <div className="md:col-span-2"><label className={label}>Description</label><textarea className={input} rows={3} value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <label className="flex gap-2 items-center text-sm text-pierre/60"><input type="checkbox" checked={!!form.is_specialty} onChange={e => setForm({ ...form, is_specialty: e.target.checked })} /> Signature</label>
        <label className="flex gap-2 items-center text-sm text-pierre/60"><input type="checkbox" checked={form.is_available !== false} onChange={e => setForm({ ...form, is_available: e.target.checked })} /> Disponible</label>
        <button className="md:col-span-2 bg-or text-void px-4 py-3 text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2"><Save size={14}/> Enregistrer</button>
      </form>
    </AdminFormShell>}
    {isLoading ? <Loading /> : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{(data ?? []).map(item => <div key={item.id} className={panel}>
      {item.image_url && <img src={item.image_url} className="h-36 w-full object-cover mb-3" />}
      <div className="flex justify-between gap-3"><h3 className="text-creme font-medium">{item.name}</h3><span className="text-or">{formatPrice(item.price)}</span></div>
      <p className="text-pierre/45 text-xs mt-1 line-clamp-2">{item.description}</p>
      <div className="flex gap-2 mt-4"><button onClick={() => setForm(item)} className="flex-1 border border-pierre/10 py-2 text-xs text-pierre/70 hover:text-or"><Edit3 size={13} className="inline mr-1"/>Modifier</button><button onClick={() => remove(item)} className="px-3 border border-red-500/20 text-red-400"><Trash2 size={14}/></button></div>
    </div>)}</div>}
  </div>;
}

function GalleryCrud() {
  const { data, isLoading } = useAdminGallery();
  const save = useUpsertGalleryImage();
  const del = useDeleteGalleryImage();
  const [form, setForm] = useState<typeof emptyGallery | null>(null);
  async function submit(e: React.FormEvent) { e.preventDefault(); try { await save.mutateAsync(form!); toast("Image enregistrée", "success"); setForm(null); } catch { toast("Erreur galerie", "error"); } }
  async function remove(img: GalleryImage) { if (!confirm("Supprimer cette image ?")) return; try { await del.mutateAsync(img.id); toast("Image supprimée", "success"); } catch { toast("Erreur suppression", "error"); } }
  return <div><SectionHeader title="Galerie" subtitle="Gérez les images visibles sur la page galerie." onNew={() => setForm({ ...emptyGallery })} />
    {form && <AdminFormShell title="Image galerie" onCancel={() => setForm(null)}><form onSubmit={submit} className="grid md:grid-cols-2 gap-3"><div><label className={label}>Titre</label><input className={input} value={form.title ?? ""} onChange={e => setForm({ ...form, title: e.target.value })}/></div><div><label className={label}>Catégorie</label><input className={input} value={form.category ?? ""} onChange={e => setForm({ ...form, category: e.target.value })}/></div><div className="md:col-span-2"><label className={label}>Image URL</label><input className={input} value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}/></div><button className="md:col-span-2 bg-or text-void py-3 text-xs uppercase tracking-[0.16em]">Enregistrer</button></form></AdminFormShell>}
    {isLoading ? <Loading/> : <div className="grid md:grid-cols-3 gap-4">{(data ?? []).map(img => <div key={img.id} className={panel}><img src={img.image_url} className="h-44 w-full object-cover mb-3"/><p className="text-creme">{img.title}</p><p className="text-pierre/40 text-xs">{img.category}</p><div className="flex gap-2 mt-3"><button onClick={() => setForm(img)} className="flex-1 border border-pierre/10 py-2 text-xs">Modifier</button><button onClick={() => remove(img)} className="px-3 border border-red-500/20 text-red-400"><Trash2 size={14}/></button></div></div>)}</div>}
  </div>;
}

function TablesCrud() {
  const { data, isLoading } = useAdminTables(); const save = useUpsertTable(); const del = useDeleteTable(); const [form,setForm] = useState<typeof emptyTable | null>(null);
  async function submit(e: React.FormEvent){ e.preventDefault(); try{ await save.mutateAsync(form!); toast("Table enregistrée","success"); setForm(null);}catch{toast("Erreur table","error");}}
  async function remove(t: TableRestaurant){ if(!confirm(`Supprimer table ${t.numero} ?`))return; try{await del.mutateAsync(t.id); toast("Table supprimée","success");}catch{toast("Erreur suppression","error");}}
  return <div><SectionHeader title="Tables" subtitle="Gérez le plan de salle et les capacités." onNew={()=>setForm({...emptyTable})}/>{form&&<AdminFormShell title="Table" onCancel={()=>setForm(null)}><form onSubmit={submit} className="grid md:grid-cols-4 gap-3"><input className={input} type="number" value={form.numero} onChange={e=>setForm({...form,numero:Number(e.target.value)})}/><input className={input} type="number" value={form.capacite} onChange={e=>setForm({...form,capacite:Number(e.target.value)})}/><input className={input} type="number" value={form.position_x??0} onChange={e=>setForm({...form,position_x:Number(e.target.value)})}/><input className={input} type="number" value={form.position_y??0} onChange={e=>setForm({...form,position_y:Number(e.target.value)})}/><button className="md:col-span-4 bg-or text-void py-3 text-xs uppercase tracking-[0.16em]">Enregistrer</button></form></AdminFormShell>}{isLoading?<Loading/>:<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{(data??[]).map(t=><div key={t.id} className={panel}><p className="text-creme font-display text-xl">Table {t.numero}</p><p className="text-pierre/50 text-sm">{t.capacite} couverts</p><p className="text-pierre/30 text-xs">x:{t.position_x} y:{t.position_y}</p><div className="flex gap-2 mt-3"><button onClick={()=>setForm(t)} className="flex-1 border border-pierre/10 py-2 text-xs">Modifier</button><button onClick={()=>remove(t)} className="px-3 border border-red-500/20 text-red-400"><Trash2 size={14}/></button></div></div>)}</div>}</div>;
}

function AvailabilityCrud() {
  const { data, isLoading } = useAdminAvailability(); const save = useUpsertAvailabilitySlot(); const del = useDeleteAvailabilitySlot(); const [form,setForm]=useState<typeof emptySlot|null>(null); const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const filtered = useMemo(()=> (data??[]).filter(s=>s.slot_date===date),[data,date]);
  async function submit(e:React.FormEvent){e.preventDefault(); try{await save.mutateAsync(form!); toast("Créneau enregistré","success"); setForm(null);}catch{toast("Erreur créneau","error");}}
  async function toggle(s:AvailabilitySlot){try{await save.mutateAsync({...s,is_open:!s.is_open}); toast("Créneau mis à jour","success");}catch{toast("Erreur mise à jour","error");}}
  async function remove(s:AvailabilitySlot){if(!confirm("Supprimer ce créneau ?"))return; try{await del.mutateAsync(s.id); toast("Créneau supprimé","success");}catch{toast("Erreur suppression","error");}}
  return <div><SectionHeader title="Disponibilités" subtitle="Ouvrez, fermez et ajustez les créneaux de réservation." onNew={()=>setForm({...emptySlot,slot_date:date})}/><div className="mb-4"><label className={label}>Date</label><input className={`${input} max-w-xs`} type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>{form&&<AdminFormShell title="Créneau" onCancel={()=>setForm(null)}><form onSubmit={submit} className="grid md:grid-cols-4 gap-3"><input className={input} type="date" value={form.slot_date} onChange={e=>setForm({...form,slot_date:e.target.value})}/><input className={input} type="time" value={(form.slot_time??"").slice(0,5)} onChange={e=>setForm({...form,slot_time:e.target.value})}/><input className={input} type="number" value={form.available_tables??0} onChange={e=>setForm({...form,available_tables:Number(e.target.value)})}/><label className="flex items-center gap-2 text-pierre/60 text-sm"><input type="checkbox" checked={form.is_open!==false} onChange={e=>setForm({...form,is_open:e.target.checked})}/> Ouvert</label><button className="md:col-span-4 bg-or text-void py-3 text-xs uppercase tracking-[0.16em]">Enregistrer</button></form></AdminFormShell>}{isLoading?<Loading/>:<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{filtered.map(s=><div key={s.id} className={panel}><div className="flex justify-between"><p className="text-creme">{formatTime(s.slot_time)}</p><span className={s.is_open?"text-emerald-400":"text-red-400"}>{s.is_open?"Ouvert":"Fermé"}</span></div><p className="text-pierre/45 text-sm">{s.available_tables} tables disponibles</p><div className="flex gap-2 mt-3"><button onClick={()=>setForm(s)} className="flex-1 border border-pierre/10 py-2 text-xs">Modifier</button><button onClick={()=>toggle(s)} className="flex-1 border border-pierre/10 py-2 text-xs">{s.is_open?"Fermer":"Ouvrir"}</button><button onClick={()=>remove(s)} className="px-3 border border-red-500/20 text-red-400"><Trash2 size={14}/></button></div></div>)}</div>}</div>;
}
