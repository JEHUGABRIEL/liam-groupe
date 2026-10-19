import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventRegistration from "@/components/domain/EventRegistration";
import Gallery from "@/components/sections/Gallery";
import SafeImg from "@/components/ui/SafeImg";
import { getPublic } from "@/lib/api";
import { EVENT_STATUS, formatPeriod } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getPublic(`/api/events/${slug}`, { revalidate: 0 });
  return event ? { title: event.title, description: event.description?.slice(0, 160) } : {};
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  // Places restantes : toujours à jour.
  const event = await getPublic(`/api/events/${slug}`, { revalidate: 0 });
  if (!event) notFound();

  return (
    <>
      <section className="bloc-heros">
        <Link href="/actualites#agenda" className="souligne-lien t-label-sm inline-flex items-center gap-2 self-start text-encre/60">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />Agenda
        </Link>
        <p className="mt-8 flex items-center gap-1.5">
          <span aria-hidden="true" className="font-mono text-[13px] font-bold text-accent">/</span>
          <span className="sur-titre pl-[5px]">{event.category || "Événement"} · {EVENT_STATUS[event.status]}</span>
        </p>
        <h1 className="titre-heros mt-3 max-w-4xl">{event.title}</h1>
      </section>
      {event.image && (
        <div className="relative h-[280px] overflow-hidden md:h-[460px]">
          <SafeImg src={event.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}
      <section className="py-14 md:py-20">
        <div className="conteneur grid gap-12 lg:grid-cols-[1fr_400px]">
          <div className="texte whitespace-pre-line text-[1.05rem]">{event.description}</div>
          <aside className="h-fit border border-bordure p-8">
            <ul className="space-y-4">
              <li className="flex gap-3"><CalendarDays aria-hidden="true" className="mt-0.5 h-5 w-5 text-accent" /><span className="font-semibold">{formatPeriod(event.startDate, event.endDate)}</span></li>
              {event.location && <li className="flex gap-3"><MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 text-accent" />{event.location}</li>}
              {event.capacity && (
                <li className="flex gap-3"><Users aria-hidden="true" className="mt-0.5 h-5 w-5 text-accent" />{event.seatsLeft} place{event.seatsLeft > 1 ? "s" : ""} restante{event.seatsLeft > 1 ? "s" : ""} sur {event.capacity}</li>
              )}
            </ul>
            <div className="mt-8 border-t border-bordure pt-8">
              <EventRegistration event={event} />
            </div>
          </aside>
        </div>
      </section>
      <Gallery images={event.gallery} />
    </>
  );
}
