import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import SafeImg from "@/components/ui/SafeImg";
import { EVENT_STATUS, formatPeriod } from "@/lib/format";

const STATUS_STYLE = {
  A_VENIR: "bg-accent text-white",
  EN_COURS: "bg-emerald-600 text-white",
  TERMINE: "bg-gris-clair text-encre/70",
  ANNULE: "bg-noir-doux text-white",
};

/** Événement en ligne horizontale (agenda) : date, titre, lieu, places. */
export default function EventCard({ event }) {
  return (
    <article className="carte group grid overflow-hidden sm:grid-cols-[220px_1fr]">
      <div className="relative aspect-[16/10] bg-gris-clair sm:aspect-auto">
        {event.image && (
          <SafeImg src={event.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`badge ${STATUS_STYLE[event.status]}`}>{EVENT_STATUS[event.status]}</span>
          {event.category && <span className="t-label-sm text-encre/50">{event.category}</span>}
        </div>
        <h3 className="t-h5 mt-4">
          <Link href={`/evenements/${event.slug}`} className="souligne-lien">{event.title}</Link>
        </h3>
        <ul className="mt-4 space-y-1.5 text-[0.92rem] text-encre/70">
          <li className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4 text-accent" />{formatPeriod(event.startDate, event.endDate)}</li>
          {event.location && <li className="flex items-center gap-2"><MapPin aria-hidden="true" className="h-4 w-4 text-accent" />{event.location}</li>}
        </ul>
        {event.registrationOpen && (
          <p className="t-label-sm mt-auto pt-5 text-accent">
            Inscriptions ouvertes{event.seatsLeft != null ? ` · ${event.seatsLeft} place${event.seatsLeft > 1 ? "s" : ""}` : ""}
          </p>
        )}
      </div>
    </article>
  );
}
