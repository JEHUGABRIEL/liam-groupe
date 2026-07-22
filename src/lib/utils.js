
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}


const FRENCH_MONTHS = {
  janvier: 0, f\u00e9vrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, ao\u00fbt: 7, septembre: 8, octobre: 9, novembre: 10, d\u00e9cembre: 11,
};

const ENGLISH_MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};


export function parseEventDate(dateStr) {
  if (!dateStr) return null;

  const trimmed = dateStr.trim();

  
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    const d = new Date(+iso[1], +iso[2] - 1, +iso[3]);
    return isNaN(d.getTime()) ? null : d;
  }

  
  const fr = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(trimmed);
  if (fr) {
    const monthIndex = FRENCH_MONTHS[fr[2].toLowerCase()];
    if (monthIndex !== undefined) {
      const d = new Date(+fr[3], monthIndex, +fr[1]);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  
  const en = /^(\S+)\s+(\d{1,2}),?\s+(\d{4})$/.exec(trimmed);
  if (en) {
    const monthIndex = ENGLISH_MONTHS[en[1].toLowerCase()];
    if (monthIndex !== undefined) {
      const d = new Date(+en[3], monthIndex, +en[2]);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  return null;
}


export function computeEventStatus(dateStr, currentStatus, endDateStr) {
  
  const refDate = endDateStr || dateStr;
  const parsed = parseEventDate(refDate);
  if (!parsed) return currentStatus || "a_venir";

  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());

  if (eventDay < today) return "passe";
  return "a_venir";
}

