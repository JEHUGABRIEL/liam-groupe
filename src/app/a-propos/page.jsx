import CallToAction from "@/components/sections/CallToAction";
import ContactBlock from "@/components/sections/ContactBlock";
import Partners from "@/components/sections/Partners";
import Testimonials from "@/components/sections/Testimonials";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SafeImg from "@/components/ui/SafeImg";
import SectionTitle from "@/components/ui/SectionTitle";
import SocialIcon, { SOCIAL_NETWORKS } from "@/components/ui/SocialIcon";
import { getPublic } from "@/lib/api";
import { getSettings } from "@/lib/site";

export const metadata = {
  title: "À propos",
  description: "LIAM Groupe : Leadership, Innovation, Ambition, Mission. Notre histoire, notre vision et notre équipe.",
};

const ACRONYM = [
  { letter: "L", word: "Leadership", text: "Promouvoir l'initiative et l'excellence." },
  { letter: "I", word: "Innovation", text: "Créer des solutions nouvelles et impactantes." },
  { letter: "A", word: "Ambition", text: "Viser le développement durable et la réussite des talents." },
  { letter: "M", word: "Mission", text: "Agir avec un objectif clair de valeur sociale et économique." },
];

export default async function AboutPage() {
  const [settings, team, partners, testimonials] = await Promise.all([
    getSettings(),
    getPublic("/api/site/team", { revalidate: 300, fallback: [] }),
    getPublic("/api/site/partners", { revalidate: 300, fallback: [] }),
    getPublic("/api/site/testimonials", { revalidate: 300, fallback: [] }),
  ]);
  const siteInfo = settings.siteInfo || {};

  return (
    <>
      <PageHero
        eyebrow="Notre raison d'être"
        title="Leadership · Innovation · Ambition · Mission."
        intro={`Fondée en ${siteInfo.foundingYear || 2015} à Bangui, LIAM Groupe œuvre pour le développement durable des communautés à travers l'innovation sociale, le sport, l'entrepreneuriat féminin, la gastronomie et la culture.`}
        action={{ href: "#equipe", label: "Notre équipe" }}
        image={settings.homeHeroImages?.[1]}
      />

      <section className="py-14 md:py-20 lg:py-24">
        <div className="conteneur">
          <SectionTitle label="Que signifie LIAM ?" title="Quatre lettres, quatre engagements." />
          <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {ACRONYM.map((item, index) => (
              <Reveal key={item.letter} delay={index * 100} className="bloc-grille px-6">
                <dt>
                  <span className="t-display text-accent">{item.letter}</span>
                  <span className="t-h5 mt-4 block">{item.word}</span>
                </dt>
                <dd className="texte mt-3 text-[0.95rem]">{item.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-gris-clair py-14 md:py-20 lg:py-24">
        <div className="conteneur grid gap-12 md:grid-cols-2">
          <div>
            <p className="t-label text-encre/60">Notre vision</p>
            <p className="mt-5 font-serif text-[1.7rem] leading-snug md:text-[2.1rem]">
              Être un acteur de référence en entrepreneuriat, culture, sport et gastronomie en Afrique centrale.
            </p>
          </div>
          <div>
            <p className="t-label text-encre/60">Notre mission</p>
            <p className="mt-5 font-serif text-[1.7rem] leading-snug md:text-[2.1rem]">
              Révéler les talents et créer des opportunités durables.
            </p>
            <p className="texte mt-6">{siteInfo.description}</p>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section id="equipe" className="scroll-mt-24 py-14 md:py-20 lg:py-24">
          <div className="conteneur">
            <SectionTitle label="Notre équipe" title="Les visages de LIAM Groupe." description="Une équipe passionnée qui met son expertise au service de la communauté centrafricaine." />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <li key={member.id} className="carte flex flex-col">
                  <div className="aspect-[4/5] overflow-hidden bg-gris-clair">
                    {member.image && (
                      <SafeImg src={member.image} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="t-h5">{member.name}</p>
                    {member.role && <p className="t-label-sm mt-2 text-accent">{member.role}</p>}
                    {member.description && <p className="texte mt-3 text-[0.9rem]">{member.description}</p>}
                    <div className="mt-auto flex gap-2 pt-5">
                      {Object.entries(member.social || {})
                        .filter(([network, url]) => url && SOCIAL_NETWORKS.includes(network))
                        .map(([network, url]) => (
                          <a key={network} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} sur ${network}`} className="flex h-9 w-9 items-center justify-center border border-bordure hover:border-accent hover:text-accent">
                            <SocialIcon network={network} />
                          </a>
                        ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Testimonials testimonials={testimonials} />
      <Partners partners={partners} className="bg-white" />
      <ContactBlock
        siteInfo={siteInfo}
        className="border-t border-bordure"
        blocks={[
          { title: "Nous rejoindre", text: "Bénévole, partenaire, mécène : il y a mille façons de soutenir nos programmes. Parlons-en." },
          { title: "Nous rendre visite", text: (siteInfo.address || []).join(", ") },
        ]}
      />
      <CallToAction
        title="Envie de nous rejoindre ?"
        text="Bénévole, partenaire, mécène ou futur membre de l'équipe : parlons de ce que nous pouvons construire ensemble."
        action={{ href: "/actualites#agenda", label: "Nos prochains événements" }}
        whatsapp={settings.siteInfo?.social?.whatsapp}
      />
    </>
  );
}
