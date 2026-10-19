import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import SafeImg from "@/components/ui/SafeImg";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }) {
  return (
    <article className="carte group flex h-full flex-col">
      <Link href={`/boutique/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gris-clair">
        {product.image && (
          <SafeImg src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        {product.category && <p className="t-label-sm text-encre/50">{product.category}</p>}
        <h3 className="t-h5 mt-2"><Link href={`/boutique/${product.slug}`} className="souligne-lien">{product.name}</Link></h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="font-mono text-[1.05rem] font-bold">{formatPrice(product.price)}</span>
          <AddToCartButton source="BOUTIQUE" item={product} />
        </div>
      </div>
    </article>
  );
}
