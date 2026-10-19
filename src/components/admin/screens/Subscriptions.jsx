"use client";

import { useState } from "react";
import CrudPage from "@/components/admin/CrudPage";
import { ActionButton, AdminPage, Badge, DataTable, Detail, FilterTabs, Pagination, useUrlFilter, ViewSwitch } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/client";
import { SUBSCRIPTION_STATUS, formatDate, formatPrice } from "@/lib/format";

const TONES = { EN_ATTENTE: "attente", ACTIVE: "ok", EXPIREE: "neutre", ANNULEE: "fin" };
const FILTERS = [{ value: "", label: "Tous" }, ...Object.entries(SUBSCRIPTION_STATUS).map(([value, label]) => ({ value, label }))];
const days = (n) => `${n} jour${n > 1 ? "s" : ""}`;
const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Bangui" });

const PLANS = {
  label: "G-Fitness",
  title: "Formules",
  intro: "Formules proposées sur la page G-Fitness. Une formule désactivée n'est plus proposée mais reste attachée aux abonnements existants.",
  newLabel: "Nouvelle formule",
  created: "Formule créée",
  list: { path: "/admin/subscription-plans" },
  itemTitle: (p) => p.name,
  columns: [
    { key: "name", label: "Formule", render: (p) => <span className="font-medium">{p.name}{p.featured && <span className="ml-2 align-middle"><Badge tone="attente">Mise en avant</Badge></span>}</span> },
    { key: "price", label: "Prix", render: (p) => <span className="font-mono">{formatPrice(p.price)}</span> },
    { key: "duration", label: "Durée", render: (p) => days(p.durationDays) },
    { key: "active", label: "État", render: (p) => (p.active ? <Badge tone="ok">Proposée</Badge> : <Badge tone="brouillon">Désactivée</Badge>) },
  ],
  fields: [
    { name: "name", label: "Nom", required: true },
    { name: "price", label: "Prix", type: "price", required: true },
    { name: "durationDays", label: "Durée (jours)", type: "number", required: true, hint: "30 pour un mois, 365 pour un an." },
    { name: "orderIndex", label: "Ordre d'affichage", type: "number" },
    { name: "description", label: "Description", type: "textarea", rows: 3 },
    { name: "features", label: "Avantages", type: "list", hint: "Un avantage par ligne." },
    { name: "featured", label: "Mettre en avant", type: "checkbox", hint: "Formule recommandée sur la page G-Fitness." },
    { name: "active", label: "Proposée aux clients", type: "checkbox", default: true },
  ],
  create: (body) => api("/admin/subscription-plans", { method: "POST", body }),
  update: (plan, body) => api(`/admin/subscription-plans/${plan.id}`, { method: "PUT", body }),
  remove: (plan) => api(`/admin/subscription-plans/${plan.id}`, { method: "DELETE" }),
  deleteConfirm: "Supprimer la formule ? Préférez la désactiver si des clients y sont abonnés.",
};

function SubscriptionDetail({ subscription: s, onChanged }) {
  const [startDate, setStartDate] = useState(today());
  return (
    <div>
      <Badge tone={TONES[s.status]}>{SUBSCRIPTION_STATUS[s.status]}</Badge>
      <dl className="mt-6">
        <Detail label="Abonné">{s.subscriber?.fullName}</Detail>
        <Detail label="E-mail"><a href={`mailto:${s.subscriber?.email}`} className="souligne-lien">{s.subscriber?.email}</a></Detail>
        <Detail label="Téléphone">{s.subscriber?.phone && <a href={`tel:${s.subscriber.phone}`} className="souligne-lien">{s.subscriber.phone}</a>}</Detail>
        <Detail label="Formule">{s.planName} · {formatPrice(s.price)} · {days(s.durationDays)}</Detail>
        <Detail label="Période">{s.startDate && `du ${formatDate(s.startDate)} au ${formatDate(s.endDate)}`}</Detail>
        <Detail label="Demandé le">{formatDate(s.createdAt)}</Detail>
        <Detail label="Activé le">{s.activatedAt && formatDate(s.activatedAt)}</Detail>
        <Detail label="Note du client">{s.note}</Detail>
      </dl>

      {s.status === "EN_ATTENTE" && (
        <div className="mt-8 border border-bordure bg-creme/40 p-5">
          <p className="font-medium">Paiement reçu ?</p>
          <p className="mt-1 text-[0.88rem] text-encre/65">L&apos;abonnement démarre à la date choisie ; s&apos;il suit un abonnement en cours, il démarre à sa fin.</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="debut-abonnement" className="etiquette">Début</label>
              <input id="debut-abonnement" type="date" className="champ py-2.5" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <ActionButton className="btn-sombre" action={() => api(`/admin/subscriptions/${s.id}/activate`, { method: "POST", body: { startDate: startDate || null } })} success="Abonnement activé" onDone={onChanged}>
              Activer l&apos;abonnement
            </ActionButton>
          </div>
        </div>
      )}
      {(s.status === "EN_ATTENTE" || s.status === "ACTIVE") && (
        <div className="mt-6">
          <ActionButton action={() => api(`/admin/subscriptions/${s.id}/cancel`, { method: "POST" })} success="Abonnement annulé" onDone={onChanged} confirm="Annuler cet abonnement ?">
            Annuler l&apos;abonnement
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function SubscriptionList() {
  const [status, setStatus] = useUrlFilter();
  const list = useResource(`/admin/subscriptions${status ? `?status=${status}` : ""}`, { paged: true });
  const [selected, setSelected] = useState(null);

  const columns = [
    { key: "subscriber", label: "Abonné", render: (s) => <>{s.subscriber?.fullName}<span className="block text-[0.8rem] text-encre/50">{s.subscriber?.phone || s.subscriber?.email}</span></> },
    { key: "plan", label: "Formule", render: (s) => s.planName },
    { key: "price", label: "Montant", render: (s) => <span className="font-mono">{formatPrice(s.price)}</span> },
    { key: "period", label: "Période", className: "whitespace-nowrap", render: (s) => (s.startDate ? `${formatDate(s.startDate, { day: "numeric", month: "short" })} → ${formatDate(s.endDate, { day: "numeric", month: "short", year: "numeric" })}` : <span className="text-encre/45">Demandé le {formatDate(s.createdAt, { day: "numeric", month: "short" })}</span>) },
    { key: "status", label: "Statut", render: (s) => <Badge tone={TONES[s.status]}>{SUBSCRIPTION_STATUS[s.status]}</Badge> },
  ];

  return (
    <>
      <FilterTabs options={FILTERS} value={status} onChange={setStatus} />
      <div className="mt-6">
        <DataTable columns={columns} resource={list} onOpen={setSelected} empty="Aucun abonnement dans cette catégorie." />
        <Pagination page={list.page} totalPages={list.totalPages} totalElements={list.totalElements} onChange={list.setPage} />
      </div>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} panneau width="max-w-[600px]" label="Abonnement" title={selected?.subscriber?.fullName}>
        {selected && <SubscriptionDetail subscription={selected} onChanged={(updated) => { setSelected(updated); list.reload(); }} />}
      </Modal>
    </>
  );
}

export default function Subscriptions() {
  const [view, setView] = useUrlFilter("vue", "abonnements");
  return (
    <AdminPage label="G-Fitness" title="Abonnements" intro="Les clients demandent un abonnement en ligne puis paient à la salle : activez-le à réception du paiement.">
      <ViewSwitch options={[["abonnements", "Abonnements"], ["formules", "Formules"]]} value={view} onChange={setView} />
      {view === "formules" ? <CrudPage config={PLANS} embedded /> : <SubscriptionList />}
    </AdminPage>
  );
}
