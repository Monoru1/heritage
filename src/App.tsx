import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ToastContainer } from "@/components/ui/Toast";

const Home        = lazy(() => import("@/pages/Home"));
const Histoire    = lazy(() => import("@/pages/Histoire"));
const MenuPage    = lazy(() => import("@/pages/Menu"));
const Galerie     = lazy(() => import("@/pages/Galerie"));
const Reservation = lazy(() => import("@/pages/Reservation"));
const Contact     = lazy(() => import("@/pages/Contact"));
const Admin       = lazy(() => import("@/pages/Admin"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
          </Route>
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
