import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import SafeImg from "@/components/ui/SafeImg";
import { getPublic } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getPublic(`/api/products/${slug}`);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getPublic(`/api/products/${slug}`);
  if (!product) notFound();

  return (
    <section className="py-12 md:py-16">
      <div className="conteneur">
        <Link href="/boutique" className="souligne-lien t-label-sm inline-flex items-center gap-2 text-encre/60">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />La boutique
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-square overflow-hidden bg-gris-clair">
            {product.image && (
              <SafeImg src={product.image} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex flex-col">
            {product.category && <p className="t-label text-accent">{product.category}</p>}
            <h1 className="t-h2 mt-4">{product.name}</h1>
            <p className="mt-6 font-mono text-[1.8rem] font-bold">{formatPrice(product.price)}</p>
            {product.description && <p className="texte mt-6 text-[1.05rem]">{product.description}</p>}
            <div className="mt-10">
              <AddToCartButton source="BOUTIQUE" item={product} className="btn-accent" label="Ajouter au panier" />
            </div>
            <p className="mt-6 text-[0.88rem] text-encre/55">Retrait au siège de LIAM Groupe ou livraison à Bangui, au choix lors de la commande.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
