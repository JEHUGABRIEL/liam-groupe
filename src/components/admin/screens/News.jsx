"use client";

import CrudPage from "@/components/admin/CrudPage";
import { Badge, TitleCell } from "@/components/admin/ui";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/format";

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Bangui" });

function Publication({ date }) {
  if (!date) return <Badge tone="brouillon">Brouillon</Badge>;
  if (date > today()) return <Badge tone="attente">Programmée · {formatDate(date, { day: "numeric", month: "short" })}</Badge>;
  return <Badge tone="ok">Publiée · {formatDate(date, { day: "numeric", month: "short", year: "numeric" })}</Badge>;
}

const CONFIG = {
  label: "Contenu",
  title: "Actualités",
  intro: "Articles de la page Actualités. Un article sans date de publication reste en brouillon ; une date future le programme.",
  newLabel: "Nouvel article",
  created: "Article créé",
  list: { path: "/admin/news", paged: true },
  searchPlaceholder: "Titre, auteur…",
  load: (row) => api(`/admin/news/${row.id}`),
  itemTitle: (n) => n.title,
  columns: [
    { key: "title", label: "Article", render: (n) => <TitleCell image={n.image} title={n.title} subtitle={n.excerpt} /> },
    { key: "tags", label: "Rubriques", render: (n) => <span className="text-[0.85rem] text-encre/65">{(n.tags || []).join(", ")}</span> },
    { key: "publishedOn", label: "Publication", render: (n) => <Publication date={n.publishedOn} /> },
  ],
  fields: [
    { name: "title", label: "Titre", required: true, span: "full" },
    { name: "slug", label: "Adresse (slug)", type: "slug", from: "title", required: true, hint: "/actualites/…" },
    { name: "publishedOn", label: "Date de publication", type: "date", hint: "Vide = brouillon, non visible sur le site." },
    { name: "tags", label: "Rubriques", type: "tags", placeholder: "Miss Centrafrique, Partenariat", hint: "Séparées par des virgules." },
    { name: "author", label: "Auteur" },
    { name: "excerpt", label: "Chapô", type: "textarea", rows: 3, hint: "Résumé affiché sur les cartes." },
    { name: "content", label: "Article", type: "textarea", rows: 14, hint: "Une ligne vide sépare deux paragraphes." },
    { name: "image", label: "Image principale", type: "image", folder: "ACTUALITES" },
    { name: "gallery", label: "Galerie", type: "gallery", folder: "ACTUALITES" },
    { name: "orderIndex", label: "Ordre d'affichage", type: "number" },
  ],
  create: (body) => api("/admin/news", { method: "POST", body }),
  update: (news, body) => api(`/admin/news/${news.id}`, { method: "PUT", body }),
  remove: (news) => api(`/admin/news/${news.id}`, { method: "DELETE" }),
  deleteConfirm: "L'article disparaît du site et son adresse redevient disponible.",
};

export default function News() {
  return <CrudPage config={CONFIG} />;
}
