import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SafeImg from "@/components/ui/SafeImg";
import Slider from "@/components/ui/Slider";

/** Logo du partenaire sur panneau blanc ; sans logo, son nom composé en DM Serif. */
function PartnerMark({ partner }) {
  return (
    <div className="flex h-44 items-center justify-center border-b border-bordure bg-white px-10">
      {partner.logo ? (
        <SafeImg src={partner.logo} alt={partner.name} loading="lazy" className="max-h-24 w-auto max-w-full object-contain" />
      ) : (
        <span className="text-center font-serif text-[1.9rem] leading-tight text-encre">{partner.name}</span>
      )}
    </div>
  );
}

/**
 * Partenaires en carrousel de cartes (même gabarit que les « réalisations » du
 * modèle) : logo, catégorie, nom, ce que recouvre la collaboration, lien vers le site.
 */
export default function Partners({ partners = [], className = "bg-gris-clair" }) {
  if (partners.length === 0) return null;
  return (
    <section className={`py-14 md:py-20 lg:py-24 ${className}`}>
      <div className="conteneur">
        <div className="max-w-3xl">
          <p className="t-label text-encre/60">Partenaires</p>
          <Reveal className="mt-4"><h2 className="t-h2">Ils avancent avec nous.</h2></Reveal>
          <p className="texte mt-5 max-w-2xl">
            Institutions, entreprises, médias et associations : {partners.length} partenaires financent, accueillent
            et relaient nos programmes.
          </p>
        </div>
        <div className="mt-12">
          <Slider label="Partenaire" itemClassName="w-[82%] sm:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)]">
            {partners.map((p) => (
              <article key={p.id} className="carte flex h-full flex-col border border-bordure bg-white">
                <PartnerMark partner={p} />
                <div className="flex flex-1 flex-col p-7">
                  {p.category && <p className="t-label-sm text-accent">{p.category}</p>}
                  <h3 className="t-h5 mt-3">{p.name}</h3>
                  {p.subtitle && p.subtitle !== p.name && <p className="mt-1 text-[0.88rem] text-encre/55">{p.subtitle}</p>}
                  {(p.collaboration || p.description) && (
                    <p className="mt-4 line-clamp-4 text-[0.95rem] leading-relaxed text-encre/75">{p.collaboration || p.description}</p>
                  )}
                  {p.website && p.website !== "#" && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="lien-action mt-auto self-start pt-6">
                      Voir le site <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
