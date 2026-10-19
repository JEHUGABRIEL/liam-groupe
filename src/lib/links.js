/** Page d'un domaine : les domaines phares ont leur propre page, les autres la page générique. */
export function domainHref(slug) {
  if (slug === "ogab") return "/ogab";
  if (slug === "g-fitness") return "/g-fitness";
  if (slug === "miss-centrafrique") return "/miss-centrafrique";
  return `/domaines/${slug}`;
}

/** Lien WhatsApp vers le numéro du groupe (siteInfo.social.whatsapp), avec un message prérempli. */
export function whatsappHref(number, text) {
  if (!number) return null;
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/ogab", label: "O'GAB" },
  { href: "/g-fitness", label: "G-Fitness" },
  { href: "/boutique", label: "Boutique" },
  { href: "/actualites", label: "Actualités" },
];
