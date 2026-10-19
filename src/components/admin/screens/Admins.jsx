"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/admin/toast";
import { ActionButton, AdminPage, DataTable } from "@/components/admin/ui";
import { useResource } from "@/components/admin/useResource";
import Field from "@/components/ui/Field";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/format";

const dateTime = (value) => formatDate(value, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

function InviteForm({ onInvited }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ status: "idle", errors: {} });

  async function submit(event) {
    event.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      await api("/admin/invitations", { method: "POST", body: { email: email.trim() } });
      toast(`Invitation envoyée à ${email.trim()}`);
      setEmail("");
      setState({ status: "idle", errors: {} });
      onInvited();
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors || {} });
    }
  }

  return (
    <form onSubmit={submit} noValidate className="border border-bordure bg-white p-6 sm:p-8">
      <h2 className="t-h5">Inviter un administrateur</h2>
      <p className="texte mt-2 max-w-2xl">
        La personne reçoit un lien valable 72 heures pour créer son compte. Elle aura accès à tout le back-office.
      </p>
      <div className="mt-6 flex flex-wrap items-start gap-3">
        <Field
          label="E-mail"
          name="invitation-email"
          type="email"
          required
          className="min-w-[260px] flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={state.errors.email || (state.status === "error" && !state.errors.email ? state.message : undefined)}
        />
        <button type="submit" className="btn-sombre mt-[27px]" disabled={state.status === "loading" || !email.trim()}>
          {state.status === "loading" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Send aria-hidden="true" className="h-4 w-4" />}
          Envoyer l&apos;invitation
        </button>
      </div>
    </form>
  );
}

export default function Admins() {
  const invitations = useResource("/admin/invitations");

  const columns = [
    { key: "email", label: "Invité", render: (i) => <span className="font-medium">{i.email}</span> },
    { key: "invitedBy", label: "Invité par" },
    { key: "createdAt", label: "Envoyée le", className: "whitespace-nowrap", render: (i) => dateTime(i.createdAt) },
    { key: "expiresAt", label: "Expire le", className: "whitespace-nowrap", render: (i) => dateTime(i.expiresAt) },
    {
      key: "actions", label: "", className: "text-right", render: (i) => (
        <ActionButton action={() => api(`/admin/invitations/${i.id}`, { method: "DELETE" })} success="Invitation révoquée" onDone={invitations.reload} confirm={{ title: `Révoquer l'invitation de ${i.email} ?`, message: "Le lien reçu par e-mail ne fonctionnera plus.", label: "Révoquer" }}>
          Révoquer
        </ActionButton>
      ),
    },
  ];

  return (
    <AdminPage label="Équipe" title="Administrateurs" intro="Les comptes administrateurs sont créés uniquement sur invitation d'un membre de l'équipe.">
      <InviteForm onInvited={invitations.reload} />
      <h2 className="t-label-sm mb-4 mt-10 text-encre/55">Invitations en attente</h2>
      <DataTable columns={columns} resource={invitations} empty="Aucune invitation en attente." />
    </AdminPage>
  );
}
