"use client";

import {
  CalendarDays, Crown, Dumbbell, FileText, Layers, LayoutDashboard, LogOut, Menu, Newspaper,
  ShoppingBag, Store, Trash2, UserCog, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AdminSearch from "@/components/admin/AdminSearch";
import { ToastContext } from "@/components/admin/toast";
import { useAuth } from "@/components/providers/AuthProvider";
import PageLoader from "@/components/ui/PageLoader";

export const ADMIN_NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { section: "Activité" },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/abonnements", label: "Abonnements", icon: Dumbbell },
  { href: "/admin/evenements", label: "Événements", icon: CalendarDays },
  { href: "/admin/miss-centrafrique", label: "Miss Centrafrique", icon: Crown },
  { section: "Contenu" },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/boutique", label: "Boutique", icon: Store },
  { href: "/admin/domaines", label: "Domaines & carte", icon: Layers },
  { href: "/admin/contenu", label: "Contenu du site", icon: FileText },
  { href: "/admin/corbeille", label: "Corbeille", icon: Trash2 },
  { section: "Équipe" },
  { href: "/admin/administrateurs", label: "Administrateurs", icon: UserCog },
];

function isActive(pathname, href) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function Sidebar({ user, onNavigate, onLogout, shortcut = false }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-noir-doux text-white">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-4 border-b border-white/10 px-6 py-6">
        <img src="/images/logo-liam-blanc.png" alt="LIAM Groupe" className="h-10 w-auto" />
        <span className="t-label-sm text-white/60">Back-office</span>
      </Link>
      <div className="border-b border-white/10 px-5 py-4">
        <AdminSearch onNavigate={onNavigate} shortcut={shortcut} />
      </div>
      <nav aria-label="Back-office" className="flex-1 overflow-y-auto py-4">
        {ADMIN_NAV.map((item) => item.section ? (
          <p key={item.section} className="t-label-sm mt-6 px-6 pb-2 text-[11px] text-white/35">{item.section}</p>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className="flex items-center gap-3 border-l-2 border-transparent px-6 py-2.5 font-mono text-[12.5px] font-bold uppercase tracking-[0.08em] text-white/65 transition-colors hover:bg-white/5 hover:text-white aria-[current=page]:border-accent aria-[current=page]:bg-white/[0.07] aria-[current=page]:text-white"
          >
            <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          {user.avatarUrl
            ? <img src={user.avatarUrl} alt="" className="h-9 w-9 object-cover" />
            : <span className="flex h-9 w-9 items-center justify-center bg-accent font-mono text-sm font-bold">{user.firstName?.[0]}</span>}
          <div className="min-w-0">
            <p className="truncate text-[0.9rem] font-medium">{user.firstName} {user.lastName}</p>
            <p className="truncate text-[0.78rem] text-white/50">{user.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <button type="button" onClick={onLogout} className="t-label-sm inline-flex items-center gap-1.5 text-[11px] text-white/60 hover:text-white">
            <LogOut aria-hidden="true" className="h-3.5 w-3.5" /> Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

/** Habillage du back-office : réservé aux administrateurs, navigation latérale, messages d'action. */
export default function AdminShell({ children }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Session expirée pendant la visite : retour à la connexion.
  useEffect(() => {
    if (!loading && !user) router.replace(`/?auth=connexion&redirect=${encodeURIComponent(pathname)}`);
  }, [loading, user, router, pathname]);

  const toast = useCallback((message, type = "succes") => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4500);
  }, []);

  if (loading || !user) return <PageLoader label="Ouverture du back-office" />;

  if (!isAdmin) {
    return (
      <section className="bloc-heros min-h-screen justify-center">
        <p className="t-label text-accent">Accès réservé</p>
        <h1 className="titre-heros mt-4 max-w-3xl">Le back-office est réservé à l&apos;équipe LIAM Groupe.</h1>
        <p className="texte mt-5 max-w-xl">Les comptes administrateurs sont créés sur invitation d&apos;un membre de l&apos;équipe.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-sombre">Retour au site</Link>
          <button
            type="button"
            className="btn-contour"
            onClick={async () => { await logout(); router.replace(`/?auth=connexion&redirect=${encodeURIComponent(pathname)}`); }}
          >
            Changer de compte
          </button>
        </div>
      </section>
    );
  }

  async function signOut() {
    await logout();
    router.replace("/");
  }

  return (
    <ToastContext.Provider value={toast}>
      <div className="min-h-screen bg-gris-clair lg:grid lg:grid-cols-[264px_1fr]">
        <aside className="sticky top-0 hidden h-screen lg:block">
          <Sidebar user={user} onLogout={signOut} shortcut />
        </aside>

        {/* Barre du haut et menu sur mobile */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-bordure bg-white lg:hidden">
          <Link href="/admin" className="flex items-center gap-3 px-5">
            <img src="/images/logo-liam.png" alt="LIAM Groupe" className="h-9 w-auto" />
            <span className="t-label-sm text-encre/50">Back-office</span>
          </Link>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu" className="btn-burger-entete h-[64px] w-[64px]">
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        {menuOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button type="button" aria-label="Fermer le menu" tabIndex={-1} className="absolute inset-0 bg-noir-doux/60" onClick={() => setMenuOpen(false)} />
            <div className="relative h-full w-[280px] max-w-[85vw]">
              <Sidebar user={user} onNavigate={() => setMenuOpen(false)} onLogout={signOut} />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" className="absolute right-2 top-5 p-2 text-white/70 hover:text-white">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <main id="principal" className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
      </div>

      <div aria-live="polite" className="fixed bottom-5 right-5 z-[90] flex max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <p
            key={t.id}
            role={t.type === "erreur" ? "alert" : "status"}
            className={`animate-[panneau_0.3s_ease-out] border-l-4 px-5 py-3.5 text-[0.92rem] shadow-[0_14px_40px_-18px_rgb(42_18_1/0.45)] ${t.type === "erreur" ? "border-accent bg-white text-accent-sombre" : "border-emerald-600 bg-white text-encre"}`}
          >
            {t.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
