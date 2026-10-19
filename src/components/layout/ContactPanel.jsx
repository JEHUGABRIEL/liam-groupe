import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { whatsappHref } from "@/lib/links";

/** Coordonnées du groupe (paramètre siteInfo), affichées dans la modale « Nous contacter ». */
export default function ContactPanel({ siteInfo = {} }) {
  const whatsapp = whatsappHref(siteInfo.social?.whatsapp, "Bonjour LIAM Groupe, j'aimerais avoir des informations.");
  const contact = siteInfo.contactPage || siteInfo;
  const address = contact.address || siteInfo.address || [];
  const row = "flex items-start gap-4 border-b border-bordure py-5";
  const icon = "mt-0.5 h-5 w-5 shrink-0 text-accent";

  return (
    <div>
      <p className="texte">
        Une question, une idée de partenariat, une réservation ? Écrivez-nous sur WhatsApp ou par e-mail,
        ou appelez-nous : l&apos;équipe vous répond rapidement.
      </p>
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn mt-6 w-full bg-whatsapp text-white hover:bg-noir-doux">
          <MessageCircle aria-hidden="true" className="h-5 w-5" />Écrire sur WhatsApp
        </a>
      )}
      <ul className="mt-6 border-t border-bordure">
        {(contact.phones || siteInfo.phones || []).length > 0 && (
          <li className={row}>
            <Phone aria-hidden="true" className={icon} />
            <div>
              <p className="t-label-sm text-encre/55">Téléphone</p>
              {(contact.phones || siteInfo.phones).map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="souligne-lien mt-1 block w-fit font-semibold">{phone}</a>
              ))}
            </div>
          </li>
        )}
        {(contact.emails || siteInfo.emails || []).length > 0 && (
          <li className={row}>
            <Mail aria-hidden="true" className={icon} />
            <div>
              <p className="t-label-sm text-encre/55">E-mail</p>
              {(contact.emails || siteInfo.emails).map((email) => (
                <a key={email} href={`mailto:${email}`} className="souligne-lien mt-1 block w-fit break-all font-semibold">{email}</a>
              ))}
            </div>
          </li>
        )}
        {address.length > 0 && (
          <li className={row}>
            <MapPin aria-hidden="true" className={icon} />
            <div>
              <p className="t-label-sm text-encre/55">Adresse</p>
              <p className="mt-1">{address.join(", ")}</p>
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(address.join(", "))}`} target="_blank" rel="noopener noreferrer" className="t-label-sm souligne-lien mt-2 inline-block text-accent">
                Voir sur la carte
              </a>
            </div>
          </li>
        )}
        {(contact.hours || siteInfo.hours || []).length > 0 && (
          <li className={row}>
            <Clock aria-hidden="true" className={icon} />
            <div>
              <p className="t-label-sm text-encre/55">Horaires</p>
              {(contact.hours || siteInfo.hours).map((h) => <p key={h} className="mt-1">{h}</p>)}
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
