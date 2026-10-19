import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SafeImg from "@/components/ui/SafeImg";

/**
 * Carte empilée du modèle (« réalisations ») : texte à gauche, photo à droite.
 * Dans une StoryStack, elle reste collée sous l'en-tête et la suivante vient la
 * recouvrir au défilement ; `rank` décale chaque carte de 14 px.
 */
export default function StoryCard({ rank = 0, label, title, text, checks = [], footnote, href, linkLabel = "En savoir plus", image }) {
  return (
    <article className="pile-carte grid border border-bordure bg-white md:grid-cols-2" style={{ "--rang": rank }}>
      <div className="flex flex-col justify-center p-7 md:px-[8%] md:py-12">
        {label && <p className="t-label text-encre/60">{label}</p>}
        <Reveal className="mt-4">
          <h3 className="t-h3 text-encre">
            <Link href={href} className="transition-colors hover:text-accent">{title}</Link>
          </h3>
        </Reveal>
        {text && <p className="mt-5 line-clamp-5 text-[1rem] leading-relaxed text-encre/75 lg:text-justify">{text}</p>}
        {checks.length > 0 && (
          <ul className="mt-6 flex flex-col gap-2.5">
            {checks.map((check) => (
              <li key={check} className="flex items-start gap-3 text-[0.95rem] leading-relaxed">
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                <span className="text-encre/80">{check}</span>
              </li>
            ))}
          </ul>
        )}
        {footnote && <p className="t-label-sm mt-6 border-t border-bordure pt-5 text-encre/50">{footnote}</p>}
        <div className="mt-7">
          <Link href={href} className="souligne-lien inline-flex items-center gap-5 font-mono text-[0.82rem] font-bold uppercase tracking-[0.12em] text-encre transition-colors hover:text-accent">
            {linkLabel} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden bg-gris-clair md:my-12 md:aspect-auto md:min-h-[360px]">
        <SafeImg src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    </article>
  );
}

/** Pile de cartes : espacement et marge basse du modèle (la dernière carte a la place de se poser). */
export function StoryStack({ children }) {
  return <div className="mt-14 flex flex-col gap-8 md:mt-20 md:gap-10 md:pb-10">{children}</div>;
}
