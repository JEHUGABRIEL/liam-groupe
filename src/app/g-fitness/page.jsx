import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import SubscribeButton from "@/components/domain/SubscribeButton";
import Trainers from "@/components/domain/Trainers";
import WeekSchedule from "@/components/domain/WeekSchedule";
import CallToAction from "@/components/sections/CallToAction";
import Gallery from "@/components/sections/Gallery";
import Programs from "@/components/sections/Programs";
import Steps from "@/components/sections/Steps";
import StoryCard, { StoryStack } from "@/components/sections/StoryCard";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { getPublic } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { getSiteInfo } from "@/lib/site";

export const metadata = {
  title: "G-Fitness — salle de sport",
  description: "Salle G-Fitness à Bangui : musculation, cours collectifs, coaching. Abonnez-vous en ligne.",
};

function durationLabel(days) {
  if (days === 1) return "la séance";
  if (days % 30 === 0) return days === 30 ? "par mois" : `pour ${days / 30} mois`;
  return `pour ${days} jours`;
}

export default async function GFitnessPage() {
  const [domain, plans, siteInfo] = await Promise.all([
    getPublic("/api/domains/g-fitness"),
    getPublic("/api/subscription-plans", { fallback: [] }),
    getSiteInfo(),
  ]);
  if (!domain) notFound();
  const { schedule = [], trainers = [] } = domain.details || {};
  const programs = domain.programs || [];
  const gallery = domain.gallery || [];
  const classesPerWeek = schedule.reduce((sum, day) => sum + (day.classes?.length || 0), 0);
  const cheapest = plans.length ? Math.min(...plans.map((p) => p.price)) : null;

  return (
    <>
      <PageHero
        crumbs={[domain.name]}
        eyebrow={domain.category}
        title={`${domain.name}, bougez avec nous.`}
        action={{ href: "#formules", label: "Nos formules" }}
        image={domain.heroImage}
        imageAlt="Séance collective G-Fitness"
      />

      {/* Introduction et chiffres clés */}
      <section className="py-12 lg:py-16">
        <div className="conteneur grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <p className="font-serif text-[1.45rem] leading-snug md:text-[1.75rem]">{domain.shortDescription}</p>
          <dl className="grid gap-8 sm:grid-cols-3">
            {classesPerWeek > 0 && (
              <div className="bloc-grille px-6">
                <dt className="whitespace-nowrap font-mono text-[40px] font-bold leading-none md:text-[48px]">{classesPerWeek}</dt>
                <dd className="mt-3 text-[0.92rem] leading-relaxed text-encre/70">cours collectifs par semaine</dd>
              </div>
            )}
            {trainers.length > 0 && (
              <div className="bloc-grille px-6">
                <dt className="whitespace-nowrap font-mono text-[40px] font-bold leading-none md:text-[48px]">{trainers.length}</dt>
                <dd className="mt-3 text-[0.92rem] leading-relaxed text-encre/70">coachs certifiés pour vous suivre</dd>
              </div>
            )}
            {cheapest != null && (
              <div className="bloc-grille px-6">
                <dt className="whitespace-nowrap font-mono text-[40px] font-bold leading-none md:text-[48px]">{formatPrice(cheapest).replace(" FCFA", "")}</dt>
                <dd className="mt-3 text-[0.92rem] leading-relaxed text-encre/70">FCFA la séance, sans engagement</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {programs.length > 0 && (
        <section className="bg-gris-clair py-14 md:py-20 lg:py-24">
          <div className="conteneur">
            <SectionTitle label="Nos activités" title="Musculation, cours collectifs, coaching." />
            <StoryStack>
              {programs.slice(0, 3).map((program, rank) => (
                <StoryCard
                  key={program.title}
                  rank={rank}
                  label={`${String(rank + 1).padStart(2, "0")} · G-Fitness`}
                  title={program.title}
                  text={program.description}
                  href="#formules"
                  linkLabel="Voir les formules"
                  image={gallery[rank % Math.max(gallery.length, 1)] || domain.heroImage}
                />
              ))}
            </StoryStack>
          </div>
        </section>
      )}
      {programs.length > 3 && <Programs programs={programs.slice(3)} label="Et aussi" title="Au-delà de la salle." />}

      <WeekSchedule schedule={schedule} />
      <Trainers trainers={trainers} />

      <section id="formules" className="scroll-mt-24 bg-gris-clair py-14 md:py-20 lg:py-24">
        <div className="conteneur">
          <SectionTitle
            label="Formules"
            title="Choisissez votre formule."
            description="Faites votre demande en ligne, réglez à l'accueil de la salle : votre abonnement est activé le jour même."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <Reveal key={plan.id} delay={index * 100} className="h-full">
                <article className={`flex h-full flex-col border p-8 ${plan.featured ? "border-noir-doux bg-noir-doux text-white" : "border-bordure bg-white"}`}>
                  {plan.featured && <span className="badge mb-5 self-start bg-accent text-white">Le plus choisi</span>}
                  <h3 className="t-h4">{plan.name}</h3>
                  <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="whitespace-nowrap font-mono text-[2.2rem] font-bold leading-none">{formatPrice(plan.price)}</span>
                    <span className={plan.featured ? "text-white/60" : "text-encre/55"}>{durationLabel(plan.durationDays)}</span>
                  </p>
                  {plan.description && <p className={`mt-4 ${plan.featured ? "text-white/75" : "texte"}`}>{plan.description}</p>}
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[0.95rem]">
                        <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <SubscribeButton plan={plan} featured={plan.featured} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Steps
        label="S'abonner"
        title="Quatre étapes, aucune file d'attente."
        steps={[
          { title: "Choisissez", subtitle: "votre formule", text: "Séance, mois ou trimestre : faites votre demande en ligne, en un clic." },
          { title: "Réglez", subtitle: "à l'accueil", text: "Présentez-vous à la salle : le paiement se fait sur place." },
          { title: "Abonnement", subtitle: "activé", text: "L'équipe active votre abonnement le jour même ; vous recevez un e-mail." },
          { title: "Suivez", subtitle: "vos séances", text: "Dates de début et de fin dans votre compte, renouvellement en un clic." },
        ]}
      />
      <Gallery images={gallery} title="La salle en images" />
      <CallToAction
        variant="clair"
        title="Une question avant de vous inscrire ?"
        text="Passez à la salle pour une séance découverte ou écrivez-nous : nos coachs vous conseillent la formule adaptée."
        action={{ href: "#formules", label: "Voir les formules" }}
        whatsapp={siteInfo.social?.whatsapp}
      />
    </>
  );
}
