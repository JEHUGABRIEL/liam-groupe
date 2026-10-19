import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SocialIcon, { SOCIAL_NETWORKS } from "@/components/ui/SocialIcon";
import { domainHref, NAV_LINKS, whatsappHref } from "@/lib/links";

const heading = "font-mono text-[15px] font-bold uppercase tracking-[1px] text-white";
const link = "text-[0.95rem] text-white/80 transition-colors hover:text-accent-vif";

/** Pied de page du modèle : 3 cases de contact encadrées, 5 colonnes de liens, mentions et réseaux. */
export default function Footer({ siteInfo = {}, domains = [] }) {
  const year = new Date().getFullYear();
  const email = siteInfo.emails?.[0];
  const whatsapp = whatsappHref(siteInfo.social?.whatsapp, "Bonjour LIAM Groupe !");
  const address = siteInfo.address || [];
  const social = Object.entries(siteInfo.social || {}).filter(([network]) => SOCIAL_NETWORKS.includes(network));
  const featured = domains.filter((d) => ["ogab", "g-fitness", "miss-centrafrique"].includes(d.slug));
  const others = domains.filter((d) => !featured.includes(d));
  const caseLink = "souligne-lien inline-flex items-center gap-3 border-b border-white pb-1.5 font-mono text-[15px] font-bold uppercase tracking-[2px] text-white";

  return (
    <footer className="bg-noir-doux text-white">
      <div className="conteneur pt-20">
        <div className="grid border border-white/15 md:grid-cols-3">
          <div className="flex flex-col justify-center gap-6 border-b border-white/15 px-10 py-12 md:border-b-0 md:border-r">
            {address.length > 0 && (
              <p className="font-mono text-[15px] font-bold uppercase leading-relaxed tracking-[2px]">
                {address.map((line) => <span key={line} className="block">{line}</span>)}
              </p>
            )}
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(address.join(", ") || "LIAM Groupe Bangui")}`} target="_blank" rel="noopener noreferrer" className={`${caseLink} self-start`}>
              Localisation <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
          <div className="flex items-center justify-center border-b border-white/15 px-10 py-12 md:border-b-0 md:border-r">
            {email && <a href={`mailto:${email}`} className={caseLink}>E-mail ici <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>}
          </div>
          <div className="flex items-center justify-center px-10 py-12">
            {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={caseLink}>WhatsApp ici <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>}
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className={heading}>Nos pôles</p>
            <ul className="mt-6 space-y-3">
              {featured.map((d) => <li key={d.slug}><Link href={domainHref(d.slug)} className={link}>{d.name}</Link></li>)}
              <li><Link href="/boutique" className={link}>Boutique</Link></li>
            </ul>
          </div>
          <div>
            <p className={heading}>Nos domaines</p>
            <ul className="mt-6 space-y-3">
              {others.map((d) => <li key={d.slug}><Link href={domainHref(d.slug)} className={link}>{d.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className={heading}>Agir</p>
            <ul className="mt-6 space-y-3">
              <li><Link href="/actualites#agenda" className={link}>Événements à venir</Link></li>
              <li><Link href="/g-fitness#formules" className={link}>S&apos;abonner à G-Fitness</Link></li>
              <li><Link href="/ogab#carte" className={link}>Commander chez O&apos;GAB</Link></li>
              <li><Link href="/miss-centrafrique#candidature" className={link}>Candidater à Miss Centrafrique</Link></li>
            </ul>
          </div>
          <div>
            <p className={heading}>Contact</p>
            <ul className="mt-6 space-y-3 text-[0.95rem] text-white/80">
              {siteInfo.phones?.map((phone) => <li key={phone}><a href={`tel:${phone.replace(/\s/g, "")}`} className={link}>{phone}</a></li>)}
              {siteInfo.emails?.map((e) => <li key={e}><a href={`mailto:${e}`} className={`${link} break-all`}>{e}</a></li>)}
              {siteInfo.hours?.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
          <div>
            <p className={heading}>Menu rapide</p>
            <ul className="mt-6 space-y-3">
              {NAV_LINKS.map((l) => <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>)}
              <li><Link href="/mon-compte" className={link}>Mon compte</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="conteneur py-10">
          <p className="max-w-5xl text-[0.82rem] leading-relaxed text-white/55">
            <strong className="text-white/80">{siteInfo.fullName || "LIAM Groupe"}</strong>, {siteInfo.description?.charAt(0).toLowerCase()}{siteInfo.description?.slice(1)}
            {domains.length > 0 && <> <strong className="text-white/80">Domaines :</strong> {domains.map((d) => d.name).join(" | ")}.</>}
          </p>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.85rem] text-white/55">
              <span>© {year} <span className="text-accent-vif">{siteInfo.fullName || "LIAM Groupe"}</span> — tous droits réservés.</span>
              <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
              <Link href="/politique-de-confidentialite" className="hover:text-white">Confidentialité</Link>
            </div>
            {social.length > 0 && (
              <ul className="flex gap-3">
                {social.map(([network, url]) => (
                  <li key={network}>
                    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={network} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition-colors hover:border-accent hover:bg-accent">
                      <SocialIcon network={network} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
