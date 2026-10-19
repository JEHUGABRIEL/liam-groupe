"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Field from "@/components/ui/Field";
import Notice from "@/components/ui/Notice";

/** Formulaire de connexion (modale) ; onSwitch bascule vers l'inscription. */
export default function LoginForm({ onSuccess, onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ status: "idle", errors: {} });

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", errors: {} });
    try {
      await login(form);
      onSuccess?.();
    } catch (error) {
      setState({ status: "error", message: error.message, errors: error.errors });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <p className="texte text-[0.95rem]">
        Retrouvez vos commandes, votre abonnement G-Fitness, vos inscriptions et votre candidature.
      </p>
      <Field label="E-mail" name="email" id="connexion-email" type="email" autoComplete="email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} error={state.errors?.email} />
      <Field label="Mot de passe" name="password" id="connexion-mot-de-passe" type="password" autoComplete="current-password" required value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} error={state.errors?.password} />
      {state.status === "error" && <Notice type="erreur">{state.message}</Notice>}
      <button type="submit" className="btn-accent w-full" disabled={state.status === "loading"}>
        {state.status === "loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        Se connecter
      </button>
      <p className="border-t border-bordure pt-5 text-[0.92rem] text-encre/70">
        Pas encore de compte ?{" "}
        <button type="button" onClick={onSwitch} className="souligne-lien font-semibold text-encre">Créer un compte</button>
      </p>
    </form>
  );
}
