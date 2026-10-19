import { Check } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import ContactBlock from "@/components/sections/ContactBlock";
import Gallery from "@/components/sections/Gallery";
import Programs from "@/components/sections/Programs";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { getPublic } from "@/lib/api";
import { domainHref } from "@/lib/links";
import { getSiteInfo } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const domain = await getPublic(`/api/domains/${slug}`);
  return domain ? { title: domain.name, description: domain.shortDescription } : {};
}

/** Page des domaines sans page dédiée (entrepreneuriat, formation, communication, événementiel). */
export default async function DomainPage({ params }) {
  const { slug } = await params;
  if (domainHref(slug) !== `/domaines/${slug}`) redirect(domainHref(slug));
  const [domain, siteInfo] = await Promise.all([getPublic(`/api/domains/${slug}`), getSiteInfo()]);
  if (!domain) notFound();

  return (
    <>
      <PageHero eyebrow={domain.category} title={`${domain.name}.`} intro={domain.shortDescription} image={domain.heroImage} />
      {domain.description && (
        <section className="py-14 md:py-20">
          <div className="conteneur">
            <p className="max-w-3xl font-serif text-[1.45rem] leading-snug md:text-[1.7rem]">{domain.description}</p>
          </div>
        </section>
      )}
      {domain.objectives?.length > 0 && (
        <section className="bg-gris-clair py-14 md:py-20">
          <div className="conteneur">
            <SectionTitle label="Objectifs" title="Ce que nous visons." />
            <ul className="mt-10 grid gap-x-10 gap-y-4 md:grid-cols-2">
              {domain.objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-3 border-b border-bordure pb-4">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-accent" />{objective}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <Programs programs={domain.programs} />
      <Gallery images={domain.gallery} />
      <ContactBlock
        siteInfo={siteInfo}
        className="border-t border-bordure"
        blocks={[
          { title: "Participer", text: `Vous souhaitez rejoindre un programme ${domain.name} ? Contactez-nous, l'équipe vous oriente.` },
          { title: "Soutenir", text: "Entreprises, institutions, mécènes : construisons ensemble des actions à fort impact." },
        ]}
      />
    </>
  );
}
