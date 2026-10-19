"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import EmptyState from "@/components/ui/EmptyState";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { api } from "@/lib/client";
import { formatPrice } from "@/lib/format";

/** Validation du panier : mode de retrait, coordonnées, puis envoi à l'API (prix recalculés). */
export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const [form, setForm] = useState({ deliveryMode: "RETRAIT", deliveryAddress: "", phone: "", note: "" });
  const [state, setState] = useState({ status: "idle", errors: {} });
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (user?.phone) setForm((f) => (f.phone ? f : { ...f, phone: user.phone }));
  }, [user]);

  if (order) {
    return (
      <div className="border border-bordure bg-white p-8 text-center md:p-12">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-emerald-600" />
        <p className="t-label mt-6 text-encre/60">Commande enregistrée</p>
        <p className="t-h2 mt-3">{order.reference}</p>
        <p className="texte mx-auto mt-5 max-w-md">
          Total : <strong>{formatPrice(order.totalAmount)}</strong>. Un membre de l&apos;équipe vous appelle au {order.phone} pour confirmer.
          Un récapitulatif vous a été envoyé par e-mail.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/mon-compte?onglet=commandes" className="btn-sombre">Suivre ma commande</Link>
          <Link href="/" className="btn-contour">Retour à l&apos;accueil</Link>
        </div>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <EmptyState title="Votre panier est vide">
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/ogab#carte" className="btn-sombre px-5 py-3">La carte O&apos;GAB</Link>
          <Link href="/boutique" className="btn-contour px-5 py-3">La boutique</Link>
        </div>
      </EmptyState>
    );
  }

  const update = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      const created = await api("/orders", {
        method: "POST",
        body: {
          ...form,
          items: items.map((i) => ({ source: i.source, itemId: i.itemId, quantity: i.quantity })),
        },
      });
      clear();
      setOrder(created);
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors });
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
      <form onSubmit={submit} className="space-y-6 border border-bordure bg-white p-6 md:p-10" noValidate>
        <fieldset>
          <legend className="etiquette">Mode de retrait</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[["RETRAIT", "Retrait sur place", "Au restaurant ou au siège"], ["LIVRAISON", "Livraison", "À Bangui, frais confirmés par téléphone"]].map(([value, label, hint]) => (
              <label key={value} className={`cursor-pointer border p-4 transition-colors ${form.deliveryMode === value ? "border-encre bg-gris-clair" : "border-bordure"}`}>
                <input type="radio" name="deliveryMode" value={value} checked={form.deliveryMode === value} onChange={update("deliveryMode")} className="sr-only" />
                <span className="block font-semibold">{label}</span>
                <span className="mt-1 block text-[0.85rem] text-encre/60">{hint}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {form.deliveryMode === "LIVRAISON" && (
          <Field label="Adresse de livraison" name="deliveryAddress" as="textarea" required value={form.deliveryAddress} onChange={update("deliveryAddress")}
            error={state.errors?.deliveryAddress} placeholder="Quartier, rue, repère..." />
        )}
        <Field label="Téléphone" name="phone" type="tel" required value={form.phone} onChange={update("phone")} error={state.errors?.phone} hint="Nous vous appelons pour confirmer la commande." />
        <Field label="Remarque (facultatif)" name="note" as="textarea" value={form.note} onChange={update("note")} placeholder="Heure souhaitée, allergies, taille..." />
        {state.status === "error" && <Notice type="erreur">{state.message}</Notice>}
        <button type="submit" className="btn-accent w-full" disabled={state.status === "loading"}>
          {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          Valider la commande
        </button>
      </form>

      <aside className="h-fit border border-bordure bg-white p-6">
        <p className="t-label text-encre/60">Récapitulatif</p>
        <ul className="mt-4 divide-y divide-bordure">
          {items.map((item) => (
            <li key={`${item.source}-${item.itemId}`} className="flex justify-between gap-4 py-3 text-[0.95rem]">
              <span>{item.name} <span className="text-encre/50">× {item.quantity}</span></span>
              <span className="shrink-0 font-mono font-bold">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-encre pt-4">
          <span className="t-label">Total</span>
          <span className="font-mono text-xl font-bold">{formatPrice(total)}</span>
        </div>
        <p className="mt-3 text-[0.8rem] text-encre/55">Paiement à la livraison ou au retrait. Les prix sont confirmés à la validation.</p>
      </aside>
    </div>
  );
}
