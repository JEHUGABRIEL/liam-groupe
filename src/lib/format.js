// Mise en forme commune (montants en FCFA, dates en français, statuts).

const number = new Intl.NumberFormat("fr-FR");

/** 15000 → « 15 000 FCFA » ; null → « Sur demande ». */
export function formatPrice(amount) {
  if (amount === null || amount === undefined) return "Sur demande";
  return `${number.format(amount).replace(/ | /g, " ")} FCFA`;
}

/** "2026-10-18" ou instant ISO → « 18 octobre 2026 ». */
export function formatDate(value, options = { day: "numeric", month: "long", year: "numeric" }) {
  if (!value) return "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return date.toLocaleDateString("fr-FR", options);
}

/** Période d'un événement : « 15 août 2026 » ou « 15 – 17 août 2026 ». */
export function formatPeriod(start, end) {
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start, { day: "numeric", month: "long" })} – ${formatDate(end)}`;
}

export const ORDER_STATUS = {
  EN_ATTENTE: "En attente de confirmation",
  CONFIRMEE: "Confirmée",
  PRETE: "Prête",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export const SUBSCRIPTION_STATUS = {
  EN_ATTENTE: "En attente de paiement",
  ACTIVE: "Actif",
  EXPIREE: "Expiré",
  ANNULEE: "Annulé",
};

export const APPLICATION_STATUS = {
  SOUMISE: "Envoyée",
  PRESELECTIONNEE: "Présélectionnée",
  RETENUE: "Retenue",
  REFUSEE: "Non retenue",
  RETIREE: "Retirée",
};

export const EVENT_STATUS = {
  A_VENIR: "À venir",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

export const REGISTRATION_STATUS = {
  CONFIRMEE: "Inscription confirmée",
  ANNULEE: "Inscription annulée",
};
