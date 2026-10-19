import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { whatsappHref } from "@/lib/links";

/**
 * Encart de fin de page : foncé (accueil) ou clair, encadré dans une section
 * beige comme sur les pages intérieures du modèle (variant="clair").
 */
export default function CallToAction({ title, text, action, whatsapp, variant = "fonce" }) {
  const wa = whatsappHref(whatsapp, "Bonjour LIAM Groupe !");
  if (variant === "clair") {
    return (
      <section className="bg-gris-clair pb-20 pt-4">
        <div className="conteneur">
          <div className="flex flex-col gap-8 border border-bordure bg-white px-8 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="t-h3">{title}</p>
              {text && <p className="mt-4 text-[1rem] leading-relaxed text-encre/75">{text}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              {action && <Link href={action.href} className="btn-sombre">{action.label} <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>}
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-contour">WhatsApp</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="pb-20">
      <div className="conteneur">
        <div className="flex flex-col gap-8 bg-noir-doux px-8 py-10 text-white md:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="t-h5 text-white">{title}</p>
            {text && <p className="mt-3 text-[0.95rem] leading-relaxed text-white/80">{text}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {action && <Link href={action.href} className="btn-accent py-4">{action.label} <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn border border-white/40 py-4 text-white hover:bg-white hover:text-encre">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
