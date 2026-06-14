import { useState } from "react";
import AdminCrud from "@/pages/AdminCrud";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, CalendarDays, ChefHat, Clock, LayoutGrid, Loader2, LogOut } from "lucide-react";

type AdminSection = "menu" | "gallery" | "tables" | "availability";

const sections: { id: AdminSection; label: string; icon: typeof ChefHat; description: string }[] = [
  { id: "menu", label: "Carte", icon: ChefHat, description: "Plats, prix, images et disponibilités." },
  { id: "gallery", label: "Galerie", icon: CalendarDays, description: "Photos visibles sur le site." },
  { id: "tables", label: "Tables", icon: LayoutGrid, description: "Nombre de tables, capacité, intérieur ou terrasse." },
  { id: "availability", label: "Créneaux", icon: Clock, description: "Jours, heures et tables disponibles." },
];

function LoginBox({ onLogin }: { onLogin: (email: string, password: string) => Promise<{ error: unknown }> }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const { error } = await onLogin(email, password);
    if (error) setError("Identifiants incorrects.");
    setBusy(false);
  }

  return (
    <div className="min-h-screen bg-void text-creme flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md border border-pierre/10 bg-void-light p-8 shadow-2xl shadow-black/40">
        <p className="text-or text-[10px] uppercase tracking-[0.32em] mb-3">Héritage</p>
        <h1 className="font-display text-4xl mb-2">Administration</h1>
        <p className="text-pierre/45 text-sm mb-8 leading-relaxed">Connectez-vous pour gérer les réservations, la carte, les tables, la terrasse et les disponibilités.</p>
        <input name="email" type="email" placeholder="Email" className="w-full bg-void border border-pierre/15 px-4 py-3 mb-3 text-sm outline-none focus:border-or" required />
        <input name="password" type="password" placeholder="Mot de passe" className="w-full bg-void border border-pierre/15 px-4 py-3 mb-4 text-sm outline-none focus:border-or" required />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button disabled={busy} className="w-full bg-or text-void py-3 text-xs uppercase tracking-[0.18em] font-medium disabled:opacity-60 flex items-center justify-center gap-2">
          {busy && <Loader2 size={14} className="animate-spin" />} Se connecter
        </button>
      </form>
    </div>
  );
}

export default function AdminManage() {
  const { user, loading, signIn, signOut } = useAuth();
  const [section, setSection] = useState<AdminSection>("tables");

  if (loading) {
    return <div className="min-h-screen bg-void flex items-center justify-center"><Loader2 className="animate-spin text-or" /></div>;
  }

  if (!user) return <LoginBox onLogin={signIn} />;

  return (
    <div className="min-h-screen bg-void text-creme">
      <header className="border-b border-pierre/10 bg-void-light/95 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-or text-[10px] uppercase tracking-[0.28em]">Administration privée</p>
            <h1 className="font-display text-2xl sm:text-3xl">Héritage — Gestion restaurant</h1>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-pierre/50 hover:text-red-400 text-sm shrink-0">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-3">
            <div className="border border-or/20 bg-or/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 size={18} className="text-or" />
                <h2 className="font-display text-xl">Centre de contrôle</h2>
              </div>
              <p className="text-pierre/50 text-sm leading-relaxed">Une seule page admin pour gérer toute l’activité du restaurant.</p>
            </div>
            {sections.map(({ id, label, icon: Icon, description }) => (
              <button key={id} onClick={() => setSection(id)} className={`w-full text-left border p-4 transition-colors ${section === id ? "border-or bg-or/5 text-or" : "border-pierre/10 bg-void-light/60 text-pierre/55 hover:text-creme hover:border-pierre/20"}`}>
                <div className="flex items-center gap-3 mb-1">
                  <Icon size={16} />
                  <span className="text-sm uppercase tracking-[0.16em]">{label}</span>
                </div>
                <p className="text-xs text-pierre/40 leading-relaxed">{description}</p>
              </button>
            ))}
          </aside>

          <section className="min-w-0">
            <AdminCrud initialTab={section} />
          </section>
        </div>
      </main>
    </div>
  );
}
