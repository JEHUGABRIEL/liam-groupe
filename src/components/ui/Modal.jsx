"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

/**
 * Fenêtre modale accessible : fond assombri, fermeture par Échap, clic sur le fond
 * ou bouton ×, focus placé dans la fenêtre puis rendu à l'élément d'origine.
 * {@code panneau} : la fenêtre glisse du bord droit sur toute la hauteur (formulaires du back-office).
 */
export default function Modal({ open, onClose, title, label, children, width = "max-w-[560px]", panneau = false }) {
  const panel = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        // Garde le focus dans la fenêtre.
        const items = panel.current?.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), textarea, select");
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Premier champ du formulaire, sinon le bouton de fermeture.
    const target = panel.current?.querySelector("input:not([disabled])") || panel.current?.querySelector("[data-fermer]");
    target?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-[80] flex ${panneau ? "justify-end" : "items-end justify-center sm:items-center sm:p-6"}`}>
      <button type="button" aria-label="Fermer" tabIndex={-1} className="absolute inset-0 bg-noir-doux/70" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full overflow-y-auto border border-bordure bg-white ${panneau ? "h-full animate-[panneau_0.35s_cubic-bezier(0.2,0.8,0.3,1)]" : "max-h-[92vh]"} ${width}`}
      >
        <div className="sticky top-0 z-[1] flex items-center justify-between border-b border-bordure bg-white pl-6 sm:pl-8">
          <div className="py-5">
            {label && <p className="t-label-sm text-encre/50">{label}</p>}
            <h2 id={titleId} className="t-h5 mt-1">{title}</h2>
          </div>
          <button type="button" data-fermer onClick={onClose} aria-label="Fermer" className="flex h-[72px] w-[72px] shrink-0 items-center justify-center transition-colors hover:bg-accent hover:text-white">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
