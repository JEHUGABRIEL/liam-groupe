"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import EmptyState from "@/components/ui/EmptyState";
import Notice from "@/components/ui/Notice";
import { ListSkeleton } from "@/components/ui/PageLoader";
import { api } from "@/lib/client";
import {
  APPLICATION_STATUS, ORDER_STATUS, REGISTRATION_STATUS, SUBSCRIPTION_STATUS, formatDate, formatPeriod, formatPrice,
} from "@/lib/format";

/** Charge une liste de l'API et gère chargement, erreur et liste vide. */
function useList(path, select = (data) => data) {
  const [state, setState] = useState({ status: "loading", items: [] });
  const load = useCallback(async () => {
    try {
      setState({ status: "ready", items: select(await api(path)) });
    } catch (error) {
      setState({ status: "error", items: [], message: error.message });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
}

function ListState({ state, empty, children }) {
  if (state.status === "loading") return <ListSkeleton />;
  if (state.status === "error") return <Notice type="erreur">{state.message}</Notice>;
  if (state.items.length === 0) return <EmptyState title={empty.title}>{empty.action}</EmptyState>;
  return children;
}

function Status({ children, tone = "neutre" }) {
  const styles = { neutre: "bg-gris-clair text-encre", ok: "bg-emerald-50 text-emerald-800", attente: "bg-accent-pale text-accent-sombre", fin: "bg-noir-doux text-white" };
  return <span className={`badge ${styles[tone]}`}>{children}</span>;
}

/** Bouton d'action d'une ligne : appelle l'API puis recharge la liste. */
function RowAction({ label, confirm, action, onDone }) {
  const [state, setState] = useState({ status: "idle" });
  async function run() {
    if (confirm && !window.confirm(confirm)) return;
    setState({ status: "loading" });
    try {
      await action();
      onDone();
    } catch (error) {
      setState({ status: "error", message: error.message });
    }
  }
  return (
    <div>
      <button type="button" onClick={run} disabled={state.status === "loading"} className="t-label-sm souligne-lien text-accent disabled:opacity-50">{label}</button>
      {state.status === "error" && <p className="mt-1 text-[0.82rem] text-accent">{state.message}</p>}
    </div>
  );
}

export function OrdersTab() {
  const state = useList("/orders?size=50", (page) => page.content);
  const tone = { EN_ATTENTE: "attente", CONFIRMEE: "ok", PRETE: "ok", LIVREE: "neutre", ANNULEE: "fin" };
  return (
    <ListState state={state} empty={{ title: "Aucune commande", action: <Link href="/ogab#carte" className="souligne-lien font-semibold">Découvrir la carte O&apos;GAB</Link> }}>
      <ul className="space-y-4">
        {state.items.map((order) => (
          <li key={order.id} className="border border-bordure p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono font-bold">{order.reference}</p>
                <p className="mt-1 text-[0.85rem] text-encre/55">{formatDate(order.createdAt)} · {order.deliveryMode === "LIVRAISON" ? "Livraison" : "Retrait"}</p>
              </div>
              <Status tone={tone[order.status]}>{ORDER_STATUS[order.status]}</Status>
            </div>
            <ul className="mt-4 space-y-1 text-[0.92rem] text-encre/75">
              {order.items.map((item) => (
                <li key={`${item.source}-${item.itemId}`} className="flex justify-between gap-4">
                  <span>{item.name} × {item.quantity}</span><span className="font-mono">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-bordure pt-4">
              {order.status === "EN_ATTENTE" ? (
                <RowAction label="Annuler la commande" confirm="Annuler cette commande ?" action={() => api(`/orders/${order.id}/cancel`, { method: "POST" })} onDone={state.reload} />
              ) : <span />}
              <span className="font-mono font-bold">{formatPrice(order.totalAmount)}</span>
            </div>
          </li>
        ))}
      </ul>
    </ListState>
  );
}

export function SubscriptionsTab() {
  const state = useList("/subscriptions");
  const tone = { EN_ATTENTE: "attente", ACTIVE: "ok", EXPIREE: "neutre", ANNULEE: "fin" };
  return (
    <ListState state={state} empty={{ title: "Aucun abonnement", action: <Link href="/g-fitness#formules" className="souligne-lien font-semibold">Voir les formules G-Fitness</Link> }}>
      <ul className="space-y-4">
        {state.items.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-4 border border-bordure p-5">
            <div>
              <p className="t-h5">{s.planName}</p>
              <p className="mt-1 text-[0.9rem] text-encre/60">
                {s.startDate ? `Du ${formatDate(s.startDate)} au ${formatDate(s.endDate)}` : `Demandé le ${formatDate(s.createdAt)} · à régler à la salle`}
                {" · "}{formatPrice(s.price)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Status tone={tone[s.status]}>{SUBSCRIPTION_STATUS[s.status]}</Status>
              {s.status === "EN_ATTENTE" && (
                <RowAction label="Retirer la demande" confirm="Retirer cette demande d'abonnement ?" action={() => api(`/subscriptions/${s.id}/cancel`, { method: "POST" })} onDone={state.reload} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </ListState>
  );
}

export function EventsTab() {
  const state = useList("/event-registrations");
  return (
    <ListState state={state} empty={{ title: "Aucune inscription", action: <Link href="/actualites#agenda" className="souligne-lien font-semibold">Voir l&apos;agenda</Link> }}>
      <ul className="space-y-4">
        {state.items.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 border border-bordure p-5">
            <div>
              <Link href={`/evenements/${r.eventSlug}`} className="t-h5 souligne-lien">{r.eventTitle}</Link>
              <p className="mt-1 text-[0.9rem] text-encre/60">{formatPeriod(r.eventStartDate)}{r.eventLocation ? ` · ${r.eventLocation}` : ""}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Status tone={r.status === "CONFIRMEE" ? "ok" : "fin"}>{REGISTRATION_STATUS[r.status]}</Status>
              {r.status === "CONFIRMEE" && (
                <RowAction label="Annuler mon inscription" confirm="Libérer votre place ?" action={() => api(`/event-registrations/${r.id}/cancel`, { method: "POST" })} onDone={state.reload} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </ListState>
  );
}

export function ApplicationsTab() {
  const state = useList("/miss-centrafrique/applications");
  const tone = { SOUMISE: "attente", PRESELECTIONNEE: "ok", RETENUE: "ok", REFUSEE: "neutre", RETIREE: "fin" };
  return (
    <ListState state={state} empty={{ title: "Aucune candidature", action: <Link href="/miss-centrafrique#candidature" className="souligne-lien font-semibold">Candidater à Miss Centrafrique</Link> }}>
      <ul className="space-y-4">
        {state.items.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-4 border border-bordure p-5">
            <div>
              <p className="t-h5">{a.editionTitle}</p>
              <p className="mt-1 text-[0.9rem] text-encre/60">
                Envoyée le {formatDate(a.createdAt)} · {a.complete ? "dossier complet" : "photos manquantes"}
              </p>
              {!a.complete && a.status === "SOUMISE" && (
                <Link href="/miss-centrafrique#candidature" className="t-label-sm souligne-lien mt-2 inline-block text-accent">Ajouter mes photos</Link>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Status tone={tone[a.status]}>{APPLICATION_STATUS[a.status]}</Status>
              {["SOUMISE", "PRESELECTIONNEE", "RETENUE"].includes(a.status) && (
                <RowAction label="Retirer ma candidature" confirm="Retirer votre candidature ? Cette action est définitive."
                  action={() => api(`/miss-centrafrique/applications/${a.id}/withdraw`, { method: "POST" })} onDone={state.reload} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </ListState>
  );
}
