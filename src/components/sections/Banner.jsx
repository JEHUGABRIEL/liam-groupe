import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/** Bandeau beige : grand titre et texte à gauche, bouton à droite. */
export default function Banner({ label, title, text, action }) {
  return (
    <section className="bg-gris-clair py-16 md:py-20 lg:py-24">
      <div className="conteneur grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="t-label text-encre/60">{label}</p>
          <Reveal className="mt-4"><h2 className="t-h2">{title}</h2></Reveal>
          {text && <p className="texte mt-5 max-w-2xl">{text}</p>}
        </div>
        {action && (
          <Link href={action.href} className="btn-sombre self-start lg:self-end">
            {action.label} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  );
}
