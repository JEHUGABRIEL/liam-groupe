"use client";

import { useMemo } from "react";
import CrudPage from "@/components/admin/CrudPage";
import { TitleCell } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import { api } from "@/lib/client";
import { formatPrice } from "@/lib/format";

export default function Products() {
  const domains = useResource("/domains");

  const config = useMemo(() => ({
    label: "Contenu",
    title: "Boutique",
    intro: "Produits de la boutique en ligne. Sans prix, le produit s'affiche « sur demande » et ne peut pas être commandé.",
    newLabel: "Nouveau produit",
    created: "Produit ajouté",
    list: { path: "/products" },
    itemTitle: (p) => p.name,
    columns: [
      { key: "name", label: "Produit", render: (p) => <TitleCell image={p.image} title={p.name} subtitle={p.category} /> },
      { key: "domain", label: "Domaine", render: (p) => domains.items.find((d) => d.slug === p.domainSlug)?.name || "—" },
      { key: "price", label: "Prix", className: "whitespace-nowrap", render: (p) => <span className="font-mono">{formatPrice(p.price)}</span> },
      { key: "orderIndex", label: "Ordre", className: "text-right" },
    ],
    fields: [
      { name: "name", label: "Nom", required: true, span: "full" },
      { name: "slug", label: "Adresse (slug)", type: "slug", from: "name", required: true, hint: "/boutique/…" },
      { name: "price", label: "Prix", type: "price", hint: "Vide = sur demande." },
      { name: "category", label: "Catégorie", placeholder: "Vêtements, Accessoires…" },
      { name: "domainSlug", label: "Domaine vendeur", type: "select", options: domains.items.map((d) => ({ value: d.slug, label: d.name })) },
      { name: "description", label: "Description", type: "textarea", rows: 5 },
      { name: "image", label: "Photo", type: "image", folder: "BOUTIQUE" },
      { name: "orderIndex", label: "Ordre d'affichage", type: "number" },
    ],
    create: (body) => api("/admin/products", { method: "POST", body }),
    update: (product, body) => api(`/admin/products/${product.id}`, { method: "PUT", body }),
    remove: (product) => api(`/admin/products/${product.id}`, { method: "DELETE" }),
    deleteConfirm: "Supprimer le produit ?",
  }), [domains.items]);

  return <CrudPage config={config} />;
}
