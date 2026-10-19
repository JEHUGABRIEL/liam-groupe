"use client";

import { createContext, useContext } from "react";

export const ToastContext = createContext(() => {});

/** Message bref en bas de l'écran après une action : toast("Commande confirmée") ou toast(message, "erreur"). */
export function useToast() {
  return useContext(ToastContext);
}
