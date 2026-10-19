"use client";

import { useMemo } from "react";
import CrudPage from "@/components/admin/CrudPage";
import { AdminPage, FilterTabs, TitleCell, useUrlFilter, ViewSwitch } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import { api } from "@/lib/client";
import { formatPrice } from "@/lib/format";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const BASE_FIELDS = [
  { name: "name", label: "Nom", required: true },
  { name: "slug", label: "Adresse (slug)", type: "slug", from: "name", required: true, hint: "Ne changez pas l'adresse d'O'GAB ni de G-Fitness : leurs pages en dépendent." },
  { name: "category", label: "Catégorie", placeholder: "Gastronomie, Sport & bien-être…" },
  { name: "orderIndex", label: "Ordre d'affichage", type: "number" },
  { name: "shortDescription", label: "Accroche", type: "textarea", rows: 2, hint: "Texte court des cartes de l'accueil." },
  { name: "description", label: "Présentation", type: "textarea", rows: 6 },
  { name: "cardImage", label: "Image des cartes", type: "image", folder: "DOMAINES" },
  { name: "heroImage", label: "Image d'en-tête de la page", type: "image", folder: "DOMAINES" },
  { name: "objectives", label: "Objectifs", type: "list", hint: "Un objectif par ligne." },
  { name: "programs", label: "Programmes", type: "programs" },
  { name: "gallery", label: "Galerie", type: "gallery", folder: "DOMAINES" },
];

/** Champs propres à O'GAB et G-Fitness, rangés dans {@code details} côté API. */
const DETAIL_FIELDS = {
  ogab: [
    { name: "_address", label: "Adresse du restaurant", span: "full" },
    { name: "_phone", label: "Téléphone du restaurant" },
    { name: "_hours", label: "Horaires", type: "repeater", item: [{ name: "days", label: "Jours" }, { name: "time", label: "Horaires" }], addLabel: "Ajouter une plage" },
  ],
  "g-fitness": [
    {
      name: "_schedule", label: "Planning des cours", type: "repeater", addLabel: "Ajouter un cours",
      hint: "Les cours sont regroupés par jour sur la page G-Fitness.",
      item: [{ name: "day", label: "Jour", options: DAYS }, { name: "time", label: "Heure" }, { name: "name", label: "Cours" }],
    },
    {
      name: "_trainers", label: "Coachs", type: "repeater", folder: "EQUIPE", addLabel: "Ajouter un coach",
      item: [{ name: "name", label: "Nom" }, { name: "specialty", label: "Spécialité" }, { name: "image", label: "Photo", type: "image" }],
    },
  ],
};

function expand(domain) {
  const d = domain.details || {};
  const info = d.restaurantInfo || {};
  return {
    ...domain,
    _address: info.address || "",
    _phone: info.phone || "",
    _hours: info.hours || [],
    _schedule: (d.schedule || []).flatMap((day) => day.classes.map((c) => ({ day: day.day, time: c.time, name: c.name }))),
    _trainers: d.trainers || [],
  };
}

function prepare(body, domain) {
  const { _address, _phone, _hours, _schedule, _trainers, ...request } = body;
  const details = { ...(domain?.details || {}) };
  if (domain?.slug === "ogab") {
    details.restaurantInfo = { ...details.restaurantInfo, address: _address, phone: _phone, hours: _hours };
  }
  if (domain?.slug === "g-fitness") {
    const days = [...new Set(_schedule.map((c) => c.day))].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
    details.schedule = days.map((day) => ({ day, classes: _schedule.filter((c) => c.day === day).map(({ time, name }) => ({ time, name })) }));
    // Les réseaux sociaux des coachs ne sont pas édités ici : on les garde.
    details.trainers = _trainers.map((t) => ({ ...(domain.details?.trainers || []).find((old) => old.name === t.name), ...t }));
  }
  // Champs de l'API absents du formulaire (icône, couleur) conservés tels quels.
  return { icon: domain?.icon ?? null, color: domain?.color ?? null, ...request, details };
}

const DOMAINS = {
  label: "Contenu",
  title: "Domaines",
  intro: "Les pôles d'activité présentés sur l'accueil et leurs pages.",
  newLabel: "Nouveau domaine",
  created: "Domaine créé",
  list: { path: "/domains" },
  load: (row) => api(`/domains/${row.slug}`),
  expand,
  prepare,
  itemTitle: (d) => d.name,
  columns: [
    { key: "name", label: "Domaine", render: (d) => <TitleCell image={d.cardImage || d.heroImage} title={d.name} subtitle={d.shortDescription} /> },
    { key: "category", label: "Catégorie" },
    { key: "orderIndex", label: "Ordre", className: "text-right" },
  ],
  fields: (domain) => [...BASE_FIELDS, ...(DETAIL_FIELDS[domain?.slug] || [])],
  create: (body) => api("/admin/domains", { method: "POST", body }),
  update: (domain, body) => api(`/admin/domains/${domain.id}`, { method: "PUT", body }),
  remove: (domain) => api(`/admin/domains/${domain.id}`, { method: "DELETE" }),
  deleteConfirm: "Supprimer ce domaine ? Sa page disparaîtra du site.",
};

function Menu() {
  const [category, setCategory] = useUrlFilter("rubrique");
  const menu = useResource("/domains/ogab/menu");
  const categories = (menu.data || []).map((c) => c.category);

  const config = useMemo(() => ({
    title: "Carte O'GAB",
    intro: "Plats et boissons commandables en ligne. Sans prix, le plat s'affiche « sur demande ».",
    newLabel: "Nouveau plat",
    created: "Plat ajouté à la carte",
    list: {
      path: "/domains/ogab/menu",
      select: (data) => data.filter((c) => !category || c.category === category).flatMap((c) => c.items),
    },
    itemTitle: (m) => m.name,
    columns: [
      { key: "name", label: "Plat", render: (m) => <TitleCell image={m.image} title={m.name} subtitle={m.description} /> },
      { key: "category", label: "Rubrique" },
      { key: "price", label: "Prix", className: "whitespace-nowrap", render: (m) => <span className="font-mono">{formatPrice(m.price)}</span> },
    ],
    fields: [
      { name: "name", label: "Nom", required: true },
      { name: "category", label: "Rubrique", required: true, suggestions: categories, default: category },
      { name: "price", label: "Prix", type: "price", hint: "Vide = sur demande." },
      { name: "orderIndex", label: "Ordre dans la rubrique", type: "number" },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
      { name: "image", label: "Photo", type: "image", folder: "CARTE" },
    ],
    create: (body) => api("/admin/domains/ogab/menu-items", { method: "POST", body }),
    update: (item, body) => api(`/admin/menu-items/${item.id}`, { method: "PUT", body }),
    remove: (item) => api(`/admin/menu-items/${item.id}`, { method: "DELETE" }),
    deleteConfirm: "Retirer ce plat de la carte ?",
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [category, categories.join("|")]);

  return (
    <CrudPage
      config={config}
      embedded
      filters={categories.length > 1 && (
        <FilterTabs label="Rubrique" options={[{ value: "", label: "Toute la carte" }, ...categories.map((c) => ({ value: c, label: c }))]} value={category} onChange={setCategory} />
      )}
    />
  );
}

export default function Domains() {
  const [view, setView] = useUrlFilter("vue", "domaines");
  return (
    <AdminPage label="Contenu" title="Domaines & carte" intro="Pôles d'activité, informations pratiques d'O'GAB, planning et coachs de G-Fitness, et carte du restaurant.">
      <ViewSwitch options={[["domaines", "Domaines"], ["carte", "Carte O'GAB"]]} value={view} onChange={setView} />
      {view === "carte" ? <Menu /> : <CrudPage config={{ ...DOMAINS, title: undefined, intro: undefined }} embedded />}
    </AdminPage>
  );
}
