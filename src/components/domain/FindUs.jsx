import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { whatsappHref } from "@/lib/links";

/** « Nous trouver » : horaires, adresse et contacts à gauche, carte Google Maps à droite. */
export default function FindUs({ title = "Nous trouver.", hours = [], address, phone, whatsapp }) {
  const wa = whatsappHref(whatsapp, "Bonjour, je souhaite réserver une table chez O'GAB.");
  const query = encodeURIComponent(`${address || ""}`);
  return (
    <section id="infos" className="scroll-mt-24 py-14 md:py-20 lg:py-24">
      <div className="conteneur grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-16">
        <div>
          <p className="t-label text-encre/60">Infos pratiques</p>
          <Reveal className="mt-4"><h2 className="t-h2">{title}</h2></Reveal>
          <dl className="mt-10 space-y-8">
            {hours.length > 0 && (
              <div className="bloc-grille px-6">
                <dt className="t-label-sm flex items-center gap-2 text-encre/55"><Clock aria-hidden="true" className="h-4 w-4 text-accent" />Horaires</dt>
                {hours.map((h) => (
                  <dd key={h.days} className="mt-2 flex justify-between gap-6 border-b border-bordure pb-2 last:border-0">
                    <span>{h.days}</span><span className="font-mono font-bold">{h.time}</span>
                  </dd>
                ))}
              </div>
            )}
            {address && (
              <div className="bloc-grille px-6">
                <dt className="t-label-sm flex items-center gap-2 text-encre/55"><MapPin aria-hidden="true" className="h-4 w-4 text-accent" />Adresse</dt>
                <dd className="mt-2">{address}</dd>
              </div>
            )}
            {phone && (
              <div className="bloc-grille px-6">
                <dt className="t-label-sm flex items-center gap-2 text-encre/55"><Phone aria-hidden="true" className="h-4 w-4 text-accent" />Réservations</dt>
                <dd className="mt-2"><a href={`tel:${phone.replace(/\s/g, "")}`} className="souligne-lien font-semibold">{phone}</a></dd>
              </div>
            )}
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            {address && (
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${query}`} target="_blank" rel="noopener noreferrer" className="btn-sombre">
                <Navigation aria-hidden="true" className="h-4 w-4" />Itinéraire
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-contour">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />Réserver sur WhatsApp
              </a>
            )}
          </div>
        </div>
        {address && (
          <div className="relative min-h-[360px] overflow-hidden border border-bordure bg-gris-clair lg:min-h-full">
            <iframe
              title={`Plan d'accès : ${address}`}
              src={`https://www.google.com/maps?q=${query}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[30%]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
