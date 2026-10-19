import TestimonialSlider from "./TestimonialSlider";
import Reveal from "@/components/ui/Reveal";

/** Témoignages sur fond beige : présentation à gauche, carrousel de citations à droite. */
export default function Testimonials({ testimonials = [] }) {
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-gris-clair py-16 md:py-20 lg:py-24">
      <div className="conteneur grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="colle">
          <p className="t-label text-encre/60">Témoignages</p>
          <Reveal className="mt-4"><h2 className="t-h2">Ce qu&apos;ils disent de nous.</h2></Reveal>
          <p className="texte mt-5">
            Bénéficiaires, partenaires, clientes du restaurant ou membres de la salle : leurs mots disent mieux
            que nous ce que changent nos programmes.
          </p>
          <div className="mt-8 border-t border-bordure pt-8">
            <p className="texte text-[0.95rem]">Vous avez participé à un programme LIAM ? Votre témoignage a toute sa place ici.</p>
          </div>
        </div>
        <TestimonialSlider testimonials={testimonials} />
      </div>
    </section>
  );
}
