import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/links";

/** Bouton flottant « Une question ? » vers le WhatsApp du groupe. */
export default function WhatsAppButton({ number }) {
  const href = whatsappHref(number, "Bonjour LIAM Groupe, j'ai une question.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 bg-whatsapp px-4 py-3 font-mono text-[12px] font-bold uppercase tracking-[1px] text-white shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      <span className="hidden sm:inline">Une question ?</span>
    </a>
  );
}
