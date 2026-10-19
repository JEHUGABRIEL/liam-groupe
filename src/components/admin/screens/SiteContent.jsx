"use client";

import { useToast } from "@/components/admin/toast";
import CrudPage, { ResourceForm } from "@/components/admin/CrudPage";
import { AdminPage, TitleCell, useUrlFilter, VIEW_RESETS, ViewSwitch } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import Notice from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/PageLoader";
import { api } from "@/lib/client";

const order = { name: "orderIndex", label: "Ordre d'affichage", type: "number" };

const TEAM = {
  newLabel: "Nouveau membre",
  created: "Membre ajouté",
  intro: "Équipe présentée sur la page À propos.",
  list: { path: "/site/team" },
  searchKeys: ["name", "role"],
  itemTitle: (m) => m.name,
  columns: [
    { key: "name", label: "Membre", render: (m) => <TitleCell image={m.image} title={m.name} subtitle={m.role} /> },
    { key: "orderIndex", label: "Ordre", className: "text-right" },
  ],
  fields: [
    { name: "name", label: "Nom", required: true },
    { name: "role", label: "Fonction" },
    { name: "description", label: "Présentation", type: "textarea", rows: 4 },
    { name: "image", label: "Photo", type: "image", folder: "EQUIPE" },
    { name: "social", label: "Réseaux sociaux", type: "social" },
    order,
  ],
  create: (body) => api("/admin/site/team", { method: "POST", body }),
  update: (m, body) => api(`/admin/site/team/${m.id}`, { method: "PUT", body }),
  remove: (m) => api(`/admin/site/team/${m.id}`, { method: "DELETE" }),
  deleteConfirm: "Le membre n'apparaît plus sur la page À propos.",
};

const PARTNERS = {
  newLabel: "Nouveau partenaire",
  created: "Partenaire ajouté",
  intro: "Partenaires du carrousel « Ils avancent avec nous » (accueil et À propos).",
  list: { path: "/site/partners" },
  searchKeys: ["name", "category", "subtitle"],
  itemTitle: (p) => p.name,
  columns: [
    { key: "name", label: "Partenaire", render: (p) => <TitleCell image={p.logo} title={p.name} subtitle={p.subtitle} /> },
    { key: "category", label: "Catégorie" },
    { key: "orderIndex", label: "Ordre", className: "text-right" },
  ],
  fields: [
    { name: "name", label: "Nom", required: true },
    { name: "category", label: "Catégorie", placeholder: "Partenaire institutionnel" },
    { name: "subtitle", label: "Sous-titre", span: "full" },
    { name: "collaboration", label: "Nature de la collaboration", type: "textarea", rows: 3 },
    { name: "description", label: "Description", type: "textarea", rows: 3 },
    { name: "logo", label: "Logo", type: "image", folder: "PARTENAIRES", hint: "Sans logo, le nom s'affiche en toutes lettres." },
    { name: "website", label: "Site web", placeholder: "https://" },
    order,
  ],
  create: (body) => api("/admin/site/partners", { method: "POST", body }),
  update: (p, body) => api(`/admin/site/partners/${p.id}`, { method: "PUT", body }),
  remove: (p) => api(`/admin/site/partners/${p.id}`, { method: "DELETE" }),
  deleteConfirm: "Le partenaire n'apparaît plus dans le carrousel.",
};

const TESTIMONIALS = {
  newLabel: "Nouveau témoignage",
  created: "Témoignage ajouté",
  intro: "Témoignages affichés sur l'accueil.",
  list: { path: "/site/testimonials" },
  searchKeys: ["name", "role", "quote"],
  itemTitle: (t) => t.name,
  columns: [
    { key: "name", label: "Auteur", render: (t) => <TitleCell image={t.image} title={t.name} subtitle={t.role} /> },
    { key: "quote", label: "Témoignage", render: (t) => <span className="line-clamp-2 text-[0.88rem] text-encre/70">« {t.quote} »</span> },
  ],
  fields: [
    { name: "name", label: "Nom", required: true },
    { name: "role", label: "Fonction / ville" },
    { name: "quote", label: "Témoignage", type: "textarea", rows: 5, required: true },
    { name: "image", label: "Photo", type: "image", folder: "TEMOIGNAGES" },
    order,
  ],
  create: (body) => api("/admin/site/testimonials", { method: "POST", body }),
  update: (t, body) => api(`/admin/site/testimonials/${t.id}`, { method: "PUT", body }),
  remove: (t) => api(`/admin/site/testimonials/${t.id}`, { method: "DELETE" }),
  deleteConfirm: "Le témoignage n'apparaît plus sur l'accueil.",
};

const SITE_INFO_FIELDS = [
  { name: "fullName", label: "Nom complet", required: true },
  { name: "foundingYear", label: "Année de création", type: "number" },
  { name: "tagline", label: "Signature", span: "full" },
  { name: "description", label: "Présentation", type: "textarea", rows: 3, hint: "Reprise dans le pied de page et les moteurs de recherche." },
  { name: "address", label: "Adresse", type: "list", rows: 2, hint: "Une ligne par ligne d'adresse." },
  { name: "phones", label: "Téléphones", type: "list", rows: 2, hint: "Un numéro par ligne." },
  { name: "emails", label: "E-mails", type: "list", rows: 2 },
  { name: "hours", label: "Horaires d'ouverture", type: "list", rows: 3, hint: "Une plage par ligne, ex. « Lundi — Vendredi : 8h00 — 17h00 »." },
  {
    name: "social", label: "Réseaux sociaux", type: "social",
    keys: [["whatsapp", "WhatsApp (numéro, ex. 23676000000)"], ["facebook", "Facebook"], ["instagram", "Instagram"], ["x", "X (Twitter)"], ["youtube", "YouTube"], ["linkedin", "LinkedIn"]],
  },
  { name: "_heroImages", label: "Images d'en-tête", type: "gallery", folder: "DOMAINES", hint: "1re : accueil, 2e : À propos." },
];

function SiteInfo() {
  const toast = useToast();
  const settings = useResource("/site/settings");

  if (settings.status === "loading") return <div className="space-y-4 border border-bordure bg-white p-8"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></div>;
  if (settings.status === "error") return <Notice type="erreur">{settings.message}</Notice>;

  const info = settings.data.siteInfo || {};

  async function save({ _heroImages, ...fields }) {
    // Les clés non éditées ici (contactPage, name…) sont conservées.
    await api("/admin/site/settings/siteInfo", { method: "PUT", body: { ...info, ...fields } });
    await api("/admin/site/settings/homeHeroImages", { method: "PUT", body: _heroImages });
    toast("Coordonnées enregistrées");
    settings.reload();
  }

  return (
    <div className="border border-bordure bg-white p-6 sm:p-8">
      <p className="texte mb-8 max-w-2xl">Coordonnées affichées dans l&apos;en-tête, le pied de page et la fenêtre « Nous contacter ». Les pages publiques se mettent à jour en quelques minutes.</p>
      <ResourceForm key={settings.data.siteInfo ? "pret" : "vide"} fields={SITE_INFO_FIELDS} item={{ ...info, _heroImages: settings.data.homeHeroImages || [] }} onSubmit={save} />
    </div>
  );
}

const VIEWS = { equipe: TEAM, partenaires: PARTNERS, temoignages: TESTIMONIALS };

export default function SiteContent() {
  const [view, setView] = useUrlFilter("vue", "coordonnees", VIEW_RESETS);
  return (
    <AdminPage label="Contenu" title="Contenu du site" intro="Coordonnées, équipe, partenaires et témoignages.">
      <ViewSwitch options={[["coordonnees", "Coordonnées"], ["equipe", "Équipe"], ["partenaires", "Partenaires"], ["temoignages", "Témoignages"]]} value={view} onChange={setView} />
      {VIEWS[view] ? <CrudPage key={view} config={VIEWS[view]} embedded /> : <SiteInfo />}
    </AdminPage>
  );
}
