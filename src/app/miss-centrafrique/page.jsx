import { notFound } from "next/navigation";
import EventCard from "@/components/cards/EventCard";
import MissApplication from "@/components/domain/MissApplication";
import Gallery from "@/components/sections/Gallery";
import Programs from "@/components/sections/Programs";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { getPublic } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Miss Centrafrique",
  description: "Le concours national Miss Centrafrique : déposez votre candidature en ligne.",
};

export default async function MissPage() {
  const [domain, edition, past, upcoming] = await Promise.all([
    getPublic("/api/domains/miss-centrafrique"),
    getPublic("/api/miss-centrafrique/editions/current", { revalidate: 60 }),
    getPublic("/api/events?past=true", { revalidate: 300, fallback: [] }),
    getPublic("/api/events", { revalidate: 60, fallback: [] }),
  ]);
  if (!domain) notFound();
  const events = [...upcoming, ...past].filter((e) => e.category === "Miss Centrafrique").slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={domain.category}
        title={`${domain.name}.`}
        intro={domain.shortDescription}
        action={edition ? { href: "#candidature", label: edition.registrationOpen ? "Candidater" : "Le concours" } : undefined}
        image={domain.heroImage}
      />
      <Programs programs={domain.programs} label="Le concours" />

      <section id="candidature" className="scroll-mt-24 bg-gris-clair py-14 md:py-20 lg:py-24">
        <div className="conteneur grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionTitle
              label="Candidature"
              title={edition ? edition.title : "Les candidatures ouvriront bientôt."}
              description={edition?.description}
            />
            {edition && (
              <dl className="mt-10 space-y-5">
                <div className="bloc-grille px-6">
                  <dt className="t-label-sm text-encre/60">Candidatures</dt>
                  <dd className="mt-2 font-semibold">du {formatDate(edition.registrationOpensOn)} au {formatDate(edition.registrationClosesOn)}</dd>
                </div>
                {(edition.minAge || edition.maxAge) && (
                  <div className="bloc-grille px-6">
                    <dt className="t-label-sm text-encre/60">Âge requis</dt>
                    <dd className="mt-2 font-semibold">{edition.minAge ?? "—"} à {edition.maxAge ?? "—"} ans</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
          <div className="border border-bordure bg-white p-6 md:p-10">
            {edition ? <MissApplication edition={edition} /> : <p className="texte">Suivez nos actualités pour connaître les dates de la prochaine édition.</p>}
          </div>
        </div>
      </section>

      {events.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="conteneur">
            <SectionTitle label="Agenda" title="Les rendez-vous du concours." />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {events.map((event) => <EventCard key={event.slug} event={event} />)}
            </div>
          </div>
        </section>
      )}
      <Gallery images={domain.gallery} title="Les éditions en images" />
    </>
  );
}
