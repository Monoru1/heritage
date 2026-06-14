import AdminCrud from "@/pages/AdminCrud";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Loader2 } from "lucide-react";

function LoginBox({ onLogin }: { onLogin: (email: string, password: string) => Promise<{ error: unknown }> }) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const { error } = await onLogin(email, password);
    if (error) alert("Identifiants incorrects");
  }

  return (
    <div className="min-h-screen bg-void text-creme flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-pierre/10 bg-void-light p-8">
        <p className="text-or text-xs uppercase tracking-[0.25em] mb-3">Héritage</p>
        <h1 className="font-display text-3xl mb-8">Gestion restaurant</h1>
        <input name="email" type="email" placeholder="Email" className="w-full bg-void border border-pierre/15 px-4 py-3 mb-3 text-sm outline-none focus:border-or" required />
        <input name="password" type="password" placeholder="Mot de passe" className="w-full bg-void border border-pierre/15 px-4 py-3 mb-5 text-sm outline-none focus:border-or" required />
        <button className="w-full bg-or text-void py-3 text-xs uppercase tracking-[0.16em] font-medium">Se connecter</button>
      </form>
    </div>
  );
}

export default function AdminManage() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-void flex items-center justify-center"><Loader2 className="animate-spin text-or" /></div>;
  }

  if (!user) return <LoginBox onLogin={signIn} />;

  return (
    <div className="min-h-screen bg-void text-creme">
      <header className="border-b border-pierre/10 bg-void-light/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-or text-[10px] uppercase tracking-[0.28em]">Administration</p>
            <h1 className="font-display text-2xl">Gestion Héritage</h1>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-pierre/50 hover:text-red-400 text-sm">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 border border-or/20 bg-or/5 p-4">
          <h2 className="font-display text-xl text-creme mb-1">Gestion opérationnelle</h2>
          <p className="text-pierre/55 text-sm">
            Mettez à jour la carte, les images, le nombre de tables, la capacité par table et les créneaux disponibles.
          </p>
        </div>
        <AdminCrud initialTab="tables" />
      </main>
    </div>
  );
}
