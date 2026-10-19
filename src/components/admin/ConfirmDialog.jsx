"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Fenêtre de confirmation d'une action sensible (suppression, annulation, révocation).
 * S'ouvre au-dessus d'un panneau d'édition : Échap ne ferme qu'elle, le focus va sur « Annuler ».
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirmer", danger = true, loading, onConfirm, onCancel }) {
  const cancelButton = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    cancelButton.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        // Phase de capture : le panneau en dessous ne reçoit pas la touche.
        event.stopImmediatePropagation();
        if (!loading) onCancel();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      previous?.focus?.();
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-5 text-encre" onClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label="Annuler" tabIndex={-1} className="absolute inset-0 bg-noir-doux/60" onClick={loading ? undefined : onCancel} />
      <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="relative w-full max-w-[460px] animate-[panneau_0.25s_ease-out] border border-bordure bg-white p-7">
        <div className="flex items-start gap-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center ${danger ? "bg-accent-pale text-accent" : "bg-gris-clair text-encre"}`}>
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 id={titleId} className="t-h5">{title}</h2>
            {message && <p className="texte mt-2 text-[0.95rem]">{message}</p>}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button ref={cancelButton} type="button" className="btn-contour" onClick={onCancel} disabled={loading}>Annuler</button>
          <button type="button" className={danger ? "btn-accent" : "btn-sombre"} onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
