import { Mail, MessageCircle, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { whatsappHref } from "@/lib/links";

/** « On en parle ? » + deux blocs de texte libres, sur trois colonnes. */
export default function ContactBlock({ siteInfo = {}, blocks = [], className = "bg-white" }) {
  const phone = siteInfo.phones?.[0];
  const email = siteInfo.emails?.[0];
  const whatsapp = whatsappHref(siteInfo.social?.whatsapp, "Bonjour LIAM Groupe !");
  return (
    <section className={`py-14 md:py-20 lg:py-24 ${className}`}>
      <div className="conteneur grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-14">
        <div>
          <p className="t-label text-encre/60">On en parle ?</p>
          <p className="texte mt-4">Écrivez-nous : nous vous répondons rapidement. Le premier échange est toujours gratuit et sans engagement.</p>
          <div className="mt-6 flex flex-col items-start gap-3">
            {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="souligne-lien inline-flex items-center gap-2.5 text-[0.95rem] font-semibold"><Phone aria-hidden="true" className="h-4 w-4 text-accent" />{phone}</a>}
            {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="souligne-lien inline-flex items-center gap-2.5 text-[0.95rem] font-semibold"><MessageCircle aria-hidden="true" className="h-4 w-4 text-accent" />Écrire sur WhatsApp</a>}
            {email && <a href={`mailto:${email}`} className="souligne-lien inline-flex items-center gap-2.5 text-[0.95rem] font-semibold"><Mail aria-hidden="true" className="h-4 w-4 text-accent" />{email}</a>}
          </div>
        </div>
        {blocks.map((block, index) => (
          <div key={block.title}>
            <Reveal delay={300 + index * 100}><h4 className="t-h4">{block.title}</h4></Reveal>
            <p className="texte mt-4">{block.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
