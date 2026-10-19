import Link from "next/link";
import ProductCard from "@/components/cards/ProductCard";
import CallToAction from "@/components/sections/CallToAction";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/ui/PageHero";
import { getPublic } from "@/lib/api";
import { getDomains, getSiteInfo } from "@/lib/site";

export const metadata = {
  title: "Boutique",
  description: "Casquettes, t-shirts et accessoires LIAM Groupe et G-Fitness. Chaque achat soutient nos programmes.",
};

export default async function ShopPage({ searchParams }) {
  const { domaine } = await searchParams;
  const [products, allProducts, domains] = await Promise.all([
    getPublic(`/api/products${domaine ? `?domain=${encodeURIComponent(domaine)}` : ""}`, { fallback: [] }),
    getPublic("/api/products", { fallback: [] }),
    getDomains(),
  ]);
  // Filtres : seulement les vendeurs qui ont des produits.
  const sellers = [...new Set(allProducts.map((p) => p.domainSlug))];
  const sellerName = (slug) => (slug === "liam-groupe" ? "LIAM Groupe" : domains.find((d) => d.slug === slug)?.name || slug);

  return (
    <>
      <PageHero
        eyebrow="Boutique solidaire"
        title="Portez les couleurs de LIAM Groupe."
        intro="Ajoutez vos articles au panier et commandez en ligne : retrait au siège ou livraison à Bangui."
      />
      <section className="py-14 md:py-20">
        <div className="conteneur">
          {sellers.length > 1 && (
            <nav aria-label="Filtrer par vendeur" className="mb-10 flex flex-wrap gap-2">
              <Link href="/boutique" aria-current={!domaine ? "page" : undefined} className="badge border border-bordure px-4 py-2 aria-[current=page]:border-noir-doux aria-[current=page]:bg-noir-doux aria-[current=page]:text-white">Tout</Link>
              {sellers.map((slug) => (
                <Link key={slug} href={`/boutique?domaine=${slug}`} aria-current={domaine === slug ? "page" : undefined} className="badge border border-bordure px-4 py-2 aria-[current=page]:border-noir-doux aria-[current=page]:bg-noir-doux aria-[current=page]:text-white">
                  {sellerName(slug)}
                </Link>
              ))}
            </nav>
          )}
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          ) : (
            <EmptyState title="Aucun produit pour le moment">Revenez bientôt, de nouveaux articles arrivent.</EmptyState>
          )}
        </div>
      </section>
      <CallToAction
        title="Une commande groupée, un article sur mesure ?"
        text="Associations, équipes, événements : contactez-nous pour des tenues et accessoires aux couleurs de votre projet."
        action={{ href: "/a-propos", label: "Qui sommes-nous" }}
        whatsapp={(await getSiteInfo()).social?.whatsapp}
      />
    </>
  );
}
