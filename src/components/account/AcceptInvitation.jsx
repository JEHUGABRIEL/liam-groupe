"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";
import { sessionAction } from "@/lib/client";
import { formatDate } from "@/lib/format";

/** Lien reçu par e-mail : vérifie l'invitation puis crée le compte administrateur. */
export default function AcceptInvitation() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const { reload } = useAuth();
  const [invitation, setInvitation] = useState(undefined);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", password: "" });
  const [state, setState] = useState({ status: "idle", errors: {} });

  useEffect(() => {
    if (!token) {
      setInvitation(null);
      return;
    }
    sessionAction("invitation/preview", { token }).then(setInvitation).catch(() => setInvitation(null));
  }, [token]);

  if (invitation === undefined) return <Loader2 aria-label="Vérification" className="h-6 w-6 animate-spin text-attenue" />;
  if (invitation === null) {
    return <Notice type="erreur">Ce lien d&apos;invitation n&apos;est plus valide (déjà utilisé ou expiré). Demandez une nouvelle invitation à un administrateur.</Notice>;
  }

  const update = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      await sessionAction("invitation/accept", { token, ...form });
      await reload();
      router.replace("/admin");
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors });
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2">
        <h2 className="t-h4">Créer mon compte administrateur</h2>
        <p className="texte mt-3">
          Invitation de <strong>{invitation.invitedBy || "l'équipe"}</strong> pour <strong>{invitation.email}</strong>,
          valable jusqu&apos;au {formatDate(invitation.expiresAt)}.
        </p>
      </div>
      <Field label="Prénom" name="firstName" required value={form.firstName} onChange={update("firstName")} error={state.errors?.firstName} />
      <Field label="Nom" name="lastName" value={form.lastName} onChange={update("lastName")} error={state.errors?.lastName} />
      <Field label="Téléphone" name="phone" type="tel" className="sm:col-span-2" value={form.phone} onChange={update("phone")} error={state.errors?.phone} />
      <Field label="Mot de passe" name="password" type="password" autoComplete="new-password" required className="sm:col-span-2" value={form.password}
        onChange={update("password")} error={state.errors?.password} hint="8 caractères minimum, une lettre et un chiffre." />
      {state.status === "error" && <Notice type="erreur" className="sm:col-span-2">{state.message}</Notice>}
      <button type="submit" className="btn-accent sm:col-span-2" disabled={state.status === "loading"}>
        {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        Créer mon compte
      </button>
    </form>
  );
}
