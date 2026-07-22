"use client";
import { createContext, useContext, useReducer, useCallback, useMemo } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.id === action.item.id && i.source === action.item.source
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === existing.id && i.source === existing.source
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === action.id && i.source === action.source)
        ),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.id === action.id && i.source === action.source)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.source === action.source
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_OPEN":
      return { ...state, isOpen: action.open };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () =>
      state.items.reduce((sum, i) => {
        const numeric = parseFloat(i.price.replace(/[^\d]/g, ""));
        return sum + numeric * i.quantity;
      }, 0),
    [state.items]
  );

  const addItem = useCallback((item) => {
    dispatch({ type: "ADD_ITEM", item });
  }, []);

  const removeItem = useCallback((id, source) => {
    dispatch({ type: "REMOVE_ITEM", id, source });
  }, []);

  const updateQuantity = useCallback((id, source, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", id, source, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: "SET_OPEN", open: true });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: "SET_OPEN", open: false });
  }, []);

  const value = useMemo(
    () => ({ items: state.items, isOpen: state.isOpen, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart }),
    [state.items, state.isOpen, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
