import Hero from "@/components/home/Hero";
import Terroir from "@/components/home/Terroir";
import Experience from "@/components/home/Experience";
import ChefSignature from "@/components/home/ChefSignature";
import WineCellar from "@/components/home/WineCellar";
import Testimonials from "@/components/home/Testimonials";
import GalleryPreview from "@/components/home/GalleryPreview";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Hero />
      <Terroir />
      <ChefSignature />
      <Experience />
      <WineCellar />
      <GalleryPreview />
      <Testimonials />

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-px bg-or mx-auto mb-8" />
          <h2 className="font-display text-4xl md:text-5xl text-creme mb-6">
            Votre table vous attend
          </h2>
          <p className="text-pierre/70 mb-10">
            Du mercredi au dimanche, midi et soir. Vue sur les collines
            d'Aix-en-Provence.
          </p>
          <Link
            to="/reservation"
            className="inline-flex px-12 py-4 bg-or text-void text-sm tracking-[0.1em] uppercase font-medium hover:bg-or-light transition-colors duration-300"
          >
            Réserver maintenant
          </Link>
        </div>
      </section>
    </>
  );
}
