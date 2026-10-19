"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "liam:panier";

/**
 * Panier commun à la carte O'GAB (source MENU) et à la boutique (source BOUTIQUE).
 * Le prix affiché n'est qu'indicatif : l'API recalcule le total à la commande.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
    } catch {
      setItems([]);
    }
  }, []);

  const persist = useCallback((updater) => {
    setItems((current) => {
      const next = updater(current);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Navigation privée : le panier reste en mémoire.
      }
      return next;
    });
  }, []);

  const add = useCallback((item) => {
    persist((current) => {
      const existing = current.find((i) => i.source === item.source && i.itemId === item.itemId);
      if (existing) {
        return current.map((i) => (i === existing ? { ...i, quantity: Math.min(99, i.quantity + 1) } : i));
      }
      return [...current, { ...item, quantity: 1 }];
    });
    setOpen(true);
  }, [persist]);

  const setQuantity = useCallback((source, itemId, quantity) => {
    persist((current) => quantity <= 0
      ? current.filter((i) => !(i.source === source && i.itemId === itemId))
      : current.map((i) => (i.source === source && i.itemId === itemId ? { ...i, quantity: Math.min(99, quantity) } : i)));
  }, [persist]);

  const clear = useCallback(() => persist(() => []), [persist]);

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, i) => sum + i.quantity, 0),
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    open,
    setOpen,
    add,
    setQuantity,
    clear,
  }), [items, open, add, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return context;
}
