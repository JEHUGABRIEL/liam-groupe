import { notFound } from "next/navigation";
import FindUs from "@/components/domain/FindUs";
import MenuSection from "@/components/domain/MenuSection";
import CallToAction from "@/components/sections/CallToAction";
import Gallery from "@/components/sections/Gallery";
import Steps from "@/components/sections/Steps";
import StoryCard, { StoryStack } from "@/components/sections/StoryCard";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/ui/PageHero";
import SectionTitle from "@/components/ui/SectionTitle";
import { getPublic } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { getSiteInfo } from "@/lib/site";

export const metadata = {
  title: "O'GAB — restaurant solidaire",
  description: "La carte du restaurant O'GAB à Bangui : cuisine centrafricaine, commande en ligne à emporter ou en livraison.",
};

export default async function OgabPage() {
  const [domain, menu, siteInfo] = await Promise.all([
    getPublic("/api/domains/ogab"),
    getPublic("/api/domains/ogab/menu", { fallback: [] }),
    getSiteInfo(),
  ]);
  if (!domain) notFound();
  const info = domain.details?.restaurantInfo || {};
  const dishes = menu.flatMap((c) => c.items);
  const prices = dishes.map((d) => d.price).filter((p) => p != null);
  const gallery = domain.gallery || [];

  return (
    <>
      <PageHero
        crumbs={[domain.name]}
        eyebrow={domain.category}
        title={`${domain.name}, le restaurant solidaire.`}
        action={{ href: "#carte", label: "Voir la carte" }}
        image={domain.heroImage}
        imageAlt={`Salle du restaurant ${domain.name}`}
      />

      {/* Introduction et chiffres clés */}
      <section className="py-12 lg:py-16">
        <div className="conteneur grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <p className="font-serif text-[1.45rem] leading-snug md:text-[1.75rem]">{domain.shortDescription}</p>
          <dl className="grid gap-8 sm:grid-cols-2">
            <div className="bloc-grille px-6">
              <dt className="t-display">{dishes.length}</dt>
              <dd className="mt-3 text-[0.95rem] leading-relaxed text-encre/70">plats et boissons à la carte, à commander en ligne.</dd>
            </div>
            {prices.length > 0 && (
              <div className="bloc-grille px-6">
                <dt className="font-mono text-[40px] font-bold leading-none md:text-[52px]">{formatPrice(Math.min(...prices)).replace(" FCFA", "")}<span className="ml-2 text-[0.4em] text-encre/55">FCFA</span></dt>
                <dd className="mt-3 text-[0.95rem] leading-relaxed text-encre/70">le premier prix : une cuisine généreuse et accessible.</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <Steps
        label="Commander en ligne"
        title="Du panier à votre table."
        description="La carte complète est en ligne : composez votre commande, l'équipe s'occupe du reste."
        steps={[
          { title: "Composez", subtitle: "votre panier", text: "Ajoutez plats, desserts et boissons depuis la carte ci-dessous." },
          { title: "Retrait", subtitle: "ou livraison", text: "Passez la prendre au restaurant ou faites-vous livrer à Bangui." },
          { title: "On vous", subtitle: "rappelle", text: "Un membre de l'équipe confirme la commande et l'heure par téléphone." },
          { title: "Bon", subtitle: "appétit !", text: "Vous réglez à la remise. Suivez vos commandes depuis votre compte." },
        ]}
      />

      <section id="carte" className="scroll-mt-24 py-14 md:py-20 lg:py-24">
        <div className="conteneur">
          <SectionTitle label="La carte" title="Cuisine centrafricaine, faite maison." description="Ajoutez vos plats au panier ; les prix sont confirmés à la validation de la commande." />
          <div className="mt-10">
            {menu.length > 0 ? <MenuSection menu={menu} /> : <EmptyState title="La carte arrive bientôt" />}
          </div>
        </div>
      </section>

      {domain.programs?.length > 0 && (
        <section className="bg-gris-clair py-14 md:py-20 lg:py-24">
          <div className="conteneur">
            <SectionTitle label="Au-delà de la salle" title="Une cuisine qui forme et qui emploie." />
            <StoryStack>
              {domain.programs.map((program, rank) => (
                <StoryCard
                  key={program.title}
                  rank={rank}
                  label={`${String(rank + 1).padStart(2, "0")} · ${domain.name}`}
                  title={program.title}
                  text={program.description}
                  href={rank === 0 ? "#carte" : "#infos"}
                  linkLabel={rank === 0 ? "Voir la carte" : "Nous joindre"}
                  image={gallery[(rank + 1) % Math.max(gallery.length, 1)] || domain.heroImage}
                />
              ))}
            </StoryStack>
          </div>
        </section>
      )}

      <FindUs hours={info.hours} address={info.address} phone={info.phone} whatsapp={siteInfo.social?.whatsapp} />
      <Gallery images={gallery} title={`${domain.name} en images`} />
      <CallToAction
        variant="clair"
        title="Un repas de groupe, un traiteur ?"
        text="Mariages, séminaires, réceptions : O'GAB cuisine pour vos événements, avec les produits et les savoir-faire locaux."
        action={{ href: "#carte", label: "Commander en ligne" }}
        whatsapp={siteInfo.social?.whatsapp}
      />
    </>
  );
}
