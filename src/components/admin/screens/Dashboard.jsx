"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ADMIN_NAV } from "@/components/admin/AdminShell";
import { AdminPage, Badge, StatCard } from "@/components/admin/ui";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/client";
import { EVENT_STATUS, ORDER_STATUS, formatDate, formatPeriod, formatPrice } from "@/lib/format";
import { ORDER_TONES } from "./Orders";

/** Nombre d'éléments d'une liste paginée filtrée (null si l'appel échoue). */
const count = (path) => api(`${path}${path.includes("?") ? "&" : "?"}size=1`).then((p) => p.totalElements).catch(() => null);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    Promise.all([
      count("/admin/orders?status=EN_ATTENTE"),
      count("/admin/subscriptions?status=EN_ATTENTE"),
      count("/admin/subscriptions?status=ACTIVE"),
      count("/admin/miss-centrafrique/applications?status=SOUMISE"),
    ]).then(([pendingOrders, pendingSubscriptions, activeSubscriptions, applications]) =>
      setStats({ pendingOrders, pendingSubscriptions, activeSubscriptions, applications }));
    api("/admin/orders?size=6").then((p) => setOrders(p.content)).catch(() => setOrders([]));
    api("/admin/events?size=50").then((p) => setEvents(p.content)).catch(() => setEvents([]));
  }, []);

  const upcoming = (events || []).filter((e) => e.status === "A_VENIR" || e.status === "EN_COURS")
    .sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, 5);
  const drafts = (events || []).filter((e) => !e.published).length;

  return (
    <AdminPage
      label={formatDate(new Date().toISOString(), { weekday: "long", day: "numeric", month: "long" })}
      title={`Bonjour ${user.firstName}`}
      intro="Ce qui attend l'équipe aujourd'hui : commandes à confirmer, abonnements à encaisser, candidatures à étudier."
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Commandes à confirmer" value={stats.pendingOrders} tone="alerte" href="/admin/commandes?statut=EN_ATTENTE" hint="O'GAB et boutique" />
        <StatCard label="Abonnements à encaisser" value={stats.pendingSubscriptions} tone="alerte" href="/admin/abonnements?statut=EN_ATTENTE" hint="Demandes en attente de paiement" />
        <StatCard label="Abonnés G-Fitness" value={stats.activeSubscriptions} href="/admin/abonnements?statut=ACTIVE" hint="Abonnements en cours" />
        <StatCard label="Candidatures à étudier" value={stats.applications} tone="alerte" href="/admin/miss-centrafrique" hint="Miss Centrafrique" />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section className="border border-bordure bg-white">
          <div className="flex items-center justify-between border-b border-bordure px-6 py-5">
            <h2 className="t-h5">Dernières commandes</h2>
            <Link href="/admin/commandes" className="lien-action">Toutes <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
          {orders === null ? <p className="px-6 py-8 text-encre/50">Chargement…</p> : orders.length === 0 ? (
            <p className="px-6 py-8 text-encre/60">Aucune commande pour le moment.</p>
          ) : (
            <ul>
              {orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-bordure px-6 py-4 last:border-b-0">
                  <div>
                    <p className="font-mono text-[0.9rem] font-bold">{o.reference}</p>
                    <p className="text-[0.85rem] text-encre/60">{o.customer?.fullName} · {formatDate(o.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[0.9rem]">{formatPrice(o.totalAmount)}</span>
                    <Badge tone={ORDER_TONES[o.status]}>{ORDER_STATUS[o.status]}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-bordure bg-white">
          <div className="flex items-center justify-between border-b border-bordure px-6 py-5">
            <h2 className="t-h5">Agenda</h2>
            <Link href="/admin/evenements" className="lien-action">Événements <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
          {events === null ? <p className="px-6 py-8 text-encre/50">Chargement…</p> : upcoming.length === 0 ? (
            <p className="px-6 py-8 text-encre/60">Aucun événement à venir.</p>
          ) : (
            <ul>
              {upcoming.map((e) => (
                <li key={e.id} className="border-b border-bordure px-6 py-4 last:border-b-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{e.title}</p>
                    {e.published ? <Badge tone="info">{EVENT_STATUS[e.status]}</Badge> : <Badge tone="brouillon">Brouillon</Badge>}
                  </div>
                  <p className="mt-1 text-[0.85rem] text-encre/60">
                    {formatPeriod(e.startDate, e.endDate)}
                    {e.capacity ? ` · ${e.registeredCount}/${e.capacity} inscrits` : ` · ${e.registeredCount} inscrit${e.registeredCount > 1 ? "s" : ""}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {drafts > 0 && <p className="border-t border-bordure px-6 py-4 text-[0.85rem] text-encre/60">{drafts} événement{drafts > 1 ? "s" : ""} en brouillon, non visible{drafts > 1 ? "s" : ""} sur le site.</p>}
        </section>
      </div>

      <section className="mt-10">
        <h2 className="t-label-sm text-encre/50">Accès rapide</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ADMIN_NAV.filter((i) => i.href && i.href !== "/admin").map((item) => (
            <Link key={item.href} href={item.href} className="carte flex items-center gap-3 px-5 py-4">
              <item.icon aria-hidden="true" className="h-4 w-4 text-accent" />
              <span className="t-label-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </AdminPage>
  );
}
