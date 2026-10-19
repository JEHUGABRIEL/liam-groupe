"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState } from "react";
import LoginForm from "@/components/account/LoginForm";
import RegisterForm from "@/components/account/RegisterForm";
import ContactPanel from "@/components/layout/ContactPanel";
import Modal from "@/components/ui/Modal";

const ModalContext = createContext(null);

/** Page interne sûre où aller après connexion, sinon null (on reste sur la page). */
function safeTarget(target) {
  return target && target.startsWith("/") && !target.startsWith("//") ? target : null;
}

/**
 * Ouvre lui-même la modale quand l'URL contient ?auth=connexion|inscription
 * (liens d'e-mail, pages protégées, anciennes URL /connexion), puis nettoie l'URL.
 */
function AuthFromUrl({ openAuth }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const mode = params.get("auth");
    if (mode !== "connexion" && mode !== "inscription") return;
    openAuth(mode, { redirect: params.get("redirect") });
    const rest = new URLSearchParams(params);
    rest.delete("auth");
    rest.delete("redirect");
    router.replace(`${pathname}${rest.size ? `?${rest}` : ""}`, { scroll: false });
  }, [params, pathname, router, openAuth]);
  return null;
}

/** Modales du site : connexion / inscription et « Nous contacter ». */
export function ModalProvider({ siteInfo, children }) {
  const router = useRouter();
  const [auth, setAuth] = useState(null); // { mode, redirect }
  const [contactOpen, setContactOpen] = useState(false);

  const openAuth = useCallback((mode = "connexion", { redirect } = {}) => {
    setContactOpen(false);
    setAuth({ mode, redirect: safeTarget(redirect) });
  }, []);
  const closeAuth = useCallback(() => setAuth(null), []);
  const openContact = useCallback(() => {
    setAuth(null);
    setContactOpen(true);
  }, []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  const onAuthenticated = useCallback(() => {
    const target = auth?.redirect;
    setAuth(null);
    if (target) router.push(target);
  }, [auth, router]);

  const value = useMemo(() => ({ openAuth, openContact }), [openAuth, openContact]);
  const isLogin = auth?.mode !== "inscription";

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Suspense>
        <AuthFromUrl openAuth={openAuth} />
      </Suspense>
      <Modal
        open={Boolean(auth)}
        onClose={closeAuth}
        label="Espace client"
        title={isLogin ? "Connexion" : "Créer mon compte"}
      >
        {isLogin ? (
          <LoginForm onSuccess={onAuthenticated} onSwitch={() => setAuth((a) => ({ ...a, mode: "inscription" }))} />
        ) : (
          <RegisterForm onSuccess={onAuthenticated} onSwitch={() => setAuth((a) => ({ ...a, mode: "connexion" }))} />
        )}
      </Modal>
      <Modal open={contactOpen} onClose={closeContact} label="LIAM Groupe" title="Nous contacter" width="max-w-[720px]">
        <ContactPanel siteInfo={siteInfo} />
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModals doit être utilisé dans <ModalProvider>");
  return context;
}
