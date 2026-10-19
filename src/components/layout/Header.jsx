"use client";

import { ArrowRight, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useModals } from "@/components/providers/ModalProvider";
import { NAV_LINKS } from "@/lib/links";

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { count, setOpen: openCart } = useCart();
  const { openAuth, openContact } = useModals();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const iconButton = "relative inline-flex items-center px-3 text-brun transition-colors hover:text-accent sm:px-4";
  const fromMenu = (action) => () => {
    setMenuOpen(false);
    action();
  };

  return (
    <header className="entete">
      <div className="flex h-[88px] items-stretch pl-5 sm:pl-[30px]">
        <Link href="/" className="flex items-center" aria-label="LIAM Groupe — accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-liam.png" alt="LIAM Groupe" className="h-[54px] w-auto object-contain" />
        </Link>

        <nav aria-label="Navigation principale" className="ml-8 hidden items-stretch lg:flex xl:ml-20">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-lien" aria-current={isActive(pathname, link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-stretch">
          {user ? (
            <Link href="/mon-compte" className={iconButton} aria-label={`Mon compte (${user.firstName})`} title="Mon compte">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brun font-mono text-[12px] font-bold text-white">
                  {user.firstName?.[0]?.toUpperCase()}
                </span>
              )}
            </Link>
          ) : (
            <button type="button" onClick={() => openAuth("connexion")} className={iconButton} aria-label="Se connecter" title="Se connecter">
              <UserRound aria-hidden="true" className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => openCart(true)}
            className={`${iconButton} mr-2`}
            aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`}
            title="Panier"
          >
            <ShoppingBag aria-hidden="true" className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-[26px] flex h-[18px] min-w-[18px] items-center justify-center bg-accent px-1 font-mono text-[10px] font-bold text-white sm:right-1.5">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
          <button type="button" onClick={openContact} className="btn-entete hidden sm:inline-flex">
            Nous contacter
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
          <button type="button" className="btn-burger-entete" aria-label="Ouvrir le menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <span aria-hidden="true" className="grid grid-cols-3 gap-[4px]">
              {Array.from({ length: 9 }, (_, i) => <span key={i} className="block h-[4px] w-[4px] bg-current" />)}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-noir-doux text-white" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-[88px] items-center justify-between border-b border-white/10 pl-5 sm:pl-[30px]">
            <span className="t-label text-white/60">Menu</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="btn-burger-entete" aria-label="Fermer le menu">
              <X aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <nav aria-label="Navigation principale" className="mx-auto flex w-full max-w-site flex-1 flex-col overflow-y-auto px-5 py-6 sm:px-[30px]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className="border-b border-white/10 py-5 font-mono text-[20px] font-bold uppercase tracking-[1px] transition-colors hover:text-accent-vif aria-[current=page]:text-accent-vif md:text-[32px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={fromMenu(openContact)} className="btn-accent">
                Nous contacter <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
              {user ? (
                <Link href="/mon-compte" className="btn border border-white/40 text-white hover:bg-white hover:text-encre">Mon compte</Link>
              ) : (
                <button type="button" onClick={fromMenu(() => openAuth("connexion"))} className="btn border border-white/40 text-white hover:bg-white hover:text-encre">
                  Se connecter
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
