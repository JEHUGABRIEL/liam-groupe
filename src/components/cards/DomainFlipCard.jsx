import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SafeImg from "@/components/ui/SafeImg";
import { domainHref } from "@/lib/links";

/** Carte domaine : photo et titre ; au survol, la description glisse par-dessus. */
export default function DomainFlipCard({ domain }) {
  return (
    <article className="flip h-full">
      <div className="relative flex min-h-[420px] flex-col justify-end">
        <SafeImg src={domain.cardImage || domain.heroImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden="true" className="degrade-photo absolute inset-0" />
        <div className="relative z-[1] p-7">
          <h3 className="t-h4 text-white">{domain.name}</h3>
          <p className="t-label-sm mt-3 text-accent-vif">{domain.category}</p>
        </div>
      </div>
      <div className="flip-verso flex flex-col justify-center bg-noir-doux p-7 text-white">
        <h3 className="t-h5">{domain.name}</h3>
        <p className="mt-5 text-[0.95rem] leading-relaxed text-white/75">{domain.shortDescription}</p>
        <Link href={domainHref(domain.slug)} className="souligne-lien t-label-sm mt-8 inline-flex items-center gap-2 self-start text-accent-vif">
          Découvrir
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
