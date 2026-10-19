import Link from "next/link";
import EventCard from "@/components/cards/EventCard";
import NewsCard from "@/components/cards/NewsCard";
import StoryCard, { StoryStack } from "@/components/sections/StoryCard";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { getPublic } from "@/lib/api";
import { EVENT_STATUS, formatPeriod } from "@/lib/format";

export const metadata = {
  title: "Actualités et événements",
  description: "Les nouvelles de LIAM Groupe et l'agenda de nos événements : inscrivez-vous en ligne.",
};

export default async function NewsPage({ searchParams }) {
  const { etiquette } = await searchParams;
  const [news, allNews, upcoming, past] = await Promise.all([
    getPublic(`/api/news${etiquette ? `?tag=${encodeURIComponent(etiquette)}` : ""}`, { fallback: [] }),
    getPublic("/api/news", { fallback: [] }),
    getPublic("/api/events", { revalidate: 30, fallback: [] }),
    getPublic("/api/events?past=true", { revalidate: 300, fallback: [] }),
  ]);
  const tags = [...new Set(allNews.flatMap((n) => n.tags))];
  const chip = "badge border border-bordure px-4 py-2 aria-[current=page]:border-noir-doux aria-[current=page]:bg-noir-doux aria-[current=page]:text-white";

  return (
    <>
      <PageHero
        eyebrow="La vie du groupe"
        title="Actualités & événements."
        intro="Nos dernières nouvelles, et l'agenda des événements auxquels vous pouvez vous inscrire en ligne."
        action={{ href: "#agenda", label: "Voir l'agenda" }}
      />

      <section className="py-14 md:py-20">
        <div className="conteneur">
          <SectionTitle label="Actualités" title="Ce qui se passe chez LIAM." />
          {tags.length > 1 && (
            <nav aria-label="Filtrer par thème" className="mt-8 flex flex-wrap gap-2">
              <Link href="/actualites" aria-current={!etiquette ? "page" : undefined} className={chip}>Tout</Link>
              {tags.map((tag) => (
                <Link key={tag} href={`/actualites?etiquette=${encodeURIComponent(tag)}`} aria-current={etiquette === tag ? "page" : undefined} className={chip}>{tag}</Link>
              ))}
            </nav>
          )}
          <div className="mt-10">
            {news.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => <NewsCard key={article.slug} article={article} />)}
              </div>
            ) : (
              <EmptyState title="Aucune actualité pour le moment" />
            )}
          </div>
        </div>
      </section>

      <section id="agenda" className="scroll-mt-24 bg-gris-clair py-14 md:py-20 lg:py-24">
        <div className="conteneur">
          <SectionTitle
            label="Agenda"
            title="Nos prochains événements."
            description="Créez votre compte (ou connectez-vous) pour vous inscrire : vous recevez une confirmation par e-mail."
          />
          <div className="mt-10">
            {upcoming.length > 0 ? (
              <StoryStack>
                {upcoming.map((event, rank) => (
                  <StoryCard
                    key={event.slug}
                    rank={rank}
                    label={[event.category, EVENT_STATUS[event.status]].filter(Boolean).join(" · ")}
                    title={event.title}
                    text={event.description}
                    checks={[formatPeriod(event.startDate, event.endDate), event.location].filter(Boolean)}
                    footnote={event.registrationOpen ? `Inscriptions ouvertes${event.seatsLeft != null ? ` · ${event.seatsLeft} places` : ""}` : "Inscriptions closes"}
                    href={`/evenements/${event.slug}`}
                    linkLabel="Voir et s'inscrire"
                    image={event.image}
                  />
                ))}
              </StoryStack>
            ) : (
              <EmptyState title="Pas d'événement programmé pour l'instant">De nouveaux rendez-vous sont annoncés ici et sur nos réseaux.</EmptyState>
            )}
          </div>
          {past.length > 0 && (
            <>
              <p className="t-label mt-16 text-encre/60">Événements passés</p>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {past.slice(0, 6).map((event) => <EventCard key={event.slug} event={event} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
