"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/admin/AdminShell";
import Notice from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/PageLoader";
import SafeImg from "@/components/ui/SafeImg";

/** En-tête d'un écran du back-office : surtitre, titre, introduction et actions. */
export function AdminPage({ label, title, intro, actions, children }) {
  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-bordure pb-8">
        <div className="max-w-2xl">
          {label && <p className="t-label-sm text-accent">{label}</p>}
          <h1 className="t-h3 mt-2">{title}</h1>
          {intro && <p className="texte mt-3">{intro}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </header>
      <div className="mt-8">{children}</div>
    </div>
  );
}

const TONES = {
  neutre: "bg-gris-clair text-encre",
  ok: "bg-emerald-50 text-emerald-800",
  attente: "bg-accent-pale text-accent-sombre",
  info: "bg-sky-50 text-sky-800",
  fin: "bg-noir-doux text-white",
  brouillon: "border border-dashed border-attenue text-encre/60",
};

export function Badge({ tone = "neutre", children }) {
  return <span className={`badge whitespace-nowrap ${TONES[tone]}`}>{children}</span>;
}

/** Onglets de filtre (statuts) au-dessus d'une liste. */
export function FilterTabs({ options, value, onChange, label = "Filtrer" }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-bordure">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className="t-label-sm -mb-px whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-encre/55 transition-colors hover:text-encre aria-selected:border-accent aria-selected:text-encre"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Pagination({ page, totalPages, totalElements, onChange }) {
  if (totalPages <= 1) return totalElements ? <p className="t-label-sm mt-4 text-encre/50">{totalElements} élément{totalElements > 1 ? "s" : ""}</p> : null;
  const arrow = "flex h-10 w-10 items-center justify-center border border-bordure bg-white transition-colors hover:border-encre disabled:opacity-40 disabled:hover:border-bordure";
  return (
    <div className="mt-5 flex items-center justify-between gap-4">
      <p className="t-label-sm text-encre/50">{totalElements} éléments · page {page + 1} / {totalPages}</p>
      <div className="flex gap-2">
        <button type="button" className={arrow} disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Page précédente">
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <button type="button" className={arrow} disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)} aria-label="Page suivante">
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Tableau du back-office. {@code columns} : [{ key, label, render(row), className }] ;
 * un clic sur une ligne appelle {@code onOpen(row)} (édition, détail).
 */
export function DataTable({ columns, resource, onOpen, empty = "Aucun élément pour le moment." }) {
  if (resource.status === "loading") {
    return (
      <div className="border border-bordure bg-white">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-6 border-b border-bordure px-5 py-5 last:border-b-0">
            <Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/5" /><Skeleton className="ml-auto h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }
  if (resource.status === "error") return <Notice type="erreur">{resource.message}</Notice>;
  if (resource.items.length === 0) {
    return <p className="border border-dashed border-bordure bg-white px-6 py-14 text-center text-encre/60">{empty}</p>;
  }
  return (
    <div className={`overflow-x-auto border border-bordure bg-white transition-opacity ${resource.status === "refreshing" ? "opacity-60" : ""}`}>
      <table className="w-full min-w-[640px] text-left text-[0.92rem]">
        <thead>
          <tr className="border-b border-bordure bg-white">
            {columns.map((col) => (
              <th key={col.key} scope="col" className={`t-label-sm px-5 py-4 text-[11px] text-encre/50 ${col.className || ""}`}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resource.items.map((row) => (
            <tr
              key={row.id}
              onClick={onOpen ? () => onOpen(row) : undefined}
              className={`border-b border-bordure align-middle last:border-b-0 ${onOpen ? "cursor-pointer transition-colors hover:bg-creme/40" : ""}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-5 py-4 ${col.className || ""}`}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Bouton d'action qui appelle l'API, affiche un message et recharge la liste.
 * {@code confirm} : demande une confirmation en ligne (pas de fenêtre du navigateur).
 */
export function ActionButton({ action, success, onDone, confirm, className = "btn-contour", children }) {
  const toast = useToast();
  const [state, setState] = useState("idle");

  async function run(event) {
    event.stopPropagation();
    setState("loading");
    try {
      const result = await action();
      toast(success);
      setState("idle");
      onDone?.(result);
    } catch (error) {
      toast(error.message, "erreur");
      setState("idle");
    }
  }

  if (confirm && state === "confirm") {
    return (
      <span className="inline-flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <span className="text-[0.85rem] text-encre/70">{confirm}</span>
        <button type="button" onClick={run} className="btn-accent px-4 py-2.5">Confirmer</button>
        <button type="button" onClick={() => setState("idle")} className="btn-contour px-4 py-2.5">Annuler</button>
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={state === "loading"}
      onClick={confirm ? (e) => { e.stopPropagation(); setState("confirm"); } : run}
      className={`${className} px-4 py-2.5`}
    >
      {state === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/** Ligne « Libellé : valeur » d'une fiche de détail. */
export function Detail({ label, children }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="grid gap-1 border-b border-bordure py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="t-label-sm text-[11px] text-encre/50">{label}</dt>
      <dd className="text-[0.95rem] text-encre">{children}</dd>
    </div>
  );
}

/** Chiffre clé du tableau de bord. */
export function StatCard({ label, value, hint, href, tone }) {
  const Tag = href ? Link : "div";
  return (
    <Tag href={href} className={`carte block p-6 ${tone === "alerte" && value > 0 ? "border-accent/50" : ""}`}>
      <p className="t-label-sm text-[11px] text-encre/55">{label}</p>
      <p className={`mt-3 font-mono text-[40px] font-bold leading-none ${tone === "alerte" && value > 0 ? "text-accent" : "text-encre"}`}>
        {value ?? "—"}
      </p>
      {hint && <p className="mt-3 text-[0.85rem] text-encre/60">{hint}</p>}
    </Tag>
  );
}

/** Filtre lu dans l'adresse (?statut=…), pour pouvoir partager ou recharger la vue filtrée. */
export function useUrlFilter(param = "statut", fallback = "") {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const value = params.get(param) ?? fallback;
  const set = (next) => {
    const query = new URLSearchParams(params);
    if (next) query.set(param, next); else query.delete(param);
    router.replace(`${pathname}${query.size ? `?${query}` : ""}`, { scroll: false });
  };
  return [value, set];
}

/** Bascule entre les vues d'un écran (ex. Abonnements / Formules), gardée dans l'adresse (?vue=…). */
export function ViewSwitch({ options, value, onChange }) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {options.map(([key, label]) => (
        <button key={key} type="button" onClick={() => onChange(key === options[0][0] ? "" : key)} aria-pressed={value === key} className={value === key ? "btn-sombre" : "btn-contour"}>
          {label}
        </button>
      ))}
    </div>
  );
}

/** Vignette + titre + sous-titre, première colonne des listes de contenu. */
export function TitleCell({ image, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-12 w-16 shrink-0 overflow-hidden border border-bordure bg-gris-clair">
        {image && <SafeImg src={image} alt="" className="h-full w-full object-cover" />}
      </span>
      <span className="min-w-0 max-w-[460px]">
        <span className="block font-medium">{title}</span>
        {subtitle && <span className="block truncate text-[0.8rem] text-encre/50">{subtitle}</span>}
      </span>
    </div>
  );
}
