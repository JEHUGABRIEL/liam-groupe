"use client";

import { Download } from "lucide-react";
import CrudPage from "@/components/admin/CrudPage";
import { ActionButton, Badge } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import { api } from "@/lib/client";
import { EVENT_STATUS, formatDate, formatPeriod } from "@/lib/format";

const TONES = { A_VENIR: "info", EN_COURS: "ok", TERMINE: "neutre", ANNULE: "fin" };

function EventBadge({ event }) {
  if (event.status === "ANNULE") return <Badge tone="fin">Annulé</Badge>;
  if (!event.published) return <Badge tone="brouillon">Brouillon</Badge>;
  return <Badge tone={TONES[event.status]}>{EVENT_STATUS[event.status]}</Badge>;
}

/** Liste des inscrits en CSV (ouvert dans un tableur). */
function exportCsv(event, registrations) {
  const rows = [["Nom", "E-mail", "Téléphone", "Statut", "Inscrit le", "Message"],
    ...registrations.map((r) => [r.participant?.fullName, r.participant?.email, r.participant?.phone, r.status, formatDate(r.createdAt), r.message])];
  const csv = rows.map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
  link.download = `inscrits-${event.slug}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function Registrations({ event, onChanged }) {
  const list = useResource(`/admin/events/${event.id}/registrations?size=200`);
  const items = list.data?.content || [];
  const confirmed = items.filter((r) => r.status === "CONFIRMEE");

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="t-label-sm">
          Inscrits · {confirmed.length}{event.capacity ? ` / ${event.capacity} places` : ""}
        </h3>
        {items.length > 0 && (
          <button type="button" onClick={() => exportCsv(event, items)} className="lien-action">
            <Download aria-hidden="true" className="h-4 w-4" /> Exporter (CSV)
          </button>
        )}
      </div>
      {list.status === "loading" ? <p className="mt-3 text-encre/50">Chargement…</p> : items.length === 0 ? (
        <p className="mt-3 border border-dashed border-bordure px-4 py-6 text-center text-[0.9rem] text-encre/55">Aucune inscription pour le moment.</p>
      ) : (
        <ul className="mt-3 max-h-[320px] overflow-y-auto border border-bordure">
          {items.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-bordure px-4 py-3 last:border-b-0">
              <div className="min-w-0">
                <p className={`font-medium ${r.status === "ANNULEE" ? "text-encre/45 line-through" : ""}`}>{r.participant?.fullName}</p>
                <p className="truncate text-[0.8rem] text-encre/55">{r.participant?.email}{r.participant?.phone ? ` · ${r.participant.phone}` : ""}</p>
                {r.message && <p className="mt-1 text-[0.82rem] italic text-encre/65">« {r.message} »</p>}
              </div>
              {r.status === "CONFIRMEE" && (
                <ActionButton action={() => api(`/admin/event-registrations/${r.id}/cancel`, { method: "POST" })} success="Inscription annulée" onDone={() => { list.reload(); onChanged(); }} confirm={{ title: `Annuler l'inscription de ${r.participant?.fullName} ?`, message: "La place est libérée pour un autre participant.", label: "Annuler l'inscription" }}>
                  Annuler
                </ActionButton>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EventActions({ event, setItem, reload }) {
  const act = (action) => () => api(`/admin/events/${event.id}/${action}`, { method: "POST" });
  const done = (updated) => { setItem(updated); reload(); };
  return (
    <div className="border border-bordure bg-creme/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <EventBadge event={event} />
          <span className="text-[0.88rem] text-encre/65">{formatPeriod(event.startDate, event.endDate)}</span>
        </div>
        {event.published && event.status !== "ANNULE" && <a href={`/evenements/${event.slug}`} target="_blank" rel="noreferrer" className="lien-action">Voir sur le site</a>}
      </div>
      {event.status !== "ANNULE" && (
        <div className="mt-4 flex flex-wrap gap-3">
          {event.published ? (
            <ActionButton action={act("unpublish")} success="Événement retiré du site" onDone={done} confirm={{ title: "Retirer l'événement du site ?", message: "Il redevient un brouillon : il n'apparaît plus dans l'agenda et les inscriptions sont suspendues.", label: "Retirer du site", danger: false }}>Retirer du site</ActionButton>
          ) : (
            <ActionButton className="btn-sombre" action={act("publish")} success="Événement publié" onDone={done}>Publier</ActionButton>
          )}
          <ActionButton action={act("cancel")} success="Événement annulé, inscrits prévenus" onDone={done} confirm={{ title: `Annuler « ${event.title} » ?`, message: "Les inscrits seront prévenus par e-mail et les inscriptions fermées. Cette action est définitive.", label: "Annuler l'événement" }}>
            Annuler l&apos;événement
          </ActionButton>
        </div>
      )}
      <Registrations event={event} onChanged={reload} />
    </div>
  );
}

const CONFIG = {
  label: "Activité",
  title: "Événements",
  intro: "Un événement est créé en brouillon : publiez-le pour l'afficher dans l'agenda et ouvrir les inscriptions.",
  newLabel: "Nouvel événement",
  created: "Événement créé en brouillon",
  list: { path: "/admin/events", paged: true },
  searchPlaceholder: "Titre, lieu, catégorie…",
  itemTitle: (e) => e.title,
  columns: [
    { key: "title", label: "Événement", render: (e) => <><span className="font-medium">{e.title}</span><span className="block text-[0.8rem] text-encre/50">{e.location}</span></> },
    { key: "date", label: "Date", className: "whitespace-nowrap", render: (e) => formatPeriod(e.startDate, e.endDate) },
    { key: "seats", label: "Inscrits", render: (e) => (e.capacity ? `${e.registeredCount} / ${e.capacity}` : e.registeredCount) },
    { key: "status", label: "Statut", render: (e) => <EventBadge event={e} /> },
  ],
  fields: [
    { name: "title", label: "Titre", required: true, span: "full" },
    { name: "slug", label: "Adresse (slug)", type: "slug", from: "title", required: true, hint: "Utilisée dans l'adresse de la page : /evenements/…" },
    { name: "category", label: "Catégorie", placeholder: "Gala, Formation, Concours…" },
    { name: "startDate", label: "Début", type: "date", required: true },
    { name: "endDate", label: "Fin", type: "date", hint: "Laisser vide pour un événement d'un jour." },
    { name: "location", label: "Lieu" },
    { name: "capacity", label: "Places", type: "number", hint: "Vide = sans limite." },
    { name: "description", label: "Description", type: "textarea", rows: 7 },
    { name: "image", label: "Image principale", type: "image", folder: "EVENEMENTS" },
    { name: "gallery", label: "Galerie", type: "gallery", folder: "EVENEMENTS" },
    { name: "orderIndex", label: "Ordre d'affichage", type: "number" },
  ],
  create: (body) => api("/admin/events", { method: "POST", body }),
  update: (event, body) => api(`/admin/events/${event.id}`, { method: "PUT", body }),
  remove: (event) => api(`/admin/events/${event.id}`, { method: "DELETE" }),
  deleteConfirm: "L'événement disparaît du site. S'il est à venir, il est d'abord annulé et ses inscrits prévenus ; l'historique des inscriptions est conservé.",
  extra: (event, { reload, setItem }) => <EventActions event={event} setItem={setItem} reload={reload} />,
};

export default function Events() {
  return <CrudPage config={CONFIG} />;
}
