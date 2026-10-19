"use client";

import { Plus } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

/** Ajoute un plat (MENU) ou un produit (BOUTIQUE) au panier. Sans prix, l'article se commande par message. */
export default function AddToCartButton({ source, item, className = "btn-sombre px-5 py-3", label = "Ajouter" }) {
  const { add } = useCart();
  if (item.price === null || item.price === undefined) {
    return <span className="t-label-sm text-encre/50">Prix sur demande</span>;
  }
  return (
    <button
      type="button"
      className={className}
      onClick={() => add({ source, itemId: item.id, name: item.name, price: item.price, image: item.image })}
      aria-label={`Ajouter ${item.name} au panier`}
    >
      <Plus aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}
