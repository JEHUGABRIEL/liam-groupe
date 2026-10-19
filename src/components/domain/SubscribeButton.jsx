"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useModals } from "@/components/providers/ModalProvider";
import Notice from "@/components/ui/Notice";
import { api } from "@/lib/client";

/** Demande d'abonnement à une formule : compte requis, activation par l'équipe au paiement. */
export default function SubscribeButton({ plan, featured }) {
  const { user, loading } = useAuth();
  const { openAuth } = useModals();
  const [state, setState] = useState({ status: "idle" });
  const style = featured ? "btn-accent w-full" : "btn-sombre w-full";

  if (!loading && !user) {
    return (
      <button type="button" onClick={() => openAuth("connexion")} className={style}>
        Se connecter pour s&apos;abonner <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    );
  }
  if (state.status === "done") {
    return (
      <Notice type="succes">
        Demande envoyée ! Réglez votre abonnement à l&apos;accueil de la salle : il sera activé aussitôt.
        <Link href="/mon-compte?onglet=abonnements" className="souligne-lien ml-1 font-semibold">Suivre ma demande</Link>
      </Notice>
    );
  }

  async function subscribe() {
    setState({ status: "loading" });
    try {
      await api("/subscriptions", { method: "POST", body: { planId: plan.id } });
      setState({ status: "done" });
    } catch (error) {
      setState({ status: "error", message: error.message });
    }
  }

  return (
    <div className="space-y-3">
      <button type="button" onClick={subscribe} disabled={loading || state.status === "loading"} className={style}>
        {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        Choisir cette formule
      </button>
      {state.status === "error" && <Notice type="erreur">{state.message}</Notice>}
    </div>
  );
}
