"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useModals } from "@/components/providers/ModalProvider";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { api } from "@/lib/client";

/** Inscription à un événement : compte requis ; affiche l'inscription existante le cas échéant. */
export default function EventRegistration({ event }) {
  const { user, loading } = useAuth();
  const { openAuth } = useModals();
  const [registration, setRegistration] = useState(null);
  const [message, setMessage] = useState("");
  const [state, setState] = useState({ status: "idle" });

  useEffect(() => {
    if (!user) return;
    api("/event-registrations")
      .then((list) => setRegistration(list.find((r) => r.eventId === event.id && r.status === "CONFIRMEE") || null))
      .catch(() => {});
  }, [user, event.id]);

  if (loading) return null;

  if (registration) {
    return (
      <Notice type="succes">
        Vous êtes inscrit·e à cet événement. <Link href="/mon-compte?onglet=evenements" className="souligne-lien font-semibold">Gérer mes inscriptions</Link>
      </Notice>
    );
  }
  if (!event.registrationOpen) {
    return <Notice type="info">{event.status === "ANNULE" ? "Cet événement est annulé." : event.seatsLeft === 0 ? "Cet événement est complet." : "Les inscriptions sont closes."}</Notice>;
  }
  if (!user) {
    return (
      <div className="space-y-4">
        <p className="texte">Connectez-vous ou créez votre compte pour réserver votre place.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => openAuth("connexion")} className="btn-accent">Se connecter</button>
          <button type="button" onClick={() => openAuth("inscription")} className="btn-contour">Créer un compte</button>
        </div>
      </div>
    );
  }

  async function register(e) {
    e.preventDefault();
    setState({ status: "loading" });
    try {
      setRegistration(await api(`/events/${event.slug}/registrations`, { method: "POST", body: { message: message || null } }));
      setState({ status: "idle" });
    } catch (error) {
      setState({ status: "error", message: error.message });
    }
  }

  return (
    <form onSubmit={register} className="space-y-5">
      <Field label="Un mot pour l'équipe (facultatif)" name="message" as="textarea" maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Accompagnant, question..." />
      {state.status === "error" && <Notice type="erreur">{state.message}</Notice>}
      <button type="submit" className="btn-accent" disabled={state.status === "loading"}>
        {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        Je m&apos;inscris
      </button>
    </form>
  );
}
