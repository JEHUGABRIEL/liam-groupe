"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useModals } from "@/components/providers/ModalProvider";
import SafeImg from "@/components/ui/SafeImg";
import { formatPrice } from "@/lib/format";

/** Panier latéral : articles de la carte O'GAB et de la boutique. */
export default function CartDrawer() {
  const { items, count, total, open, setOpen, setQuantity, clear } = useCart();
  const { user } = useAuth();
  const { openAuth } = useModals();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" aria-label="Fermer le panier" className="absolute inset-0 bg-noir-doux/60" onClick={() => setOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex h-[88px] items-center justify-between border-b border-bordure pl-6">
          <p className="t-label">Panier · {count} article{count > 1 ? "s" : ""}</p>
          <button type="button" onClick={() => setOpen(false)} className="inline-flex h-full w-[82px] items-center justify-center hover:text-accent" aria-label="Fermer le panier">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag aria-hidden="true" className="h-10 w-10 text-attenue" />
            <p className="t-h5 mt-5">Votre panier est vide</p>
            <p className="texte mt-2">Ajoutez des plats de la carte O&apos;GAB ou des articles de la boutique.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/ogab#carte" onClick={() => setOpen(false)} className="btn-sombre px-5 py-3">La carte</Link>
              <Link href="/boutique" onClick={() => setOpen(false)} className="btn-contour px-5 py-3">La boutique</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-bordure overflow-y-auto px-6">
              {items.map((item) => (
                <li key={`${item.source}-${item.itemId}`} className="flex gap-4 py-5">
                  {item.image ? (
                    <SafeImg src={item.image} alt="" className="h-16 w-16 shrink-0 object-cover" />
                  ) : (
                    <div className="h-16 w-16 shrink-0 bg-gris-clair" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="t-label-sm text-encre/50">{item.source === "MENU" ? "O'GAB" : "Boutique"}</p>
                    <p className="mt-1 truncate font-semibold">{item.name}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-bordure">
                        <button type="button" className="p-2 hover:text-accent" aria-label="Retirer un" onClick={() => setQuantity(item.source, item.itemId, item.quantity - 1)}>
                          <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono text-sm font-bold">{item.quantity}</span>
                        <button type="button" className="p-2 hover:text-accent" aria-label="Ajouter un" onClick={() => setQuantity(item.source, item.itemId, item.quantity + 1)}>
                          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button type="button" className="self-start p-1 text-attenue hover:text-accent" aria-label={`Retirer ${item.name}`} onClick={() => setQuantity(item.source, item.itemId, 0)}>
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-bordure px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="t-label text-encre/60">Total estimé</span>
                <span className="font-mono text-xl font-bold">{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-[0.8rem] text-encre/55">Le prix définitif est confirmé à la validation de la commande.</p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={clear} className="btn-contour px-4">Vider</button>
                {user ? (
                  <Link href="/commande" onClick={() => setOpen(false)} className="btn-accent flex-1">Commander</Link>
                ) : (
                  <button type="button" onClick={() => { setOpen(false); openAuth("connexion", { redirect: "/commande" }); }} className="btn-accent flex-1">
                    Commander
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
