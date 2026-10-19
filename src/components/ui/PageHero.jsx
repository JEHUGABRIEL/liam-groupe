import Reveal from "./Reveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * En-tête de page : sur-titre « / … », grand titre mono en capitales, bouton
 * facultatif posé à cheval sur la photo pleine largeur qui suit.
 */
export default function PageHero({ eyebrow, title, intro, action, image, imageAlt = "", crumbs }) {
  return (
    <>
      <section className="bg-white">
        <div className="bloc-heros">
          {crumbs && (
            <nav aria-label="Fil d'Ariane" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-[0.82rem] text-encre/55">
                <li><Link href="/" className="souligne-lien hover:text-encre">Accueil</Link></li>
                {crumbs.map((crumb) => (
                  <li key={crumb} className="flex items-center gap-2">
                    <span aria-hidden="true">›</span>
                    <span aria-current="page" className="text-encre">{crumb}</span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && (
            <p className="flex items-center gap-1.5">
              <span aria-hidden="true" className="font-mono text-[13px] font-bold text-accent">/</span>
              <span className="sur-titre pl-[5px]">{eyebrow}</span>
            </p>
          )}
          <Reveal className="mt-2">
            <h1 className="titre-heros max-w-[820px]">{title}</h1>
          </Reveal>
          {intro && <p className="texte mt-5 max-w-2xl">{intro}</p>}
          {action && (
            <Link
              href={action.href}
              className="btn-sombre absolute bottom-0 right-[30px] z-10 translate-y-1/2 gap-6 py-[18px]"
            >
              {action.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
      {image && (
        <section className="fx-zoom relative h-[300px] overflow-hidden md:h-[440px] lg:h-[560px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        </section>
      )}
    </>
  );
}
