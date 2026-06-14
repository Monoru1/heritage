import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ToastContainer } from "@/components/ui/Toast";

const Home        = lazy(() => import("@/pages/Home"));
const Histoire    = lazy(() => import("@/pages/Histoire"));
const MenuPage    = lazy(() => import("@/pages/Menu"));
const Galerie     = lazy(() => import("@/pages/Galerie"));
const Reservation = lazy(() => import("@/pages/Reservation"));
const Contact     = lazy(() => import("@/pages/Contact"));
const Admin       = lazy(() => import("@/pages/Admin"));
const AdminManage = lazy(() => import("@/pages/AdminManage"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-void text-creme flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="text-or text-xs tracking-[0.35em] uppercase mb-5">Erreur 404</p>
        <h1 className="font-display text-5xl md:text-7xl mb-6">Page introuvable</h1>
        <p className="text-pierre/60 leading-relaxed mb-10">
          Cette adresse n’existe pas encore dans la maison Héritage. Revenez à l’accueil ou réservez votre table.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="px-7 py-3 border border-pierre/20 text-creme uppercase tracking-[0.18em] text-xs hover:border-or hover:text-or transition-colors">
            Retour accueil
          </Link>
          <Link to="/reservation" className="px-7 py-3 bg-or text-void uppercase tracking-[0.18em] text-xs font-medium hover:bg-or-light transition-colors">
            Réserver
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"           element={<Home />} />
            <Route path="/histoire"   element={<Histoire />} />
            <Route path="/menu"       element={<MenuPage />} />
            <Route path="/galerie"    element={<Galerie />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/contact"    element={<Contact />} />
            <Route path="*"           element={<NotFound />} />
          </Route>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/admin-manage" element={<AdminManage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
