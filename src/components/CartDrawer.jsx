"use client";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, MessageSquare } from "lucide-react";
import { useCart } from "../lib/cartContext";
import SafeImg from "./SafeImg";

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, closeCart, removeItem, updateQuantity, clearCart } = useCart();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") closeCart(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const formatPrice = (priceStr) => {
    const num = parseFloat(priceStr.replace(/[^\d]/g, ""));
    return num.toLocaleString("fr-FR") + " FCFA";
  };

  const sendWhatsApp = () => {
    const phone = "23676000000";
    const lines = items.map(
      (item) => `• ${item.name} × ${item.quantity} — ${item.price}`
    );
    const total = "Total : " + formatPrice(totalPrice.toString());
    const message = encodeURIComponent(
      `Bonjour LIAM Groupe ! Je souhaite commander :\n\n${lines.join("\n")}\n\n${total}\n\nMerci de me contacter pour la suite.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 z-[90] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-ink" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-brand-500 text-white text-[0.5rem] font-bold flex items-center justify-center px-[3px]">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <h2 className="font-heading font-bold text-lg text-ink">Mon panier</h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 text-brand-400" />
                </div>
                <h3 className="font-heading font-bold text-lg text-ink mb-1">Votre panier est vide</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Ajoutez des articles depuis le menu O'GAB ou la boutique pour commencer.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.source}-${item.id}`}
                      className="flex gap-4 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors"
                    >
                      {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                          <SafeImg
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-ink truncate">{item.name}</p>
                            <p className="text-brand-600 font-bold text-xs mt-0.5">{item.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id, item.source)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-2.5">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.source, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-ink transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-ink">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.source, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-ink transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs text-gray-400 ml-auto font-medium">
                            {formatPrice((parseFloat(item.price.replace(/[^\d]/g, "")) * item.quantity).toString())}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 px-6 py-5 space-y-4 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm font-medium">Total</span>
                    <span className="font-heading font-bold text-xl text-ink">
                      {formatPrice(totalPrice.toString())}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      Vider
                    </button>
                    <button
                      type="button"
                      onClick={sendWhatsApp}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-500 text-white font-semibold py-3 rounded-xl hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 transition-all active:scale-[0.98]"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Commander via WhatsApp
                    </button>
                  </div>
                  <p className="text-[0.6rem] text-gray-400 text-center">
                    Votre commande sera envoyée par WhatsApp. Un membre de l'équipe vous recontactera.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
