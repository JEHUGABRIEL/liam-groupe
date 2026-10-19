"use client";

import { ArrowUpRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { matchesQuery } from "@/components/admin/ui";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/client";
import { APPLICATION_STATUS, EVENT_STATUS, ORDER_STATUS, SUBSCRIPTION_STATUS, formatDate, formatPrice } from "@/lib/format";

const link = (path, q, extra = "") => `${path}?${extra}q=${encodeURIComponent(q)}`;

/**
 * Sources de la recherche globale. Listes paginées : recherche faite par l'API (?q=, 5 premiers) ;
 * listes simples : chargées une fois puis filtrées localement.
 */
const REMOTE = [
  {
    label: "Commandes", path: "/admin/orders",
    item: (o) => ({ title: o.reference, detail: `${o.customer?.fullName} · ${formatPrice(o.totalAmount)}`, meta: ORDER_STATUS[o.status], href: link("/admin/commandes", o.reference) }),
    all: (q) => link("/admin/commandes", q),
  },
  {
    label: "Abonnements", path: "/admin/subscriptions",
    item: (s) => ({ title: s.subscriber?.fullName, detail: s.planName, meta: SUBSCRIPTION_STATUS[s.status], href: link("/admin/abonnements", s.subscriber?.email || "") }),
    all: (q) => link("/admin/abonnements", q),
  },
  {
    label: "Candidatures", path: "/admin/miss-centrafrique/applications",
    item: (a) => ({ title: `${a.firstName} ${a.lastName}`, detail: `${a.city} · ${a.editionTitle}`, meta: APPLICATION_STATUS[a.status], href: link("/admin/miss-centrafrique", a.phone) }),
    all: (q) => link("/admin/miss-centrafrique", q),
  },
  {
    label: "Événements", path: "/admin/events",
    item: (e) => ({ title: e.title, detail: formatDate(e.startDate), meta: e.published ? EVENT_STATUS[e.status] : "Brouillon", href: link("/admin/evenements", e.title) }),
    all: (q) => link("/admin/evenements", q),
  },
  {
    label: "Actualités", path: "/admin/news",
    item: (n) => ({ title: n.title, detail: n.author, meta: n.publishedOn ? "Publiée" : "Brouillon", href: link("/admin/actualites", n.title) }),
    all: (q) => link("/admin/actualites", q),
  },
];

const LOCAL = [
  { label: "Boutique", path: "/products", keys: ["name", "category"], item: (p) => ({ title: p.name, detail: p.category, meta: formatPrice(p.price), href: link("/admin/boutique", p.name) }) },
  {
    label: "Carte O'GAB", path: "/domains/ogab/menu", select: (data) => data.flatMap((c) => c.items), keys: ["name", "category"],
    item: (m) => ({ title: m.name, detail: m.category, meta: formatPrice(m.price), href: link("/admin/domaines", m.name, "vue=carte&") }),
  },
  { label: "Domaines", path: "/domains", keys: ["name", "category"], item: (d) => ({ title: d.name, detail: d.category, href: link("/admin/domaines", d.name) }) },
  { label: "Partenaires", path: "/site/partners", keys: ["name", "category"], item: (p) => ({ title: p.name, detail: p.category, href: link("/admin/contenu", p.name, "vue=partenaires&") }) },
  { label: "Équipe", path: "/site/team", keys: ["name", "role"], item: (m) => ({ title: m.name, detail: m.role, href: link("/admin/contenu", m.name, "vue=equipe&") }) },
];

function useLocalSources(open) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!open || data) return;
    Promise.all(LOCAL.map((s) => api(s.path).then((d) => (s.select ? s.select(d) : d)).catch(() => [])))
      .then((lists) => setData(lists));
  }, [open, data]);
  return data;
}

function Results({ q, onNavigate, local }) {
  const [remote, setRemote] = useState({ q: null, groups: [] });

  useEffect(() => {
    if (q.length < 2) return undefined;
    let current = true;
    const timer = setTimeout(async () => {
      const groups = await Promise.all(REMOTE.map((source) =>
        api(`${source.path}?q=${encodeURIComponent(q)}&size=5`).then((page) => ({ source, page })).catch(() => ({ source, page: null }))));
      if (current) setRemote({ q, groups });
    }, 250);
    return () => { current = false; clearTimeout(timer); };
  }, [q]);

  if (q.length < 2) {
    return <p className="py-10 text-center text-encre/55">Commandes, clients, abonnés, candidates, événements, articles, produits, plats…</p>;
  }

  const groups = [
    ...remote.groups.filter((g) => g.page?.content.length).map(({ source, page }) => ({
      label: source.label, total: page.totalElements, all: source.all(q), items: page.content.map(source.item),
    })),
    ...LOCAL.map((source, i) => {
      const found = (local?.[i] || []).filter((item) => matchesQuery(item, q, source.keys));
      return { label: source.label, total: found.length, items: found.slice(0, 5).map(source.item) };
    }).filter((g) => g.items.length),
  ];
  const loading = remote.q !== q;

  if (!groups.length) {
    return loading
      ? <p className="flex items-center justify-center gap-2 py-10 text-encre/55"><Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />Recherche…</p>
      : <p className="py-10 text-center text-encre/55">Aucun résultat pour « {q} ».</p>;
  }

  return (
    <div className={`space-y-6 transition-opacity ${loading ? "opacity-60" : ""}`}>
      {groups.map((group) => (
        <section key={group.label}>
          <div className="flex items-center justify-between">
            <h3 className="t-label-sm text-[11px] text-encre/50">{group.label}</h3>
            {group.all && group.total > group.items.length && (
              <Link href={group.all} onClick={onNavigate} className="lien-action text-[11px]">Voir les {group.total}</Link>
            )}
          </div>
          <ul className="mt-2 border border-bordure">
            {group.items.map((item, i) => (
              <li key={`${item.href}-${i}`} className="border-b border-bordure last:border-b-0">
                <Link href={item.href} onClick={onNavigate} className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-creme/50 focus-visible:bg-creme/50">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{item.title}</span>
                    {item.detail && <span className="block truncate text-[0.82rem] text-encre/55">{item.detail}</span>}
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    {item.meta && <span className="t-label-sm text-[10.5px] text-encre/50">{item.meta}</span>}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-encre/30 group-hover:text-accent" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * Recherche dans tout le back-office : bouton de la barre latérale, ou Ctrl+K sur l'instance
 * qui porte {@code shortcut} (la barre latérale existe aussi en version mobile).
 */
export default function AdminSearch({ onNavigate, shortcut = false }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const local = useLocalSources(open);

  useEffect(() => {
    if (!shortcut) return undefined;
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const close = useCallback(() => { setOpen(false); setQ(""); }, []);
  const navigate = () => { close(); onNavigate?.(); };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-left text-[0.88rem] text-white/60 transition-colors hover:border-white/35 hover:text-white"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
        <span className="flex-1">Rechercher…</span>
        <kbd className="font-mono text-[10.5px] text-white/40">Ctrl K</kbd>
      </button>
      <Modal open={open} onClose={close} label="Back-office" title="Rechercher" width="max-w-[680px]">
        <label className="relative block">
          <span className="sr-only">Rechercher dans le back-office</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-encre/40" />
          <input
            type="search"
            className="champ py-3.5 pl-12 text-[1.05rem]"
            placeholder="Référence, nom, e-mail, téléphone, titre…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="mt-6 min-h-[200px]">
          <Results q={q.trim()} onNavigate={navigate} local={local} />
        </div>
      </Modal>
    </>
  );
}
