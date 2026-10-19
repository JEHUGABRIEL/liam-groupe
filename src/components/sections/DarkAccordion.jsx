import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

/**
 * Section brun foncé du modèle : logo en grand à gauche, titre en capitales et
 * liste dépliante à droite (éléments <details>, utilisables sans JavaScript).
 * items : [{ title, text, href, linkLabel }]
 */
export default function DarkAccordion({ title, subtitle, text, items = [], action }) {
  return (
    <section className="relative overflow-hidden bg-brun py-16 text-white md:py-24">
      <div className="conteneur grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-liam-blanc.png" alt="" aria-hidden="true" className="w-[75%] max-w-[440px]" />
        </div>
        <div>
          <h2 className="font-mono text-[40px] font-bold uppercase leading-none md:text-[64px]">{title}</h2>
          {subtitle && <p className="t-label mt-6 text-accent-vif">{subtitle}</p>}
          {text && <p className="mt-5 text-[1rem] leading-relaxed text-white/80">{text}</p>}
          <div className="mt-10 border-t border-white/20">
            {items.map((item) => (
              <details key={item.title} className="accordeon border-b border-white/20">
                <summary>
                  {item.title}
                  <Plus aria-hidden="true" className="accordeon-signe h-4 w-4 shrink-0 transition-transform" />
                </summary>
                <div className="pb-6">
                  <p className="text-[0.95rem] leading-relaxed text-white/75">{item.text}</p>
                  {item.href && (
                    <Link href={item.href} className="souligne-lien t-label-sm mt-4 inline-flex items-center gap-2 text-accent-vif">
                      {item.linkLabel || "Découvrir"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>
          {action && (
            <Link href={action.href} className="souligne-lien t-label mt-10 inline-flex items-center gap-2 text-white">
              {action.label} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
