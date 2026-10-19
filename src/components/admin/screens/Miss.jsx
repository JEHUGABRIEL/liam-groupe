"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/admin/AdminShell";
import CrudPage from "@/components/admin/CrudPage";
import { AdminPage, Badge, DataTable, Detail, FilterTabs, Pagination, useUrlFilter, ViewSwitch } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import Modal from "@/components/ui/Modal";
import SafeImg from "@/components/ui/SafeImg";
import { api } from "@/lib/client";
import { APPLICATION_STATUS, formatDate } from "@/lib/format";

const TONES = { SOUMISE: "attente", PRESELECTIONNEE: "info", RETENUE: "ok", REFUSEE: "neutre", RETIREE: "fin" };
const FILTERS = [{ value: "", label: "Toutes" }, ...Object.entries(APPLICATION_STATUS).map(([value, label]) => ({ value, label }))];
const DECISIONS = ["SOUMISE", "PRESELECTIONNEE", "RETENUE", "REFUSEE"];

const age = (birthDate) => {
  const b = new Date(birthDate);
  const now = new Date();
  return now.getFullYear() - b.getFullYear() - (now < new Date(now.getFullYear(), b.getMonth(), b.getDate()) ? 1 : 0);
};

const EDITIONS = {
  title: "Éditions",
  intro: "Chaque édition fixe ses dates de candidature et la tranche d'âge admise.",
  newLabel: "Nouvelle édition",
  created: "Édition créée",
  list: { path: "/admin/miss-centrafrique/editions" },
  itemTitle: (e) => e.title,
  columns: [
    { key: "year", label: "Année", render: (e) => <span className="font-mono font-bold">{e.year}</span> },
    { key: "title", label: "Titre" },
    { key: "dates", label: "Candidatures", render: (e) => `${formatDate(e.registrationOpensOn, { day: "numeric", month: "short" })} → ${formatDate(e.registrationClosesOn)}` },
    { key: "open", label: "État", render: (e) => (e.registrationOpen ? <Badge tone="ok">Ouvertes</Badge> : <Badge>Fermées</Badge>) },
  ],
  fields: [
    { name: "year", label: "Année", type: "number", required: true },
    { name: "title", label: "Titre", required: true },
    { name: "registrationOpensOn", label: "Ouverture des candidatures", type: "date", required: true },
    { name: "registrationClosesOn", label: "Clôture des candidatures", type: "date", required: true },
    { name: "minAge", label: "Âge minimum", type: "number" },
    { name: "maxAge", label: "Âge maximum", type: "number" },
    { name: "description", label: "Description", type: "textarea", rows: 4 },
  ],
  create: (body) => api("/admin/miss-centrafrique/editions", { method: "POST", body }),
  update: (edition, body) => api(`/admin/miss-centrafrique/editions/${edition.id}`, { method: "PUT", body }),
  remove: (edition) => api(`/admin/miss-centrafrique/editions/${edition.id}`, { method: "DELETE" }),
  deleteConfirm: "Supprimer l'édition et ses candidatures ?",
};

function ApplicationDetail({ application: a, onChanged }) {
  const toast = useToast();
  const [decision, setDecision] = useState({ status: a.status, adminNote: a.adminNote || "" });
  const [saving, setSaving] = useState(false);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      onChanged(await api(`/admin/miss-centrafrique/applications/${a.id}`, { method: "PATCH", body: { status: decision.status, adminNote: decision.adminNote.trim() || null } }));
      toast(decision.status !== a.status ? "Décision enregistrée, la candidate est prévenue" : "Note enregistrée");
    } catch (error) {
      toast(error.message, "erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={TONES[a.status]}>{APPLICATION_STATUS[a.status]}</Badge>
        {!a.complete && <Badge tone="brouillon">Photos manquantes</Badge>}
        <span className="text-[0.85rem] text-encre/60">{a.editionTitle}</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {[["Portrait", a.portraitPhoto], ["Silhouette", a.silhouettePhoto]].map(([label, src]) => (
          <figure key={label}>
            <div className="aspect-[3/4] overflow-hidden border border-bordure bg-gris-clair">
              {src ? (
                <a href={src} target="_blank" rel="noreferrer"><SafeImg src={src} alt={`${label} de ${a.firstName}`} className="h-full w-full object-cover" /></a>
              ) : <span className="flex h-full items-center justify-center text-[0.85rem] text-encre/45">Non envoyée</span>}
            </div>
            <figcaption className="t-label-sm mt-2 text-[11px] text-encre/50">{label}</figcaption>
          </figure>
        ))}
      </div>

      <dl className="mt-6">
        <Detail label="Âge">{a.birthDate && `${age(a.birthDate)} ans (née le ${formatDate(a.birthDate)}${a.birthPlace ? ` à ${a.birthPlace}` : ""})`}</Detail>
        <Detail label="Ville">{a.city}</Detail>
        <Detail label="Taille">{a.heightCm && `${a.heightCm} cm`}</Detail>
        <Detail label="Téléphone"><a href={`tel:${a.phone}`} className="souligne-lien">{a.phone}</a></Detail>
        <Detail label="E-mail"><a href={`mailto:${a.candidateEmail}`} className="souligne-lien">{a.candidateEmail}</a></Detail>
        <Detail label="Études">{a.educationLevel}</Detail>
        <Detail label="Activité">{a.occupation}</Detail>
        <Detail label="Motivation"><span className="whitespace-pre-line">{a.motivation}</span></Detail>
        <Detail label="Envoyée le">{formatDate(a.createdAt)}</Detail>
      </dl>

      {a.status !== "RETIREE" ? (
        <form onSubmit={save} className="mt-8 border border-bordure bg-creme/40 p-5">
          <p className="font-medium">Décision du jury</p>
          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Décision">
            {DECISIONS.map((status) => (
              <button key={status} type="button" role="radio" aria-checked={decision.status === status} onClick={() => setDecision({ ...decision, status })} className={decision.status === status ? "btn-sombre px-4 py-2.5" : "btn-contour px-4 py-2.5"}>
                {APPLICATION_STATUS[status]}
              </button>
            ))}
          </div>
          <label htmlFor="note-jury" className="etiquette mt-5">Note interne</label>
          <textarea id="note-jury" className="champ min-h-[90px]" value={decision.adminNote} onChange={(e) => setDecision({ ...decision, adminNote: e.target.value })} placeholder="Visible uniquement par l'équipe" />
          <button type="submit" className="btn-sombre mt-4" disabled={saving}>
            {saving && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}Enregistrer
          </button>
        </form>
      ) : <p className="mt-8 text-encre/60">La candidate a retiré sa candidature.</p>}
    </div>
  );
}

function Applications() {
  const [status, setStatus] = useUrlFilter();
  const [edition, setEdition] = useUrlFilter("edition");
  const editions = useResource("/admin/miss-centrafrique/editions");
  const query = new URLSearchParams({ ...(status && { status }), ...(edition && { editionId: edition }) });
  const list = useResource(`/admin/miss-centrafrique/applications${query.size ? `?${query}` : ""}`, { paged: true });
  const [selected, setSelected] = useState(null);

  const columns = [
    {
      key: "name", label: "Candidate", render: (a) => (
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 shrink-0 overflow-hidden bg-gris-clair">{a.portraitPhoto && <SafeImg src={a.portraitPhoto} alt="" className="h-full w-full object-cover" />}</span>
          <span><span className="font-medium">{a.firstName} {a.lastName}</span><span className="block text-[0.8rem] text-encre/50">{a.city}</span></span>
        </div>
      ),
    },
    { key: "age", label: "Âge", render: (a) => (a.birthDate ? `${age(a.birthDate)} ans` : "") },
    { key: "edition", label: "Édition", render: (a) => a.editionTitle },
    { key: "date", label: "Envoyée le", className: "whitespace-nowrap", render: (a) => formatDate(a.createdAt, { day: "numeric", month: "short" }) },
    { key: "status", label: "Statut", render: (a) => <Badge tone={TONES[a.status]}>{APPLICATION_STATUS[a.status]}</Badge> },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1"><FilterTabs options={FILTERS} value={status} onChange={setStatus} /></div>
        {editions.items.length > 1 && (
          <select aria-label="Édition" className="champ w-auto py-2.5" value={edition} onChange={(e) => setEdition(e.target.value)}>
            <option value="">Toutes les éditions</option>
            {editions.items.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        )}
      </div>
      <div className="mt-6">
        <DataTable columns={columns} resource={list} onOpen={setSelected} empty="Aucune candidature dans cette catégorie." />
        <Pagination page={list.page} totalPages={list.totalPages} totalElements={list.totalElements} onChange={list.setPage} />
      </div>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} panneau width="max-w-[640px]" label="Candidature" title={selected && `${selected.firstName} ${selected.lastName}`}>
        {selected && <ApplicationDetail key={selected.id} application={selected} onChanged={(updated) => { setSelected(updated); list.reload(); }} />}
      </Modal>
    </>
  );
}

export default function Miss() {
  const [view, setView] = useUrlFilter("vue", "candidatures");
  return (
    <AdminPage label="Activité" title="Miss Centrafrique" intro="Étudiez les candidatures et gérez les éditions du concours. Chaque décision est envoyée à la candidate par e-mail.">
      <ViewSwitch options={[["candidatures", "Candidatures"], ["editions", "Éditions"]]} value={view} onChange={setView} />
      {view === "editions" ? <CrudPage config={EDITIONS} embedded /> : <Applications />}
    </AdminPage>
  );
}
