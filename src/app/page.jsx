import DomainFlipCard from "@/components/cards/DomainFlipCard";
import Banner from "@/components/sections/Banner";
import CallToAction from "@/components/sections/CallToAction";
import ContactBlock from "@/components/sections/ContactBlock";
import DarkAccordion from "@/components/sections/DarkAccordion";
import Partners from "@/components/sections/Partners";
import StoryCard, { StoryStack } from "@/components/sections/StoryCard";
import Testimonials from "@/components/sections/Testimonials";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { getPublic } from "@/lib/api";
import { EVENT_STATUS, formatDate, formatPeriod } from "@/lib/format";
import { domainHref } from "@/lib/links";
import { getDomains, getSettings } from "@/lib/site";

const FEATURED = ["ogab", "g-fitness", "miss-centrafrique"];

/** Accueil : même enchaînement de sections que kode-rca.vercel.app. */
export default async function HomePage() {
  const [settings, domains, news, events, testimonials, partners] = await Promise.all([
    getSettings(),
    getDomains(),
    getPublic("/api/news", { fallback: [] }),
    getPublic("/api/events", { fallback: [] }),
    getPublic("/api/site/testimonials", { revalidate: 300, fallback: [] }),
    getPublic("/api/site/partners", { revalidate: 300, fallback: [] }),
  ]);
  const siteInfo = settings.siteInfo || {};
  const years = siteInfo.foundingYear ? new Date().getFullYear() - siteInfo.foundingYear : null;
  const featured = FEATURED.map((slug) => domains.find((d) => d.slug === slug)).filter(Boolean);
  const others = domains.filter((d) => !FEATURED.includes(d.slug));

  return (
    <>
      <PageHero
        eyebrow="ONG pluridisciplinaire · Bangui, RCA"
        title={`${siteInfo.tagline || "Révéler les talents, créer des opportunités durables"}.`}
        action={{ href: "#poles", label: `Nos ${domains.length || 7} domaines` }}
        image={settings.homeHeroImages?.[0]}
      />

      {/* Présentation + chiffres */}
      <section className="py-14 lg:py-20">
        <div className="conteneur grid gap-10 lg:grid-cols-[minmax(0,430px)_1fr] lg:gap-20">
          <p className="text-[1rem] leading-[1.45]">{siteInfo.description}</p>
          <dl className="grid gap-10 sm:grid-cols-2">
            {years > 0 && (
              <div className="bloc-grille px-6">
                <dt className="t-display">{years}<span className="text-accent">+</span></dt>
                <dd className="mt-3 max-w-[300px] text-[0.95rem] leading-relaxed text-encre/70">Années d&apos;actions depuis {siteInfo.foundingYear}, à Bangui et dans les préfectures.</dd>
              </div>
            )}
            <div className="bloc-grille px-6">
              <dt className="t-display">{domains.length}</dt>
              <dd className="mt-3 max-w-[300px] text-[0.95rem] leading-relaxed text-encre/70">Domaines d&apos;intervention, du sport à la gastronomie, de la culture à l&apos;entrepreneuriat.</dd>
            </div>
          </dl>
        </div>
      </section>

      <ContactBlock
        siteInfo={siteInfo}
        blocks={[
          { title: "Révéler les talents", text: "Nos programmes donnent aux femmes et aux jeunes centrafricains les outils pour entreprendre, se former et s'exprimer : un talent repéré est un talent accompagné." },
          { title: "Créer des opportunités", text: "Restaurant solidaire, salle de sport, concours national, ateliers : chaque projet crée de l'activité, des emplois et des modèles à suivre." },
        ]}
      />

      {/* Trois pôles phares (cartes photo) */}
      <section id="poles" className="scroll-mt-24 bg-gris-clair py-14 md:py-20 lg:py-24">
        <div className="conteneur">
          <SectionTitle
            label="Nos pôles phares"
            title="Trois lieux, une même mission."
            description="Un restaurant, une salle de sport, un concours national : nos trois projets emblématiques, ouverts à tous et pensés pour créer de l'emploi."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16">
            {featured.map((domain, index) => (
              <Reveal key={domain.slug} delay={index * 100} className="h-full">
                <DomainFlipCard domain={domain} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Autres domaines : cartes empilées, comme les actualités */}
      {others.length > 0 && (
        <section className="py-14 md:py-20 lg:py-24">
          <div className="conteneur">
            <SectionTitle
              label="Nos domaines"
              title="Former, accompagner, faire rayonner."
              description="Au-delà de nos trois lieux, des programmes pour entreprendre, se former, communiquer et se rassembler."
            />
            <StoryStack>
              {others.map((domain, rank) => (
                <StoryCard
                  key={domain.slug}
                  rank={rank}
                  label={`${String(rank + 1).padStart(2, "0")} · ${domain.category || "Domaine"}`}
                  title={domain.name}
                  text={domain.shortDescription}
                  checks={(domain.programs || []).slice(0, 4).map((program) => program.title)}
                  href={domainHref(domain.slug)}
                  linkLabel="Découvrir le domaine"
                  image={domain.cardImage || domain.heroImage}
                />
              ))}
            </StoryStack>
          </div>
        </section>
      )}

      <Banner
        label="Boutique solidaire"
        title="Portez les couleurs de LIAM Groupe."
        text="Casquettes, t-shirts et accessoires LIAM et G-Fitness, à commander en ligne : chaque achat finance nos programmes."
        action={{ href: "/boutique", label: "Découvrir la boutique" }}
      />

      <DarkAccordion
        title="Pour qui ?"
        subtitle="Nos programmes partent des besoins de chacun."
        text="Que vous ayez une idée d'entreprise, envie de vous dépenser, un talent à révéler ou un projet à soutenir, il y a une porte d'entrée pour vous."
        items={[
          { title: "Femmes entrepreneures", text: "Accompagnement, formation et mise en réseau pour lancer ou développer votre activité, avec des femmes qui l'ont fait avant vous.", href: domainHref("entrepreneuriat"), linkLabel: "Entrepreneuriat & leadership" },
          { title: "Jeunes", text: "Formations au numérique et aux métiers, activités sportives encadrées, programmes junior : de quoi apprendre, se dépasser et se faire repérer.", href: domainHref("formation"), linkLabel: "Formation des jeunes" },
          { title: "Familles & particuliers", text: "Un repas chez O'GAB, un abonnement à G-Fitness, une soirée ou un tournoi : nos lieux sont ouverts à tous, toute l'année.", href: "/ogab", linkLabel: "Le restaurant O'GAB" },
          { title: "Entreprises, institutions & partenaires", text: "Traiteur, événements, campagnes de sensibilisation, mécénat : construisons ensemble des actions à fort impact social.", href: domainHref("evenementiel"), linkLabel: "Événementiel" },
        ]}
        action={{ href: "/a-propos", label: "Qui sommes-nous" }}
      />

      {/* Actualités : cartes horizontales encadrées */}
      <section className="py-14 md:py-20 lg:py-24">
        <div className="conteneur">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle label="Actualités" title="Ce qui s'est passé dernièrement." description="Nos dernières nouvelles, prix, partenariats et portraits." />
            <a href="/actualites" className="btn-contour">Toutes les actualités</a>
          </div>
          <StoryStack>
            {news.length > 0 ? news.slice(0, 3).map((article, rank) => (
              <StoryCard
                key={article.slug}
                rank={rank}
                label={[...(article.tags || []), formatDate(article.publishedOn)].join(" · ")}
                title={article.title}
                text={article.excerpt}
                href={`/actualites/${article.slug}`}
                linkLabel="Lire l'article"
                image={article.image}
              />
            )) : <EmptyState title="Aucune actualité pour le moment" />}
          </StoryStack>
        </div>
      </section>

      <Testimonials testimonials={testimonials} />

      {/* Agenda : même gabarit que les « formats d'événements » du modèle */}
      <section className="py-14 md:py-20 lg:py-24">
        <div className="conteneur">
          <SectionTitle label="Agenda" title="Nos prochains rendez-vous." description="Inscrivez-vous en ligne avec votre compte : la confirmation arrive par e-mail." />
          <StoryStack>
            {events.length > 0 ? events.slice(0, 3).map((event, rank) => (
              <StoryCard
                key={event.slug}
                rank={rank}
                label={[event.category, EVENT_STATUS[event.status]].filter(Boolean).join(" · ")}
                title={event.title}
                text={event.description}
                checks={[formatPeriod(event.startDate, event.endDate), event.location].filter(Boolean)}
                footnote={event.registrationOpen ? `Inscriptions ouvertes${event.seatsLeft != null ? ` · ${event.seatsLeft} places` : ""}` : undefined}
                href={`/evenements/${event.slug}`}
                linkLabel="Voir l'événement"
                image={event.image}
              />
            )) : (
              <EmptyState title="Pas d'événement programmé pour l'instant">
                Les prochains rendez-vous sont annoncés ici. <a href="/actualites#agenda" className="souligne-lien font-semibold">Revoir les événements passés</a>
              </EmptyState>
            )}
          </StoryStack>
        </div>
      </section>

      <Partners partners={partners} />
      <CallToAction
        title="Un projet, un partenariat, une question ?"
        text="Écrivez-nous ou passez nous voir : l'équipe vous répond rapidement et vous oriente vers le bon programme."
        action={{ href: "/a-propos", label: "Découvrir LIAM Groupe" }}
        whatsapp={siteInfo.social?.whatsapp}
      />
    </>
  );
}
